-- Remove the problematic database function that's causing the http_post error
DROP FUNCTION IF EXISTS public.notify_sender_contact();

-- Remove the problematic ebook function as well 
DROP FUNCTION IF EXISTS public.notify_sender_ebook();