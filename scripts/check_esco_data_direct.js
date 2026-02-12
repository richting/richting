import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function checkEscoDataDirect() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();

        const countRes = await client.query('SELECT COUNT(*) FROM esco_occupations');
        const count = countRes.rows[0].count;
        console.log(`Total ESCO Occupations: ${count}`);

        const mappedRes = await client.query('SELECT COUNT(*) FROM esco_occupations WHERE onet_source_code IS NOT NULL');
        const mappedCount = mappedRes.rows[0].count;
        const percentage = ((mappedCount / count) * 100).toFixed(1);
        console.log(`Mapped Occupations: ${mappedCount} (${percentage}%)`);

        const sampleRes = await client.query('SELECT title_nl, code, onet_source_code, riasec_vector FROM esco_occupations WHERE onet_source_code IS NOT NULL LIMIT 5');
        console.log('\n--- Mapped Sample ---');
        console.table(sampleRes.rows);

    } catch (err) {
        console.error('Error checking data:', err);
    } finally {
        await client.end();
    }
}

checkEscoDataDirect();
