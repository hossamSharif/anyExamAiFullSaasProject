/**
 * Usage Widget Component
 *
 * Displays usage statistics for the current user
 * Shows progress bars for exams, documents, and questions
 * Adapts based on subscription tier (Free vs Pro)
 * Supports RTL layout for Arabic
 */

import { useState } from 'react';
import { YStack, XStack, Text, Progress, Button, Separator, Card } from '@anyexamai/ui';
import { useUsageTracking, useIsPro } from '@anyexamai/api';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

interface UsageWidgetProps {
  /** Display mode: 'compact' for header, 'full' for profile/settings */
  mode?: 'compact' | 'full';
  /** Show upgrade button when nearing limit */
  showUpgradeButton?: boolean;
  /** Callback when upgrade button is pressed */
  onUpgradePress?: () => void;
}

/**
 * Convert number to Arabic numerals
 */
function toArabicNumerals(num: number, language: string): string {
  if (language !== 'ar') return num.toString();

  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((digit) => arabicNumerals[parseInt(digit)] || digit)
    .join('');
}

/**
 * Get progress bar color based on usage percentage
 */
function getProgressColor(percentage: number): string {
  if (percentage >= 90) return '$red10';
  if (percentage >= 70) return '$orange10';
  return '$green10';
}

/**
 * Get background color based on usage percentage (for compact mode)
 */
function getBackgroundColor(percentage: number): string {
  if (percentage >= 90) return '$red2';
  if (percentage >= 70) return '$orange2';
  return '$green2';
}

export function UsageWidget({
  mode = 'full',
  showUpgradeButton = true,
  onUpgradePress
}: UsageWidgetProps) {
  const { t, i18n } = useTranslation();
  const { data: isPro, isLoading: isLoadingPro } = useIsPro();
  const { getCurrentUsage } = useUsageTracking();
  const [showDetails, setShowDetails] = useState(false);

  const usage = getCurrentUsage();
  const isRTL = i18n.language === 'ar';

  // Calculate percentages
  const examPercentage = usage.examsLimit > 0
    ? (usage.examsUsed / usage.examsLimit) * 100
    : 0;
  const documentPercentage = usage.documentsLimit > 0
    ? (usage.documentsUsed / usage.documentsLimit) * 100
    : 0;

  // Check if nearing limit (>= 80%)
  const nearingExamLimit = examPercentage >= 80 && !isPro;
  const nearingDocumentLimit = documentPercentage >= 80 && !isPro;
  const showUpgrade = (nearingExamLimit || nearingDocumentLimit) && showUpgradeButton;

  // For Pro users in compact mode
  if (isPro && mode === 'compact') {
    return (
      <Card
        padding="$2"
        backgroundColor="$blue2"
        borderRadius="$4"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => setShowDetails(!showDetails)}
      >
        <XStack alignItems="center" gap="$2">
          <Ionicons
            name="checkmark-circle"
            size={20}
            color="#0066CC"
          />
          <Text fontSize="$3" fontWeight="600" color="$blue10">
            {t('subscription.pro')}
          </Text>
          <Text fontSize="$2" color="$gray11">
            ({t('usage.unlimited')})
          </Text>
        </XStack>
      </Card>
    );
  }

  // Compact mode for Free users
  if (mode === 'compact') {
    return (
      <Card
        padding="$2"
        backgroundColor={getBackgroundColor(Math.max(examPercentage, documentPercentage))}
        borderRadius="$4"
        pressStyle={{ opacity: 0.8 }}
        onPress={() => setShowDetails(!showDetails)}
      >
        <XStack alignItems="center" gap="$2">
          <Text fontSize="$2" fontWeight="600" color="$gray12">
            {isRTL
              ? `${toArabicNumerals(usage.examsUsed, i18n.language)}/${toArabicNumerals(usage.examsLimit, i18n.language)}`
              : `${usage.examsUsed}/${usage.examsLimit}`
            }
          </Text>
          <Text fontSize="$2" color="$gray11">
            {t('navigation.home')}
          </Text>
          {showUpgrade && (
            <Ionicons
              name="arrow-up-circle"
              size={16}
              color="#FF9500"
            />
          )}
        </XStack>
      </Card>
    );
  }

  // Full mode - detailed view
  return (
    <YStack gap="$4">
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="700" color="$gray12">
          {t('paywall.usageStats')}
        </Text>
        {isPro && (
          <Card padding="$2" paddingHorizontal="$3" backgroundColor="$blue2" borderRadius="$3">
            <Text fontSize="$2" fontWeight="600" color="$blue10">
              {t('subscription.pro')}
            </Text>
          </Card>
        )}
      </YStack>

      {/* Exams Usage */}
      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <Ionicons
              name="document-text"
              size={20}
              color="#666"
            />
            <Text fontSize="$4" color="$gray11">
              {isRTL ? 'الامتحانات' : 'Exams'}
            </Text>
          </XStack>
          <Text fontSize="$4" fontWeight="600" color="$gray12">
            {isPro ? (
              t('usage.unlimited')
            ) : (
              isRTL
                ? `${toArabicNumerals(usage.examsUsed, i18n.language)}/${toArabicNumerals(usage.examsLimit, i18n.language)}`
                : `${usage.examsUsed}/${usage.examsLimit}`
            )}
          </Text>
        </XStack>
        {!isPro && (
          <Progress
            value={examPercentage}
            backgroundColor="$gray4"
            height="$0.5"
          >
            <Progress.Indicator
              animation="bouncy"
              backgroundColor={getProgressColor(examPercentage)}
            />
          </Progress>
        )}
        {isPro && (
          <Progress
            value={100}
            backgroundColor="$blue3"
            height="$0.5"
          >
            <Progress.Indicator
              animation="bouncy"
              backgroundColor="$blue9"
            />
          </Progress>
        )}
      </YStack>

      {/* Documents Upload */}
      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <Ionicons
              name="cloud-upload"
              size={20}
              color="#666"
            />
            <Text fontSize="$4" color="$gray11">
              {isRTL ? 'رفع المستندات' : 'Documents'}
            </Text>
          </XStack>
          <Text fontSize="$4" fontWeight="600" color="$gray12">
            {isPro ? (
              isRTL
                ? `${toArabicNumerals(usage.documentsUsed, i18n.language)}/${toArabicNumerals(usage.documentsLimit, i18n.language)}`
                : `${usage.documentsUsed}/${usage.documentsLimit}`
            ) : (
              isRTL ? 'غير متاح' : 'Not available'
            )}
          </Text>
        </XStack>
        {isPro ? (
          <Progress
            value={documentPercentage}
            backgroundColor="$gray4"
            height="$0.5"
          >
            <Progress.Indicator
              animation="bouncy"
              backgroundColor={getProgressColor(documentPercentage)}
            />
          </Progress>
        ) : (
          <Progress
            value={0}
            backgroundColor="$gray4"
            height="$0.5"
          >
            <Progress.Indicator
              animation="bouncy"
              backgroundColor="$gray6"
            />
          </Progress>
        )}
      </YStack>

      {/* Questions per Exam */}
      <YStack gap="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <Ionicons
              name="help-circle"
              size={20}
              color="#666"
            />
            <Text fontSize="$4" color="$gray11">
              {isRTL ? 'الأسئلة لكل امتحان' : 'Questions per Exam'}
            </Text>
          </XStack>
          <Text fontSize="$4" fontWeight="600" color="$gray12">
            {isRTL
              ? `${toArabicNumerals(usage.questionsPerExamLimit, i18n.language)} ${isPro ? 'كحد أقصى' : 'كحد أقصى'}`
              : `${usage.questionsPerExamLimit} max`
            }
          </Text>
        </XStack>
      </YStack>

      {/* Reset Date */}
      {!isPro && (
        <>
          <Separator />
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$3" color="$gray11">
              {isRTL ? 'إعادة التعيين' : 'Resets'}
            </Text>
            <Text fontSize="$3" color="$gray11">
              {new Date(usage.billingCycleStart).toLocaleDateString(
                isRTL ? 'ar-SA' : 'en-US',
                { month: 'long', year: 'numeric' }
              )}
            </Text>
          </XStack>
        </>
      )}

      {/* Upgrade Button */}
      {showUpgrade && onUpgradePress && (
        <>
          <Separator />
          <Button
            size="$4"
            backgroundColor="$blue9"
            color="white"
            fontWeight="600"
            pressStyle={{ backgroundColor: '$blue10' }}
            onPress={onUpgradePress}
            icon={
              <Ionicons
                name="arrow-up-circle"
                size={20}
                color="white"
              />
            }
          >
            {isRTL ? 'ترقية للنسخة الاحترافية' : 'Upgrade to Pro'}
          </Button>
        </>
      )}
    </YStack>
  );
}
