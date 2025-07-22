-- Add policy to allow anonymous users to create their own student records for attendance
-- This allows students to self-register when marking attendance via QR code
CREATE POLICY "Students can self-register for attendance" 
ON public.students 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Add policy to allow anonymous users to read student records for attendance checks
-- This allows the attendance system to check if a student already exists
CREATE POLICY "Public can view students for attendance verification" 
ON public.students 
FOR SELECT 
TO anon 
USING (true);