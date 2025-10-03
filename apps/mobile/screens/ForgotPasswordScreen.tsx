import React, { useState } from 'react';
import { useTranslation } from '@anyexamai/i18n';
import {
  YStack,
  XStack,
  Heading,
  Paragraph,
  Input,
  ButtonComponent as Button,
  TextComponent as Text,
} from '@anyexamai/ui';
import {
  resetPassword,
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@anyexamai/api';
import { useRouter } from '@anyexamai/navigation';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (field: keyof ForgotPasswordFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = forgotPasswordSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ForgotPasswordFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof ForgotPasswordFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await resetPassword(formData.email);

      if (error) {
        Alert.alert(t('error'), t('auth.errors.resetFailed'));
        return;
      }

      // Show success message
      setEmailSent(true);
    } catch (error) {
      Alert.alert(t('error'), t('auth.errors.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  if (emailSent) {
    return (
      <YStack
        flex={1}
        backgroundColor="$background"
        padding="$6"
        justifyContent="center"
        gap="$6"
        maxWidth={400}
        width="100%"
        alignSelf="center"
      >
        {/* Success Message */}
        <YStack gap="$4" alignItems="center">
          <YStack
            width={80}
            height={80}
            borderRadius="$round"
            backgroundColor="$success"
            opacity={0.2}
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={40}>✓</Text>
          </YStack>

          <Heading
            fontFamily="$heading"
            fontSize="$8"
            fontWeight="700"
            textAlign="center"
            color="$color"
          >
            {t('success')}
          </Heading>

          <Paragraph
            fontFamily="$body"
            fontSize="$4"
            textAlign="center"
            color="$colorHover"
            lineHeight="$5"
          >
            {t('auth.resetPasswordSuccess')}
          </Paragraph>
        </YStack>

        {/* Back to Login Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={handleBackToLogin}
          fullWidth
        >
          {t('auth.backToLogin')}
        </Button>
      </YStack>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <YStack
          flex={1}
          backgroundColor="$background"
          padding="$6"
          justifyContent="center"
          gap="$6"
          maxWidth={400}
          width="100%"
          alignSelf="center"
        >
          {/* Header */}
          <YStack gap="$3" alignItems="center">
            <Heading
              fontFamily="$heading"
              fontSize="$9"
              fontWeight="700"
              textAlign="center"
              color="$color"
            >
              {t('auth.resetPassword')}
            </Heading>
            <Paragraph
              fontFamily="$body"
              fontSize="$4"
              textAlign="center"
              color="$colorHover"
              lineHeight="$5"
            >
              {t('auth.forgotPassword')}
            </Paragraph>
          </YStack>

          {/* Form */}
          <YStack gap="$4">
            <Input
              label={t('auth.email')}
              placeholder={t('auth.email')}
              value={formData.email}
              onChangeText={handleChange('email')}
              error={!!errors.email}
              errorMessage={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              fullWidth
            />

            {/* Reset Password Button */}
            <Button
              variant="primary"
              size="lg"
              onPress={handleResetPassword}
              disabled={loading}
              fullWidth
            >
              {loading ? t('loading') : t('auth.sendResetLink')}
            </Button>
          </YStack>

          {/* Back to Login Link */}
          <XStack justifyContent="center" gap="$2">
            <Button
              variant="ghost"
              size="sm"
              onPress={handleBackToLogin}
              disabled={loading}
            >
              <XStack gap="$2" alignItems="center">
                <Text fontSize="$5" color="$primary">
                  ←
                </Text>
                <Text fontSize="$4" color="$primary" fontWeight="600">
                  {t('auth.backToLogin')}
                </Text>
              </XStack>
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
