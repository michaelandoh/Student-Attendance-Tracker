import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { CreateStudentData } from "@/hooks/useStudents";

interface CreateClassSidebarProps {
  formData: {
    name: string;
    description: string;
    schedule: string;
    room: string;
  };
  schedules: any[];
  students: Omit<CreateStudentData, 'class_id'>[];
  isCreating: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export const CreateClassSidebar = ({ 
  formData, 
  schedules, 
  students, 
  isCreating, 
  onSave, 
  onCancel 
}: CreateClassSidebarProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm sticky top-24">
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>
          Save your class when ready
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={onSave}
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isCreating ? 'Creating...' : 'Create Class'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="w-full border-gray-200 hover:bg-gray-50"
          disabled={isCreating}
        >
          Cancel
        </Button>
        
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-2">Progress:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className={formData.name ? "text-green-600" : ""}>
              • {formData.name ? "✓" : "○"} Class name
            </li>
            <li className={schedules.length > 0 ? "text-green-600" : ""}>
              • {schedules.length > 0 ? "✓" : "○"} Schedule ({schedules.length} time slots)
            </li>
            <li className={students.some(s => s.name.trim() && s.email.trim() && s.student_id.trim()) ? "text-green-600" : ""}>
              • {students.some(s => s.name.trim() && s.email.trim() && s.student_id.trim()) ? "✓" : "○"} Students ({students.filter(s => s.name.trim()).length} added)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};