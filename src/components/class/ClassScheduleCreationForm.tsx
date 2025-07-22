import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateScheduleData } from '@/hooks/useClassSchedules';
import { format } from 'date-fns';

interface ClassScheduleCreationFormProps {
  onAddSchedule: (schedule: Omit<CreateScheduleData, 'class_id'>) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ClassScheduleCreationForm = ({ onAddSchedule }: ClassScheduleCreationFormProps) => {
  const [formData, setFormData] = useState({
    day_of_week: '',
    start_time: '',
    end_time: '',
    start_date: '',
    end_date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.day_of_week || !formData.start_time || !formData.end_time) {
      return;
    }

    const scheduleData = {
      day_of_week: parseInt(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time,
      ...(formData.start_date && { start_date: formData.start_date }),
      ...(formData.end_date && { end_date: formData.end_date })
    };

    onAddSchedule(scheduleData);
    
    // Reset form
    setFormData({
      day_of_week: '',
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="day_of_week">Day of Week</Label>
        <Select value={formData.day_of_week} onValueChange={(value) => handleInputChange('day_of_week', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a day" />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((day, index) => (
              <SelectItem key={index} value={index.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            type="time"
            value={formData.start_time}
            onChange={(e) => handleInputChange('start_time', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time</Label>
          <Input
            id="end_time"
            type="time"
            value={formData.end_time}
            onChange={(e) => handleInputChange('end_time', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date (Optional)</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            className="border-gray-200 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date (Optional)</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
            className="border-gray-200 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="min-w-[100px]">
          Add Schedule
        </Button>
      </div>
    </form>
  );
};