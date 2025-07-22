
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Class {
  id: string;
  name: string;
  description?: string;
  instructor_id: string;
  schedule?: string;
  room?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClassData {
  name: string;
  description?: string;
  schedule?: string;
  room?: string;
}

export const useClasses = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: classes = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['classes', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Class[];
    },
    enabled: !!user
  });

  const createClassMutation = useMutation({
    mutationFn: async (classData: CreateClassData) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('classes')
        .insert({
          ...classData,
          instructor_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create class: ${error.message}`);
    }
  });

  const updateClass = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Class> & { id: string }) => {
      const { data, error } = await supabase
        .from('classes')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update class: ${error.message}`);
    }
  });

  const deleteClass = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast.success('Class deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete class: ${error.message}`);
    }
  });

  // Updated createClass function to accept options parameter
  const createClass = (classData: CreateClassData, options?: { onSuccess?: (classData: Class) => void }) => {
    createClassMutation.mutate(classData, {
      onSuccess: (data) => {
        // Call the custom onSuccess if provided with the created class data
        options?.onSuccess?.(data);
      }
    });
  };

  return {
    classes,
    isLoading,
    error,
    createClass,
    updateClass: updateClass.mutate,
    deleteClass: deleteClass.mutate,
    isCreating: createClassMutation.isPending,
    isUpdating: updateClass.isPending,
    isDeleting: deleteClass.isPending
  };
};
