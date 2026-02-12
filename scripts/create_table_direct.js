import pg from 'pg';
const { Client } = pg;

const CONNECTION_STRING = 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS esco_occupations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- ESCO Data
    esco_uri TEXT NOT NULL UNIQUE,       -- The unique URI from ESCO
    code TEXT NOT NULL,                  -- The ISCO-08 code
    title_nl TEXT NOT NULL,              -- Dutch Title
    description_nl TEXT,                 -- Dutch Description
    title_en TEXT,                       -- English Title (backup)
    
    -- Mapped O*NET Data (Psychometric Profiles)
    onet_source_code TEXT,               -- Which O*NET profile did we use?
    riasec_vector JSONB,                 -- Copied from O*NET
    work_values TEXT[],                  -- Copied from O*NET (top values)
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching by Dutch title
CREATE INDEX IF NOT EXISTS idx_esco_title_nl ON esco_occupations USING GIN (to_tsvector('dutch', title_nl));

-- Index for ISCO code (used for mapping)
CREATE INDEX IF NOT EXISTS idx_esco_code ON esco_occupations(code);

-- RLS: Public Read Access
ALTER TABLE esco_occupations ENABLE ROW LEVEL SECURITY;

-- Grant permissions (CRITICAL)
GRANT ALL ON TABLE esco_occupations TO anon, authenticated, service_role;
`;

async function createTable() {
    const client = new Client({ connectionString: CONNECTION_STRING });
    try {
        await client.connect();
        console.log('Connected to database.');

        await client.query(CREATE_TABLE_SQL);
        console.log('Table creation SQL executed.');

        await client.query("NOTIFY pgrst, 'reload config';");
        console.log('Reloaded schema cache.');

    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await client.end();
    }
}

createTable();
