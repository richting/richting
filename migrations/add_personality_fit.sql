-- Migration: Add personality_fit column to careers table
-- This column stores ideal Big Five personality profiles for each career

ALTER TABLE careers 
ADD COLUMN IF NOT EXISTS personality_fit JSONB;

-- The personality_fit structure should be:
-- {
--   "extraversion": <number from -10 to +10>,
--   "conscientiousness": <number from -10 to +10>,
--   "openness": <number from -10 to +10>,
--   "agreeableness": <number from -10 to +10>,
--   "stability": <number from -10 to +10>
-- }
