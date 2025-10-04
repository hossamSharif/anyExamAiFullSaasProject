/**
 * Score Exam Edge Function (Story 4.7)
 *
 * Scores an exam attempt by:
 * 1. Auto-scoring multiple choice and true/false questions
 * 2. Using Claude API to evaluate Arabic short answers
 * 3. Calculating overall score and storing results
 * 4. Supporting Arabic language evaluation
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

interface Question {
  id: string
  question_type: 'multiple_choice' | 'short_answer' | 'true_false'
  question_text: string
  correct_answer: string
  options?: any
  explanation?: string
}

interface SubmittedAnswer {
  id: string
  question_id: string
  user_answer: string | null
}

serve(async (req) => {
  try {
    const { attemptId } = await req.json()

    if (!attemptId) {
      return new Response(JSON.stringify({ error: 'Attempt ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get attempt details
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('*, exams(id, language)')
      .eq('id', attemptId)
      .single()

    if (attemptError || !attempt) {
      throw new Error('Attempt not found')
    }

    const examLanguage = attempt.exams?.language || 'ar'

    // Get all questions for this exam
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', attempt.exam_id)
      .order('question_number', { ascending: true })

    if (questionsError) {
      throw new Error('Failed to fetch questions')
    }

    // Get submitted answers
    const { data: submittedAnswers, error: answersError } = await supabase
      .from('answers_submitted')
      .select('*')
      .eq('attempt_id', attemptId)

    if (answersError) {
      throw new Error('Failed to fetch submitted answers')
    }

    const answerMap = new Map(submittedAnswers.map((a: SubmittedAnswer) => [a.question_id, a]))

    let totalScore = 0
    let maxScore = questions.length
    let correctCount = 0

    // Score each question
    for (const question of questions as Question[]) {
      const submittedAnswer = answerMap.get(question.id)
      const userAnswer = submittedAnswer?.user_answer?.trim().toLowerCase() || ''
      const correctAnswer = question.correct_answer.trim().toLowerCase()

      let isCorrect = false
      let pointsEarned = 0
      let aiFeedback = ''

      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        // Auto-score multiple choice and true/false
        isCorrect = userAnswer === correctAnswer
        pointsEarned = isCorrect ? 1 : 0
        correctCount += isCorrect ? 1 : 0
      } else if (question.question_type === 'short_answer') {
        // Use Claude API to evaluate Arabic short answers
        const prompt = examLanguage === 'ar'
          ? `قم بتقييم هذه الإجابة العربية:

السؤال: ${question.question_text}
الإجابة الصحيحة: ${question.correct_answer}
إجابة الطالب: ${submittedAnswer?.user_answer || 'لم يتم الإجابة'}

قيّم الإجابة من 0-1 (0 = خطأ تماماً، 1 = صحيحة تماماً).
قدم شرحاً موجزاً بالعربية (جملة واحدة).

أجب بصيغة JSON فقط:
{
  "score": 0.0-1.0,
  "feedback": "شرح قصير بالعربية"
}`
          : `Evaluate this answer:

Question: ${question.question_text}
Correct Answer: ${question.correct_answer}
Student's Answer: ${submittedAnswer?.user_answer || 'No answer provided'}

Rate the answer from 0-1 (0 = completely wrong, 1 = completely correct).
Provide brief feedback (one sentence).

Respond in JSON format only:
{
  "score": 0.0-1.0,
  "feedback": "brief explanation"
}`

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 500,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        })

        if (!response.ok) {
          throw new Error(`Claude API error: ${response.statusText}`)
        }

        const data = await response.json()
        const content = data.content[0].text

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const evaluation = JSON.parse(jsonMatch[0])
          pointsEarned = evaluation.score
          aiFeedback = evaluation.feedback
          isCorrect = pointsEarned >= 0.7
          correctCount += isCorrect ? 1 : 0
        } else {
          pointsEarned = 0
        }
      }

      totalScore += pointsEarned

      // Update submitted answer with scoring
      await supabase
        .from('answers_submitted')
        .update({
          is_correct: isCorrect,
          points_earned: pointsEarned,
          ai_feedback: aiFeedback || question.explanation || null,
        })
        .eq('id', submittedAnswer?.id)
    }

    // Calculate final score percentage
    const scorePercentage = (totalScore / maxScore) * 100

    // Update attempt with score
    const { error: updateError } = await supabase
      .from('attempts')
      .update({
        status: 'scored',
        score: scorePercentage,
        correct_answers: correctCount,
      })
      .eq('id', attemptId)

    if (updateError) {
      throw new Error('Failed to update attempt score')
    }

    return new Response(
      JSON.stringify({
        success: true,
        score: scorePercentage,
        correctAnswers: correctCount,
        totalQuestions: questions.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Scoring error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})
