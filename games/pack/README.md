# Pack — early working name

A weight-and-usefulness puzzle, not a spatial packing game. Select items under the bag’s weight limit and maximize usefulness. All weights and usefulness values are **fictional puzzle values**, not real product measurements or travel advice.

Daily has three untimed bags: easy, medium and hard. Selections can be changed freely until submitted; overweight or empty submissions are rejected. Submitting is final and reveals the unique best pack, with leave/add suggestions computed from the player’s actual selection. The third submission completes the Daily, even before opening the final summary. Unlimited is free, untimed practice and does not affect Daily records, streaks or cloud history. Switching modes preserves both active runs in that tab; only Daily survives reload.

## Content and scoring

`puzzles.js` contains 180 reproducible puzzles: 60 per tier across camping, beach, city and train themes, with 6/7/8 items respectively. Generate with `node scripts/build-pack-puzzles.cjs`. Integer weights are tenths of a kilogram, avoiding decimal-rounding capacity errors. Every item fits alone; the full list exceeds capacity; each bag has one exact optimum.

The generator rejects trivial greedy-optimal bags. Minimum loss from selecting by usefulness/weight is 3% for easy, 8% for medium and 14% for hard (easy capped at 8%, medium at 14%). These are structural trade-off checks, **not measured human difficulty**. Tune using playtesting before launch. `tests/pack-rules.cjs` verifies every optimum against an independent capacity-indexed solver.

Native score is total usefulness across all three bags. Arcade score is `100 × total usefulness earned / total best possible usefulness`; no speed bonus. Missing/incomplete/Unlimited runs are excluded from profile and Friends. See `SCORING.md`.

## Integration and compatibility

`pack-model.js` is the pure versioned puzzle/save/scoring contract, shared by the engine and read-only records/cloud adapters. `pack.js` owns real controls and saves; `shell.js` provides the canonical Help/Stats/mode interactions. The layout retains the left Menu drawer, centred Streak/Best/Played, common reset rail, Daily/Unlimited and universal footer. Pack has no audio, so there is no fake sound button. Comparisons use Break Room Friends rather than the prototype’s selection-encoding challenge codes or extra primary tab.

Daily keys are `break-room:pack:daily:YYYY-MM-DD`, using midnight Australia/Sydney. Version 1 saves include all three puzzle snapshots, picks, selection, round and phase (`play`, `review`, `summary`). New banks must preserve saved snapshots; never regenerate an existing run or reset another game. Cloud merge advances by round/phase, with the first completed cloud result retained and equal-stage cloud choices winning ties. Guest/account ownership follows the same explicit consent and restoration rules as the other games.

For the current site, run **`supabase/prior.sql` last** in SQL Editor after the existing setup/social migrations; it includes both Pack and Prior. `supabase/pack.sql` is the historical Pack-only migration and must not be reapplied after newer migrations. It adds Pack’s save allowlist and independently solved private friend scores without widening RLS or exposing answers. New projects use updated `setup.sql` then `friends.sql`. No admin credential belongs in the client. Browser play/profile work before this migration; Pack cloud writes show a clear update message and preserve local saves until it is applied.

The uploaded original and candid initial review remain at `design/prototypes/pack/`, outside the published build. Its saves were not production records and are not imported. Names remain provisional.

## Checks

`npm test` includes independent puzzle optima, snapshot validation, cloud conflict order, SQL/JS parity, repeatable existing-project migration and ownership/security checks. Actual browser coverage completes three bags at 320/390/768/1100/1440px, reloads selections/reviews/results, checks swaps, capacity errors, sharing, profile records, mode independence, menus/dialogs/keyboard/touch, Sydney rollover, unavailable storage and account transfers. Screenshots are local verification artifacts; neither mocks nor a Git push establish live deployment/database activation.
