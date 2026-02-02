-- Add daily swipe tracking to user_progress table
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS daily_swipes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_swipe_date DATE;

-- Add comment for documentation
COMMENT ON COLUMN user_progress.daily_swipes IS 'Number of activity swipes completed today';
COMMENT ON COLUMN user_progress.last_swipe_date IS 'Date of last swipe (YYYY-MM-DD)';
