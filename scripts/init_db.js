import { createClient } from '@supabase/supabase-js';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

// Connection string from supabase status
// Default local supabase credentials
const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function runMigration() {
    const sqlPath = path.join(process.cwd(), 'migrations', '20260207120000_create_esco_tables.sql');

    if (!fs.existsSync(sqlPath)) {
        console.error(`Migration file not found: ${sqlPath}`);
        return;
    }

    console.log(`Reading SQL from: ${sqlPath}`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const client = new Client({
        connectionString: CONNECTION_STRING,
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        await client.query(sql);
        console.log('Migration executed successfully.');

    } catch (err) {
        console.error('Error executing migration:', err);
    } finally {
        await client.end();
    }
}

runMigration();
