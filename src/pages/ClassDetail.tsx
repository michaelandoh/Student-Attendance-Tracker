
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from '@/components/DashboardHeader';
import { ClassHeader } from '@/components/class/ClassHeader';
import { ClassAttendance } from '@/components/class/ClassAttendance';
import { ClassStudents } from '@/components/class/ClassStudents';
import { ClassAnalytics } from '@/components/class/ClassAnalytics';
import { ClassSettings } from '@/components/class/ClassSettings';
import { ClassScheduleCalendar } from '@/components/class/ClassScheduleCalendar';
import { useStudents } from '@/hooks/useStudents';
import { useClasses } from '@/hooks/useClasses';

const ClassDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch real data from Supabase
  const { classes } = useClasses();
  const { students, isLoading: studentsLoading } = useStudents(id);
  
  const classData = classes.find(cls => cls.id === id);
  
  if (!classData) {
    return (
      <div className="min-h-screen bg-gradient-education">
        <DashboardHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Class not found</h1>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <ClassHeader 
            classData={classData}
            studentCount={students.length}
            onBack={() => navigate('/dashboard')}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full">
          <Tabs defaultValue="schedule" className="space-y-8">
            {/* Modern Tab Navigation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl"></div>
              <TabsList className="relative w-full h-auto p-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-primary/5">
                <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  <TabsTrigger 
                    value="schedule" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger 
                    value="attendance" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="students" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Students
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50 col-span-2 sm:col-span-1"
                  >
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50 col-span-2 sm:col-span-1 lg:col-span-1"
                  >
                    Settings
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            {/* Content Sections with Modern Cards */}
            <div className="min-h-[70vh]">
              <TabsContent value="schedule" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <ClassScheduleCalendar classId={id!} />
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <ClassAttendance students={students} isLoading={studentsLoading} classId={id!} />
                </div>
              </TabsContent>

              <TabsContent value="students" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <ClassStudents students={students} isLoading={studentsLoading} classId={id!} />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <ClassAnalytics classId={id!} studentCount={students.length} />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <ClassSettings classData={classData} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
