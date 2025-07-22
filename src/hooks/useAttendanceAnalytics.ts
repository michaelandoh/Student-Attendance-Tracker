import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_at: string;
  marked_by?: string;
}

export interface AttendanceAnalytics {
  totalSessions: number;
  averageAttendanceRate: number;
  attendanceTrends: Array<{
    date: string;
    present: number;
    absent: number;
    late: number;
    total: number;
    attendanceRate: number;
  }>;
  studentStats: Array<{
    student_id: string;
    student_name: string;
    totalSessions: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    attendanceRate: number;
  }>;
  riskStudents: Array<{
    student_id: string;
    student_name: string;
    attendanceRate: number;
  }>;
  perfectAttendanceCount: number;
}

export const useAttendanceAnalytics = (classId: string, startDate?: string, endDate?: string) => {
  const { user } = useAuth();

  const {
    data: analytics,
    isLoading,
    error
  } = useQuery({
    queryKey: ['attendanceAnalytics', classId, startDate, endDate],
    queryFn: async (): Promise<AttendanceAnalytics> => {
      if (!user) throw new Error('User not authenticated');

      // Set default date range (last 30 days)
      const defaultEndDate = new Date().toISOString().split('T')[0];
      const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const queryStartDate = startDate || defaultStartDate;
      const queryEndDate = endDate || defaultEndDate;

      // Fetch attendance records for the class within date range
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          students!inner(name, student_id)
        `)
        .eq('class_id', classId)
        .gte('date', queryStartDate)
        .lte('date', queryEndDate)
        .order('date', { ascending: true });

      const { data: attendanceRecords, error: attendanceError } = await query;
      if (attendanceError) throw attendanceError;

      // Fetch all students in the class for comprehensive analysis
      const { data: classStudents, error: studentsError } = await supabase
        .from('students')
        .select('id, name, student_id')
        .eq('class_id', classId);
      
      if (studentsError) throw studentsError;

      // Calculate analytics
      const records = attendanceRecords || [];
      const students = classStudents || [];

      // Group records by date
      const recordsByDate = records.reduce((acc, record) => {
        const date = record.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(record);
        return acc;
      }, {} as Record<string, typeof records>);

      // Calculate attendance trends
      const attendanceTrends = Object.entries(recordsByDate).map(([date, dateRecords]) => {
        const present = dateRecords.filter(r => r.status === 'present').length;
        const absent = dateRecords.filter(r => r.status === 'absent').length;
        const late = dateRecords.filter(r => r.status === 'late').length;
        const total = dateRecords.length;
        const attendanceRate = total > 0 ? ((present + late) / total) * 100 : 0;

        return {
          date,
          present,
          absent,
          late,
          total,
          attendanceRate: Math.round(attendanceRate * 100) / 100
        };
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Calculate student statistics
      const studentStats = students.map(student => {
        const studentRecords = records.filter(r => r.student_id === student.id);
        const presentCount = studentRecords.filter(r => r.status === 'present').length;
        const absentCount = studentRecords.filter(r => r.status === 'absent').length;
        const lateCount = studentRecords.filter(r => r.status === 'late').length;
        const totalSessions = studentRecords.length;
        const attendanceRate = totalSessions > 0 ? ((presentCount + lateCount) / totalSessions) * 100 : 0;

        return {
          student_id: student.id,
          student_name: student.name,
          totalSessions,
          presentCount,
          absentCount,
          lateCount,
          attendanceRate: Math.round(attendanceRate * 100) / 100
        };
      });

      // Calculate overall metrics
      const totalSessions = Object.keys(recordsByDate).length;
      const averageAttendanceRate = attendanceTrends.length > 0 
        ? attendanceTrends.reduce((sum, trend) => sum + trend.attendanceRate, 0) / attendanceTrends.length 
        : 0;

      // Identify at-risk students (attendance rate < 80%)
      const riskStudents = studentStats
        .filter(student => student.attendanceRate < 80 && student.totalSessions > 0)
        .map(student => ({
          student_id: student.student_id,
          student_name: student.student_name,
          attendanceRate: student.attendanceRate
        }))
        .sort((a, b) => a.attendanceRate - b.attendanceRate);

      // Count students with perfect attendance (100%)
      const perfectAttendanceCount = studentStats.filter(
        student => student.attendanceRate === 100 && student.totalSessions > 0
      ).length;

      return {
        totalSessions,
        averageAttendanceRate: Math.round(averageAttendanceRate * 100) / 100,
        attendanceTrends,
        studentStats,
        riskStudents,
        perfectAttendanceCount
      };
    },
    enabled: !!user && !!classId
  });

  return {
    analytics,
    isLoading,
    error
  };
};