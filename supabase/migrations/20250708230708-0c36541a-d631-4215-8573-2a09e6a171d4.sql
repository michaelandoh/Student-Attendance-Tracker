-- Add date columns to class_schedules table
ALTER TABLE public.class_schedules 
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE;

-- Add indexes for better performance on date queries
CREATE INDEX idx_class_schedules_date_range ON public.class_schedules(start_date, end_date);

-- Add check constraint to ensure end_date is after start_date (using trigger instead of CHECK for flexibility)
CREATE OR REPLACE FUNCTION validate_schedule_dates()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.start_date IS NOT NULL AND NEW.end_date IS NOT NULL THEN
    IF NEW.end_date < NEW.start_date THEN
      RAISE EXCEPTION 'End date must be after start date';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_schedule_dates_trigger
  BEFORE INSERT OR UPDATE ON public.class_schedules
  FOR EACH ROW
  EXECUTE FUNCTION validate_schedule_dates();