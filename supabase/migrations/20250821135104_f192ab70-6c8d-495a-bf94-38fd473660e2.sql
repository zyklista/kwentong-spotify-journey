-- Fix security vulnerability: Restrict contact_submissions SELECT access to admins only
DROP POLICY IF EXISTS "Admin can view all contact submissions" ON public.contact_submissions;

-- Create a more secure SELECT policy that only allows authenticated admins
CREATE POLICY "Only authenticated admins can view contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (
  -- Allow access if user has admin role or is an admin email
  (auth.jwt() ->> 'user_role'::text) = 'admin'::text 
  OR 
  (auth.jwt() ->> 'email'::text) = ANY (ARRAY['info@diaryofanofw.com'::text, 'admin@diaryofanofw.com'::text])
);