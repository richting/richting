import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function disableRLS() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        await client.query('ALTER TABLE esco_occupations DISABLE ROW LEVEL SECURITY;');
        console.log('RLS disabled on esco_occupations.');
    } catch (err) {
        console.error('Error disabling RLS:', err);
    } finally {
        await client.end();
    }
}

disableRLS();
