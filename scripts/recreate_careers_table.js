import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS careers (
    onet_soc_code TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    riasec_vector JSONB,
    work_values JSONB, -- Storing as JSONB to be safe, or TEXT[]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE careers TO anon, authenticated, service_role;
CREATE POLICY "Public read careers" ON careers FOR SELECT USING (true);
`;

async function recreateCareers() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        await client.query(CREATE_TABLE_SQL);
        console.log('Created careers table.');
        await client.query("NOTIFY pgrst, 'reload config';");
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await client.end();
    }
}

recreateCareers();
