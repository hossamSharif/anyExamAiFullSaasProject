/**
 * Generation Jobs API
 *
 * Real-time tracking of exam generation progress
 */

import { supabase } from './supabase'

export interface GenerationJob {
  id: string
  user_id: string
  subject: string
  topics: string[]
  question_count: number
  difficulty: string
  language: string
  status: 'pending' | 'searching' | 'generating' | 'completing' | 'completed' | 'failed'
  current_stage: string | null
  progress_percent: number
  exam_id: string | null
  error_message: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}

/**
 * Start exam generation and return job ID
 */
export async function startExamGeneration(params: {
  subject: string
  topics: string[]
  questionCount: number
  difficulty: string
  language?: string
}): Promise<{ jobId: string; examId?: string }> {
  const { data, error } = await supabase.functions.invoke('generate-exam', {
    body: {
      subject: params.subject,
      topics: params.topics,
      questionCount: params.questionCount,
      difficulty: params.difficulty,
      language: params.language || 'ar',
    },
  })

  if (error) {
    throw new Error(`Failed to start exam generation: ${error.message}`)
  }

  return {
    jobId: data.jobId,
    examId: data.examId,
  }
}

/**
 * Get a specific generation job by ID
 */
export async function getGenerationJob(jobId: string): Promise<GenerationJob | null> {
  const { data, error } = await supabase
    .from('generation_jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(`Failed to fetch generation job: ${error.message}`)
  }

  return data as GenerationJob
}

/**
 * Get user's recent generation jobs
 */
export async function getUserGenerationJobs(limit: number = 10): Promise<GenerationJob[]> {
  const { data, error } = await supabase
    .from('generation_jobs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch generation jobs: ${error.message}`)
  }

  return (data || []) as GenerationJob[]
}

/**
 * Subscribe to generation job updates
 */
export function subscribeToGenerationJob(
  jobId: string,
  callback: (job: GenerationJob) => void
) {
  const channel = supabase
    .channel(`generation-job-${jobId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'generation_jobs',
        filter: `id=eq.${jobId}`,
      },
      (payload) => {
        callback(payload.new as GenerationJob)
      }
    )
    .subscribe()

  return () => {
    channel.unsubscribe()
  }
}
