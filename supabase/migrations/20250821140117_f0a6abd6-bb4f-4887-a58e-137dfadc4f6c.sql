-- Add RLS policies for contact_submission_logs table to fix the security warning
CREATE POLICY "Only admins can view contact logs" 
ON public.contact_submission_logs 
FOR SELECT 
USING (
  (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
    'info@diaryofanofw.com'::text, 
    'admin@diaryofanofw.com'::text
  ]) 
  OR (auth.jwt() ->> 'user_role'::text) = 'admin'::text
);

CREATE POLICY "Only admins can insert contact logs" 
ON public.contact_submission_logs 
FOR INSERT 
WITH CHECK (
  (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
    'info@diaryofanofw.com'::text, 
    'admin@diaryofanofw.com'::text
  ]) 
  OR (auth.jwt() ->> 'user_role'::text) = 'admin'::text
);

CREATE POLICY "Prevent contact log modifications" 
ON public.contact_submission_logs 
FOR UPDATE 
USING (false);

CREATE POLICY "Only admins can delete contact logs" 
ON public.contact_submission_logs 
FOR DELETE 
USING (
  (auth.jwt() ->> 'email'::text) = ANY (ARRAY[
    'info@diaryofanofw.com'::text, 
    'admin@diaryofanofw.com'::text
  ]) 
  OR (auth.jwt() ->> 'user_role'::text) = 'admin'::text
);