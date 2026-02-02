-- Migration: Add personality_vector to user_progress
-- Description: Add the missing personality_vector column to user_progress table
-- This allows storing Big Five personality scores from the personality quiz

ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS personality_vector JSONB;

-- Comment for documentation
COMMENT ON COLUMN user_progress.personality_vector IS 'Stores Big Five personality scores: {extraversion, conscientiousness, openness, agreeableness, stability}';
