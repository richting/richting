-- Create user_matches table to store calculated recommendations
CREATE TABLE IF NOT EXISTS user_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Link to ESCO occupation
    esco_occupation_id UUID REFERENCES esco_occupations(id),
    
    -- Match score (0.0 to 1.0)
    match_score FLOAT NOT NULL,
    
    -- Component scores
    riasec_match FLOAT,
    personality_match FLOAT,
    value_match FLOAT,
    
    -- Snapshot of algorithm version or date
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, esco_occupation_id)
);

-- Enable RLS
ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can insert their own matches"
ON user_matches FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own matches"
ON user_matches FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own matches"
ON user_matches FOR UPDATE
USING (auth.uid() = user_id);
