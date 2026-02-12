import pg from 'pg';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const { Client } = pg;
const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const CSV_FILE_PATH = path.join(process.cwd(), 'database_modellen_ESCO_Onet', 'occupations_nl.csv');

async function importEscoDirect() {
    console.log(`Reading ESCO data from: ${CSV_FILE_PATH}`);
    if (!fs.existsSync(CSV_FILE_PATH)) {
        console.error(`File not found: ${CSV_FILE_PATH}`);
        return;
    }

    const fileContent = fs.readFileSync(CSV_FILE_PATH, 'utf8');
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
    const occupations = parsed.data;
    console.log(`Found ${occupations.length} occupations in CSV.`);

    const client = new Client({ connectionString: CONNECTION_STRING });

    try {
        await client.connect();

        let processed = 0;
        const batchSize = 100;

        for (let i = 0; i < occupations.length; i += batchSize) {
            const batch = occupations.slice(i, i + batchSize)
                .filter(row => row.conceptUri && row.iscoGroup && (row.conceptType === 'Occupation' || !row.conceptType))
                .map(row => ({
                    esco_uri: row.conceptUri,
                    code: row.iscoGroup,
                    title_nl: row.preferredLabel,
                    description_nl: row.description || '',
                    title_en: '',
                    updated_at: new Date()
                }));

            // Deduplicate batch by esco_uri
            const uniqueBatch = [];
            const seenUris = new Set();
            for (const item of batch) {
                if (!seenUris.has(item.esco_uri)) {
                    seenUris.add(item.esco_uri);
                    uniqueBatch.push(item);
                }
            }

            if (uniqueBatch.length === 0) continue;

            // Construct VALUES for bulk insert
            // ($1, $2, $3, $4, $5, $6), ($7, ...)
            const values = [];
            const placeholders = [];
            let paramIdx = 1;

            uniqueBatch.forEach(row => {
                values.push(row.esco_uri, row.code, row.title_nl, row.description_nl, row.title_en, row.updated_at);
                placeholders.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3}, $${paramIdx + 4}, $${paramIdx + 5})`);
                paramIdx += 6;
            });

            const query = `
                INSERT INTO esco_occupations (esco_uri, code, title_nl, description_nl, title_en, updated_at)
                VALUES ${placeholders.join(', ')}
                ON CONFLICT (esco_uri) DO UPDATE SET
                    code = EXCLUDED.code,
                    title_nl = EXCLUDED.title_nl,
                    description_nl = EXCLUDED.description_nl,
                    updated_at = EXCLUDED.updated_at;
            `;

            await client.query(query, values);
            processed += uniqueBatch.length;
            process.stdout.write(`\rImported ${processed} / ${occupations.length}`);
        }
        console.log('\nImport finished!');

    } catch (err) {
        console.error('Error importing data:', err);
    } finally {
        await client.end();
    }
}

importEscoDirect();
