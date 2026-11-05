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
