import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function checkColumns() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        const tables = ['careers', 'esco_occupations', 'sectors'];
        for (const table of tables) {
            const res = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1;
            `, [table]);
            console.log(`\nColumns in ${table}:`);
            console.table(res.rows);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

checkColumns();
