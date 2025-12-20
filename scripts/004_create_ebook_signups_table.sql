-- Create ebook_signups table
CREATE TABLE IF NOT EXISTS ebook_signups (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  list_type TEXT DEFAULT 'ebook',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_ebook_signups_email ON ebook_signups(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_ebook_signups_created_at ON ebook_signups(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ebook_signups ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for the edge function)
CREATE POLICY "Allow anonymous inserts" ON ebook_signups
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow service role to read all
CREATE POLICY "Allow service role to read all" ON ebook_signups
  FOR SELECT
  USING (auth.role() = 'service_role');
