import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase';
import { queryKeys } from '../queryClient';
import { useAuth } from '../../hooks/useAuth';

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

/**
 * Fetch all user documents
 */
async function fetchDocuments(userId: string): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch single document by ID
 */
async function fetchDocument(documentId: string): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Hook to fetch all user documents
 */
export function useDocuments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.documents,
    queryFn: () => fetchDocuments(user!.id),
    enabled: !!user,
  });
}

/**
 * Hook to fetch single document
 */
export function useDocument(documentId: string) {
  return useQuery({
    queryKey: queryKeys.document(documentId),
    queryFn: () => fetchDocument(documentId),
    enabled: !!documentId,
  });
}

/**
 * Hook to create document record
 */
export function useCreateDocument() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentData: Partial<Document>) => {
      const { data, error } = await supabase
        .from('documents')
        .insert([{ ...documentData, userId: user!.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
  });
}

/**
 * Hook to delete document
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.documents });
    },
  });
}
