-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for contact form submissions)
CREATE POLICY "Allow anonymous contact form submissions" ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to read their own submissions
CREATE POLICY "Allow users to read their own submissions" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

-- Create policy to allow service role full access (for admin)
CREATE POLICY "Allow service role full access" ON contact_submissions
  FOR ALL
  TO service_role
  USING (true);