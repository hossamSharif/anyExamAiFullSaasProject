/**
 * ExamStartScreen - Exam overview and start screen (Story 4.1)
 *
 * Shows exam title, description, question count, estimated time, topics, and difficulty chart.
 * Provides "بدء الامتحان" button to start the exam.
 * Supports RTL layout for Arabic interface.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { YStack, XStack, Button, Text, Card, ScrollView, Spinner } from '@anyexam/ui'
import { useRouter } from 'solito/router'
import { ArrowLeft, ArrowRight, Clock, BookOpen, BarChart3 } from '@tamagui/lucide-icons'
import { useExam } from '@anyexam/api'

interface ExamStartScreenProps {
  examId: string
}

export function ExamStartScreen({ examId }: ExamStartScreenProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isRTL = i18n.language === 'ar'

  const { data: exam, isLoading, error } = useExam(examId)

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

  // Format difficulty in Arabic
  const getDifficultyLabel = (difficulty: string): string => {
    const difficultyMap: Record<string, { ar: string; en: string }> = {
      easy: { ar: 'سهل', en: 'Easy' },
      medium: { ar: 'متوسط', en: 'Medium' },
      hard: { ar: 'صعب', en: 'Hard' },
    }
    return isRTL ? difficultyMap[difficulty]?.ar || difficulty : difficultyMap[difficulty]?.en || difficulty
  }

  // Estimate time based on question count (2 minutes per question average)
  const estimatedMinutes = exam ? exam.total_questions * 2 : 0

  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  const handleStartExam = () => {
    // Navigate to exam taking screen (to be created in Story 4.2)
    router.push(`/exam/take/${examId}`)
  }

  const handleSaveForLater = () => {
    // Navigate back to home
    router.push('/')
  }

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

  if (error || !exam) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background" padding="$4">
        <Text fontSize="$6" fontWeight="600" color="$red10" textAlign="center">
          {t('error', 'خطأ')}
        </Text>
        <Text fontSize="$4" color="$gray11" marginTop="$2" textAlign="center">
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
          {t('exam.overview', 'نظرة عامة')}
        </Text>
      </XStack>

      {/* Content */}
      <ScrollView flex={1}>
        <YStack padding="$4" gap="$5">
          {/* Exam Title and Description */}
          <Card padding="$5" backgroundColor="$blue2" borderColor="$blue6">
            <YStack gap="$3">
              <Text
                fontSize="$8"
                fontWeight="700"
                color="$blue11"
                textAlign={isRTL ? 'right' : 'left'}
              >
                {exam.title}
              </Text>
              {exam.description && (
                <Text
                  fontSize="$4"
                  color="$gray11"
                  textAlign={isRTL ? 'right' : 'left'}
                  lineHeight="$5"
                >
                  {exam.description}
                </Text>
              )}
            </YStack>
          </Card>

          {/* Question Count and Estimated Time */}
          <XStack gap="$3">
            <Card flex={1} padding="$4" backgroundColor="$backgroundHover">
              <YStack gap="$2" alignItems={isRTL ? 'flex-end' : 'flex-start'}>
                <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                  <BookOpen size={20} color="$blue10" />
                  <Text fontSize="$3" color="$gray11">
                    {t('exam.questionsCount', { count: exam.total_questions })}
                  </Text>
                </XStack>
                <Text fontSize="$7" fontWeight="700" color="$blue11">
                  {formatNumber(exam.total_questions)}
                </Text>
              </YStack>
            </Card>

            <Card flex={1} padding="$4" backgroundColor="$backgroundHover">
              <YStack gap="$2" alignItems={isRTL ? 'flex-end' : 'flex-start'}>
                <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                  <Clock size={20} color="$green10" />
                  <Text fontSize="$3" color="$gray11">
                    {t('exam.estimatedTime', 'الوقت المتوقع')}
                  </Text>
                </XStack>
                <Text fontSize="$7" fontWeight="700" color="$green11">
                  {formatNumber(estimatedMinutes)} {t('exam.minutes', 'دقيقة')}
                </Text>
              </YStack>
            </Card>
          </XStack>

          {/* Topics */}
          {exam.topics && exam.topics.length > 0 && (
            <Card padding="$4" backgroundColor="$backgroundHover">
              <YStack gap="$3">
                <Text
                  fontSize="$5"
                  fontWeight="600"
                  color="$gray12"
                  textAlign={isRTL ? 'right' : 'left'}
                >
                  {t('exam.topics', 'المواضيع')}
                </Text>
                <XStack flexWrap="wrap" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                  {exam.topics.map((topic, index) => (
                    <Card
                      key={index}
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      backgroundColor="$blue3"
                      borderColor="$blue7"
                    >
                      <Text fontSize="$3" color="$blue11">
                        {topic}
                      </Text>
                    </Card>
                  ))}
                </XStack>
              </YStack>
            </Card>
          )}

          {/* Difficulty */}
          {exam.difficulty && (
            <Card padding="$4" backgroundColor="$backgroundHover">
              <YStack gap="$3">
                <XStack
                  justifyContent="space-between"
                  alignItems="center"
                  direction={isRTL ? 'rtl' : 'ltr'}
                >
                  <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                    <BarChart3 size={20} color="$purple10" />
                    <Text fontSize="$5" fontWeight="600" color="$gray12">
                      {t('exam.difficulty', 'مستوى الصعوبة')}
                    </Text>
                  </XStack>
                  <Card
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    backgroundColor={
                      exam.difficulty === 'easy'
                        ? '$green3'
                        : exam.difficulty === 'medium'
                        ? '$orange3'
                        : '$red3'
                    }
                    borderColor={
                      exam.difficulty === 'easy'
                        ? '$green7'
                        : exam.difficulty === 'medium'
                        ? '$orange7'
                        : '$red7'
                    }
                  >
                    <Text
                      fontSize="$4"
                      fontWeight="600"
                      color={
                        exam.difficulty === 'easy'
                          ? '$green11'
                          : exam.difficulty === 'medium'
                          ? '$orange11'
                          : '$red11'
                      }
                    >
                      {getDifficultyLabel(exam.difficulty)}
                    </Text>
                  </Card>
                </XStack>
              </YStack>
            </Card>
          )}
        </YStack>
      </ScrollView>

      {/* Bottom Actions */}
      <YStack
        padding="$4"
        gap="$3"
        borderTopWidth={1}
        borderTopColor="$borderColor"
        backgroundColor="$background"
      >
        <Button
          size="$5"
          theme="active"
          onPress={handleStartExam}
          icon={isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
          iconAfter={!isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        >
          {t('exam.startExam', 'بدء الامتحان')}
        </Button>

        <Button size="$4" chromeless onPress={handleSaveForLater}>
          {t('exam.saveForLater', 'حفظ لوقت لاحق')}
        </Button>
      </YStack>
    </YStack>
  )
}
