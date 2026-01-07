-- Create errors table for error log functionality
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS errors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  what_went_wrong TEXT NOT NULL,
  why TEXT,
  fix TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_errors_date ON errors(date DESC);

-- Enable Row Level Security (optional, adjust based on your auth setup)
ALTER TABLE errors ENABLE ROW LEVEL SECURITY;

-- Example policy: Allow all operations (adjust based on your needs)
-- You may want to restrict this to authenticated users only
CREATE POLICY "Allow all operations on errors" ON errors
  FOR ALL
  USING (true)
  WITH CHECK (true);
