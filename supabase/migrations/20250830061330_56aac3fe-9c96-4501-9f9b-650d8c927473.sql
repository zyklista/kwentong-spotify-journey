-- Set up automatic media sync scheduling using cron
-- This will sync media from Spotify and YouTube every hour

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule media sync to run every hour
SELECT cron.schedule(
  'hourly-media-sync',
  '0 * * * *', -- every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://vadhwoknebojprawjwmy.supabase.co/functions/v1/media-sync-scheduler',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZGh3b2tuZWJvanByYXdqd215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTg3NDYsImV4cCI6MjA3MjAzNDc0Nn0.h0i1rG_DCzVmUY7SOYoW-ecZhurgccx-eADd_1JZyuE"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  ) as request_id;
  $$
);