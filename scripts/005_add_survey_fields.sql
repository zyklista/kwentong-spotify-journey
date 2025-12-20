-- Add additional fields to survey_responses table for interview-related questions
ALTER TABLE survey_responses
ADD COLUMN IF NOT EXISTS interview_experience TEXT,
ADD COLUMN IF NOT EXISTS interview_suggestions TEXT,
ADD COLUMN IF NOT EXISTS interview_favorite TEXT;

-- Add comment to document the table
COMMENT ON TABLE survey_responses IS 'Stores survey responses from users including feedback and interview experiences';