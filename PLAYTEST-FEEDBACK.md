# Player feedback changes — 23 October 2026

The owner reported that Alibi was boring/confusing, relied only on incident-time presence and gave weak explanations. Stack Up was too obscure/hard; the owner asked to remove its launch screen and Daily 10× multiplier. These are lasting direction changes and supersede the earlier forced-hard-Daily plan for these two games.

## Alibi

New files use four evidence mechanisms: paired marks on forged seals, intersecting badge permissions, independently measured inventory differences and the first broken link in a seal-custody chain. The 32 authored premises include a forged festival pass, a missing audition recording, a vanished prototype and an altered master drawing.

There are **128 new v3 files**, 32 per tier and eight per mechanism/tier. Each fresh Daily contains four different mechanisms, in Warm-up → Standard → Tricky → Expert order. A deterministic 32-day rotation avoids repeated files. Unlimited uses new files immediately and keeps changing/fixed difficulty.

All deduction observations are verified facts. Players match physical evidence to a catalogue entry, then work out its owner. This replaces the assumption that only the culprit lies in new files. Personal notes can propose object assignments or exclude suspects without checking or scoring them. Reveal includes the physical-evidence calculation/match, the actual clue-based deductions and why the other suspects do not have the relevant entry. Full deductions and the catalogue remain available in review.

The independent solver checks all 24/120 possible assignments. Every file has one complete solution and a propagation explanation without guesses. Exhaustive clue-subset checks require at least 2/3/4/5 independent constraints by tier; these are structural checks, not measured player difficulty. Existing portraits, first-pick finality, four-case scoring, saves and account boundaries remain.

All v1/v2 saved files retain their original rules, notes, choices and scores. The 155 v2 files stay unchanged. Version 3 fields, validation and SQL reconstruction are explicit; a supplied culprit or score is never trusted.

## Stack Up

The game opens directly into Daily play or its saved result, with no launch screen. Its 90-second wall-clock timer begins immediately for a fresh stack; help still does not pause it. Sydney rollover starts/resumes the new Daily directly.

**160 familiar default stacks** cover calendar order/durations, everyday units, planets, recognisable films, simple calculations and common fractions/percentages. Five lanes provide a gentler five-stack progression and 32 distinct Dailies. The old 208 harder sets are unchanged and available through **Challenge mix** and topic practice. Topic changes apply on the next practice stack.

New runs carry `scoreVersion:2`: correct = `100 + 5 × seconds + 35 × streak`, wrong submission −30, timeout −40 in both modes. Daily maximum is **3,100**; Arcade score divides by 3,100. No Daily multiplier or promotional 10× copy remains.

Existing saved runs without the tag retain the original 31,000-point scale, including unfinished runs, and their Arcade denominator remains 31,000. Native stored scores are not rewritten. Header/stats show comparable Arcade best/average/last; profile history keeps native points and uses the appropriate version for Arcade/Friends comparisons.

## Sources and regeneration

- `node scripts/build-alibi-evidence.cjs` → `games/alibi/evidence-cases.js`
- `node scripts/build-familiar-stacks.cjs` → `games/stack-up/familiar-stacks.js` and `content/stack-up-familiar.json`
- Original Alibi and Stack Up generators/banks remain separate compatibility sources.
- Calendar/metric/planet sources and exact arithmetic are retained in the familiar audit; film years reuse the reviewed film reference snapshot. Content Studio includes all 368 Stack Up records.

## Database and release

**Before deployment on the existing live project, apply `supabase/playtest-feedback.sql` after the existing Inner Clock migration.** Alternatively, the updated complete `supabase/inner-clock.sql` includes this release. Fresh projects use current setup then Friends. These migrations are repeatable and preserve saves, RLS, relationships and sharing settings. They add private v3 Alibi reconstruction and versioned Stack Up score normalization. They do not introduce a new upload key or public access to snapshots.

Code changes and test success do not apply live SQL. This work remains in a PR until separately authorised for deployment. The previously completed factual/price release is already merged and deployed; it is not pending.

## Validation and remaining player work

`tests/playtest-feedback.cjs` checks independent solutions, explanation chains, clue cores, 32-day variety, generated-source reproducibility, all Alibi scoring patterns, malformed snapshots, cloud/profile continuity and real PostgreSQL score/privacy parity.

`tests/playtest-feedback-ui.cjs` exercises all four mechanisms, notes/reload/mode/summary/profile behavior, direct Stack Up launch, base points, optional challenge practice and original-score compatibility at 320/390/768/1100/1440px. Existing suites retain legacy Alibi, Stack Up timers, keyboard/touch, dialogs, account/Friends and save coverage.

The managed execution workspace is unavailable; full Node/PostgreSQL/browser validation therefore runs in GitHub Actions. These changes need another human playtest to judge whether the mysteries are engaging and the default difficulty is now appropriate. No enjoyment/solve-rate claim follows from solver tests.
