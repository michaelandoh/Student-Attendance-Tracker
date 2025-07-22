-- Create notifications table
CREATE TABLE public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL CHECK (type IN ('class_reminder', 'attendance_alert', 'general')),
    class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id uuid REFERENCES public.students(id) ON DELETE CASCADE,
    is_read boolean NOT NULL DEFAULT false,
    metadata jsonb DEFAULT '{}',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to automatically create class reminder notifications
CREATE OR REPLACE FUNCTION public.create_class_reminder_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    schedule_record RECORD;
    reminder_time timestamp with time zone;
    class_time timestamp with time zone;
BEGIN
    -- Get all class schedules for the next 24 hours
    FOR schedule_record IN 
        SELECT DISTINCT cs.*, c.name as class_name, c.instructor_id
        FROM class_schedules cs
        JOIN classes c ON cs.class_id = c.id
        WHERE cs.day_of_week = EXTRACT(DOW FROM (CURRENT_DATE + INTERVAL '1 day'))
           OR cs.day_of_week = EXTRACT(DOW FROM CURRENT_DATE)
    LOOP
        -- Calculate class time for today or tomorrow
        IF schedule_record.day_of_week = EXTRACT(DOW FROM CURRENT_DATE) THEN
            class_time := CURRENT_DATE + schedule_record.start_time;
        ELSE
            class_time := (CURRENT_DATE + INTERVAL '1 day') + schedule_record.start_time;
        END IF;
        
        -- Set reminder for 30 minutes before class
        reminder_time := class_time - INTERVAL '30 minutes';
        
        -- Only create notification if reminder time is in the future and within next 24 hours
        IF reminder_time > NOW() AND reminder_time <= NOW() + INTERVAL '24 hours' THEN
            -- Check if notification already exists
            IF NOT EXISTS (
                SELECT 1 FROM notifications 
                WHERE user_id = schedule_record.instructor_id 
                AND type = 'class_reminder'
                AND class_id = schedule_record.class_id
                AND created_at::date = CURRENT_DATE
            ) THEN
                INSERT INTO notifications (
                    user_id,
                    title,
                    message,
                    type,
                    class_id,
                    metadata
                ) VALUES (
                    schedule_record.instructor_id,
                    'Class Reminder',
                    'Your class "' || schedule_record.class_name || '" starts in 30 minutes at ' || 
                    TO_CHAR(class_time, 'HH24:MI'),
                    'class_reminder',
                    schedule_record.class_id,
                    jsonb_build_object(
                        'class_time', class_time,
                        'reminder_time', reminder_time,
                        'class_name', schedule_record.class_name
                    )
                );
            END IF;
        END IF;
    END LOOP;
END;
$$;

-- Create function to create attendance alert notifications
CREATE OR REPLACE FUNCTION public.create_attendance_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    class_info RECORD;
    student_info RECORD;
BEGIN
    -- Get class and student information
    SELECT c.name as class_name, c.instructor_id
    INTO class_info
    FROM classes c
    WHERE c.id = NEW.class_id;
    
    SELECT s.name as student_name
    INTO student_info
    FROM students s
    WHERE s.id = NEW.student_id;
    
    -- Create notification for instructor
    IF class_info.instructor_id IS NOT NULL THEN
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            class_id,
            student_id,
            metadata
        ) VALUES (
            class_info.instructor_id,
            'Attendance Alert',
            student_info.student_name || ' marked ' || NEW.status || ' for ' || class_info.class_name,
            'attendance_alert',
            NEW.class_id,
            NEW.student_id,
            jsonb_build_object(
                'status', NEW.status,
                'student_name', student_info.student_name,
                'class_name', class_info.class_name,
                'marked_at', NEW.marked_at
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for attendance notifications
CREATE TRIGGER create_attendance_notification_trigger
    AFTER INSERT ON attendance_records
    FOR EACH ROW
    EXECUTE FUNCTION create_attendance_notification();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_notifications_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create trigger for updating timestamps
CREATE TRIGGER update_notifications_updated_at_trigger
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Add indexes for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;