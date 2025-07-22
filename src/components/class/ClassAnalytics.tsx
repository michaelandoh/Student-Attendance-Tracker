import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, TrendingUp, TrendingDown, Users, Calendar, AlertTriangle, BarChart3 } from "lucide-react";
import AttendanceChart from '@/components/AttendanceChart';
import { useAttendanceAnalytics } from '@/hooks/useAttendanceAnalytics';

interface ClassAnalyticsProps {
  classId: string;
  studentCount: number;
}

export const ClassAnalytics = ({ classId, studentCount }: ClassAnalyticsProps) => {
  const { analytics, isLoading, error } = useAttendanceAnalytics(classId);

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="border-0 bg-surface/80 backdrop-blur-sm animate-pulse">
            <CardHeader>
              <div className="w-32 h-6 bg-muted rounded"></div>
              <div className="w-48 h-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-48 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-text-secondary">Failed to load analytics data</p>
            <p className="text-text-muted text-sm">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="border-0 bg-surface/80 backdrop-blur-sm">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-text-secondary">No analytics data available</p>
            <p className="text-text-muted text-sm">Start taking attendance to see analytics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for the chart (last 10 sessions)
  const chartData = analytics.attendanceTrends.slice(-10).map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    present: trend.present,
    absent: trend.absent,
    late: trend.late || 0
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Sessions</p>
                <p className="text-2xl font-bold text-text-primary">{analytics.totalSessions}</p>
              </div>
              <Calendar className="w-8 h-8 text-edu-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Avg. Attendance</p>
                <p className="text-2xl font-bold text-text-primary">{analytics.averageAttendanceRate}%</p>
              </div>
              {analytics.averageAttendanceRate >= 80 ? (
                <TrendingUp className="w-8 h-8 text-edu-green" />
              ) : (
                <TrendingDown className="w-8 h-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Perfect Attendance</p>
                <p className="text-2xl font-bold text-text-primary">{analytics.perfectAttendanceCount}</p>
              </div>
              <Users className="w-8 h-8 text-edu-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-surface/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">At Risk Students</p>
                <p className="text-2xl font-bold text-text-primary">{analytics.riskStudents.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Attendance Trends Chart */}
        <Card className="border-0 bg-surface/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>
              {chartData.length > 0 ? 'Daily attendance over the last 10 sessions' : 'No attendance data available'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <AttendanceChart data={chartData} />
            ) : (
              <div className="flex items-center justify-center h-48">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-text-muted">No attendance records found</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Class Statistics */}
        <Card className="border-0 bg-surface/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Class Statistics</CardTitle>
            <CardDescription>Overall performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total Students</span>
              <span className="font-semibold text-text-primary">{studentCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total Sessions</span>
              <span className="font-semibold text-text-primary">{analytics.totalSessions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Average Attendance</span>
              <span className="font-semibold text-text-primary">{analytics.averageAttendanceRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Perfect Attendance</span>
              <span className="font-semibold text-edu-green">{analytics.perfectAttendanceCount} students</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">At Risk Students</span>
              <span className="font-semibold text-destructive">{analytics.riskStudents.length} students</span>
            </div>
            
            {/* At Risk Students List */}
            {analytics.riskStudents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-text-primary mb-2">Students at Risk:</p>
                <div className="space-y-2">
                  {analytics.riskStudents.slice(0, 3).map((student) => (
                    <div key={student.student_id} className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary truncate">{student.student_name}</span>
                      <Badge variant="destructive" className="text-xs">
                        {student.attendanceRate}%
                      </Badge>
                    </div>
                  ))}
                  {analytics.riskStudents.length > 3 && (
                    <p className="text-xs text-text-muted">
                      +{analytics.riskStudents.length - 3} more students
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <Button className="w-full mt-4 bg-gradient-primary hover:bg-gradient-primary/90 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};