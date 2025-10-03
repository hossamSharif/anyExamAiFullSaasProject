'use client';

import { Provider } from 'solito';

export function SolitoProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
