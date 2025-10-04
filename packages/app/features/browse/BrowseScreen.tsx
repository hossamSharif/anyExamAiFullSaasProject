/**
 * BrowseScreen - Arabic Category Browser
 *
 * Displays grid of educational subjects in Arabic with search and filtering.
 * Supports RTL layout and Arabic numerals.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { YStack, XStack, Input, Spinner, ScrollView, Text, Card } from '@anyexam/ui'
import { useSubjects } from '@anyexam/api'
import { SubjectCard } from './SubjectCard'
import { Search } from '@tamagui/lucide-icons'

export function BrowseScreen() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch subjects
  const { data: subjects, isLoading, error, refetch } = useSubjects(i18n.language)

  // Filter subjects based on search query
  const filteredSubjects = subjects?.filter((subject) =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Subject icons mapping (placeholder - can be enhanced with actual icons)
  const subjectIcons: Record<string, string> = {
    'الرياضيات': '🔢',
    'الفيزياء': '⚛️',
    'الكيمياء': '🧪',
    'الأحياء': '🧬',
    'علوم الحاسوب': '💻',
    'اللغة العربية': '📖',
    'التاريخ': '📜',
    'الجغرافيا': '🌍',
    'الاقتصاد': '💰',
    'الفلسفة': '🤔',
  }

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      {/* Search Bar */}
      <XStack
        gap="$2"
        marginBottom="$4"
        alignItems="center"
        direction={isRTL ? 'rtl' : 'ltr'}
      >
        <XStack
          flex={1}
          backgroundColor="$backgroundHover"
          borderRadius="$4"
          padding="$3"
          alignItems="center"
          gap="$2"
          direction={isRTL ? 'rtl' : 'ltr'}
        >
          <Search size={20} color="$gray10" />
          <Input
            flex={1}
            placeholder={t('browse.searchSubjects', 'ابحث عن موضوع...')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign={isRTL ? 'right' : 'left'}
            borderWidth={0}
            backgroundColor="transparent"
            padding={0}
          />
        </XStack>
      </XStack>

      {/* Content */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={{
          refreshing: isLoading,
          onRefresh: refetch,
        }}
      >
        {isLoading ? (
          // Loading State
          <YStack gap="$4" paddingTop="$4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <Card
                key={index}
                height={100}
                backgroundColor="$backgroundHover"
                animation="quick"
                opacity={0.5}
              />
            ))}
          </YStack>
        ) : error ? (
          // Error State
          <YStack alignItems="center" paddingTop="$8" gap="$4">
            <Text fontSize="$6" color="$red10">
              {t('browse.errorLoading', 'خطأ في تحميل المواد')}
            </Text>
            <Text fontSize="$3" color="$gray10" textAlign="center">
              {error instanceof Error ? error.message : String(error)}
            </Text>
          </YStack>
        ) : !filteredSubjects || filteredSubjects.length === 0 ? (
          // Empty State
          <YStack alignItems="center" paddingTop="$8" gap="$4">
            <Text fontSize="$8">🔍</Text>
            <Text fontSize="$6" fontWeight="600" color="$gray12">
              {searchQuery
                ? t('browse.noResults', 'لا توجد نتائج')
                : t('browse.noSubjects', 'لا توجد مواد متاحة')}
            </Text>
            {searchQuery && (
              <Text fontSize="$3" color="$gray10" textAlign="center">
                {t('browse.tryDifferentSearch', 'جرب البحث بكلمات أخرى')}
              </Text>
            )}
          </YStack>
        ) : (
          // Subject Grid
          <YStack gap="$3" paddingBottom="$4">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject}
                subject={subject}
                icon={subjectIcons[subject] || '📚'}
                isRTL={isRTL}
              />
            ))}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  )
}
