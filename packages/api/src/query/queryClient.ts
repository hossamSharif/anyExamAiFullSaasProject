import { QueryClient } from '@tanstack/react-query';

/**
 * Default query client configuration
 * Optimized for Supabase real-time data
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: Data is considered fresh for 30 seconds
      staleTime: 30 * 1000,
      // Cache time: Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests
      retry: 3,
      // Don't refetch on window focus by default (can be overridden per query)
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
    },
  },
});

/**
 * Query keys for type-safe query invalidation and prefetching
 */
export const queryKeys = {
  // User-related queries
  profile: ['profile'] as const,
  auth: ['auth'] as const,

  // Exam-related queries
  exams: ['exams'] as const,
  exam: (id: string) => ['exam', id] as const,
  examHistory: ['exams', 'history'] as const,

  // Document-related queries
  documents: ['documents'] as const,
  document: (id: string) => ['document', id] as const,

  // Subscription-related queries
  subscription: ['subscription'] as const,
  usage: ['usage'] as const,
  usageHistory: (billingCycle: string) => ['usage', billingCycle] as const,

  // Content-related queries
  curatedContent: ['curatedContent'] as const,
  contentCategories: ['contentCategories'] as const,
  contentBySubject: (subject: string) => ['content', subject] as const,
} as const;
