-- First, let's check if there are orphaned student records
SELECT s.*, c.name as class_name 
FROM students s 
LEFT JOIN classes c ON s.class_id = c.id 
WHERE c.id IS NULL;

-- Remove any orphaned student records (students without a valid class)
DELETE FROM students 
WHERE class_id NOT IN (SELECT id FROM classes);

-- Drop the global unique constraint on student_id
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_student_id_key;

-- Create a new composite unique constraint that allows same student_id in different classes
ALTER TABLE students ADD CONSTRAINT students_student_id_class_id_key UNIQUE (student_id, class_id);