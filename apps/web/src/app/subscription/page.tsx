/**
 * Subscription Management Page (Web)
 *
 * Web wrapper for the subscription management screen
 * Handles web-specific navigation and actions
 */

'use client';

import { SubscriptionManagementScreen } from '@anyexamai/app';
import { MainLayout } from '../../components/layout/MainLayout';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@anyexamai/api';
import { YStack, LoadingScreen } from '@anyexamai/ui';
import { useTranslation } from '@anyexamai/i18n';

export default function SubscriptionPage() {
  const router = useRouter();
  const { t } = useTranslation();

  // Protect this page - redirect to login if not authenticated
  const { loading } = useRequireAuth({
    onUnauthenticated: () => {
      router.replace('/login');
    },
  });

  // Show loading screen while checking auth
  if (loading) {
    return (
      <MainLayout>
        <LoadingScreen message={t('auth.errors.checkingAuth')} />
      </MainLayout>
    );
  }

  const handleUpgrade = () => {
    router.push('/checkout?source=web');
  };

  const handleManageBilling = async () => {
    try {
      // TODO: Create Stripe Customer Portal session and redirect
      // For now, show a placeholder alert
      alert('Customer portal integration coming soon');
    } catch (error) {
      console.error('Error opening billing portal:', error);
      alert('Failed to open billing portal');
    }
  };

  const handleCancelSubscription = () => {
    // TODO: Implement subscription cancellation via Stripe API
    alert('Subscription cancellation will be implemented with Stripe API');
  };

  return (
    <MainLayout>
      <YStack maxWidth={800} width="100%" marginHorizontal="auto">
        <SubscriptionManagementScreen
          onUpgrade={handleUpgrade}
          onManageBilling={handleManageBilling}
          onCancelSubscription={handleCancelSubscription}
        />
      </YStack>
    </MainLayout>
  );
}
