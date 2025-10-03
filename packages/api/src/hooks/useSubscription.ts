/**
 * Subscription Hooks
 *
 * Hooks for managing subscription operations including:
 * - Creating Stripe checkout sessions
 * - Fetching subscription status
 * - Managing subscription tiers
 */

import { useState } from 'react';
import { supabase } from '../supabase';

export interface CreateCheckoutSessionParams {
  tier?: 'pro';
  currency?: 'sar' | 'usd';
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

/**
 * Hook for creating Stripe checkout sessions
 *
 * @example
 * ```tsx
 * const { createCheckoutSession, loading, error } = useCreateCheckoutSession();
 *
 * async function handleUpgrade() {
 *   const session = await createCheckoutSession({
 *     currency: 'sar',
 *     successUrl: 'https://app.com/success',
 *     cancelUrl: 'https://app.com/pricing',
 *   });
 *
 *   if (session) {
 *     window.location.href = session.url;
 *   }
 * }
 * ```
 */
export function useCreateCheckoutSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCheckoutSession = async (
    params: CreateCheckoutSessionParams
  ): Promise<CheckoutSessionResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: {
            tier: params.tier || 'pro',
            currency: params.currency || 'sar',
            successUrl: params.successUrl,
            cancelUrl: params.cancelUrl,
          },
        }
      );

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!data || !data.url) {
        throw new Error('Invalid response from checkout session creation');
      }

      return data as CheckoutSessionResponse;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error creating checkout session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
  };
}

/**
 * Get subscription status for the current user
 *
 * @example
 * ```tsx
 * const { subscription, loading, error, refetch } = useSubscription();
 *
 * if (subscription?.tier === 'pro') {
 *   // User is on Pro tier
 * }
 * ```
 */
export function useSubscription() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error: queryError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (queryError && queryError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (user has no subscription)
        throw queryError;
      }

      setSubscription(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useState(() => {
    fetchSubscription();
  });

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
  };
}

/**
 * Check if user is on Pro tier
 *
 * @example
 * ```tsx
 * const { isPro, loading } = useIsPro();
 *
 * if (isPro) {
 *   // Show Pro features
 * }
 * ```
 */
export function useIsPro() {
  const { subscription, loading, error } = useSubscription();

  const isPro =
    subscription?.tier === 'pro' && subscription?.status === 'active';

  return {
    isPro,
    loading,
    error,
  };
}
