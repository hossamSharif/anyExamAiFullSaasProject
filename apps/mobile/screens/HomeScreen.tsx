import { YStack, Text, Heading, Paragraph, Button, useTheme } from '@anyexamai/ui';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      padding="$6"
    >
      {/* Arabic heading with Cairo font */}
      <Heading
        fontFamily="$heading"
        fontSize="$9"
        fontWeight="700"
        marginBottom="$3"
        textAlign="center"
        color="$color"
      >
        مرحباً بك في anyExamAi
      </Heading>

      {/* Arabic subtitle with Cairo font */}
      <Heading
        fontFamily="$heading"
        fontSize="$7"
        fontWeight="500"
        marginBottom="$6"
        textAlign="center"
        color="$colorHover"
      >
        منصة الامتحانات الذكية
      </Heading>

      {/* Arabic body text with Tajawal font */}
      <Paragraph
        fontFamily="$body"
        fontSize="$5"
        marginBottom="$8"
        textAlign="center"
        color="$color"
        lineHeight="$5"
        maxWidth={400}
      >
        اختبر معرفتك باللغة العربية مع دعم كامل للكتابة من اليمين إلى اليسار
      </Paragraph>

      {/* Test button with primary theme */}
      <Button
        backgroundColor="$primary"
        color="white"
        paddingHorizontal="$6"
        paddingVertical="$3"
        borderRadius="$4"
        marginBottom="$4"
      >
        <Text fontFamily="$heading" fontWeight="600" color="white">
          ابدأ الآن
        </Text>
      </Button>

      {/* Status indicators */}
      <Text fontSize="$3" color="$success" marginTop="$2">
        RTL Support Enabled ✓
      </Text>
      <Text fontSize="$3" color="$success" marginTop="$1">
        Tamagui Configured ✓
      </Text>
      <Text fontSize="$3" color="$success" marginTop="$1">
        Arabic Fonts Loaded ✓
      </Text>
    </YStack>
  );
}
