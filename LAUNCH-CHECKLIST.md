# Ordered public-launch checklist

Prepared 22 October 2026 (Australia/Sydney). Unchecked means evidence is still required. Code present, a pushed commit, green CI and a confirmed public deployment are separate milestones.

## Current roster and Seating Chart evidence — 24 October 2026

Nine active games: Laser, Time Drop, Clue Ladder, Seating Chart, Stack Up, Stake, Pack, Lowball and Inner Clock. Alibi, Bouncer and Prior retain archived routes/history; twelve native cloud formats remain supported. Older audit-era counts and PR holds below are superseded by the current owner decisions in AGENTS.md.

- [x] Seating Chart: 360 offline-generated tables, 72 Daily sets, exhaustive optima and conflicting-request lower bounds, five browser widths, Daily save/lock/Undo and a complete Unlimited refill checked in [run 40040627565](https://github.com/phoenix6716/Break-Room/actions/runs/40040627565).
- [x] Seating Chart live database migration applied and independently verified; existing saves/RLS preserved.
- [ ] Confirm the new release's main-branch Pages publication separately.
- [ ] Playtest Seating Chart on real phones and with people at different skill levels; calibrate Expert challenge and session length. Structural solver checks are not human difficulty certification.

## 1. Stabilise the release candidate — engineering

- [ ] Review the final release-candidate diff, including current navigation, theme and game roster; resolve any conflicts with the latest AGENTS.md decisions.
- [ ] Finish and review the content/difficulty PR. Confirm the final file diff contains no unintended engine, artwork, billing or save-format changes.
- [ ] Run locked-dependency `npm test` with focused checks for changed components and actual shared dependencies, including build/reference, affected game journeys and relevant PostgreSQL scoring/security parity. A full sweep requires an explicit audit request.
- [ ] Record each check's commit/run URL. Fix failing checks; do not mark a mocked interaction as a live service test.
- [ ] Confirm no frozen legacy Stake rows or existing game snapshots are reinterpreted. Test old drafts/completions, zero scores, active deadlines, guest saves and cloud restores.
- [ ] Remove all cancelled-game advertising from reachable menus. Keep archived routes out of prominent navigation.
- [ ] Decide the candidate commit and prepare a revert commit/rollback procedure. Completed requested changes are authorised for automatic publication after affected checks; PRs do not require another owner approval.

Exit: a reproducible release candidate with passing checks and no unresolved data-loss, scoring, navigation or inaccessible-control defects.

## 2. Verify content coverage and advanced challenge — engineering/editorial

- [ ] Demonstrate at least the current Daily plus 32 following Sydney Dailies for every game using the actual selectors.
- [ ] Check individual puzzle/question repetition and logical duplicate signatures, not just unique IDs or whole-run hashes.
- [ ] Record bank counts by tier, pool/deck exhaustion behaviour and whether practice can deplete or alter a Daily.
- [ ] Confirm easier tiers remain accessible and settings never replace a round already in progress.
- [ ] Independently solve current Pack/Laser/Seating Chart content; test optimum bounds, tier constraints and JS/SQL parity. Seating Chart accepts every optimal arrangement; it does not require one hidden seating order.
- [ ] Preserve archived Alibi/Bouncer/Prior progress and score compatibility. For Seating Chart, retain the independent exhaustive minima and conflicting-request subset checks.
- [ ] Recheck source/regeneration output so future content builds retain additions and original IDs.
- [ ] Explicitly label Lowball's 100-product limit and Inner Clock's recurring timing ingredients. If unique individual ingredients are required for a month, treat expansion as unfinished work.

Exit: coverage supported by generated reports and harder content supported by objective checks, with human calibration still pending.

## 3. Review the factual and price release — editorial/engineering

The completed 22 October editorial review and PR #4 are documented in [FACTS-AND-PRICES-AUDIT.md](FACTS-AND-PRICES-AUDIT.md). It covers all 600 factual records and all 400 regional targets. The earlier 387-open report is superseded; per-record methods retain the distinction between corroboration, full documents and indexed extracts.

- [x] Stake: review all 264 answers/alternatives and scopes; read the 164 inherited explanations and apply 16 targeted overlays without changing legacy options.
- [x] Stack Up: reconcile factual measurements and conventions, scopes and book milestones; verify arithmetic independently. Keep all 208 IDs, subjects and ordered cards.
- [x] Prior: review all 128 milestones, years and full explanations; improve links and clarify dates/markets without changing years or IDs.
- [x] Lowball: replace undefined inherited categories with 400 dated regional references and upfront product/service/pack/offer/average definitions, source evidence and fee/tax conventions. Preserve the 100-item pool and saved targets.
- [ ] Confirm the reviewed factual/price corrections remain in the release candidate and its affected checks pass; verify the deployed candidate separately.
- [ ] Recheck volatile prices, current offers/tariffs, source availability and observation dates for the public release. Retain dated-reference wording; do not advertise universal/live prices.
- [ ] Calibrate difficulty and breadth with players; broader Prior world-history coverage remains useful, separate from factual correctness.
- [ ] Review game names, fonts, generated-art provenance and asset licences before public marketing.

Exit: source-backed, clearly scoped answers and dated price references are deployed with passing compatibility checks; claims accurately reflect their evidence and date.

## 4. Verify hosting and live accounts — owner with engineering support

- [ ] Settle the launch URL/domain before configuring email links and publishing marketing materials.
- [ ] Confirm the Pages deployment succeeds for the candidate commit and verify the actual HTTPS site, nested routes, assets, copy/share URLs and social previews.
- [ ] Verify the Supabase project and complete nine-game SQL/RLS setup. For an existing setup/Friends installation, review and apply the complete `supabase/inner-clock.sql` update last; do not reapply older narrower allowlists.
- [ ] Verify Site URL and confirmation/recovery callback allowlists for the actual launch path/domain.
- [ ] Configure production SMTP with a verified sender/domain and test real confirmation and password-reset delivery to unrelated addresses, including spam-folder behaviour and expired links.
- [ ] With two real accounts and two browsers/devices: explicit cloud activation, optional guest import, partial Daily upload, remote restore, offline retry, conflicts, logout guest restoration and cross-account isolation.
- [ ] With those accounts: friend-code request/accept, display name, sharing on/off, correct normalised scores, remove/block/unblock and outsider/raw-save denial.
- [ ] Check graceful failure for missing SQL, unavailable service, expired session and rate limits.
- [ ] Keep administrator/service-role credentials out of the browser and published artifact.

Exit: independently observed production service behaviour; local mocks alone cannot close these rows.

## 5. Run human and real-device testing — players/owner

- [ ] Recruit a small mixed group of new and advanced players; observe first-time play without explaining the rules verbally.
- [ ] Cover every game, easier and hardest tiers, the homepage, navigation and account/Friends journey.
- [ ] Record confusion, accidental commitments, solve time, perceived fairness, voluntary replay and return visits.
- [ ] Adjust the most damaging issues first. Revisit the editorial ranking after actual player evidence.
- [ ] Test recent iPhone/Safari and Android/Chrome in portrait and landscape, including keyboards, scrolling, background/return, audio and touch.
- [ ] Test full keyboard journeys and VoiceOver/TalkBack: labels, focus order/traps/restoration, result announcements and sorting alternatives.
- [ ] Check reduced motion, browser zoom/text enlargement, contrast, long content and all control states.
- [ ] Play all nine Dailies through the Sydney reset, including DST boundaries and stale tabs, without losing prior results.

Exit: no repeated severe usability issue, and advanced players find the hard content demanding but fair.

## 6. Close operating and policy gaps — owner

- [ ] Establish an operator identity and a private support/data-request route; public GitHub issues are not a private account-support channel.
- [ ] Verify the process for access/export/deletion requests and account deletion, including linked cloud/social data. Do not advertise a self-service feature that does not exist.
- [ ] Align Privacy, Terms and Contact with actual processors, data handling, guest/cloud ownership, sharing and support practices.
- [ ] Check hosting/database/email capacity, quotas, rate limits, costs, backups, recovery and who responds to incidents.
- [ ] Choose whether launch means a free beta or a paid product. Unlimited stays free during development.
- [ ] Decide how to measure return visits and failures. If adding analytics, approve the provider and update disclosures/consent before enabling it.

Exit: players can contact the operator privately, policies match reality and the service has an operating plan.

## 7. If launching paid, complete commerce before charging — owner/engineering

Skip implementation for a free beta; this is a paid-launch gate, not approval to add billing.

- [ ] Approve prices, per-game versus subscription access, future-game inclusion, refunds, taxes, provider and hosting requirements.
- [ ] Implement server-owned entitlements and verified, idempotent payment events; never trust a client unlock flag.
- [ ] Test purchase, renewal, cancellation, expiration, failed payment, refund, disputes and account/device transfer.
- [ ] Verify receipts, support, policies and the exact features a buyer receives. Obtain appropriate professional advice for operator/jurisdiction obligations.

Exit: verified access and payment lifecycle, with no misleading purchase or refund promises.

## 8. Limited public release and follow-up — owner/engineering

- [ ] Merge only reviewed, passing PRs; tag/record the shipped commit and confirm its deployment.
- [ ] Repeat live homepage/game/account/Friends smoke checks on the production URL after publication.
- [ ] Publish to a small audience first; provide a clear feedback/support link.
- [ ] Monitor meaningful failures, save/sync problems, content complaints, quotas and costs with a named owner.
- [ ] Check actual return visits and replay behaviour before widening promotion or treating monetization hypotheses as proven.
- [ ] Schedule content refreshes and a new future-window coverage check before the current guaranteed window moves out of date.

Exit: a working, supported release with observed player feedback, not merely a green build.
