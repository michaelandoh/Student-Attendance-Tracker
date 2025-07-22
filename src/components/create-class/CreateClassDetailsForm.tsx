import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateClassDetailsFormProps {
  formData: {
    name: string;
    description: string;
    schedule: string;
    room: string;
  };
  scheduleSummary: string;
  onInputChange: (field: string, value: string) => void;
}

export const CreateClassDetailsForm = ({ 
  formData, 
  scheduleSummary, 
  onInputChange 
}: CreateClassDetailsFormProps) => {
  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Class Information</CardTitle>
        <CardDescription>
          Enter the basic details for your new class
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="className">Class Name *</Label>
          <Input
            id="className"
            placeholder="e.g., Mathematics 101"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            className="border-gray-200 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the class..."
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            className="border-gray-200 focus:border-blue-500"
            rows={3}
          />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="schedule">Schedule Summary (Auto-generated)</Label>
            <Input
              id="schedule"
              value={scheduleSummary}
              readOnly
              className="border-gray-200 bg-gray-50"
              placeholder="Use Schedule tab to set class times"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="room">Room/Location</Label>
            <Input
              id="room"
              placeholder="e.g., Room 101, Building A"
              value={formData.room}
              onChange={(e) => onInputChange('room', e.target.value)}
              className="border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};