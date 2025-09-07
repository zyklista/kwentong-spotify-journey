-- Create tables for e-book signups and contact forms
CREATE TABLE public.ebook_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tables for media content
CREATE TABLE public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  duration TEXT,
  view_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.spotify_episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  external_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media sync status table
CREATE TABLE public.media_sync_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL, -- 'youtube' or 'spotify'
  status TEXT NOT NULL, -- 'idle', 'in_progress', 'completed', 'failed'
  last_sync TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(platform)
);

-- Insert initial sync status records
INSERT INTO public.media_sync_status (platform, status) VALUES 
('youtube', 'idle'),
('spotify', 'idle');

-- Enable Row Level Security
ALTER TABLE public.ebook_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spotify_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_sync_status ENABLE ROW LEVEL SECURITY;

-- Create policies for public form submissions
CREATE POLICY "Public can submit ebook signups" 
ON public.ebook_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policies for public viewing of media content
CREATE POLICY "Anyone can view YouTube videos" 
ON public.youtube_videos 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view Spotify episodes" 
ON public.spotify_episodes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view media sync status" 
ON public.media_sync_status 
FOR SELECT 
USING (true);

-- Create admin policies for managing content
CREATE POLICY "Only admin can manage ebook signups" 
ON public.ebook_signups 
FOR ALL 
USING (auth.email() = 'zyklistacomp@gmail.com')
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can manage contact submissions" 
ON public.contact_submissions 
FOR ALL 
USING (auth.email() = 'zyklistacomp@gmail.com')
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can manage YouTube videos" 
ON public.youtube_videos 
FOR ALL 
USING (auth.email() = 'zyklistacomp@gmail.com')
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can manage Spotify episodes" 
ON public.spotify_episodes 
FOR ALL 
USING (auth.email() = 'zyklistacomp@gmail.com')
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can manage media sync status" 
ON public.media_sync_status 
FOR ALL 
USING (auth.email() = 'zyklistacomp@gmail.com')
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ebook_signups_updated_at
  BEFORE UPDATE ON public.ebook_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

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