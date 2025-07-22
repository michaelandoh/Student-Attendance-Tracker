-- Drop the global unique constraint on email to allow same email in different classes
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_email_key;

-- Clean up any orphaned records again to be safe
DELETE FROM students 
WHERE class_id NOT IN (SELECT id FROM classes);