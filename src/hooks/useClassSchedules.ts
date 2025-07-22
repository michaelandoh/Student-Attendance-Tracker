import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

export interface ClassSchedule {
  id: string;
  class_id: string;
  day_of_week: number; // 0 = Sunday, 6 = Saturday
  start_time: string;
  end_time: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateScheduleData {
  class_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  start_date?: string;
  end_date?: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const useClassSchedules = (classId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: schedules = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['class-schedules', classId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('class_schedules')
        .select('*')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (classId) {
        query = query.eq('class_id', classId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ClassSchedule[];
    },
    enabled: !!user
  });

  // Real-time subscription for schedule changes
  useEffect(() => {
    if (!user || !classId) return;

    const channel = supabase
      .channel('class-schedules-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'class_schedules',
          filter: `class_id=eq.${classId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['class-schedules', classId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, classId, queryClient]);

  const createSchedule = useMutation({
    mutationFn: async (scheduleData: CreateScheduleData) => {
      const { data, error } = await supabase
        .from('class_schedules')
        .insert(scheduleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-schedules'] });
      toast.success('Schedule added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add schedule: ${error.message}`);
    }
  });

  const updateSchedule = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ClassSchedule> & { id: string }) => {
      const { data, error } = await supabase
        .from('class_schedules')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-schedules'] });
      toast.success('Schedule updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update schedule: ${error.message}`);
    }
  });

  const deleteSchedule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('class_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-schedules'] });
      toast.success('Schedule deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete schedule: ${error.message}`);
    }
  });

  // Helper function to format schedule summary
  const formatScheduleSummary = (schedules: ClassSchedule[]): string => {
    if (!schedules.length) return 'No schedule set';

    return schedules
      .map(schedule => {
        const day = SHORT_DAYS[schedule.day_of_week];
        const startTime = new Date(`1970-01-01T${schedule.start_time}`).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        const endTime = new Date(`1970-01-01T${schedule.end_time}`).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        return `${day} ${startTime}-${endTime}`;
      })
      .join(', ');
  };

  // Helper function to get next class date
  const getNextClassDate = (schedules: ClassSchedule[]): Date | null => {
    if (!schedules.length) return null;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Find next occurrence
    for (let i = 0; i < 7; i++) {
      const checkDay = (currentDay + i) % 7;
      const todaySchedules = schedules.filter(s => s.day_of_week === checkDay);
      
      for (const schedule of todaySchedules) {
        const [hours, minutes] = schedule.start_time.split(':').map(Number);
        const scheduleTime = hours * 60 + minutes;
        
        if (i > 0 || scheduleTime > currentTime) {
          const nextDate = new Date(now);
          nextDate.setDate(nextDate.getDate() + i);
          nextDate.setHours(hours, minutes, 0, 0);
          return nextDate;
        }
      }
    }

    return null;
  };

  return {
    schedules,
    isLoading,
    error,
    createSchedule: createSchedule.mutate,
    updateSchedule: updateSchedule.mutate,
    deleteSchedule: deleteSchedule.mutate,
    isCreating: createSchedule.isPending,
    isUpdating: updateSchedule.isPending,
    isDeleting: deleteSchedule.isPending,
    formatScheduleSummary,
    getNextClassDate,
    DAYS,
    SHORT_DAYS
  };
};