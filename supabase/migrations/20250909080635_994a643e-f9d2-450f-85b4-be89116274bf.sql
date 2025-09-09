-- Create survey_responses table
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (for survey submissions)
CREATE POLICY "Public can submit survey responses" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (true);

-- Allow public reads (for displaying responses)
CREATE POLICY "Anyone can view survey responses" 
ON public.survey_responses 
FOR SELECT 
USING (true);

-- Create index for better performance when ordering by created_at
CREATE INDEX idx_survey_responses_created_at ON public.survey_responses(created_at DESC);