import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
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

async function checkEscoData() {
    console.log('Verifying ESCO Data Integrity...\n');

    // 1. Check Total Count
    const { count, error: countError } = await supabase
        .from('esco_occupations')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting rows:', countError.message);
        return;
    }
    console.log(`Total ESCO Occupations: ${count}`);

    // 2. Check Mapped Data (Psychometric Profiles)
    const { count: mappedCount, error: mappedError } = await supabase
        .from('esco_occupations')
        .select('*', { count: 'exact', head: true })
        .not('riasec_vector', 'is', null);

    if (mappedError) {
        console.error('Error counting mapped rows:', mappedError.message);
    } else {
        console.log(`Mapped Occupations (with RIASEC): ${mappedCount} (${((mappedCount / count) * 100).toFixed(1)}%)`);
    }

    // 3. Random Sample Check
    console.log('\n--- Random Sample Inspection ---');
    const { data: randomSample, error: sampleError } = await supabase
        .from('esco_occupations')
        .select('title_nl, code, onet_source_code, riasec_vector')
        .limit(5);

    if (sampleError) {
        console.error('Error fetching sample:', sampleError.message);
    } else {
        randomSample.forEach(job => {
            console.log(`\nJob: ${job.title_nl} (ISCO: ${job.code})`);
            console.log(`Mapped from O*NET: ${job.onet_source_code || 'N/A'}`);
            console.log(`RIASEC: ${job.riasec_vector ? JSON.stringify(job.riasec_vector) : 'N/A'}`);
        });
    }
    
    console.log('\nVerification complete.');
}

checkEscoData().catch(console.error);
