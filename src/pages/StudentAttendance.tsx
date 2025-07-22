import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowLeft, Users, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Class {
  id: string;
  name: string;
  description?: string;
  schedule?: string;
  room?: string;
}

const StudentAttendance = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (classId) {
      fetchClassInfo();
    }
  }, [classId]);

  const fetchClassInfo = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (error) {
        setError('Class not found');
        return;
      }

      setClassInfo(data);
    } catch (err) {
      setError('Failed to load class information');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentName.trim() || !studentId.trim() || !email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First, check if student exists or create them
      const { data: existingStudent, error: studentLookupError } = await supabase
        .from('students')
        .select('id')
        .eq('student_id', studentId)
        .eq('class_id', classId)
        .maybeSingle();

      let studentDbId = existingStudent?.id;

      if (!existingStudent) {
        // Create new student
        const { data: newStudent, error: createStudentError } = await supabase
          .from('students')
          .insert({
            name: studentName.trim(),
            student_id: studentId.trim(),
            email: email.trim(),
            class_id: classId!
          })
          .select('id')
          .single();

        if (createStudentError) {
          throw createStudentError;
        }

        studentDbId = newStudent.id;
      }

      // Check if attendance already marked for today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingAttendance } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('student_id', studentDbId)
        .eq('class_id', classId)
        .eq('date', today)
        .maybeSingle();

      if (existingAttendance) {
        toast({
          title: "Already Marked",
          description: "Your attendance has already been marked for today",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Mark attendance
      const { error: attendanceError } = await supabase
        .from('attendance_records')
        .insert({
          student_id: studentDbId,
          class_id: classId!,
          date: today,
          status: 'present',
          marked_at: new Date().toISOString()
        });

      if (attendanceError) {
        throw attendanceError;
      }

      setAttendanceMarked(true);
      toast({
        title: "Attendance Marked",
        description: "Your attendance has been successfully recorded",
      });

      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark attendance. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading class information...</p>
        </div>
      </div>
    );
  }

  if (error || !classInfo) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-destructive">Class Not Found</CardTitle>
            <CardDescription>
              The class you're trying to access doesn't exist or has been removed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (attendanceMarked) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-green-600">Attendance Marked!</CardTitle>
            <CardDescription>
              Your attendance for {classInfo.name} has been successfully recorded.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-text-secondary">
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p>Time: {new Date().toLocaleTimeString()}</p>
            </div>
            <Button onClick={() => navigate('/')} className="w-full">
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Class Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{classInfo.name}</span>
            </CardTitle>
            {classInfo.description && (
              <CardDescription>{classInfo.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            {classInfo.schedule && (
              <div className="flex items-center text-sm text-text-secondary">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{classInfo.schedule}</span>
              </div>
            )}
            {classInfo.room && (
              <div className="flex items-center text-sm text-text-secondary">
                <Users className="w-4 h-4 mr-2" />
                <span>Room: {classInfo.room}</span>
              </div>
            )}
            <div className="flex items-center text-sm text-text-secondary">
              <Clock className="w-4 h-4 mr-2" />
              <span>Today: {new Date().toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Form */}
        <Card>
          <CardHeader>
            <CardTitle>Mark Your Attendance</CardTitle>
            <CardDescription>
              Please fill in your information to mark your attendance for today's class.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAttendanceSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  type="text"
                  placeholder="Enter your full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Enter your student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Make sure your information is correct. You can only mark attendance once per day.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Marking Attendance...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <Button variant="outline" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;