'use client';

import { YStack } from '@anyexamai/ui';
import { Header } from './Header';
import { Footer } from './Footer';

export interface MainLayoutProps {
  children: React.ReactNode;
  /**
   * Whether to show the header
   * Default: true
   */
  showHeader?: boolean;
  /**
   * Whether to show the footer
   * Default: true
   */
  showFooter?: boolean;
  /**
   * Whether to constrain the content width
   * Default: true
   */
  containerized?: boolean;
}

/**
 * Main layout wrapper for all pages
 * Includes header, footer, and content area with RTL support
 *
 * Usage:
 * ```tsx
 * export default function Page() {
 *   return (
 *     <MainLayout>
 *       <YourContent />
 *     </MainLayout>
 *   );
 * }
 * ```
 */
export function MainLayout({
  children,
  showHeader = true,
  showFooter = true,
  containerized = true,
}: MainLayoutProps) {
  return (
    <YStack
      flex={1}
      minHeight="100vh"
      backgroundColor="$background"
    >
      {showHeader && <Header />}

      <YStack
        flex={1}
        maxWidth={containerized ? 1200 : undefined}
        width="100%"
        marginHorizontal="auto"
        paddingHorizontal={containerized ? '$6' : undefined}
        paddingVertical="$6"
      >
        {children}
      </YStack>

      {showFooter && <Footer />}
    </YStack>
  );
}
