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
  signUp,
  signInWithGoogle,
  signInWithApple,
  signupSchema,
  type SignupFormData,
} from '@anyexamai/api';
import { useRouter } from '@anyexamai/navigation';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function SignupScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof SignupFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = signupSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof SignupFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { user, error } = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        preferredLanguage: 'ar', // Default to Arabic
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered')) {
          Alert.alert(t('error'), t('auth.errors.emailInUse'));
        } else if (error.message.includes('Password should be')) {
          Alert.alert(t('error'), t('auth.errors.weakPassword'));
        } else {
          Alert.alert(t('error'), t('auth.errors.signupFailed'));
        }
        return;
      }

      if (user) {
        // Navigate to home or verification screen
        router.replace('/');
      }
    } catch (error) {
      Alert.alert(t('error'), t('auth.errors.signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle({ platform: 'mobile' });
      if (error) {
        Alert.alert(t('error'), error.message);
      }
    } catch (error) {
      Alert.alert(t('error'), t('auth.errors.signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignup = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithApple({ platform: 'mobile' });
      if (error) {
        Alert.alert(t('error'), error.message);
      }
    } catch (error) {
      Alert.alert(t('error'), t('auth.errors.signupFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

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
              {t('auth.createAccount')}
            </Heading>
            <Paragraph
              fontFamily="$body"
              fontSize="$4"
              textAlign="center"
              color="$colorHover"
            >
              {t('app_name')}
            </Paragraph>
          </YStack>

          {/* Form */}
          <YStack gap="$4">
            <Input
              label={t('auth.fullName')}
              placeholder={t('auth.fullName')}
              value={formData.fullName}
              onChangeText={handleChange('fullName')}
              error={!!errors.fullName}
              errorMessage={errors.fullName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!loading}
              fullWidth
            />

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

            <Input
              label={t('auth.password')}
              placeholder={t('auth.password')}
              value={formData.password}
              onChangeText={handleChange('password')}
              error={!!errors.password}
              errorMessage={errors.password}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              fullWidth
            />

            <Input
              label={t('auth.confirmPassword')}
              placeholder={t('auth.confirmPassword')}
              value={formData.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              fullWidth
            />

            {/* Terms and Conditions */}
            <Paragraph
              fontSize="$2"
              textAlign="center"
              color="$colorHover"
              lineHeight="$3"
            >
              {t('auth.agreeToTerms')}{' '}
              <Text color="$primary" textDecorationLine="underline">
                {t('auth.termsAndConditions')}
              </Text>{' '}
              {t('auth.and')}{' '}
              <Text color="$primary" textDecorationLine="underline">
                {t('auth.privacyPolicy')}
              </Text>
            </Paragraph>

            {/* Signup Button */}
            <Button
              variant="primary"
              size="lg"
              onPress={handleSignup}
              disabled={loading}
              fullWidth
            >
              {loading ? t('loading') : t('auth.signup')}
            </Button>
          </YStack>

          {/* Divider */}
          <XStack gap="$3" alignItems="center">
            <YStack flex={1} height={1} backgroundColor="$borderColor" />
            <Text fontSize="$3" color="$colorHover">
              {t('auth.orContinueWith')}
            </Text>
            <YStack flex={1} height={1} backgroundColor="$borderColor" />
          </XStack>

          {/* OAuth Buttons */}
          <YStack gap="$3">
            <Button
              variant="outline"
              size="lg"
              onPress={handleGoogleSignup}
              disabled={loading}
              fullWidth
            >
              {t('auth.loginWithGoogle')}
            </Button>

            {Platform.OS === 'ios' && (
              <Button
                variant="outline"
                size="lg"
                onPress={handleAppleSignup}
                disabled={loading}
                fullWidth
              >
                {t('auth.loginWithApple')}
              </Button>
            )}
          </YStack>

          {/* Login Link */}
          <XStack justifyContent="center" gap="$2">
            <Text fontSize="$4" color="$colorHover">
              {t('auth.haveAccount')}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleLogin}
              disabled={loading}
            >
              <Text fontSize="$4" color="$primary" fontWeight="600">
                {t('auth.login')}
              </Text>
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
