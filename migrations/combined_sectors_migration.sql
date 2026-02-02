-- Combined Migration Script
-- Executes both create_sectors_table.sql and seed_sectors.sql
-- Date: 2026-02-01

-- ===== Part 1: Create Sectors Table =====

-- Create sectors table
CREATE TABLE IF NOT EXISTS sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_nl TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    onet_cluster_code TEXT,
    description TEXT NOT NULL,
    icon_emoji TEXT NOT NULL,
    color_gradient TEXT NOT NULL,
    
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
ADD COLUMN IF NOT EXISTS sector_id UUID REFERENCES sectors(id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_careers_sector ON careers(sector_id);

-- Enable Row Level Security
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read sectors (public data)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sectors' 
        AND policyname = 'Sectors are publicly readable'
    ) THEN
        CREATE POLICY "Sectors are publicly readable"
        ON sectors FOR SELECT
        USING (true);
    END IF;
END $$;

-- Add updated_at trigger for sectors
CREATE OR REPLACE FUNCTION update_sectors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sectors_updated_at ON sectors;
CREATE TRIGGER sectors_updated_at
BEFORE UPDATE ON sectors
FOR EACH ROW
EXECUTE FUNCTION update_sectors_updated_at();

-- ===== Part 2: Seed Sectors Data =====

-- Insert 16 O*NET sectors with RIASEC profiles
INSERT INTO sectors (name_nl, name_en, onet_cluster_code, description, icon_emoji, color_gradient, riasec_vector, personality_fit, work_values) VALUES

-- 1. Agriculture, Food & Natural Resources
('Landbouw & Natuur', 'Agriculture, Food & Natural Resources', '01', 
'Werk met planten, dieren, en natuurlijke hulpbronnen. Van bosbeheer tot landbouwproductie.',
'🌾', 'from-green-400 to-emerald-600',
'{"R": 0.85, "I": 0.55, "A": 0.30, "S": 0.40, "E": 0.50, "C": 0.60}',
'{"extraversion": -3, "conscientiousness": 6, "openness": 2, "agreeableness": 4, "stability": 5}',
ARRAY['independence', 'security', 'altruism']),

-- 2. Architecture & Construction
('Bouw & Constructie', 'Architecture & Construction', '02',
'Ontwerpen, plannen en bouwen van gebouwen en infrastructuur.',
'🏗️', 'from-orange-400 to-red-600',
'{"R": 0.90, "I": 0.65, "A": 0.45, "S": 0.35, "E": 0.50, "C": 0.70}',
'{"extraversion": 0, "conscientiousness": 8, "openness": 5, "agreeableness": 3, "stability": 6}',
ARRAY['achievement', 'security', 'independence']),

-- 3. Arts, Audio/Video Technology & Communications
('Kunst & Media', 'Arts, Audio/Video Technology & Communications', '03',
'Creatief werk in kunst, media, design en communicatie.',
'🎨', 'from-pink-400 to-purple-600',
'{"R": 0.35, "I": 0.50, "A": 0.95, "S": 0.45, "E": 0.65, "C": 0.40}',
'{"extraversion": 2, "conscientiousness": 4, "openness": 9, "agreeableness": 5, "stability": 3}',
ARRAY['creativity', 'autonomy', 'achievement']),

-- 4. Business Management & Administration
('Business & Management', 'Business Management & Administration', '04',
'Leiden en beheren van organisaties en bedrijfsprocessen.',
'💼', 'from-blue-500 to-indigo-600',
'{"R": 0.25, "I": 0.60, "A": 0.45, "S": 0.65, "E": 0.90, "C": 0.75}',
'{"extraversion": 6, "conscientiousness": 7, "openness": 5, "agreeableness": 4, "stability": 6}',
ARRAY['achievement', 'dynamic', 'team']),

-- 5. Education & Training
('Onderwijs & Training', 'Education & Training', '05',
'Lesgeven, trainen en ontwikkelen van mensen en hun vaardigheden.',
'📚', 'from-yellow-400 to-orange-500',
'{"R": 0.25, "I": 0.65, "A": 0.60, "S": 0.95, "E": 0.55, "C": 0.50}',
'{"extraversion": 5, "conscientiousness": 7, "openness": 6, "agreeableness": 8, "stability": 5}',
ARRAY['altruism', 'team', 'autonomy']),

-- 6. Finance
('Financiën & Administratie', 'Finance', '06',
'Beheren van financiële middelen, administratie en boekhoudkundige processen.',
'💰', 'from-emerald-500 to-teal-600',
'{"R": 0.20, "I": 0.70, "A": 0.30, "S": 0.40, "E": 0.55, "C": 0.95}',
'{"extraversion": 1, "conscientiousness": 9, "openness": 3, "agreeableness": 3, "stability": 7}',
ARRAY['security', 'achievement', 'autonomy']),

-- 7. Government & Public Administration
('Overheid & Publieke Diensten', 'Government & Public Administration', '07',
'Werken voor de overheid en publieke dienstverlening.',
'🏛️', 'from-slate-400 to-gray-600',
'{"R": 0.25, "I": 0.60, "A": 0.40, "S": 0.75, "E": 0.65, "C": 0.85}',
'{"extraversion": 3, "conscientiousness": 8, "openness": 4, "agreeableness": 7, "stability": 6}',
ARRAY['altruism', 'security', 'team']),

-- 8. Health Science
('Zorg & Welzijn', 'Health Science', '08',
'Gezondheidszorg, medische behandeling en welzijnswerk.',
'🏥', 'from-blue-400 to-cyan-600',
'{"R": 0.40, "I": 0.75, "A": 0.40, "S": 0.95, "E": 0.45, "C": 0.65}',
'{"extraversion": 4, "conscientiousness": 8, "openness": 5, "agreeableness": 9, "stability": 6}',
ARRAY['altruism', 'team', 'achievement']),

-- 9. Hospitality & Tourism
('Horeca & Toerisme', 'Hospitality & Tourism', '09',
'Gastvrijheid, toerisme, evenementen en recreatie.',
'🏨', 'from-amber-400 to-yellow-600',
'{"R": 0.35, "I": 0.35, "A": 0.50, "S": 0.80, "E": 0.85, "C": 0.60}',
'{"extraversion": 8, "conscientiousness": 6, "openness": 5, "agreeableness": 7, "stability": 5}',
ARRAY['team', 'dynamic', 'altruism']),

-- 10. Human Services
('Maatschappelijke Diensten', 'Human Services', '10',
'Sociale werk, begeleiding en gemeenschapsondersteuning.',
'🤝', 'from-rose-400 to-pink-600',
'{"R": 0.20, "I": 0.55, "A": 0.55, "S": 0.95, "E": 0.45, "C": 0.50}',
'{"extraversion": 4, "conscientiousness": 6, "openness": 6, "agreeableness": 9, "stability": 5}',
ARRAY['altruism', 'team', 'autonomy']),

-- 11. Information Technology
('IT & Data', 'Information Technology', '11',
'Technologie, software ontwikkeling, data-analyse en cybersecurity.',
'💻', 'from-indigo-500 to-purple-700',
'{"R": 0.40, "I": 0.95, "A": 0.50, "S": 0.30, "E": 0.40, "C": 0.75}',
'{"extraversion": -2, "conscientiousness": 7, "openness": 8, "agreeableness": 2, "stability": 5}',
ARRAY['autonomy', 'achievement', 'creativity']),

-- 12. Law, Public Safety, Corrections & Security
('Recht & Veiligheid', 'Law, Public Safety, Corrections & Security', '12',
'Rechtspraak, veiligheid, handhaving en correctionele diensten.',
'⚖️', 'from-gray-600 to-slate-800',
'{"R": 0.50, "I": 0.55, "A": 0.35, "S": 0.60, "E": 0.75, "C": 0.85}',
'{"extraversion": 2, "conscientiousness": 9, "openness": 3, "agreeableness": 4, "stability": 8}',
ARRAY['security', 'altruism', 'achievement']),

-- 13. Manufacturing
('Productie & Fabricage', 'Manufacturing', '13',
'Industriële productie, fabricage en kwaliteitscontrole.',
'🏭', 'from-zinc-500 to-gray-700',
'{"R": 0.90, "I": 0.60, "A": 0.30, "S": 0.35, "E": 0.45, "C": 0.80}',
'{"extraversion": -1, "conscientiousness": 8, "openness": 3, "agreeableness": 3, "stability": 6}',
ARRAY['security', 'achievement', 'independence']),

-- 14. Marketing, Sales & Service
('Marketing & Sales', 'Marketing, Sales & Service', '14',
'Marketing, verkoop en klantenservice.',
'📢', 'from-fuchsia-400 to-pink-600',
'{"R": 0.25, "I": 0.50, "A": 0.65, "S": 0.70, "E": 0.95, "C": 0.55}',
'{"extraversion": 8, "conscientiousness": 6, "openness": 6, "agreeableness": 6, "stability": 5}',
ARRAY['dynamic', 'achievement', 'team']),

-- 15. Science, Technology, Engineering & Mathematics (STEM)
('Wetenschap & Techniek', 'Science, Technology, Engineering & Mathematics', '15',
'Wetenschappelijk onderzoek, engineering en technische ontwikkeling.',
'🔬', 'from-cyan-500 to-blue-700',
'{"R": 0.75, "I": 0.95, "A": 0.40, "S": 0.30, "E": 0.45, "C": 0.70}',
'{"extraversion": -2, "conscientiousness": 8, "openness": 9, "agreeableness": 2, "stability": 6}',
ARRAY['achievement', 'autonomy', 'creativity']),

-- 16. Transportation, Distribution & Logistics
('Transport & Logistiek', 'Transportation, Distribution & Logistics', '16',
'Transport, distributie, supply chain en logistiek management.',
'🚚', 'from-orange-500 to-red-700',
'{"R": 0.80, "I": 0.50, "A": 0.30, "S": 0.45, "E": 0.65, "C": 0.75}',
'{"extraversion": 1, "conscientiousness": 8, "openness": 3, "agreeableness": 4, "stability": 7}',
ARRAY['security', 'dynamic', 'independence'])

ON CONFLICT (name_nl) DO NOTHING;

-- Update existing careers to link to sectors based on career_direction
DO $$
DECLARE
    sector_landbouw UUID;
    sector_bouw UUID;
    sector_kunst UUID;
    sector_business UUID;
    sector_onderwijs UUID;
    sector_finance UUID;
    sector_overheid UUID;
    sector_zorg UUID;
    sector_horeca UUID;
    sector_maatschappelijk UUID;
    sector_it UUID;
    sector_recht UUID;
    sector_productie UUID;
    sector_marketing UUID;
    sector_wetenschap UUID;
    sector_transport UUID;
BEGIN
    -- Get sector IDs for all 16 sectors
    SELECT id INTO sector_landbouw FROM sectors WHERE name_nl = 'Landbouw & Natuur';
    SELECT id INTO sector_bouw FROM sectors WHERE name_nl = 'Bouw & Constructie';
    SELECT id INTO sector_kunst FROM sectors WHERE name_nl = 'Kunst & Media';
    SELECT id INTO sector_business FROM sectors WHERE name_nl = 'Business & Management';
    SELECT id INTO sector_onderwijs FROM sectors WHERE name_nl = 'Onderwijs & Training';
    SELECT id INTO sector_finance FROM sectors WHERE name_nl = 'Financiën & Administratie';
    SELECT id INTO sector_overheid FROM sectors WHERE name_nl = 'Overheid & Publieke Diensten';
    SELECT id INTO sector_zorg FROM sectors WHERE name_nl = 'Zorg & Welzijn';
    SELECT id INTO sector_horeca FROM sectors WHERE name_nl = 'Horeca & Toerisme';
    SELECT id INTO sector_maatschappelijk FROM sectors WHERE name_nl = 'Maatschappelijke Diensten';
    SELECT id INTO sector_it FROM sectors WHERE name_nl = 'IT & Data';
    SELECT id INTO sector_recht FROM sectors WHERE name_nl = 'Recht & Veiligheid';
    SELECT id INTO sector_productie FROM sectors WHERE name_nl = 'Productie & Fabricage';
    SELECT id INTO sector_marketing FROM sectors WHERE name_nl = 'Marketing & Sales';
    SELECT id INTO sector_wetenschap FROM sectors WHERE name_nl = 'Wetenschap & Techniek';
    SELECT id INTO sector_transport FROM sectors WHERE name_nl = 'Transport & Logistiek';

    -- Update careers based on career_direction (now using new naming convention)
    UPDATE careers SET sector_id = sector_landbouw WHERE career_direction = 'Landbouw & Natuur' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_bouw WHERE career_direction = 'Bouw & Constructie' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_kunst WHERE career_direction = 'Kunst & Media' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_business WHERE career_direction = 'Business & Management' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_onderwijs WHERE career_direction = 'Onderwijs & Training' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_finance WHERE career_direction = 'Financiën & Administratie' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_overheid WHERE career_direction = 'Overheid & Publieke Diensten' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_zorg WHERE career_direction = 'Zorg & Welzijn' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_horeca WHERE career_direction = 'Horeca & Toerisme' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_maatschappelijk WHERE career_direction = 'Maatschappelijke Diensten' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_it WHERE career_direction = 'IT & Data' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_recht WHERE career_direction = 'Recht & Veiligheid' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_productie WHERE career_direction = 'Productie & Fabricage' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_marketing WHERE career_direction = 'Marketing & Sales' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_wetenschap WHERE career_direction = 'Wetenschap & Techniek' AND sector_id IS NULL;
    UPDATE careers SET sector_id = sector_transport WHERE career_direction = 'Transport & Logistiek' AND sector_id IS NULL;
    
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Sectors table created and seeded with 16 O*NET career clusters';
    RAISE NOTICE 'Careers linked to sectors based on career_direction';
    RAISE NOTICE 'All 16 sectors now have associated careers';
END $$;
