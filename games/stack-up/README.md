## Stack Up smooth swaps and All topics — owner request, 5 November 2026

Fresh Unlimited sessions default to All topics; an explicitly chosen topic stays selected during mode switches and affects the next stack. Card moves use a 260ms eased position/size animation, including the full-width final card in the mobile grid. Rapid moves start from the displayed positions; keyboard focus and the saved order update immediately. Reduced motion and browsers without Web Animations use immediate reordering. Daily questions, scoring, saves, deadlines and other games are unchanged.

## Stack Up variety — owner feedback, 5 November 2026

The 160 Daily stacks now cover 80 authored themes, replacing 16 heavily reused templates. Each theme has two distinct five-card selections, at calendar slots 16 days apart. Interleaved subject order prevents runs of film-release, recipe or life-cycle templates. Preserve all 160 IDs, five lanes, original date selector and 32-day repeat-free ID rotation. Author `content/stack-up-familiar-topics.json`; run `node scripts/build-familiar-stacks.cjs`. Each theme has reference links and a clear ordered master sequence. No maths, numerical-fact or time-unit tasks return.

Fresh Unlimited deduplicates by theme/prompt and favours the familiar version: 80 familiar themes plus 10 additional challenge prompts, 90 in All topics. Exclude the entire captured Daily theme from practice, not just its selected five-card variant. Topic changes still apply to the next stack. This deliberately retires near-duplicate practice variants rather than inflating the active count. Original source/challenge data remains for compatibility. Already captured Dailies retain original questions, drafts, timers, score versions and results; cloud merges retain an existing remote capture when question snapshots differ. No database migration, score change or other-game edit is required. Archive: `content/archive/2026-11-05-pre-stack-variety/`. Source retrieval and editorial review are recorded under `design/content-reviews/2026-11-05-stack-variety*`; accessibility is an editorial estimate, not measured player recognition. Earlier content counts below are historical.

## Stack Up first-try scoring — owner correction, 5 November 2026

Fresh Stack Up runs use `scoreVersion:4`: a correct first submission earns 100 regardless of time remaining or prior streak. Deduct 20 per wrong submission, bounded at zero; timeout scores zero. The Daily is the mean of its five round scores. Keep the 90-second timer and all raw receipt fields and mechanics for compatibility. All captured score versions 1/2/3, including unfinished captures, retain original scores, deadlines and rules. No data is regraded or reset. Only Stack Up changes in this correction. Apply `supabase/stack-up-first-try.sql` before publishing; the private receipt validator and score reader support both v3 and v4. Archive: `content/archive/2026-11-05-pre-stack-first-try/`. Earlier scoring entries below are historical.

## Current score display — 5 November 2026

Fresh runs use scoreVersion 3: each completed stack scores out of 100 and Daily takes the unrounded mean of all five. Net existing base credit (earned minus 30 per mistake) is divided by the round maximum 550 + 35 × zero-based round index, multiplied by 100 and clamped; a timeout scores zero. Existing 90-second deadlines, sorting controls and streak mechanics stay. Saved older runs keep their original final normalized result and raw points; they are never regraded. Apply `supabase/stack-up-score100.sql` before the frontend. Main results, round feedback, summaries, share text and profile cards use the single 0–100 scale. The other seven games are unchanged. Earlier native-point documentation below describes the preserved storage/legacy contract.

## Stack Up without numerical trivia or time-unit tasks — owner correction, 27 October 2026

The owner explicitly wants to keep ordering films/books by release and historical events by date, while removing maths, number facts and time-unit questions. New Dailies replace 32 weekday/month/duration slots and eight continent-area slots with story, nature, crafting and everyday-process ordering. Keep the other 120 familiar stacks, all 160 IDs, five 32-item lanes and their exact Daily assignments.

Unlimited replaces 105 atomic-number, melting-point, density, area, coordinate and elevation slots with plot, quest, route and process ordering. `content/stack-up-familiar-challenge-topics.json` defines the replacements; `scripts/build-familiar-stacks.cjs` emits them alongside the familiar bank and `content/stack-up-familiar-challenge-audit.json`. The original 208-row `stacks.js` stays frozen; the engine overlays replacements by ID before selecting new practice. Challenge mix remains 134 stacks, Familiar stays 160, and the 74 old NUMBER SENSE stacks stay excluded from every filter.

Do not rewrite captured Dailies or old scoring. `content/archive/2026-10-27/stack-up-familiar-stacks.js` preserves the prior familiar bank. Test every Unlimited filter, 32-day content/date-slot continuity, reproducible source generation and old numerical/time-unit snapshot completion. No SQL update or save reset is required. See `design/content-reviews/2026-10-27-stack-up.json`.

# Stack Up — familiar defaults and base points

The owner asked for familiar subjects, direct entry and removal of the Daily 10× bonus. See [PLAYTEST-FEEDBACK.md](../../PLAYTEST-FEEDBACK.md).

A fresh page opens the current Daily immediately; saved reviews/results resume. There is no launch screen. Each stack has a 90-second wall-clock deadline, including while help is open or another mode is active. Sydney rollover opens the next saved/fresh Daily directly. Dragging, arrow buttons, keyboard sorting, transient position feedback and the canonical shell remain.

## Content

`familiar-stacks.js` has 160 curated non-maths defaults: 32 in each of five stable lanes (everyday/calendar; planets/nature/world; recognisable films; games/history/sport; books/animation/music/space). Fresh Dailies from 23 October 2026 use one per lane with 32-day repeat-free rotation. `scripts/build-familiar-stacks.cjs` reproduces the bank and `content/stack-up-familiar.json` audit. The authored replacement families are in `content/stack-up-familiar-topics.json`. On 26 October, 64 calculation/fraction stacks and 16 conversion drills were replaced in place, preserving every ID and date slot.

The original 208-set `stacks.js` remains unchanged. Unlimited defaults to Familiar mix; Challenge mix offers its 134 non-maths stacks. All filters exclude the 74 legacy NUMBER SENSE stacks, and that retired topic is hidden. The original data remains solely for compatibility; saved snapshots may still contain maths and are not rewritten. Changes apply to the next stack. Today's snapshots are excluded; active practice survives mode changes. Blank descriptions and shuffled card order remain.

## Scoring and compatibility

New runs retain outer `version:2` and add `scoreVersion:2`. Both modes award `100 + seconds × 5 + streak × 35` for a correct stack, −30 for a wrong submission and −40 for timeout. Five immediate clean Dailies total 3,100. Arcade score is points ÷3,100 ×100, bounded to 0–100.

Untagged old runs and explicit `scoreVersion:1` preserve original Daily points/penalties and the 31,000 denominator, including unfinished saved runs. Stored native scores and question snapshots are never rewritten. V1 bank recovery remains intact. Header/stats compare Arcade results; profile history preserves native points and uses the correct per-run Arcade denominator.

`arcade-score.js`, `profile-records.js` and the private SQL scorer share this version policy. Before publishing to an existing Supabase project, apply `supabase/playtest-feedback.sql` after the prior Inner Clock update, or the updated complete `inner-clock.sql`. Fresh setup/current Friends includes it. No new storage prefix, upload consent or raw friend access is introduced.

Tests cover new/old scores and SQL parity, direct entry, content sources and rotation, pending/complete snapshots, first-answer feedback, wall-clock reload/rollover, all input methods, mode continuity, menus/dialogs and responsive widths. Another human playtest must assess the new difficulty; structural tier labels are not measured solve rates.
