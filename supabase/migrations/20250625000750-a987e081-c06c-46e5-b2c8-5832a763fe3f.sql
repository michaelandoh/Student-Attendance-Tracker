
-- Create instructors table (extends the existing profiles table)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS instructor_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  schedule TEXT,
  room TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  student_id TEXT UNIQUE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('present', 'absent', 'late')) NOT NULL DEFAULT 'present',
  marked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  marked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(student_id, class_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes table
CREATE POLICY "Instructors can manage their own classes" 
  ON public.classes 
  FOR ALL 
  USING (instructor_id = auth.uid());

-- RLS Policies for students table
CREATE POLICY "Instructors can manage students in their classes" 
  ON public.students 
  FOR ALL 
  USING (
    class_id IN (
      SELECT id FROM public.classes WHERE instructor_id = auth.uid()
    )
  );

-- RLS Policies for attendance_records table
CREATE POLICY "Instructors can manage attendance for their classes" 
  ON public.attendance_records 
  FOR ALL 
  USING (
    class_id IN (
      SELECT id FROM public.classes WHERE instructor_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_classes_instructor_id ON public.classes(instructor_id);
CREATE INDEX idx_students_class_id ON public.students(class_id);
CREATE INDEX idx_attendance_student_class_date ON public.attendance_records(student_id, class_id, date);
CREATE INDEX idx_attendance_class_date ON public.attendance_records(class_id, date);
