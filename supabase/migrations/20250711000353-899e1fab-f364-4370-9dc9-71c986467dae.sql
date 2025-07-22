-- Add a new notifications table specifically for email-based notifications to students
CREATE TABLE public.student_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('class_reminder', 'attendance_alert', 'weekly_report', 'announcement')),
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies - instructors can manage notifications for their classes
CREATE POLICY "Instructors can manage student notifications for their classes" 
ON public.student_notifications 
FOR ALL 
USING (class_id IN (
  SELECT id FROM public.classes WHERE instructor_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_student_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_student_notifications_updated_at
BEFORE UPDATE ON public.student_notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_student_notifications_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_student_notifications_student_id ON public.student_notifications(student_id);
CREATE INDEX idx_student_notifications_class_id ON public.student_notifications(class_id);
CREATE INDEX idx_student_notifications_type ON public.student_notifications(type);
CREATE INDEX idx_student_notifications_email_sent ON public.student_notifications(email_sent);
CREATE INDEX idx_student_notifications_created_at ON public.student_notifications(created_at);

-- Enable realtime
ALTER TABLE public.student_notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_notifications;