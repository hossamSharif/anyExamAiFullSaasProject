/**
 * Subscription Management Screen
 *
 * Comprehensive subscription management interface
 * Shows current plan, billing cycle, usage stats, and actions
 * Supports both Free and Pro tiers with Arabic RTL layout
 */

import { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Heading,
  Button,
  Card,
  Separator,
  Progress,
} from '@anyexamai/ui';
import { useSubscription, useIsPro, useUsageTracking } from '@anyexamai/api';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { UsageWidget } from '../../components/UsageWidget';

interface SubscriptionManagementScreenProps {
  /** Callback when upgrade is pressed */
  onUpgrade?: () => void;
  /** Callback when manage billing is pressed */
  onManageBilling?: () => void;
  /** Callback when cancel subscription is pressed */
  onCancelSubscription?: () => void;
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
 * Format date in Arabic or English
 */
function formatDate(date: Date, language: string): string {
  return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function SubscriptionManagementScreen({
  onUpgrade,
  onManageBilling,
  onCancelSubscription,
}: SubscriptionManagementScreenProps) {
  const { t, i18n } = useTranslation();
  const { data: subscription, isLoading } = useSubscription();
  const { data: isPro } = useIsPro();
  const { getCurrentUsage } = useUsageTracking();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const usage = getCurrentUsage();
  const isRTL = i18n.language === 'ar';

  // Format billing cycle dates
  const billingStart = new Date(usage.billingCycleStart);
  const billingEnd = new Date(billingStart);
  billingEnd.setMonth(billingEnd.getMonth() + 1);

  // Calculate days until reset
  const today = new Date();
  const daysUntilReset = Math.ceil(
    (billingEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
        <Text fontSize="$5" color="$gray11">
          {isRTL ? 'جاري التحميل...' : 'Loading...'}
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background" gap="$4">
      {/* Header */}
      <YStack gap="$2">
        <Heading fontSize="$8" fontWeight="700" color="$gray12">
          {isRTL ? 'إدارة الاشتراك' : 'Subscription Management'}
        </Heading>
        <Text fontSize="$4" color="$gray11">
          {isRTL
            ? 'عرض وإدارة تفاصيل اشتراكك'
            : 'View and manage your subscription details'}
        </Text>
      </YStack>

      <Separator />

      {/* Current Plan Card */}
      <Card
        padding="$5"
        backgroundColor={isPro ? '$blue2' : '$gray2'}
        borderWidth={1}
        borderColor={isPro ? '$blue6' : '$borderColor'}
        borderRadius="$4"
      >
        <YStack gap="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$4" fontWeight="600" color="$gray11">
              {isRTL ? 'الخطة الحالية' : 'Current Plan'}
            </Text>
            <Card
              padding="$2"
              paddingHorizontal="$3"
              backgroundColor={isPro ? '$blue9' : '$gray5'}
              borderRadius="$3"
            >
              <Text fontSize="$3" fontWeight="600" color={isPro ? 'white' : '$gray11'}>
                {isPro
                  ? isRTL ? 'احترافي' : 'Pro'
                  : isRTL ? 'مجاني' : 'Free'}
              </Text>
            </Card>
          </XStack>

          {isPro ? (
            <>
              <XStack gap="$2" alignItems="center">
                <Ionicons name="checkmark-circle" size={20} color="#0066CC" />
                <Text fontSize="$4" color="$gray12">
                  {isRTL
                    ? 'لديك وصول كامل لجميع الميزات المتقدمة'
                    : 'You have full access to all premium features'}
                </Text>
              </XStack>

              {subscription?.stripe_price_id && (
                <XStack gap="$2" alignItems="center">
                  <Ionicons name="card" size={20} color="#666" />
                  <Text fontSize="$3" color="$gray11">
                    {isRTL
                      ? `${toArabicNumerals(37, i18n.language)} ريال/شهرياً`
                      : '37 SAR/month'}
                  </Text>
                </XStack>
              )}
            </>
          ) : (
            <Text fontSize="$4" color="$gray11">
              {isRTL
                ? 'أنت حالياً على الخطة المجانية. قم بالترقية للحصول على المزيد من الميزات.'
                : 'You are currently on the free plan. Upgrade to get more features.'}
            </Text>
          )}
        </YStack>
      </Card>

      {/* Billing Cycle Card (for Pro users) */}
      {isPro && (
        <Card
          padding="$5"
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
        >
          <YStack gap="$3">
            <Text fontSize="$5" fontWeight="600" color="$gray12">
              {isRTL ? 'دورة الفوترة' : 'Billing Cycle'}
            </Text>

            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$gray11">
                  {isRTL ? 'بدأت في' : 'Started on'}
                </Text>
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  {formatDate(billingStart, i18n.language)}
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$gray11">
                  {isRTL ? 'التجديد التالي' : 'Next renewal'}
                </Text>
                <Text fontSize="$3" fontWeight="500" color="$gray12">
                  {formatDate(billingEnd, i18n.language)}
                </Text>
              </XStack>

              <XStack justifyContent="space-between">
                <Text fontSize="$3" color="$gray11">
                  {isRTL ? 'إعادة التعيين في' : 'Resets in'}
                </Text>
                <Text fontSize="$3" fontWeight="500" color="$blue10">
                  {isRTL
                    ? `${toArabicNumerals(daysUntilReset, i18n.language)} يوم`
                    : `${daysUntilReset} days`}
                </Text>
              </XStack>
            </YStack>
          </YStack>
        </Card>
      )}

      {/* Usage Statistics Card */}
      <Card
        padding="$5"
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$4"
      >
        <UsageWidget
          mode="full"
          showUpgradeButton={!isPro}
          onUpgradePress={onUpgrade}
        />
      </Card>

      <Separator />

      {/* Action Buttons */}
      <YStack gap="$3">
        {!isPro ? (
          // Free tier: Show upgrade button
          <Button
            size="$5"
            backgroundColor="$blue9"
            color="white"
            fontWeight="600"
            pressStyle={{ backgroundColor: '$blue10' }}
            onPress={onUpgrade}
            icon={
              <Ionicons
                name="arrow-up-circle"
                size={24}
                color="white"
              />
            }
          >
            {isRTL ? 'الترقية للنسخة الاحترافية' : 'Upgrade to Pro'}
          </Button>
        ) : (
          // Pro tier: Show manage billing and cancel buttons
          <>
            <Button
              size="$5"
              backgroundColor="$blue9"
              color="white"
              fontWeight="600"
              pressStyle={{ backgroundColor: '$blue10' }}
              onPress={onManageBilling}
              icon={
                <Ionicons
                  name="card"
                  size={24}
                  color="white"
                />
              }
            >
              {isRTL ? 'إدارة الفواتير' : 'Manage Billing'}
            </Button>

            <Button
              size="$5"
              variant="outline"
              borderColor="$red9"
              color="$red9"
              fontWeight="600"
              pressStyle={{ backgroundColor: '$red2' }}
              onPress={() => setShowCancelDialog(true)}
              icon={
                <Ionicons
                  name="close-circle"
                  size={24}
                  color="#DC2626"
                />
              }
            >
              {isRTL ? 'إلغاء الاشتراك' : 'Cancel Subscription'}
            </Button>
          </>
        )}
      </YStack>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <Card
          position="absolute"
          top="50%"
          left="50%"
          transform={[{ translateX: '-50%' }, { translateY: '-50%' }]}
          padding="$5"
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$5"
          shadowColor="$shadowColor"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={12}
          zIndex={1000}
          minWidth={300}
          maxWidth={400}
        >
          <YStack gap="$4">
            <YStack gap="$2">
              <Heading fontSize="$6" fontWeight="700" color="$red10">
                {isRTL ? 'تأكيد الإلغاء' : 'Confirm Cancellation'}
              </Heading>
              <Text fontSize="$4" color="$gray11">
                {isRTL
                  ? 'هل أنت متأكد من أنك تريد إلغاء اشتراكك؟ ستفقد الوصول إلى جميع الميزات المتقدمة.'
                  : 'Are you sure you want to cancel your subscription? You will lose access to all premium features.'}
              </Text>
            </YStack>

            <XStack gap="$3" justifyContent="flex-end">
              <Button
                size="$4"
                variant="outline"
                onPress={() => setShowCancelDialog(false)}
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                size="$4"
                backgroundColor="$red9"
                color="white"
                pressStyle={{ backgroundColor: '$red10' }}
                onPress={() => {
                  setShowCancelDialog(false);
                  onCancelSubscription?.();
                }}
              >
                {isRTL ? 'تأكيد الإلغاء' : 'Confirm Cancellation'}
              </Button>
            </XStack>
          </YStack>
        </Card>
      )}
    </YStack>
  );
}
