/**
 * React hooks for generation job tracking
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  startExamGeneration,
  getGenerationJob,
  getUserGenerationJobs,
  subscribeToGenerationJob,
  GenerationJob,
} from '../generation'

/**
 * Hook to start exam generation
 */
export function useStartExamGeneration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: startExamGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generationJobs'] })
    },
  })
}

/**
 * Hook to get a specific generation job with real-time updates
 */
export function useGenerationJob(jobId: string | null) {
  const [liveJob, setLiveJob] = useState<GenerationJob | null>(null)

  const { data: initialJob, ...query } = useQuery({
    queryKey: ['generationJob', jobId],
    queryFn: () => getGenerationJob(jobId!),
    enabled: !!jobId,
    refetchInterval: false, // Rely on realtime updates
  })

  // Subscribe to realtime updates
  useEffect(() => {
    if (!jobId) return

    // Set initial data
    if (initialJob) {
      setLiveJob(initialJob)
    }

    // Subscribe to updates
    const unsubscribe = subscribeToGenerationJob(jobId, (updatedJob) => {
      setLiveJob(updatedJob)
    })

    return unsubscribe
  }, [jobId, initialJob])

  return {
    data: liveJob || initialJob,
    ...query,
  }
}

/**
 * Hook to get user's recent generation jobs
 */
export function useUserGenerationJobs(limit?: number) {
  return useQuery({
    queryKey: ['generationJobs', limit],
    queryFn: () => getUserGenerationJobs(limit),
  })
}
