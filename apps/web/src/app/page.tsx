'use client';

import { useTranslation } from 'react-i18next';
import { YStack, XStack, Heading, Paragraph, Button, Text, useTheme } from '@anyexamai/ui';

export default function Home() {
  const { t, i18n } = useTranslation('common');
  const theme = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <YStack
      minHeight="100vh"
      padding="$8"
      alignItems="center"
      justifyContent="center"
      gap="$8"
      backgroundColor="$background"
    >
      {/* Main heading with Cairo font */}
      <Heading
        fontFamily="$heading"
        fontSize="$10"
        fontWeight="700"
        textAlign="center"
        color="$color"
      >
        {t('welcome')}
      </Heading>

      {/* Description with Tajawal font */}
      <Paragraph
        fontFamily="$body"
        fontSize="$6"
        maxWidth={600}
        textAlign="center"
        color="$colorHover"
        lineHeight="$6"
      >
        {t('description')}
      </Paragraph>

      <YStack gap="$4" alignItems="center">
        {/* Language toggle button */}
        <Button
          backgroundColor="$primary"
          color="white"
          paddingHorizontal="$6"
          paddingVertical="$4"
          borderRadius="$4"
          onPress={toggleLanguage}
          hoverStyle={{ backgroundColor: '$primaryHover' }}
          pressStyle={{ backgroundColor: '$primaryHover', scale: 0.98 }}
        >
          <Text fontFamily="$heading" fontWeight="600" color="white" fontSize="$5">
            {i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          </Text>
        </Button>

        {/* RTL Test section */}
        <YStack
          marginTop="$8"
          padding="$6"
          backgroundColor="$backgroundHover"
          borderRadius="$4"
          maxWidth={600}
          gap="$4"
        >
          <Heading fontFamily="$heading" fontSize="$7" fontWeight="600" color="$color">
            RTL Test / اختبار RTL
          </Heading>
          <YStack gap="$2" paddingStart="$8">
            <Text fontFamily="$body" fontSize="$4" color="$color" lineHeight="$4">
              • هذا نص عربي لاختبار التخطيط من اليمين إلى اليسار
            </Text>
            <Text fontFamily="$body" fontSize="$4" color="$color" lineHeight="$4">
              • This is English text to test left-to-right layout
            </Text>
            <Text fontFamily="$body" fontSize="$4" color="$color" lineHeight="$4">
              • الأرقام: ١٢٣٤٥٦٧٨٩٠
            </Text>
            <Text fontFamily="$body" fontSize="$4" color="$color" lineHeight="$4">
              • Numbers: 1234567890
            </Text>
          </YStack>
        </YStack>

        {/* Status section */}
        <YStack
          marginTop="$4"
          padding="$4"
          backgroundColor="$backgroundHover"
          borderRadius="$4"
          alignItems="center"
          gap="$2"
        >
          <Text fontSize="$3" color="$color">
            Current Language: <Text fontWeight="700">{i18n.language}</Text> | Direction:{' '}
            <Text fontWeight="700">{i18n.language === 'ar' ? 'RTL' : 'LTR'}</Text>
          </Text>
          <Text fontSize="$3" color="$success">
            Tamagui Configured ✓
          </Text>
          <Text fontSize="$3" color="$success">
            Solito Navigation Connected ✓
          </Text>
        </YStack>
      </YStack>
    </YStack>
  );
}
