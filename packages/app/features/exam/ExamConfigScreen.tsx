/**
 * ExamConfigScreen - Configure exam parameters before generation
 *
 * Allows users to set question count, difficulty, and review selections.
 * Enforces tier limits and checks usage before generation.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { YStack, XStack, Button, Text, Slider, Card, Spinner } from '@anyexam/ui'
import { useSubscription, useCanGenerateExam, usePaywall, useStartExamGeneration } from '@anyexam/api'
import { useRouter } from 'solito/router'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'

interface ExamConfigScreenProps {
  subject: string
  topics: string[]
}

type Difficulty = 'easy' | 'medium' | 'hard'

export function ExamConfigScreen({ subject, topics }: ExamConfigScreenProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isRTL = i18n.language === 'ar'

  const { data: subscription } = useSubscription()
  const { canGenerate, reason } = useCanGenerateExam()
  const { showPaywall } = usePaywall()
  const { mutateAsync: startGeneration, isPending: isGenerating } = useStartExamGeneration()

  const isPro = subscription?.tier === 'pro'
  const maxQuestions = isPro ? 50 : 10

  const [questionCount, setQuestionCount] = useState(10)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')

  // Difficulty options
  const difficultyOptions: { value: Difficulty; labelAr: string; labelEn: string }[] = [
    { value: 'easy', labelAr: 'سهل', labelEn: 'Easy' },
    { value: 'medium', labelAr: 'متوسط', labelEn: 'Medium' },
    { value: 'hard', labelAr: 'صعب', labelEn: 'Hard' },
  ]

  // Estimate time based on question count (2 minutes per question average)
  const estimatedMinutes = questionCount * 2

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

  const handleGenerateExam = async () => {
    // Check if can generate
    if (!canGenerate) {
      showPaywall()
      return
    }

    try {
      // Start exam generation
      const { jobId } = await startGeneration({
        subject,
        topics,
        questionCount,
        difficulty,
        language: i18n.language,
      })

      // Navigate to generation progress screen
      router.push(`/exam/generate/${jobId}`)
    } catch (error) {
      console.error('Failed to start exam generation:', error)
      // TODO: Show error toast
    }
  }

  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        padding="$4"
        alignItems="center"
        gap="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        direction={isRTL ? 'rtl' : 'ltr'}
      >
        <Button
          circular
          size="$3"
          chromeless
          onPress={() => router.back()}
          icon={<BackIcon size={24} />}
        />
        <Text fontSize="$7" fontWeight="700" color="$gray12">
          {t('exam.configureExam', 'إعدادات الامتحان')}
        </Text>
      </XStack>

      {/* Content */}
      <YStack flex={1} padding="$4" gap="$5">
        {/* Subject and Topics Summary */}
        <Card padding="$4" backgroundColor="$blue2" borderColor="$blue6">
          <YStack gap="$2">
            <Text fontSize="$4" color="$gray11" textAlign={isRTL ? 'right' : 'left'}>
              {t('exam.subject', 'المادة')}:
            </Text>
            <Text fontSize="$6" fontWeight="600" color="$blue11" textAlign={isRTL ? 'right' : 'left'}>
              {subject}
            </Text>
            <Text fontSize="$3" color="$gray10" marginTop="$2" textAlign={isRTL ? 'right' : 'left'}>
              {formatNumber(topics.length)} {t('exam.topicsSelected', 'مواضيع محددة')}
            </Text>
          </YStack>
        </Card>

        {/* Question Count Slider */}
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="600" color="$gray12" textAlign={isRTL ? 'right' : 'left'}>
              {t('exam.questionCount', 'عدد الأسئلة')}
            </Text>
            <Text fontSize="$6" fontWeight="700" color="$blue10">
              {formatNumber(questionCount)}
            </Text>
          </XStack>

          <Slider
            value={[questionCount]}
            onValueChange={(values) => setQuestionCount(values[0])}
            min={5}
            max={maxQuestions}
            step={5}
            size="$4"
          >
            <Slider.Track>
              <Slider.TrackActive />
            </Slider.Track>
            <Slider.Thumb circular index={0} />
          </Slider>

          <XStack justifyContent="space-between">
            <Text fontSize="$2" color="$gray10">
              {formatNumber(5)}
            </Text>
            <Text fontSize="$2" color="$gray10">
              {formatNumber(maxQuestions)}
              {!isPro && (
                <Text color="$blue10">  ({t('exam.proOnly', 'احترافي')})</Text>
              )}
            </Text>
          </XStack>
        </YStack>

        {/* Difficulty Selector */}
        <YStack gap="$3">
          <Text fontSize="$5" fontWeight="600" color="$gray12" textAlign={isRTL ? 'right' : 'left'}>
            {t('exam.difficulty', 'مستوى الصعوبة')}
          </Text>

          <XStack gap="$2" justifyContent="space-between">
            {difficultyOptions.map((option) => (
              <Button
                key={option.value}
                flex={1}
                size="$4"
                onPress={() => setDifficulty(option.value)}
                backgroundColor={difficulty === option.value ? '$blue9' : '$gray3'}
                borderColor={difficulty === option.value ? '$blue10' : '$borderColor'}
                borderWidth={1.5}
                pressStyle={{
                  backgroundColor: difficulty === option.value ? '$blue10' : '$gray4',
                  scale: 0.98,
                }}
              >
                <Text
                  fontSize="$4"
                  fontWeight={difficulty === option.value ? '600' : '400'}
                  color={difficulty === option.value ? 'white' : '$gray11'}
                >
                  {isRTL ? option.labelAr : option.labelEn}
                </Text>
              </Button>
            ))}
          </XStack>
        </YStack>

        {/* Estimated Time */}
        <Card padding="$3" backgroundColor="$backgroundHover">
          <XStack justifyContent="space-between" alignItems="center" direction={isRTL ? 'rtl' : 'ltr'}>
            <Text fontSize="$4" color="$gray11">
              {t('exam.estimatedTime', 'الوقت المتوقع')}:
            </Text>
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              {formatNumber(estimatedMinutes)} {t('exam.minutes', 'دقيقة')}
            </Text>
          </XStack>
        </Card>
      </YStack>

      {/* Bottom Action */}
      <YStack
        padding="$4"
        gap="$3"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        backgroundColor="$background"
      >
        {/* Usage Warning */}
        {!canGenerate && (
          <Card padding="$3" backgroundColor="$orange2" borderColor="$orange6">
            <Text fontSize="$3" color="$orange11" textAlign={isRTL ? 'right' : 'left'}>
              {reason === 'limit_reached'
                ? t('exam.limitReached', 'لقد وصلت إلى الحد الأقصى للامتحانات هذا الشهر')
                : t('exam.upgradeRequired', 'قم بالترقية للنسخة الاحترافية لإنشاء المزيد')}
            </Text>
          </Card>
        )}

        {/* Generate Button */}
        <Button
          size="$5"
          theme="active"
          onPress={handleGenerateExam}
          disabled={!canGenerate || topics.length === 0 || isGenerating}
          opacity={!canGenerate || topics.length === 0 || isGenerating ? 0.5 : 1}
          icon={isGenerating ? <Spinner /> : undefined}
        >
          {isGenerating
            ? t('exam.starting', 'جارٍ البدء...')
            : t('exam.generateExam', 'إنشاء الامتحان')}
        </Button>
      </YStack>
    </YStack>
  )
}
