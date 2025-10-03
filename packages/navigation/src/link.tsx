/**
 * Shared Link component using Solito
 * Works on both mobile and web with RTL support
 */

import { Link as SolitoLink, LinkProps } from 'solito/link';

export function Link(props: LinkProps) {
  return <SolitoLink {...props} />;
}
