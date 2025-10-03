import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase';
import { queryKeys } from '../queryClient';
import { useAuth } from '../../hooks/useAuth';

export interface UsageTracking {
  id: string;
  userId: string;
  billingCycle: string; // Format: '2025-10'
  examsGenerated: number;
  questionsCreated: number;
  documentsUploaded: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get current billing cycle in format '2025-10'
 */
function getCurrentBillingCycle(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Fetch usage for current billing cycle
 */
async function fetchUsage(userId: string): Promise<UsageTracking> {
  const billingCycle = getCurrentBillingCycle();

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('userId', userId)
    .eq('billingCycle', billingCycle)
    .single();

  if (error) {
    // If no usage record exists, return default
    if (error.code === 'PGRST116') {
      return {
        id: '',
        userId,
        billingCycle,
        examsGenerated: 0,
        questionsCreated: 0,
        documentsUploaded: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    throw error;
  }

  return data;
}

/**
 * Increment usage counter
 */
async function incrementUsage(
  userId: string,
  field: 'examsGenerated' | 'questionsCreated' | 'documentsUploaded',
  amount: number = 1
) {
  const billingCycle = getCurrentBillingCycle();

  // Upsert: Update if exists, insert if not
  const { data, error } = await supabase.rpc('increment_usage', {
    p_user_id: userId,
    p_billing_cycle: billingCycle,
    p_field: field,
    p_amount: amount,
  });

  if (error) throw error;
  return data;
}

/**
 * Hook to fetch current usage
 */
export function useUsage() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.usage,
    queryFn: () => fetchUsage(user!.id),
    enabled: !!user,
    staleTime: 10 * 1000, // 10 seconds - frequent updates
  });
}

/**
 * Hook to increment usage
 */
export function useIncrementUsage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      field,
      amount = 1,
    }: {
      field: 'examsGenerated' | 'questionsCreated' | 'documentsUploaded';
      amount?: number;
    }) => incrementUsage(user!.id, field, amount),
    onSuccess: () => {
      // Invalidate usage query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.usage });
    },
  });
}
