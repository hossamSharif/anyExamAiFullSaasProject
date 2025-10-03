/**
 * Create Stripe Checkout Session Edge Function
 *
 * This function creates a Stripe Checkout session for upgrading to Pro tier.
 * Supports Arabic locale and handles customer creation/retrieval.
 *
 * @param {string} userId - User ID from Supabase Auth
 * @param {string} tier - Subscription tier ('pro')
 * @param {string} successUrl - URL to redirect after successful payment
 * @param {string} cancelUrl - URL to redirect if payment is cancelled
 * @param {string} currency - Currency code ('sar' or 'usd'), defaults to 'sar'
 *
 * @returns {string} url - Stripe Checkout session URL
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import {
  corsHeaders,
  handleCorsPrelight,
  jsonResponse,
  errorResponse,
} from '../_shared/cors.ts';
import { getStripeClient, getPriceId } from '../_shared/stripe.ts';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return handleCorsPrelight();
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return errorResponse('Unauthorized', 401);
    }

    // Parse request body
    const {
      tier = 'pro',
      successUrl,
      cancelUrl,
      currency = 'sar',
    } = await req.json();

    // Validate required parameters
    if (!successUrl || !cancelUrl) {
      return errorResponse('successUrl and cancelUrl are required');
    }

    // Validate currency
    if (currency !== 'sar' && currency !== 'usd') {
      return errorResponse('currency must be either "sar" or "usd"');
    }

    // Validate tier
    if (tier !== 'pro') {
      return errorResponse('Only "pro" tier is supported');
    }

    // Initialize Stripe client
    const stripe = getStripeClient();

    // Get user's email from Supabase auth
    const userEmail = user.email;
    if (!userEmail) {
      return errorResponse('User email not found');
    }

    // Check if customer already exists in Stripe
    let customerId: string | null = null;

    // Query subscription table to see if user has a Stripe customer ID
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Search for existing customer by email
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;

        // Update subscription record with customer ID
        await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            stripe_customer_id: customerId,
            tier: 'free', // Will be updated to 'pro' after successful payment
            status: 'active',
          });
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            supabase_user_id: user.id,
          },
        });

        customerId = customer.id;

        // Create subscription record with customer ID
        await supabaseClient.from('subscriptions').insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          tier: 'free',
          status: 'active',
        });
      }
    }

    // Get price ID based on currency
    const priceId = getPriceId(currency as 'sar' | 'usd');

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      locale: 'ar', // Arabic checkout interface
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user.id,
        tier: tier,
        currency: currency,
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address
      billing_address_collection: 'auto',
      // Customer email
      customer_email: !customerId ? userEmail : undefined,
      // Subscription data
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier: tier,
        },
      },
    });

    // Return checkout session URL
    return jsonResponse({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    return errorResponse(
      error instanceof Error ? error.message : 'Failed to create checkout session',
      500
    );
  }
});
