import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient';

export interface QueryProviderProps {
  children: React.ReactNode;
  /**
   * Whether to show React Query devtools
   * Default: process.env.NODE_ENV === 'development'
   */
  showDevtools?: boolean;
}

/**
 * Query Provider wrapper for TanStack Query
 * Wraps the app root with QueryClientProvider and optionally devtools
 *
 * Usage:
 * ```tsx
 * <QueryProvider>
 *   <App />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({
  children,
  showDevtools = process.env.NODE_ENV === 'development',
}: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}
