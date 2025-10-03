/**
 * Stripe Client for Supabase Edge Functions
 *
 * This module initializes the Stripe client with API keys from environment variables.
 * Requires: npm:stripe@^14.0.0
 */

import Stripe from 'npm:stripe@14.0.0';

/**
 * Initialize Stripe client
 * Uses STRIPE_SECRET_KEY from environment variables
 */
export function getStripeClient(): Stripe {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');

  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set');
  }

  return new Stripe(stripeSecretKey, {
    // Use latest API version
    apiVersion: '2024-10-28.acacia',
    // Deno-specific configuration
    httpClient: Stripe.createFetchHttpClient(),
  });
}

/**
 * Stripe Configuration
 * Product and price IDs should match those in packages/config/stripe.ts
 */
export const STRIPE_CONFIG = {
  products: {
    pro: {
      // These should match the actual Stripe product/price IDs
      // Update after creating products in Stripe Dashboard
      priceId: {
        sar: Deno.env.get('STRIPE_PRICE_ID_SAR') || 'price_pro_37_sar_monthly',
        usd: Deno.env.get('STRIPE_PRICE_ID_USD') || 'price_pro_999_usd_monthly',
      },
    },
  },
} as const;

/**
 * Get price ID based on currency
 */
export function getPriceId(currency: 'sar' | 'usd' = 'sar'): string {
  return STRIPE_CONFIG.products.pro.priceId[currency];
}
