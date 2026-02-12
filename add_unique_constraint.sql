-- 1. Remove duplicates first (keeping the one with the highest ID from the pair)
-- self-join: delete 'a' if there exists a 'b' with same code but higher ID
DELETE FROM careers a USING careers b
WHERE a.id < b.id AND a.onet_soc_code = b.onet_soc_code;

-- 2. Safely add unique constraint to careers.onet_soc_code if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'careers_onet_soc_code_key'
    ) THEN
        ALTER TABLE careers 
        ADD CONSTRAINT careers_onet_soc_code_key UNIQUE (onet_soc_code);
    END IF;
END
$$;
