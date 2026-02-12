-- Migration: Create Assessment Content & Progress Tables
-- Description: Standardizes tables for the new assessment modules (RIASEC, Big5, Work Values, SCCT, Dilemmas)

-- =====================================================
-- 1. ASSESSMENT CONTENT TABLE (Generic)
-- =====================================================
-- Stores all static data: Questions, Swipe Cards, Values, Dilemmas
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module TEXT NOT NULL, -- 'riasec', 'big5', 'work_values', 'scct', 'dilemma'
  question_text TEXT NOT NULL,
  category TEXT, -- 'Realistic', 'Openness', etc.
  metadata JSONB DEFAULT '{}'::jsonb, -- Stores images, impacts, choices, etc.
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read questions (public content)
CREATE POLICY "Public read access for assessment questions"
  ON assessment_questions FOR SELECT
  USING (true);

-- =====================================================
-- 2. DAILY DILEMMA LOG
-- =====================================================
-- Tracks which dilemmas a user has completed
CREATE TABLE IF NOT EXISTS daily_dilemmas_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  dilemma_id UUID REFERENCES assessment_questions(id) ON DELETE CASCADE,
  choice_id TEXT NOT NULL, -- The option chosen (A, B, C, D)
  impact_applied JSONB, -- Snapshot of score changes applied
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE daily_dilemmas_log ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own dilemma log"
  ON daily_dilemmas_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dilemma log"
  ON daily_dilemmas_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 3. UPDATE USER VALUES TABLE
-- =====================================================
-- Aligning user_values with the new Work Values model
-- New model: Achievement, Independence, Recognition, Relationships, Support, Working Conditions

ALTER TABLE user_values
ADD COLUMN IF NOT EXISTS achievement INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS independence INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS recognition INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS relationships INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS support INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS working_conditions INTEGER DEFAULT 5;

-- (Optional) If we want to drop old columns later, we can, but keeping them for safety for now.
-- Old columns: security, creativity, autonomy, team, dynamic, impact

-- =====================================================
-- 4. UPDATE USER PROGRESS
-- =====================================================
-- Ensure we can track detailed progress
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS current_module_state JSONB DEFAULT '{}'::jsonb;
-- This JSONB can store things like: { riasec_swipe_count: 15, big5_question_index: 3 }

