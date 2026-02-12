
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

// Helper: Calculate Euclidean distance between two RIASEC vectors
function calculateDistance(vecA, vecB) {
    if (!vecA || !vecB) return Infinity;
    // Vectors are objects { R: val, I: val, ... } or arrays. Assuming objects based on previous scripts.
    // If they are missing keys, treat as 0? Or assume valid?
    // Let's assume valid objects with UpperCase keys.

    const traits = ['R', 'I', 'A', 'S', 'E', 'C'];
    let sumSq = 0;
    for (const trait of traits) {
        const valA = vecA[trait] || 0;
        const valB = vecB[trait] || 0;
        sumSq += Math.pow(valA - valB, 2);
    }
    return Math.sqrt(sumSq);
}

async function assignSectors() {
    console.log('--- Assigning Sectors to Jobs ---');

    // 1. Fetch all Sectors
    const { data: sectors, error: sErr } = await supabase.from('sectors').select('id, name_nl, riasec_vector');
    if (sErr) {
        console.error('Error fetching sectors:', sErr);
        return;
    }
    console.log(`Loaded ${sectors.length} sectors.`);

    // 2. Fetch Unassigned ESCO Occupations (limit to 1000 at a time to be safe, or just paginate)
    // We only want jobs that HAVE scores but NO sector.
    const batchSize = 500;
    let totalUpdated = 0;

    // We'll loop until no more unassigned jobs are found
    while (true) {
        const { data: jobs, error: jErr } = await supabase
            .from('esco_occupations')
            .select('id, title_nl, riasec_vector, esco_uri, code')
            .not('riasec_vector', 'is', null) // Must have scores to map
            .is('sector_id', null)           // Only unassigned
            .range(0, batchSize - 1);

        if (jErr) {
            console.error('Error fetching jobs:', jErr);
            break;
        }

        if (!jobs || jobs.length === 0) {
            console.log('No more unassigned jobs found.');
            break;
        }

        console.log(`Processing batch of ${jobs.length} jobs...`);

        const updates = [];

        for (const job of jobs) {
            let bestSector = null;
            let minDist = Infinity;

            // Find closest sector
            for (const sector of sectors) {
                const dist = calculateDistance(job.riasec_vector, sector.riasec_vector);
                if (dist < minDist) {
                    minDist = dist;
                    bestSector = sector;
                }
            }

            if (bestSector) {
                updates.push({
                    id: job.id,
                    esco_uri: job.esco_uri,   // Required for UPSERT
                    code: job.code,           // Required for UPSERT
                    title_nl: job.title_nl,   // Required for UPSERT
                    sector_id: bestSector.id,
                    updated_at: new Date()
                });
            }
        }

        if (updates.length > 0) {
            // Deduplicate updates by ID just in case
            const uniqueUpdates = Array.from(new Map(updates.map(item => [item.id, item])).values());

            const { error: uErr } = await supabase
                .from('esco_occupations')
                .upsert(uniqueUpdates); // Using upsert to update

            if (uErr) {
                console.error('Error updating batch:', uErr);
            } else {
                console.log(`Assigned sectors to ${uniqueUpdates.length} jobs.`);
                totalUpdated += uniqueUpdates.length;
            }
        }
    }

    console.log(`Total jobs updated: ${totalUpdated}`);
}

assignSectors().catch(console.error);
