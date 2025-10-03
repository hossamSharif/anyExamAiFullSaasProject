/**
 * OAuth Configuration for anyExamAi
 *
 * This file contains OAuth provider configurations for Google and Apple sign-in.
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Google OAuth:
 *    - Go to Supabase Dashboard > Authentication > Providers
 *    - Enable Google provider
 *    - Create OAuth credentials in Google Cloud Console
 *    - Add authorized redirect URI: https://<your-project-ref>.supabase.co/auth/v1/callback
 *    - Copy Client ID and Client Secret to Supabase
 *
 * 2. Apple OAuth:
 *    - Go to Supabase Dashboard > Authentication > Providers
 *    - Enable Apple provider
 *    - Create Sign in with Apple service in Apple Developer Portal
 *    - Configure Service ID and Team ID
 *    - Add authorized redirect URI: https://<your-project-ref>.supabase.co/auth/v1/callback
 *    - Generate private key and upload to Supabase
 *
 * 3. Mobile Deep Links:
 *    - Add to mobile app configuration:
 *      - iOS: anyexamai:// scheme in Info.plist
 *      - Android: anyexamai:// scheme in AndroidManifest.xml
 *
 * 4. Redirect URLs:
 *    - For mobile: anyexamai://auth/callback
 *    - For web: https://yourdomain.com/auth/callback
 */

export const oauthConfig = {
  google: {
    enabled: true,
    // Redirect URLs for different platforms
    redirectUrls: {
      mobile: 'anyexamai://auth/callback',
      web: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  },
  apple: {
    enabled: true,
    // Redirect URLs for different platforms
    redirectUrls: {
      mobile: 'anyexamai://auth/callback',
      web: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
    },
  },
};

/**
 * Get the appropriate redirect URL based on platform
 */
export function getOAuthRedirectUrl(platform: 'mobile' | 'web' = 'web'): string {
  if (platform === 'mobile') {
    return 'anyexamai://auth/callback';
  }

  // For web, use the current origin or fallback
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/auth/callback`;
  }

  // Server-side fallback
  return process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    : 'http://localhost:3000/auth/callback';
}
