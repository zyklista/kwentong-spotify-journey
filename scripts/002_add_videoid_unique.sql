-- Migration: ensure unique constraint on video_id and set proper type
-- Run this in Supabase SQL editor or via psql

-- Ensure duration_seconds column exists (add if missing), or convert if present
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'youtube_videos' and column_name = 'duration_seconds'
  ) then
    execute 'alter table public.youtube_videos add column duration_seconds bigint';
  else
    -- attempt to alter type to bigint if possible; swallow errors to keep migration idempotent
    begin
      execute 'alter table public.youtube_videos alter column duration_seconds type bigint using (nullif(duration_seconds::text, '''')::bigint)';
    exception when others then
      raise notice 'Skipping alter column duration_seconds: %', SQLERRM;
    end;
  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_indexes where schemaname='public' and tablename='youtube_videos' and indexname='ux_youtube_videos_video_id'
  ) then
    execute 'create unique index ux_youtube_videos_video_id on public.youtube_videos (video_id)';
  end if;
end$$;

-- Optional: analyze for planner statistics (ANALYZE is safe inside transactions)
ANALYZE public.youtube_videos;
