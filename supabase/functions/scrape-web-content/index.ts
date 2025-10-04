/**
 * Scrape Web Content Edge Function
 *
 * Scrapes content from URLs and stores it as a document
 * - Supports Arabic content
 * - HTML to text conversion
 * - Respects robots.txt
 * - Creates document chunks for embedding
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { corsHeaders } from '../_shared/cors.ts';

// Environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface ScrapeWebContentRequest {
  url: string;
  userId: string;
}

/**
 * Validate URL
 */
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Check robots.txt for permission
 */
async function checkRobotsTxt(url: string): Promise<boolean> {
  try {
    const urlObj = new URL(url);
    const robotsUrl = `${urlObj.protocol}//${urlObj.host}/robots.txt`;

    const response = await fetch(robotsUrl);
    if (!response.ok) {
      // If no robots.txt, allow scraping
      return true;
    }

    const robotsTxt = await response.text();

    // Simple robots.txt parser - check for Disallow directives
    const userAgentSection = robotsTxt.match(/User-agent:\s*\*/i);
    if (userAgentSection) {
      const disallowPattern = /Disallow:\s*(.+)/gi;
      let match;

      while ((match = disallowPattern.exec(robotsTxt)) !== null) {
        const disallowPath = match[1].trim();
        if (urlObj.pathname.startsWith(disallowPath)) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error checking robots.txt:', error);
    // If error checking robots.txt, allow scraping
    return true;
  }
}

/**
 * Clean HTML and extract text
 */
function htmlToText(html: string): string {
  // Remove script and style tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove HTML comments
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Replace common block elements with newlines
  html = html.replace(/<\/(div|p|br|h[1-6]|li|tr)>/gi, '\n');

  // Remove all remaining HTML tags
  html = html.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  html = html
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  // Clean up whitespace
  html = html.replace(/\n\s*\n/g, '\n\n'); // Remove multiple blank lines
  html = html.replace(/[ \t]+/g, ' '); // Normalize spaces
  html = html.trim();

  return html;
}

/**
 * Chunk text for embedding
 */
function chunkText(text: string): string[] {
  const chunks: string[] = [];
  const maxChunkSize = 1000;
  const overlapSize = 100;

  // Split by paragraphs
  const paragraphs = text.split(/\n\n+/);

  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();

    if (currentChunk.length + trimmedParagraph.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());

      // Start new chunk with overlap
      const words = currentChunk.split(' ');
      const overlapWords = words.slice(-Math.floor(overlapSize / 10));
      currentChunk = overlapWords.join(' ') + ' ' + trimmedParagraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length > 50);
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
    const { url, userId }: ScrapeWebContentRequest = await req.json();

    if (!url || !userId) {
      throw new Error('URL ومعرف المستخدم مطلوبان');
    }

    // Validate URL
    if (!isValidUrl(url)) {
      throw new Error('عنوان URL غير صالح');
    }

    // Check robots.txt
    const allowed = await checkRobotsTxt(url);
    if (!allowed) {
      throw new Error('هذا الموقع لا يسمح بالوصول الآلي (robots.txt)');
    }

    // Fetch the web page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'anyExamAi/1.0 (Educational Content Scraper)',
      },
    });

    if (!response.ok) {
      throw new Error(`فشل جلب المحتوى: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Extract text from HTML
    const text = htmlToText(html);

    if (!text || text.length < 100) {
      throw new Error('لم يتم العثور على محتوى كافٍ في هذه الصفحة');
    }

    // Get page title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        file_name: pageTitle,
        file_url: url,
        file_type: 'url',
        file_size: text.length,
        status: 'processing',
      })
      .select()
      .single();

    if (docError || !document) {
      throw new Error(`فشل إنشاء سجل المستند: ${docError?.message}`);
    }

    // Chunk the text
    const chunks = chunkText(text);

    // Detect language (simple heuristic: if contains Arabic characters, it's Arabic)
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    const language = hasArabic ? 'ar' : 'en';

    // Store chunks
    const chunkRecords = chunks.map((chunk, idx) => ({
      document_id: document.id,
      user_id: userId,
      content: chunk,
      position: idx,
      source_type: 'url',
      source_name: pageTitle,
      language,
    }));

    const { error: chunksError } = await supabase
      .from('document_chunks')
      .insert(chunkRecords);

    if (chunksError) {
      throw new Error(`فشل حفظ المحتوى: ${chunksError.message}`);
    }

    // Update document status
    await supabase
      .from('documents')
      .update({ status: 'completed', language })
      .eq('id', document.id);

    // Trigger embedding generation
    fetch(`${SUPABASE_URL}/functions/v1/generate-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        mode: 'batch',
        table: 'document_chunks',
        limit: 100,
        offset: 0,
      }),
    }).catch((err) => {
      console.error('Error triggering embedding generation:', err);
    });

    return new Response(
      JSON.stringify({
        success: true,
        documentId: document.id,
        chunksCount: chunks.length,
        language,
        title: pageTitle,
        message: 'تم جلب المحتوى بنجاح',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in scrape-web-content function:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب المحتوى',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
