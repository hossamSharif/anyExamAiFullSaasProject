/**
 * ExamResultsScreen - Display exam results with animated score reveal (Story 4.9)
 *
 * Shows animated score counting, confetti for passing grades,
 * letter grades in Arabic, and pass/fail status.
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { YStack, XStack, Button, Text, Card, ScrollView, Spinner, AnimatePresence } from '@anyexam/ui'
import { useRouter } from 'solito/router'
import { Home, RefreshCw, Share2, FileText, ArrowLeft, Trophy, Award } from '@tamagui/lucide-icons'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@anyexam/api'

interface ExamResultsScreenProps {
  attemptId: string
}

interface AttemptResult {
  id: string
  exam_id: string
  user_id: string
  status: string
  score: number | null
  total_questions: number
  correct_answers: number
  wrong_answers: number
  skipped_questions: number
  time_spent_seconds: number
  created_at: string
  completed_at: string | null
}

export function ExamResultsScreen({ attemptId }: ExamResultsScreenProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isRTL = i18n.language === 'ar'

  const [animatedScore, setAnimatedScore] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [scoreAnimationComplete, setScoreAnimationComplete] = useState(false)

  // Fetch attempt results
  const { data: attempt, isLoading } = useQuery({
    queryKey: ['attempt-results', attemptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attempts')
        .select('*')
        .eq('id', attemptId)
        .single()

      if (error) throw error
      return data as AttemptResult
    },
    enabled: !!attemptId,
  })

  // Animate score counting (Story 4.9)
  useEffect(() => {
    if (!attempt || attempt.score === null) return

    const targetScore = Math.round(attempt.score)
    const duration = 2000 // 2 seconds animation
    const steps = 60
    const increment = targetScore / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const currentScore = Math.min(Math.round(increment * currentStep), targetScore)
      setAnimatedScore(currentScore)

      if (currentStep >= steps) {
        clearInterval(interval)
        setScoreAnimationComplete(true)

        // Show confetti if passing grade (≥70%) (Story 4.9)
        if (targetScore >= 70) {
          setShowConfetti(true)

          // Haptic celebration (Story 4.9)
          if (Platform.OS !== 'web') {
            import('react-native-haptic-feedback').then((haptic) => {
              haptic.default.trigger('notificationSuccess')
            })
          }

          // Hide confetti after 3 seconds
          setTimeout(() => setShowConfetti(false), 3000)
        }
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [attempt])

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

  // Get letter grade in Arabic (Story 4.9)
  const getLetterGrade = (score: number): string => {
    if (score >= 90) return t('results.grades.excellent', 'ممتاز')
    if (score >= 80) return t('results.grades.veryGood', 'جيد جداً')
    if (score >= 70) return t('results.grades.good', 'جيد')
    if (score >= 60) return t('results.grades.acceptable', 'مقبول')
    if (score >= 50) return t('results.grades.weak', 'ضعيف')
    return t('results.grades.fail', 'راسب')
  }

  // Get grade color
  const getGradeColor = (score: number): string => {
    if (score >= 90) return '$green10'
    if (score >= 80) return '$blue10'
    if (score >= 70) return '$cyan10'
    if (score >= 60) return '$yellow10'
    if (score >= 50) return '$orange10'
    return '$red10'
  }

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${formatNumber(mins)}:${formatNumber(secs).padStart(2, '0')}`
  }

  const BackIcon = isRTL ? ArrowLeft : Home

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text fontSize="$4" color="$gray11" marginTop="$4">
          {t('results.scoringInProgress', 'جاري حساب النتيجة...')}
        </Text>
        <Text fontSize="$3" color="$gray10" marginTop="$2">
          {t('results.pleaseWait', 'يرجى الانتظار...')}
        </Text>
      </YStack>
    )
  }

  if (!attempt) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <Text fontSize="$6" fontWeight="600" color="$red10" textAlign="center">
          {t('error', 'خطأ')}
        </Text>
        <Text fontSize="$4" color="$gray11" marginTop="$2" textAlign="center">
          {t('results.notFound', 'نتائج الامتحان غير موجودة')}
        </Text>
        <Button marginTop="$4" onPress={() => router.push('/')}>
          {t('results.backToHome', 'العودة للرئيسية')}
        </Button>
      </YStack>
    )
  }

  const score = attempt.score || 0
  const isPassed = score >= 50
  const totalQuestions = attempt.total_questions
  const correctAnswers = attempt.correct_answers || 0
  const wrongAnswers = attempt.wrong_answers || 0
  const skippedQuestions = attempt.skipped_questions || 0

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
            onPress={() => router.push('/')}
            icon={<BackIcon size={24} />}
          />
          <Text fontSize="$5" fontWeight="600" color="$gray12">
            {t('results.title', 'نتائج الامتحان')}
          </Text>
        </XStack>
      </XStack>

      <ScrollView flex={1}>
        <YStack padding="$4" gap="$5">
          {/* Score Reveal Card (Story 4.9) */}
          <Card
            padding="$6"
            backgroundColor={isPassed ? '$green2' : '$red2'}
            borderColor={isPassed ? '$green7' : '$red7'}
            borderWidth={2}
            animation="bouncy"
            enterStyle={{
              opacity: 0,
              scale: 0.8,
            }}
          >
            <YStack alignItems="center" gap="$4">
              {/* Celebration Icon */}
              <AnimatePresence>
                {scoreAnimationComplete && (
                  <YStack
                    animation="bouncy"
                    enterStyle={{
                      opacity: 0,
                      scale: 0,
                      y: 20,
                    }}
                  >
                    {isPassed ? (
                      <Trophy size={64} color="$green10" />
                    ) : (
                      <Award size={64} color="$orange10" />
                    )}
                  </YStack>
                )}
              </AnimatePresence>

              {/* Congratulations / Better Luck */}
              <Text
                fontSize="$7"
                fontWeight="800"
                color={isPassed ? '$green11' : '$red11'}
                textAlign="center"
              >
                {isPassed
                  ? t('results.congratulations', 'تهانينا!')
                  : t('results.betterLuckNextTime', 'حظ أفضل المرة القادمة')}
              </Text>

              {/* Animated Score */}
              <YStack alignItems="center" gap="$2">
                <Text fontSize="$10" fontWeight="900" color={getGradeColor(score)}>
                  {formatNumber(animatedScore)}%
                </Text>

                {/* Letter Grade (Story 4.9) */}
                <Text fontSize="$5" fontWeight="600" color={getGradeColor(score)}>
                  {getLetterGrade(score)}
                </Text>

                {/* Pass/Fail (Story 4.9) */}
                <Card
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  backgroundColor={isPassed ? '$green4' : '$red4'}
                  borderColor={isPassed ? '$green8' : '$red8'}
                  borderWidth={1}
                >
                  <Text fontSize="$4" fontWeight="700" color={isPassed ? '$green11' : '$red11'}>
                    {isPassed ? t('results.passed', 'نجح') : t('results.failed', 'رسب')}
                  </Text>
                </Card>
              </YStack>

              {/* Score Fraction */}
              <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                <Text fontSize="$4" color="$gray11">
                  {t('results.yourScore', 'نتيجتك')}:
                </Text>
                <Text fontSize="$5" fontWeight="600" color="$gray12">
                  {formatNumber(correctAnswers)} {t('results.outOf', 'من')} {formatNumber(totalQuestions)}
                </Text>
              </XStack>
            </YStack>
          </Card>

          {/* Quick Stats */}
          <XStack gap="$3" flexWrap="wrap">
            <Card flex={1} minWidth={150} padding="$4" backgroundColor="$blue2" borderColor="$blue6">
              <YStack alignItems={isRTL ? 'flex-end' : 'flex-start'} gap="$2">
                <Text fontSize="$2" color="$blue10" fontWeight="600">
                  {t('results.correctAnswers', 'إجابات صحيحة')}
                </Text>
                <Text fontSize="$7" fontWeight="800" color="$blue11">
                  {formatNumber(correctAnswers)}
                </Text>
              </YStack>
            </Card>

            <Card flex={1} minWidth={150} padding="$4" backgroundColor="$red2" borderColor="$red6">
              <YStack alignItems={isRTL ? 'flex-end' : 'flex-start'} gap="$2">
                <Text fontSize="$2" color="$red10" fontWeight="600">
                  {t('results.wrongAnswers', 'إجابات خاطئة')}
                </Text>
                <Text fontSize="$7" fontWeight="800" color="$red11">
                  {formatNumber(wrongAnswers)}
                </Text>
              </YStack>
            </Card>

            <Card flex={1} minWidth={150} padding="$4" backgroundColor="$gray3" borderColor="$gray6">
              <YStack alignItems={isRTL ? 'flex-end' : 'flex-start'} gap="$2">
                <Text fontSize="$2" color="$gray10" fontWeight="600">
                  {t('results.timeTaken', 'الوقت المستغرق')}
                </Text>
                <Text fontSize="$7" fontWeight="800" color="$gray11">
                  {formatTime(attempt.time_spent_seconds || 0)}
                </Text>
              </YStack>
            </Card>
          </XStack>

          {/* Action Buttons */}
          <YStack gap="$3">
            <Button
              size="$5"
              theme="active"
              onPress={() => router.push(`/exam/review/${attemptId}`)}
              icon={<FileText size={20} />}
            >
              {t('results.reviewAnswers', 'مراجعة الإجابات')}
            </Button>

            <XStack gap="$3">
              <Button
                flex={1}
                size="$5"
                chromeless
                onPress={() => router.push(`/exam/retake/${attempt.exam_id}`)}
                icon={<RefreshCw size={20} />}
              >
                {t('results.retakeExam', 'إعادة الامتحان')}
              </Button>

              <Button
                flex={1}
                size="$5"
                chromeless
                onPress={() => {
                  // TODO: Implement share functionality
                  if (Platform.OS !== 'web') {
                    import('react-native-share').then((Share) => {
                      Share.default.open({
                        message: `${t('results.yourScore', 'نتيجتك')}: ${score}% - ${getLetterGrade(score)}`,
                      })
                    })
                  }
                }}
                icon={<Share2 size={20} />}
              >
                {t('results.shareResults', 'مشاركة')}
              </Button>
            </XStack>

            <Button
              size="$5"
              chromeless
              onPress={() => router.push('/')}
              icon={<Home size={20} />}
            >
              {t('results.backToHome', 'العودة للرئيسية')}
            </Button>
          </YStack>
        </YStack>
      </ScrollView>

      {/* Confetti Effect (Story 4.9) */}
      {showConfetti && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          pointerEvents="none"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="$10">🎉</Text>
        </YStack>
      )}
    </YStack>
  )
}
