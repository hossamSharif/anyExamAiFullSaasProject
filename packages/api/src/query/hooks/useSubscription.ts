import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase';
import { queryKeys } from '../queryClient';
import { useAuth } from '../../hooks/useAuth';

export interface Subscription {
  id: string;
  userId: string;
  tier: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'expired';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetch user subscription
 */
async function fetchSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('userId', userId)
    .single();

  if (error) {
    // If no subscription exists, return default free tier
    if (error.code === 'PGRST116') {
      return {
        id: '',
        userId,
        tier: 'free',
        status: 'active',
        cancelAtPeriodEnd: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    throw error;
  }

  return data;
}

/**
 * Hook to fetch user subscription
 */
export function useSubscription() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.subscription,
    queryFn: () => fetchSubscription(user!.id),
    enabled: !!user,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to check if user is Pro tier
 */
export function useIsPro() {
  const { data: subscription } = useSubscription();
  return subscription?.tier === 'pro' && subscription?.status === 'active';
}
