-- Create visitors table for tracking website visitors
CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  name TEXT,
  signup_source TEXT DEFAULT 'popup',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert visitor data (signup)
CREATE POLICY "Anyone can signup as visitor" 
ON public.visitors 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view visitor information (protect privacy)
CREATE POLICY "Only admins can view visitor data" 
ON public.visitors 
FOR SELECT 
USING (
  (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
    'info@diaryofanofw.com'::text, 
    'admin@diaryofanofw.com'::text
  ]) 
  OR (auth.jwt() ->> 'user_role'::text) = 'admin'::text
);

-- Prevent visitors from updating their data
CREATE POLICY "Prevent visitor data modifications" 
ON public.visitors 
FOR UPDATE 
USING (false);

-- Only admins can delete visitor data
CREATE POLICY "Only admins can delete visitor data" 
ON public.visitors 
FOR DELETE 
USING (
  (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
    'info@diaryofanofw.com'::text, 
    'admin@diaryofanofw.com'::text
  ]) 
  OR (auth.jwt() ->> 'user_role'::text) = 'admin'::text
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_visitors_updated_at
    BEFORE UPDATE ON public.visitors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();