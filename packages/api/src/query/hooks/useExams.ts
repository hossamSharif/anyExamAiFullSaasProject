import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase';
import { queryKeys } from '../queryClient';
import { useAuth } from '../../hooks/useAuth';

export interface Exam {
  id: string;
  userId: string;
  title: string;
  questionCount: number;
  difficulty: string;
  status: 'draft' | 'completed';
  score?: number;
  language: 'ar' | 'en';
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Fetch all user exams
 */
async function fetchExams(userId: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch single exam by ID
 */
async function fetchExam(examId: string): Promise<Exam> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('id', examId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch exam history (completed exams only)
 */
async function fetchExamHistory(userId: string): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('userId', userId)
    .eq('status', 'completed')
    .order('completedAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Hook to fetch all user exams
 */
export function useExams() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.exams,
    queryFn: () => fetchExams(user!.id),
    enabled: !!user,
  });
}

/**
 * Hook to fetch single exam
 */
export function useExam(examId: string) {
  return useQuery({
    queryKey: queryKeys.exam(examId),
    queryFn: () => fetchExam(examId),
    enabled: !!examId,
  });
}

/**
 * Hook to fetch exam history
 */
export function useExamHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.examHistory,
    queryFn: () => fetchExamHistory(user!.id),
    enabled: !!user,
  });
}

/**
 * Hook to create exam
 */
export function useCreateExam() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examData: Partial<Exam>) => {
      const { data, error } = await supabase
        .from('exams')
        .insert([{ ...examData, userId: user!.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams });
    },
  });
}

/**
 * Hook to update exam
 */
export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ examId, updates }: { examId: string; updates: Partial<Exam> }) => {
      const { data, error } = await supabase
        .from('exams')
        .update(updates)
        .eq('id', examId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.exams });
      queryClient.invalidateQueries({ queryKey: queryKeys.exam(data.id) });
    },
  });
}
