/**
 * Document Hooks
 *
 * React hooks for document upload and management with Pro tier checks
 */

import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  uploadDocument,
  getUserDocuments,
  getDocument,
  deleteDocument,
  subscribeToDocumentStatus,
  type Document,
  type DocumentUploadResult,
} from '../documents';
import { useUsageTracking } from './useUsageTracking';
import { usePaywall } from './usePaywall';

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

/**
 * Hook for uploading documents with Pro tier check and progress tracking
 *
 * @example
 * ```tsx
 * const { uploadFile, uploading, progress } = useDocumentUpload();
 *
 * // Upload a file
 * const result = await uploadFile(file, 'document.pdf', 'application/pdf', 1024000);
 * ```
 */
export function useDocumentUpload() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { canUploadDocument, trackDocumentUpload, tier } = useUsageTracking();
  const { showPaywall } = usePaywall();
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      file,
      fileName,
      fileType,
      fileSize,
    }: {
      file: File | { uri: string; type: string };
      fileName: string;
      fileType: string;
      fileSize: number;
    }) => {
      // Check if user has Pro tier (free tier cannot upload)
      if (tier !== 'pro') {
        showPaywall('document');
        throw new Error(
          t('documents.proRequired', {
            defaultValue: 'رفع المستندات متاح فقط للمشتركين في النسخة الاحترافية',
          })
        );
      }

      // Check usage limits for Pro tier
      if (!canUploadDocument()) {
        showPaywall('document');
        throw new Error(
          t('documents.limitReached', {
            defaultValue: 'لقد وصلت إلى الحد الأقصى من المستندات هذا الشهر',
          })
        );
      }

      // Set uploading status
      setProgress({
        fileName,
        progress: 0,
        status: 'uploading',
      });

      // Upload document
      const result = await uploadDocument(file, fileName, fileType, fileSize);

      // Track usage
      await trackDocumentUpload();

      // Set processing status
      setProgress({
        fileName,
        progress: 100,
        status: 'processing',
      });

      return result;
    },
    onSuccess: (data) => {
      // Invalidate queries to refetch documents
      queryClient.invalidateQueries({ queryKey: ['documents'] });

      // Set completed status
      setProgress({
        fileName: data.fileName,
        progress: 100,
        status: 'completed',
      });

      // Clear progress after 2 seconds
      setTimeout(() => setProgress(null), 2000);
    },
    onError: (error) => {
      setProgress((prev) =>
        prev
          ? {
              ...prev,
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed',
            }
          : null
      );

      // Clear progress after 3 seconds
      setTimeout(() => setProgress(null), 3000);
    },
  });

  const uploadFile = useCallback(
    async (
      file: File | { uri: string; type: string },
      fileName: string,
      fileType: string,
      fileSize: number
    ): Promise<DocumentUploadResult | null> => {
      try {
        const result = await mutation.mutateAsync({
          file,
          fileName,
          fileType,
          fileSize,
        });
        return result;
      } catch (error) {
        console.error('Upload error:', error);
        return null;
      }
    },
    [mutation]
  );

  return {
    uploadFile,
    uploading: mutation.isPending,
    progress,
    error: mutation.error,
    reset: mutation.reset,
  };
}

/**
 * Hook for fetching user's documents
 *
 * @example
 * ```tsx
 * const { documents, loading, refetch } = useUserDocuments();
 * ```
 */
export function useUserDocuments() {
  const query = useQuery({
    queryKey: ['documents'],
    queryFn: getUserDocuments,
    staleTime: 30000, // 30 seconds
  });

  return {
    documents: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook for fetching a single document with realtime updates
 *
 * @example
 * ```tsx
 * const { document, loading } = useDocument('document-id');
 * ```
 */
export function useDocument(documentId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => (documentId ? getDocument(documentId) : null),
    enabled: !!documentId,
  });

  // Subscribe to realtime updates
  useEffect(() => {
    if (!documentId) return;

    const unsubscribe = subscribeToDocumentStatus(documentId, (updatedDoc) => {
      // Update query cache
      queryClient.setQueryData(['document', documentId], updatedDoc);

      // Also update in documents list
      queryClient.setQueryData<Document[]>(['documents'], (old) => {
        if (!old) return old;
        return old.map((doc) => (doc.id === documentId ? updatedDoc : doc));
      });
    });

    return unsubscribe;
  }, [documentId, queryClient]);

  return {
    document: query.data,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Hook for deleting a document
 *
 * @example
 * ```tsx
 * const { deleteDoc, deleting } = useDeleteDocument();
 *
 * await deleteDoc('document-id');
 * ```
 */
export function useDeleteDocument() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const deleteDoc = useCallback(
    async (documentId: string): Promise<boolean> => {
      try {
        await mutation.mutateAsync(documentId);
        return true;
      } catch (error) {
        console.error('Delete error:', error);
        return false;
      }
    },
    [mutation]
  );

  return {
    deleteDoc,
    deleting: mutation.isPending,
    error: mutation.error,
  };
}

/**
 * Hook to check if document upload is available
 *
 * @example
 * ```tsx
 * const { canUpload, reason } = useCanUploadDocument();
 *
 * if (!canUpload) {
 *   alert(reason); // Show why upload is not available
 * }
 * ```
 */
export function useCanUploadDocument() {
  const { t } = useTranslation();
  const { tier, canUploadDocument, loading } = useUsageTracking();

  if (loading) {
    return {
      canUpload: false,
      reason: t('common.loading', { defaultValue: 'جار التحميل...' }),
      loading: true,
    };
  }

  // Check Pro tier
  if (tier !== 'pro') {
    return {
      canUpload: false,
      reason: t('documents.proRequired', {
        defaultValue: 'رفع المستندات متاح فقط للمشتركين في النسخة الاحترافية',
      }),
      loading: false,
    };
  }

  // Check usage limits
  if (!canUploadDocument()) {
    return {
      canUpload: false,
      reason: t('documents.limitReached', {
        defaultValue: 'لقد وصلت إلى الحد الأقصى من المستندات هذا الشهر',
      }),
      loading: false,
    };
  }

  return {
    canUpload: true,
    reason: null,
    loading: false,
  };
}
