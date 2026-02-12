import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;
const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function runMigration() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        const sql = fs.readFileSync(path.join(process.cwd(), 'migrations', 'create_user_matches.sql'), 'utf8');
        await client.query(sql);
        console.log('Migration executed successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
