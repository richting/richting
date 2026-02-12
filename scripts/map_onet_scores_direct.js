import pg from 'pg';
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const { Client } = pg;
const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const CROSSWALK_FILE_PATH = path.join(process.cwd(), 'database_modellen_ESCO_Onet', 'ESCO_to_ONET-SOC.xlsx');

async function mapOnetDirect() {
    console.log(`Reading Crosswalk data from: ${CROSSWALK_FILE_PATH}`);
    if (!fs.existsSync(CROSSWALK_FILE_PATH)) return;

    // Read Excel
    const workbook = XLSX.readFile(CROSSWALK_FILE_PATH);
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 });

    const headerRowIndex = sheetData.findIndex(row =>
        row.some(cell => String(cell).includes('ESCO/ISCO Code') || String(cell).includes('O*NET-SOC 2019 Code'))
    );

    if (headerRowIndex === -1) {
        console.error('Header row not found');
        return;
    }

    const realHeaders = sheetData[headerRowIndex];
    const dataRows = sheetData.slice(headerRowIndex + 1);
    const iscoColIdx = realHeaders.findIndex(h => String(h).includes('ESCO/ISCO Code'));
    const onetColIdx = realHeaders.findIndex(h => String(h).includes('O*NET-SOC 2019 Code'));

    const iscoToOnet = new Map();
    dataRows.forEach(row => {
        const iscoCode = String(row[iscoColIdx] || '').trim();
        const onetCode = row[onetColIdx];
        if (iscoCode && onetCode && !iscoToOnet.has(iscoCode)) {
            iscoToOnet.set(iscoCode, onetCode);
        }
    });

    console.log(`Loaded mapping for ${iscoToOnet.size} ISCO codes.`);

    const client = new Client({ connectionString: CONNECTION_STRING });

    try {
        await client.connect();

        // Fetch all ESCO occupations
        console.log('Fetching ESCO occupations...');
        const res = await client.query('SELECT id, code FROM esco_occupations');
        const escoJobs = res.rows;
        console.log(`Found ${escoJobs.length} ESCO occupations.`);

        let updated = 0;

        // Prepare batch updates
        for (const job of escoJobs) {
            const iscoCode = String(job.code).trim();
            const targetOnetCode = iscoToOnet.get(iscoCode);

            if (targetOnetCode) {
                // Fetch career data (RIASEC)
                const careerRes = await client.query('SELECT riasec_vector, work_values FROM careers WHERE onet_soc_code = $1', [targetOnetCode]);

                if (careerRes.rows.length > 0) {
                    const career = careerRes.rows[0];
                    await client.query(`
                        UPDATE esco_occupations 
                        SET onet_source_code = $1, riasec_vector = $2, work_values = $3, updated_at = NOW()
                        WHERE id = $4
                    `, [targetOnetCode, career.riasec_vector, career.work_values, job.id]);
                    updated++;
                }
            }
        }

        console.log(`Updated ${updated} ESCO occupations with O*NET data.`);

    } catch (err) {
        console.error('Error mapping data:', err);
    } finally {
        await client.end();
    }
}

mapOnetDirect();
