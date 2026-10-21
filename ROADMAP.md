# Break Room launch roadmap

Current development scope: eight integrated games, including the owner-authorized Laser, Alibi and Bouncer additions. The final launch roster and game names remain provisional; human playtesting should decide what ships. The staged launch work below remains necessary.

1. **Five-game playability:** Pack → Prior → Stack Up → Stake → Lowball. See `PLAYABILITY.md` for implemented changes, extended-session acceptance checks and limits. Unlimited stays free during development.
2. **Small-group playtesting:** observe confusion, replays and voluntary return visits; prioritise the largest problems before adding features. Automated passes are preparation for this stage, not a substitute for players.
3. **Commercial logistics:** specify individual permanent Unlimited unlocks plus an arcade subscription. Decide prices, exactly what purchases include, future-game access, refunds, provider and operating costs. Previous suggested prices are hypotheses, not approved launch prices. Choose hosting to fit the requirements.
4. **Purchases and launch infrastructure:** move hosting, implement server-owned account entitlements and verified payment events, test renewals/cancellation/refunds and cross-device access, and establish domain, production email and private support.
5. **Comprehensive prelaunch audit:** fact/price evidence, difficulty, full game journeys, real mobile/accessibility checks, accounts/saves, payments, policies and launch blockers. The owner's deferred all-game factual review belongs here and must precede public paid launch.
6. **Limited launch and measurement:** assess return visits, practice use, purchases, cancellations and actual costs before substantial marketing spend.

Work one stage at a time. A successful test or Git push does not prove a public deployment, Supabase dashboard readiness, commercial demand or retention.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/bouncer.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi scenarios — current contract (v2)

The owner approved real scenarios grounded in incidents, timelines and evidence, plus generated men’s/women’s portraits. Alibi now selects **96 new evidence-dependent visit-reconstruction cases**, 24 per tier. Only the culprit’s account is false; everyone else’s account and the verified records are accurate. The incident window determines the relevant visit. Both records and accounts are necessary, and each case has one complete reconstruction. This supersedes the original abstract false-count rules for **new** cases. Personal notes remain ungraded; four untimed Dailies, first-confirmation finality and correct × 25 Arcade scoring are unchanged.

Eight illustrated portraits were generated as an image atlas and encoded as an optimized WebP; CSS selects a cell. New snapshots store stable, distinct random portrait assignments, unrelated to guilt. Existing original-format drafts/notes/completions/history keep their original rules and scores; new scenarios are available in Unlimited immediately and the next fresh Daily. The frozen 144-case original bank and tests remain outside production. Read `games/alibi/README.md` for exact source, schema, behavior and compatibility.

**Current complete upgrade: run `supabase/bouncer.sql` LAST.** It includes Alibi scenarios and three-mirror Laser Expert, so earlier per-game updates need not be reapplied. It includes all earlier games and both Alibi parsers. Fresh projects use current setup then Friends; do not reapply old narrower migrations. Personal raw snapshots/notes remain private; Friends expose only completed normalized records through existing sharing controls. Human playtesting and the separately agreed prelaunch audit remain necessary. No billing or other game was enabled.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, both Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile/menus/homepage/accounts/Friends include nine playable games and six coming-soon cards. Public billing and prelaunch human/content/device reviews remain deferred.
