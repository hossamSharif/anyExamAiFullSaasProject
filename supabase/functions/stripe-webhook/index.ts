/**
 * Stripe Webhook Handler Edge Function
 *
 * This function handles webhook events from Stripe for subscription lifecycle management.
 * Verifies webhook signatures and processes payment events.
 *
 * Events handled:
 * - checkout.session.completed: User successfully upgraded to Pro
 * - customer.subscription.created: Subscription created
 * - customer.subscription.updated: Subscription modified
 * - customer.subscription.deleted: Subscription cancelled/expired
 * - invoice.payment_succeeded: Payment successful
 * - invoice.payment_failed: Payment failed
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'npm:stripe@14.0.0';
import { getStripeClient } from '../_shared/stripe.ts';

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  try {
    // Get raw body for signature verification
    const body = await req.text();

    // Initialize Stripe client
    const stripe = getStripeClient();

    // Get webhook secret from environment
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return new Response('Webhook signature verification failed', {
        status: 400,
      });
    }

    // Initialize Supabase admin client (for database updates)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Processing webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session, supabaseAdmin);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription, supabaseAdmin);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription, supabaseAdmin);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, supabaseAdmin);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice, supabaseAdmin);
        break;
      }

      default:
        console.log('Unhandled event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

/**
 * Handle successful checkout session completion
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  console.log('Handling checkout.session.completed:', session.id);

  const userId = session.metadata?.user_id;
  const tier = session.metadata?.tier || 'pro';

  if (!userId) {
    console.error('No user_id in session metadata');
    return;
  }

  // Update subscription to Pro tier
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .update({
      tier: tier,
      status: 'active',
      stripe_subscription_id: session.subscription,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days from now
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (subscriptionError) {
    console.error('Error updating subscription:', subscriptionError);
    throw subscriptionError;
  }

  console.log('Subscription upgraded to Pro for user:', userId);

  // TODO: Send welcome email (Story 5.9)
  // await sendWelcomeEmail(userId);
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription,
  supabase: any
) {
  console.log('Handling subscription update:', subscription.id);

  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  // Determine subscription status
  const status =
    subscription.status === 'active'
      ? 'active'
      : subscription.status === 'canceled'
        ? 'cancelled'
        : subscription.status === 'past_due'
          ? 'past_due'
          : 'expired';

  // Update subscription details
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: status,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0]?.price.id,
      current_period_start: new Date(
        subscription.current_period_start * 1000
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  console.log('Subscription updated for user:', userId);
}

/**
 * Handle subscription deletion (cancellation)
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: any
) {
  console.log('Handling subscription deletion:', subscription.id);

  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  // Downgrade to free tier
  const { error } = await supabase
    .from('subscriptions')
    .update({
      tier: 'free',
      status: 'cancelled',
      stripe_subscription_id: null,
      current_period_start: null,
      current_period_end: null,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error downgrading subscription:', error);
    throw error;
  }

  console.log('Subscription cancelled for user:', userId);

  // TODO: Send cancellation email (Story 5.9)
  // await sendCancellationEmail(userId);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: any
) {
  console.log('Handling payment success:', invoice.id);

  const subscription = invoice.subscription;
  const customerId = invoice.customer;

  if (!subscription || typeof subscription !== 'string') {
    console.log('No subscription on invoice, skipping');
    return;
  }

  // Get user ID from subscription
  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription)
    .single();

  if (!subscriptionData) {
    console.error('No subscription found for subscription ID:', subscription);
    return;
  }

  const userId = subscriptionData.user_id;

  // Store payment history
  const { error: paymentError } = await supabase
    .from('payment_history')
    .insert({
      user_id: userId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      stripe_payment_intent_id: invoice.payment_intent,
      stripe_invoice_id: invoice.id,
      description: invoice.description || 'Subscription payment',
      receipt_url: invoice.hosted_invoice_url,
      created_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error('Error storing payment history:', paymentError);
    throw paymentError;
  }

  console.log('Payment recorded for user:', userId);

  // TODO: Send payment receipt email (Story 5.9)
  // await sendReceiptEmail(userId, invoice);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('Handling payment failure:', invoice.id);

  const subscription = invoice.subscription;

  if (!subscription || typeof subscription !== 'string') {
    console.log('No subscription on invoice, skipping');
    return;
  }

  // Get user ID from subscription
  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription)
    .single();

  if (!subscriptionData) {
    console.error('No subscription found for subscription ID:', subscription);
    return;
  }

  const userId = subscriptionData.user_id;

  // Store failed payment in history
  const { error: paymentError } = await supabase
    .from('payment_history')
    .insert({
      user_id: userId,
      amount: invoice.amount_due,
      currency: invoice.currency,
      status: 'failed',
      stripe_payment_intent_id: invoice.payment_intent,
      stripe_invoice_id: invoice.id,
      description: invoice.description || 'Subscription payment (failed)',
      created_at: new Date().toISOString(),
    });

  if (paymentError) {
    console.error('Error storing failed payment:', paymentError);
    throw paymentError;
  }

  console.log('Failed payment recorded for user:', userId);

  // TODO: Send payment failure email (Story 5.9)
  // await sendPaymentFailedEmail(userId);
}
