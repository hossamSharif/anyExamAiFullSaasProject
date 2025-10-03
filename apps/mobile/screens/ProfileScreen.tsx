import { YStack, Heading, LoadingScreen, ButtonComponent as Button } from '@anyexamai/ui';
import { useRequireAuth, signOut } from '@anyexamai/api';
import { useRouter } from '@anyexamai/navigation';
import { useTranslation } from '@anyexamai/i18n';
import { Alert } from 'react-native';

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

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      alignItems="center"
      justifyContent="center"
      padding="$6"
      gap="$4"
    >
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
          fontSize="$5"
          fontWeight="400"
          color="$colorHover"
        >
          {user.email}
        </Heading>
      )}

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
