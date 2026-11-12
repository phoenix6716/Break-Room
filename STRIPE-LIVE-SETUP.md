# Live Stripe setup — 12 November 2026

Continue live configuration under the owner's instruction. If Stripe requests verification or representative action, report the actual request then; do not invent a current blocker. Checkout and game enforcement remain off while setup and live delivery checks are unfinished.

## Current checkpoint

Both secret names have been supplied privately. The account identity check currently gets HTTP 403 `more_permissions_required`. The walkthrough omitted account read access. Edit the restricted key and enable **Read** on the permission resource covering `GET /v1/account`. Keep the resource at Read, leave unrelated permissions and connected-account columns off, and do not bypass the merchant identity check. Recheck readiness before unpausing the webhook. No live signed delivery has been verified yet.

## Private restricted key

In Stripe's live account, open https://dashboard.stripe.com/apikeys and create a restricted key named `Break Room production server`. This must be an `rk_live_` key for account `acct_1UXajXKA3LunX0KL`.

Grant only the permissions used by the server:

- Customers: write (creating the account-bound customer).
- Checkout Sessions: write (creating and reading sessions and line items).
- Customer Portal: write (creating portal sessions; the live configuration is already stored).
- Read access for the own account identity (`GET /v1/account`), Products, Prices, Subscriptions, Invoices, PaymentIntents, Charges, Disputes and Events. Stripe may group some related read permissions in the dashboard; verify the actual request permissions during readiness and authenticated tests.
- No payout, transfer, bank-account, refund-write, tax-registration or connected-account permissions are needed by this integration. Refunds are managed separately by the owner in Stripe.

Copy the key directly into Supabase Edge Function secrets, https://supabase.com/dashboard/project/quhyzwivpdznmffmwhcr/functions/secrets, under `STRIPE_LIVE_RESTRICTED_KEY`. Do not paste it into chat, terminal history, source files or screenshots. The connected plugin cannot issue this key for the server.

## Live webhook

Destination: `we_1UakZCKA3LunX0KLJrOq3yr9`, currently **disabled**.

URL: `https://quhyzwivpdznmffmwhcr.supabase.co/functions/v1/billing-live-webhook`

The destination uses API version `2025-02-24.acacia`, matching the existing reconciler, and only its twelve handled checkout, subscription, invoice, refund and dispute events. Do not upgrade it independently of the reconciler's tested invoice/subscription shape.

In Stripe Workbench → Webhooks, open this destination and copy its signing secret directly into the same Supabase secret settings under `STRIPE_LIVE_WEBHOOK_SECRET`. Do not reuse the sandbox signing secret. Enable the destination after both live secrets have been installed, then verify a genuine signed Stripe delivery. No successful live delivery has been claimed yet.

## Portal

Live portal: `bpc_1UakY9KA3LunX0KLKco9zP6g`. Stored in `br_billing.live_settings` as `portal_config` through the existing server RPC. It allows billing history, payment-method updates and cancellation at the end of the paid period. Customer-profile edits and subscription plan changes are off. Policy links and the return URL use `breakroomdaily.com`.

## Checks before payments are activated

Readiness must verify the expected Stripe account, live monthly price and private database RPC. With both secrets installed, the live endpoint may report `configured:true` while `checkout_enabled`, `enforcement_enabled` and `live_payments` remain false. That is the intended setup state, not a paid-launch claim.

Verify signed live event processing, correct account binding, the portal configuration, and a reviewed access-delivery plan before deliberately changing checkout/enforcement flags. The existing 100-session/account verification bound must be addressed before production scale. No test record grants live access. Preserve native saves, timers, scoring, public IDs and visibility choices.

Published seller: Phoenix Phillips. Future plan prices: A$4.99/month or A$7.99/game once. Refund requests are reasoned and case by case with statutory consumer remedies preserved. The owner is not registered for Australian GST; collection stays off and no tax registration is added.
