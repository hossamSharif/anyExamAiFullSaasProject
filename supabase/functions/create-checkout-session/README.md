# Create Checkout Session Edge Function

## Overview

This Supabase Edge Function creates a Stripe Checkout session for upgrading users to the Pro tier. It handles customer creation/retrieval and generates an Arabic-localized checkout page.

## Features

- ✅ Create or retrieve Stripe customer
- ✅ Generate Stripe Checkout session with Arabic locale
- ✅ Support for multiple currencies (SAR, USD)
- ✅ Automatic customer linking to Supabase user
- ✅ Metadata tracking for webhook processing
- ✅ CORS support for web and mobile apps

## Prerequisites

- Supabase project with database schema (Story 0.3)
- Stripe account with product and prices configured (Story 1.5.1)
- Environment variables configured

## Environment Variables

Set these in your Supabase project:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID_SAR=price_xxx  # Optional: SAR price ID
STRIPE_PRICE_ID_USD=price_xxx  # Optional: USD price ID
```

## Deployment

### Using Supabase CLI

```bash
# Deploy the function
supabase functions deploy create-checkout-session

# Set environment variables
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_PRICE_ID_SAR=price_...
supabase secrets set STRIPE_PRICE_ID_USD=price_...
```

### Using Supabase Dashboard

1. Go to Functions → Create new function
2. Name: `create-checkout-session`
3. Copy contents of `index.ts`
4. Deploy
5. Set environment variables in Settings → Secrets

## Usage

### From Client (TypeScript/JavaScript)

```typescript
import { supabase } from './supabase-client';

async function upgradeToProAsync() {
  const { data, error } = await supabase.functions.invoke(
    'create-checkout-session',
    {
      body: {
        tier: 'pro',
        currency: 'sar', // or 'usd'
        successUrl: 'https://yourapp.com/payment-success',
        cancelUrl: 'https://yourapp.com/pricing',
      },
    }
  );

  if (error) {
    console.error('Error creating checkout session:', error);
    return;
  }

  // Redirect to Stripe Checkout
  window.location.href = data.url;
}
```

### From Mobile (React Native with Expo)

```typescript
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase-client';

async function upgradeToProMobile() {
  const { data, error } = await supabase.functions.invoke(
    'create-checkout-session',
    {
      body: {
        tier: 'pro',
        currency: 'sar',
        successUrl: 'anyexamai://subscription-success',
        cancelUrl: 'anyexamai://pricing',
      },
    }
  );

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Open Stripe Checkout in in-app browser
  await WebBrowser.openBrowserAsync(data.url);
}
```

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `tier` | string | No | Subscription tier (default: 'pro') |
| `currency` | string | No | Currency code: 'sar' or 'usd' (default: 'sar') |
| `successUrl` | string | Yes | URL to redirect after successful payment |
| `cancelUrl` | string | Yes | URL to redirect if payment cancelled |

## Response

### Success (200)

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

### Error (400/401/500)

```json
{
  "error": "Error message"
}
```

## Error Handling

| Status | Error | Solution |
|--------|-------|----------|
| 401 | Unauthorized | User not authenticated |
| 400 | Missing parameters | Provide successUrl and cancelUrl |
| 400 | Invalid currency | Use 'sar' or 'usd' |
| 500 | Stripe API error | Check Stripe Dashboard logs |

## Flow Diagram

```
User clicks "Upgrade to Pro"
         ↓
Client calls create-checkout-session function
         ↓
Function authenticates user
         ↓
Function creates/retrieves Stripe customer
         ↓
Function creates Stripe Checkout session (Arabic)
         ↓
Function returns checkout URL
         ↓
Client redirects to Stripe Checkout
         ↓
User completes payment
         ↓
Stripe redirects to successUrl
         ↓
Webhook updates subscription (Story 1.5.3)
```

## Testing

### Test with cURL

```bash
# Get auth token
AUTH_TOKEN="your-supabase-auth-token"

# Create checkout session
curl -X POST \
  https://your-project.supabase.co/functions/v1/create-checkout-session \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "pro",
    "currency": "sar",
    "successUrl": "https://yourapp.com/success",
    "cancelUrl": "https://yourapp.com/cancel"
  }'
```

### Test Payment

1. Use Stripe test card: `4242 4242 4242 4242`
2. Expiry: Any future date
3. CVC: Any 3 digits
4. Verify Arabic checkout interface
5. Complete payment
6. Verify redirect to successUrl

## Database Updates

This function updates the `subscriptions` table:

```sql
-- Creates or updates subscription record
INSERT INTO subscriptions (user_id, stripe_customer_id, tier, status)
VALUES ($1, $2, 'free', 'active')
ON CONFLICT (user_id) DO UPDATE
SET stripe_customer_id = $2;
```

The webhook handler (Story 1.5.3) will update `tier` to 'pro' after successful payment.

## Related Stories

- **Story 1.5.1**: Stripe Account & Product Setup ✓
- **Story 1.5.3**: Stripe Webhook Handler (Next)
- **Story 1.5.6**: Paywall Modal (Uses this function)
- **Story 1.5.7**: Web Checkout Page (Uses this function)

## Troubleshooting

### "Unauthorized" error
- Check user is authenticated
- Verify Authorization header is passed

### "Customer not found"
- Function automatically creates customer
- Check Stripe Dashboard → Customers

### Checkout page not in Arabic
- Verify `locale: 'ar'` is set in session creation
- Check Stripe supports Arabic for your account region

### Price not found
- Verify STRIPE_PRICE_ID_SAR/USD environment variables
- Check price IDs in Stripe Dashboard → Products

## Logs

View function logs in Supabase Dashboard:
1. Go to Functions → create-checkout-session
2. Click "Logs" tab
3. Monitor real-time invocations

## Security Notes

- ✅ Function verifies user authentication via Supabase Auth
- ✅ Uses customer email from authenticated user
- ✅ Metadata includes user_id for webhook processing
- ✅ CORS headers configured for web/mobile access
- ⚠️ Never expose STRIPE_SECRET_KEY to client
- ⚠️ Always verify webhook signatures (Story 1.5.3)
