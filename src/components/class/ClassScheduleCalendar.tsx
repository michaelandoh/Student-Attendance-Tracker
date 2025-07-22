import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useClassSchedules } from '@/hooks/useClassSchedules';
import { ClassScheduleForm } from './ClassScheduleForm';

interface ClassScheduleCalendarProps {
  classId: string;
}

export const ClassScheduleCalendar = ({ classId }: ClassScheduleCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  
  const { 
    schedules, 
    isLoading, 
    deleteSchedule, 
    formatScheduleSummary,
    getNextClassDate,
    DAYS,
    SHORT_DAYS 
  } = useClassSchedules(classId);

  const nextClassDate = getNextClassDate(schedules);

  // Get schedules for selected day
  const selectedDaySchedules = selectedDate 
    ? schedules.filter(s => s.day_of_week === selectedDate.getDay())
    : [];

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      deleteSchedule(scheduleId);
    }
  };

  // Custom day content to show schedule indicators
  const getDayContent = (date: Date) => {
    const daySchedules = schedules.filter(s => s.day_of_week === date.getDay());
    if (daySchedules.length > 0) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {date.getDate()}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-1 bg-primary rounded-full"></div>
          </div>
        </div>
      );
    }
    return date.getDate();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Schedule Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Class Schedule</CardTitle>
              <CardDescription>
                {formatScheduleSummary(schedules)}
              </CardDescription>
            </div>
            <Dialog open={isAddingSchedule} onOpenChange={setIsAddingSchedule}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Class Schedule</DialogTitle>
                  <DialogDescription>
                    Add a new day and time for this class
                  </DialogDescription>
                </DialogHeader>
                <ClassScheduleForm 
                  classId={classId}
                  onSuccess={() => setIsAddingSchedule(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        {nextClassDate && (
          <CardContent className="pt-0">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Next class: {nextClassDate.toLocaleDateString()} at {nextClassDate.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Schedule</CardTitle>
            <CardDescription>
              Days with classes are marked with a dot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              formatters={{
                formatDay: getDayContent
              }}
            />
          </CardContent>
        </Card>

        {/* Daily Schedule Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? `${DAYS[selectedDate.getDay()]} Schedule` : 'Select a Day'}
            </CardTitle>
            <CardDescription>
              {selectedDate ? 
                `Class times for ${DAYS[selectedDate.getDay()]}` : 
                'Click on a day to view its schedule'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDaySchedules.length > 0 ? (
              selectedDaySchedules.map((schedule) => {
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

                return (
                  <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{startTime} - {endTime}</div>
                        <div className="text-sm text-muted-foreground">
                          {DAYS[schedule.day_of_week]}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog open={editingSchedule?.id === schedule.id} onOpenChange={(open) => setEditingSchedule(open ? schedule : null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Schedule</DialogTitle>
                            <DialogDescription>
                              Modify the class time
                            </DialogDescription>
                          </DialogHeader>
                          <ClassScheduleForm 
                            classId={classId}
                            schedule={editingSchedule}
                            onSuccess={() => setEditingSchedule(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No classes scheduled for this day</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setIsAddingSchedule(true)}
                >
                  Add Schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};