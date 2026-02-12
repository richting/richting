import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

async function grantPermissions() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        await client.query(`
            GRANT ALL ON TABLE esco_occupations TO anon, authenticated, service_role;
            GRANT ALL ON SEQUENCE esco_occupations_id_seq TO anon, authenticated, service_role; -- If serial, but it is UUID so maybe not needed, but good practice if I used serial.
        `);
        console.log("Granted permissions on esco_occupations to anon, authenticated, service_role.");
        await client.query("NOTIFY pgrst, 'reload config';");
        console.log("Reloaded schema cache.");
    } catch (err) {
        console.error('Error granting permissions:', err);
    } finally {
        await client.end();
    }
}

grantPermissions();
