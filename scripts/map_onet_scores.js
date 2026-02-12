import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

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

const CROSSWALK_FILE_PATH = path.join(process.cwd(), 'database_modellen_ESCO_Onet', 'ESCO_to_ONET-SOC.xlsx');

async function mapOnetScores() {
    console.log(`Reading Crosswalk data from: ${CROSSWALK_FILE_PATH}`);

    if (!fs.existsSync(CROSSWALK_FILE_PATH)) {
        console.error(`File not found: ${CROSSWALK_FILE_PATH}`);
        return;
    }

    // 1. Read Excel Crosswalk (with dynamic header finding)
    const workbook = XLSX.readFile(CROSSWALK_FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Read as array of arrays to find header row
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Find header row (row containing 'ESCO/ISCO Code' and 'O*NET-SOC 2019 Code')
    const headerRowIndex = sheetData.findIndex(row =>
        row.some(cell => String(cell).includes('ESCO/ISCO Code') || String(cell).includes('O*NET-SOC 2019 Code'))
    );

    if (headerRowIndex === -1) {
        console.error('Could not find header row in Crosswalk file.');
        return;
    }

    console.log(`Found header row at index ${headerRowIndex}:`, sheetData[headerRowIndex]);

    // Extract headers and data
    const realHeaders = sheetData[headerRowIndex];
    const dataRows = sheetData.slice(headerRowIndex + 1);

    // Map: ISCO-08 (from DB) -> O*NET SOC (from Crosswalk)
    const iscoToOnet = new Map();

    // Identify column indices
    const iscoColIdx = realHeaders.findIndex(h => String(h).includes('ESCO/ISCO Code'));
    const onetColIdx = realHeaders.findIndex(h => String(h).includes('O*NET-SOC 2019 Code'));

    if (iscoColIdx === -1 || onetColIdx === -1) {
        console.error('Could not find required columns in Crosswalk.');
        return;
    }

    dataRows.forEach(row => {
        const iscoCode = row[iscoColIdx];
        const onetCode = row[onetColIdx];

        if (iscoCode && onetCode) {
            // Normalize ISCO code (sometimes string, sometimes number)
            const iscoStr = String(iscoCode).trim();
            if (!iscoToOnet.has(iscoStr)) {
                iscoToOnet.set(String(iscoStr), onetCode);
            }
        }
    });

    console.log(`Loaded mapping for ${iscoToOnet.size} ISCO codes.`);

    await performMapping(iscoToOnet);
}

async function performMapping(escoToOnetMap) {
    // 2. Fetch all ESCO occupations
    const { count } = await supabase.from('esco_occupations').select('*', { count: 'exact', head: true });
    console.log(`Total ESCO occupations to check: ${count}`);

    const batchSize = 500;
    const totalBatches = Math.ceil(count / batchSize);

    for (let b = 0; b < totalBatches; b++) {
        const { data: escoBatch, error } = await supabase
            .from('esco_occupations')
            .select('id, code, esco_uri, title_nl, onet_source_code') // Include ALL NOT NULL cols
            .order('id', { ascending: true })
            .range(b * batchSize, (b * batchSize) + batchSize - 1);

        if (error) {
            console.error('Error fetching ESCO batch:', error);
            continue;
        }

        const updates = [];

        for (const escoJob of escoBatch) {
            // Map via ISCO-08 Code
            const targetOnetCode = escoToOnetMap.get(String(escoJob.code));

            if (targetOnetCode) {
                // Fetch RIASEC from 'careers'
                const { data: onetCareer } = await supabase
                    .from('careers')
                    .select('riasec_vector, work_values')
                    .eq('onet_soc_code', targetOnetCode)
                    .single();

                if (onetCareer) {
                    updates.push({
                        id: escoJob.id,
                        esco_uri: escoJob.esco_uri,
                        code: escoJob.code,          // Required NOT NULL
                        title_nl: escoJob.title_nl,  // Required NOT NULL
                        onet_source_code: targetOnetCode,
                        riasec_vector: onetCareer.riasec_vector,
                        work_values: onetCareer.work_values,
                        updated_at: new Date()
                    });
                }
            }
        }

        if (updates.length > 0) {
            // Deduplicate updates by ID to prevent 21000 error
            const uniqueUpdates = Array.from(new Map(updates.map(item => [item.id, item])).values());

            const { error: updateError } = await supabase
                .from('esco_occupations')
                .upsert(uniqueUpdates);

            if (updateError) console.error('Error updating ESCO batch:', updateError);
            else console.log(`Updated ${updates.length} records in batch ${b + 1}`);
        }
    }

    console.log('Mapping complete!');
}

mapOnetScores().catch(console.error);
