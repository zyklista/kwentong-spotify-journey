-- Create triggers to automatically push data to Make.com when new records are inserted
-- These triggers will call the push-to-make function whenever new data arrives

-- Create trigger for contact_submissions table
CREATE OR REPLACE TRIGGER trigger_contact_submissions_make
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.push_to_make();

-- Create trigger for ebook_signups table  
CREATE OR REPLACE TRIGGER trigger_ebook_signups_make
  AFTER INSERT ON public.ebook_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.push_to_make();