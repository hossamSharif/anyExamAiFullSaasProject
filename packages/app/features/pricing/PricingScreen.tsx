/**
 * Pricing Screen
 *
 * Displays subscription tiers with feature comparison in Arabic
 * Supports Free and Pro tiers with RTL layout
 */

import React, { useState } from 'react';
import { YStack, XStack, H2, Text, ScrollView, Spinner } from '@anyexamai/ui';
import { useTranslation } from 'react-i18next';
import { PricingCard } from '../../components/PricingCard';
import {
  useSubscription,
  useCreateCheckoutSession,
} from '@anyexamai/api';
import { STRIPE_CONFIG, getTierFeatures, getDisplayPrice } from '@anyexamai/config';
import { Platform } from 'react-native';

export function PricingScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const language = i18n.language as 'ar' | 'en';

  const { subscription, loading: subscriptionLoading } = useSubscription();
  const { createCheckoutSession, loading: checkoutLoading } =
    useCreateCheckoutSession();

  const currentTier = subscription?.tier || 'free';

  const handleUpgradeToPro = async () => {
    // Determine success and cancel URLs based on platform
    const baseUrl =
      Platform.OS === 'web'
        ? window.location.origin
        : 'anyexamai://'; // Deep link for mobile

    const successUrl =
      Platform.OS === 'web'
        ? `${baseUrl}/payment-success`
        : `${baseUrl}subscription-success`;

    const cancelUrl =
      Platform.OS === 'web'
        ? `${baseUrl}/pricing`
        : `${baseUrl}pricing`;

    // Create checkout session
    const session = await createCheckoutSession({
      tier: 'pro',
      currency: 'sar', // Default to SAR for Middle East market
      successUrl,
      cancelUrl,
    });

    if (session) {
      // Redirect to Stripe Checkout
      if (Platform.OS === 'web') {
        window.location.href = session.url;
      } else {
        // Open in-app browser on mobile
        const { openBrowserAsync } = await import('expo-web-browser');
        await openBrowserAsync(session.url);
      }
    }
  };

  if (subscriptionLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <ScrollView>
      <YStack
        flex={1}
        padding="$6"
        space="$6"
        alignItems="center"
        backgroundColor="$background"
      >
        {/* Header */}
        <YStack space="$3" alignItems="center" maxWidth={600}>
          <H2 textAlign="center">
            {t('pricing.title', 'اختر الخطة المناسبة لك')}
          </H2>
          <Text
            fontSize="$5"
            color="$gray11"
            textAlign="center"
            maxWidth={500}
          >
            {t(
              'pricing.subtitle',
              'ابدأ مجاناً أو احصل على المزيد من الميزات مع النسخة الاحترافية'
            )}
          </Text>
        </YStack>

        {/* Pricing Cards */}
        <XStack
          space="$4"
          flexWrap="wrap"
          justifyContent="center"
          width="100%"
          maxWidth={900}
          flexDirection={isRTL ? 'row-reverse' : 'row'}
          $sm={{
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Free Tier */}
          <PricingCard
            tier="free"
            price="0"
            currency="sar"
            features={getTierFeatures('free', language)}
            isCurrentPlan={currentTier === 'free'}
          />

          {/* Pro Tier */}
          <PricingCard
            tier="pro"
            price={language === 'ar' ? '٣٧' : '37'}
            currency="sar"
            features={getTierFeatures('pro', language)}
            isCurrentPlan={currentTier === 'pro'}
            onSelectPlan={handleUpgradeToPro}
            loading={checkoutLoading}
          />
        </XStack>

        {/* Feature Comparison Table (Optional) */}
        <YStack space="$4" width="100%" maxWidth={800} marginTop="$8">
          <H2 textAlign={isRTL ? 'right' : 'left'}>
            {t('pricing.comparison', 'مقارنة الميزات')}
          </H2>

          {/* Comparison Table */}
          <YStack
            space="$2"
            backgroundColor="$background"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$gray6"
            padding="$4"
          >
            {/* Header Row */}
            <XStack
              space="$4"
              paddingVertical="$3"
              borderBottomWidth={1}
              borderColor="$gray6"
              flexDirection={isRTL ? 'row-reverse' : 'row'}
            >
              <Text flex={2} fontWeight="600" textAlign={isRTL ? 'right' : 'left'}>
                {t('pricing.feature', 'الميزة')}
              </Text>
              <Text flex={1} fontWeight="600" textAlign="center">
                {t('subscription.free', 'مجاني')}
              </Text>
              <Text flex={1} fontWeight="600" textAlign="center">
                {t('subscription.pro', 'احترافي')}
              </Text>
            </XStack>

            {/* Feature Rows */}
            <FeatureRow
              feature={t('pricing.features.examsPerMonth', 'امتحانات شهرياً')}
              freeValue="5"
              proValue="50"
              isRTL={isRTL}
            />
            <FeatureRow
              feature={t('pricing.features.questionsPerExam', 'أسئلة لكل امتحان')}
              freeValue="10"
              proValue="50"
              isRTL={isRTL}
            />
            <FeatureRow
              feature={t('pricing.features.documentUpload', 'رفع المستندات')}
              freeValue="✗"
              proValue="20/شهر"
              isRTL={isRTL}
            />
            <FeatureRow
              feature={t('pricing.features.advancedAnalytics', 'تحليلات متقدمة')}
              freeValue="✗"
              proValue="✓"
              isRTL={isRTL}
            />
            <FeatureRow
              feature={t('pricing.features.prioritySupport', 'دعم ذو أولوية')}
              freeValue="✗"
              proValue="✓"
              isRTL={isRTL}
            />
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}

interface FeatureRowProps {
  feature: string;
  freeValue: string;
  proValue: string;
  isRTL: boolean;
}

function FeatureRow({ feature, freeValue, proValue, isRTL }: FeatureRowProps) {
  return (
    <XStack
      space="$4"
      paddingVertical="$3"
      borderBottomWidth={1}
      borderColor="$gray4"
      flexDirection={isRTL ? 'row-reverse' : 'row'}
    >
      <Text flex={2} textAlign={isRTL ? 'right' : 'left'}>
        {feature}
      </Text>
      <Text flex={1} textAlign="center" color="$gray11">
        {freeValue}
      </Text>
      <Text flex={1} textAlign="center" color="$blue10" fontWeight="600">
        {proValue}
      </Text>
    </XStack>
  );
}
