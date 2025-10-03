'use client';

import { YStack, XStack, Text, TextComponent } from '@anyexamai/ui';
import { useTranslation } from '@anyexamai/i18n';
import Link from 'next/link';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <YStack
      borderTopWidth={1}
      borderTopColor="$borderColor"
      backgroundColor="$background"
      paddingVertical="$8"
      marginTop="auto"
    >
      <XStack
        maxWidth={1200}
        width="100%"
        marginHorizontal="auto"
        paddingHorizontal="$6"
        flexDirection={['column', 'column', 'row']}
        gap="$6"
        alignItems={['center', 'center', 'flex-start']}
        justifyContent="space-between"
      >
        {/* Brand Section */}
        <YStack gap="$3" alignItems={['center', 'center', 'flex-start']} flex={1}>
          <Text
            fontFamily="$heading"
            fontSize="$6"
            fontWeight="700"
            color="$primary"
          >
            {t('app_name')}
          </Text>
          <TextComponent
            fontSize="$3"
            color="$colorHover"
            textAlign={['center', 'center', 'right']}
          >
            منصة ذكية لإنشاء الامتحانات
          </TextComponent>
        </YStack>

        {/* Links Section */}
        <XStack
          gap="$8"
          flexDirection={['column', 'row', 'row']}
          alignItems={['center', 'flex-start', 'flex-start']}
        >
          {/* Navigation Links */}
          <YStack gap="$3" alignItems={['center', 'flex-start', 'flex-start']}>
            <TextComponent
              fontSize="$4"
              fontWeight="600"
              color="$color"
              marginBottom="$2"
            >
              روابط سريعة
            </TextComponent>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <TextComponent
                fontSize="$3"
                color="$colorHover"
                cursor="pointer"
                hoverStyle={{ color: '$primary' }}
              >
                {t('navigation.home')}
              </TextComponent>
            </Link>
            <Link href="/browse" style={{ textDecoration: 'none' }}>
              <TextComponent
                fontSize="$3"
                color="$colorHover"
                cursor="pointer"
                hoverStyle={{ color: '$primary' }}
              >
                {t('navigation.browse')}
              </TextComponent>
            </Link>
            <Link href="/history" style={{ textDecoration: 'none' }}>
              <TextComponent
                fontSize="$3"
                color="$colorHover"
                cursor="pointer"
                hoverStyle={{ color: '$primary' }}
              >
                {t('navigation.history')}
              </TextComponent>
            </Link>
          </YStack>

          {/* Legal Links */}
          <YStack gap="$3" alignItems={['center', 'flex-start', 'flex-start']}>
            <TextComponent
              fontSize="$4"
              fontWeight="600"
              color="$color"
              marginBottom="$2"
            >
              قانوني
            </TextComponent>
            <Link href="/privacy" style={{ textDecoration: 'none' }}>
              <TextComponent
                fontSize="$3"
                color="$colorHover"
                cursor="pointer"
                hoverStyle={{ color: '$primary' }}
              >
                {t('auth.privacyPolicy')}
              </TextComponent>
            </Link>
            <Link href="/terms" style={{ textDecoration: 'none' }}>
              <TextComponent
                fontSize="$3"
                color="$colorHover"
                cursor="pointer"
                hoverStyle={{ color: '$primary' }}
              >
                {t('auth.termsAndConditions')}
              </TextComponent>
            </Link>
          </YStack>
        </XStack>
      </XStack>

      {/* Copyright */}
      <YStack
        maxWidth={1200}
        width="100%"
        marginHorizontal="auto"
        paddingHorizontal="$6"
        marginTop="$6"
        paddingTop="$6"
        borderTopWidth={1}
        borderTopColor="$borderColor"
      >
        <TextComponent
          fontSize="$2"
          color="$colorHover"
          textAlign="center"
        >
          © {currentYear} {t('app_name')}. جميع الحقوق محفوظة.
        </TextComponent>
      </YStack>
    </YStack>
  );
}
