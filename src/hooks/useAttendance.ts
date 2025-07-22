
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  marked_at: string;
  marked_by?: string;
}

export interface CreateAttendanceData {
  student_id: string;
  class_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface AttendanceWithStudent extends AttendanceRecord {
  students: {
    name: string;
    student_id: string;
  };
}

export const useAttendance = (classId?: string, date?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: attendanceRecords = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['attendance', classId, date],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          students (
            name,
            student_id
          )
        `)
        .order('marked_at', { ascending: false });

      if (classId) {
        query = query.eq('class_id', classId);
      }

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as AttendanceWithStudent[];
    },
    enabled: !!user
  });

  const markAttendance = useMutation({
    mutationFn: async (attendanceData: CreateAttendanceData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('attendance_records')
        .upsert({
          ...attendanceData,
          marked_by: user.id
        }, {
          onConflict: 'student_id,class_id,date'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance marked successfully');
    },
    onError: (error) => {
      toast.error(`Failed to mark attendance: ${error.message}`);
    }
  });

  const bulkMarkAttendance = useMutation({
    mutationFn: async (attendanceRecords: CreateAttendanceData[]) => {
      if (!user) throw new Error('User not authenticated');

      const recordsWithMarkedBy = attendanceRecords.map(record => ({
        ...record,
        marked_by: user.id
      }));

      const { data, error } = await supabase
        .from('attendance_records')
        .upsert(recordsWithMarkedBy, {
          onConflict: 'student_id,class_id,date'
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Bulk attendance marked successfully');
    },
    onError: (error) => {
      toast.error(`Failed to mark bulk attendance: ${error.message}`);
    }
  });

  const updateAttendance = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AttendanceRecord> & { id: string }) => {
      const { data, error } = await supabase
        .from('attendance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update attendance: ${error.message}`);
    }
  });

  const deleteAttendanceRecord = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attendance_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('Attendance record deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete attendance record: ${error.message}`);
    }
  });

  return {
    attendanceRecords,
    isLoading,
    error,
    markAttendance: markAttendance.mutate,
    bulkMarkAttendance: bulkMarkAttendance.mutate,
    updateAttendance: updateAttendance.mutate,
    deleteAttendanceRecord: deleteAttendanceRecord.mutate,
    isMarking: markAttendance.isPending,
    isBulkMarking: bulkMarkAttendance.isPending,
    isUpdating: updateAttendance.isPending,
    isDeleting: deleteAttendanceRecord.isPending
  };
};
