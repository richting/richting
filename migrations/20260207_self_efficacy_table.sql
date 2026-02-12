-- Create self_efficacy table for SCCT Scanner results
-- Stores user confidence levels in various skills

CREATE TABLE IF NOT EXISTS self_efficacy (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    skills JSONB NOT NULL, -- { "Programming": 8, "Design": 6, ... }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_self_efficacy_user_id ON self_efficacy(user_id);

-- Enable RLS
ALTER TABLE self_efficacy ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own self-efficacy"
    ON self_efficacy FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own self-efficacy"
    ON self_efficacy FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own self-efficacy"
    ON self_efficacy FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add self_efficacy_completed to user_profiles.progress if not exists
DO $$
BEGIN
    -- Add column to track if SCCT is completed
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'user_profiles'
        AND column_name = 'scct_completed'
    ) THEN
        ALTER TABLE user_profiles ADD COLUMN scct_completed BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Comment for documentation
COMMENT ON TABLE self_efficacy IS 'Stores SCCT self-efficacy assessment results - user confidence in various skills';
COMMENT ON COLUMN self_efficacy.skills IS 'JSON object mapping skill names to confidence levels (1-10)';
