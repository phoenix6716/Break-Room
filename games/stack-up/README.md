# Stack Up — familiar defaults and base points

The owner asked for familiar subjects, direct entry and removal of the Daily 10× bonus. See [PLAYTEST-FEEDBACK.md](../../PLAYTEST-FEEDBACK.md).

A fresh page opens the current Daily immediately; saved reviews/results resume. There is no launch screen. Each stack has a 90-second wall-clock deadline, including while help is open or another mode is active. Sydney rollover opens the next saved/fresh Daily directly. Dragging, arrow buttons, keyboard sorting, transient position feedback and the canonical shell remain.

## Content

`familiar-stacks.js` has 160 curated defaults: 32 in each of five lanes (everyday/calendar, familiar science/units, recognisable films, basic calculations, common fractions/percentages). Fresh Dailies from 23 October 2026 use one per lane with 32-day repeat-free rotation. `scripts/build-familiar-stacks.cjs` reproduces the bank and `content/stack-up-familiar.json` audit.

The original 208-set `stacks.js` remains unchanged. Unlimited defaults to Familiar mix; Challenge mix offers the older harder bank, and topic selection retains both banks. Changes apply to the next stack. Today's snapshots are excluded; active practice survives mode changes. Blank descriptions and shuffled card order remain.

## Scoring and compatibility

New runs retain outer `version:2` and add `scoreVersion:2`. Both modes award `100 + seconds × 5 + streak × 35` for a correct stack, −30 for a wrong submission and −40 for timeout. Five immediate clean Dailies total 3,100. Arcade score is points ÷3,100 ×100, bounded to 0–100.

Untagged old runs and explicit `scoreVersion:1` preserve original Daily points/penalties and the 31,000 denominator, including unfinished saved runs. Stored native scores and question snapshots are never rewritten. V1 bank recovery remains intact. Header/stats compare Arcade results; profile history preserves native points and uses the correct per-run Arcade denominator.

`arcade-score.js`, `profile-records.js` and the private SQL scorer share this version policy. Before publishing to an existing Supabase project, apply `supabase/playtest-feedback.sql` after the prior Inner Clock update, or the updated complete `inner-clock.sql`. Fresh setup/current Friends includes it. No new storage prefix, upload consent or raw friend access is introduced.

Tests cover new/old scores and SQL parity, direct entry, content sources and rotation, pending/complete snapshots, first-answer feedback, wall-clock reload/rollover, all input methods, mode continuity, menus/dialogs and responsive widths. Another human playtest must assess the new difficulty; structural tier labels are not measured solve rates.
