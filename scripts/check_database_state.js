import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        console.log(`Loading .env from: ${envPath}`);

        if (!fs.existsSync(envPath)) {
            console.error('CRITICAL: .env file not found!');
            return;
        }

        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach(line => {
            if (!line) return;
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, '');
                if (!process.env[key]) {
                    process.env[key] = value;
                    console.log(`Loaded key: ${key}`);
                }
            }
        });
    } catch (e) {
        console.error('Failed to load .env file:', e);
    }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('ERROR: Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    console.log('--- Checking Database State ---');
    console.log(`URL: ${SUPABASE_URL}`);

    // Check Sectors
    const { count: sectorsCount, error: sErr } = await supabase.from('sectors').select('*', { count: 'exact', head: true });
    if (sErr) console.error('Error checking sectors:', sErr.message);
    else console.log(`Sectors Count: ${sectorsCount}`);

    // Check Careers
    const { count: careersCount, error: cErr } = await supabase.from('careers').select('*', { count: 'exact', head: true });
    if (cErr) console.error('Error checking careers:', cErr.message);
    else console.log(`Careers Count: ${careersCount}`);

    // Check ESCO Occupations
    const { count: escoCount, error: eErr } = await supabase.from('esco_occupations').select('*', { count: 'exact', head: true });
    if (eErr) console.error('Error checking esco_occupations:', eErr.message);
    else console.log(`ESCO Occupations Count: ${escoCount}`);

    // Check Scores
    if (escoCount > 0) {
        const { count: scoredCount } = await supabase.from('esco_occupations').select('*', { count: 'exact', head: true }).not('riasec_vector', 'is', null);
        console.log(`ESCO Occupations with Scores: ${scoredCount}`);
    }

    console.log('-------------------------------');
}

check().catch(console.error);
