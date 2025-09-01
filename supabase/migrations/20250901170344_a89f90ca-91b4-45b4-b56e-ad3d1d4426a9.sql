-- First, let's check if triggers exist and create them if they don't
DO $$
BEGIN
    -- Drop existing triggers if they exist
    DROP TRIGGER IF EXISTS ebook_signups_sendernet_trigger ON public.ebook_signups;
    DROP TRIGGER IF EXISTS contact_submissions_sendernet_trigger ON public.contact_submissions;
    DROP TRIGGER IF EXISTS email_list_sendernet_trigger ON public.email_list;
END $$;

-- Create triggers for each table to call send_to_sendernet function
CREATE TRIGGER ebook_signups_sendernet_trigger
    AFTER INSERT ON public.ebook_signups
    FOR EACH ROW
    EXECUTE FUNCTION public.send_to_sendernet();

CREATE TRIGGER contact_submissions_sendernet_trigger
    AFTER INSERT ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.send_to_sendernet();

CREATE TRIGGER email_list_sendernet_trigger
    AFTER INSERT ON public.email_list
    FOR EACH ROW
    EXECUTE FUNCTION public.send_to_sendernet();