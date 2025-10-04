/**
 * useSearchContent Hook
 *
 * React hook for searching Arabic educational content using vector similarity.
 * Integrates with TanStack Query for caching and state management.
 */

import { useQuery, useMutation } from '@tanstack/react-query'
import {
  searchContent,
  getSubjects,
  getTopicsBySubject,
  getContentByFilters,
  getRandomContent,
  type ContentChunk,
  type SearchOptions,
  type SearchFilters,
} from '../content'

/**
 * Hook for searching content with vector similarity
 *
 * @param query - Search query
 * @param options - Search options
 * @param enabled - Whether the query should run automatically
 */
export function useSearchContent(
  query: string,
  options: SearchOptions = {},
  enabled = true
) {
  return useQuery({
    queryKey: ['content', 'search', query, options],
    queryFn: () => searchContent(query, options),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

/**
 * Hook for getting all subjects
 */
export function useSubjects(language = 'ar') {
  return useQuery({
    queryKey: ['content', 'subjects', language],
    queryFn: () => getSubjects(language),
    staleTime: 30 * 60 * 1000, // 30 minutes - subjects don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

/**
 * Hook for getting topics by subject
 */
export function useTopicsBySubject(subject: string, language = 'ar', enabled = true) {
  return useQuery({
    queryKey: ['content', 'topics', subject, language],
    queryFn: () => getTopicsBySubject(subject, language),
    enabled: enabled && subject.length > 0,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

/**
 * Hook for getting content by filters
 */
export function useContentByFilters(
  filters: SearchFilters,
  limit = 50,
  enabled = true
) {
  return useQuery({
    queryKey: ['content', 'filtered', filters, limit],
    queryFn: () => getContentByFilters(filters, limit),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Hook for getting random content
 */
export function useRandomContent(filters: SearchFilters, count = 10) {
  return useMutation({
    mutationFn: () => getRandomContent(filters, count),
  })
}

/**
 * Combined hook for browsing content with filters
 * Provides subjects, topics, and filtered content in one hook
 */
export function useBrowseContent(language = 'ar') {
  const subjects = useSubjects(language)

  return {
    subjects,
    isLoading: subjects.isLoading,
    error: subjects.error,
  }
}
