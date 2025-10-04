/**
 * SubjectCard - Displays a subject with icon and metadata
 *
 * Touch-optimized card with minimum 44x44pt tap target.
 * Supports RTL layout for Arabic.
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, XStack, YStack, Text } from '@anyexam/ui'
import { ChevronRight, ChevronLeft } from '@tamagui/lucide-icons'
import { useTopicsBySubject } from '@anyexam/api'
import { useRouter } from 'solito/router'

interface SubjectCardProps {
  subject: string
  icon: string
  isRTL: boolean
}

export function SubjectCard({ subject, icon, isRTL }: SubjectCardProps) {
  const { t, i18n } = useTranslation()
  const router = useRouter()

  // Fetch topic count for this subject
  const { data: topics } = useTopicsBySubject(subject, i18n.language)
  const topicCount = topics?.length || 0

  // Convert number to Arabic numerals if RTL
  const formatNumber = (num: number): string => {
    if (!isRTL) return num.toString()

    // Arabic-Indic numerals
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
    return num
      .toString()
      .split('')
      .map((digit) => arabicNumerals[parseInt(digit)] || digit)
      .join('')
  }

  const handlePress = () => {
    // Navigate to subject detail screen
    router.push(`/browse/${encodeURIComponent(subject)}`)
  }

  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  return (
    <Card
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      onPress={handlePress}
      minHeight={80}
      padding="$4"
      backgroundColor="$backgroundHover"
      hoverStyle={{
        backgroundColor: '$backgroundPress',
        borderColor: '$borderColorHover',
      }}
      cursor="pointer"
    >
      <XStack
        gap="$4"
        alignItems="center"
        justifyContent="space-between"
        direction={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Icon and Text */}
        <XStack gap="$3" alignItems="center" flex={1} direction={isRTL ? 'rtl' : 'ltr'}>
          {/* Icon */}
          <YStack
            width={56}
            height={56}
            alignItems="center"
            justifyContent="center"
            backgroundColor="$background"
            borderRadius="$4"
          >
            <Text fontSize={32}>{icon}</Text>
          </YStack>

          {/* Text */}
          <YStack flex={1} gap="$1">
            <Text
              fontSize="$6"
              fontWeight="600"
              color="$gray12"
              textAlign={isRTL ? 'right' : 'left'}
            >
              {subject}
            </Text>
            <Text
              fontSize="$3"
              color="$gray10"
              textAlign={isRTL ? 'right' : 'left'}
            >
              {formatNumber(topicCount)} {t('browse.topics', 'مواضيع')}
            </Text>
          </YStack>
        </XStack>

        {/* Chevron */}
        <ChevronIcon size={24} color="$gray10" />
      </XStack>
    </Card>
  )
}
