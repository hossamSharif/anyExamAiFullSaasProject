/**
 * ExamRetakeScreen - Retake an exam (Story 4.15)
 *
 * Creates a new attempt for an existing exam and tracks retry count.
 * Shows previous attempts comparison in Arabic.
 */

import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { YStack, XStack, Button, Text, Card, ScrollView, Spinner } from '@anyexam/ui'
import { useRouter } from 'solito/router'
import { RefreshCw, TrendingUp, TrendingDown, Minus } from '@tamagui/lucide-icons'
import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase, useAuth } from '@anyexam/api'

interface ExamRetakeScreenProps {
  examId: string
}

export function ExamRetakeScreen({ examId }: ExamRetakeScreenProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()
  const isRTL = i18n.language === 'ar'

  // Fetch exam and previous attempts
  const { data: examData, isLoading } = useQuery({
    queryKey: ['exam-retake', examId],
    queryFn: async () => {
      // Get exam details
      const { data: exam, error: examError } = await supabase
        .from('exams')
        .select('*')
        .eq('id', examId)
        .single()

      if (examError) throw examError

      // Get previous attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('attempts')
        .select('*')
        .eq('exam_id', examId)
        .eq('user_id', user?.id)
        .eq('status', 'submitted')
        .order('attempt_number', { ascending: false })

      if (attemptsError) throw attemptsError

      return { exam, attempts: attempts || [] }
    },
    enabled: !!examId && !!user,
  })

  // Create new attempt mutation
  const createAttemptMutation = useMutation({
    mutationFn: async () => {
      const nextAttemptNumber = (examData?.attempts?.[0]?.attempt_number || 0) + 1

      const { data: newAttempt, error } = await supabase
        .from('attempts')
        .insert([
          {
            exam_id: examId,
            user_id: user?.id,
            attempt_number: nextAttemptNumber,
            status: 'in_progress',
            total_questions: examData?.exam.question_count || 0,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return newAttempt
    },
    onSuccess: (newAttempt) => {
      router.push(`/exam/take/${newAttempt.id}`)
    },
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

  // Get score trend
  const getScoreTrend = () => {
    if (!examData?.attempts || examData.attempts.length < 2) return null

    const latest = examData.attempts[0].score || 0
    const previous = examData.attempts[1].score || 0
    const diff = latest - previous

    if (diff > 0) return { type: 'up', value: diff }
    if (diff < 0) return { type: 'down', value: Math.abs(diff) }
    return { type: 'same', value: 0 }
  }

  const trend = getScoreTrend()
  const previousAttempts = examData?.attempts || []
  const attemptCount = previousAttempts.length

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

  if (!examData) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <Text fontSize="$6" fontWeight="600" color="$red10" textAlign="center">
          {t('exam.notFound', 'الامتحان غير موجود')}
        </Text>
        <Button marginTop="$4" onPress={() => router.back()}>
          {t('back', 'رجوع')}
        </Button>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView flex={1}>
        <YStack padding="$4" gap="$5">
          {/* Exam Title */}
          <Card padding="$5" backgroundColor="$blue2" borderColor="$blue6">
            <YStack gap="$3" alignItems="center">
              <RefreshCw size={48} color="$blue10" />
              <Text fontSize="$7" fontWeight="700" color="$gray12" textAlign="center">
                {examData.exam.title}
              </Text>
              <Text fontSize="$4" color="$gray11" textAlign="center">
                {t('history.retake', 'إعادة الامتحان')}
              </Text>
            </YStack>
          </Card>

          {/* Attempt Counter */}
          <Card padding="$4" backgroundColor="$backgroundHover">
            <XStack justifyContent="center" alignItems="center" gap="$3" direction={isRTL ? 'rtl' : 'ltr'}>
              <Text fontSize="$5" color="$gray11">
                {t('exam.attemptNumber', 'المحاولة رقم')}:
              </Text>
              <Text fontSize="$6" fontWeight="700" color="$blue11">
                {formatNumber(attemptCount + 1)}
              </Text>
            </XStack>
          </Card>

          {/* Previous Attempts Comparison (Story 4.15) */}
          {previousAttempts.length > 0 && (
            <YStack gap="$3">
              <Text fontSize="$5" fontWeight="600" color="$gray12" textAlign={isRTL ? 'right' : 'left'}>
                {t('exam.previousAttempts', 'المحاولات السابقة')}
              </Text>

              {/* Score Trend */}
              {trend && previousAttempts.length > 1 && (
                <Card
                  padding="$4"
                  backgroundColor={
                    trend.type === 'up' ? '$green2' : trend.type === 'down' ? '$red2' : '$gray2'
                  }
                  borderColor={trend.type === 'up' ? '$green6' : trend.type === 'down' ? '$red6' : '$gray6'}
                >
                  <XStack alignItems="center" gap="$3" justifyContent="center" direction={isRTL ? 'rtl' : 'ltr'}>
                    {trend.type === 'up' ? (
                      <TrendingUp size={24} color="$green10" />
                    ) : trend.type === 'down' ? (
                      <TrendingDown size={24} color="$red10" />
                    ) : (
                      <Minus size={24} color="$gray10" />
                    )}
                    <Text
                      fontSize="$5"
                      fontWeight="600"
                      color={trend.type === 'up' ? '$green11' : trend.type === 'down' ? '$red11' : '$gray11'}
                    >
                      {trend.type === 'up'
                        ? `+${formatNumber(Math.round(trend.value))}% ${t('exam.improvement', 'تحسن')}`
                        : trend.type === 'down'
                        ? `-${formatNumber(Math.round(trend.value))}% ${t('exam.decrease', 'انخفاض')}`
                        : t('exam.sameScore', 'نفس النتيجة')}
                    </Text>
                  </XStack>
                </Card>
              )}

              {/* Attempts List */}
              {previousAttempts.slice(0, 3).map((attempt, index) => (
                <Card key={attempt.id} padding="$4" backgroundColor="$backgroundHover">
                  <XStack justifyContent="space-between" alignItems="center" direction={isRTL ? 'rtl' : 'ltr'}>
                    <YStack gap="$1">
                      <Text fontSize="$4" fontWeight="600" color="$gray12" textAlign={isRTL ? 'right' : 'left'}>
                        {t('exam.attempt', 'محاولة')} {formatNumber(attempt.attempt_number)}
                      </Text>
                      <Text fontSize="$3" color="$gray10" textAlign={isRTL ? 'right' : 'left'}>
                        {formatNumber(attempt.correct_answers || 0)}/{formatNumber(attempt.total_questions)}{' '}
                        {t('results.correctAnswers', 'صحيح')}
                      </Text>
                    </YStack>

                    <Card
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      backgroundColor={(attempt.score || 0) >= 50 ? '$green3' : '$red3'}
                      borderColor={(attempt.score || 0) >= 50 ? '$green7' : '$red7'}
                    >
                      <Text
                        fontSize="$5"
                        fontWeight="700"
                        color={(attempt.score || 0) >= 50 ? '$green11' : '$red11'}
                      >
                        {formatNumber(Math.round(attempt.score || 0))}%
                      </Text>
                    </Card>
                  </XStack>
                </Card>
              ))}
            </YStack>
          )}

          {/* Start Button */}
          <Button
            size="$6"
            theme="active"
            onPress={() => createAttemptMutation.mutate()}
            disabled={createAttemptMutation.isPending}
            icon={<RefreshCw size={24} />}
          >
            {createAttemptMutation.isPending
              ? t('exam.starting', 'جارٍ البدء...')
              : t('exam.startRetake', 'بدء إعادة الامتحان')}
          </Button>

          {previousAttempts.length === 0 && (
            <Text fontSize="$3" color="$gray10" textAlign="center">
              {t('exam.firstAttempt', 'هذه محاولتك الأولى لهذا الامتحان')}
            </Text>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  )
}
