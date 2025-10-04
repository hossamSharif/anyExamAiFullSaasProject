/**
 * Deep Link Handler Component
 *
 * Wraps the app navigation to handle deep links
 * Must be inside NavigationProvider
 */

import { useEffect } from 'react';
import { useDeepLinking } from '../hooks/useDeepLinking';

export function DeepLinkHandler({ children }: { children: React.ReactNode }) {
  useDeepLinking();

  return <>{children}</>;
}
