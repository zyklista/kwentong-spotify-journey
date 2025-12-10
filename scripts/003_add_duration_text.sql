-- Migration: add duration_text column for human-readable duration format
-- Run this in Supabase SQL editor or via psql

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'youtube_videos' and column_name = 'duration_text'
  ) then
    execute 'alter table public.youtube_videos add column duration_text text';
    raise notice 'Added duration_text column to youtube_videos table';
  else
    raise notice 'duration_text column already exists';
  end if;
end$$;