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

## Dated reference audit — 22 October 2026

The baseline `ITEMS` table and generated-art identities remain frozen. `reference-prices.js` applies dated, region-specific evidence/corrections to fresh Dailies from **24 October 2026 Sydney** and newly drawn practice items. Four changed targets: Australian iPhone 16 128GB unlocked **1399 → 1349**, Australian ordinary small-letter postage **1.70 → 1.85**, US domestic Forever postage **0.78 → 0.82**, UK First Class standard-letter postage **1.70 → 1.80**. Canadian single-stamp postage stays1.44; it is not the cheaper booklet rate. AirPods Pro 3 and Spotify Premium Individual match all four inherited prices. These are dated advertised reference amounts, with separately charged tax/delivery/extras outside the target, rather than live checkout quotes.

`pc_progress.items` captures all four complete item objects before the first guess and persists them on every subsequent write. Old drafts with no `items` retain their original date-selected baseline prices, even after the cutover; optional malformed snapshots fall back without dropping progress. Valid snapshots beat the current bank. Pending receipt reloads, mode switches and cloud merges retain the entire target snapshot; completed history/averages/share text and native score formulas are not rewritten. No new storage key or SQL update is needed.

The inherited global “15 October checked” claim lacked evidence and is removed. Receipts say **Reference price** and show only that item/region's retained check date and source, or an explicit unverified estimate label. Region-specific service/portion details appear before guessing. The 500ml pub serving displays as **Beer (500ml)** instead of “Pint”; its internal art/save identity stays unchanged.

This is **not** a completed 400-price certification. All100 definitions/400 inherited targets are assessed in `content/lowball-price-review.json`; 13 regional references are retained and387 remain open, mostly because the product/retailer/venue is undefined. See `FACTS-AND-PRICES-AUDIT.md`. Do not reduce the pool or replace targets silently to hide this gap. Content Studio uses the same dated model and reports partial regional evidence separately from complete four-region items.
