# Lowball engine inside Break Room

Open the public wrapper at `games/lowball/index.html`; this directory is its embedded game engine. Serve the whole repository so shared assets, accounts and the Sydney clock can load. Read the root README, `CONTENT.md` and `ACCOUNTS.md` before changing it.

## Current service and policies

Unlimited is free (`SITE.unlimitedFree`); advertising, payments, analytics and the old percentile service are not enabled. Dormant hooks are not installed integrations. Do not add tracking scripts or turn on monetization without deliberately implementing the feature and updating the universal policies first.

Privacy, Terms and Contact/data help live at the site root. The old local privacy/terms/refunds URLs only redirect to those pages. The wrapper has the universal footer; do not add another legal footer inside the iframe. `site-config.js` no longer supplies invented business/ABN/support/provider details. See `LEGAL.md` for maintenance and owner-supplied launch details.

The production builder fills social URL/image metadata using `SITE_URL`; copied result links retain the wrapper's repository URL path. The public GitHub Pages URL does not automatically migrate saves from downloaded files or another origin.

## Daily reset, content and artwork

Daily changes at midnight Australia/Sydney through the shared clock. Do not restore one-time Daily reset migrations. Editing pool size/order or price values can affect date-seeded unfinished games; follow the compatibility/review workflow in `CONTENT.md` rather than silently rewriting them.

Items live in `ITEMS` in `index.html`. Each needs its own generated PNG in `icons/generated/` and explicit `item-art.js` mapping. Keep the generated illustrations/gems; do not substitute code-drawn icons. The old global check date had no supporting evidence and is removed. Current evidence and open regional definitions are recorded per item in `content/lowball-price-review.json`; the Content Studio report counts dated evidence separately from unverified estimates.

## Saved progress

Guest progress and preferences use native `pc_*` browser keys. Accounts can explicitly activate private Daily cloud snapshots and optionally import guest progress; see `ACCOUNTS.md` for per-user recovery copies, sync conflicts, export limits and logout behavior. Clearing site data can erase unsynced progress and does not delete server data. Profile and Friends calculate common Arcade scores alongside Lowball's native average, as documented in `SCORING.md`.

## Dated reference audit — 22 October 2026

The baseline `ITEMS` table, 100 identities, order and generated-art mappings remain frozen. `reference-prices.js` supplies all **400 regional references** to fresh Dailies from **24 October 2026 Sydney** and newly drawn practice items: 345 amounts change and 55 match. Each region has a named product/provider or published offer/average, a pack/portion/service definition, date and source. Current generic display names Beer, Uber ride and Adhesive plasters preserve internal identities; old 500ml beer snapshots retain Beer (500ml).

Players see the regional definition and check date before guessing. Receipts say **Reference price** and show source links, including supporting links for calculated combinations. Listed regular prices, RRP, offers, base menu servings, dated tariffs, unit conversions and published averages are identified explicitly. These are dated references, not live/universal checkout totals; fee, delivery and separately added tax qualifications are in the regional detail. The unsupported global “15 October checked” claim stays removed. Old estimates retain their explicit estimate label.

All four complete item objects are captured in `pc_progress.items` before the first guess. Existing valid snapshots always win; snapshotless old drafts keep baseline targets. Preserve pending guesses/receipts, zeroes, cloud keys, native scores and practice carryover. Content Studio uses the same dated model and reports both supported regional targets and complete four-region items.

See `content/lowball-price-review.json` for every inherited/reviewed amount and evidence URL and `FACTS-AND-PRICES-AUDIT.md` for conventions and evidence limits. The 13-reference/387-open interim report is superseded. Recheck volatile published references before public launch; retrieved/indexed price evidence is not a stock guarantee or primary-source certification.
