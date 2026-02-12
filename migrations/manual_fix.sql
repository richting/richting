-- COPY THIS ENTIRE CONTENT AND RUN IT IN SUPABASE SQL EDITOR

-- 1. Create the missing table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module TEXT NOT NULL,
  question_text TEXT NOT NULL,
  category TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Security
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read access (essential for onboarding)
CREATE POLICY "Public read access for assessment questions"
  ON assessment_questions FOR SELECT
  USING (true);

-- 4. Create other missing tables/columns if needed
CREATE TABLE IF NOT EXISTS daily_dilemmas_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  dilemma_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
  choice_id TEXT NOT NULL,
  impact_applied JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE daily_dilemmas_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dilemma log"
  ON daily_dilemmas_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dilemma log"
  ON daily_dilemmas_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ensure user_progress has the new column
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS current_module_state JSONB DEFAULT '{}'::jsonb;
