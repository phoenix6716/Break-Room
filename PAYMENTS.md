# Approved payment model

Owner-approved on 28 October 2026. Currency: AUD.

| Product | Customer price | Access | Advertising |
| --- | --- | --- | --- |
| Free | A$0 | Daily games | Ad-supported when ads are introduced |
| Break Room monthly | A$4.99/month | Unlimited in all current and future games while paid access remains active | Ad-free while paid access remains active |
| Individual game | A$7.99 once | Permanent Unlimited for the purchased game | Permanent site-wide ad removal |

Purchases belong to the signed-in account and work across devices. A purchased game and its site-wide ad removal survive subscription cancellation or expiry. Subscription cancellation stops renewal; access continues through the paid period. Reversed purchases must be reconciled with the remaining valid entitlements.

## Implementation status and next steps

Pricing and product scope are approved. No checkout, payment provider integration, entitlement service or advertising service is enabled yet. Unlimited remains free during development until the purchase flow is implemented and verified.

Recommended provider: Stripe Checkout and Customer Portal, with server-verified payment events and account-owned entitlements in Supabase. Provider selection and account availability still need to be established. Never grant access based only on a browser flag or checkout return URL.

Before live payments: configure test-mode products/prices, implement authenticated checkout and billing management, verify signed payment events and duplicate-event handling, test purchase/renewal/cancellation/failure/refund flows and cross-device access, and align the public purchase terms and privacy information. Show the full customer price; determine applicable tax configuration before activation. Do not collect real payments or introduce ads merely from approval of this pricing model.

## Website preparation delivered

`pricing.html` presents the approved plans, all ten individual games and the differences in access/ad removal. Account links to the plans and explains the current free-development state. Checkout buttons are disabled native controls; no card form, payment request, provider SDK, client-side unlock or fake purchase history exists. Daily and Unlimited remain available. Public policy copy continues to describe the currently free, ad-free service accurately.

## Provider integration contract

The future server must authenticate the account, allowlist product IDs and prices, create hosted checkout sessions, and bind the provider customer to that account. Never trust client-submitted amounts or an email alone. Validate webhook signatures, deduplicate event IDs, reconcile out-of-order events against provider state, and record subscription paid-through dates and individual non-reversed game purchases separately. Derive ad-free access from either an active subscription or at least one valid game purchase. Never overwrite native game saves when changing access.

Purchase status must come from a server-owned entitlement read. Loading or unavailable billing data must not display a fabricated 'Free' or 'Owned' status. Checkout return pages should show verification pending until server confirmation; cancellation must not imply a charge. Provide an authenticated billing portal for cancellation and payment-method management. Test duplicate delivery, failed renewal, cancellation at period end, refunds, disputes, account switching and cross-device restoration before gating games.

Still pending: choose an eligible provider/merchant arrangement, create and verify the server integration and entitlement storage, connect hosted checkout and billing management, decide refund/tax configuration and update purchase policies. Advertising provider selection and consent requirements are also separate; no ads have been added. Live billing remains disabled until those pieces work together.
