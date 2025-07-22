
import { supabase } from '@/integrations/supabase/client';

// Generic error handler for Supabase operations
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  if (error?.code === 'PGRST116') {
    return 'No data found';
  }
  
  if (error?.code === '23505') {
    return 'This record already exists';
  }
  
  if (error?.code === '23503') {
    return 'Cannot delete: record is referenced by other data';
  }
  
  return error?.message || 'An unexpected error occurred';
};

// Attendance analytics service
export const getAttendanceAnalytics = async (classId: string, startDate?: string, endDate?: string) => {
  try {
    let query = supabase
      .from('attendance_records')
      .select(`
        *,
        students (name, student_id)
      `)
      .eq('class_id', classId);

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Calculate attendance statistics
    const totalRecords = data.length;
    const presentCount = data.filter(record => record.status === 'present').length;
    const absentCount = data.filter(record => record.status === 'absent').length;
    const lateCount = data.filter(record => record.status === 'late').length;

    const attendanceRate = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

    return {
      data,
      analytics: {
        totalRecords,
        presentCount,
        absentCount,
        lateCount,
        attendanceRate: Math.round(attendanceRate * 100) / 100
      }
    };
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

// Get class statistics
export const getClassStatistics = async (instructorId: string) => {
  try {
    // Get all classes for instructor
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select('id, name')
      .eq('instructor_id', instructorId);

    if (classesError) throw classesError;

    // Get student count per class
    const classStats = await Promise.all(
      classes.map(async (classItem) => {
        const { data: students, error: studentsError } = await supabase
          .from('students')
          .select('id')
          .eq('class_id', classItem.id);

        if (studentsError) throw studentsError;

        // Get recent attendance rate for this class
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: attendance, error: attendanceError } = await supabase
          .from('attendance_records')
          .select('status')
          .eq('class_id', classItem.id)
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

        if (attendanceError) throw attendanceError;

        const presentCount = attendance.filter(record => record.status === 'present').length;
        const attendanceRate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;

        return {
          id: classItem.id,
          name: classItem.name,
          students: students.length,
          attendanceRate: Math.round(attendanceRate * 100) / 100
        };
      })
    );

    return classStats;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

// Bulk import students
export const bulkImportStudents = async (students: Array<{
  name: string;
  email: string;
  student_id: string;
  class_id: string;
}>) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .insert(students)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};

// Bulk mark attendance
export const bulkMarkAttendance = async (attendanceRecords: Array<{
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_by: string;
}>) => {
  try {
    const { data, error } = await supabase
      .from('attendance_records')
      .upsert(attendanceRecords, {
        onConflict: 'student_id,class_id,date'
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    throw new Error(handleSupabaseError(error));
  }
};
