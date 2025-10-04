/**
 * Content Search and Management API
 *
 * Provides functions for searching Arabic educational content using vector similarity.
 */

import { supabase } from './supabase'

export interface ContentChunk {
  id: string
  content: string
  subject: string
  topic: string
  metadata: {
    difficulty?: string
    source?: string
    chunk_index?: number
  }
  language: string
  similarity?: number
}

export interface SearchFilters {
  subject?: string
  topic?: string
  language?: string
}

export interface SearchOptions extends SearchFilters {
  limit?: number
}

/**
 * Generate embedding for a text query using OpenAI
 */
async function generateQueryEmbedding(query: string): Promise<number[]> {
  const { data, error } = await supabase.functions.invoke('generate-embeddings', {
    body: {
      mode: 'query',
      text: query,
    },
  })

  if (error) {
    throw new Error(`Failed to generate embedding: ${error.message}`)
  }

  if (!data || !data.embedding) {
    throw new Error('No embedding returned from function')
  }

  return data.embedding
}

/**
 * Search content using vector similarity
 *
 * @param query - Search query in Arabic or English
 * @param options - Search filters and options
 * @returns Array of matching content chunks with similarity scores
 */
export async function searchContent(
  query: string,
  options: SearchOptions = {}
): Promise<ContentChunk[]> {
  const {
    subject,
    topic,
    language = 'ar',
    limit = 10,
  } = options

  try {
    // Generate embedding for the query
    const embedding = await generateQueryEmbedding(query)

    // Call the similarity search function
    const { data, error } = await supabase.rpc('search_content_by_similarity', {
      query_embedding: JSON.stringify(embedding),
      match_count: limit,
      filter_subject: subject || null,
      filter_topic: topic || null,
      filter_language: language,
    })

    if (error) {
      throw new Error(`Search failed: ${error.message}`)
    }

    return (data || []) as ContentChunk[]
  } catch (error) {
    console.error('Error searching content:', error)
    throw error
  }
}

/**
 * Get all unique subjects from content chunks
 */
export async function getSubjects(language = 'ar'): Promise<string[]> {
  const { data, error } = await supabase
    .from('content_chunks')
    .select('subject')
    .eq('language', language)
    .order('subject')

  if (error) {
    throw new Error(`Failed to get subjects: ${error.message}`)
  }

  // Get unique subjects
  const subjects = Array.from(new Set(data.map((item) => item.subject)))
  return subjects
}

/**
 * Get all topics for a specific subject
 */
export async function getTopicsBySubject(
  subject: string,
  language = 'ar'
): Promise<string[]> {
  const { data, error } = await supabase
    .from('content_chunks')
    .select('topic')
    .eq('subject', subject)
    .eq('language', language)
    .order('topic')

  if (error) {
    throw new Error(`Failed to get topics: ${error.message}`)
  }

  // Get unique topics, filter out nulls
  const topics = Array.from(
    new Set(data.map((item) => item.topic).filter((topic): topic is string => topic !== null))
  )
  return topics
}

/**
 * Get content chunks by subject and topic
 */
export async function getContentByFilters(
  filters: SearchFilters,
  limit = 50
): Promise<ContentChunk[]> {
  let query = supabase
    .from('content_chunks')
    .select('*')
    .limit(limit)

  if (filters.subject) {
    query = query.eq('subject', filters.subject)
  }

  if (filters.topic) {
    query = query.eq('topic', filters.topic)
  }

  if (filters.language) {
    query = query.eq('language', filters.language)
  } else {
    query = query.eq('language', 'ar') // Default to Arabic
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to get content: ${error.message}`)
  }

  return (data || []) as ContentChunk[]
}

/**
 * Get a random selection of content chunks for exam generation
 */
export async function getRandomContent(
  filters: SearchFilters,
  count = 10
): Promise<ContentChunk[]> {
  let query = supabase
    .from('content_chunks')
    .select('*')

  if (filters.subject) {
    query = query.eq('subject', filters.subject)
  }

  if (filters.topic) {
    query = query.eq('topic', filters.topic)
  }

  if (filters.language) {
    query = query.eq('language', filters.language)
  } else {
    query = query.eq('language', 'ar')
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to get content: ${error.message}`)
  }

  // Shuffle and take random selection
  const shuffled = (data || []).sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count) as ContentChunk[]
}
