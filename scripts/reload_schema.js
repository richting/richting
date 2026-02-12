import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function reloadSchema() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        await client.query("NOTIFY pgrst, 'reload config';");
        console.log("Sent NOTIFY pgrst, 'reload config';");
    } catch (err) {
        console.error('Error reloading schema:', err);
    } finally {
        await client.end();
    }
}

reloadSchema();
