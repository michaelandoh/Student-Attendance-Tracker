import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { AddStudentDialog } from '@/components/AddStudentDialog';
import { EditStudentDialog } from '@/components/EditStudentDialog';
import { DeleteStudentDialog } from '@/components/DeleteStudentDialog';
import { Student } from '@/hooks/useStudents';

interface ClassStudentsProps {
  students: Student[];
  isLoading: boolean;
  classId: string;
}

export const ClassStudents = ({ students, isLoading, classId }: ClassStudentsProps) => {
  return (
    <Card className="border-0 bg-surface/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>Manage your class students</CardDescription>
          </div>
          <AddStudentDialog classId={classId} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-32 h-4 bg-muted rounded"></div>
                    <div className="w-40 h-3 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-6 bg-muted rounded"></div>
                  <div className="w-12 h-8 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No students yet</h3>
            <p className="text-text-secondary mb-4">Start building your class by adding students.</p>
            <AddStudentDialog classId={classId} />
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-surface-secondary transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{student.name}</p>
                    <p className="text-sm text-text-muted">{student.email}</p>
                    <p className="text-xs text-text-muted">ID: {student.student_id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-xs">
                    Student
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <EditStudentDialog student={student} />
                    <DeleteStudentDialog student={student} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};