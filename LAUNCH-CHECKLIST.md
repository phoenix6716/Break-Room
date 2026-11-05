# Paid launch checklist — 5 November 2026

The owner selected paid launch, Stripe and a custom domain. This is the current checklist; Git history retains earlier audit checklists. Read [PAID-LAUNCH.md](PAID-LAUNCH.md) for implementation details, current evidence and the domain transition. Checked means the stated evidence exists, not that the entire paid service is ready.

## Confirmed foundation

- [x] Ten public games: Laser, Time Drop, Clue Ladder, Seating Chart, Desk Jam, Codebreak, Stack Up, Pack, Lowball and Time Sense.
- [x] Sleeper and previously retired games stay hidden; their native/cloud history is retained.
- [x] Codebreak production database, owner-only access and unchanged pre-existing save fingerprint verified.
- [x] Codebreak published and live mobile/desktop guest journeys confirmed in [run 41929235441](https://github.com/phoenix6716/Break-Room/actions/runs/41929235441).
- [x] Current selector coverage: all ten games checked; Codebreak has a 1,296-day cycle. Other games' individual counts and recurrence remain documented in [DAILY-CONTENT.md](DAILY-CONTENT.md).
- [x] Existing approved pricing retained: A$4.99/month, A$7.99/game. No live payments or ads have been activated.
- [x] Owner selected Stripe and confirmed an existing account.

## Website preparation

- [x] Build-generated canonical/search/share metadata follows `SITE_URL` and the actual ten-game roster.
- [x] Sitemap includes the 15 public landing/policy pages; private account/social, callback, iframe and retired routes are excluded and marked noindex.
- [x] Custom 404 screen has a configured base URL for deep missing links and does not modify stored progress.
- [x] Project-path and custom-domain metadata tests pass; legal/navigation/mobile checks pass locally.
- [x] Proposed Cloudflare static configuration passes Wrangler 4.157.0 dry-run; no upload occurred.
- [ ] Publish this preparation and verify actual sitemap, metadata and deep 404 on the live development host. A source commit alone is not live verification.

## Domain and commercial hosting

- [ ] Owner chooses/registers a domain; verify ownership, price/renewals and HTTPS. Shortlist: breakroomplay.com or breakroompuzzles.com; registry lookups do not reserve them.
- [ ] Arrange access to Cloudflare or another suitable commercial host. GitHub Pages remains development-only; [its usage limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) exclude primarily commercial transaction/SaaS hosting.
- [ ] Deploy and verify the new host without changing access to the old origin.
- [ ] Test account/cloud restore on the new origin. Preserve old-origin guest access; do not silently redirect away from unsynced browser saves. Backup download exists; a cross-origin import feature does not.
- [ ] Update `SITE_URL`, canonical/share URLs, account/recovery callbacks and payment return URLs together after the domain is verified.
- [ ] Confirm final HTTPS nested routes, missing-page status, asset loads, clipboard links and mobile/desktop screenshots.

## Accounts, mail and support

- [ ] Configure a real private support address and publish the correct operator/seller contact details. No mailbox is currently verified.
- [ ] Configure verified-domain production SMTP; test real confirmation and recovery delivery to unrelated addresses, expired links and spam-folder behaviour.
- [ ] Verify live Supabase Site URL and exact redirect allowlists for the new domain, retaining needed old callbacks.
- [ ] Observe two real accounts/browsers: partial Daily upload/restore, offline retry, conflicts, logout guest recovery and cross-account isolation. Mocked SDK/SQL checks are not live-account evidence.
- [ ] Observe real friend/league sharing, blocks and permissions; private results must never expose raw guesses or emails.
- [ ] Verify private access/export/correction/deletion support, retention, backup/recovery procedures and incident ownership.

## Payments — required before taking money

- [ ] Connect the owner's Stripe account; never paste/commit secret keys.
- [ ] Complete seller verification, receipt/support details, tax treatment and cancellation/refund terms. Do not invent operator details or tax obligations.
- [ ] Create test-mode AUD products/prices and an allowlisted account-bound Checkout flow.
- [ ] Implement Customer Portal and private server-owned entitlements; return URLs and browser flags never unlock purchases.
- [ ] Verify signed, idempotent payment events; reconcile out-of-order events, renewal failure, cancellation, refunds and disputes.
- [ ] Retain valid permanent purchases after subscription expiry; keep paid-through subscription access after renewal cancellation.
- [ ] Test account switching, cross-device access, pending/offline billing and first-completion/native-save continuity before gating new Unlimited play.
- [ ] Verify live configuration and receipt delivery; then enable checkout and accurate purchase controls/policies. Free development remains available until this works.
- [ ] Keep advertising absent unless separately implemented and disclosed; do not present planned ad benefits as installed advertising.

## Release quality and operations

- [ ] Recheck volatile Lowball reference prices and factual content near release; retain dated-reference scopes.
- [ ] Review asset/font/component licences, game names and purchase-policy accuracy.
- [ ] Observe first-time players and real iPhone/Safari and Android/Chrome, including keyboard, screen reader, zoom, reduced motion, backgrounding and Sydney reset. Chromium automation is not real-device/human testing.
- [ ] Check hosting/database/email/payment quotas, costs, backups and recovery access; do not purchase upgrades without a quoted need.
- [ ] Run focused checks for the final changed components, record the release commit/run, deploy and verify the paid domain separately.
- [ ] Rollback plan: revert a bad frontend commit and redeploy the checked artifact; payment corrections must preserve receipts and reconcile through provider/server state, never rewrite game history.

**Paid launch remains pending.** Domain/host access, working support/SMTP, Stripe connection and the billing implementation/verification are still required.
