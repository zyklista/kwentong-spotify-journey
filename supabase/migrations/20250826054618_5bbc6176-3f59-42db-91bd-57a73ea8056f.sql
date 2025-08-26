-- Fix contact_submissions table structure and RLS policies
-- First, check if we need to add the full_name column that was referenced in logs
ALTER TABLE public.contact_submissions 
ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Update the validation function to use 'name' instead of 'full_name'
CREATE OR REPLACE FUNCTION public.validate_contact_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    -- Validate email format
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;

    -- Prevent spam by checking message length
    IF length(NEW.message) > 1000 THEN
        RAISE EXCEPTION 'Message too long (max 1000 characters)';
    END IF;

    -- Prevent empty submissions - use 'name' field
    IF NEW.name IS NULL OR NEW.email IS NULL OR NEW.message IS NULL THEN
        RAISE EXCEPTION 'All fields are required';
    END IF;

    RETURN NEW;
END;
$function$;

-- Drop all existing conflicting RLS policies for contact_submissions
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow contact form submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Only authenticated admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Prevent submission modifications" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can delete own submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can insert own submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can manage their own submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can select own submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Users can update own submissions" ON public.contact_submissions;

-- Create single clear RLS policy for contact_submissions
CREATE POLICY "Public can insert contact submissions" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
USING (
    (auth.jwt() ->> 'email') = ANY (ARRAY['info@diaryofanofw.com', 'admin@diaryofanofw.com']) 
    OR (auth.jwt() ->> 'user_role') = 'admin'
);

CREATE POLICY "Prevent contact submission modifications" 
ON public.contact_submissions 
FOR UPDATE 
USING (false);

CREATE POLICY "Only admins can delete contact submissions" 
ON public.contact_submissions 
FOR DELETE 
USING (
    (auth.jwt() ->> 'email') = ANY (ARRAY['info@diaryofanofw.com', 'admin@diaryofanofw.com']) 
    OR (auth.jwt() ->> 'user_role') = 'admin'
);

-- Fix ebook_signups table RLS policies
-- Drop all existing conflicting policies
DROP POLICY IF EXISTS "Admins can view ebook signups" ON public.ebook_signups;
DROP POLICY IF EXISTS "Anyone can submit ebook signup" ON public.ebook_signups;
DROP POLICY IF EXISTS "No direct public access" ON public.ebook_signups;
DROP POLICY IF EXISTS "Service role can manage leads" ON public.ebook_signups;

-- Create single clear RLS policy for ebook_signups
CREATE POLICY "Public can insert ebook signups" 
ON public.ebook_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only admins can view ebook signups" 
ON public.ebook_signups 
FOR SELECT 
USING (
    (auth.jwt() ->> 'email') = ANY (ARRAY['info@diaryofanofw.com', 'admin@diaryofanofw.com']) 
    OR (auth.jwt() ->> 'user_role') = 'admin'
);

CREATE POLICY "Prevent ebook signup modifications" 
ON public.ebook_signups 
FOR UPDATE 
USING (false);

CREATE POLICY "Only admins can delete ebook signups" 
ON public.ebook_signups 
FOR DELETE 
USING (
    (auth.jwt() ->> 'email') = ANY (ARRAY['info@diaryofanofw.com', 'admin@diaryofanofw.com']) 
    OR (auth.jwt() ->> 'user_role') = 'admin'
);

-- Fix email_list table RLS policies to allow public inserts
-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "Email list accepts public inserts" ON public.email_list;

-- Recreate the public insert policy
CREATE POLICY "Public can insert to email list" 
ON public.email_list 
FOR INSERT 
WITH CHECK (true);