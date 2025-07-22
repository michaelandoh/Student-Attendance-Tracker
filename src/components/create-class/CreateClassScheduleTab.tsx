import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Clock, X } from "lucide-react";
import { ClassScheduleCreationForm } from '@/components/class/ClassScheduleCreationForm';
import { CreateScheduleData } from '@/hooks/useClassSchedules';

interface CreateClassScheduleTabProps {
  schedules: Omit<CreateScheduleData, 'class_id'>[];
  onAddSchedule: (schedule: Omit<CreateScheduleData, 'class_id'>) => void;
  onRemoveSchedule: (index: number) => void;
}

export const CreateClassScheduleTab = ({ 
  schedules, 
  onAddSchedule, 
  onRemoveSchedule 
}: CreateClassScheduleTabProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Class Schedule
        </CardTitle>
        <CardDescription>
          Set up your class meeting times. You can add multiple days and times.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {schedules.length > 0 && (
          <div className="space-y-3">
            <Label>Current Schedule:</Label>
            {schedules.map((schedule, index) => {
              const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const startTime = new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });
              const endTime = new Date(`1970-01-01T${schedule.end_time}`).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              });

              const formatDate = (dateStr: string) => {
                return new Date(dateStr).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
              };
              
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div>
                    <span className="font-medium">{days[schedule.day_of_week]}</span>
                    <span className="text-gray-600 ml-2">{startTime} - {endTime}</span>
                    {(schedule.start_date || schedule.end_date) && (
                      <div className="text-sm text-gray-500 mt-1">
                        {schedule.start_date && schedule.end_date 
                          ? `${formatDate(schedule.start_date)} - ${formatDate(schedule.end_date)}`
                          : schedule.start_date 
                            ? `Starting ${formatDate(schedule.start_date)}`
                            : `Until ${formatDate(schedule.end_date!)}`
                        }
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveSchedule(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Add New Schedule</h4>
          <ClassScheduleCreationForm onAddSchedule={onAddSchedule} />
        </div>
      </CardContent>
    </Card>
  );
};