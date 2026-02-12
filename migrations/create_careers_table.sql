-- Create Careers Table (O*NET Data)
CREATE TABLE IF NOT EXISTS careers (
    onet_soc_code TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    riasec_vector JSONB,
    work_values TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Public Read)
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'careers' AND policyname = 'Public Read') THEN
        CREATE POLICY "Public Read" ON careers FOR SELECT USING (true);
    END IF;
END $$;
