/**
 * ExamReviewScreen - Review exam questions and answers (Story 4.11)
 *
 * Shows all questions with user answers, correct answers, and explanations in Arabic.
 * Supports filtering by correct/wrong/skipped and RTL navigation.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import {
  YStack,
  XStack,
  Button,
  Text,
  Card,
  ScrollView,
  Spinner,
} from '@anyexam/ui'
import { useRouter } from 'solito/router'
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, MinusCircle, Book } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@anyexam/api'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'

interface ExamReviewScreenProps {
  attemptId: string
}

interface QuestionWithAnswer {
  id: string
  question_number: number
  question_type: 'multiple_choice' | 'short_answer' | 'true_false'
  question_text: string
  options?: { value: string; label: string }[]
  correct_answer: string
  explanation?: string
  user_answer?: string
  is_correct?: boolean
}

type FilterType = 'all' | 'correct' | 'wrong' | 'skipped'

export function ExamReviewScreen({ attemptId }: ExamReviewScreenProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isRTL = i18n.language === 'ar'

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [filter, setFilter] = useState<FilterType>('all')

  // Fetch questions with answers
  const { data: questionsWithAnswers, isLoading } = useQuery({
    queryKey: ['exam-review', attemptId],
    queryFn: async () => {
      // Get attempt details
      const { data: attempt, error: attemptError } = await supabase
        .from('attempts')
        .select('exam_id')
        .eq('id', attemptId)
        .single()

      if (attemptError) throw attemptError

      // Get questions
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', attempt.exam_id)
        .order('question_number', { ascending: true })

      if (questionsError) throw questionsError

      // Get user answers
      const { data: answers, error: answersError } = await supabase
        .from('answers_submitted')
        .select('*')
        .eq('attempt_id', attemptId)

      if (answersError) throw answersError

      // Combine questions with answers
      const questionsWithAnswers: QuestionWithAnswer[] = questions.map((q) => {
        const userAnswer = answers?.find((a) => a.question_id === q.id)
        const isCorrect =
          userAnswer?.user_answer?.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()

        return {
          ...q,
          user_answer: userAnswer?.user_answer || undefined,
          is_correct: userAnswer ? isCorrect : undefined,
        }
      })

      return questionsWithAnswers
    },
    enabled: !!attemptId,
  })

  // Format number to Arabic if needed
  const formatNumber = (num: number): string => {
    if (!isRTL) return num.toString()
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    return num
      .toString()
      .split('')
      .map((digit) => arabicNumerals[parseInt(digit)] || digit)
      .join('')
  }

  // Filter questions based on selected filter
  const filteredQuestions =
    questionsWithAnswers?.filter((q) => {
      if (filter === 'all') return true
      if (filter === 'correct') return q.is_correct === true
      if (filter === 'wrong') return q.is_correct === false
      if (filter === 'skipped') return !q.user_answer
      return true
    }) || []

  const currentQuestion = filteredQuestions[currentQuestionIndex]
  const totalFilteredQuestions = filteredQuestions.length

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalFilteredQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  // Swipe gesture for navigation (Story 4.11 - RTL swipes)
  const swipeGesture = Gesture.Pan().onEnd((event) => {
    const swipeThreshold = 50
    const velocityThreshold = 500

    if (Math.abs(event.velocityX) > Math.abs(event.velocityY)) {
      if (isRTL) {
        // RTL mode: swipe RIGHT to go next, LEFT to go previous
        if (event.translationX > swipeThreshold || event.velocityX > velocityThreshold) {
          goToNextQuestion()
          if (Platform.OS !== 'web') {
            import('react-native-haptic-feedback').then((haptic) => {
              haptic.default.trigger('impactLight')
            })
          }
        } else if (event.translationX < -swipeThreshold || event.velocityX < -velocityThreshold) {
          goToPreviousQuestion()
          if (Platform.OS !== 'web') {
            import('react-native-haptic-feedback').then((haptic) => {
              haptic.default.trigger('impactLight')
            })
          }
        }
      } else {
        // LTR mode: swipe LEFT to go next, RIGHT to go previous
        if (event.translationX < -swipeThreshold || event.velocityX < -velocityThreshold) {
          goToNextQuestion()
          if (Platform.OS !== 'web') {
            import('react-native-haptic-feedback').then((haptic) => {
              haptic.default.trigger('impactLight')
            })
          }
        } else if (event.translationX > swipeThreshold || event.velocityX > velocityThreshold) {
          goToPreviousQuestion()
          if (Platform.OS !== 'web') {
            import('react-native-haptic-feedback').then((haptic) => {
              haptic.default.trigger('impactLight')
            })
          }
        }
      }
    }
  })

  // Get answer display text
  const getAnswerText = (answer: string | undefined, question: QuestionWithAnswer): string => {
    if (!answer) return t('review.skippedLabel', 'متجاوز')

    if (question.question_type === 'true_false') {
      return answer === 'true' ? t('exam.true', 'صح') : t('exam.false', 'خطأ')
    }

    if (question.question_type === 'multiple_choice') {
      const option = question.options?.find((opt) => opt.value === answer)
      return option?.label || answer
    }

    return answer
  }

  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text fontSize="$4" color="$gray11" marginTop="$4">
          {t('review.loading', 'جاري التحميل...')}
        </Text>
      </YStack>
    )
  }

  if (!questionsWithAnswers || questionsWithAnswers.length === 0) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <Text fontSize="$6" fontWeight="600" color="$gray12" textAlign="center">
          {t('review.noQuestions', 'لا توجد أسئلة')}
        </Text>
        <Button marginTop="$4" onPress={() => router.back()}>
          {t('back', 'رجوع')}
        </Button>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        padding="$4"
        alignItems="center"
        justifyContent="space-between"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        direction={isRTL ? 'rtl' : 'ltr'}
      >
        <XStack alignItems="center" gap="$3" direction={isRTL ? 'rtl' : 'ltr'}>
          <Button circular size="$3" chromeless onPress={() => router.back()} icon={<BackIcon size={24} />} />
          <Text fontSize="$5" fontWeight="600" color="$gray12">
            {t('review.title', 'مراجعة الإجابات')}
          </Text>
        </XStack>
      </XStack>

      {/* Filter Buttons (Story 4.11) */}
      <XStack padding="$4" gap="$2" flexWrap="wrap" direction={isRTL ? 'rtl' : 'ltr'}>
        <Button
          size="$3"
          chromeless={filter !== 'all'}
          theme={filter === 'all' ? 'active' : undefined}
          onPress={() => {
            setFilter('all')
            setCurrentQuestionIndex(0)
          }}
        >
          {t('review.filterAll', 'الكل')}
        </Button>
        <Button
          size="$3"
          chromeless={filter !== 'correct'}
          backgroundColor={filter === 'correct' ? '$green3' : undefined}
          borderColor={filter === 'correct' ? '$green7' : undefined}
          onPress={() => {
            setFilter('correct')
            setCurrentQuestionIndex(0)
          }}
          icon={<CheckCircle2 size={16} color={filter === 'correct' ? '$green10' : '$gray10'} />}
        >
          {t('review.filterCorrect', 'صحيح')}
        </Button>
        <Button
          size="$3"
          chromeless={filter !== 'wrong'}
          backgroundColor={filter === 'wrong' ? '$red3' : undefined}
          borderColor={filter === 'wrong' ? '$red7' : undefined}
          onPress={() => {
            setFilter('wrong')
            setCurrentQuestionIndex(0)
          }}
          icon={<XCircle size={16} color={filter === 'wrong' ? '$red10' : '$gray10'} />}
        >
          {t('review.filterWrong', 'خطأ')}
        </Button>
        <Button
          size="$3"
          chromeless={filter !== 'skipped'}
          backgroundColor={filter === 'skipped' ? '$gray3' : undefined}
          borderColor={filter === 'skipped' ? '$gray7' : undefined}
          onPress={() => {
            setFilter('skipped')
            setCurrentQuestionIndex(0)
          }}
          icon={<MinusCircle size={16} color={filter === 'skipped' ? '$gray10' : '$gray10'} />}
        >
          {t('review.filterSkipped', 'متجاوز')}
        </Button>
      </XStack>

      {/* Question Counter */}
      <XStack paddingHorizontal="$4" paddingBottom="$3" justifyContent="center">
        <Text fontSize="$3" color="$gray10">
          {t('review.showingQuestions', { count: totalFilteredQuestions })}
        </Text>
      </XStack>

      {/* Question Content (Story 4.11) */}
      {totalFilteredQuestions > 0 && currentQuestion ? (
        <GestureDetector gesture={swipeGesture}>
          <ScrollView flex={1}>
            <YStack padding="$4" gap="$5">
              {/* Question Header */}
              <XStack
                justifyContent="space-between"
                alignItems="center"
                direction={isRTL ? 'rtl' : 'ltr'}
              >
                <Text fontSize="$4" fontWeight="600" color="$gray11">
                  {t('review.questionNumber', 'سؤال')} {formatNumber(currentQuestion.question_number)}
                </Text>

                {/* Status Badge */}
                <Card
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  backgroundColor={
                    currentQuestion.is_correct === true
                      ? '$green3'
                      : currentQuestion.is_correct === false
                      ? '$red3'
                      : '$gray3'
                  }
                  borderColor={
                    currentQuestion.is_correct === true
                      ? '$green7'
                      : currentQuestion.is_correct === false
                      ? '$red7'
                      : '$gray7'
                  }
                >
                  <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                    {currentQuestion.is_correct === true ? (
                      <CheckCircle2 size={16} color="$green10" />
                    ) : currentQuestion.is_correct === false ? (
                      <XCircle size={16} color="$red10" />
                    ) : (
                      <MinusCircle size={16} color="$gray10" />
                    )}
                    <Text
                      fontSize="$2"
                      fontWeight="600"
                      color={
                        currentQuestion.is_correct === true
                          ? '$green11'
                          : currentQuestion.is_correct === false
                          ? '$red11'
                          : '$gray11'
                      }
                    >
                      {currentQuestion.is_correct === true
                        ? t('review.correctLabel', 'صحيح')
                        : currentQuestion.is_correct === false
                        ? t('review.wrongLabel', 'خطأ')
                        : t('review.skippedLabel', 'متجاوز')}
                    </Text>
                  </XStack>
                </Card>
              </XStack>

              {/* Question Text */}
              <Card padding="$5" backgroundColor="$blue2" borderColor="$blue6">
                <Text
                  fontSize="$6"
                  fontWeight="600"
                  color="$gray12"
                  textAlign={isRTL ? 'right' : 'left'}
                  lineHeight="$7"
                >
                  {currentQuestion.question_text}
                </Text>
              </Card>

              {/* Your Answer */}
              <YStack gap="$2">
                <Text fontSize="$4" fontWeight="600" color="$gray11" textAlign={isRTL ? 'right' : 'left'}>
                  {t('review.yourAnswer', 'إجابتك')}:
                </Text>
                <Card
                  padding="$4"
                  backgroundColor={
                    currentQuestion.is_correct === true
                      ? '$green2'
                      : currentQuestion.is_correct === false
                      ? '$red2'
                      : '$gray2'
                  }
                  borderColor={
                    currentQuestion.is_correct === true
                      ? '$green6'
                      : currentQuestion.is_correct === false
                      ? '$red6'
                      : '$gray6'
                  }
                >
                  <Text
                    fontSize="$4"
                    color="$gray12"
                    textAlign={isRTL ? 'right' : 'left'}
                  >
                    {getAnswerText(currentQuestion.user_answer, currentQuestion)}
                  </Text>
                </Card>
              </YStack>

              {/* Correct Answer (if wrong) */}
              {currentQuestion.is_correct === false && (
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="600" color="$gray11" textAlign={isRTL ? 'right' : 'left'}>
                    {t('review.correctAnswer', 'الإجابة الصحيحة')}:
                  </Text>
                  <Card padding="$4" backgroundColor="$green2" borderColor="$green6">
                    <Text fontSize="$4" color="$green11" textAlign={isRTL ? 'right' : 'left'}>
                      {getAnswerText(currentQuestion.correct_answer, currentQuestion)}
                    </Text>
                  </Card>
                </YStack>
              )}

              {/* Explanation (Story 4.11) */}
              {currentQuestion.explanation && (
                <YStack gap="$2">
                  <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                    <Book size={20} color="$purple10" />
                    <Text fontSize="$4" fontWeight="600" color="$gray11">
                      {t('review.explanation', 'التوضيح')}:
                    </Text>
                  </XStack>
                  <Card padding="$4" backgroundColor="$purple2" borderColor="$purple6">
                    <Text
                      fontSize="$4"
                      color="$gray12"
                      textAlign={isRTL ? 'right' : 'left'}
                      lineHeight="$5"
                    >
                      {currentQuestion.explanation}
                    </Text>
                  </Card>
                </YStack>
              )}
            </YStack>
          </ScrollView>
        </GestureDetector>
      ) : (
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
          <Text fontSize="$5" color="$gray11" textAlign="center">
            {t('review.noQuestions', 'لا توجد أسئلة في هذا الفلتر')}
          </Text>
        </YStack>
      )}

      {/* Bottom Navigation */}
      {totalFilteredQuestions > 0 && (
        <YStack
          padding="$4"
          gap="$3"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          backgroundColor="$background"
        >
          <XStack gap="$3">
            <Button
              flex={1}
              size="$5"
              chromeless
              onPress={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              opacity={currentQuestionIndex === 0 ? 0.5 : 1}
              icon={isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            >
              {t('exam.previous', 'السابق')}
            </Button>

            <Button
              flex={1}
              size="$5"
              theme="active"
              onPress={goToNextQuestion}
              disabled={currentQuestionIndex === totalFilteredQuestions - 1}
              opacity={currentQuestionIndex === totalFilteredQuestions - 1 ? 0.5 : 1}
              iconAfter={isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            >
              {t('exam.nextQuestion', 'السؤال التالي')}
            </Button>
          </XStack>

          <Text fontSize="$3" color="$gray10" textAlign="center">
            {formatNumber(currentQuestionIndex + 1)} {t('review.of', 'من')}{' '}
            {formatNumber(totalFilteredQuestions)}
          </Text>
        </YStack>
      )}
    </YStack>
  )
}
