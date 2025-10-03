'use client';

/**
 * Payment Success Page
 *
 * Displayed after successful payment completion
 * Shows success message and provides deep link back to mobile app
 * Supports Arabic with RTL layout
 */

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  YStack,
  XStack,
  H2,
  Text,
  Button,
  Card,
} from '@anyexamai/ui';
import { CheckCircle, Sparkles, Home } from '@tamagui/lucide-icons';

export default function PaymentSuccessPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRTL = i18n.language === 'ar';

  const [countdown, setCountdown] = useState(10);
  const [isMobile, setIsMobile] = useState(false);

  // Check if accessed from mobile app
  useEffect(() => {
    const source = searchParams.get('source');
    setIsMobile(source === 'mobile');
  }, [searchParams]);

  // Countdown for auto-redirect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-redirect after countdown
      if (isMobile) {
        window.location.href = 'anyexamai://subscription-success';
      } else {
        router.push('/');
      }
    }
  }, [countdown, isMobile, router]);

  const handleContinue = () => {
    if (isMobile) {
      window.location.href = 'anyexamai://subscription-success';
    } else {
      router.push('/');
    }
  };

  return (
    <YStack
      flex={1}
      padding="$6"
      alignItems="center"
      justifyContent="center"
      backgroundColor="$background"
      minHeight="100vh"
    >
      <YStack
        width="100%"
        maxWidth={600}
        space="$6"
        alignItems="center"
      >
        {/* Success Icon */}
        <YStack
          backgroundColor="$green4"
          padding="$6"
          borderRadius="$12"
          alignItems="center"
          justifyContent="center"
        >
          <CheckCircle size={80} color="$green10" />
        </YStack>

        {/* Success Message */}
        <YStack space="$3" alignItems="center">
          <H2 textAlign="center" color="$green10">
            {t('paymentSuccess.title', 'تم الاشتراك بنجاح! 🎉')}
          </H2>
          <Text
            fontSize="$5"
            color="$gray11"
            textAlign="center"
            maxWidth={400}
          >
            {t(
              'paymentSuccess.subtitle',
              'شكراً لاشتراكك في النسخة الاحترافية. يمكنك الآن الاستمتاع بجميع الميزات المتقدمة.'
            )}
          </Text>
        </YStack>

        {/* Pro Features Unlocked */}
        <Card elevate bordered padding="$6" width="100%" backgroundColor="$blue2">
          <YStack space="$4">
            <XStack
              space="$3"
              alignItems="center"
              justifyContent="center"
              flexDirection={isRTL ? 'row-reverse' : 'row'}
            >
              <Sparkles size={24} color="$blue10" />
              <Text fontSize="$5" fontWeight="600" color="$blue10">
                {t('paymentSuccess.unlockedFeatures', 'الميزات المفعلة')}
              </Text>
            </XStack>

            <YStack space="$2">
              {[
                t('paymentSuccess.feature1', '٥٠ امتحان شهرياً'),
                t('paymentSuccess.feature2', '٥٠ سؤال لكل امتحان'),
                t('paymentSuccess.feature3', 'رفع المستندات (٢٠ شهرياً)'),
                t('paymentSuccess.feature4', 'تحليلات متقدمة'),
                t('paymentSuccess.feature5', 'دعم ذو أولوية'),
              ].map((feature, index) => (
                <XStack
                  key={index}
                  space="$2"
                  alignItems="center"
                  flexDirection={isRTL ? 'row-reverse' : 'row'}
                >
                  <CheckCircle size={16} color="$green10" />
                  <Text fontSize="$4" textAlign={isRTL ? 'right' : 'left'}>
                    {feature}
                  </Text>
                </XStack>
              ))}
            </YStack>
          </YStack>
        </Card>

        {/* Receipt Info */}
        <Card bordered padding="$5" width="100%" backgroundColor="$gray2">
          <Text
            fontSize="$3"
            color="$gray11"
            textAlign={isRTL ? 'right' : 'left'}
          >
            {t(
              'paymentSuccess.receiptInfo',
              'سيتم إرسال إيصال الدفع إلى بريدك الإلكتروني قريباً.'
            )}
          </Text>
        </Card>

        {/* Continue Button */}
        <YStack space="$3" width="100%">
          <Button
            size="$6"
            theme="active"
            onPress={handleContinue}
            icon={isMobile ? undefined : Home}
          >
            {isMobile
              ? t('paymentSuccess.returnToApp', 'العودة إلى التطبيق')
              : t('paymentSuccess.goToHome', 'الذهاب إلى الصفحة الرئيسية')}
          </Button>

          {/* Auto-redirect countdown */}
          <Text fontSize="$3" color="$gray10" textAlign="center">
            {t('paymentSuccess.autoRedirect', 'إعادة التوجيه التلقائي في')}{' '}
            {i18n.language === 'ar'
              ? convertToArabicNumerals(countdown)
              : countdown}{' '}
            {t('paymentSuccess.seconds', 'ثواني')}
          </Text>
        </YStack>

        {/* Mobile Deep Link Note */}
        {isMobile && (
          <Card
            bordered
            padding="$4"
            width="100%"
            backgroundColor="$yellow2"
            borderColor="$yellow6"
          >
            <Text
              fontSize="$3"
              color="$gray12"
              textAlign={isRTL ? 'right' : 'left'}
            >
              {t(
                'paymentSuccess.mobileNote',
                'إذا لم يتم فتح التطبيق تلقائياً، انقر على الزر أعلاه.'
              )}
            </Text>
          </Card>
        )}
      </YStack>
    </YStack>
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
