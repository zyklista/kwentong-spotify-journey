-- Create a table for storing Spotify episodes metadata
CREATE TABLE IF NOT EXISTS public.spotify_episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spotify_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  duration_ms INTEGER,
  release_date DATE,
  thumbnail_url TEXT,
  spotify_url TEXT NOT NULL,
  external_urls JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for storing YouTube videos metadata
CREATE TABLE IF NOT EXISTS public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  thumbnail_url TEXT,
  youtube_url TEXT NOT NULL,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for sync status tracking
CREATE TABLE IF NOT EXISTS public.media_sync_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('spotify', 'youtube')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'in_progress', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(platform)
);

-- Enable Row Level Security
ALTER TABLE public.spotify_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_sync_status ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for viewing media)
CREATE POLICY "Anyone can view spotify episodes" 
ON public.spotify_episodes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view youtube videos" 
ON public.youtube_videos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view sync status" 
ON public.media_sync_status 
FOR SELECT 
USING (true);

-- Create policies for admin management (only admins can modify)
CREATE POLICY "Admins can manage spotify episodes" 
ON public.spotify_episodes 
FOR ALL 
USING (((auth.jwt() ->> 'email'::text) = ANY (ARRAY['info@diaryofanofw.com'::text, 'admin@diaryofanofw.com'::text])) OR ((auth.jwt() ->> 'user_role'::text) = 'admin'::text));

CREATE POLICY "Admins can manage youtube videos" 
ON public.youtube_videos 
FOR ALL 
USING (((auth.jwt() ->> 'email'::text) = ANY (ARRAY['info@diaryofanofw.com'::text, 'admin@diaryofanofw.com'::text])) OR ((auth.jwt() ->> 'user_role'::text) = 'admin'::text));

CREATE POLICY "Admins can manage sync status" 
ON public.media_sync_status 
FOR ALL 
USING (((auth.jwt() ->> 'email'::text) = ANY (ARRAY['info@diaryofanofw.com'::text, 'admin@diaryofanofw.com'::text])) OR ((auth.jwt() ->> 'user_role'::text) = 'admin'::text));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_spotify_episodes_updated_at
BEFORE UPDATE ON public.spotify_episodes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_youtube_videos_updated_at
BEFORE UPDATE ON public.youtube_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_sync_status_updated_at
BEFORE UPDATE ON public.media_sync_status
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial sync status records
INSERT INTO public.media_sync_status (platform, sync_status) 
VALUES 
  ('spotify', 'pending'),
  ('youtube', 'pending')
ON CONFLICT (platform) DO NOTHING;