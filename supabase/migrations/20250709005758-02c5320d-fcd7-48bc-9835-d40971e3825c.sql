-- Add policy to allow public read access to classes for attendance functionality
-- This allows unauthenticated students to see basic class info when scanning QR codes
CREATE POLICY "Public can view basic class info for attendance" 
ON public.classes 
FOR SELECT 
TO anon 
USING (true);