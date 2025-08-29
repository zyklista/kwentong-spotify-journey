-- Create YouTube videos table
CREATE TABLE public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  duration TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Spotify episodes table
CREATE TABLE public.spotify_episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  duration_ms INTEGER,
  release_date TIMESTAMP WITH TIME ZONE NOT NULL,
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media sync status table
CREATE TABLE public.media_sync_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'in_progress', 'completed', 'failed')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (these are public data, so allow read access)
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spotify_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_sync_status ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "YouTube videos are publicly readable" 
ON public.youtube_videos 
FOR SELECT 
USING (true);

CREATE POLICY "Spotify episodes are publicly readable" 
ON public.spotify_episodes 
FOR SELECT 
USING (true);

CREATE POLICY "Media sync status is publicly readable" 
ON public.media_sync_status 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_youtube_videos_published_at ON public.youtube_videos(published_at DESC);
CREATE INDEX idx_spotify_episodes_release_date ON public.spotify_episodes(release_date DESC);
CREATE INDEX idx_media_sync_status_platform ON public.media_sync_status(platform);

-- Insert initial sync status records
INSERT INTO public.media_sync_status (platform, sync_status) VALUES 
('spotify', 'pending'),
('youtube', 'pending')
ON CONFLICT (platform) DO NOTHING;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_youtube_videos_updated_at
  BEFORE UPDATE ON public.youtube_videos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_spotify_episodes_updated_at
  BEFORE UPDATE ON public.spotify_episodes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_sync_status_updated_at
  BEFORE UPDATE ON public.media_sync_status
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();