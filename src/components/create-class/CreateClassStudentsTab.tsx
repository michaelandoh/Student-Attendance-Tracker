import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, User, Mail, Hash } from "lucide-react";
import { CreateStudentData } from "@/hooks/useStudents";

interface CreateClassStudentsTabProps {
  students: Omit<CreateStudentData, 'class_id'>[];
  onAddStudent: () => void;
  onRemoveStudent: (index: number) => void;
  onUpdateStudentField: (index: number, field: keyof Omit<CreateStudentData, 'class_id'>, value: string) => void;
}

export const CreateClassStudentsTab = ({ 
  students, 
  onAddStudent, 
  onRemoveStudent, 
  onUpdateStudentField 
}: CreateClassStudentsTabProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Student Roster</CardTitle>
            <CardDescription>
              Add students to your class (you can add more later)
            </CardDescription>
          </div>
          <Button 
            onClick={onAddStudent}
            variant="outline"
            size="sm"
            className="border-blue-200 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {students.map((student, index) => (
            <div key={index} className="p-4 bg-card/50 rounded-xl border border-border/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student {index + 1}
                </h4>
                {students.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveStudent(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Full Name
                  </Label>
                  <Input
                    id={`name-${index}`}
                    placeholder="Enter student name"
                    value={student.name}
                    onChange={(e) => onUpdateStudentField(index, 'name', e.target.value)}
                    className="border-border/40 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`email-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email Address
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="student@example.com"
                    value={student.email}
                    onChange={(e) => onUpdateStudentField(index, 'email', e.target.value)}
                    className="border-border/40 focus:border-primary"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`student-id-${index}`} className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Student ID
                  </Label>
                  <Input
                    id={`student-id-${index}`}
                    placeholder="Enter student ID"
                    value={student.student_id}
                    onChange={(e) => onUpdateStudentField(index, 'student_id', e.target.value)}
                    className="border-border/40 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};