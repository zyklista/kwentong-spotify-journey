-- Create a unified email list table
CREATE TABLE public.email_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  source TEXT NOT NULL, -- 'popup', 'contact_form', 'manual'
  subscribed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.email_list ENABLE ROW LEVEL SECURITY;

-- Create policies for email list
CREATE POLICY "Email list is viewable by admins only" 
ON public.email_list 
FOR SELECT 
USING (
  (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
    'info@diaryofanofw.com'::text, 
    'admin@diaryofanofw.com'::text
  ]) 
  OR (auth.jwt() ->> 'user_role'::text) = 'admin'::text
);

CREATE POLICY "Email list accepts public inserts" 
ON public.email_list 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can update email list" 
ON public.email_list 
FOR UPDATE 
USING (
  (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
    'info@diaryofanofw.com'::text, 
    'admin@diaryofanofw.com'::text
  ]) 
  OR (auth.jwt() ->> 'user_role'::text) = 'admin'::text
);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_email_list_updated_at
BEFORE UPDATE ON public.email_list
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();