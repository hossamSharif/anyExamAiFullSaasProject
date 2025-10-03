'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@anyexamai/api';
import { LoadingScreen } from '@anyexamai/ui';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Redirect path if user is not authenticated
   * Default: '/login'
   */
  redirectTo?: string;
  /**
   * Loading message to show while checking auth
   */
  loadingMessage?: string;
}

/**
 * Protected route wrapper for Next.js pages
 * Redirects to login if user is not authenticated
 *
 * Usage:
 * ```tsx
 * export default function ProfilePage() {
 *   return (
 *     <ProtectedRoute>
 *       <YourProtectedContent />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export function ProtectedRoute({
  children,
  redirectTo = '/login',
  loadingMessage = 'جاري التحقق من الجلسة...',
}: ProtectedRouteProps) {
  const router = useRouter();

  const { loading, isAuthenticated } = useRequireAuth({
    onUnauthenticated: () => {
      router.replace(redirectTo);
    },
    immediateRedirect: true,
  });

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated) {
    return <LoadingScreen message="جاري إعادة التوجيه..." />;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}
