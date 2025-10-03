/**
 * Pricing Card Component
 *
 * Displays subscription tier details in Arabic with RTL layout
 * Supports Free and Pro tiers with feature lists
 */

import React from 'react';
import { Card, YStack, XStack, Text, Button, H3, Separator } from '@anyexamai/ui';
import { useTranslation } from 'react-i18next';
import { Check } from '@tamagui/lucide-icons';

export interface PricingCardProps {
  tier: 'free' | 'pro';
  price: string;
  currency: string;
  features: string[];
  isCurrentPlan?: boolean;
  onSelectPlan?: () => void;
  loading?: boolean;
}

export function PricingCard({
  tier,
  price,
  currency,
  features,
  isCurrentPlan = false,
  onSelectPlan,
  loading = false,
}: PricingCardProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isPro = tier === 'pro';

  return (
    <Card
      elevate
      bordered
      padding="$6"
      borderWidth={isPro ? 2 : 1}
      borderColor={isPro ? '$blue10' : '$gray6'}
      backgroundColor={isPro ? '$blue2' : '$background'}
      width="100%"
      maxWidth={400}
    >
      <YStack space="$4">
        {/* Header */}
        <YStack space="$2" alignItems={isRTL ? 'flex-end' : 'flex-start'}>
          <XStack space="$2" alignItems="center">
            <H3
              color={isPro ? '$blue10' : '$color'}
              textAlign={isRTL ? 'right' : 'left'}
            >
              {tier === 'free' ? t('subscription.free', 'مجاني') : t('subscription.pro', 'احترافي')}
            </H3>
            {isCurrentPlan && (
              <Card
                backgroundColor="$green10"
                paddingHorizontal="$3"
                paddingVertical="$1"
                borderRadius="$10"
              >
                <Text fontSize="$2" color="white" fontWeight="600">
                  {t('subscription.currentPlan', 'الخطة الحالية')}
                </Text>
              </Card>
            )}
          </XStack>

          {/* Price */}
          <XStack space="$2" alignItems="baseline">
            <Text
              fontSize="$10"
              fontWeight="700"
              color={isPro ? '$blue10' : '$color'}
            >
              {price}
            </Text>
            <Text fontSize="$4" color="$gray10">
              {currency === 'sar' ? 'ريال' : 'USD'}
              /
              {t('subscription.monthly', 'شهرياً')}
            </Text>
          </XStack>
        </YStack>

        <Separator />

        {/* Features */}
        <YStack space="$3">
          {features.map((feature, index) => (
            <XStack
              key={index}
              space="$3"
              alignItems="flex-start"
              flexDirection={isRTL ? 'row-reverse' : 'row'}
            >
              <Check
                size={20}
                color={isPro ? '$blue10' : '$green10'}
                style={{ marginTop: 2 }}
              />
              <Text
                flex={1}
                fontSize="$4"
                color="$color"
                textAlign={isRTL ? 'right' : 'left'}
              >
                {feature}
              </Text>
            </XStack>
          ))}
        </YStack>

        {/* Action Button */}
        <Button
          size="$5"
          theme={isPro ? 'active' : 'alt2'}
          disabled={isCurrentPlan || loading}
          onPress={onSelectPlan}
          marginTop="$2"
        >
          {isCurrentPlan
            ? t('subscription.current', 'الخطة الحالية')
            : tier === 'pro'
              ? t('subscription.upgrade', 'ترقية للنسخة الاحترافية')
              : t('subscription.selectPlan', 'اختر الخطة')}
        </Button>
      </YStack>
    </Card>
  );
}
