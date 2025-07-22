import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2, Download, Upload, Bell, Clock, Users, BookOpen, AlertTriangle, FileText, Loader2 } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useStudents } from "@/hooks/useStudents";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: string;
  marked_at: string;
  marked_by: string | null;
  students: {
    name: string;
    email: string;
    student_id: string;
  };
}

interface ClassSettingsProps {
  classData: {
    id: string;
    name: string;
    description?: string;
    room?: string;
    instructor_id: string;
    created_at: string;
    updated_at: string;
  };
}

export const ClassSettings = ({ classData }: ClassSettingsProps) => {
  const navigate = useNavigate();
  const { updateClass, deleteClass, isUpdating, isDeleting } = useClasses();
  const { students, createStudent } = useStudents(classData.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editedClass, setEditedClass] = useState({
    name: classData.name,
    description: classData.description || "",
    room: classData.room || ""
  });

  const [attendanceSettings, setAttendanceSettings] = useState({
    autoMarkLate: true,
    lateThresholdMinutes: 15,
    requireConfirmation: false,
    allowSelfCheckIn: false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailReminders: false,
    attendanceAlerts: false,
    weeklyReports: false,
    reminderTime: "08:00"
  });

  const [isTestingNotifications, setIsTestingNotifications] = useState(false);

  const [isExportingAttendance, setIsExportingAttendance] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleClassInfoUpdate = () => {
    updateClass({
      id: classData.id,
      ...editedClass
    });
  };

  const handleDeleteClass = () => {
    deleteClass(classData.id);
    navigate('/dashboard');
  };

  const handleExportStudents = () => {
    if (students.length === 0) {
      toast.error("No students to export");
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Email,Student ID\n"
      + students.map(s => `"${s.name}","${s.email}","${s.student_id}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${classData.name.replace(/[^a-z0-9]/gi, '_')}_students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Student list exported successfully");
  };

  const handleExportAttendance = async () => {
    if (students.length === 0) {
      toast.error("No students in class to export attendance for");
      return;
    }

    setIsExportingAttendance(true);
    try {
      const { data: attendanceRecords, error } = await supabase
        .from('attendance_records')
        .select(`
          id,
          student_id,
          class_id,
          date,
          status,
          marked_at,
          marked_by,
          students (
            name,
            email,
            student_id
          ),
          marked_by_profile:profiles!marked_by (
            full_name,
            email
          )
        `)
        .eq('class_id', classData.id)
        .order('date', { ascending: false })
        .order('marked_at', { ascending: false });

      if (error) throw error;

      if (!attendanceRecords || attendanceRecords.length === 0) {
        toast.error("No attendance records found to export");
        return;
      }

      // Convert to CSV
      const csvHeaders = "Student Name,Student ID,Email,Date,Status,Marked At,Marked By\n";
      const csvContent = "data:text/csv;charset=utf-8," + csvHeaders +
        attendanceRecords.map((record: any) => {
          const date = new Date(record.date).toLocaleDateString();
          const markedAt = new Date(record.marked_at).toLocaleString();
          const markedBy = record.marked_by_profile?.full_name || 
                          record.marked_by_profile?.email || 
                          (record.marked_by ? 'Unknown User' : 'System');
          return `"${record.students.name}","${record.students.student_id}","${record.students.email}","${date}","${record.status}","${markedAt}","${markedBy}"`;
        }).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${classData.name.replace(/[^a-z0-9]/gi, '_')}_attendance.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${attendanceRecords.length} attendance records`);

    } catch (error: any) {
      console.error('Error exporting attendance:', error);
      toast.error(`Failed to export attendance: ${error.message}`);
    } finally {
      setIsExportingAttendance(false);
    }
  };

  const parseCSV = (csvText: string): Array<{name: string, email: string, student_id: string}> => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const emailIndex = headers.findIndex(h => h.includes('email'));
    const studentIdIndex = headers.findIndex(h => h.includes('student') && h.includes('id') || h === 'id');

    if (nameIndex === -1 || emailIndex === -1 || studentIdIndex === -1) {
      throw new Error('CSV must contain columns for Name, Email, and Student ID');
    }

    const students = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      if (values.length >= 3) {
        const name = values[nameIndex]?.trim();
        const email = values[emailIndex]?.trim();
        const student_id = values[studentIdIndex]?.trim();

        if (name && email && student_id) {
          // Basic email validation
          if (!email.includes('@')) {
            throw new Error(`Invalid email format on line ${i + 1}: ${email}`);
          }
          students.push({ name, email, student_id });
        }
      }
    }

    if (students.length === 0) {
      throw new Error('No valid student records found in CSV');
    }

    return students;
  };

  const handleImportStudents = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsedStudents = parseCSV(csvText);

        // Check for duplicates within the file
        const uniqueStudentIds = new Set();
        const uniqueEmails = new Set();
        for (const student of parsedStudents) {
          if (uniqueStudentIds.has(student.student_id)) {
            throw new Error(`Duplicate student ID in file: ${student.student_id}`);
          }
          if (uniqueEmails.has(student.email)) {
            throw new Error(`Duplicate email in file: ${student.email}`);
          }
          uniqueStudentIds.add(student.student_id);
          uniqueEmails.add(student.email);
        }

        // Check for existing students in the class
        const existingStudentIds = new Set(students.map(s => s.student_id));
        const existingEmails = new Set(students.map(s => s.email));
        
        const newStudents = parsedStudents.filter(student => 
          !existingStudentIds.has(student.student_id) && 
          !existingEmails.has(student.email)
        );

        if (newStudents.length === 0) {
          toast.error("All students in the CSV already exist in this class");
          return;
        }

        // Import students
        let successCount = 0;
        let errorCount = 0;

        for (const student of newStudents) {
          try {
            await createStudent({
              ...student,
              class_id: classData.id
            });
            successCount++;
          } catch (error: any) {
            console.error(`Error importing student ${student.name}:`, error);
            errorCount++;
          }
        }

        if (successCount > 0) {
          toast.success(`Successfully imported ${successCount} student(s)`);
        }
        if (errorCount > 0) {
          toast.error(`Failed to import ${errorCount} student(s)`);
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } catch (error: any) {
        console.error('Error importing CSV:', error);
        toast.error(`Import failed: ${error.message}`);
      } finally {
        setIsImporting(false);
      }
    };

    reader.onerror = () => {
      toast.error("Error reading file");
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  const handleSendNotification = async (type: 'reminder' | 'attendance_alert' | 'weekly_report', message?: string) => {
    setIsTestingNotifications(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-class-notifications', {
        body: {
          type,
          classId: classData.id,
          instructorId: classData.instructor_id,
          data: message ? { message } : undefined
        }
      });

      if (error) throw error;

      toast.success(`${type.replace('_', ' ')} notification sent successfully to ${data.recipients} recipient(s)`);
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error(`Failed to send notification: ${error.message}`);
    } finally {
      setIsTestingNotifications(false);
    }
  };

  const handleTestNotification = () => {
    handleSendNotification('attendance_alert', 'This is a test notification from your class management system.');
  };

  return (
    <div className="space-y-6">
      {/* Class Information */}
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Class Information
          </CardTitle>
          <CardDescription>Update basic class details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                value={editedClass.name}
                onChange={(e) => setEditedClass(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter class name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={editedClass.room}
                onChange={(e) => setEditedClass(prev => ({ ...prev, room: e.target.value }))}
                placeholder="Enter room number/location"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedClass.description}
              onChange={(e) => setEditedClass(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter class description"
              rows={3}
            />
          </div>
          <Button 
            onClick={handleClassInfoUpdate} 
            disabled={isUpdating}
            className="w-full md:w-auto"
          >
            {isUpdating ? "Updating..." : "Update Class Info"}
          </Button>
        </CardContent>
      </Card>

      {/* Attendance Settings */}
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Attendance Settings
          </CardTitle>
          <CardDescription>Configure attendance policies and behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-mark students late</Label>
              <p className="text-sm text-text-secondary">Automatically mark students as late after threshold</p>
            </div>
            <Switch
              checked={attendanceSettings.autoMarkLate}
              onCheckedChange={(checked) => 
                setAttendanceSettings(prev => ({ ...prev, autoMarkLate: checked }))
              }
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lateThreshold">Late threshold (minutes)</Label>
            <Input
              id="lateThreshold"
              type="number"
              value={attendanceSettings.lateThresholdMinutes}
              onChange={(e) => 
                setAttendanceSettings(prev => ({ ...prev, lateThresholdMinutes: parseInt(e.target.value) || 0 }))
              }
              min="0"
              max="120"
              className="w-32"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Require confirmation</Label>
              <p className="text-sm text-text-secondary">Require instructor confirmation for attendance changes</p>
            </div>
            <Switch
              checked={attendanceSettings.requireConfirmation}
              onCheckedChange={(checked) => 
                setAttendanceSettings(prev => ({ ...prev, requireConfirmation: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow student self check-in</Label>
              <p className="text-sm text-text-secondary">Let students mark their own attendance</p>
            </div>
            <Switch
              checked={attendanceSettings.allowSelfCheckIn}
              onCheckedChange={(checked) => 
                setAttendanceSettings(prev => ({ ...prev, allowSelfCheckIn: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Export/Import */}
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export & Import
          </CardTitle>
          <CardDescription>Export class data or import student lists</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleExportStudents}
              className="flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Export Student List
              <Badge variant="secondary" className="ml-2">{students.length}</Badge>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleExportAttendance}
              disabled={isExportingAttendance}
              className="flex items-center"
            >
              {isExportingAttendance ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Clock className="w-4 h-4 mr-2" />
              )}
              {isExportingAttendance ? "Exporting..." : "Export Attendance Data"}
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="importStudents">Import Student List (CSV)</Label>
            <div className="flex items-center space-x-2">
              <Input
                ref={fileInputRef}
                id="importStudents"
                type="file"
                accept=".csv"
                onChange={handleImportStudents}
                disabled={isImporting}
                className="cursor-pointer"
              />
              <Button 
                variant="outline" 
                size="sm"
                disabled={isImporting}
                onClick={() => fileInputRef.current?.click()}
              >
                {isImporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                {isImporting ? "Importing..." : "Import"}
              </Button>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-text-secondary">
                CSV format: Name, Email, Student ID
              </p>
              <p className="text-xs text-text-secondary">
                Example: "John Doe","john@email.com","12345"
              </p>
              <p className="text-xs text-text-secondary">
                Duplicate students will be skipped automatically
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </CardTitle>
          <CardDescription>Configure email alerts and reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email reminders</Label>
              <p className="text-sm text-text-secondary">Send class reminder emails to students</p>
            </div>
            <Switch
              checked={notificationSettings.emailReminders}
              onCheckedChange={(checked) => 
                setNotificationSettings(prev => ({ ...prev, emailReminders: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Attendance alerts</Label>
              <p className="text-sm text-text-secondary">Get notified about attendance issues</p>
            </div>
            <Switch
              checked={notificationSettings.attendanceAlerts}
              onCheckedChange={(checked) => 
                setNotificationSettings(prev => ({ ...prev, attendanceAlerts: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly reports</Label>
              <p className="text-sm text-text-secondary">Receive weekly attendance summaries</p>
            </div>
            <Switch
              checked={notificationSettings.weeklyReports}
              onCheckedChange={(checked) => 
                setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderTime">Reminder time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={notificationSettings.reminderTime}
              onChange={(e) => 
                setNotificationSettings(prev => ({ ...prev, reminderTime: e.target.value }))
              }
              className="w-32"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Test Notifications</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendNotification('reminder')}
                disabled={isTestingNotifications || students.length === 0}
              >
                {isTestingNotifications ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Bell className="w-4 h-4 mr-2" />
                )}
                Send Reminder
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={handleTestNotification}
                disabled={isTestingNotifications}
              >
                {isTestingNotifications ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4 mr-2" />
                )}
                Test Alert
              </Button>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendNotification('weekly_report')}
                disabled={isTestingNotifications}
              >
                {isTestingNotifications ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Weekly Report
              </Button>
            </div>
            <p className="text-xs text-text-secondary">
              Test notifications will be sent immediately. Reminders require students in the class.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-0 bg-surface/80 backdrop-blur-sm border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <Trash2 className="w-5 h-5 mr-2" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions for this class</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-destructive/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Deleting this class will permanently remove all students, schedules, and attendance records. This action cannot be undone.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-auto">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Class
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the class "{classData.name}" and all associated data including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>{students.length} students</li>
                      <li>All attendance records</li>
                      <li>Class schedules</li>
                      <li>All settings and preferences</li>
                    </ul>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteClass}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete Class"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};