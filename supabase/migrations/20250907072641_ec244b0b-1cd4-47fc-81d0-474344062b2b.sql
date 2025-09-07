-- Update RLS policies to only allow admin editing

-- Drop existing policies that allow public edits
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can insert ebook signups" ON public.ebook_signups;
DROP POLICY IF EXISTS "Anyone can add to email list" ON public.email_list;
DROP POLICY IF EXISTS "Anyone can update email list subscription" ON public.email_list;

-- Keep only admin-specific policies for editing
CREATE POLICY "Only admin can manage contact submissions" 
ON public.contact_submissions 
FOR ALL 
USING (auth.email() = 'zyklistacomp@gmail.com')
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can manage ebook signups" 
ON public.ebook_signups 
FOR ALL 
USING (auth.email() = 'zyklistacomp@gmail.com')
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

CREATE POLICY "Only admin can manage email list" 
ON public.email_list 
FOR ALL 
USING (auth.email() = 'zyklistacomp@gmail.com')
WITH CHECK (auth.email() = 'zyklistacomp@gmail.com');

-- Allow public to submit forms but only admin to manage
CREATE POLICY "Public can submit contact forms" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can submit ebook signups" 
ON public.ebook_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can join email list" 
ON public.email_list 
FOR INSERT 
WITH CHECK (true);