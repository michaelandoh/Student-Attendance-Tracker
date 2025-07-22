import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Student } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { useAuth } from '@/contexts/AuthContext';
import { useClassSchedules } from '@/hooks/useClassSchedules';
import { toast } from 'sonner';

interface ClassAttendanceProps {
  students: Student[];
  isLoading: boolean;
  classId: string;
}

export const ClassAttendance = ({ students, isLoading, classId }: ClassAttendanceProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { user } = useAuth();
  const { 
    attendanceRecords, 
    markAttendance, 
    bulkMarkAttendance, 
    isMarking,
    isBulkMarking
  } = useAttendance(classId);
  
  const { schedules, formatScheduleSummary } = useClassSchedules(classId);

  // Sync attendance state when students change
  useEffect(() => {
    if (students.length > 0) {
      // Initialize attendance state if needed
    }
  }, [students]);

  const handleBulkAttendance = (bulkStatus: 'present' | 'absent' | 'late') => {
    if (!selectedDate || !user) return;

    // Check if the selected date has a scheduled class
    const selectedDay = selectedDate.getDay();
    const hasSchedule = schedules.some(schedule => schedule.day_of_week === selectedDay);
    
    if (!hasSchedule) {
      toast.error('No class scheduled for this day');
      return;
    }

    const attendanceData = students.map(student => ({
      student_id: student.id,
      class_id: student.class_id,
      date: format(selectedDate, 'yyyy-MM-dd'),
      status: bulkStatus as 'present' | 'absent' | 'late'
    }));

    bulkMarkAttendance(attendanceData);
    toast.success(`Marked all students as ${bulkStatus}`);
  };

  const handleMarkAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!selectedDate || !user) return;

    // Check if the selected date has a scheduled class
    const selectedDay = selectedDate.getDay();
    const hasSchedule = schedules.some(schedule => schedule.day_of_week === selectedDay);
    
    if (!hasSchedule) {
      toast.error('No class scheduled for this day');
      return;
    }

    markAttendance({
      student_id: studentId,
      class_id: students.find(s => s.id === studentId)?.class_id || '',
      date: format(selectedDate, 'yyyy-MM-dd'),
      status
    });
  };

  // Get attendance for selected date
  const selectedDateAttendance = selectedDate 
    ? attendanceRecords.filter(a => a.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];

  // Check if selected date has a class scheduled
  const selectedDay = selectedDate?.getDay();
  const hasScheduledClass = selectedDay !== undefined && schedules.some(schedule => schedule.day_of_week === selectedDay);
  
  // Get schedule info for selected day
  const daySchedules = selectedDay !== undefined 
    ? schedules.filter(schedule => schedule.day_of_week === selectedDay)
    : [];

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
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Select Date
            </CardTitle>
            <CardDescription>
              Choose a date to take attendance
              {schedules.length > 0 && (
                <div className="mt-2 text-sm">
                  <strong>Class Schedule:</strong> {formatScheduleSummary(schedules)}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            {selectedDate && !hasScheduledClass && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center text-amber-700 text-sm">
                  <Clock className="w-4 h-4 mr-2" />
                  No class scheduled for this day
                </div>
              </div>
            )}
            
            {selectedDate && hasScheduledClass && daySchedules.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-700 text-sm">
                  <strong>Class Times:</strong>
                  {daySchedules.map((schedule, index) => {
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
                      <div key={index} className="flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {startTime} - {endTime}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>Mark all students at once</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleBulkAttendance('present')}
              disabled={!selectedDate || !hasScheduledClass || isMarking || isBulkMarking}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Present
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleBulkAttendance('absent')}
              disabled={!selectedDate || !hasScheduledClass || isMarking || isBulkMarking}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Mark All Absent
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => handleBulkAttendance('late')}
              disabled={!selectedDate || !hasScheduledClass || isMarking || isBulkMarking}
            >
              <Clock className="w-4 h-4 mr-2" />
              Mark All Late
            </Button>
            
            {!hasScheduledClass && selectedDate && (
              <div className="text-xs text-muted-foreground mt-2 text-center">
                No class scheduled for selected day
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Summary
            </CardTitle>
            <CardDescription>Today's attendance overview</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDate && selectedDateAttendance.length > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Present</span>
                  <Badge variant="default">
                    {selectedDateAttendance.filter(a => a.status === 'present').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Late</span>
                  <Badge variant="secondary">
                    {selectedDateAttendance.filter(a => a.status === 'late').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Absent</span>
                  <Badge variant="destructive">
                    {selectedDateAttendance.filter(a => a.status === 'absent').length}
                  </Badge>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Students</span>
                    <Badge variant="outline">{students.length}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No attendance recorded</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Student Attendance - {format(selectedDate, 'PPP')}</CardTitle>
            <CardDescription>
              {hasScheduledClass ? 
                'Click on a student to mark their attendance' : 
                'No class scheduled for this day'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No students enrolled in this class</p>
              </div>
            ) : !hasScheduledClass ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No class scheduled for this day</p>
                <p className="text-sm mt-2">Select a day with scheduled classes to take attendance</p>
              </div>
            ) : (
              <div className="space-y-2">
                {students.map((student) => {
                  const studentAttendance = selectedDateAttendance.find(a => a.student_id === student.id);
                  return (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">ID: {student.student_id}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {studentAttendance && (
                          <Badge 
                            variant={
                              studentAttendance.status === 'present' ? 'default' : 
                              studentAttendance.status === 'late' ? 'secondary' : 'destructive'
                            }
                          >
                            {studentAttendance.status}
                          </Badge>
                        )}
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'present' ? 'default' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'present')}
                            disabled={isMarking || isBulkMarking}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'late' ? 'secondary' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'late')}
                            disabled={isMarking || isBulkMarking}
                          >
                            <Clock className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={studentAttendance?.status === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => handleMarkAttendance(student.id, 'absent')}
                            disabled={isMarking || isBulkMarking}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};