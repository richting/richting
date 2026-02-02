-- Migration: Create sectors table for O*NET Career Clusters
-- Date: 2026-02-01
-- Purpose: Store career sectors/clusters for sector-based matching

-- Create sectors table
CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_nl TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    onet_cluster_code TEXT,
    description TEXT NOT NULL,
    icon_emoji TEXT NOT NULL,
    color_gradient TEXT NOT NULL, -- Tailwind gradient classes
    
    -- Average RIASEC profile for this sector
    riasec_vector JSONB NOT NULL,
    
    -- Average personality fit
    personality_fit JSONB,
    
    -- Dominant work values
    work_values TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add sector_id to careers table
ALTER TABLE careers
ADD COLUMN sector_id UUID REFERENCES sectors(id);

-- Create index for performance
CREATE INDEX idx_careers_sector ON careers(sector_id);

-- Enable Row Level Security
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read sectors (public data)
CREATE POLICY "Sectors are publicly readable"
ON sectors FOR SELECT
USING (true);

-- Add updated_at trigger for sectors
CREATE OR REPLACE FUNCTION update_sectors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sectors_updated_at
BEFORE UPDATE ON sectors
FOR EACH ROW
EXECUTE FUNCTION update_sectors_updated_at();
