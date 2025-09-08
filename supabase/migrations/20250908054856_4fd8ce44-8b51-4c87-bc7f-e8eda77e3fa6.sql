-- First drop all triggers that depend on the functions
DROP TRIGGER IF EXISTS ebook_signups_push ON public.ebook_signups;
DROP TRIGGER IF EXISTS contact_submissions_push ON public.contact_submissions;
DROP TRIGGER IF EXISTS trigger_contact_submissions_make ON public.contact_submissions;
DROP TRIGGER IF EXISTS trigger_ebook_signups_make ON public.ebook_signups;
DROP TRIGGER IF EXISTS trigger_contact_submissions_sender ON public.contact_submissions;
DROP TRIGGER IF EXISTS trigger_ebook_signups_sender ON public.ebook_signups;

-- Now drop the functions
DROP FUNCTION IF EXISTS public.push_to_make() CASCADE;
DROP FUNCTION IF EXISTS public.push_to_sender() CASCADE;