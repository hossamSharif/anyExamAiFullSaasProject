/**
 * Paywall Hook
 *
 * Manages paywall modal state and upgrade flow
 * Integrates with usage tracking and checkout session creation
 */

import { useState } from 'react';
import { useUsageTracking } from './useUsageTracking';
import { useCreateCheckoutSession } from './useSubscription';
import { Platform } from 'react-native';

export type PaywallTrigger = 'exam' | 'document' | 'question';

/**
 * Hook for managing paywall modal and upgrade flow
 *
 * @example
 * ```tsx
 * const { showPaywall, paywallProps, handleUpgrade } = usePaywall();
 *
 * // Check if user can generate exam
 * if (!canGenerateExam(10)) {
 *   showPaywall('exam');
 *   return;
 * }
 *
 * // Render modal
 * <PaywallModal {...paywallProps} onUpgrade={handleUpgrade} />
 * ```
 */
export function usePaywall() {
  const [isOpen, setIsOpen] = useState(false);
  const [limitType, setLimitType] = useState<PaywallTrigger>('exam');

  const { usage, limits } = useUsageTracking();
  const { createCheckoutSession, loading } = useCreateCheckoutSession();

  /**
   * Show paywall modal
   */
  const showPaywall = (type: PaywallTrigger) => {
    setLimitType(type);
    setIsOpen(true);
  };

  /**
   * Hide paywall modal
   */
  const hidePaywall = () => {
    setIsOpen(false);
  };

  /**
   * Handle upgrade to Pro
   */
  const handleUpgrade = async () => {
    // Determine URLs based on platform
    const baseUrl =
      Platform.OS === 'web'
        ? typeof window !== 'undefined'
          ? window.location.origin
          : 'https://anyexamai.com'
        : 'anyexamai://';

    const successUrl =
      Platform.OS === 'web'
        ? `${baseUrl}/payment-success`
        : `${baseUrl}subscription-success`;

    const cancelUrl =
      Platform.OS === 'web' ? `${baseUrl}/pricing` : `${baseUrl}pricing`;

    // Create checkout session
    const session = await createCheckoutSession({
      tier: 'pro',
      currency: 'sar', // Default to SAR for Middle East market
      successUrl,
      cancelUrl,
    });

    if (session) {
      // Redirect to Stripe Checkout
      if (Platform.OS === 'web') {
        window.location.href = session.url;
      } else {
        // Open in-app browser on mobile
        try {
          const { openBrowserAsync } = await import('expo-web-browser');
          await openBrowserAsync(session.url);
          // Close modal after opening browser
          hidePaywall();
        } catch (error) {
          console.error('Error opening browser:', error);
        }
      }
    }
  };

  /**
   * Get current usage stats for display
   */
  const currentUsage = usage
    ? {
        examsUsed: usage.examsGenerated,
        examsLimit: limits.examsPerMonth,
        documentsUsed: usage.documentsUploaded,
        documentsLimit: limits.documentsPerMonth,
      }
    : undefined;

  /**
   * Props to pass to PaywallModal component
   */
  const paywallProps = {
    open: isOpen,
    onOpenChange: setIsOpen,
    limitType,
    currentUsage,
    loading,
  };

  return {
    showPaywall,
    hidePaywall,
    paywallProps,
    handleUpgrade,
    isOpen,
  };
}
