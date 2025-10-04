/**
 * Generate Exam Edge Function
 *
 * Generates an exam using Claude API based on Arabic curated content.
 * Performs vector search to find relevant content, then uses Claude to create questions.
 *
 * @param {string} userId - User ID from auth
 * @param {string} subject - Subject name in Arabic
 * @param {string[]} topics - Array of topic names in Arabic
 * @param {number} questionCount - Number of questions to generate
 * @param {string} difficulty - 'easy', 'medium', or 'hard'
 * @param {string} language - 'ar' or 'en', defaults to 'ar'
 *
 * @returns {object} Exam ID and generated questions
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import {
  corsHeaders,
  handleCorsPrelight,
  jsonResponse,
  errorResponse,
} from '../_shared/cors.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'

interface Question {
  questionNumber: number
  questionType: 'multiple_choice' | 'short_answer' | 'true_false'
  questionText: string
  options?: string[]
  correctAnswer: string
  explanation: string
  difficulty: string
}

interface ClaudeResponse {
  id: string
  type: string
  role: string
  content: Array<{
    type: string
    text: string
  }>
  model: string
  stop_reason: string
  usage: {
    input_tokens: number
    output_tokens: number
  }
}

/**
 * Get relevant content chunks using vector search or direct filtering
 */
async function getRelevantContent(
  supabase: any,
  subject: string,
  topics: string[],
  language: string,
  limit: number = 20
): Promise<any[]> {
  // Simple approach: get content by subject and topics
  let query = supabase
    .from('content_chunks')
    .select('*')
    .eq('subject', subject)
    .eq('language', language)
    .limit(limit)

  if (topics.length > 0) {
    query = query.in('topic', topics)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch content: ${error.message}`)
  }

  return data || []
}

/**
 * Generate exam questions using Claude API
 */
async function generateQuestionsWithClaude(
  contentChunks: any[],
  subject: string,
  topics: string[],
  questionCount: number,
  difficulty: string,
  language: string
): Promise<Question[]> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not configured')
  }

  // Combine content chunks
  const contentText = contentChunks.map((chunk) => chunk.content).join('\n\n')

  // Difficulty mapping
  const difficultyAr = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
  }[difficulty] || 'متوسط'

  // Create prompt in Arabic
  const prompt = language === 'ar' ? `أنت مساعد تعليمي متخصص في إنشاء أسئلة امتحانات باللغة العربية.

المادة: ${subject}
المواضيع: ${topics.join('، ')}
مستوى الصعوبة: ${difficultyAr}

المحتوى المرجعي:
${contentText}

قم بإنشاء ${questionCount} سؤال ${difficultyAr} حول هذا المحتوى.

متطلبات الأسئلة:
1. أسئلة واضحة ومباشرة باللغة العربية الفصحى
2. تنوع في أنواع الأسئلة (اختيار متعدد، إجابة قصيرة، صح/خطأ)
3. لأسئلة الاختيار المتعدد: 4 خيارات، إجابة صحيحة واحدة فقط
4. تغطية متوازنة للمواضيع المختلفة
5. شرح موجز للإجابة الصحيحة

أعد الأسئلة بصيغة JSON التالية:
{
  "questions": [
    {
      "questionNumber": 1,
      "questionType": "multiple_choice",
      "questionText": "نص السؤال",
      "options": ["الخيار أ", "الخيار ب", "الخيار ج", "الخيار د"],
      "correctAnswer": "الخيار الصحيح",
      "explanation": "شرح الإجابة",
      "difficulty": "medium"
    }
  ]
}

اجعل الأسئلة متنوعة ومفيدة للدراسة.` : `You are an educational assistant specialized in creating exam questions.

Subject: ${subject}
Topics: ${topics.join(', ')}
Difficulty: ${difficulty}

Reference Content:
${contentText}

Create ${questionCount} ${difficulty} questions about this content.

Question Requirements:
1. Clear and direct questions
2. Variety of question types (multiple choice, short answer, true/false)
3. For multiple choice: 4 options, one correct answer
4. Balanced coverage of topics
5. Brief explanation of correct answer

Return questions in this JSON format:
{
  "questions": [
    {
      "questionNumber": 1,
      "questionType": "multiple_choice",
      "questionText": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct option",
      "explanation": "Answer explanation",
      "difficulty": "medium"
    }
  ]
}

Make questions varied and useful for studying.`

  // Call Claude API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Claude API error: ${error}`)
  }

  const claudeResponse: ClaudeResponse = await response.json()

  // Extract JSON from response
  const responseText = claudeResponse.content[0].text

  // Try to parse JSON from response
  const jsonMatch = responseText.match(/\{[\s\S]*"questions"[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Failed to extract questions from Claude response')
  }

  const result = JSON.parse(jsonMatch[0])
  return result.questions || []
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return handleCorsPrelight()
  }

  let jobId: string | null = null

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return errorResponse('Unauthorized', 401)
    }

    // Parse request
    const {
      subject,
      topics = [],
      questionCount = 10,
      difficulty = 'medium',
      language = 'ar',
    } = await req.json()

    // Validate inputs
    if (!subject) {
      return errorResponse('subject is required')
    }

    if (questionCount < 5 || questionCount > 50) {
      return errorResponse('questionCount must be between 5 and 50')
    }

    // Create generation job
    const { data: job, error: jobError } = await supabaseClient
      .from('generation_jobs')
      .insert({
        user_id: user.id,
        subject,
        topics,
        question_count: questionCount,
        difficulty,
        language,
        status: 'searching',
        current_stage: language === 'ar' ? 'البحث عن المحتوى المناسب...' : 'Searching for relevant content...',
        progress_percent: 10,
      })
      .select()
      .single()

    if (jobError || !job) {
      throw new Error(`Failed to create generation job: ${jobError?.message}`)
    }

    jobId = job.id

    // Get relevant content
    const contentChunks = await getRelevantContent(
      supabaseClient,
      subject,
      topics,
      language,
      Math.min(questionCount * 3, 30) // Get more chunks than questions for better variety
    )

    if (contentChunks.length === 0) {
      await supabaseClient
        .from('generation_jobs')
        .update({
          status: 'failed',
          error_message: language === 'ar' ? 'لم يتم العثور على محتوى للموضوعات المحددة' : 'No content found for selected topics',
          progress_percent: 0,
        })
        .eq('id', jobId)
      return errorResponse('No content found for the selected subject/topics')
    }

    // Update: Generating questions
    await supabaseClient
      .from('generation_jobs')
      .update({
        status: 'generating',
        current_stage: language === 'ar' ? 'إنشاء الأسئلة...' : 'Generating questions...',
        progress_percent: 40,
      })
      .eq('id', jobId)

    // Generate questions with Claude
    const questions = await generateQuestionsWithClaude(
      contentChunks,
      subject,
      topics,
      questionCount,
      difficulty,
      language
    )

    // Update: Completing
    await supabaseClient
      .from('generation_jobs')
      .update({
        status: 'completing',
        current_stage: language === 'ar' ? 'إنهاء الامتحان...' : 'Finalizing exam...',
        progress_percent: 70,
      })
      .eq('id', jobId)

    // Create exam record
    const { data: exam, error: examError } = await supabaseClient
      .from('exams')
      .insert({
        user_id: user.id,
        title: `${subject} - ${topics.join(', ') || 'General'}`,
        description: `Exam with ${questionCount} questions`,
        source_type: 'curated',
        difficulty,
        total_questions: questions.length,
        topics,
        language,
        status: 'ready',
      })
      .select()
      .single()

    if (examError) {
      throw new Error(`Failed to create exam: ${examError.message}`)
    }

    // Insert questions
    const questionsToInsert = questions.map((q) => ({
      exam_id: exam.id,
      question_number: q.questionNumber,
      question_type: q.questionType,
      question_text: q.questionText,
      options: q.options || null,
      correct_answer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    }))

    const { error: questionsError } = await supabaseClient
      .from('questions')
      .insert(questionsToInsert)

    if (questionsError) {
      throw new Error(`Failed to insert questions: ${questionsError.message}`)
    }

    // Update job: Completed
    await supabaseClient
      .from('generation_jobs')
      .update({
        status: 'completed',
        current_stage: language === 'ar' ? 'تم بنجاح!' : 'Completed successfully!',
        progress_percent: 100,
        exam_id: exam.id,
      })
      .eq('id', jobId)

    // Return job and exam info
    return jsonResponse({
      jobId: job.id,
      examId: exam.id,
      message: 'Exam generated successfully',
    })
  } catch (error) {
    console.error('Error generating exam:', error)

    // Update job status to failed if we have a jobId
    if (jobId) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: {
              headers: { Authorization: req.headers.get('Authorization')! },
            },
          }
        )
        await supabaseClient
          .from('generation_jobs')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Failed to generate exam',
            progress_percent: 0,
          })
          .eq('id', jobId)
      } catch (updateError) {
        console.error('Failed to update job status:', updateError)
      }
    }

    return errorResponse(
      error instanceof Error ? error.message : 'Failed to generate exam',
      500
    )
  }
})
