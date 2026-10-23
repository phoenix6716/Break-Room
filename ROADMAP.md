# Break Room launch roadmap

## Prior shelved; preserve its content — owner decision, 23 October 2026

Prior joins Alibi and Bouncer outside the active lineup. The six current games are Laser, Stack Up, Stake, Pack, Lowball and Inner Clock. Remove Prior from the shelf, drawers and current Friends comparisons; keep archived profile history, earned achievements, saves, scoring compatibility and direct routes. The current Daily checklist uses six games.

Preserve `content/prior-events.json` in full, including stable event IDs, dates, explanations and source links, plus `scripts/build-prior-events.cjs` and existing generated content. The owner wants a similar event-based replacement that can reuse this material. Its design is not decided; do not invent rules, alter the bank or add a replacement card yet. This supersedes the earlier seven-game roster below.

Current development scope: six active games, with Prior, Alibi and Bouncer shelved. Three replacements are intended; one owner-supplied prototype is pending review and the other two concepts remain unselected.

## Current lineup — owner decision, 23 October 2026

Alibi and Bouncer are shelved and removed from the active homepage, navigation drawers and current Friends comparisons. The seven current games, in shelf order, are Laser, Stack Up, Stake, Pack, Prior, Lowball and Inner Clock. Preserve the shelved engines, direct routes, artwork, local/cloud saves, historical native/Arcade scores and earned achievements. Profile keeps archived results for players who already have them, without play prompts, and its current Daily checklist uses seven games. Historical profile averages still include saved archived results; Friends compares the current lineup. Do not remove cloud/schema compatibility or erase records as part of shelving.

The owner wants three better replacement games, with one prototype already lined up. Review that supplied game before integration; the other two concepts are not selected. Do not invent or advertise replacement games or restore cancelled placeholders. After three replacements the intended roster would be ten games. This decision supersedes older nine-game and Alibi/Bouncer launch-roster guidance below; those game contracts remain compatibility documentation.

1. **Five-game playability:** Pack → Prior → Stack Up → Stake → Lowball. See `PLAYABILITY.md` for implemented changes, extended-session acceptance checks and limits. Unlimited stays free during development.
2. **Small-group playtesting:** observe confusion, replays and voluntary return visits; prioritise the largest problems before adding features. Automated passes are preparation for this stage, not a substitute for players.
3. **Commercial logistics:** specify individual permanent Unlimited unlocks plus an arcade subscription. Decide prices, exactly what purchases include, future-game access, refunds, provider and operating costs. Previous suggested prices are hypotheses, not approved launch prices. Choose hosting to fit the requirements.
4. **Purchases and launch infrastructure:** move hosting, implement server-owned account entitlements and verified payment events, test renewals/cancellation/refunds and cross-device access, and establish domain, production email and private support.
5. **Comprehensive prelaunch audit:** fact/price evidence, difficulty, full game journeys, real mobile/accessibility checks, accounts/saves, payments, policies and launch blockers. The owner's deferred all-game factual review belongs here and must precede public paid launch.
6. **Limited launch and measurement:** assess return visits, practice use, purchases, cancellations and actual costs before substantial marketing spend.

Work one stage at a time. A successful test or Git push does not prove a public deployment, Supabase dashboard readiness, commercial demand or retention.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/inner-clock.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi scenarios — current contract (v2)

The owner approved real scenarios grounded in incidents, timelines and evidence, plus generated men’s/women’s portraits. Alibi now selects **96 new evidence-dependent visit-reconstruction cases**, 24 per tier. Only the culprit’s account is false; everyone else’s account and the verified records are accurate. The incident window determines the relevant visit. Both records and accounts are necessary, and each case has one complete reconstruction. This supersedes the original abstract false-count rules for **new** cases. Personal notes remain ungraded; four untimed Dailies, first-confirmation finality and correct × 25 Arcade scoring are unchanged.

Eight illustrated portraits were generated as an image atlas and encoded as an optimized WebP; CSS selects a cell. New snapshots store stable, distinct random portrait assignments, unrelated to guilt. Existing original-format drafts/notes/completions/history keep their original rules and scores; new scenarios are available in Unlimited immediately and the next fresh Daily. The frozen 144-case original bank and tests remain outside production. Read `games/alibi/README.md` for exact source, schema, behavior and compatibility.

**Current complete upgrade: run `supabase/inner-clock.sql` LAST.** It includes Alibi scenarios and three-mirror Laser Expert, so earlier per-game updates need not be reapplied. It includes all earlier games and both Alibi parsers. Fresh projects use current setup then Friends; do not reapply old narrower migrations. Personal raw snapshots/notes remain private; Friends expose only completed normalized records through existing sharing controls. Human playtesting and the separately agreed prelaunch audit remain necessary. No billing or other game was enabled.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, both Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile, menus, accounts and Friends support nine playable games. The homepage shows only those nine games; the six cancelled placeholder cards remain removed. Public billing and prelaunch human/content/device reviews remain deferred.
