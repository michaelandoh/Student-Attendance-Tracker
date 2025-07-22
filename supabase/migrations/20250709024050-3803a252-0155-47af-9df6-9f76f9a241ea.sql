-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job to process class reminders every 15 minutes
-- This will call our edge function to create class reminder notifications
SELECT cron.schedule(
  'process-class-reminders',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT net.http_post(
    url := 'https://wtpsoiegeihhvqmrawcjg.supabase.co/functions/v1/process-class-reminders',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0cHNvaWVnZWlodnFtcmF3Y2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4MDcwMzEsImV4cCI6MjA2NjM4MzAzMX0.moI90EcV2mbBrIeuEUPVk8ZNsEm24Xl8LG1BIgbOJEU"}'::jsonb,
    body := '{"scheduled": true}'::jsonb
  );
  $$
);