'use client';

/**
 * Checkout Page
 *
 * Handles web-based checkout for subscription upgrades
 * Supports Arabic with RTL layout
 * Used for both web and mobile (via deep link)
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  YStack,
  XStack,
  H2,
  H3,
  Text,
  Button,
  Card,
  Spinner,
  Separator,
} from '@anyexamai/ui';
import { useAuth, useCreateCheckoutSession } from '@anyexamai/api';
import { Check, Sparkles } from '@tamagui/lucide-icons';

export default function CheckoutPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { createCheckoutSession, loading: checkoutLoading } =
    useCreateCheckoutSession();

  const isRTL = i18n.language === 'ar';
  const [isMobile, setIsMobile] = useState(false);

  // Check if accessed from mobile app
  useEffect(() => {
    const source = searchParams.get('source');
    setIsMobile(source === 'mobile');
  }, [searchParams]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  const handleCheckout = async () => {
    const baseUrl = window.location.origin;
    const successUrl = isMobile
      ? 'anyexamai://subscription-success'
      : `${baseUrl}/payment-success`;
    const cancelUrl = isMobile
      ? 'anyexamai://pricing'
      : `${baseUrl}/pricing`;

    const session = await createCheckoutSession({
      tier: 'pro',
      currency: 'sar',
      successUrl,
      cancelUrl,
    });

    if (session) {
      // Redirect to Stripe Checkout
      window.location.href = session.url;
    }
  };

  if (authLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$6">
        <Spinner size="large" />
        <Text marginTop="$4">{t('loading', 'جاري التحميل...')}</Text>
      </YStack>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const proFeatures = [
    t('paywall.features.unlimitedExams', '٥٠ امتحان شهرياً'),
    t('paywall.features.moreQuestions', '٥٠ سؤال لكل امتحان'),
    t('paywall.features.documentUpload', 'رفع المستندات (٢٠ شهرياً)'),
    t('paywall.features.advancedAnalytics', 'تحليلات متقدمة'),
    t('paywall.features.prioritySupport', 'دعم ذو أولوية'),
  ];

  return (
    <YStack
      flex={1}
      padding="$6"
      alignItems="center"
      backgroundColor="$background"
      minHeight="100vh"
    >
      <YStack
        width="100%"
        maxWidth={600}
        space="$6"
        marginTop="$8"
        marginBottom="$8"
      >
        {/* Header */}
        <YStack space="$3" alignItems={isRTL ? 'flex-end' : 'flex-start'}>
          <XStack
            space="$2"
            alignItems="center"
            flexDirection={isRTL ? 'row-reverse' : 'row'}
          >
            <Sparkles size={28} color="$blue10" />
            <H2>{t('checkout.title', 'إتمام الاشتراك')}</H2>
          </XStack>
          <Text fontSize="$4" color="$gray11" textAlign={isRTL ? 'right' : 'left'}>
            {t(
              'checkout.subtitle',
              'قم بالترقية للنسخة الاحترافية للوصول إلى جميع الميزات'
            )}
          </Text>
        </YStack>

        {/* Plan Summary Card */}
        <Card elevate bordered padding="$6" backgroundColor="$blue2">
          <YStack space="$4">
            <XStack
              justifyContent="space-between"
              alignItems="center"
              flexDirection={isRTL ? 'row-reverse' : 'row'}
            >
              <YStack flex={1} alignItems={isRTL ? 'flex-end' : 'flex-start'}>
                <Text fontSize="$3" color="$gray11" marginBottom="$1">
                  {t('checkout.selectedPlan', 'الخطة المختارة')}
                </Text>
                <H3 color="$blue10">
                  {t('subscription.pro', 'احترافي')}
                </H3>
              </YStack>

              <YStack alignItems={isRTL ? 'flex-start' : 'flex-end'}>
                <XStack space="$2" alignItems="baseline">
                  <Text fontSize="$9" fontWeight="700" color="$blue10">
                    {i18n.language === 'ar' ? '٣٧' : '37'}
                  </Text>
                  <Text fontSize="$4" color="$blue10">
                    {t('paywall.sarPerMonth', 'ريال/شهرياً')}
                  </Text>
                </XStack>
              </YStack>
            </XStack>

            <Separator borderColor="$blue6" />

            {/* Features List */}
            <YStack space="$2">
              <Text
                fontSize="$3"
                fontWeight="600"
                marginBottom="$2"
                textAlign={isRTL ? 'right' : 'left'}
              >
                {t('checkout.included', 'المميزات المتضمنة')}
              </Text>
              {proFeatures.map((feature, index) => (
                <XStack
                  key={index}
                  space="$2"
                  alignItems="center"
                  flexDirection={isRTL ? 'row-reverse' : 'row'}
                >
                  <Check size={16} color="$green10" />
                  <Text fontSize="$3" textAlign={isRTL ? 'right' : 'left'}>
                    {feature}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </Card>

        {/* Payment Info */}
        <Card bordered padding="$5" backgroundColor="$gray2">
          <YStack space="$3">
            <Text
              fontSize="$3"
              fontWeight="600"
              textAlign={isRTL ? 'right' : 'left'}
            >
              {t('checkout.paymentInfo', 'معلومات الدفع')}
            </Text>
            <Text fontSize="$3" color="$gray11" textAlign={isRTL ? 'right' : 'left'}>
              {t(
                'checkout.securePayment',
                'الدفع آمن ومشفر عبر Stripe. نحن لا نقوم بتخزين معلومات بطاقتك الائتمانية.'
              )}
            </Text>
            <Text fontSize="$2" color="$gray10" textAlign={isRTL ? 'right' : 'left'}>
              {t(
                'checkout.cancellationPolicy',
                'يمكنك إلغاء الاشتراك في أي وقت من إعدادات الحساب.'
              )}
            </Text>
          </YStack>
        </Card>

        {/* Checkout Button */}
        <Button
          size="$6"
          theme="active"
          onPress={handleCheckout}
          disabled={checkoutLoading}
          icon={checkoutLoading ? undefined : Sparkles}
          marginTop="$4"
        >
          {checkoutLoading
            ? t('checkout.processing', 'جاري المعالجة...')
            : t('checkout.proceedToPayment', 'المتابعة إلى الدفع')}
        </Button>

        {/* Mobile Note */}
        {isMobile && (
          <Card
            bordered
            padding="$4"
            backgroundColor="$yellow2"
            borderColor="$yellow6"
          >
            <Text
              fontSize="$3"
              color="$gray12"
              textAlign={isRTL ? 'right' : 'left'}
            >
              {t(
                'checkout.mobileNote',
                'بعد إتمام الدفع، سيتم توجيهك تلقائياً إلى التطبيق.'
              )}
            </Text>
          </Card>
        )}

        {/* Back Link */}
        <Button
          variant="outlined"
          onPress={() => router.push('/pricing')}
          disabled={checkoutLoading}
        >
          {t('common.back', 'رجوع')}
        </Button>
      </YStack>
    </YStack>
  );
}
