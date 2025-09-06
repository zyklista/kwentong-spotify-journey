-- Drop the existing public read policy for visitors table
DROP POLICY "Visitor data is publicly readable" ON public.visitors;

-- Create a new policy that only allows admin to read visitor data
CREATE POLICY "Only admin can view visitor data" 
ON public.visitors 
FOR SELECT 
USING (auth.email() = 'zyklistacomp@gmail.com');