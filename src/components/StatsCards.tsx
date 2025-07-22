
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart3, Calendar } from "lucide-react";
import { useClasses } from "@/hooks/useClasses";
import { useStudents } from "@/hooks/useStudents";
import { useClassSchedules } from "@/hooks/useClassSchedules";
import { useQuery } from "@tanstack/react-query";
import { getClassStatistics } from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";

const StatsCards = () => {
  const { user } = useAuth();
  const { classes, isLoading: classesLoading } = useClasses();
  const { students, isLoading: studentsLoading } = useStudents();
  const { schedules, isLoading: schedulesLoading } = useClassSchedules();

  const { data: classStats = [] } = useQuery({
    queryKey: ['classStatistics', user?.id],
    queryFn: () => user ? getClassStatistics(user.id) : [],
    enabled: !!user
  });

  if (classesLoading || studentsLoading || schedulesLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="stats-card bg-surface border-border animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="w-20 h-4 bg-muted rounded"></div>
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-16 h-8 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalStudents = students.length;
  const averageAttendance = classStats.length > 0 
    ? Math.round(classStats.reduce((sum, cls) => sum + cls.attendanceRate, 0) / classStats.length)
    : 0;
  const totalClasses = classes.length;
  
  // Calculate today's sessions based on actual class schedules
  const today = new Date();
  const todayDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const todaysSessions = schedules.filter(schedule => {
    const scheduleDate = schedule.start_date ? new Date(schedule.start_date) : null;
    const endDate = schedule.end_date ? new Date(schedule.end_date) : null;
    
    // Check if schedule is for today's day of week
    if (schedule.day_of_week !== todayDayOfWeek) return false;
    
    // Check if today is within the schedule's date range (if specified)
    if (scheduleDate && today < scheduleDate) return false;
    if (endDate && today > endDate) return false;
    
    return true;
  }).length;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      gradient: "gradient-edu-primary"
    },
    {
      title: "Active Classes",
      value: totalClasses,
      icon: BookOpen,
      gradient: "gradient-edu-secondary"
    },
    {
      title: "Average Attendance",
      value: `${averageAttendance}%`,
      icon: BarChart3,
      gradient: "gradient-edu-accent"
    },
    {
      title: "Today's Sessions",
      value: todaysSessions,
      icon: Calendar,
      gradient: "gradient-edu-primary"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="stats-card bg-surface border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs sm:text-sm font-medium text-text-secondary leading-tight">
                {stat.title}
              </CardTitle>
              <div className={`stats-icon ${stat.gradient}`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl sm:text-3xl font-bold text-text-primary">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
