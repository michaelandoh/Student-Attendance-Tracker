-- Create class_schedules table for flexible scheduling
CREATE TABLE public.class_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(class_id, day_of_week, start_time) -- Prevent duplicate schedules for same day/time
);

-- Enable RLS on class_schedules table
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for class_schedules
CREATE POLICY "Instructors can manage schedules for their classes" 
  ON public.class_schedules 
  FOR ALL 
  USING (
    class_id IN (
      SELECT id FROM public.classes WHERE instructor_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_class_schedules_class_id ON public.class_schedules(class_id);
CREATE INDEX idx_class_schedules_day_time ON public.class_schedules(day_of_week, start_time);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_class_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_class_schedules_updated_at
  BEFORE UPDATE ON public.class_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_class_schedules_updated_at();

-- Enable realtime for class_schedules
ALTER TABLE public.class_schedules REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_schedules;