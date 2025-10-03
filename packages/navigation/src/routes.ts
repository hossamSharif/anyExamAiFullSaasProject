/**
 * Shared route configuration for mobile and web
 * RTL-aware navigation routes
 */

export const routes = {
  home: '/',
  // Add more routes here as the app grows
  // auth: {
  //   login: '/auth/login',
  //   signup: '/auth/signup',
  // },
  // exams: {
  //   browse: '/exams/browse',
  //   take: '/exams/take/:id',
  //   results: '/exams/results/:id',
  // },
} as const;

export type Routes = typeof routes;
