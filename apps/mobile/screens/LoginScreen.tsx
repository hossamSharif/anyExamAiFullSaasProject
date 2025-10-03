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
  signIn,
  signInWithGoogle,
  signInWithApple,
  loginSchema,
  type LoginFormData,
} from '@anyexamai/api';
import { useRouter } from '@anyexamai/navigation';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof LoginFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof LoginFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { user, error } = await signIn(formData);

      if (error) {
        Alert.alert(t('error'), t('auth.errors.loginFailed'));
        return;
      }

      if (user) {
        // Navigate to home or appropriate screen
        router.replace('/');
      }
    } catch (error) {
      Alert.alert(t('error'), t('auth.errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle({ platform: 'mobile' });
      if (error) {
        Alert.alert(t('error'), error.message);
      }
    } catch (error) {
      Alert.alert(t('error'), t('auth.errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithApple({ platform: 'mobile' });
      if (error) {
        Alert.alert(t('error'), error.message);
      }
    } catch (error) {
      Alert.alert(t('error'), t('auth.errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/signup');
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
              {t('auth.welcomeBack')}
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

            {/* Forgot Password Link */}
            <XStack justifyContent="flex-end">
              <Button
                variant="ghost"
                size="sm"
                onPress={handleForgotPassword}
                disabled={loading}
              >
                <Text fontSize="$3" color="$primary">
                  {t('auth.forgotPassword')}
                </Text>
              </Button>
            </XStack>

            {/* Login Button */}
            <Button
              variant="primary"
              size="lg"
              onPress={handleLogin}
              disabled={loading}
              fullWidth
            >
              {loading ? t('loading') : t('auth.login')}
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
              onPress={handleGoogleLogin}
              disabled={loading}
              fullWidth
            >
              {t('auth.loginWithGoogle')}
            </Button>

            {Platform.OS === 'ios' && (
              <Button
                variant="outline"
                size="lg"
                onPress={handleAppleLogin}
                disabled={loading}
                fullWidth
              >
                {t('auth.loginWithApple')}
              </Button>
            )}
          </YStack>

          {/* Sign Up Link */}
          <XStack justifyContent="center" gap="$2">
            <Text fontSize="$4" color="$colorHover">
              {t('auth.noAccount')}
            </Text>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text fontSize="$4" color="$primary" fontWeight="600">
                {t('auth.signup')}
              </Text>
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
