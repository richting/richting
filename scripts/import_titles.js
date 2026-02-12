import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

// Manual .env parser since we can't install dotenv
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        console.log('Loading .env from:', envPath);

        if (!fs.existsSync(envPath)) {
            console.error('.env file missing!');
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        console.log('.env size:', envContent.length, 'bytes');

        envContent.split(/\r?\n/).forEach(line => {
            if (!line) return;
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                console.log('Found key:', key);
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

console.log('Credentials loaded:');
console.log('URL:', SUPABASE_URL ? 'FOUND' : 'MISSING');
console.log('KEY:', SUPABASE_KEY ? 'FOUND' : 'MISSING');

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const DATA_FILE = 'c:/Richting/onet_data/db_29_1_text/Alternate Titles.txt';

async function importTitles() {
    console.log(`Reading from ${DATA_FILE}...`);

    if (!fs.existsSync(DATA_FILE)) {
        console.error('File not found!');
        process.exit(1);
    }

    const fileStream = fs.createReadStream(DATA_FILE);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let headers = [];
    let batch = [];
    const BATCH_SIZE = 500;
    let totalImported = 0;
    let isHeader = true;

    for await (const line of rl) {
        if (isHeader) {
            // O*NET-SOC Code	Alternate Title	Short Title	Source(s)
            headers = line.split('\t');
            isHeader = false;
            continue;
        }

        const cols = line.split('\t');
        if (cols.length < 2) continue;

        const record = {
            onet_soc_code: cols[0],
            title: cols[1],
            short_title: cols[2] !== 'n/a' ? cols[2] : null,
            source: cols[3]
        };

        batch.push(record);

        if (batch.length >= BATCH_SIZE) {
            await insertBatch(batch);
            totalImported += batch.length;
            console.log(`Imported ${totalImported} titles...`);
            batch = [];
        }
    }

    if (batch.length > 0) {
        await insertBatch(batch);
        totalImported += batch.length;
    }

    console.log(`DONE! Total imported: ${totalImported}`);
}

async function insertBatch(rows) {
    const { error } = await supabase
        .from('job_titles')
        .insert(rows);

    if (error) {
        console.error('Error inserting batch:', error.message);
    }
}

importTitles().catch(console.error);
