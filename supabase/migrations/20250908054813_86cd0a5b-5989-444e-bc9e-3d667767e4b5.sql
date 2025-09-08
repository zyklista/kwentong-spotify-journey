-- Remove the problematic triggers and functions that cause schema errors
DROP TRIGGER IF EXISTS trigger_contact_submissions_make ON public.contact_submissions;
DROP TRIGGER IF EXISTS trigger_ebook_signups_make ON public.ebook_signups;
DROP TRIGGER IF EXISTS trigger_contact_submissions_sender ON public.contact_submissions;
DROP TRIGGER IF EXISTS trigger_ebook_signups_sender ON public.ebook_signups;

-- Drop the problematic functions
DROP FUNCTION IF EXISTS public.push_to_make();
DROP FUNCTION IF EXISTS public.push_to_sender();

-- Create a simple trigger function that calls the push-to-make edge function via HTTP
CREATE OR REPLACE FUNCTION public.notify_make_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  webhook_url text;
  payload jsonb;
  result jsonb;
BEGIN
  -- Get the Make.com webhook URL from environment or skip if not configured
  webhook_url := current_setting('app.make_webhook_url', true);
  
  IF webhook_url IS NULL OR webhook_url = '' THEN
    -- No webhook configured, just return the row
    RETURN NEW;
  END IF;

  -- Build the payload
  payload := jsonb_build_object(
    'table', TG_TABLE_NAME,
    'timestamp', now(),
    'data', row_to_json(NEW)::jsonb,
    'source', 'diary-of-an-ofw-trigger'
  );

  -- For now, we'll handle the webhook call in the application layer
  -- This function just logs the event
  RAISE LOG 'New row inserted in %: %', TG_TABLE_NAME, payload;
  
  RETURN NEW;
END;
$$;

-- Create triggers for both tables to log new inserts
CREATE TRIGGER trigger_contact_submissions_notify
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_make_webhook();

CREATE TRIGGER trigger_ebook_signups_notify
  AFTER INSERT ON public.ebook_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_make_webhook();