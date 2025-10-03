# Stripe Setup Guide for anyExamAi

## Overview

This guide walks through setting up Stripe for anyExamAi's freemium subscription model with Arabic-first support for the Middle East market.

## Prerequisites

- Stripe account (create at https://stripe.com)
- Access to Stripe Dashboard
- Supabase project with webhook endpoint

## Step 1: Create Stripe Account

1. Go to https://stripe.com and sign up for a new account
2. Complete business verification (required for production)
3. For development, use **Test Mode** (toggle in top right of dashboard)

## Step 2: Create Product

1. Navigate to **Products** → **Add Product**
2. Configure the product:

### Product Details

**English Configuration:**
- Name: `anyExamAi Pro`
- Description: `Professional tier with unlimited features for exam generation`
- Statement descriptor: `ANYEXAMAI PRO` (appears on customer's credit card)

**Arabic Configuration (for localized checkout):**
- Name (Arabic): `أي إمتحان - احترافي`
- Description (Arabic): `النسخة الاحترافية مع ميزات غير محدودة لإنشاء الامتحانات`

### Pricing Configuration

Create TWO prices for different markets:

#### Price 1: Saudi Arabian Riyal (Primary Market)
- **Currency**: SAR (Saudi Riyal)
- **Amount**: 37.00 SAR
- **Billing period**: Monthly
- **Price ID**: Copy this ID → Update `stripe.ts` config
  ```typescript
  sar: {
    priceId: 'price_xxxxxxxxxxxxx', // <-- Paste here
    ...
  }
  ```

#### Price 2: USD (International Fallback)
- **Currency**: USD (US Dollar)
- **Amount**: 9.99 USD
- **Billing period**: Monthly
- **Price ID**: Copy this ID → Update `stripe.ts` config
  ```typescript
  usd: {
    priceId: 'price_xxxxxxxxxxxxx', // <-- Paste here
    ...
  }
  ```

### Product Metadata (Optional but Recommended)

Add metadata to help track the product:
- `tier`: `pro`
- `language_primary`: `ar`
- `market`: `middle_east`

## Step 3: Configure Webhook Endpoint

Webhooks notify your application of payment events.

### Development Webhook (Local Testing)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run webhook forwarding:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe-webhook
   ```
3. Copy the webhook signing secret (starts with `whsec_`)
4. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### Production Webhook (Deployed App)

1. Navigate to **Developers** → **Webhooks** → **Add endpoint**
2. Enter endpoint URL:
   ```
   https://yourdomain.com/api/stripe-webhook
   ```
3. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
4. Copy the **Signing secret** and add to production environment variables

## Step 4: Get API Keys

1. Navigate to **Developers** → **API keys**
2. Copy the keys:

### Test Mode Keys (Development)
- **Publishable key**: `pk_test_...`
- **Secret key**: `sk_test_...`

Add to `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

### Live Mode Keys (Production)
- **Publishable key**: `pk_live_...`
- **Secret key**: `sk_live_...`

⚠️ **IMPORTANT**: Never commit live keys to git! Use environment variables in production.

## Step 5: Update Configuration File

Update `packages/config/stripe.ts` with your actual product and price IDs:

```typescript
export const STRIPE_CONFIG = {
  products: {
    pro: {
      productId: 'prod_xxxxxxxxxxxxx', // From Stripe Dashboard
      prices: {
        sar: {
          priceId: 'price_xxxxxxxxxxxxx', // SAR price ID
          ...
        },
        usd: {
          priceId: 'price_xxxxxxxxxxxxx', // USD price ID
          ...
        },
      },
    },
  },
};
```

## Step 6: Configure Arabic Locale for Checkout

To display Stripe Checkout in Arabic:

1. When creating checkout sessions, pass `locale: 'ar'`:
   ```typescript
   const session = await stripe.checkout.sessions.create({
     locale: 'ar', // Arabic interface
     ...
   });
   ```

2. Stripe will automatically display:
   - Form labels in Arabic
   - Error messages in Arabic
   - Payment button text in Arabic

## Step 7: Test Payment Flow

### Test Cards for Development

Use these test card numbers in Test Mode:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Payment Failure:**
- Card: `4000 0000 0000 0002`
- Triggers `card_declined` error

**3D Secure Required:**
- Card: `4000 0025 0000 3155`
- Tests strong customer authentication

### Testing Workflow

1. **Create Checkout Session**:
   - Trigger from app: Click "الترقية للنسخة الاحترافية"
   - Verify Arabic checkout page appears
   - Check product name and price display correctly

2. **Complete Payment**:
   - Enter test card details
   - Complete payment
   - Verify redirect to success page

3. **Check Webhook Received**:
   - Verify `checkout.session.completed` event received
   - Check subscription created in database
   - Verify user upgraded to Pro tier

4. **Test Subscription Features**:
   - Generate >5 exams (free limit)
   - Upload documents (Pro only)
   - Create >10 questions per exam

## Step 8: Verify Subscription Status

In Stripe Dashboard:
1. Navigate to **Customers**
2. Find test customer
3. Verify:
   - Subscription status: `active`
   - Billing cycle: Monthly
   - Next payment date
   - Payment method on file

## Step 9: Production Checklist

Before going live:

- [ ] Switch to **Live Mode** in Stripe Dashboard
- [ ] Update API keys to live keys
- [ ] Configure live webhook endpoint
- [ ] Test with real (small amount) payment
- [ ] Verify webhook signature validation works
- [ ] Test subscription cancellation flow
- [ ] Test payment failure handling
- [ ] Set up Stripe email receipts (Arabic)
- [ ] Configure tax collection (if required in Saudi Arabia)
- [ ] Review compliance requirements for Middle East

## Webhook Security

Always verify webhook signatures to prevent fraud:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Process event
    switch (event.type) {
      case 'checkout.session.completed':
        // Handle successful checkout
        break;
      case 'customer.subscription.updated':
        // Handle subscription update
        break;
      // ... other events
    }

    return new Response(JSON.stringify({ received: true }));
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return new Response('Webhook Error', { status: 400 });
  }
}
```

## Troubleshooting

### Webhook not receiving events
- Check webhook URL is publicly accessible
- Verify signing secret is correct
- Check Stripe Dashboard → Webhooks → Event logs

### Payment fails with "card_declined"
- In test mode: Use test card numbers from above
- In live mode: Ask customer to try different payment method

### Checkout page not in Arabic
- Verify `locale: 'ar'` is set in checkout session creation
- Check browser language settings

### Subscription not activating
- Check webhook handler is processing `checkout.session.completed`
- Verify database update is successful
- Check Supabase logs for errors

## Additional Resources

- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Stripe Localization](https://stripe.com/docs/payments/checkout/customization#localize-checkout)

## Support

For Stripe-specific issues, contact:
- Stripe Support: https://support.stripe.com
- Stripe Discord: https://stripe.com/discord

For anyExamAi setup issues, review:
- `packages/config/stripe.ts` - Stripe configuration
- `apps/web/app/api/stripe-webhook/route.ts` - Webhook handler
- Supabase Edge Functions - Checkout session creation
