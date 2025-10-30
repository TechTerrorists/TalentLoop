-- Migration: Change skill score table from report_id to interview_id
-- This migration updates the skill score table to reference interview_id directly

-- Step 1: Add the new columns
ALTER TABLE "skill score" ADD COLUMN IF NOT EXISTS interview_id INTEGER;
ALTER TABLE "skill score" ADD COLUMN IF NOT EXISTS evidence TEXT;

-- Step 2: Populate interview_id from the Report table (for existing data)
UPDATE "skill score" ss
SET interview_id = r.interview_id
FROM "Report" r
WHERE ss.report_id = r._id
AND ss.interview_id IS NULL;

-- Step 3: Make interview_id NOT NULL (after data is populated)
ALTER TABLE "skill score" ALTER COLUMN interview_id SET NOT NULL;

-- Step 4: Drop the old foreign key constraint
ALTER TABLE "skill score" DROP CONSTRAINT IF EXISTS "skill score_report_id_fkey";

-- Step 5: Drop the old primary key
ALTER TABLE "skill score" DROP CONSTRAINT IF EXISTS "skill score_pkey";

-- Step 6: Drop the old report_id column
ALTER TABLE "skill score" DROP COLUMN IF EXISTS report_id;

-- Step 7: Add the new primary key and foreign key
ALTER TABLE "skill score" ADD PRIMARY KEY (skill, interview_id);
ALTER TABLE "skill score" ADD FOREIGN KEY (interview_id) REFERENCES interview(id);

-- Step 8: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
