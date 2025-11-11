-- Migration: add duration_seconds column to youtube_videos
-- Run this in Supabase SQL editor or via psql

alter table if exists public.youtube_videos
  add column if not exists duration_seconds bigint;

-- Optional: index for faster filtering
create index if not exists idx_youtube_videos_duration_seconds on public.youtube_videos(duration_seconds);
