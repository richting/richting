import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse'; // User might need to install this: npm install papaparse

// Manual .env parser (reused from your other scripts)
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
                if (!process.env[key]) process.env[key] = value;
            }
        });
    } catch (e) { console.warn('Failed to load .env file manually:', e); }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CONFIGURATION
const CSV_FILE_PATH = path.join(process.cwd(), 'database_modellen_ESCO_Onet', 'occupations_nl.csv');

async function importEscoData() {
    console.log(`Reading ESCO data from: ${CSV_FILE_PATH}`);

    if (!fs.existsSync(CSV_FILE_PATH)) {
        console.error(`File not found: ${CSV_FILE_PATH}`);
        return;
    }

    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf8');

    Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
            const occupations = results.data;
            console.log(`Found ${occupations.length} occupations in CSV.`);

            const batchSize = 100;
            let processed = 0;

            for (let i = 0; i < occupations.length; i += batchSize) {
                // Filter and map in one step to ensure 'row' context for filtering
                const batch = occupations.slice(i, i + batchSize)
                    .filter(row => row.conceptUri && row.iscoGroup && (row.conceptType === 'Occupation' || !row.conceptType))
                    .map(row => ({
                        esco_uri: row.conceptUri,
                        code: row.iscoGroup,
                        title_nl: row.preferredLabel,
                        description_nl: row.description || '',
                        title_en: '', // EN title not in this CSV, ignoring
                        updated_at: new Date()
                    }));

                if (batch.length === 0) continue;

                // Deduplicate batch by esco_uri to prevent 21000 error
                const uniqueBatch = Array.from(new Map(batch.map(item => [item.esco_uri, item])).values());


                const { error } = await supabase
                    .from('esco_occupations')
                    .upsert(uniqueBatch, { onConflict: 'esco_uri' });

                if (error) {
                    console.error('Error upserting batch:', error);
                } else {
                    processed += batch.length;
                    process.stdout.write(`\rImported ${processed} / ${occupations.length}`);
                }
            }

            console.log('\nImport finished!');
        }
    });
}

importEscoData().catch(console.error);
