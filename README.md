# Break Room

Ten free daily browser games, live at **https://breakroomdaily.com/**. Optional paid Unlimited offers weekly unseen selections and labelled replays.

Start with [CURRENT-STATUS.md](CURRENT-STATUS.md) for the deployed setup and current decisions. Coding agents must also read [AGENTS.md](AGENTS.md). Moving to another ChatGPT account? Follow [CHATGPT-HANDOVER.md](CHATGPT-HANDOVER.md).

## Games

Laser · Time Drop · Clue Ladder · Seating Chart · Desk Jam · Codebreak · Stack Up · Pack · Lowball · Time Sense.

Internal IDs `shift-work` and `inner-clock` remain stable. Retired games and previous save versions are preserved; older rosters and rules in release notes are historical.

## Infrastructure

Production uses Cloudflare Workers Static Assets on `breakroomdaily.com`, built from `main`. GitHub Pages remains the checked preview/legacy origin. Existing Supabase handles Auth, private saves/social data, live billing records and account-wide question history. Stripe Checkout and Customer Portal are live. Support uses Cloudflare forwarding for support@breakroomdaily.com. No ads are installed.

Daily is free; monthly is A$4.99 and an individual game is A$7.99 once. Up to 100 unseen challenges per game per Sydney week come from the available bank, followed by labelled replays. See [PAYMENTS.md](PAYMENTS.md) and the live [plans page](https://breakroomdaily.com/pricing).

## Work locally

Use Node 24 and the pinned lockfile:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm run check
npm test
```

Browser checks need Chromium; see [HOSTING.md](HOSTING.md). Checks are selected from affected paths; use the full suite only when warranted. Source and native save contracts live beside each game. Do not reset or regrade captured rounds during a change.

## Current priorities

The site is built and live. The owner’s focus is organic launch marketing on Instagram, YouTube and TikTok; [LAUNCH-MARKETING.md](LAUNCH-MARKETING.md) contains ready-to-adapt posts and video scripts. Content production starts after a verified paid monthly subscriber, then follows actual unseen supply rather than a fixed monthly quota.

The previous long development log is preserved in [README-HISTORY.md](README-HISTORY.md). Its older “current” sections are not current setup instructions.
