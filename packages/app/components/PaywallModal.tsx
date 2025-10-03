/**
 * Paywall Modal Component
 *
 * Displayed when free tier users reach their usage limits
 * Shows usage statistics and prompts upgrade to Pro tier
 * Supports Arabic with RTL layout
 */

import React from 'react';
import {
  Dialog,
  YStack,
  XStack,
  H3,
  Text,
  Button,
  Progress,
  Separator,
} from '@anyexamai/ui';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Sparkles, Check } from '@tamagui/lucide-icons';
import { Platform } from 'react-native';

export interface PaywallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
  limitType: 'exam' | 'document' | 'question';
  currentUsage?: {
    examsUsed: number;
    examsLimit: number;
    documentsUsed?: number;
    documentsLimit?: number;
  };
  loading?: boolean;
}

export function PaywallModal({
  open,
  onOpenChange,
  onUpgrade,
  limitType,
  currentUsage,
  loading = false,
}: PaywallModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const getLimitMessage = () => {
    switch (limitType) {
      case 'exam':
        return {
          title: t('paywall.examLimit.title', 'لقد وصلت إلى حد الامتحانات'),
          description: t(
            'paywall.examLimit.description',
            'لقد استخدمت جميع امتحاناتك المجانية لهذا الشهر. قم بالترقية للنسخة الاحترافية للمتابعة.'
          ),
        };
      case 'document':
        return {
          title: t('paywall.documentLimit.title', 'رفع المستندات غير متاح'),
          description: t(
            'paywall.documentLimit.description',
            'رفع المستندات متاح فقط للنسخة الاحترافية. قم بالترقية للوصول إلى هذه الميزة.'
          ),
        };
      case 'question':
        return {
          title: t('paywall.questionLimit.title', 'حد الأسئلة'),
          description: t(
            'paywall.questionLimit.description',
            'الحد الأقصى للنسخة المجانية هو 10 أسئلة. قم بالترقية لإنشاء امتحانات أطول.'
          ),
        };
      default:
        return {
          title: t('paywall.default.title', 'الترقية مطلوبة'),
          description: t(
            'paywall.default.description',
            'قم بالترقية للنسخة الاحترافية للوصول إلى هذه الميزة.'
          ),
        };
    }
  };

  const { title, description } = getLimitMessage();

  // Pro features list
  const proFeatures = [
    t('paywall.features.unlimitedExams', '٥٠ امتحان شهرياً'),
    t('paywall.features.moreQuestions', '٥٠ سؤال لكل امتحان'),
    t('paywall.features.documentUpload', 'رفع المستندات (٢٠ شهرياً)'),
    t('paywall.features.advancedAnalytics', 'تحليلات متقدمة'),
    t('paywall.features.prioritySupport', 'دعم ذو أولوية'),
  ];

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
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
          width="90%"
          maxWidth={500}
          padding="$6"
        >
          <YStack space="$4">
            {/* Header with Icon */}
            <XStack
              space="$3"
              alignItems="center"
              flexDirection={isRTL ? 'row-reverse' : 'row'}
            >
              <YStack
                backgroundColor="$orange4"
                padding="$3"
                borderRadius="$10"
              >
                <AlertCircle size={24} color="$orange10" />
              </YStack>
              <H3 flex={1} textAlign={isRTL ? 'right' : 'left'}>
                {title}
              </H3>
            </XStack>

            {/* Description */}
            <Text
              fontSize="$4"
              color="$gray11"
              textAlign={isRTL ? 'right' : 'left'}
              lineHeight="$4"
            >
              {description}
            </Text>

            {/* Usage Stats (if available) */}
            {currentUsage && limitType === 'exam' && (
              <YStack space="$3" marginVertical="$2">
                <XStack
                  justifyContent="space-between"
                  flexDirection={isRTL ? 'row-reverse' : 'row'}
                >
                  <Text fontSize="$3" fontWeight="600">
                    {t('paywall.usageStats', 'استخدامك الحالي')}
                  </Text>
                  <Text fontSize="$3" color="$orange10" fontWeight="700">
                    {i18n.language === 'ar'
                      ? `${convertToArabicNumerals(currentUsage.examsUsed)}/${convertToArabicNumerals(currentUsage.examsLimit)}`
                      : `${currentUsage.examsUsed}/${currentUsage.examsLimit}`}
                  </Text>
                </XStack>

                <Progress
                  value={
                    (currentUsage.examsUsed / currentUsage.examsLimit) * 100
                  }
                  backgroundColor="$gray4"
                >
                  <Progress.Indicator
                    animation="bouncy"
                    backgroundColor="$orange10"
                  />
                </Progress>
              </YStack>
            )}

            <Separator />

            {/* Pro Features Header */}
            <XStack
              space="$2"
              alignItems="center"
              flexDirection={isRTL ? 'row-reverse' : 'row'}
            >
              <Sparkles size={20} color="$blue10" />
              <Text fontSize="$5" fontWeight="600">
                {t('paywall.proFeatures', 'مميزات النسخة الاحترافية')}
              </Text>
            </XStack>

            {/* Pro Features List */}
            <YStack space="$2">
              {proFeatures.map((feature, index) => (
                <XStack
                  key={index}
                  space="$2"
                  alignItems="center"
                  flexDirection={isRTL ? 'row-reverse' : 'row'}
                >
                  <Check size={16} color="$green10" />
                  <Text
                    flex={1}
                    fontSize="$3"
                    textAlign={isRTL ? 'right' : 'left'}
                  >
                    {feature}
                  </Text>
                </XStack>
              ))}
            </YStack>

            {/* Price */}
            <YStack
              backgroundColor="$blue2"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$blue6"
              alignItems="center"
            >
              <Text fontSize="$3" color="$gray11" marginBottom="$1">
                {t('paywall.justFor', 'فقط')}
              </Text>
              <XStack space="$2" alignItems="baseline">
                <Text fontSize="$9" fontWeight="700" color="$blue10">
                  {i18n.language === 'ar' ? '٣٧' : '37'}
                </Text>
                <Text fontSize="$5" color="$blue10">
                  {t('paywall.sarPerMonth', 'ريال/شهرياً')}
                </Text>
              </XStack>
            </YStack>

            {/* Action Buttons */}
            <YStack space="$3" marginTop="$2">
              <Button
                size="$5"
                theme="active"
                onPress={onUpgrade}
                disabled={loading}
                icon={loading ? undefined : Sparkles}
              >
                {loading
                  ? t('paywall.processing', 'جاري المعالجة...')
                  : t('paywall.upgradeNow', 'الترقية للنسخة الاحترافية')}
              </Button>

              <Button
                size="$4"
                variant="outlined"
                onPress={() => onOpenChange(false)}
                disabled={loading}
              >
                {t('paywall.maybeLater', 'ربما لاحقاً')}
              </Button>
            </YStack>

            {/* Platform-specific note */}
            {Platform.OS !== 'web' && (
              <Text
                fontSize="$2"
                color="$gray10"
                textAlign="center"
                marginTop="$2"
              >
                {t(
                  'paywall.mobileNote',
                  'سيتم فتح صفحة الدفع في المتصفح'
                )}
              </Text>
            )}
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

/**
 * Helper function to convert numbers to Arabic numerals
 */
function convertToArabicNumerals(num: number): string {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((digit) => arabicNumerals[parseInt(digit)] || digit)
    .join('');
}
