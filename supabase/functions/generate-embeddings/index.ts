/**
 * Generate Embeddings Edge Function
 *
 * This function generates OpenAI embeddings for Arabic text content.
 * Supports both batch processing and single chunk embedding generation.
 *
 * @param {string} mode - 'batch' or 'single'
 * @param {string} chunkId - (single mode) Content chunk ID
 * @param {number} limit - (batch mode) Number of chunks to process, defaults to 100
 * @param {number} offset - (batch mode) Offset for pagination, defaults to 0
 *
 * @returns {object} result - Processing statistics and any errors
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import {
  corsHeaders,
  handleCorsPrelight,
  jsonResponse,
  errorResponse,
} from '../_shared/cors.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const OPENAI_EMBEDDING_MODEL = 'text-embedding-3-small'
const EMBEDDING_DIMENSION = 1536
const BATCH_SIZE = 100 // Max chunks to process in one batch

interface EmbeddingResponse {
  object: string
  data: Array<{
    object: string
    embedding: number[]
    index: number
  }>
  model: string
  usage: {
    prompt_tokens: number
    total_tokens: number
  }
}

interface ProcessingResult {
  success: number
  failed: number
  total: number
  errors: string[]
  cost_estimate: number
  tokens_used: number
}

/**
 * Generate embeddings for a batch of texts using OpenAI API
 */
async function generateBatchEmbeddings(
  texts: string[]
): Promise<EmbeddingResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_EMBEDDING_MODEL,
      input: texts,
      encoding_format: 'float',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${error}`)
  }

  return await response.json()
}

/**
 * Process chunks in batch mode
 */
async function processBatch(
  supabaseClient: any,
  limit: number,
  offset: number,
  table: string = 'content_chunks'
): Promise<ProcessingResult> {
  const result: ProcessingResult = {
    success: 0,
    failed: 0,
    total: 0,
    errors: [],
    cost_estimate: 0,
    tokens_used: 0,
  }

  try {
    // Fetch chunks without embeddings from specified table
    const { data: chunks, error: fetchError } = await supabaseClient
      .from(table)
      .select('id, content')
      .is('embedding', null)
      .range(offset, offset + limit - 1)

    if (fetchError) {
      throw new Error(`Failed to fetch chunks: ${fetchError.message}`)
    }

    if (!chunks || chunks.length === 0) {
      return {
        ...result,
        total: 0,
      }
    }

    result.total = chunks.length
    console.log(`Processing ${chunks.length} chunks...`)

    // Extract texts for batch processing
    const texts = chunks.map((chunk: any) => chunk.content)

    // Generate embeddings
    const embeddingResponse = await generateBatchEmbeddings(texts)

    // Update usage stats
    result.tokens_used = embeddingResponse.usage.total_tokens
    // Cost estimate: text-embedding-3-small is $0.00002 per 1K tokens
    result.cost_estimate = (embeddingResponse.usage.total_tokens / 1000) * 0.00002

    // Update each chunk with its embedding
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const embedding = embeddingResponse.data[i].embedding

      try {
        const { error: updateError } = await supabaseClient
          .from(table)
          .update({ embedding: JSON.stringify(embedding) })
          .eq('id', chunk.id)

        if (updateError) {
          result.failed++
          result.errors.push(`Failed to update chunk ${chunk.id}: ${updateError.message}`)
        } else {
          result.success++
        }
      } catch (error) {
        result.failed++
        result.errors.push(
          `Exception updating chunk ${chunk.id}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      }
    }

    console.log(`Batch processing complete: ${result.success} success, ${result.failed} failed`)
  } catch (error) {
    result.errors.push(
      `Batch processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }

  return result
}

/**
 * Process a single chunk
 */
async function processSingle(
  supabaseClient: any,
  chunkId: string
): Promise<ProcessingResult> {
  const result: ProcessingResult = {
    success: 0,
    failed: 0,
    total: 1,
    errors: [],
    cost_estimate: 0,
    tokens_used: 0,
  }

  try {
    // Fetch the chunk
    const { data: chunk, error: fetchError } = await supabaseClient
      .from('content_chunks')
      .select('id, content')
      .eq('id', chunkId)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch chunk: ${fetchError.message}`)
    }

    if (!chunk) {
      throw new Error(`Chunk ${chunkId} not found`)
    }

    console.log(`Processing single chunk: ${chunkId}`)

    // Generate embedding
    const embeddingResponse = await generateBatchEmbeddings([chunk.content])

    // Update usage stats
    result.tokens_used = embeddingResponse.usage.total_tokens
    result.cost_estimate = (embeddingResponse.usage.total_tokens / 1000) * 0.00002

    // Update chunk with embedding
    const embedding = embeddingResponse.data[0].embedding

    const { error: updateError } = await supabaseClient
      .from('content_chunks')
      .update({ embedding: JSON.stringify(embedding) })
      .eq('id', chunk.id)

    if (updateError) {
      result.failed = 1
      result.errors.push(`Failed to update chunk: ${updateError.message}`)
    } else {
      result.success = 1
    }

    console.log(`Single chunk processing complete`)
  } catch (error) {
    result.failed = 1
    result.errors.push(
      `Single chunk processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }

  return result
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return handleCorsPrelight()
  }

  try {
    // Initialize Supabase client with service role key for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Parse request body
    const {
      mode = 'batch',
      chunkId,
      text,
      limit = BATCH_SIZE,
      offset = 0,
      table = 'content_chunks', // Allow specifying table (content_chunks or document_chunks)
    } = await req.json()

    // Validate mode
    if (mode !== 'batch' && mode !== 'single' && mode !== 'query') {
      return errorResponse('mode must be "batch", "single", or "query"')
    }

    // Validate table parameter
    if (table !== 'content_chunks' && table !== 'document_chunks') {
      return errorResponse('table must be "content_chunks" or "document_chunks"')
    }

    // Validate single mode parameters
    if (mode === 'single' && !chunkId) {
      return errorResponse('chunkId is required for single mode')
    }

    // Validate query mode parameters
    if (mode === 'query' && !text) {
      return errorResponse('text is required for query mode')
    }

    // Validate batch mode parameters
    if (mode === 'batch') {
      if (limit < 1 || limit > BATCH_SIZE) {
        return errorResponse(`limit must be between 1 and ${BATCH_SIZE}`)
      }
      if (offset < 0) {
        return errorResponse('offset must be >= 0')
      }
    }

    // Process based on mode
    if (mode === 'query') {
      // Generate embedding for query text and return it directly
      const embeddingResponse = await generateBatchEmbeddings([text])
      const embedding = embeddingResponse.data[0].embedding

      return jsonResponse({
        mode,
        embedding,
        tokens_used: embeddingResponse.usage.total_tokens,
        cost_estimate: (embeddingResponse.usage.total_tokens / 1000) * 0.00002,
      })
    }

    let result: ProcessingResult

    if (mode === 'single') {
      result = await processSingle(supabaseClient, chunkId)
    } else {
      result = await processBatch(supabaseClient, limit, offset, table)
    }

    // Return result
    return jsonResponse({
      mode,
      result,
      message: `Processed ${result.success} chunks successfully, ${result.failed} failed`,
    })
  } catch (error) {
    console.error('Error generating embeddings:', error)

    return errorResponse(
      error instanceof Error ? error.message : 'Failed to generate embeddings',
      500
    )
  }
})
