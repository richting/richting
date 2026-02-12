import pg from 'pg';
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const { Client } = pg;
const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

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
        await onLine(line);
    }
}

async function importCareersDirect() {
    console.log('Starting careers import direct...');

    if (!fs.existsSync(OCCUPATION_FILE) || !fs.existsSync(INTERESTS_FILE)) {
        console.error('O*NET data files not found.');
        console.error('Checked Occupational:', OCCUPATION_FILE);
        console.error('Checked Interests:', INTERESTS_FILE);
        return;
    }

    // 1. Load Interests (RIASEC)
    console.log('Loading Interests data...');
    const interestsMap = new Map();
    const elementToLetter = {
        '1.B.1.a': 'R', '1.B.1.b': 'I', '1.B.1.c': 'A',
        '1.B.1.d': 'S', '1.B.1.e': 'E', '1.B.1.f': 'C'
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
            scores[elementToLetter[elementId]] = parseFloat((dataValue / 7.0).toFixed(4));
        }
    });
    console.log(`Loaded interests for ${interestsMap.size} occupations.`);

    // 2. Load Occupations
    const client = new Client({ connectionString: CONNECTION_STRING });

    try {
        await client.connect();

        console.log('Inserting careers...');
        let processed = 0;
        let batch = [];
        const BATCH_SIZE = 100;

        const flushBatch = async () => {
            if (batch.length === 0) return;

            const values = [];
            const placeholders = [];
            let paramIdx = 1;

            batch.forEach(row => {
                values.push(row.onet_soc_code, row.title, row.description, row.riasec_vector);
                placeholders.push(`($${paramIdx}, $${paramIdx + 1}, $${paramIdx + 2}, $${paramIdx + 3})`);
                paramIdx += 4;
            });

            const query = `
                INSERT INTO careers (onet_soc_code, title, description, riasec_vector)
                VALUES ${placeholders.join(', ')}
                ON CONFLICT (onet_soc_code) DO UPDATE SET
                    title = EXCLUDED.title,
                    description = EXCLUDED.description,
                    riasec_vector = EXCLUDED.riasec_vector;
            `;

            await client.query(query, values);
            processed += batch.length;
            process.stdout.write(`\rImported ${processed}`);
            batch = [];
        };

        await processFile(OCCUPATION_FILE, async (line) => {
            const cols = line.split('\t');
            if (cols.length < 3) return;

            const code = cols[0];
            const title = cols[1];
            const description = cols[2];
            const riasec = interestsMap.get(code) || { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

            batch.push({ onet_soc_code: code, title, description, riasec_vector: riasec });

            if (batch.length >= BATCH_SIZE) {
                await flushBatch();
            }
        });

        await flushBatch(); // final flush

        // I need to fix processFile to support async callback
    } catch (err) {
        console.error('Error importing careers:', err);
    } finally {
        await client.end();
    }
}

// Execute the import
importCareersDirect();
