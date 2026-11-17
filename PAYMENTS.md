# Live payment model

Updated 17 November 2026. Currency: AUD. Supersedes the old preparation-only account in [PAYMENTS-HISTORY.md](PAYMENTS-HISTORY.md).

| Product | Price | Access | Ad entitlement |
| --- | --- | --- | --- |
| Daily | Free | All current Daily games | Ads may be introduced later; none are installed now |
| Monthly | A$4.99/month | Unlimited across current/future games while paid access is active | Ad-free while active |
| Individual game | A$7.99 once | Permanent Unlimited for that game | Permanent site-wide ad removal |

Purchases belong to the signed-in account across devices. Cancellation stops renewal, with access through the paid period; separately purchased games survive subscription expiry. Refund requests are reasoned and case by case with statutory remedies preserved. GST collection stays off under the owner’s stated non-registration.

## Implemented

Public plans, all eleven checkout choices, Account purchase status, Stripe-hosted Checkout/Customer Portal, signed live webhook reconciliation and verified-live Unlimited guards are enabled. Sandbox stays separate; the owner tested sandbox purchase/cancellation and game ownership. No fabricated real charge or blanket proof of real receipt delivery is asserted.

`billing-live` and `billing-live-webhook` use the existing restricted live key and signing secret privately installed in Supabase. The shared runtime pins `2025-02-24.acacia`. Preserve the merchant binding, allowlisted catalogue, official Auth identity, raw webhook signature verification, event deduplication and provider-state reconciliation. Neither browser flags nor success URLs grant ownership. Prices are defined by the verified live catalogue, not browser amounts.

`br_billing` is private with service-only invoker RPCs. Preserve lease/actor fencing, paid-through dates, refund/dispute handling and native gameplay state. Reconciliation retains a 100-session/account fail-closed bound; revisit for scale rather than silently lifting it.

## Unlimited and content

Up to 100 unseen challenges per game per Sydney week come from the current library, with smaller eligible pools possible and unlimited labelled replays. Account-wide history and a shared weekly selection are deployed. No visible remaining counter is needed during normal play; limits remain disclosed before purchase.

The first verified positive paid LIVE MONTHLY invoice idempotently activates the private content programme. An individual purchase, sandbox, trial, pending checkout or zero invoice does not. This is an inventory-review trigger, not automatic authorship. Review unseen reserves and top up when needed; there is no fixed 400-new-questions-per-month commitment.

Read [STRIPE-LIVE-SETUP.md](STRIPE-LIVE-SETUP.md), [CURRENT-STATUS.md](CURRENT-STATUS.md), [UNLIMITED-POOLS.md](UNLIMITED-POOLS.md) and the published [purchase terms](https://breakroomdaily.com/terms). Do not infer current subscribers, completed charges or activation state from old audit counts.
