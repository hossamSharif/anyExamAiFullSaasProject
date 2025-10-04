/**
 * ExamHistoryScreen - Display list of completed exams (Story 4.13)
 *
 * Shows chronological list of exams with Arabic dates, search/filter,
 * sort options, and swipe actions.
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl } from 'react-native'
import {
  YStack,
  XStack,
  Button,
  Text,
  Card,
  ScrollView,
  Spinner,
  Input,
  Sheet,
} from '@anyexam/ui'
import { useRouter } from 'solito/router'
import { Search, SlidersHorizontal, Trash2, Eye, RefreshCw, Clock, CheckCircle2, XCircle } from '@tamagui/lucide-icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, useAuth } from '@anyexam/api'

type SortOption = 'newest' | 'oldest' | 'highScore' | 'lowScore'
type FilterOption = 'all' | 'passed' | 'failed'

interface ExamAttempt {
  id: string
  exam_id: string
  exam_title: string
  status: string
  score: number | null
  total_questions: number
  correct_answers: number
  time_spent_seconds: number
  created_at: string
  completed_at: string | null
}

export function ExamHistoryScreen() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isRTL = i18n.language === 'ar'

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showSortSheet, setShowSortSheet] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch exam history
  const { data: attempts, isLoading, refetch } = useQuery({
    queryKey: ['exam-history', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attempts')
        .select(`
          id,
          exam_id,
          status,
          score,
          total_questions,
          correct_answers,
          time_spent_seconds,
          created_at,
          completed_at,
          exams (
            title
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'submitted')
        .order('completed_at', { ascending: false })

      if (error) throw error

      return data.map((attempt) => ({
        ...attempt,
        exam_title: (attempt.exams as any)?.title || 'امتحان',
      })) as ExamAttempt[]
    },
    enabled: !!user,
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (attemptId: string) => {
      const { error } = await supabase.from('attempts').delete().eq('id', attemptId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-history'] })
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

  // Format date to Arabic
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return t('history.today', 'اليوم')
    if (diffDays === 1) return t('history.yesterday', 'أمس')
    if (diffDays < 7) return t('history.daysAgo', { count: diffDays })
    if (diffDays < 30) return t('history.weeksAgo', { count: Math.floor(diffDays / 7) })
    return t('history.monthsAgo', { count: Math.floor(diffDays / 30) })
  }

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${formatNumber(mins)}:${formatNumber(secs).padStart(2, '0')}`
  }

  // Filter and sort attempts
  const filteredAndSortedAttempts = attempts
    ?.filter((attempt) => {
      // Search filter
      if (searchQuery && !attempt.exam_title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Status filter
      if (filterBy === 'passed' && (attempt.score || 0) < 50) return false
      if (filterBy === 'failed' && (attempt.score || 0) >= 50) return false

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.completed_at || b.created_at).getTime() - new Date(a.completed_at || a.created_at).getTime()
        case 'oldest':
          return new Date(a.completed_at || a.created_at).getTime() - new Date(b.completed_at || b.created_at).getTime()
        case 'highScore':
          return (b.score || 0) - (a.score || 0)
        case 'lowScore':
          return (a.score || 0) - (b.score || 0)
        default:
          return 0
      }
    })

  // Pull to refresh
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    setIsRefreshing(false)
  }

  // Delete exam
  const handleDelete = async (attemptId: string) => {
    if (confirm(t('history.deleteConfirm', 'هل أنت متأكد من حذف هذا الامتحان؟'))) {
      try {
        await deleteMutation.mutateAsync(attemptId)
      } catch (error) {
        console.error('Failed to delete:', error)
      }
    }
  }

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text fontSize="$4" color="$gray11" marginTop="$4">
          {t('history.loading', 'جاري التحميل...')}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      {/* Header */}
      <YStack
        padding="$4"
        gap="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        backgroundColor="$backgroundHover"
      >
        <Text fontSize="$6" fontWeight="700" color="$gray12" textAlign={isRTL ? 'right' : 'left'}>
          {t('history.title', 'سجل الامتحانات')}
        </Text>

        {/* Search and Filter Bar */}
        <XStack gap="$3" direction={isRTL ? 'rtl' : 'ltr'}>
          <Input
            flex={1}
            placeholder={t('history.searchPlaceholder', 'بحث في الامتحانات...')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            textAlign={isRTL ? 'right' : 'left'}
            size="$4"
          >
            <Input.Icon>
              <Search size={20} color="$gray10" />
            </Input.Icon>
          </Input>

          <Button
            circular
            size="$4"
            chromeless
            onPress={() => setShowSortSheet(true)}
            icon={<SlidersHorizontal size={20} />}
          />
        </XStack>

        {/* Filter Chips */}
        <XStack gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
          <Button
            size="$3"
            chromeless={filterBy !== 'all'}
            theme={filterBy === 'all' ? 'active' : undefined}
            onPress={() => setFilterBy('all')}
          >
            {t('history.filterAll', 'الكل')}
          </Button>
          <Button
            size="$3"
            chromeless={filterBy !== 'passed'}
            backgroundColor={filterBy === 'passed' ? '$green3' : undefined}
            borderColor={filterBy === 'passed' ? '$green7' : undefined}
            onPress={() => setFilterBy('passed')}
            icon={<CheckCircle2 size={16} color={filterBy === 'passed' ? '$green10' : '$gray10'} />}
          >
            {t('history.filterPassed', 'ناجح')}
          </Button>
          <Button
            size="$3"
            chromeless={filterBy !== 'failed'}
            backgroundColor={filterBy === 'failed' ? '$red3' : undefined}
            borderColor={filterBy === 'failed' ? '$red7' : undefined}
            onPress={() => setFilterBy('failed')}
            icon={<XCircle size={16} color={filterBy === 'failed' ? '$red10' : '$gray10'} />}
          >
            {t('history.filterFailed', 'راسب')}
          </Button>
        </XStack>
      </YStack>

      {/* Exam List */}
      <ScrollView
        flex={1}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        {filteredAndSortedAttempts && filteredAndSortedAttempts.length > 0 ? (
          <YStack padding="$4" gap="$3">
            {filteredAndSortedAttempts.map((attempt) => (
              <Card
                key={attempt.id}
                padding="$4"
                backgroundColor="$backgroundHover"
                borderColor="$borderColor"
                pressStyle={{ scale: 0.98 }}
                onPress={() => router.push(`/exam/results/${attempt.id}`)}
              >
                <YStack gap="$3">
                  {/* Header */}
                  <XStack justifyContent="space-between" alignItems="flex-start" direction={isRTL ? 'rtl' : 'ltr'}>
                    <YStack flex={1} gap="$1">
                      <Text fontSize="$5" fontWeight="600" color="$gray12" textAlign={isRTL ? 'right' : 'left'}>
                        {attempt.exam_title}
                      </Text>
                      <Text fontSize="$2" color="$gray10" textAlign={isRTL ? 'right' : 'left'}>
                        {formatDate(attempt.completed_at || attempt.created_at)}
                      </Text>
                    </YStack>

                    {/* Score Badge */}
                    <Card
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      backgroundColor={(attempt.score || 0) >= 50 ? '$green3' : '$red3'}
                      borderColor={(attempt.score || 0) >= 50 ? '$green7' : '$red7'}
                    >
                      <Text
                        fontSize="$4"
                        fontWeight="700"
                        color={(attempt.score || 0) >= 50 ? '$green11' : '$red11'}
                      >
                        {formatNumber(Math.round(attempt.score || 0))}%
                      </Text>
                    </Card>
                  </XStack>

                  {/* Stats */}
                  <XStack gap="$4" direction={isRTL ? 'rtl' : 'ltr'}>
                    <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                      <CheckCircle2 size={16} color="$blue10" />
                      <Text fontSize="$3" color="$gray11">
                        {formatNumber(attempt.correct_answers)}/{formatNumber(attempt.total_questions)}{' '}
                        {t('history.questions', 'أسئلة')}
                      </Text>
                    </XStack>

                    <XStack alignItems="center" gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                      <Clock size={16} color="$purple10" />
                      <Text fontSize="$3" color="$gray11">
                        {formatTime(attempt.time_spent_seconds || 0)}
                      </Text>
                    </XStack>
                  </XStack>

                  {/* Actions */}
                  <XStack gap="$2" direction={isRTL ? 'rtl' : 'ltr'}>
                    <Button
                      flex={1}
                      size="$3"
                      theme="active"
                      onPress={() => router.push(`/exam/results/${attempt.id}`)}
                      icon={<Eye size={16} />}
                    >
                      {t('history.viewResults', 'عرض النتائج')}
                    </Button>

                    <Button
                      flex={1}
                      size="$3"
                      chromeless
                      onPress={() => router.push(`/exam/retake/${attempt.exam_id}`)}
                      icon={<RefreshCw size={16} />}
                    >
                      {t('history.retake', 'إعادة')}
                    </Button>

                    <Button
                      circular
                      size="$3"
                      chromeless
                      onPress={() => handleDelete(attempt.id)}
                      icon={<Trash2 size={16} color="$red10" />}
                    />
                  </XStack>
                </YStack>
              </Card>
            ))}
          </YStack>
        ) : (
          <YStack flex={1} alignItems="center" justifyContent="center" padding="$6" gap="$3">
            <Text fontSize="$6" fontWeight="600" color="$gray12" textAlign="center">
              {t('history.noExams', 'لا توجد امتحانات')}
            </Text>
            <Text fontSize="$4" color="$gray10" textAlign="center">
              {t('history.noExamsMessage', 'ابدأ بإنشاء امتحانك الأول')}
            </Text>
            <Button marginTop="$3" theme="active" onPress={() => router.push('/browse')}>
              {t('exam.generateExam', 'إنشاء امتحان')}
            </Button>
          </YStack>
        )}
      </ScrollView>

      {/* Sort Sheet */}
      <Sheet open={showSortSheet} onOpenChange={setShowSortSheet} snapPoints={[50]} dismissOnSnapToBottom>
        <Sheet.Overlay />
        <Sheet.Frame padding="$4" backgroundColor="$background">
          <Sheet.Handle />
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="700" color="$gray12" textAlign={isRTL ? 'right' : 'left'}>
              {t('history.sortBy', 'ترتيب حسب')}
            </Text>

            <Button
              size="$4"
              chromeless={sortBy !== 'newest'}
              theme={sortBy === 'newest' ? 'active' : undefined}
              justifyContent={isRTL ? 'flex-end' : 'flex-start'}
              onPress={() => {
                setSortBy('newest')
                setShowSortSheet(false)
              }}
            >
              {t('history.sortNewest', 'الأحدث')}
            </Button>

            <Button
              size="$4"
              chromeless={sortBy !== 'oldest'}
              theme={sortBy === 'oldest' ? 'active' : undefined}
              justifyContent={isRTL ? 'flex-end' : 'flex-start'}
              onPress={() => {
                setSortBy('oldest')
                setShowSortSheet(false)
              }}
            >
              {t('history.sortOldest', 'الأقدم')}
            </Button>

            <Button
              size="$4"
              chromeless={sortBy !== 'highScore'}
              theme={sortBy === 'highScore' ? 'active' : undefined}
              justifyContent={isRTL ? 'flex-end' : 'flex-start'}
              onPress={() => {
                setSortBy('highScore')
                setShowSortSheet(false)
              }}
            >
              {t('history.sortHighScore', 'أعلى نتيجة')}
            </Button>

            <Button
              size="$4"
              chromeless={sortBy !== 'lowScore'}
              theme={sortBy === 'lowScore' ? 'active' : undefined}
              justifyContent={isRTL ? 'flex-end' : 'flex-start'}
              onPress={() => {
                setSortBy('lowScore')
                setShowSortSheet(false)
              }}
            >
              {t('history.sortLowScore', 'أدنى نتيجة')}
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  )
}
