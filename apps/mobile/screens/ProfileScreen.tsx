import { YStack, Heading, LoadingScreen, ButtonComponent as Button, Card, Separator } from '@anyexamai/ui';
import { useRequireAuth, signOut } from '@anyexamai/api';
import { useRouter } from '@anyexamai/navigation';
import { useTranslation } from '@anyexamai/i18n';
import { UsageWidget } from '@anyexamai/app';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Protect this screen - redirect to login if not authenticated
  const { loading, user } = useRequireAuth({
    onUnauthenticated: () => {
      // Navigate to login screen
      router.replace('/login');
    },
  });

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen message={t('auth.errors.checkingAuth')} />;
  }

  // User is authenticated, show profile content
  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      Alert.alert(t('error'), error.message);
    } else {
      // Navigate to login after logout
      router.replace('/login');
    }
  };

  const handleUpgrade = async () => {
    try {
      // Open web checkout page in in-app browser
      const checkoutUrl = `${process.env.EXPO_PUBLIC_WEB_URL}/checkout?source=mobile`;
      await WebBrowser.openBrowserAsync(checkoutUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });
    } catch (error) {
      console.error('Error opening checkout:', error);
      Alert.alert(t('error'), 'Failed to open checkout page');
    }
  };

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$4"
      gap="$4"
    >
      {/* Header */}
      <YStack gap="$2" paddingTop="$6">
        <Heading
          fontFamily="$heading"
          fontSize="$8"
          fontWeight="600"
          color="$color"
        >
          الملف الشخصي
        </Heading>

        {user && (
          <Heading
            fontFamily="$body"
            fontSize="$4"
            fontWeight="400"
            color="$colorHover"
          >
            {user.email}
          </Heading>
        )}
      </YStack>

      {/* Usage Stats Card */}
      <Card
        padding="$4"
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$4"
      >
        <UsageWidget
          mode="full"
          showUpgradeButton={true}
          onUpgradePress={handleUpgrade}
        />
      </Card>

      <Separator />

      {/* Logout Button */}
      <Button
        variant="outline"
        size="md"
        onPress={handleLogout}
      >
        {t('auth.logout')}
      </Button>
    </YStack>
  );
}
