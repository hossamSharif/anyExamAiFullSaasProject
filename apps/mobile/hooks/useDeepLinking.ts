/**
 * Deep Linking Hook
 *
 * React hook for managing deep links in the mobile app
 * Integrates with subscription status updates
 */

import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSubscription } from '@anyexamai/api';
import { initializeDeepLinking } from '../utils/deepLinking';

/**
 * Hook for handling deep links
 *
 * Automatically sets up deep link listeners and handles subscription-related deep links
 *
 * @example
 * ```tsx
 * function App() {
 *   useDeepLinking();
 *
 *   return <Navigation />;
 * }
 * ```
 */
export function useDeepLinking() {
  const navigation = useNavigation();
  const { refetch: refetchSubscription } = useSubscription();

  useEffect(() => {
    // Handle subscription success
    const handleSubscriptionSuccess = () => {
      // Navigate to home or profile after successful subscription
      if (navigation) {
        (navigation as any).navigate('Profile');
      }
    };

    // Refresh subscription status from database
    const handleRefreshSubscription = async () => {
      await refetchSubscription();
    };

    // Handle subscription cancel
    const handleSubscriptionCancel = () => {
      // Navigate to pricing page
      if (navigation) {
        // Assuming there's a pricing screen
        // (navigation as any).navigate('Pricing');
      }
    };

    // Initialize deep linking
    const cleanup = initializeDeepLinking(
      handleSubscriptionSuccess,
      handleRefreshSubscription,
      handleSubscriptionCancel
    );

    return cleanup;
  }, [navigation, refetchSubscription]);
}
