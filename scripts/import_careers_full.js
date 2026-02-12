import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

// Manual .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) return;

        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            if (!line) return;
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    } catch (e) {
        console.warn('Failed to load .env file manually:', e);
    }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const OCCUPATION_FILE = path.join(process.cwd(), 'onet_data', 'db_29_1_text', 'Occupation Data.txt');
const INTERESTS_FILE = path.join(process.cwd(), 'onet_data', 'db_29_1_text', 'Interests.txt');

async function processFile(filePath, onLine) {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let isFirstLine = true;
    for await (const line of rl) {
        if (isFirstLine) {
            isFirstLine = false;
            continue;
        }
        onLine(line);
    }
}

async function main() {
    console.log('Starting full careers import...');

    // 1. Load Interests (RIASEC)
    console.log('Loading Interests data...');
    const interestsMap = new Map(); // code -> { R, I, A, S, E, C } (0-1)

    // Mapping Element ID to RIASEC letter
    const elementToLetter = {
        '1.B.1.a': 'R',
        '1.B.1.b': 'I',
        '1.B.1.c': 'A',
        '1.B.1.d': 'S',
        '1.B.1.e': 'E',
        '1.B.1.f': 'C'
    };

    await processFile(INTERESTS_FILE, (line) => {
        const cols = line.split('\t');
        if (cols.length < 5) return;

        const code = cols[0];
        const elementId = cols[1];
        const scaleId = cols[3];
        const dataValue = parseFloat(cols[4]);

        if (scaleId === 'OI' && elementToLetter[elementId]) {
            if (!interestsMap.has(code)) {
                interestsMap.set(code, { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
            }
            const scores = interestsMap.get(code);
            // Normalize 1-7 to 0-1.
            scores[elementToLetter[elementId]] = parseFloat((dataValue / 7.0).toFixed(4));
        }
    });
    console.log(`Loaded interests for ${interestsMap.size} occupations.`);

    // 2. Load Occupations and Merge
    console.log('Loading Occupations and preparing batch...');
    const careers = [];

    await processFile(OCCUPATION_FILE, (line) => {
        const cols = line.split('\t');
        if (cols.length < 3) return;

        const code = cols[0];
        const title = cols[1];
        const description = cols[2];

        // Retrieve RIASEC vector (default to 0s if missing)
        const riasec = interestsMap.get(code) || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

        careers.push({
            onet_soc_code: code,
            title: title,
            description: description,
            riasec_vector: riasec
        });
    });

    console.log(`Found ${careers.length} careers to import.`);

    // 3. Batch Upsert
    const BATCH_SIZE = 100;
    for (let i = 0; i < careers.length; i += BATCH_SIZE) {
        const batch = careers.slice(i, i + BATCH_SIZE);
        const { error } = await supabase
            .from('careers')
            .upsert(batch, { onConflict: 'onet_soc_code' });

        if (error) {
            console.error(`Error processing batch ${i / BATCH_SIZE + 1}:`, error);
        } else {
            process.stdout.write(`\rProcessed ${Math.min(i + BATCH_SIZE, careers.length)} / ${careers.length}`);
        }
    }

    console.log('\nImport complete!');
}

main().catch(console.error);
