-- Add policy to allow anonymous users to mark their own attendance
-- This allows students to create attendance records when scanning QR codes
CREATE POLICY "Anonymous users can mark attendance" 
ON public.attendance_records 
FOR INSERT 
TO anon 
WITH CHECK (true);