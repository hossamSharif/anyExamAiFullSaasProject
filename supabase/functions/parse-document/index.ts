/**
 * Parse Document Edge Function
 *
 * Parses uploaded documents (PDF, DOCX, images) and extracts Arabic text
 * - Handles Arabic text encoding properly
 * - Preserves RTL text layout
 * - Chunks content for embedding generation
 * - Updates document status in realtime
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../_shared/cors.ts';

// PDF.js for PDF parsing
import * as pdfjs from 'npm:pdfjs-dist@4.0.379';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface ParseDocumentRequest {
  documentId: string;
}

interface ParsedChunk {
  content: string;
  page?: number;
  position: number;
}

/**
 * Extract text from PDF with Arabic support
 */
async function parsePDF(fileUrl: string): Promise<ParsedChunk[]> {
  try {
    // Fetch PDF file
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);

    // Load PDF document
    const loadingTask = pdfjs.getDocument({ data });
    const pdf = await loadingTask.promise;

    const chunks: ParsedChunk[] = [];
    let position = 0;

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Combine text items preserving Arabic characters
      let pageText = '';
      for (const item of textContent.items) {
        if ('str' in item) {
          pageText += item.str + ' ';
        }
      }

      // Clean and normalize Arabic text
      pageText = cleanArabicText(pageText.trim());

      if (pageText.length > 0) {
        // Chunk the page text
        const pageChunks = chunkText(pageText, pageNum);
        chunks.push(...pageChunks.map((chunk, idx) => ({
          content: chunk,
          page: pageNum,
          position: position + idx,
        })));
        position += pageChunks.length;
      }
    }

    return chunks;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`فشل تحليل ملف PDF: ${error.message}`);
  }
}

/**
 * Extract text from DOCX file
 */
async function parseDOCX(fileUrl: string): Promise<ParsedChunk[]> {
  try {
    // For DOCX, we'll use a simplified approach
    // In production, you'd use mammoth.js or similar
    // For now, we'll return an error message asking for PDF
    throw new Error('يرجى تحويل ملف DOCX إلى PDF للمعالجة. دعم DOCX قريباً.');
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw error;
  }
}

/**
 * Extract text from image using OCR
 * Note: This requires Tesseract.js or similar OCR library
 */
async function parseImage(fileUrl: string): Promise<ParsedChunk[]> {
  try {
    // For images, we'll need OCR
    // For now, we'll return an error message
    throw new Error('معالجة الصور قيد التطوير. يرجى استخدام ملفات PDF أو DOCX.');
  } catch (error) {
    console.error('Error parsing image:', error);
    throw error;
  }
}

/**
 * Clean and normalize Arabic text
 */
function cleanArabicText(text: string): string {
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ');

  // Remove non-Arabic characters except numbers, punctuation, and English
  // Keep: Arabic, numbers, punctuation, spaces, English
  text = text.replace(/[^\u0600-\u06FFa-zA-Z0-9\s.,!?؛،٪\-]/g, '');

  // Normalize Arabic characters
  text = text.replace(/[أإآ]/g, 'ا'); // Normalize alef forms
  text = text.replace(/[ىي]/g, 'ي'); // Normalize yaa forms
  text = text.replace(/ة/g, 'ه'); // Normalize taa marbouta

  // Remove diacritics (tashkeel)
  text = text.replace(/[\u064B-\u065F]/g, '');

  return text.trim();
}

/**
 * Chunk text into smaller pieces for embedding
 * Preserves Arabic word boundaries
 */
function chunkText(text: string, page?: number): string[] {
  const chunks: string[] = [];
  const maxChunkSize = 1000; // characters
  const overlapSize = 100; // overlap between chunks

  // Split by sentences (Arabic and English)
  const sentences = text.match(/[^.!?؟۔]+[.!?؟۔]+/g) || [text];

  let currentChunk = '';

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();

    // If adding this sentence exceeds max size, save current chunk
    if (currentChunk.length + trimmedSentence.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());

      // Start new chunk with overlap
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlapSize / 10));
      currentChunk = overlapWords.join(' ') + ' ' + trimmedSentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
    }
  }

  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length > 50); // Minimum chunk size
}

/**
 * Update document status
 */
async function updateDocumentStatus(
  documentId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  errorMessage?: string
) {
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
    console.error('Error updating document status:', error);
  }
}

/**
 * Store parsed chunks in database
 */
async function storeChunks(
  documentId: string,
  userId: string,
  chunks: ParsedChunk[]
) {
  const { data: document } = await supabase
    .from('documents')
    .select('file_name')
    .eq('id', documentId)
    .single();

  const fileName = document?.file_name || 'Unknown';

  // Prepare chunk records
  const chunkRecords = chunks.map((chunk) => ({
    document_id: documentId,
    user_id: userId,
    content: chunk.content,
    page_number: chunk.page || null,
    position: chunk.position,
    source_type: 'document',
    source_name: fileName,
    language: 'ar', // Assume Arabic for now
  }));

  // Insert chunks
  const { error } = await supabase
    .from('document_chunks')
    .insert(chunkRecords);

  if (error) {
    throw new Error(`فشل حفظ المحتوى: ${error.message}`);
  }
}

/**
 * Main handler
 */
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request
    const { documentId }: ParseDocumentRequest = await req.json();

    if (!documentId) {
      throw new Error('معرف المستند مطلوب');
    }

    // Get document details
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (fetchError || !document) {
      throw new Error('المستند غير موجود');
    }

    // Update status to processing
    await updateDocumentStatus(documentId, 'processing');

    // Parse document based on file type
    let chunks: ParsedChunk[] = [];

    if (document.file_type === 'application/pdf') {
      chunks = await parsePDF(document.file_url);
    } else if (
      document.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      document.file_type === 'application/msword'
    ) {
      chunks = await parseDOCX(document.file_url);
    } else if (document.file_type.startsWith('image/')) {
      chunks = await parseImage(document.file_url);
    } else {
      throw new Error('نوع الملف غير مدعوم');
    }

    // Store chunks
    await storeChunks(documentId, document.user_id, chunks);

    // Update status to completed
    await updateDocumentStatus(documentId, 'completed');

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        chunksCount: chunks.length,
        message: 'تم تحليل المستند بنجاح',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in parse-document function:', error);

    // Try to update document status to failed
    const body = await req.json().catch(() => ({}));
    if (body.documentId) {
      await updateDocumentStatus(
        body.documentId,
        'failed',
        error.message
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'حدث خطأ أثناء تحليل المستند',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
