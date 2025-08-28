-- First drop the triggers that depend on the functions
DROP TRIGGER IF EXISTS contact_submit_notify ON contact_submissions;
DROP TRIGGER IF EXISTS ebook_signup_notify ON ebook_signups;

-- Now drop the problematic functions
DROP FUNCTION IF EXISTS public.notify_sender_contact();
DROP FUNCTION IF EXISTS public.notify_sender_ebook();