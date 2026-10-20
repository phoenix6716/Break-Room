# Lowball engine inside Break Room

Open the public wrapper at `games/lowball/index.html`; this directory is its embedded game engine. Serve the whole repository so shared assets, accounts and the Sydney clock can load. Read the root README, `CONTENT.md` and `ACCOUNTS.md` before changing it.

## Current service and policies

Unlimited is free (`SITE.unlimitedFree`); advertising, payments, analytics and the old percentile service are not enabled. Dormant hooks are not installed integrations. Do not add tracking scripts or turn on monetization without deliberately implementing the feature and updating the universal policies first.

Privacy, Terms and Contact/data help live at the site root. The old local privacy/terms/refunds URLs only redirect to those pages. The wrapper has the universal footer; do not add another legal footer inside the iframe. `site-config.js` no longer supplies invented business/ABN/support/provider details. See `LEGAL.md` for maintenance and owner-supplied launch details.

The production builder fills social URL/image metadata using `SITE_URL`; copied result links retain the wrapper's repository URL path. The public GitHub Pages URL does not automatically migrate saves from downloaded files or another origin.

## Daily reset, content and artwork

Daily changes at midnight Australia/Sydney through the shared clock. Do not restore one-time Daily reset migrations. Editing pool size/order or price values can affect date-seeded unfinished games; follow the compatibility/review workflow in `CONTENT.md` rather than silently rewriting them.

Items live in `ITEMS` in `index.html`. Each needs its own generated PNG in `icons/generated/` and explicit `item-art.js` mapping. Keep the generated illustrations/gems; do not substitute code-drawn icons. The inherited `PRICES_CHECKED` date is a display value, not proof of current sourced local retail prices. The content report records this evidence gap.

## Saved progress

Guest progress and preferences use native `pc_*` browser keys. Accounts can explicitly activate private Daily cloud snapshots and optionally import guest progress; see `ACCOUNTS.md` for per-user recovery copies, sync conflicts, export limits and logout behavior. Clearing site data can erase unsynced progress and does not delete server data. Profile and Friends calculate common Arcade scores alongside Lowball's native average, as documented in `SCORING.md`.
