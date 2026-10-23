# Alibi — evidence deductions (v3)

The player-feedback direction is in [PLAYTEST-FEEDBACK.md](../../PLAYTEST-FEEDBACK.md). New files identify a culprit through physical evidence and object ownership, with **all deduction clues verified**. There is no new-file assumption that only the culprit lies.

## What players solve

Four mechanisms vary the evidence: match both marks on a forged seal to a stamp; find the badge with both required permissions; calculate a missing item's mass and match the unexplained bag gain; or locate the first broken security seal in a custody chain. Each case states its exclusivity assumptions. Fictional measurements and permissions are supplied, not outside trivia.

A catalogue identifies the possible entries. Each suspect has one entry and every entry one owner. Verified observations on suspect cards and additional records determine ownership. Warm-up uses direct exclusions; higher tiers add catalogue relationships. The notebook records proposed assignments and ruled-out suspects without checking answers or affecting scoring.

A first confirmed accusation is final. The reveal explains the physical match/calculation, then cites the actual clue-based deductions to identify the owner. Full reasoning lists every narrowing step and the reconstructed catalogue. Summary review retains the premise, physical evidence, catalogue, records and proof.

## Content and selection

`node scripts/build-alibi-evidence.cjs` deterministically emits `evidence-cases.js`: **128 files**, 32 per tier, eight of each mechanism per tier, with 32 authored premises. Fresh Dailies from 23 October 2026 select one of each mechanism across Warm-up/Standard/Tricky/Expert; each 32-day window is repeat-free. Unlimited defaults to new evidence files, excludes today's files and retains changing/fixed difficulty and tab-local session continuity.

Every file has one complete owner assignment, verified by independent enumeration and a propagation proof without guesses. Exhaustive clue subsets require at least 2/3/4/5 constraints by tier. These are structural difficulty checks; repeat human playtesting remains necessary.

## Saves and portraits

The outer native run remains `{version:1,day,edits,cases,picks,round,phase,selection,notes}` under `break-room:alibi:daily:YYYY-MM-DD`. New snapshots use `version:3`, `alibi-v3-level-index`, `mechanism`, `objects`, `trace`, verified `s` rules and additional `evidence`. Rules describe possible entries, catalogue order, adjacency or separation. The culprit is derived from the evidence and one complete assignment; supplied answer/score fields are ignored.

Notes retain legacy truth/excluded arrays and add `objects` assignments for v3, with −1 meaning unassigned. Notes remain personal. Completed zeroes, first-pick finality, cross-tab edit ordering, account/guest separation, native correct-out-of-four and Arcade correct ×25 are unchanged.

Existing **v1 statement** and **v2 visit** drafts/completions keep their actual saved questions, rules, notes, answers and scores. V2 still uses its incident window and false-account rule; v1 retains its displayed false count. The 155-case `cases.js` and original fixture/generators remain unchanged. New files do not reinterpret old records.

The generated eight-person portrait atlas and optimized `assets/coworkers.webp` remain intact. New casts use distinct portraits from matching pools, with independent random assignment, stable in snapshots. Appearance is never evidence. See `assets/README.md`.

## SQL and checks

Before deploying to an existing project, apply **`supabase/playtest-feedback.sql` after the current Inner Clock update**, or use the updated complete `supabase/inner-clock.sql`. Fresh projects use setup then current Friends. The private SQL solver independently enumerates ownership; old scorers remain available. RLS, consent, revisions and sharing boundaries are unchanged. This code does not establish that live SQL was applied.

`tests/playtest-feedback.cjs` checks all new files independently, proof chains, minimum clue cores, variety, all outcomes, malformed records, reproducible generation and PostgreSQL privacy/parity. The matching UI test covers modern flows at five widths. Existing Alibi suites retain original/visit compatibility, menus/dialogs, portraits, notes/reloads, keyboard/touch, sharing, accounts and Sydney rollover. Solver/browser success is not a claim that players will enjoy the revised mysteries.
