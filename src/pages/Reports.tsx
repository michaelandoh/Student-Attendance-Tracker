import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Calendar, Users, TrendingUp, TrendingDown, Clock, BarChart3, PieChart, FileText, Filter } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import { useClasses } from "@/hooks/useClasses";
import { useStudents } from "@/hooks/useStudents";
import { useAttendanceAnalytics } from "@/hooks/useAttendanceAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, subWeeks, subMonths } from "date-fns";

interface ReportFilters {
  classId: string | null;
  dateRange: string;
  reportType: string;
}

const Reports = () => {
  const navigate = useNavigate();
  const { classes } = useClasses();
  const [filters, setFilters] = useState<ReportFilters>({
    classId: null,
    dateRange: "7d",
    reportType: "attendance"
  });

  // Get students for selected class
  const { students } = useStudents(filters.classId);
  const { analytics, isLoading } = useAttendanceAnalytics(filters.classId);

  const getDateRangeText = (range: string) => {
    const today = new Date();
    switch (range) {
      case "7d": return `${format(subDays(today, 7), "MMM dd")} - ${format(today, "MMM dd")}`;
      case "30d": return `${format(subDays(today, 30), "MMM dd")} - ${format(today, "MMM dd")}`;
      case "3m": return `${format(subMonths(today, 3), "MMM dd")} - ${format(today, "MMM dd")}`;
      default: return "All time";
    }
  };

  const handleExportReport = async () => {
    try {
      let csvContent = "";
      let filename = "";
      
      if (filters.reportType === "attendance" && filters.classId) {
        // Export detailed attendance data for selected class
        const { data: attendanceRecords, error } = await supabase
          .from('attendance_records')
          .select(`
            id,
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
          .eq('class_id', filters.classId)
          .order('date', { ascending: false })
          .order('marked_at', { ascending: false });

        if (error) {
          console.error('Error fetching attendance data:', error);
          return;
        }

        const headers = "Student Name,Student ID,Email,Date,Status,Marked At,Marked By\n";
        const rows = attendanceRecords?.map((record: any) => {
          const date = format(new Date(record.date), "yyyy-MM-dd");
          const markedAt = format(new Date(record.marked_at), "yyyy-MM-dd HH:mm:ss");
          const markedBy = record.marked_by_profile?.full_name || 
                          record.marked_by_profile?.email || 
                          (record.marked_by ? 'Unknown User' : 'System');
          return `"${record.students.name}","${record.students.student_id}","${record.students.email}","${date}","${record.status}","${markedAt}","${markedBy}"`;
        }).join("\n") || "";

        csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        filename = `attendance_${selectedClass?.name.replace(/[^a-z0-9]/gi, '_')}_${filters.dateRange}.csv`;
        
      } else if (filters.reportType === "performance" && analytics) {
        // Export student performance summary
        const headers = "Student Name,Student ID,Total Sessions,Present,Absent,Late,Attendance Rate\n";
        const rows = analytics.studentStats.map(student => 
          `"${student.student_name}","${student.student_id}","${student.totalSessions}","${student.presentCount}","${student.absentCount}","${student.lateCount}","${student.attendanceRate}%"`
        ).join("\n");

        csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        filename = `performance_${selectedClass?.name.replace(/[^a-z0-9]/gi, '_') || 'all_classes'}_${filters.dateRange}.csv`;
        
      } else if (filters.reportType === "trends" && analytics) {
        // Export attendance trends data
        const headers = "Date,Total Students,Present,Absent,Late,Attendance Rate\n";
        const rows = analytics.attendanceTrends.map(trend => 
          `"${format(new Date(trend.date), "yyyy-MM-dd")}","${trend.total}","${trend.present}","${trend.absent}","${trend.late}","${trend.attendanceRate}%"`
        ).join("\n");

        csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        filename = `trends_${selectedClass?.name.replace(/[^a-z0-9]/gi, '_') || 'all_classes'}_${filters.dateRange}.csv`;
        
      } else {
        // Default export - summary report
        const classInfo = selectedClass || { name: 'All Classes' };
        const presentCount = analytics?.studentStats.reduce((sum, student) => sum + student.presentCount, 0) || 0;
        const absentCount = analytics?.studentStats.reduce((sum, student) => sum + student.absentCount, 0) || 0;
        const lateCount = analytics?.studentStats.reduce((sum, student) => sum + student.lateCount, 0) || 0;
        
        const headers = "Report Type,Class,Date Range,Total Students,Present Records,Absent Records,Late Records,Average Attendance Rate,Generated At\n";
        const row = `"${filters.reportType}","${classInfo.name}","${getDateRangeText(filters.dateRange)}","${students.length}","${presentCount}","${absentCount}","${lateCount}","${analytics?.averageAttendanceRate || 0}%","${format(new Date(), "yyyy-MM-dd HH:mm:ss")}"`;
        
        csvContent = "data:text/csv;charset=utf-8," + headers + row;
        filename = `summary_${filters.reportType}_${filters.dateRange}.csv`;
      }

      if (!csvContent) {
        console.error('No data to export');
        return;
      }
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", filename);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Export completed successfully');
      
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const selectedClass = classes.find(c => c.id === filters.classId);

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
                        <BarChart3 className="w-6 h-6 text-primary" />
                      </div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent leading-tight">
                        Reports & Analytics
                      </h1>
                    </div>
                    
                    <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-2xl">
                      Generate comprehensive insights and export detailed data from your classes
                    </p>
                  </div>
                </div>
                
                {/* Right Section - Export Button */}
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleExportReport}
                    className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 rounded-xl px-6 py-3 font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <Download className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10 whitespace-nowrap">Export Report</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Filters */}
        <div className="relative mb-8">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl"></div>
          
          <Card className="relative bg-card/50 backdrop-blur-sm border border-border/40 rounded-3xl shadow-xl shadow-primary/5">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                  <Filter className="w-5 h-5 text-primary" />
                </div>
                <span>Report Filters</span>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Customize your report parameters and data range
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    Class
                  </label>
                  <Select value={filters.classId || "all"} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, classId: value === "all" ? null : value }))
                  }>
                    <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-xl hover:bg-muted/50 transition-all duration-200">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-border/40 rounded-xl shadow-2xl">
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    Date Range
                  </label>
                  <Select value={filters.dateRange} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, dateRange: value }))
                  }>
                    <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-xl hover:bg-muted/50 transition-all duration-200">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-border/40 rounded-xl shadow-2xl">
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="3m">Last 3 months</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-1 h-4 bg-primary rounded-full"></div>
                    Report Type
                  </label>
                  <Select value={filters.reportType} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, reportType: value }))
                  }>
                    <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-xl hover:bg-muted/50 transition-all duration-200">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-xl border-border/40 rounded-xl shadow-2xl">
                      <SelectItem value="attendance">Attendance Summary</SelectItem>
                      <SelectItem value="performance">Performance Analysis</SelectItem>
                      <SelectItem value="trends">Attendance Trends</SelectItem>
                      <SelectItem value="detailed">Detailed Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Selected Period:</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {getDateRangeText(filters.dateRange)}
                  </Badge>
                </div>
                {selectedClass && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Selected Class:</span>
                    <Badge variant="outline" className="border-border/40 bg-background/50">
                      {selectedClass.name}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
          <Tabs defaultValue="overview" className="space-y-8">
            {/* Modern Tab Navigation */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-2xl"></div>
              <TabsList className="relative w-full h-auto p-2 bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-primary/5">
                <div className="grid w-full grid-cols-4 gap-2">
                  <TabsTrigger 
                    value="overview" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="attendance" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="performance" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Performance
                  </TabsTrigger>
                  <TabsTrigger 
                    value="detailed" 
                    className="flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 hover:bg-muted/50"
                  >
                    Detailed
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>

            {/* Content Sections with Modern Cards */}
            <div className="min-h-[60vh]">
              <TabsContent value="overview" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="bg-background/50 border border-border/40 rounded-2xl shadow-lg shadow-primary/5">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-foreground">
                              {filters.classId ? 1 : classes.length}
                            </div>
                            <div className="p-2 bg-blue-100 rounded-xl">
                              <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-background/50 border border-border/40 rounded-2xl shadow-lg shadow-primary/5">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-foreground">
                              {students.length}
                            </div>
                            <div className="p-2 bg-purple-100 rounded-xl">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-background/50 border border-border/40 rounded-2xl shadow-lg shadow-primary/5">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Avg Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-foreground">
                              {analytics?.averageAttendanceRate ? `${analytics.averageAttendanceRate.toFixed(1)}%` : '--'}
                            </div>
                            <div className="p-2 bg-green-100 rounded-xl">
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-background/50 border border-border/40 rounded-2xl shadow-lg shadow-primary/5">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Report Period</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold text-foreground">
                              {filters.dateRange === "7d" ? "7 Days" : 
                               filters.dateRange === "30d" ? "30 Days" : 
                               filters.dateRange === "3m" ? "3 Months" : "All Time"}
                            </div>
                            <div className="p-2 bg-orange-100 rounded-xl">
                              <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="bg-background/50 border border-border/40 rounded-2xl shadow-lg shadow-primary/5">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                              <BarChart3 className="w-5 h-5 text-primary" />
                            </div>
                            <span>Quick Stats</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                            <span className="text-green-700 font-medium">Present Records</span>
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              {analytics?.studentStats.reduce((sum, student) => sum + student.presentCount, 0) || 0}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-200">
                            <span className="text-red-700 font-medium">Absent Records</span>
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              {analytics?.studentStats.reduce((sum, student) => sum + student.absentCount, 0) || 0}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                            <span className="text-yellow-700 font-medium">Late Records</span>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              {analytics?.studentStats.reduce((sum, student) => sum + student.lateCount, 0) || 0}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-background/50 border border-border/40 rounded-2xl shadow-lg shadow-primary/5">
                        <CardHeader className="pb-6">
                          <CardTitle className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                              <PieChart className="w-5 h-5 text-primary" />
                            </div>
                            <span>Report Actions</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 bg-background/50 border-border/40 hover:bg-muted/50 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                            onClick={handleExportReport}
                          >
                            <FileText className="w-4 h-4 mr-3" />
                            Export Current Report
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 bg-background/50 border-border/40 hover:bg-muted/50 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                            onClick={() => navigate('/dashboard')}
                          >
                            <BarChart3 className="w-4 h-4 mr-3" />
                            View Live Analytics
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-12 bg-background/50 border-border/40 hover:bg-muted/50 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
                            disabled={!filters.classId}
                            onClick={() => filters.classId && navigate(`/class/${filters.classId}`)}
                          >
                            <Users className="w-4 h-4 mr-3" />
                            Manage Selected Class
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendance" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-foreground mb-2">Attendance Summary</h3>
                      <p className="text-muted-foreground">
                        Detailed attendance breakdown for {selectedClass?.name || "all classes"}
                      </p>
                    </div>
                    
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-t-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading attendance data...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200 shadow-lg">
                            <div className="text-3xl font-bold text-green-700 mb-2">
                              {analytics?.studentStats.reduce((sum, student) => sum + student.presentCount, 0) || 0}
                            </div>
                            <div className="text-green-600 font-medium">Present</div>
                          </div>
                          <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-200 shadow-lg">
                            <div className="text-3xl font-bold text-red-700 mb-2">
                              {analytics?.studentStats.reduce((sum, student) => sum + student.absentCount, 0) || 0}
                            </div>
                            <div className="text-red-600 font-medium">Absent</div>
                          </div>
                          <div className="text-center p-6 bg-yellow-50 rounded-2xl border border-yellow-200 shadow-lg">
                            <div className="text-3xl font-bold text-yellow-700 mb-2">
                              {analytics?.studentStats.reduce((sum, student) => sum + student.lateCount, 0) || 0}
                            </div>
                            <div className="text-yellow-600 font-medium">Late</div>
                          </div>
                        </div>
                        
                        {analytics && (
                          <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
                            <h4 className="font-bold text-foreground mb-4 text-lg">Overall Attendance Rate</h4>
                            <div className="w-full bg-background/50 rounded-full h-3 mb-3">
                              <div 
                                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                                style={{ width: `${analytics.averageAttendanceRate}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {analytics.averageAttendanceRate.toFixed(1)}% attendance rate across all sessions
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <div className="text-center py-16">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-muted/50 to-muted rounded-3xl flex items-center justify-center mb-6 border border-border/30">
                      <TrendingUp className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      Performance Analytics Coming Soon
                    </h3>
                    <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
                      Advanced performance metrics and trend analysis will be available here to help you understand student engagement patterns.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="mt-0">
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/40 p-6 lg:p-8 shadow-xl shadow-primary/5">
                  <div className="text-center py-16">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-muted/50 to-muted rounded-3xl flex items-center justify-center mb-6 border border-border/30">
                      <FileText className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      Detailed Reports
                    </h3>
                    <p className="text-muted-foreground mb-8 leading-relaxed max-w-md mx-auto">
                      Generate comprehensive reports with student-level breakdowns and historical data analysis.
                    </p>
                    <Button 
                      onClick={handleExportReport}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl px-8 py-3 font-semibold shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 border-0"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate Detailed Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Reports;