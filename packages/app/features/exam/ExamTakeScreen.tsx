/**
 * ExamTakeScreen - Main exam taking interface (Story 4.2)
 *
 * Displays questions with Arabic text and proper RTL layout.
 * Supports multiple choice, short answer, and true/false question types.
 * Includes question navigation, progress tracking, and answer submission.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { YStack, XStack, Button, Text, Card, ScrollView, Spinner, Input, RadioGroup } from '@anyexam/ui'
import { useRouter } from 'solito/router'
import { ArrowLeft, ArrowRight, Flag, Check } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@anyexam/api'

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

  const BackIcon = isRTL ? ArrowRight : ArrowLeft
  const isFlagged = currentQuestion ? userAnswers[currentQuestion.id]?.isFlagged : false

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

        <Button
          circular
          size="$3"
          chromeless
          onPress={toggleFlag}
          icon={<Flag size={20} color={isFlagged ? '$orange10' : '$gray10'} />}
          backgroundColor={isFlagged ? '$orange3' : 'transparent'}
        />
      </XStack>

      {/* Progress Bar */}
      <YStack padding="$4" gap="$2">
        <XStack height={6} backgroundColor="$gray4" borderRadius="$2" overflow="hidden">
          <YStack
            flex={((currentQuestionIndex + 1) / totalQuestions) * 100}
            backgroundColor="$blue9"
          />
        </XStack>
        <Text fontSize="$2" color="$gray10" textAlign={isRTL ? 'right' : 'left'}>
          {t('exam.progress', 'التقدم')}: {formatNumber(Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100))}%
        </Text>
      </YStack>

      {/* Question Content */}
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
              onPress={() => {
                // Navigate to submission screen (Story 4.6)
                console.log('Submit exam')
              }}
              icon={<Check size={20} />}
            >
              {t('exam.submit', 'تسليم الامتحان')}
            </Button>
          )}
        </XStack>
      </YStack>
    </YStack>
  )
}
