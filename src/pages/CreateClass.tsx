import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Users, Calendar, BookOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '@/components/DashboardHeader';
import { toast } from "sonner";
import { useClasses } from '@/hooks/useClasses';
import { useClassSchedules, CreateScheduleData } from '@/hooks/useClassSchedules';
import { useStudents, CreateStudentData } from '@/hooks/useStudents';
import { CreateClassDetailsForm } from '@/components/create-class/CreateClassDetailsForm';
import { CreateClassScheduleTab } from '@/components/create-class/CreateClassScheduleTab';
import { CreateClassStudentsTab } from '@/components/create-class/CreateClassStudentsTab';
import { CreateClassSidebar } from '@/components/create-class/CreateClassSidebar';

const CreateClass = () => {
  const navigate = useNavigate();
  const { createClass, isCreating } = useClasses();
  const { createSchedule } = useClassSchedules();
  const { createStudent } = useStudents();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '',
    room: ''
  });
  const [students, setStudents] = useState<Omit<CreateStudentData, 'class_id'>[]>([
    { name: '', email: '', student_id: '' }
  ]);
  const [schedules, setSchedules] = useState<Omit<CreateScheduleData, 'class_id'>[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addStudentField = () => {
    setStudents(prev => [...prev, { name: '', email: '', student_id: '' }]);
  };

  const removeStudentField = (index: number) => {
    setStudents(prev => prev.filter((_, i) => i !== index));
  };

  const updateStudentField = (index: number, field: keyof Omit<CreateStudentData, 'class_id'>, value: string) => {
    setStudents(prev => prev.map((student, i) => 
      i === index ? { ...student, [field]: value } : student
    ));
  };

  const addSchedule = (schedule: Omit<CreateScheduleData, 'class_id'>) => {
    setSchedules(prev => [...prev, schedule]);
  };

  const removeSchedule = (index: number) => {
    setSchedules(prev => prev.filter((_, i) => i !== index));
  };

  const formatScheduleSummary = () => {
    if (schedules.length === 0) return 'No schedule set';
    
    const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return schedules
      .map(schedule => {
        const day = SHORT_DAYS[schedule.day_of_week];
        const startTime = new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        return `${day} ${startTime}`;
      })
      .join(', ');
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a class name");
      return;
    }

    // Create the class using the useClasses hook
    createClass(formData, {
      onSuccess: (classData) => {
        // Create schedules for the new class
        if (schedules.length > 0) {
          schedules.forEach(schedule => {
            createSchedule({
              ...schedule,
              class_id: classData.id
            });
          });
        }
        
        // Create students for the new class
        const validStudents = students.filter(student => 
          student.name.trim() && student.email.trim() && student.student_id.trim()
        );
        
        if (validStudents.length > 0) {
          validStudents.forEach(student => {
            createStudent({
              ...student,
              class_id: classData.id
            });
          });
        }
        
        // Navigate back to dashboard after successful creation
        navigate('/dashboard');
      }
    });
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Modern Header */}
          <div className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
            
            {/* Header Content */}
            <div className="relative bg-card/40 backdrop-blur-xl border border-border/30 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-primary/10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                
                {/* Left Section */}
                <div className="flex-1">
                  {/* Back Button */}
                  <div className="mb-6">
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate('/dashboard')}
                      className="group px-3 py-2 hover:bg-primary/10 border border-border/30 rounded-xl transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
                      size="sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-0.5" />
                      <span className="font-medium">Back to Dashboard</span>
                    </Button>
                  </div>

                  {/* Title */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl">
                        <Plus className="w-6 h-6 text-primary" />
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
                        Create New Class
                      </h1>
                    </div>
                    
                    <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl">
                      Set up a new class with schedule, students, and all the details needed to get started
                    </p>
                  </div>
                </div>
                
                {/* Right Section - Progress */}
                <div className="hidden lg:flex flex-col gap-3">
                  <div className="text-xs text-muted-foreground text-right">Creation Progress</div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-primary">In Progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Form Content */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              <Tabs defaultValue="details" className="space-y-8">
                
                {/* Modern Tab Navigation */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl"></div>
                  <TabsList className="relative w-full h-auto p-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-primary/5">
                    <div className="grid w-full grid-cols-3 gap-2">
                      <TabsTrigger 
                        value="details" 
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Class Details</span>
                        <span className="sm:hidden">Details</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="schedule" 
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                      >
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">Schedule</span>
                        <span className="sm:hidden">Schedule</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="students" 
                        className="flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                      >
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Students</span>
                        <span className="sm:hidden">Students</span>
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </div>

                {/* Content Sections with Modern Cards */}
                <div className="min-h-[60vh]">
                  <TabsContent value="details" className="mt-0">
                    <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                      <CreateClassDetailsForm
                        formData={formData}
                        scheduleSummary={formatScheduleSummary()}
                        onInputChange={handleInputChange}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule" className="mt-0">
                    <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                      <CreateClassScheduleTab
                        schedules={schedules}
                        onAddSchedule={addSchedule}
                        onRemoveSchedule={removeSchedule}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="students" className="mt-0">
                    <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                      <CreateClassStudentsTab
                        students={students}
                        onAddStudent={addStudentField}
                        onRemoveStudent={removeStudentField}
                        onUpdateStudentField={updateStudentField}
                      />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Modern Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                <CreateClassSidebar
                  formData={formData}
                  schedules={schedules}
                  students={students}
                  isCreating={isCreating}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClass;