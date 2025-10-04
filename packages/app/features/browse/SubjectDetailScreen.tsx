/**
 * SubjectDetailScreen - Display topics within a subject
 *
 * Allows users to select topics and navigate to exam configuration.
 * Supports multi-select with Arabic chips and RTL layout.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { YStack, XStack, Button, Text, ScrollView, Spinner } from '@anyexam/ui'
import { useTopicsBySubject } from '@anyexam/api'
import { useRouter } from 'solito/router'
import { TopicChip } from './TopicChip'
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons'

interface SubjectDetailScreenProps {
  subject: string
}

export function SubjectDetailScreen({ subject }: SubjectDetailScreenProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const isRTL = i18n.language === 'ar'
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])

  // Fetch topics for this subject
  const { data: topics, isLoading, error } = useTopicsBySubject(subject, i18n.language)

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    )
  }

  const handleCreateExam = () => {
    // Navigate to exam configuration with selected topics
    const params = new URLSearchParams({
      subject,
      topics: selectedTopics.join(','),
    })
    router.push(`/exam/configure?${params.toString()}`)
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
        <YStack flex={1}>
          <Text fontSize="$7" fontWeight="700" color="$gray12" textAlign={isRTL ? 'right' : 'left'}>
            {subject}
          </Text>
          {selectedTopics.length > 0 && (
            <Text fontSize="$3" color="$gray10" textAlign={isRTL ? 'right' : 'left'}>
              {selectedTopics.length} {t('browse.topicsSelected', 'مواضيع محددة')}
            </Text>
          )}
        </YStack>
      </XStack>

      {/* Content */}
      <ScrollView flex={1} padding="$4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          // Loading State
          <YStack alignItems="center" paddingTop="$8">
            <Spinner size="large" color="$blue10" />
            <Text fontSize="$4" color="$gray10" marginTop="$4">
              {t('browse.loadingTopics', 'جاري تحميل المواضيع...')}
            </Text>
          </YStack>
        ) : error ? (
          // Error State
          <YStack alignItems="center" paddingTop="$8" gap="$4">
            <Text fontSize="$6" color="$red10">
              {t('browse.errorLoadingTopics', 'خطأ في تحميل المواضيع')}
            </Text>
            <Text fontSize="$3" color="$gray10" textAlign="center">
              {error instanceof Error ? error.message : String(error)}
            </Text>
          </YStack>
        ) : !topics || topics.length === 0 ? (
          // Empty State
          <YStack alignItems="center" paddingTop="$8" gap="$4">
            <Text fontSize="$8">📚</Text>
            <Text fontSize="$6" fontWeight="600" color="$gray12">
              {t('browse.noTopicsAvailable', 'لا توجد مواضيع متاحة')}
            </Text>
          </YStack>
        ) : (
          // Topics Grid
          <YStack gap="$4">
            {/* Instructions */}
            <Text fontSize="$4" color="$gray11" textAlign={isRTL ? 'right' : 'left'}>
              {t('browse.selectTopicsInstruction', 'اختر المواضيع التي تريد إنشاء امتحان عنها:')}
            </Text>

            {/* Topic Chips */}
            <XStack
              flexWrap="wrap"
              gap="$2"
              direction={isRTL ? 'rtl' : 'ltr'}
            >
              {topics.map((topic) => (
                <TopicChip
                  key={topic}
                  topic={topic}
                  selected={selectedTopics.includes(topic)}
                  onPress={() => toggleTopic(topic)}
                  isRTL={isRTL}
                />
              ))}
            </XStack>
          </YStack>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      {topics && topics.length > 0 && (
        <YStack
          padding="$4"
          gap="$3"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          backgroundColor="$background"
        >
          {/* Select All / Clear All */}
          <XStack gap="$2" justifyContent="space-between">
            <Button
              size="$3"
              chromeless
              onPress={() => setSelectedTopics(topics)}
              disabled={selectedTopics.length === topics.length}
            >
              {t('browse.selectAll', 'تحديد الكل')}
            </Button>
            <Button
              size="$3"
              chromeless
              onPress={() => setSelectedTopics([])}
              disabled={selectedTopics.length === 0}
            >
              {t('browse.clearAll', 'إلغاء التحديد')}
            </Button>
          </XStack>

          {/* Create Exam Button */}
          <Button
            size="$5"
            theme="active"
            onPress={handleCreateExam}
            disabled={selectedTopics.length === 0}
            opacity={selectedTopics.length === 0 ? 0.5 : 1}
          >
            {t('browse.createExam', 'إنشاء امتحان')}
          </Button>
        </YStack>
      )}
    </YStack>
  )
}
