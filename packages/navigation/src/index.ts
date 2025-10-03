/**
 * @anyexamai/navigation
 * Shared navigation configuration for mobile and web
 *
 * Uses Solito to provide unified navigation across platforms
 * with RTL support for Arabic-first UI
 */

export { routes } from './routes';
export type { Routes } from './routes';
export { Link } from './link';

// Re-export Solito hooks for unified navigation
export { useRouter } from 'solito/router';
