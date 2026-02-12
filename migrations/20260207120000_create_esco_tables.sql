-- Migration: Create ESCO Occupations Table
-- Description: Creates the table for storing ESCO occupations and their mapping to O*NET data.

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

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'esco_occupations' 
        AND policyname = 'ESCO Occupations are publicly readable'
    ) THEN
        CREATE POLICY "ESCO Occupations are publicly readable"
        ON esco_occupations FOR SELECT
        USING (true);
    END IF;
END $$;
