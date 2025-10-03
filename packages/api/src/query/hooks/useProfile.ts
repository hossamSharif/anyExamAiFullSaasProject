import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase';
import { queryKeys } from '../queryClient';
import { useAuth } from '../../hooks/useAuth';

/**
 * Fetch user profile data
 */
async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update user profile
 */
async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Hook to fetch user profile
 */
export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: any) => updateProfile(user!.id, updates),
    onSuccess: () => {
      // Invalidate profile query to refetch latest data
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}
