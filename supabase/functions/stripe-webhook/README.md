# Stripe Webhook Handler Edge Function

## Overview

This Supabase Edge Function handles webhook events from Stripe for subscription lifecycle management. It verifies webhook signatures and processes payment events to keep subscription data in sync.

## Features

- ✅ Secure webhook signature verification
- ✅ Handle checkout session completion
- ✅ Manage subscription lifecycle (create, update, delete)
- ✅ Record payment history
- ✅ Auto-downgrade on subscription cancellation
- ✅ Payment failure handling

## Events Handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Upgrade user to Pro tier |
| `customer.subscription.created` | Create subscription record |
| `customer.subscription.updated` | Update subscription details |
| `customer.subscription.deleted` | Downgrade to Free tier |
| `invoice.payment_succeeded` | Record successful payment |
| `invoice.payment_failed` | Record failed payment |

## Prerequisites

- Stripe account configured (Story 1.5.1)
- Database schema with subscriptions and payment_history tables (Story 0.3)
- Webhook secret from Stripe Dashboard

## Environment Variables

Set these in your Supabase project:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Deployment

### Using Supabase CLI

```bash
# Deploy the function
supabase functions deploy stripe-webhook

# Set environment variables
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

### Using Supabase Dashboard

1. Go to Functions → Create new function
2. Name: `stripe-webhook`
3. Copy contents of `index.ts`
4. Deploy
5. Copy the function URL: `https://xxx.supabase.co/functions/v1/stripe-webhook`

## Configure Stripe Webhook

### Development (Local Testing)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhooks to local function:
   ```bash
   stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
   ```
3. Copy webhook signing secret (starts with `whsec_`)
4. Add to environment variables

### Production

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter endpoint URL:
   ```
   https://your-project.supabase.co/functions/v1/stripe-webhook
   ```
4. Select events to send:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Supabase secrets:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Database Updates

### checkout.session.completed

Updates `subscriptions` table:

```sql
UPDATE subscriptions
SET tier = 'pro',
    status = 'active',
    stripe_subscription_id = $1,
    current_period_start = NOW(),
    current_period_end = NOW() + INTERVAL '30 days',
    cancel_at_period_end = false,
    updated_at = NOW()
WHERE user_id = $2;
```

### customer.subscription.updated

Updates subscription details:

```sql
UPDATE subscriptions
SET status = $1,
    stripe_price_id = $2,
    current_period_start = $3,
    current_period_end = $4,
    cancel_at_period_end = $5,
    updated_at = NOW()
WHERE user_id = $6;
```

### customer.subscription.deleted

Downgrades to Free tier:

```sql
UPDATE subscriptions
SET tier = 'free',
    status = 'cancelled',
    stripe_subscription_id = NULL,
    current_period_start = NULL,
    current_period_end = NULL,
    cancel_at_period_end = false,
    updated_at = NOW()
WHERE user_id = $1;
```

### invoice.payment_succeeded / invoice.payment_failed

Records payment in history:

```sql
INSERT INTO payment_history (
  user_id,
  amount,
  currency,
  status,
  stripe_payment_intent_id,
  stripe_invoice_id,
  description,
  receipt_url,
  created_at
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW());
```

## Testing

### Test Webhook Locally

```bash
# Forward webhooks from Stripe CLI
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
```

### Test End-to-End

1. Create checkout session (Story 1.5.2)
2. Complete payment with test card: `4242 4242 4242 4242`
3. Verify webhook received:
   - Check Supabase function logs
   - Verify subscription updated in database
   - Confirm user upgraded to Pro

### Monitor Webhooks

**Supabase Logs:**
1. Go to Functions → stripe-webhook → Logs
2. Monitor webhook events in real-time

**Stripe Dashboard:**
1. Go to Developers → Webhooks → Your endpoint
2. View event history
3. Retry failed events

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Signature verification failed | Invalid webhook secret | Verify STRIPE_WEBHOOK_SECRET matches Stripe Dashboard |
| No user_id in metadata | Checkout session missing metadata | Ensure metadata set in create-checkout-session |
| Subscription not found | User deleted or data inconsistency | Check subscriptions table |
| Database error | Invalid schema or permissions | Verify database schema matches Story 0.3 |

## Security

- ✅ **Signature Verification**: All webhook requests verified using Stripe signature
- ✅ **Service Role Key**: Uses Supabase service role for database writes
- ✅ **Metadata Validation**: Checks user_id exists before processing
- ✅ **Error Logging**: Logs errors without exposing sensitive data

## Flow Diagram

```
Stripe Payment Event
         ↓
Stripe sends webhook to edge function
         ↓
Verify webhook signature
         ↓
Parse event type
         ↓
Process event (update database)
         ↓
Record payment history
         ↓
(Future) Send email notification (Story 5.9)
         ↓
Return 200 OK
```

## Webhook Event Examples

### checkout.session.completed

```json
{
  "id": "evt_...",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "customer": "cus_...",
      "subscription": "sub_...",
      "metadata": {
        "user_id": "uuid-here",
        "tier": "pro"
      }
    }
  }
}
```

### customer.subscription.updated

```json
{
  "id": "evt_...",
  "type": "customer.subscription.updated",
  "data": {
    "object": {
      "id": "sub_...",
      "status": "active",
      "current_period_start": 1234567890,
      "current_period_end": 1234567890,
      "cancel_at_period_end": false,
      "metadata": {
        "user_id": "uuid-here"
      }
    }
  }
}
```

## Future Enhancements (Story 5.9)

- [ ] Send welcome email on upgrade (Arabic)
- [ ] Send payment receipt email (Arabic)
- [ ] Send payment failure notification (Arabic)
- [ ] Send cancellation confirmation (Arabic)
- [ ] Trigger Supabase Realtime event for instant UI updates

## Related Stories

- **Story 1.5.1**: Stripe Account & Product Setup ✓
- **Story 1.5.2**: Stripe Checkout Edge Function ✓
- **Story 1.5.3**: Stripe Webhook Handler (Current) ✓
- **Story 5.9**: Arabic Email Templates (Future)

## Troubleshooting

### Webhook not receiving events

1. Check endpoint URL is correct in Stripe Dashboard
2. Verify function is deployed and accessible
3. Check Stripe Dashboard → Webhooks → Event logs for delivery attempts

### Signature verification fails

1. Verify STRIPE_WEBHOOK_SECRET is correct
2. Check secret matches endpoint in Stripe Dashboard
3. Ensure raw request body is used (not parsed JSON)

### Subscription not updating

1. Check Supabase function logs for errors
2. Verify database schema matches expectations
3. Ensure user_id exists in auth.users table
4. Check RLS policies allow service role to update

### Payment history not recorded

1. Verify payment_history table exists
2. Check table schema matches Story 0.3
3. Review function logs for database errors

## Support

For webhook issues, check:
- [Stripe Webhook Documentation](https://stripe.com/docs/webhooks)
- [Stripe Event Types](https://stripe.com/docs/api/events/types)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
