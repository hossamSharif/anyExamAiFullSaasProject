/**
 * ExamGenerationScreen - Real-time progress tracking for exam generation
 *
 * Shows Arabic progress stages with Tamagui animations:
 * - البحث (Searching) → الإنشاء (Generating) → الإنهاء (Completing)
 * - Real-time updates via Supabase subscriptions
 * - Error handling with Arabic messages
 * - Auto-navigation on completion
 */

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  YStack,
  XStack,
  Button,
  Text,
  Progress,
  Card,
  Spinner,
  Circle,
  AlertDialog,
} from '@anyexam/ui'
import { useGenerationJob } from '@anyexam/api'
import { useRouter } from 'solito/router'
import { CheckCircle, XCircle, Search, Sparkles, CheckCheck } from '@tamagui/lucide-icons'
import { AnimatePresence } from '@tamagui/animate-presence'

interface ExamGenerationScreenProps {
  jobId: string
}

type StageKey = 'searching' | 'generating' | 'completing' | 'completed'

interface Stage {
  key: StageKey
  labelAr: string
  labelEn: string
  icon: React.ReactNode
}

const STAGES: Stage[] = [
  {
    key: 'searching',
    labelAr: 'البحث',
    labelEn: 'Searching',
    icon: <Search size={24} />,
  },
  {
    key: 'generating',
    labelAr: 'الإنشاء',
    labelEn: 'Generating',
    icon: <Sparkles size={24} />,
  },
  {
    key: 'completing',
    labelAr: 'الإنهاء',
    labelEn: 'Completing',
    icon: <CheckCheck size={24} />,
  },
  {
    key: 'completed',
    labelAr: 'تم',
    labelEn: 'Done',
    icon: <CheckCircle size={24} />,
  },
]

export function ExamGenerationScreen({ jobId }: ExamGenerationScreenProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isRTL = i18n.language === 'ar'

  const { data: job } = useGenerationJob(jobId)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Navigate to exam when completed
  useEffect(() => {
    if (job?.status === 'completed' && job.exam_id) {
      // Wait a bit to show the success state
      const timer = setTimeout(() => {
        router.push(`/exam/${job.exam_id}`)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [job?.status, job?.exam_id, router])

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

  const getCurrentStageIndex = (): number => {
    if (!job) return 0
    switch (job.status) {
      case 'pending':
      case 'searching':
        return 0
      case 'generating':
        return 1
      case 'completing':
        return 2
      case 'completed':
        return 3
      default:
        return 0
    }
  }

  const currentStageIndex = getCurrentStageIndex()

  if (!job) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text marginTop="$4" color="$gray11">
          {t('exam.loadingJob', 'جارٍ التحميل...')}
        </Text>
      </YStack>
    )
  }

  const isFailed = job.status === 'failed'
  const isCompleted = job.status === 'completed'

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Content */}
      <YStack flex={1} padding="$6" gap="$6" alignItems="center" justifyContent="center">
        {/* Error State */}
        {isFailed && (
          <AnimatePresence>
            <Card
              animation="quick"
              enterStyle={{ opacity: 0, scale: 0.9 }}
              exitStyle={{ opacity: 0, scale: 0.9 }}
              opacity={1}
              scale={1}
              padding="$5"
              backgroundColor="$red2"
              borderColor="$red6"
              borderWidth={2}
              width="100%"
              maxWidth={400}
            >
              <YStack gap="$3" alignItems="center">
                <XCircle size={64} color="$red10" />
                <Text fontSize="$6" fontWeight="700" color="$red11" textAlign="center">
                  {t('exam.generationFailed', 'فشل إنشاء الامتحان')}
                </Text>
                <Text fontSize="$4" color="$red10" textAlign="center">
                  {job.error_message || t('exam.unknownError', 'خطأ غير معروف')}
                </Text>
                <Button
                  marginTop="$3"
                  theme="red"
                  onPress={() => router.back()}
                  width="100%"
                >
                  {t('common.goBack', 'رجوع')}
                </Button>
              </YStack>
            </Card>
          </AnimatePresence>
        )}

        {/* Progress State */}
        {!isFailed && !isCompleted && (
          <YStack gap="$5" width="100%" maxWidth={400}>
            {/* Progress Circle */}
            <YStack alignItems="center" gap="$4">
              <Circle
                size={120}
                backgroundColor="$blue2"
                borderColor="$blue6"
                borderWidth={3}
                animation="quick"
                scale={1}
                opacity={1}
              >
                <Spinner size="large" color="$blue10" />
              </Circle>

              <Text fontSize="$7" fontWeight="700" color="$gray12" textAlign="center">
                {job.current_stage}
              </Text>
            </YStack>

            {/* Progress Bar */}
            <YStack gap="$2">
              <Progress value={job.progress_percent} max={100} size="$3">
                <Progress.Indicator
                  animation="quick"
                  backgroundColor="$blue10"
                />
              </Progress>
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$gray10">
                  {formatNumber(job.progress_percent)}%
                </Text>
                <Text fontSize="$3" color="$gray10">
                  {t('exam.pleaseWait', 'يرجى الانتظار...')}
                </Text>
              </XStack>
            </YStack>

            {/* Stage Indicators */}
            <XStack
              gap="$2"
              justifyContent="space-between"
              paddingHorizontal="$2"
              direction={isRTL ? 'rtl' : 'ltr'}
            >
              {STAGES.slice(0, 3).map((stage, index) => {
                const isActive = index === currentStageIndex
                const isComplete = index < currentStageIndex

                return (
                  <YStack key={stage.key} flex={1} gap="$2" alignItems="center">
                    <Circle
                      size={40}
                      backgroundColor={isComplete ? '$blue10' : isActive ? '$blue5' : '$gray3'}
                      borderColor={isComplete ? '$blue11' : isActive ? '$blue8' : '$gray6'}
                      borderWidth={2}
                      animation="quick"
                    >
                      <Text color={isComplete || isActive ? '$blue12' : '$gray10'}>
                        {isComplete ? <CheckCircle size={20} /> : stage.icon}
                      </Text>
                    </Circle>
                    <Text
                      fontSize="$2"
                      fontWeight={isActive ? '600' : '400'}
                      color={isComplete || isActive ? '$blue11' : '$gray10'}
                      textAlign="center"
                    >
                      {isRTL ? stage.labelAr : stage.labelEn}
                    </Text>
                  </YStack>
                )
              })}
            </XStack>
          </YStack>
        )}

        {/* Success State */}
        {isCompleted && (
          <AnimatePresence>
            <Card
              animation="bouncy"
              enterStyle={{ opacity: 0, scale: 0.8 }}
              exitStyle={{ opacity: 0, scale: 0.8 }}
              opacity={1}
              scale={1}
              padding="$5"
              backgroundColor="$green2"
              borderColor="$green6"
              borderWidth={2}
              width="100%"
              maxWidth={400}
            >
              <YStack gap="$3" alignItems="center">
                <CheckCircle size={64} color="$green10" />
                <Text fontSize="$6" fontWeight="700" color="$green11" textAlign="center">
                  {t('exam.generationSuccess', 'تم إنشاء الامتحان بنجاح!')}
                </Text>
                <Text fontSize="$4" color="$green10" textAlign="center">
                  {t('exam.redirecting', 'جارٍ التوجيه...')}
                </Text>
              </YStack>
            </Card>
          </AnimatePresence>
        )}
      </YStack>

      {/* Cancel Button (only show if not completed or failed) */}
      {!isFailed && !isCompleted && (
        <YStack
          padding="$4"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          backgroundColor="$background"
        >
          <Button
            size="$4"
            chromeless
            color="$red10"
            onPress={() => setShowCancelDialog(true)}
          >
            {t('exam.cancel', 'إلغاء')}
          </Button>
        </YStack>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
          >
            <YStack gap="$3">
              <AlertDialog.Title textAlign={isRTL ? 'right' : 'left'}>
                {t('exam.cancelConfirmTitle', 'إلغاء إنشاء الامتحان؟')}
              </AlertDialog.Title>
              <AlertDialog.Description textAlign={isRTL ? 'right' : 'left'}>
                {t(
                  'exam.cancelConfirmMessage',
                  'سيتم إيقاف عملية الإنشاء ولن يتم حفظ أي تقدم.'
                )}
              </AlertDialog.Description>

              <XStack gap="$3" justifyContent="flex-end" direction={isRTL ? 'rtl' : 'ltr'}>
                <AlertDialog.Cancel asChild>
                  <Button chromeless>
                    {t('common.no', 'لا')}
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button
                    theme="red"
                    onPress={() => {
                      setShowCancelDialog(false)
                      router.back()
                    }}
                  >
                    {t('common.yes', 'نعم')}
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </YStack>
  )
}
