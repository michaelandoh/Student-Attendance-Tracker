
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Student {
  id: string;
  name: string;
  email: string;
  student_id: string;
  class_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStudentData {
  name: string;
  email: string;
  student_id: string;
  class_id: string;
}

export const useStudents = (classId?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: students = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['students', classId],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      let query = supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true });

      if (classId) {
        query = query.eq('class_id', classId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Student[];
    },
    enabled: !!user
  });

  const createStudent = useMutation({
    mutationFn: async (studentData: CreateStudentData) => {
      const { data, error } = await supabase
        .from('students')
        .insert(studentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student added successfully');
    },
    onError: (error) => {
      toast.error(`Failed to add student: ${error.message}`);
    }
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Student> & { id: string }) => {
      const { data, error } = await supabase
        .from('students')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update student: ${error.message}`);
    }
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student removed successfully');
    },
    onError: (error) => {
      toast.error(`Failed to remove student: ${error.message}`);
    }
  });

  return {
    students,
    isLoading,
    error,
    createStudent: createStudent.mutate,
    updateStudent: updateStudent.mutate,
    deleteStudent: deleteStudent.mutate,
    isCreating: createStudent.isPending,
    isUpdating: updateStudent.isPending,
    isDeleting: deleteStudent.isPending
  };
};
