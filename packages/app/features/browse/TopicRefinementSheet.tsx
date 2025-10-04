/**
 * TopicRefinementSheet - Prompts users to refine broad topic selections
 *
 * Shows when user selects a general/broad topic, offering more specific subtopics.
 * Bottom sheet on mobile, modal on web. RTL-aware.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Sheet, YStack, XStack, Button, Text, ScrollView } from '@anyexam/ui'
import { TopicChip } from './TopicChip'

interface TopicRefinementSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  broadTopic: string
  subtopics: string[]
  onConfirm: (selectedSubtopics: string[]) => void
  onSkip: () => void
  isRTL: boolean
}

/**
 * Predefined subtopics for broad subjects
 * This can be expanded or fetched from API in the future
 */
export const SUBTOPIC_MAP: Record<string, string[]> = {
  // Chemistry subtopics
  'الكيمياء': ['الكيمياء العضوية', 'الكيمياء غير العضوية', 'الكيمياء الفيزيائية'],
  'Chemistry': ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry'],

  // Physics subtopics
  'الفيزياء': ['الميكانيكا', 'الكهرباء والمغناطيسية', 'البصريات', 'الديناميكا الحرارية'],
  'Physics': ['Mechanics', 'Electricity and Magnetism', 'Optics', 'Thermodynamics'],

  // Mathematics subtopics
  'الرياضيات': ['الجبر', 'الهندسة', 'حساب التفاضل والتكامل', 'الإحصاء'],
  'Mathematics': ['Algebra', 'Geometry', 'Calculus', 'Statistics'],

  // Biology subtopics
  'الأحياء': ['علم الخلية', 'علم الوراثة', 'علم البيئة', 'علم التشريح'],
  'Biology': ['Cell Biology', 'Genetics', 'Ecology', 'Anatomy'],

  // Computer Science subtopics
  'علوم الحاسوب': ['البرمجة', 'هياكل البيانات', 'الخوارزميات', 'قواعد البيانات'],
  'Computer Science': ['Programming', 'Data Structures', 'Algorithms', 'Databases'],
}

/**
 * Determines if a topic is broad and should trigger refinement
 */
export function isBroadTopic(topic: string): boolean {
  return Object.keys(SUBTOPIC_MAP).includes(topic)
}

/**
 * Gets subtopics for a broad topic
 */
export function getSubtopics(topic: string): string[] {
  return SUBTOPIC_MAP[topic] || []
}

export function TopicRefinementSheet({
  open,
  onOpenChange,
  broadTopic,
  subtopics,
  onConfirm,
  onSkip,
  isRTL,
}: TopicRefinementSheetProps) {
  const { t } = useTranslation()
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([])

  const toggleSubtopic = (subtopic: string) => {
    setSelectedSubtopics((prev) =>
      prev.includes(subtopic) ? prev.filter((s) => s !== subtopic) : [...prev, subtopic]
    )
  }

  const handleConfirm = () => {
    onConfirm(selectedSubtopics)
    setSelectedSubtopics([])
  }

  const handleSkip = () => {
    onSkip()
    setSelectedSubtopics([])
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      modal
      snapPoints={[85]}
      dismissOnSnapToBottom
    >
      <Sheet.Overlay
        animation="quick"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Frame
        padding="$4"
        gap="$4"
        backgroundColor="$background"
      >
        {/* Handle */}
        <Sheet.Handle />

        {/* Header */}
        <YStack gap="$2">
          <Text
            fontSize="$7"
            fontWeight="700"
            color="$gray12"
            textAlign={isRTL ? 'right' : 'left'}
          >
            {t('browse.refineTopic', 'حدد المواضيع الفرعية')}
          </Text>
          <Text
            fontSize="$4"
            color="$gray11"
            textAlign={isRTL ? 'right' : 'left'}
          >
            {t('browse.refinementMessage', 'لقد اخترت موضوعاً عاماً. اختر المواضيع الفرعية المحددة:')}
          </Text>
          <Text
            fontSize="$5"
            fontWeight="600"
            color="$blue10"
            textAlign={isRTL ? 'right' : 'left'}
            marginTop="$2"
          >
            {broadTopic}
          </Text>
        </YStack>

        {/* Subtopics */}
        <ScrollView maxHeight={300} showsVerticalScrollIndicator={false}>
          <XStack
            flexWrap="wrap"
            gap="$2"
            direction={isRTL ? 'rtl' : 'ltr'}
          >
            {subtopics.map((subtopic) => (
              <TopicChip
                key={subtopic}
                topic={subtopic}
                selected={selectedSubtopics.includes(subtopic)}
                onPress={() => toggleSubtopic(subtopic)}
                isRTL={isRTL}
              />
            ))}
          </XStack>
        </ScrollView>

        {/* Actions */}
        <YStack gap="$3">
          {/* Quick Actions */}
          <XStack gap="$2" justifyContent="space-between">
            <Button
              size="$3"
              chromeless
              onPress={() => setSelectedSubtopics(subtopics)}
              disabled={selectedSubtopics.length === subtopics.length}
            >
              {t('browse.selectAll', 'تحديد الكل')}
            </Button>
            <Button
              size="$3"
              chromeless
              onPress={() => setSelectedSubtopics([])}
              disabled={selectedSubtopics.length === 0}
            >
              {t('browse.clearAll', 'إلغاء التحديد')}
            </Button>
          </XStack>

          {/* Main Actions */}
          <XStack gap="$3">
            <Button
              flex={1}
              size="$4"
              onPress={handleSkip}
              backgroundColor="$gray5"
            >
              {t('browse.skipRefinement', 'تخطي')}
            </Button>
            <Button
              flex={2}
              size="$4"
              theme="active"
              onPress={handleConfirm}
              disabled={selectedSubtopics.length === 0}
              opacity={selectedSubtopics.length === 0 ? 0.5 : 1}
            >
              {t('browse.continue', 'متابعة')} ({selectedSubtopics.length})
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  )
}
