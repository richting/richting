
-- Add sector_id column to esco_occupations if it doesn't exist
ALTER TABLE esco_occupations 
ADD COLUMN IF NOT EXISTS sector_id UUID REFERENCES sectors(id);

-- Optional: Create an index for performance
CREATE INDEX IF NOT EXISTS idx_esco_occupations_sector_id ON esco_occupations(sector_id);
