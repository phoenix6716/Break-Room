## Live configuration continued — 12 November 2026

Owner instruction: continue configuration; address representative setup only if Stripe requests action. This supersedes earlier blanket representative blockers. Seller name confirmed: Phoenix Phillips. Published future purchase, cancellation and refund terms; current free-development status remains explicit. No ABN was supplied or invented; GST collection remains off.

Created and verified live portal `bpc_1UakY9KA3LunX0KLKco9zP6g`, with invoice history, payment-method updates, period-end cancellation and the site's policy/return URLs. Stored the ID through the existing private live settings RPC. Created live webhook `we_1UakZCKA3LunX0KLJrOq3yr9`, with exactly the twelve existing handled events and pinned API version 2025-02-24.acacia. It is disabled until both private server secrets are installed. No real customer, checkout, charge or subscription was created. Credential setup and signed live delivery remain unfinished; the live services and all ten games remain in their prelaunch state. Next owner step: create a restricted live key in Stripe, then save it directly in Supabase Edge Function secrets; never paste it into chat. See `STRIPE-LIVE-SETUP.md`.

## Website purchase integration prepared — 11 November 2026

Account now includes membership status, paid-through/cancellation information, owned-game links, Refresh purchases and Manage billing. Normal browsing retains the free-development notice and does not auto-request unavailable live billing. The explicit `account.html?billing_preview=sandbox#purchases` preview reads only the signed-in player's test records and labels all test purchases. Actor changes discard pending replies and clear displayed ownership; failures do not fabricate Free/Owned states or permit redirects to arbitrary URLs.

The ten native Unlimited/Infinite mode entry points have a shared synchronous prelaunch guard. Enforcement is fixed off in shipped source, so existing Daily/Unlimited behaviour, native saves and running timer logic remain unchanged. Future enabled mode-entry checks require fresh server-verified live ownership; test records, return queries and local purchase flags cannot grant it. Static client-side engine code remains public; these controls are not a tamper-proof paid-content boundary. Do not enable them without a separately reviewed launch and access-delivery plan.

Installed additive live billing tables/RPCs and deployed `billing-live` plus `billing-live-webhook`, using separate restricted-key/signing-secret names, expected account ID, live catalogue and strict provider-mode checks. Current live GET readiness returns configured=false, checkout_enabled=false, enforcement_enabled=false and live_payments=false. No live key, Stripe event destination, customer, Checkout session, charge or tax registration was created. The live webhook returns retryable setup-incomplete while no signing secret is configured. Sandbox service remains configured and functional. Private live RPCs are denied to anon/authenticated; live table counts are zero and existing sandbox sessions remain intact.

Verification: the payment/membership unit checks, official-SDK account checks, all ten native game/browser suites, save/privacy/recovery/social checks and build validation passed locally. Legacy test fixtures were brought up to the already-deployed challenge validators; an outdated account-client cache assertion was updated. No production puzzle/scoring validator was changed.

Activation still needs account eligibility/representative confirmation, final seller/terms publication, private live credentials and a live webhook configured and verified. Live checkout and enforcement currently require deliberate reviewed source changes as well as credentials. The inherited 100-session/account sandbox verification bound remains documented and must be reviewed for production scale. The owner reports no Australian GST registration; no GST collection has been configured. Refund policy remains the agreed reasoned case-by-case policy with statutory remedies preserved.

## Live catalogue preparation — 11 November 2026

The owner rejected an automatic seven-day refund window and selected case-by-case requests supported by a reason. `PURCHASE-TERMS-DRAFT.md` now reflects that choice, with examples of billing/access/service issues and statutory remedies preserved. The draft remains unpublished on the customer-facing site.

The connected Stripe plugin verified the existing live Break Room catalogue: one active AUD 499-cent monthly price and ten active AUD 799-cent one-time prices, all with inclusive price tax behaviour. `supabase/billing-live-prices.json` records only public catalogue/account identifiers and approved amounts; `checkout_enabled` remains false. This reference is not imported into the sandbox runtime and is excluded from the public site build. No live Checkout session, charge, registration, webhook or access restriction was created.

Stripe Tax settings return active, but the live account has no recorded tax registrations. The owner confirmed they are not registered for Australian GST. No GST collection is configured, and no tax registration should be added without the owner confirming an actual registration. This statement does not determine whether registration is legally required in any jurisdiction. No registration was added and automatic tax was not enabled. Price tax behaviour alone does not configure tax collection. Final refund/purchase terms, separate live-mode billing storage/configuration and confirmation of the applicable adult-representative requirement remain launch dependencies.

The owner also confirmed simulated cancellation expiry; database readback showed monthly access inactive and the signed subscription-deleted event processed. This supersedes the pending-expiry note below. Failed renewal still has automated coverage rather than a completed manual provider test.

## Owner sandbox checks and simulation preparation — 11 November 2026

Owner-confirmed and database-verified: hosted monthly payment, cancellation of renewal with remaining paid access, one-time Laser payment, same-account visibility across devices, and full Laser refund. Signed events were processed; the refund made Laser inactive while monthly access remained active with renewal canceled. These results supersede earlier pending-owner-test notes below. Live payments remain disabled.

Stripe's current Dashboard exposes **Run simulation** on the existing test subscription. The backend now evaluates clock-attached sandbox subscriptions using the provider's verified test-clock `frozen_time`, including the exact expiry boundary; it returns a retryable error while the clock advances. Browser-supplied time is never accepted. Regression coverage checks access before/at simulated expiry, advancing-clock failure, live-clock rejection and preservation of separate game ownership. Actual provider-simulated expiry and failed renewal remain pending until the owner advances the sandbox simulation.

## Standard sandbox Checkout compatibility fix — 9 November 2026

The first owner checkout failed because Stripe has Managed Payments enabled by default on this account. Stripe rejected the explicit `payment_method_types` parameter. The sandbox now explicitly sends `managed_payments[enabled]=false` per session and leaves payment-method selection to Stripe, matching the existing standard Checkout/Customer Portal design. The account-wide default is unchanged. This is not a live merchant-of-record or tax decision; those remain launch requirements.

Verified against Stripe using the exact shared request builder: both Laser (payment, AUD 799 cents) and monthly (subscription, AUD 499 cents) returned HTTP 200, `livemode=false`. Both diagnostic sessions were immediately expired without payment details. The temporary token-protected diagnostic branch was removed from the deployed function. Regression coverage checks the explicit standard-flow parameter. Server diagnostics record only resource/method/status, safe machine codes and request IDs; raw Stripe messages, authorization values, payloads and customer IDs are not logged. The owner still needs to complete a hosted test-card purchase to verify payment delivery end to end.

## Sandbox checkout implementation — 9 November 2026

The unlisted test page is `https://breakroomdaily.com/billing-test`. It shares the existing account session using the official Auth SDK and does not load save-sync code or touch native saves. The `billing` function verifies Auth accounts, permits only the eleven approved prices, creates/reuses account-bound hosted test Checkouts and opens a restricted Customer Portal for cancellation, payment methods and invoices. Customer mappings, checkout receipts and verified access snapshots are private and server-only. `STRIPE_SECRET_KEY` must be a test key, and `STRIPE_WEBHOOK_SECRET` must be set. Return URLs never grant purchases.

The signed webhook now reconciles against freshly retrieved Stripe sessions/payments/subscriptions/refunds/disputes. Notifications are marked processed only after successful reconciliation; failures return 503 for Stripe retries. Per-customer expiring leases prevent older concurrent snapshots overwriting newer ones, and duplicate event IDs are harmless. Status reads also reconcile current provider state, recovering missed deliveries without trusting a browser receipt. A monthly subscription needs its paid latest invoice and unexpired paid period; individual purchases remain separate after subscription expiry. Full refunds and open/lost disputes suspend the affected purchase; partial refunds retain access and won disputes restore access. Historical invoices are not used to fabricate a paid latest period. No real access gate consumes these sandbox snapshots.

Verified deployed API: GET readiness returned 200 after a real Stripe monthly-price read using the pinned API version and a private RPC probe; unauthenticated checkout returned 401 and an unsigned webhook returned 400. Both Edge entry points bundled, local PostgreSQL tests passed, and the phone/desktop dark-theme browser checks passed. A real hosted sandbox purchase and signed Stripe delivery still require the owner's test-card journey. No live payment, live entitlements or access restrictions have been enabled. The sandbox is deliberately bounded to 100 sessions per account and ten pages per provider list; exceeding a bound returns an error rather than discarding history.

Pending owner test: sign into Break Room, open the test page, buy Laser with Stripe's `4242 4242 4242 4242` test card (any future expiry/three-digit CVC), then verify the purchase and a processed event. Test monthly checkout/cancellation, refund/dispute handling in Stripe and same-account access from another device before progressing to live launch. Public pricing buttons remain disabled and all games remain free.

## Sandbox webhook preparation — 9 November 2026

The deployed `billing-catalog` function verified all eleven Stripe sandbox prices using the server-stored `STRIPE_SECRET_KEY`. The deployed endpoint is:

`https://quhyzwivpdznmffmwhcr.supabase.co/functions/v1/billing-webhook`

It verifies Stripe raw-body HMAC signatures with a five-minute tolerance, rejects live events, and stores only event ID/type/object ID/creation time in a private, RLS-protected inbox. Only the service role can call its insert RPC. Repeated IDs are harmless. Persistence failures return 503 so Stripe retries. Historical initial state: before the owner added `STRIPE_WEBHOOK_SECRET`, the endpoint returned 503 and only queued notifications. The implementation above supersedes that preparation state.

In the Stripe sandbox create an event destination for this account using the URL above and these events:

- `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
- `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
- `invoice.paid`, `invoice.payment_failed`
- `charge.refunded`, `charge.dispute.created`, `charge.dispute.updated`, `charge.dispute.closed`

Save its signing secret privately as Supabase Edge Function secret `STRIPE_WEBHOOK_SECRET`; never paste it into chat or commit it. Then verify a real signed sandbox delivery and build authenticated Checkout/Portal and provider-reconciled entitlements before testing paid access.

Focused verification: `tests/billing-webhook.cjs` covers HMAC, timestamps, live rejection, retry semantics, minimal data, restricted SQL roles and duplicate events in PostgreSQL. Build/static checks passed. Security advisors report the intended no-client-policy private inbox (deny by default), plus existing unrelated findings; no new SECURITY DEFINER RPC is introduced.

## Stripe sandbox identifiers — owner supplied, 9 November 2026

- Break Room Monthly product: `prod_Vb1SHpsRqQ9vzJ`.
- Monthly price: `price_1UZpPJGapFJk1jyWKUntRCZV` (intended AUD 4.99/month).
- Laser — Unlimited price: `price_1UZpTcGapFJk1jyWhloJvRqJ` (intended AUD 7.99 once).
- All ten one-time game prices are now owner-supplied in `supabase/billing-sandbox-prices.json`, including Desk Jam (`shift-work`) and Time Sense (`inner-clock`). The server-side catalogue check verified all eleven prices against Stripe on 9 November 2026.
- These are sandbox-only identifiers supplied through the setup walkthrough. The stored sandbox key successfully read every approved active AUD price, including the monthly interval and expected product. No live purchases or paid access are enabled.

## Setup progress — 9 November 2026

The owner registered `breakroomdaily.com` and connected Cloudflare hosting; production HTTPS and clean page URLs were verified. Resend SMTP is configured for Supabase account emails, and the owner confirmed password recovery works across laptop and phone after the recovery fix. Incoming `support@breakroomdaily.com` mail forwards through Cloudflare Email Routing to the owner's verified destination inbox; the owner confirmed a test arrived (initially in spam). This is forwarding rather than a separate outbound mailbox. The support address is published on Contact, Privacy and Terms. Stripe checkout, entitlements and paid access remain pending. Historical preparation notes follow.

# Paid launch preparation — 5 November 2026

The owner selected a paid launch, Stripe and a custom domain. The existing approved model remains A$4.99 AUD/month for all current/future Unlimited games, or A$7.99 AUD once for one game's Unlimited plus permanent site-wide ad removal. The owner has a Stripe account. No live checkout, charges, advertising or access restriction has been enabled.

## Current state

The ten-game development site is live at https://phoenix6716.github.io/Break-Room/. Codebreak publication and mobile/desktop guest journeys were confirmed in [run 41929235441](https://github.com/phoenix6716/Break-Room/actions/runs/41929235441). Sleeper remains shelved and its existing cloud save fingerprint was unchanged. Cloud/database integration tests are distinct from live email delivery and real paid transactions.

Website preparation was published in [run 41939500323](https://github.com/phoenix6716/Break-Room/actions/runs/41939500323) and independently verified on the live site at 390px and 1440px, including a real deep 404 response, loaded assets, recovery navigation and unchanged browser storage. The build now generates canonical links, search descriptions, per-game sharing previews and a 15-page `sitemap.xml` from `game-config.js`. Authentication, account, private social, launcher, iframe and retired routes are marked `noindex`; this is search guidance, not access control. The custom `404.html` resolves assets/home links correctly even at deep missing URLs. `SITE_URL` controls public URLs; it stays on the current address until a new host/domain is verified. No unknown domain is claimed or published.

## Host and domain

[GitHub Pages usage limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) exclude primarily commercial transaction/SaaS hosting. Keep GitHub for source and checks; move the paid site to a suitable commercial host before enabling checkout. Cloudflare Workers Static Assets is the proposed destination, with Supabase retained for accounts/database and a server-side Stripe integration. Cloudflare describes [static asset requests/storage as free](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/); Worker execution and other services have separate limits/pricing. No new paid hosting plan is authorised or purchased by this preparation.

`wrangler.json` prepares the existing `dist/` artifact for static-only hosting. It keeps explicit `.html` URLs and returns the custom 404 instead of an SPA fallback. It contains no domain, account token, worker code, database or payment key. This file does not deploy anything. Wrangler 4.157.0 validated this configuration with `deploy --dry-run` on 5 November; it exited without uploading. Actual routing, domain ownership and production hosting are not established by a dry-run.

Deploy from an authenticated owner environment after the destination has been selected:

```sh
# Set SITE_URL to the verified HTTPS destination for this build.
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm run check
npm exec --yes --package=wrangler@4.157.0 -- wrangler deploy --dry-run
# Actual publication only after account/domain setup and the required checks:
npm exec --yes --package=wrangler@4.157.0 -- wrangler deploy
```

Domain shortlist checked against the .com registry on 5 November: `breakroomplay.com` and `breakroompuzzles.com` had no registration record. That does not reserve a name or establish registrar availability, renewal price or trademark clearance. `playbreakroom.com` and `dailybreakroom.com` were registered. The owner has not yet selected or purchased a domain. A private support mailbox/forwarder must actually be configured and delivery tested before publishing `support@<domain>` as a contact route. “Break Room” can remain the public product label; the seller's actual details belong in Stripe and the final purchase policies.

## Preserve progress during the move

A different domain is a different browser-storage origin. It cannot automatically read the existing GitHub-origin guest saves or sessions. Keep the old development address accessible during the transition; do not attach the new domain to GitHub Pages or add an automatic redirect that strands unsynced guest progress. Existing account saves stay in the same Supabase project. Test cloud restore at the new origin before routing players there. Native backup download exists, but cross-origin backup import is not currently implemented; do not advertise an import flow.

Add the new exact account and password-reset callback URLs in Supabase, keeping old callbacks for existing links. Configure verified-domain SMTP and test real confirmation/reset emails. PKCE email links need the browser that initiated the request. Do not copy auth tokens into migration links or URL queries. Update `SITE_URL`, sharing metadata, payment return URLs and mail links together after ownership/HTTPS are confirmed.

## Stripe work still required

Connect the owner's Stripe account through the suggested Stripe integration; no connection has been confirmed yet. Do not paste secret keys in chat or commit them. Start with a test environment. Create one recurring AUD price and an allowlisted one-time price for each launch game; verify amounts, tax treatment, merchant identity, receipt/support details and cancellation/refund terms before live activation.

Implement authenticated hosted Checkout and Customer Portal, a private customer/account mapping, server-owned entitlements and signed idempotent webhooks. Browser flags, email alone and checkout-return parameters must never grant ownership. Handle out-of-order events by reconciling current provider state. Cancellation keeps paid-through access; valid permanent purchases survive subscription expiry. Reconcile full refunds and dispute outcomes without changing native saves or game scores. Loading/offline billing state must not fabricate ownership.

Exercise purchase, renewal, failed payment, period-end cancellation, refunds/disputes, duplicate events, account switching, cross-device restoration and data deletion in test mode. Then verify actual live configuration and receipts before enabling payment buttons or gating new Unlimited sessions. Preserve captured play. No advertising provider is selected; no advertising claim should imply ads have been installed.

## Remaining owner/service setup

1. Select and register the domain; confirm ownership and renewal price at a registrar.
2. Connect Stripe; arrange Cloudflare account access or the chosen alternative host.
3. Configure a working private support email and the seller details needed for receipts/policies.
4. Supply server secrets through the hosting/Supabase secret settings, not public files.
5. Complete real mail, cross-device paid-flow and real-phone playtests. Automated Chromium checks do not establish iOS/Safari or human difficulty evidence.

The current free development site remains available while these launch dependencies are completed. Paid launch readiness must not be inferred from a green static-site deployment.
