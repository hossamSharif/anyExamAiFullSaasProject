/**
 * Subscription Screen (Mobile)
 *
 * Mobile wrapper for the subscription management screen
 * Handles mobile-specific navigation and actions
 */

import { ScrollView, Alert } from 'react-native';
import { YStack, LoadingScreen } from '@anyexamai/ui';
import { useRequireAuth } from '@anyexamai/api';
import { SubscriptionManagementScreen } from '@anyexamai/app';
import { useRouter } from '@anyexamai/navigation';
import { useTranslation } from '@anyexamai/i18n';
import * as WebBrowser from 'expo-web-browser';

export default function SubscriptionScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Protect this screen - redirect to login if not authenticated
  const { loading } = useRequireAuth({
    onUnauthenticated: () => {
      router.replace('/login');
    },
  });

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen message={t('auth.errors.checkingAuth')} />;
  }

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

  const handleManageBilling = async () => {
    try {
      // TODO: Create Stripe Customer Portal session and open URL
      // For now, show a placeholder message
      Alert.alert(
        t('subscription.currentPlan'),
        'Customer portal integration coming soon'
      );
    } catch (error) {
      console.error('Error opening billing portal:', error);
      Alert.alert(t('error'), 'Failed to open billing portal');
    }
  };

  const handleCancelSubscription = () => {
    // TODO: Implement subscription cancellation via Stripe API
    Alert.alert(
      t('success'),
      'Subscription cancellation will be implemented with Stripe API'
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <YStack flex={1} padding="$4">
        <SubscriptionManagementScreen
          onUpgrade={handleUpgrade}
          onManageBilling={handleManageBilling}
          onCancelSubscription={handleCancelSubscription}
        />
      </YStack>
    </ScrollView>
  );
}
