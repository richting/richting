import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function listTables() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log('Tables in public schema:');
        console.table(res.rows);
    } catch (err) {
        console.error('Error listing tables:', err);
    } finally {
        await client.end();
    }
}

listTables();
