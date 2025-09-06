-- Enable RLS on tables that don't have it enabled
ALTER TABLE public.sendernet_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spotify_tracks ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for sendernet_log (admin-only access)
CREATE POLICY "Only admin can view sendernet logs" 
ON public.sendernet_log 
FOR SELECT 
USING (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can insert sendernet logs" 
ON public.sendernet_log 
FOR INSERT 
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

-- Add RLS policies for spotify_tracks (publicly readable, admin can manage)
CREATE POLICY "Spotify tracks are publicly readable" 
ON public.spotify_tracks 
FOR SELECT 
USING (true);

CREATE POLICY "Only admin can insert spotify tracks" 
ON public.spotify_tracks 
FOR INSERT 
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can update spotify tracks" 
ON public.spotify_tracks 
FOR UPDATE 
USING (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can delete spotify tracks" 
ON public.spotify_tracks 
FOR DELETE 
USING (auth.email() = 'zyklistacomp@gmail.com');