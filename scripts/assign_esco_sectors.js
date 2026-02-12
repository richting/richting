import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

function cosineSimilarity(vecA, vecB) {
    const properties = ['R', 'I', 'A', 'S', 'E', 'C'];
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (const prop of properties) {
        const valA = vecA[prop] || 0;
        const valB = vecB[prop] || 0;
        dotProduct += valA * valB;
        magnitudeA += valA * valA;
        magnitudeB += valB * valB;
    }

    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

async function assignSectors() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();

        // 1. Fetch all Sectors
        console.log('Fetching sectors...');
        const sectorRes = await client.query('SELECT id, name_nl, riasec_vector FROM sectors');
        const sectors = sectorRes.rows;
        console.log(`Loaded ${sectors.length} sectors.`);

        // 2. Fetch all ESCO Occupations with RIASEC scores
        console.log('Fetching ESCO occupations with RIASEC scores...');
        const jobRes = await client.query('SELECT id, title_nl, riasec_vector FROM esco_occupations WHERE riasec_vector IS NOT NULL');
        const jobs = jobRes.rows;
        console.log(`Loaded ${jobs.length} mappable occupations.`);

        let updated = 0;

        // 3. Find Best Match for each Job
        for (const job of jobs) {
            let bestSectorId = null;
            let bestScore = -1;

            for (const sector of sectors) {
                const score = cosineSimilarity(job.riasec_vector, sector.riasec_vector);
                if (score > bestScore) {
                    bestScore = score;
                    bestSectorId = sector.id;
                }
            }

            if (bestSectorId) {
                await client.query('UPDATE esco_occupations SET sector_id = $1 WHERE id = $2', [bestSectorId, job.id]);
                updated++;
                if (updated % 100 === 0) process.stdout.write(`\rUpdated ${updated}/${jobs.length}`);
            }
        }

        console.log(`\nSuccessfully assigned sectors to ${updated} occupations.`);

    } catch (err) {
        console.error('Error assigning sectors:', err);
    } finally {
        await client.end();
    }
}

assignSectors();
