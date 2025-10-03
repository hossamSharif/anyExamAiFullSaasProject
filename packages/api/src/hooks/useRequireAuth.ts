import { useEffect } from 'react';
import { useAuth } from './useAuth';

export interface UseRequireAuthOptions {
  /**
   * Redirect path if user is not authenticated
   * Platform-specific navigation will be handled by the app
   */
  onUnauthenticated?: () => void;

  /**
   * Redirect path after successful authentication
   */
  redirectOnSuccess?: string;

  /**
   * Whether to redirect immediately or wait for user interaction
   * Default: true
   */
  immediateRedirect?: boolean;
}

/**
 * Hook for protecting routes/screens that require authentication
 *
 * Usage:
 * ```tsx
 * function ProtectedScreen() {
 *   const { loading, isAuthenticated } = useRequireAuth({
 *     onUnauthenticated: () => navigation.navigate('Login')
 *   });
 *
 *   if (loading) {
 *     return <LoadingScreen />;
 *   }
 *
 *   return <YourProtectedContent />;
 * }
 * ```
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const {
    onUnauthenticated,
    immediateRedirect = true
  } = options;

  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Don't redirect while checking auth state
    if (loading) return;

    // If not authenticated and redirect is configured, trigger redirect
    if (!isAuthenticated && onUnauthenticated && immediateRedirect) {
      onUnauthenticated();
    }
  }, [loading, isAuthenticated, onUnauthenticated, immediateRedirect]);

  return {
    user,
    loading,
    isAuthenticated,
    /**
     * Require authentication - returns true if authenticated, false otherwise
     * Can be used for conditional rendering
     */
    requireAuth: isAuthenticated,
  };
}
