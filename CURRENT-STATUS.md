# Break Room — current status

Updated 17 November 2026 (Australia/Sydney). Read this before dated release notes. This is a documentation/status consolidation, not a new game or billing migration.

## Project and production

- Repository: https://github.com/phoenix6716/Break-Room ; branch `main`.
- Production: https://breakroomdaily.com/ . Cloudflare Workers Static Assets serves `dist/`, with clean URLs and automatic deployment from main. Worker name: `break-room`; fallback hostname: `break-room.phillipsphoenix09.workers.dev`.
- GitHub Pages at https://phoenix6716.github.io/Break-Room/ is the checked preview/legacy origin, not the primary commercial host. Preserve origin-specific guest saves.
- Supabase project: `quhyzwivpdznmffmwhcr`. Keep this existing project and its data.
- Latest functional implementation before this documentation update: `4bb5fae3ab6a90ecde72d8f0d17ceefc89eeaf86` (14 November). Its production deployment and all ten game screens were verified; GitHub workflow `43591414441` subsequently completed successfully. Do not leave the old “preview checks still running” note as a current blocker.

## What is shipped

Ten active games: Laser, Time Drop, Clue Ladder, Seating Chart, Desk Jam (`shift-work`), Codebreak, Stack Up, Pack, Lowball and Time Sense (`inner-clock`). Retired games stay archived; do not delete their source or saves.

Daily games are free. Unlimited requires verified live monthly access or an individual game purchase. Account saves, Friends, private weekly Leagues, public period leaderboards, themes, settings and support links are implemented. These are not pending launch features.

Leaderboards use the account Auth display name as their only name source. Existing signed-in opt-outs, moderation, public IDs and visibility choices must survive edits. Overall Daily is out of 1,000; longer periods sum eligible recorded Dailies. Sydney boundaries and tied ranks apply. Deleted or never-synced results cannot be recovered.

Codebreak currently uses four digits from 0–9, repeats allowed, eight guesses; full score through four guesses, then 80/60/40/20. Fresh rounds use version 6; old captures retain their own version. Laser’s current Daily mirror progression is 2/3/3/4. Seating Chart keeps three current Daily tables; older five-table captures remain valid. Never reinterpret old saves using current rules.

## Payments and email

| Offering | Price | Access |
| --- | --- | --- |
| Daily | Free | All ten Daily games |
| Monthly | A$4.99/month | Unlimited in all current/future games while paid access is active |
| Individual game | A$7.99 once | Permanent Unlimited for that game |

Checkout, Customer Portal, live entitlements and the signed live webhook are enabled. Cancellation stops renewal and keeps access through the paid period; individual purchases survive membership expiry. Purchases are account-owned. Never grant access from a checkout return, query string, sandbox record or browser flag.

No advertising network is installed. Plans describe ad removal for when advertising exists; do not claim paying currently removes running ads. GST collection remains off under the owner’s stated non-registration. Refund requests need a reason and are handled case by case, with statutory consumer remedies preserved.

Support: support@breakroomdaily.com via Cloudflare Email Routing to the owner’s verified mailbox. This is forwarding, not a separately provisioned outbound mailbox. The owner deferred a paid branded mailbox. Do not recreate email or Stripe accounts during a ChatGPT-account change.

The owner reported completing the domain/Stripe dashboard setup steps after the 13 November checklist. Do not reopen that whole list or claim previously blank settings are still blank. Current provider requirements and genuinely unknown physical-device/email outcomes need current evidence, not assumptions. No real live test charge has been fabricated or asserted. Address provider verification requirements if actually requested; do not invent an outstanding block.

## Unlimited content and demand

Implemented on 14 November:

- Private account-wide seen history and a shared weekly selection across devices. A question counts when actually displayed, not when answered correctly. Assigning a selection does not mark its unopened questions as seen.
- Up to 100 unseen challenges per game per Sydney week from the available library, plus labelled unlimited replays. Monday midnight refreshes the selection, never lifetime seen history. Smaller banks/filters/Daily exclusions may yield fewer. There is no numeric remaining counter during normal play; the weekly selection is disclosed before purchase.
- Local known history is union-imported; older unseen archive content can serve a newcomer. Guest history stays local. Missing historical exposure cannot be reconstructed.
- `content-library` authenticates the actor and uses the service-only `content_library_server` RPC over private `br_content` tables. `20261114111257_account_content_library.sql` was installed. Do not re-run old setup installers over production.
- Entry and Next hydrate account history. Sync failure preserves the captured round/timer. Exposure acknowledgements determine replay labels; simultaneous devices can briefly display the same challenge, but duplicate acknowledgement is labelled replay.
- A positive, verified paid LIVE MONTHLY invoice idempotently activates the content programme. Sign-ups, pending checkout, sandbox, trials, zero invoices and individual purchases do not activate it. A historical inactive-state check is not proof it is still inactive today; inspect current records if needed.
- `br_content.inventory_review` reports active consumers’ unseen reserve and recent consumption after activation. It is a private report, not an automatic content-authoring or publication job.

There is no fixed 400-question monthly authoring quota. Start top-up planning around 2–4 weeks of remaining supply for the most advanced active consumer. Skip unnecessary authorship while ample unseen content remains. Add genuine new stable IDs to the private catalogue before shipping new banks; never relabel old puzzles as fresh. See [UNLIMITED-POOLS.md](UNLIMITED-POOLS.md) and [CONTENT-SUBSCRIPTION-PLAN.md](CONTENT-SUBSCRIPTION-PLAN.md).

## Current objective and work status

The owner wants to launch and market the live site. Organic/free posts and relevant communities were chosen; existing channels are Instagram, YouTube and TikTok. Lead with a real Time Sense attempt, then Lowball and Laser. Reuse a clean vertical original across Reels, Shorts and TikTok. Promote free Daily play first. [LAUNCH-MARKETING.md](LAUNCH-MARKETING.md) contains drafts and the seven-day plan. Actual publishing, account handles, audience results and sales have not been confirmed. No ad budget or authority to publish/send posts has been given.

No unfinished game implementation is carried into this handover. The current requested work is updating stale documentation and moving working context to another ChatGPT account. Future monitoring, content authorship and marketing remain ongoing product work, not a reason to repeat completed launch setup.

## Development and release rules

Read [AGENTS.md](AGENTS.md) first in a coding workspace. It contains dated historical entries; this page and its newest instructions resolve old descriptions of disabled billing, free Unlimited, proposed hosting, old game rosters and pending cloud history.

Preserve saves, captured rounds, timers, scoring versions, public IDs and privacy choices. Use Node 24, `npm ci --ignore-scripts --no-audit --no-fund`, `npm run build`, `npm run check` and focused `npm test` for affected implementation changes. Do not run every legacy game unnecessarily or deploy just to test a payment. Automatic deployment after focused checks is owner-authorized; verify the actual deployment and live site before claiming success. Keep Stripe’s existing pinned `2025-02-24.acacia` shape until a separately assessed upgrade.

Known limits: static game engines are public; client entry checks are not a tamper-proof paid-content boundary. Billing reconciliation retains its 100-session/account fail-closed bound. Prior advisors reported seven intentional existing authenticated SECURITY DEFINER game/social RPCs and disabled leaked-password protection; the content rollout added only expected private-table deny-by-default informational findings and no new security warnings. These are dated findings, not a fresh security certification.

## Documentation map

[README.md](README.md) · [HOSTING.md](HOSTING.md) · [PAYMENTS.md](PAYMENTS.md) · [STRIPE-LIVE-SETUP.md](STRIPE-LIVE-SETUP.md) · [ROADMAP.md](ROADMAP.md) · [CHATGPT-HANDOVER.md](CHATGPT-HANDOVER.md).

Files ending `-HISTORY.md` and dated audits preserve historical evidence. Do not follow their old pending-action lists without checking this page and current evidence.
