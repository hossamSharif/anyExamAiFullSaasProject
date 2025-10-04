/**
 * ExamTakeScreen - Main exam taking interface (Story 4.2 & 4.3)
 *
 * Displays questions with Arabic text and proper RTL layout.
 * Supports multiple choice, short answer, and true/false question types.
 * Includes question navigation, progress tracking, and answer submission.
 * RTL swipe navigation: swipe RIGHT for next, LEFT for previous (reversed for RTL).
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Alert } from 'react-native'
import { YStack, XStack, Button, Text, Card, ScrollView, Spinner, Input, RadioGroup, Sheet, Dialog } from '@anyexam/ui'
import { useRouter } from 'solito/router'
import { ArrowLeft, ArrowRight, Flag, Check, List, CloudUpload, AlertCircle } from '@tamagui/lucide-icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@anyexam/api'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import { useAuth } from '@anyexam/api'

interface Question {
  id: string
  exam_id: string
  question_number: number
  question_type: 'multiple_choice' | 'short_answer' | 'true_false'
  question_text: string
  options?: { value: string; label: string }[]
  correct_answer: string
  explanation?: string
  difficulty?: string
}

interface UserAnswer {
  questionId: string
  answer: string
  isFlagged: boolean
}

interface ExamTakeScreenProps {
  examId: string
}

export function ExamTakeScreen({ examId }: ExamTakeScreenProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isRTL = i18n.language === 'ar'

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({})
  const [showQuestionList, setShowQuestionList] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { user } = useAuth()

  // Fetch questions for this exam
  const { data: questions, isLoading } = useQuery({
    queryKey: ['exam-questions', examId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('exam_id', examId)
        .order('question_number', { ascending: true })

      if (error) throw error
      return data as Question[]
    },
  })

  // Create or get attempt (Story 4.5: Auto-save)
  useEffect(() => {
    const createOrGetAttempt = async () => {
      if (!user || !examId) return

      // Check if there's an existing in-progress attempt
      const { data: existingAttempt } = await supabase
        .from('attempts')
        .select('*')
        .eq('exam_id', examId)
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .single()

      if (existingAttempt) {
        setAttemptId(existingAttempt.id)

        // Load saved answers
        const { data: savedAnswers } = await supabase
          .from('answers_submitted')
          .select('*')
          .eq('attempt_id', existingAttempt.id)

        if (savedAnswers) {
          const answersMap: Record<string, UserAnswer> = {}
          savedAnswers.forEach((answer) => {
            answersMap[answer.question_id] = {
              questionId: answer.question_id,
              answer: answer.user_answer || '',
              isFlagged: false, // We don't store flag state in DB for now
            }
          })
          setUserAnswers(answersMap)
        }
      } else {
        // Create new attempt
        const { data: newAttempt, error } = await supabase
          .from('attempts')
          .insert([
            {
              exam_id: examId,
              user_id: user.id,
              status: 'in_progress',
              total_questions: questions?.length || 0,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error('Failed to create attempt:', error)
        } else if (newAttempt) {
          setAttemptId(newAttempt.id)
        }
      }
    }

    if (questions && questions.length > 0) {
      createOrGetAttempt()
    }
  }, [examId, user, questions])

  // Auto-save mutation (Story 4.5)
  const saveAnswerMutation = useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      if (!attemptId) return

      // Upsert answer
      const { error } = await supabase
        .from('answers_submitted')
        .upsert(
          {
            attempt_id: attemptId,
            question_id: questionId,
            user_answer: answer,
          },
          {
            onConflict: 'attempt_id,question_id',
          }
        )

      if (error) throw error
    },
    onSuccess: () => {
      setLastSaved(new Date())
      setIsSaving(false)
    },
    onError: (error) => {
      console.error('Failed to save answer:', error)
      setIsSaving(false)
    },
  })

  // Debounced auto-save (Story 4.5)
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (!currentQuestion || !attemptId) return

      const answer = userAnswers[currentQuestion.id]?.answer
      if (answer !== undefined && answer !== null) {
        setIsSaving(true)
        saveAnswerMutation.mutate({
          questionId: currentQuestion.id,
          answer,
        })
      }
    }, 1000) // 1 second debounce

    return () => clearTimeout(debounceTimeout)
  }, [userAnswers, currentQuestion?.id, attemptId])

  const currentQuestion = questions?.[currentQuestionIndex]
  const totalQuestions = questions?.length || 0
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const isFirstQuestion = currentQuestionIndex === 0

  // Convert number to Arabic numerals if needed
  const formatNumber = (num: number): string => {
    if (!isRTL) return num.toString()
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    return num
      .toString()
      .split('')
      .map((digit) => arabicNumerals[parseInt(digit)] || digit)
      .join('')
  }

  // Get current answer
  const getCurrentAnswer = (): string => {
    if (!currentQuestion) return ''
    return userAnswers[currentQuestion.id]?.answer || ''
  }

  // Update answer
  const updateAnswer = (answer: string) => {
    if (!currentQuestion) return

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        answer,
        isFlagged: prev[currentQuestion.id]?.isFlagged || false,
      },
    }))
  }

  // Toggle flag
  const toggleFlag = () => {
    if (!currentQuestion) return

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        answer: prev[currentQuestion.id]?.answer || '',
        isFlagged: !prev[currentQuestion.id]?.isFlagged,
      },
    }))
  }

  // Navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setShowQuestionList(false)
  }

  const getQuestionStatus = (questionId: string): 'answered' | 'flagged' | 'unanswered' => {
    const answer = userAnswers[questionId]
    if (answer?.isFlagged) return 'flagged'
    if (answer?.answer) return 'answered'
    return 'unanswered'
  }

  // Count answered questions
  const answeredCount = questions?.filter((q) => userAnswers[q.id]?.answer).length || 0

  // Submit exam (Story 4.6)
  const handleSubmitExam = async () => {
    if (!attemptId) return

    setIsSubmitting(true)

    try {
      // Calculate time spent
      const now = new Date()
      const timeSpent = questions?.[0] ? Math.floor((now.getTime() - new Date(questions[0].created_at).getTime()) / 1000) : 0

      // Update attempt status
      const { error } = await supabase
        .from('attempts')
        .update({
          status: 'submitted',
          time_submitted: now.toISOString(),
          time_spent_seconds: timeSpent,
        })
        .eq('id', attemptId)

      if (error) throw error

      // Navigate to scoring screen (Story 4.7)
      router.push(`/exam/results/${attemptId}`)
    } catch (error) {
      console.error('Failed to submit exam:', error)
      setIsSubmitting(false)
    }
  }

  const BackIcon = isRTL ? ArrowRight : ArrowLeft
  const isFlagged = currentQuestion ? userAnswers[currentQuestion.id]?.isFlagged : false

  // Swipe gesture for navigation (Story 4.3)
  // For RTL: swipe RIGHT for next, LEFT for previous (reversed!)
  // For LTR: swipe LEFT for next, RIGHT for previous (normal)
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const swipeThreshold = 50
      const velocityThreshold = 500

      // Check if swipe is horizontal enough
      if (Math.abs(event.velocityX) > Math.abs(event.velocityY)) {
        if (isRTL) {
          // RTL mode: swipe RIGHT to go next, LEFT to go previous
          if (event.translationX > swipeThreshold || event.velocityX > velocityThreshold) {
            // Swiped right -> next question
            if (currentQuestionIndex < totalQuestions - 1) {
              goToNextQuestion()
              // Haptic feedback
              if (Platform.OS !== 'web') {
                // @ts-ignore
                import('react-native-haptic-feedback').then((haptic) => {
                  haptic.default.trigger('impactLight')
                })
              }
            }
          } else if (event.translationX < -swipeThreshold || event.velocityX < -velocityThreshold) {
            // Swiped left -> previous question
            if (currentQuestionIndex > 0) {
              goToPreviousQuestion()
              // Haptic feedback
              if (Platform.OS !== 'web') {
                // @ts-ignore
                import('react-native-haptic-feedback').then((haptic) => {
                  haptic.default.trigger('impactLight')
                })
              }
            }
          }
        } else {
          // LTR mode: swipe LEFT to go next, RIGHT to go previous
          if (event.translationX < -swipeThreshold || event.velocityX < -velocityThreshold) {
            // Swiped left -> next question
            if (currentQuestionIndex < totalQuestions - 1) {
              goToNextQuestion()
              // Haptic feedback
              if (Platform.OS !== 'web') {
                // @ts-ignore
                import('react-native-haptic-feedback').then((haptic) => {
                  haptic.default.trigger('impactLight')
                })
              }
            }
          } else if (event.translationX > swipeThreshold || event.velocityX > velocityThreshold) {
            // Swiped right -> previous question
            if (currentQuestionIndex > 0) {
              goToPreviousQuestion()
              // Haptic feedback
              if (Platform.OS !== 'web') {
                // @ts-ignore
                import('react-native-haptic-feedback').then((haptic) => {
                  haptic.default.trigger('impactLight')
                })
              }
            }
          }
        }
      }
    })

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text fontSize="$4" color="$gray11" marginTop="$4">
          {t('loading', 'جاري التحميل...')}
        </Text>
      </YStack>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <Text fontSize="$6" fontWeight="600" color="$red10" textAlign="center">
          {t('error', 'خطأ')}
        </Text>
        <Text fontSize="$4" color="$gray11" marginTop="$2" textAlign="center">
          {t('exam.noQuestions', 'لا توجد أسئلة في هذا الامتحان')}
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
          <Button
            circular
            size="$3"
            chromeless
            onPress={() => router.back()}
            icon={<BackIcon size={24} />}
          />
          <Text fontSize="$5" fontWeight="600" color="$gray12">
            {t('exam.question', 'سؤال')} {formatNumber(currentQuestionIndex + 1)} {t('exam.of', 'من')}{' '}
            {formatNumber(totalQuestions)}
          </Text>
        </XStack>

        <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
          <Button
            circular
            size="$3"
            chromeless
            onPress={() => setShowQuestionList(true)}
            icon={<List size={20} color="$blue10" />}
          />
          <Button
            circular
            size="$3"
            chromeless
            onPress={toggleFlag}
            icon={<Flag size={20} color={isFlagged ? '$orange10' : '$gray10'} />}
            backgroundColor={isFlagged ? '$orange3' : 'transparent'}
          />
        </XStack>
      </XStack>

      {/* Progress Bar */}
      <YStack padding="$4" gap="$2">
        <XStack height={6} backgroundColor="$gray4" borderRadius="$2" overflow="hidden">
          <YStack
            flex={((currentQuestionIndex + 1) / totalQuestions) * 100}
            backgroundColor="$blue9"
          />
        </XStack>
        <XStack justifyContent="space-between" alignItems="center" direction={isRTL ? 'rtl' : 'ltr'}>
          <Text fontSize="$2" color="$gray10">
            {t('exam.progress', 'التقدم')}: {formatNumber(Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100))}%
          </Text>

          {/* Auto-save indicator (Story 4.5) */}
          <XStack alignItems="center" gap="$1" direction={isRTL ? 'rtl' : 'ltr'}>
            {isSaving ? (
              <>
                <Spinner size="small" color="$blue10" />
                <Text fontSize="$2" color="$blue10">
                  {t('exam.saving', 'جاري الحفظ...')}
                </Text>
              </>
            ) : lastSaved ? (
              <>
                <Check size={12} color="$green10" />
                <Text fontSize="$2" color="$green10">
                  {t('exam.saved', 'محفوظ')}
                </Text>
              </>
            ) : null}
          </XStack>
        </XStack>
      </YStack>

      {/* Question Content */}
      <GestureDetector gesture={swipeGesture}>
        <ScrollView flex={1}>
          <YStack padding="$4" gap="$5">
          {/* Question Text */}
          <Card padding="$5" backgroundColor="$blue2" borderColor="$blue6">
            <Text
              fontSize="$6"
              fontWeight="600"
              color="$gray12"
              textAlign={isRTL ? 'right' : 'left'}
              lineHeight="$7"
            >
              {currentQuestion?.question_text}
            </Text>
          </Card>

          {/* Question Type Badge */}
          <XStack justifyContent={isRTL ? 'flex-end' : 'flex-start'}>
            <Card paddingHorizontal="$3" paddingVertical="$2" backgroundColor="$gray3" borderColor="$gray7">
              <Text fontSize="$2" color="$gray11">
                {currentQuestion?.question_type === 'multiple_choice'
                  ? t('exam.multipleChoice', 'اختيار متعدد')
                  : currentQuestion?.question_type === 'short_answer'
                  ? t('exam.shortAnswer', 'إجابة قصيرة')
                  : t('exam.trueFalse', 'صح أو خطأ')}
              </Text>
            </Card>
          </XStack>

          {/* Answer Input based on question type */}
          {currentQuestion?.question_type === 'multiple_choice' && (
            <YStack gap="$3">
              <Text
                fontSize="$4"
                color="$gray11"
                marginBottom="$2"
                textAlign={isRTL ? 'right' : 'left'}
              >
                {t('exam.selectAnswer', 'اختر الإجابة')}
              </Text>
              <RadioGroup
                value={getCurrentAnswer()}
                onValueChange={updateAnswer}
                gap="$3"
              >
                {currentQuestion.options?.map((option, index) => (
                  <Card
                    key={index}
                    padding="$4"
                    backgroundColor={getCurrentAnswer() === option.value ? '$blue3' : '$backgroundHover'}
                    borderColor={getCurrentAnswer() === option.value ? '$blue7' : '$borderColor'}
                    borderWidth={1.5}
                    pressStyle={{
                      backgroundColor: '$blue4',
                      scale: 0.98,
                    }}
                    onPress={() => updateAnswer(option.value)}
                  >
                    <XStack alignItems="center" gap="$3" direction={isRTL ? 'rtl' : 'ltr'}>
                      <RadioGroup.Item value={option.value} id={`option-${index}`}>
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Text
                        fontSize="$4"
                        color={getCurrentAnswer() === option.value ? '$blue11' : '$gray12'}
                        textAlign={isRTL ? 'right' : 'left'}
                        flex={1}
                      >
                        {option.label}
                      </Text>
                    </XStack>
                  </Card>
                ))}
              </RadioGroup>
            </YStack>
          )}

          {currentQuestion?.question_type === 'short_answer' && (
            <YStack gap="$3">
              <Text
                fontSize="$4"
                color="$gray11"
                marginBottom="$2"
                textAlign={isRTL ? 'right' : 'left'}
              >
                {t('exam.writeAnswer', 'اكتب إجابتك')}
              </Text>
              <Input
                placeholder={t('exam.yourAnswer', 'إجابتك')}
                value={getCurrentAnswer()}
                onChangeText={updateAnswer}
                multiline
                numberOfLines={4}
                textAlign={isRTL ? 'right' : 'left'}
                fontSize="$4"
                padding="$4"
                borderColor="$borderColor"
                borderWidth={1.5}
                borderRadius="$3"
                backgroundColor="$background"
              />
            </YStack>
          )}

          {currentQuestion?.question_type === 'true_false' && (
            <YStack gap="$3">
              <Text
                fontSize="$4"
                color="$gray11"
                marginBottom="$2"
                textAlign={isRTL ? 'right' : 'left'}
              >
                {t('exam.selectAnswer', 'اختر الإجابة')}
              </Text>
              <XStack gap="$3">
                <Button
                  flex={1}
                  size="$5"
                  onPress={() => updateAnswer('true')}
                  backgroundColor={getCurrentAnswer() === 'true' ? '$green9' : '$gray3'}
                  borderColor={getCurrentAnswer() === 'true' ? '$green10' : '$borderColor'}
                  borderWidth={1.5}
                  pressStyle={{
                    backgroundColor: getCurrentAnswer() === 'true' ? '$green10' : '$gray4',
                    scale: 0.98,
                  }}
                  icon={getCurrentAnswer() === 'true' ? <Check size={20} color="white" /> : undefined}
                >
                  <Text
                    fontSize="$5"
                    fontWeight={getCurrentAnswer() === 'true' ? '600' : '400'}
                    color={getCurrentAnswer() === 'true' ? 'white' : '$gray11'}
                  >
                    {t('exam.true', 'صح')}
                  </Text>
                </Button>

                <Button
                  flex={1}
                  size="$5"
                  onPress={() => updateAnswer('false')}
                  backgroundColor={getCurrentAnswer() === 'false' ? '$red9' : '$gray3'}
                  borderColor={getCurrentAnswer() === 'false' ? '$red10' : '$borderColor'}
                  borderWidth={1.5}
                  pressStyle={{
                    backgroundColor: getCurrentAnswer() === 'false' ? '$red10' : '$gray4',
                    scale: 0.98,
                  }}
                  icon={getCurrentAnswer() === 'false' ? <Check size={20} color="white" /> : undefined}
                >
                  <Text
                    fontSize="$5"
                    fontWeight={getCurrentAnswer() === 'false' ? '600' : '400'}
                    color={getCurrentAnswer() === 'false' ? 'white' : '$gray11'}
                  >
                    {t('exam.false', 'خطأ')}
                  </Text>
                </Button>
              </XStack>
            </YStack>
          )}
          </YStack>
        </ScrollView>
      </GestureDetector>

      {/* Bottom Navigation */}
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
            disabled={isFirstQuestion}
            opacity={isFirstQuestion ? 0.5 : 1}
            icon={isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          >
            {t('exam.previous', 'السابق')}
          </Button>

          {!isLastQuestion ? (
            <Button
              flex={1}
              size="$5"
              theme="active"
              onPress={goToNextQuestion}
              iconAfter={isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            >
              {t('exam.nextQuestion', 'السؤال التالي')}
            </Button>
          ) : (
            <Button
              flex={1}
              size="$5"
              theme="active"
              onPress={() => setShowSubmitDialog(true)}
              icon={<Check size={20} />}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('exam.submitting', 'جاري التسليم...') : t('exam.submit', 'تسليم الامتحان')}
            </Button>
          )}
        </XStack>
      </YStack>

      {/* Question List Sheet (Story 4.4) */}
      <Sheet
        open={showQuestionList}
        onOpenChange={setShowQuestionList}
        snapPoints={[85]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4" backgroundColor="$background">
          <Sheet.Handle />
          <YStack gap="$4" flex={1}>
            {/* Header */}
            <XStack
              justifyContent="space-between"
              alignItems="center"
              paddingBottom="$3"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
              direction={isRTL ? 'rtl' : 'ltr'}
            >
              <Text fontSize="$6" fontWeight="700" color="$gray12">
                {t('exam.questionList', 'قائمة الأسئلة')}
              </Text>
              <Button size="$3" chromeless onPress={() => setShowQuestionList(false)}>
                {t('close', 'إغلاق')}
              </Button>
            </XStack>

            {/* Review Marked Button */}
            <Button
              size="$4"
              theme="active"
              onPress={() => {
                const flaggedQuestions = questions?.filter((q) => userAnswers[q.id]?.isFlagged)
                if (flaggedQuestions && flaggedQuestions.length > 0) {
                  const flaggedIndex = questions?.findIndex((q) => q.id === flaggedQuestions[0].id)
                  if (flaggedIndex !== undefined && flaggedIndex !== -1) {
                    jumpToQuestion(flaggedIndex)
                  }
                }
              }}
              icon={<Flag size={20} />}
            >
              {t('exam.reviewMarked', 'مراجعة المعلمة')}
            </Button>

            {/* Question Grid */}
            <ScrollView flex={1}>
              <YStack gap="$3">
                <XStack flexWrap="wrap" gap="$3" direction={isRTL ? 'rtl' : 'ltr'}>
                  {questions?.map((question, index) => {
                    const status = getQuestionStatus(question.id)
                    const isActive = currentQuestionIndex === index

                    return (
                      <Button
                        key={question.id}
                        size="$5"
                        width="23%"
                        onPress={() => jumpToQuestion(index)}
                        backgroundColor={
                          status === 'answered'
                            ? '$green3'
                            : status === 'flagged'
                            ? '$orange3'
                            : '$gray3'
                        }
                        borderColor={
                          isActive
                            ? '$blue10'
                            : status === 'answered'
                            ? '$green7'
                            : status === 'flagged'
                            ? '$orange7'
                            : '$borderColor'
                        }
                        borderWidth={isActive ? 2 : 1}
                        pressStyle={{
                          scale: 0.95,
                        }}
                      >
                        <YStack alignItems="center" gap="$1">
                          <Text
                            fontSize="$5"
                            fontWeight={isActive ? '700' : '600'}
                            color={
                              status === 'answered'
                                ? '$green11'
                                : status === 'flagged'
                                ? '$orange11'
                                : '$gray11'
                            }
                          >
                            {formatNumber(index + 1)}
                          </Text>
                          {status === 'flagged' && (
                            <Flag size={12} color="$orange10" />
                          )}
                        </YStack>
                      </Button>
                    )
                  })}
                </XStack>

                {/* Legend */}
                <Card padding="$4" marginTop="$3" backgroundColor="$backgroundHover">
                  <YStack gap="$2">
                    <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                      <YStack width={16} height={16} backgroundColor="$green3" borderRadius="$2" />
                      <Text fontSize="$3" color="$gray11">
                        {t('exam.answered', 'تمت الإجابة')}
                      </Text>
                    </XStack>
                    <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                      <YStack width={16} height={16} backgroundColor="$orange3" borderRadius="$2" />
                      <Text fontSize="$3" color="$gray11">
                        {t('exam.marked', 'معلّم')}
                      </Text>
                    </XStack>
                    <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                      <YStack width={16} height={16} backgroundColor="$gray3" borderRadius="$2" />
                      <Text fontSize="$3" color="$gray11">
                        {t('exam.unanswered', 'لم تتم الإجابة')}
                      </Text>
                    </XStack>
                  </YStack>
                </Card>
              </YStack>
            </ScrollView>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      {/* Submit Confirmation Dialog (Story 4.6) */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content
            padding="$5"
            gap="$4"
            backgroundColor="$background"
            borderRadius="$4"
            maxWidth={400}
          >
            <YStack gap="$3">
              <XStack alignItems="center" gap="$3" direction={isRTL ? 'rtl' : 'ltr'}>
                <AlertCircle size={24} color="$orange10" />
                <Dialog.Title fontSize="$6" fontWeight="700" color="$gray12">
                  {t('exam.submitConfirm', 'تأكيد التسليم')}
                </Dialog.Title>
              </XStack>

              <Dialog.Description fontSize="$4" color="$gray11" textAlign={isRTL ? 'right' : 'left'}>
                {t('exam.submitMessage', 'هل أنت متأكد من تسليم الامتحان؟')}
              </Dialog.Description>

              {answeredCount < totalQuestions && (
                <Card padding="$3" backgroundColor="$orange2" borderColor="$orange6">
                  <Text fontSize="$3" color="$orange11" textAlign={isRTL ? 'right' : 'left'}>
                    {t('exam.submitWarning', {
                      answered: formatNumber(answeredCount),
                      total: formatNumber(totalQuestions),
                    })}
                  </Text>
                </Card>
              )}
            </YStack>

            <XStack gap="$3" justifyContent="flex-end" direction={isRTL ? 'rtl' : 'ltr'}>
              <Dialog.Close asChild>
                <Button chromeless>{t('exam.reviewAnswers', 'مراجعة الإجابات')}</Button>
              </Dialog.Close>

              <Button
                theme="active"
                onPress={() => {
                  setShowSubmitDialog(false)
                  handleSubmitExam()
                }}
                disabled={isSubmitting}
                icon={isSubmitting ? <Spinner size="small" /> : <Check size={20} />}
              >
                {isSubmitting
                  ? t('exam.submitting', 'جاري التسليم...')
                  : t('exam.submitAnyway', 'تسليم على أي حال')}
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </YStack>
  )
}
