'use client';

import { useTranslation } from 'react-i18next';
import { YStack, XStack, Heading, Paragraph, Button, Text, Card, CardHeader, CardTitle, CardContent, CardDescription } from '@anyexamai/ui';
import { MainLayout } from '../components/layout';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <MainLayout>
      <YStack
        flex={1}
        gap="$8"
        width="100%"
      >
        {/* Hero Section */}
        <YStack gap="$6" alignItems="center" textAlign="center" paddingTop="$12">
          <Heading
            fontFamily="$heading"
            fontSize={['$9', '$10', '$11']}
            fontWeight="800"
            lineHeight="$10"
            color="$color"
            textAlign="center"
          >
            إنشاء امتحانات ذكية
            <br />
            باستخدام الذكاء الاصطناعي
          </Heading>

          <Paragraph
            fontFamily="$body"
            fontSize={['$5', '$6', '$7']}
            color="$colorHover"
            maxWidth={700}
            textAlign="center"
            lineHeight="$7"
          >
            منصة متقدمة لإنشاء امتحانات مخصصة من مستنداتك أو من محتوى تعليمي منسق باللغة العربية
          </Paragraph>

          <XStack gap="$4" marginTop="$4">
            <Button
              backgroundColor="$primary"
              color="white"
              paddingHorizontal="$6"
              paddingVertical="$4"
              borderRadius="$4"
              onPress={handleGetStarted}
              hoverStyle={{ backgroundColor: '$primaryHover' }}
              pressStyle={{ backgroundColor: '$primaryHover', scale: 0.98 }}
            >
              <Text fontFamily="$heading" fontWeight="600" color="white" fontSize="$5">
                ابدأ الآن مجاناً
              </Text>
            </Button>
            <Button
              backgroundColor="transparent"
              borderWidth={1}
              borderColor="$borderColor"
              paddingHorizontal="$6"
              paddingVertical="$4"
              borderRadius="$4"
              onPress={handleLogin}
              hoverStyle={{ backgroundColor: '$backgroundHover' }}
              pressStyle={{ backgroundColor: '$backgroundHover', scale: 0.98 }}
            >
              <Text fontFamily="$heading" fontWeight="600" color="$color" fontSize="$5">
                تسجيل الدخول
              </Text>
            </Button>
          </XStack>
        </YStack>

        {/* Features Section */}
        <YStack gap="$6" marginTop="$12">
          <Heading
            fontFamily="$heading"
            fontSize={['$7', '$8', '$9']}
            fontWeight="700"
            textAlign="center"
            color="$color"
          >
            لماذا anyExamAi؟
          </Heading>

          <XStack
            gap="$6"
            flexDirection={['column', 'column', 'row']}
            marginTop="$6"
          >
            <Card flex={1}>
              <CardHeader>
                <CardTitle>سريع وذكي</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  إنشاء امتحانات كاملة في أقل من 30 ثانية باستخدام أحدث تقنيات الذكاء الاصطناعي
                </CardDescription>
              </CardContent>
            </Card>

            <Card flex={1}>
              <CardHeader>
                <CardTitle>محتوى عربي</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  مكتبة ضخمة من المحتوى التعليمي المنسق باللغة العربية في مختلف المواد
                </CardDescription>
              </CardContent>
            </Card>

            <Card flex={1}>
              <CardHeader>
                <CardTitle>مستنداتك الخاصة</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  ارفع ملفات PDF أو DOCX الخاصة بك واحصل على امتحانات مخصصة من محتواك
                </CardDescription>
              </CardContent>
            </Card>
          </XStack>
        </YStack>

        {/* CTA Section */}
        <YStack
          gap="$6"
          alignItems="center"
          textAlign="center"
          marginTop="$12"
          paddingVertical="$12"
          backgroundColor="$backgroundHover"
          borderRadius="$6"
          paddingHorizontal="$6"
        >
          <Heading
            fontFamily="$heading"
            fontSize={['$7', '$8', '$9']}
            fontWeight="700"
            color="$color"
          >
            جاهز للبدء؟
          </Heading>

          <Paragraph
            fontFamily="$body"
            fontSize={['$4', '$5', '$6']}
            color="$colorHover"
            maxWidth={600}
          >
            ابدأ بإنشاء امتحاناتك الذكية اليوم. 5 امتحانات مجانية شهرياً، بدون بطاقة ائتمان.
          </Paragraph>

          <Button
            backgroundColor="$primary"
            color="white"
            paddingHorizontal="$6"
            paddingVertical="$4"
            borderRadius="$4"
            onPress={handleGetStarted}
            hoverStyle={{ backgroundColor: '$primaryHover' }}
            pressStyle={{ backgroundColor: '$primaryHover', scale: 0.98 }}
          >
            <Text fontFamily="$heading" fontWeight="600" color="white" fontSize="$5">
              إنشاء حساب مجاني
            </Text>
          </Button>
        </YStack>
      </YStack>
    </MainLayout>
  );
}
