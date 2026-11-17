# Existing live Stripe configuration

Updated 17 November 2026. Live checkout/enforcement and the signed webhook are enabled. The former own-account read-permission error was fixed; private live secrets are already installed. Do not pause working payments or create duplicate objects merely to move ChatGPT accounts.

Historical creation walkthrough and provider references: [STRIPE-LIVE-SETUP-HISTORY.md](STRIPE-LIVE-SETUP-HISTORY.md). Current product terms: [PAYMENTS.md](PAYMENTS.md).

## Existing configuration

- Account: `acct_1UXajXKA3LunX0KL` (Break Room live account; sandbox is separate).
- Approved prices: `supabase/billing-live-prices.json`, matching `_shared/live-catalog.json`. Never substitute old sandbox price IDs.
- Runtime: `supabase/functions/_shared/billing-runtime-factory.ts`; Stripe API `2025-02-24.acacia`. Do not upgrade the webhook/runtime independently.
- `billing-live`: official Auth user verification, allowlisted Checkout, status and Customer Portal.
- `billing-live-webhook`: verifies raw Stripe signatures, durably records minimal event references, and reconciles authoritative provider state before marking processed.
- Live webhook URL: `https://quhyzwivpdznmffmwhcr.supabase.co/functions/v1/billing-live-webhook`; existing destination `we_1UakZCKA3LunX0KLJrOq3yr9` with its twelve handled event subscriptions.
- Existing portal `bpc_1UakY9KA3LunX0KLKco9zP6g` is stored under private live settings. Billing history, payment-method updates and period-end cancellation are configured.
- Environment variable names only: `STRIPE_LIVE_RESTRICTED_KEY`, `STRIPE_LIVE_WEBHOOK_SECRET`. Their values stay in Supabase secrets, never source, a transfer ZIP or chat. Standard Supabase runtime secrets also remain private.

## Operational checks when needed

A health GET to `/functions/v1/billing-live` checks provider/storage readiness; it does not prove a customer paid. POST operations require a real authenticated account. Unsigned webhook requests must fail. Keep the existing merchant-account verification and least-privilege restricted key. If a provider error actually occurs, inspect safe status/code diagnostics and address its current requirement rather than bypassing checks.

Native scores/saves and history never grant paid access. Verify duplicate/out-of-order webhooks, renewal/expiry, cancellation, refunds/disputes and actor fencing with appropriate isolated checks when changing billing code. Deploy affected live functions with matching shared dependencies. The current content activation additionally records only a verified positive live monthly invoice; persistence failure must remain retryable.

No new tax registration, merchant identity, representative workflow, refund policy or paid service is authorized by this account handover. The owner’s existing instruction is to address actual provider verification requests if they arise. GST collection remains off. No fake live payment is needed for a documentation update.
