/**
 * Document Upload & Management API
 *
 * Handles document upload to Supabase Storage and management operations
 */

import { supabase } from './supabase';

export interface DocumentUploadResult {
  id: string;
  fileName: string;
  fileUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface Document {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Upload document file to Supabase Storage
 *
 * @param file - File object (web) or URI (mobile)
 * @param fileName - Name of the file
 * @param fileType - MIME type
 * @param fileSize - File size in bytes
 * @returns Upload result with document metadata
 */
export async function uploadDocument(
  file: File | { uri: string; type: string },
  fileName: string,
  fileType: string,
  fileSize: number
): Promise<DocumentUploadResult> {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${user.id}/${timestamp}_${fileName}`;

    // Upload to Supabase Storage
    let uploadError: Error | null = null;

    if (file instanceof File) {
      // Web upload
      const { error } = await supabase.storage
        .from('documents')
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false,
        });
      uploadError = error;
    } else {
      // Mobile upload - convert URI to blob
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from('documents')
        .upload(uniqueFileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });
      uploadError = error;
    }

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(uniqueFileName);

    // Create document record in database
    const { data: document, error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_url: publicUrl,
        file_size: fileSize,
        file_type: fileType,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError || !document) {
      throw dbError || new Error('Failed to create document record');
    }

    // Trigger document parsing asynchronously
    // Note: We don't await this to avoid blocking the upload response
    supabase.functions
      .invoke('parse-document', {
        body: { documentId: document.id },
      })
      .then(({ data, error: parseError }) => {
        if (parseError) {
          console.error('Error triggering document parsing:', parseError);
        } else {
          console.log('Document parsing triggered:', data);
        }
      })
      .catch((err) => {
        console.error('Error invoking parse-document function:', err);
      });

    return {
      id: document.id,
      fileName: document.file_name,
      fileUrl: document.file_url,
      status: document.status,
    };
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
}

/**
 * Get all documents for current user
 */
export async function getUserDocuments(): Promise<Document[]> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return documents || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

/**
 * Get a single document by ID
 */
export async function getDocument(documentId: string): Promise<Document | null> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    return document;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(documentId: string): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get document to get file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !document) {
      throw new Error('Document not found');
    }

    // Extract file path from URL
    const url = new URL(document.file_url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('documents') + 1).join('/');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([filePath]);

    if (storageError) {
      console.error('Error deleting from storage:', storageError);
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id);

    if (dbError) {
      throw dbError;
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

/**
 * Update document status
 */
export async function updateDocumentStatus(
  documentId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  errorMessage?: string
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    const { error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', documentId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating document status:', error);
    throw error;
  }
}

/**
 * Subscribe to document status changes
 */
export function subscribeToDocumentStatus(
  documentId: string,
  callback: (document: Document) => void
) {
  const channel = supabase
    .channel(`document:${documentId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'documents',
        filter: `id=eq.${documentId}`,
      },
      (payload) => {
        callback(payload.new as Document);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Scrape content from a URL
 */
export async function scrapeWebContent(url: string): Promise<DocumentUploadResult> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Call the scrape-web-content edge function
    const { data, error } = await supabase.functions.invoke('scrape-web-content', {
      body: { url, userId: user.id },
    });

    if (error) {
      throw error;
    }

    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to scrape web content');
    }

    return {
      id: data.documentId,
      fileName: data.title || url,
      fileUrl: url,
      status: 'completed',
    };
  } catch (error) {
    console.error('Error scraping web content:', error);
    throw error;
  }
}
