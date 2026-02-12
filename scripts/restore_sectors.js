import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;
const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function restoreSectors() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();

        const createSql = fs.readFileSync(path.join(process.cwd(), 'migrations', 'create_sectors_table.sql'), 'utf8');
        const seedSql = fs.readFileSync(path.join(process.cwd(), 'migrations', 'seed_sectors.sql'), 'utf8');

        console.log('Restoring sectors table...');
        await client.query('DROP TABLE IF EXISTS sectors CASCADE');
        await client.query('ALTER TABLE careers DROP COLUMN IF EXISTS sector_id');
        await client.query(createSql);

        console.log('Seeding sectors data...');
        await client.query(seedSql);

        console.log('Sectors restored successfully.');
    } catch (err) {
        console.error('Error restoring sectors:', err);
    } finally {
        await client.end();
    }
}

restoreSectors();
