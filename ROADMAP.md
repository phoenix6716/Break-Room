# Break Room launch roadmap

Working launch scope: the five integrated games. New game ideas and names remain provisional; pause additional games while completing this roadmap.

1. **Five-game playability:** Pack → Prior → Stack Up → Stake → Lowball. See `PLAYABILITY.md` for implemented changes, extended-session acceptance checks and limits. Unlimited stays free during development.
2. **Small-group playtesting:** observe confusion, replays and voluntary return visits; prioritise the largest problems before adding features. Automated passes are preparation for this stage, not a substitute for players.
3. **Commercial logistics:** specify individual permanent Unlimited unlocks plus an arcade subscription. Decide prices, exactly what purchases include, future-game access, refunds, provider and operating costs. Previous suggested prices are hypotheses, not approved launch prices. Choose hosting to fit the requirements.
4. **Purchases and launch infrastructure:** move hosting, implement server-owned account entitlements and verified payment events, test renewals/cancellation/refunds and cross-device access, and establish domain, production email and private support.
5. **Comprehensive prelaunch audit:** fact/price evidence, difficulty, full game journeys, real mobile/accessibility checks, accounts/saves, payments, policies and launch blockers. The owner's deferred all-game factual review belongs here and must precede public paid launch.
6. **Limited launch and measurement:** assess return visits, practice use, purchases, cancellations and actual costs before substantial marketing spend.

Work one stage at a time. A successful test or Git push does not prove a public deployment, Supabase dashboard readiness, commercial demand or retention.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/laser.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.
