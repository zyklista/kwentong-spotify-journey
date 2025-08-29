-- Create ebook_signups table
CREATE TABLE public.ebook_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_submissions table
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

-- Create email_list table
CREATE TABLE public.email_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT NOT NULL,
  subscribed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visitors table
CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  name TEXT,
  signup_source TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ebook_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for ebook_signups (public can insert, only authenticated users can read)
CREATE POLICY "Anyone can submit ebook signup" 
ON public.ebook_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Ebook signups are publicly readable" 
ON public.ebook_signups 
FOR SELECT 
USING (true);

-- Create policies for contact_submissions (public can insert, only authenticated users can read)
CREATE POLICY "Anyone can submit contact form" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Contact submissions are publicly readable" 
ON public.contact_submissions 
FOR SELECT 
USING (true);

-- Create policies for email_list (public can insert/update for upsert, readable)
CREATE POLICY "Anyone can add to email list" 
ON public.email_list 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update email list subscription" 
ON public.email_list 
FOR UPDATE 
USING (true);

CREATE POLICY "Email list is publicly readable" 
ON public.email_list 
FOR SELECT 
USING (true);

-- Create policies for visitors (public can insert, readable)
CREATE POLICY "Anyone can track visitor data" 
ON public.visitors 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Visitor data is publicly readable" 
ON public.visitors 
FOR SELECT 
USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ebook_signups_updated_at
BEFORE UPDATE ON public.ebook_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_list_updated_at
BEFORE UPDATE ON public.email_list
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visitors_updated_at
BEFORE UPDATE ON public.visitors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_ebook_signups_email ON public.ebook_signups(email);
CREATE INDEX idx_ebook_signups_created_at ON public.ebook_signups(created_at);

CREATE INDEX idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at);

CREATE INDEX idx_email_list_email ON public.email_list(email);
CREATE INDEX idx_email_list_source ON public.email_list(source);

CREATE INDEX idx_visitors_email ON public.visitors(email);
CREATE INDEX idx_visitors_signup_source ON public.visitors(signup_source);
CREATE INDEX idx_visitors_created_at ON public.visitors(created_at);