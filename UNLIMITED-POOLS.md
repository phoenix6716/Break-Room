# Unlimited pool audit — 13 November 2026

This inventory counts the content actually selected by the current engines, not every archived entry retained in source. Counts describe available challenges/targets, not a promise of authored variety or hours of play. Today's Daily captures are held out; a retained older capture can change the eligible count.

| Game | Current active pool | Eligible on 13 November | Selection notes |
| --- | ---: | ---: | --- |
| Laser | 136 boards | 132 | 40 Warm-up; 32 each Standard, Tricky and Expert. The other 208 stored boards are retained for compatibility and do not inflate this count. |
| Time Drop | 330 events | 325 | Topic and period filters make smaller pools. |
| Clue Ladder | 300 puzzles | 295 | Eight topic filters; fixed answers and clue sets. |
| Seating Chart | 360 tables | 357 | Current v3 request variety only; 72 per tier. Another 360 legacy tables remain in source. |
| Desk Jam | 180 boards | 177 | 20 Starter, 80 Easy, 40 Medium, 40 Hard. Default Easy has a smaller pool than Mixed. |
| Codebreak | 10,000 codes | 9,999 | Four digits, 0–9, repeats allowed. These are mathematical combinations, not 10,000 authored puzzle stories. |
| Stack Up | 90 distinct practice themes | 85 | 80 familiar themes plus 10 challenge themes after prompt/theme deduplication. Stored five-card variants do not count as extra themes. |
| Pack | 272 bags | 269 | 100 Easy, 100 Medium, 72 Hard. Sixty older hard bags are excluded by the engine's ten-item requirement. |
| Lowball | 128 items | 124 | Countries change the reference price, not the number of distinct products. |
| Time Sense | 101 targets | 98 | 2–12 seconds in 0.1-second steps: 21 Short, 40 Medium, 40 Long. Daily also uses half steps; only three Daily targets overlap this practice deck on the audit date. This is repeatable timing practice rather than a finite set of factual answers. |

Reproduce the inventory with `node scripts/audit-unlimited-pools.cjs 2026-11-13`. Omit the date to use the current Sydney date. Existing snapshot compatibility is preserved; the audit reads source banks without player storage or network access.

## Weekly selection — 14 November 2026

The full-library inventory above remains accurate; it is not the weekly selection size. The owner approved a disclosed selection of **up to 100 unseen challenges per game per week**, with no remaining-pool counter during ordinary play and unlimited labelled replays. The plans page and purchase terms explain this before payment. Smaller libraries, filters, Daily exclusions and prior play can leave fewer unseen challenges.

Selections refresh on Monday at midnight Australia/Sydney. `unlimited-library.js` records the actual selected IDs under `break-room:weekly-selection:v1:<owner>:<game>` and preserves them across reloads and filter changes. The selection is shared across a game's filters, rather than giving each filter a separate 100-question allowance. Group-balanced selection preserves topic/difficulty variety. Current Daily captures are held out by each native engine.

The existing lifetime practice ledger, `break-room:unlimited-library:v1:<owner>:<game>`, is preserved. A new week chooses previously unseen IDs; it does not clear that ledger or pretend that a rotated old question is newly authored. Previously seen challenges remain available as replays, including those outside the current weekly selection. Genuine additions can fill unused weekly slots; further additions wait for the next selection if all 100 slots are already assigned. A genuine catalogue replacement cannot strand play if every selected and previously seen challenge has been retired.

During fresh play the UI shows only a small new-challenge badge, without a numeric remaining counter. Replays are labelled. When the eligible selection is exhausted, the message says there are no further unseen challenges in this week's selection for those settings today, rather than falsely claiming that the entire source bank is empty. The final newly shown challenge is identified as the last currently available unseen challenge; replays remain playable.

History tracks challenges shown in Unlimited, not solved or completed. Historical Daily plays and earlier unsaved practice are not imported. History is per account on this browser, not a synced cross-device or anti-tampering quota. Clearing browser data or unavailable storage can change the selection/history; storage failures are disclosed. Corrupt records are preserved. Weekly localStorage writes are advisory, not an atomic cross-device service. Codebreak retains its locked IndexedDB reservations for concurrent code draws.

Native Daily saves, immutable answers/scores, captured active rounds, running timers, game IDs, paid-access checks and visibility choices remain unchanged. Lowball carries eligible pending queue items into new sessions and preserves a current captured item; a new week does not discard a submitted guess or finished-session summary. New future items use the current weekly eligibility.

## Content update procedure

1. Review the smallest or most replayed banks first: Stack Up, Lowball and Laser. Review difficulty/topic filters as well as total counts. More Time Sense durations or Codebreak combinations alone are not equivalent to new authored content.
2. Add reviewed content with fresh, stable identifiers (fresh themes for Stack Up). Never repurpose an existing ID for a changed puzzle, rewrite captured rounds, erase saves, or reset player history merely to call old content new.
3. Use the relevant content source/generator and run its existing content, solver, calendar, snapshot and affected engine checks. Some Daily models require fixed bank sizes; do not append indiscriminately or silently change Daily rotations. Separate additive practice banks are an option when the Daily contract is fixed.
4. Re-run this inventory, update this table, publish and verify the live build. Fresh IDs count as unseen and become eligible for a weekly selection. Unused weekly slots can fill immediately; an already full selection waits until the next Sydney Monday. Existing replays remain known.
5. Review inventory and player feedback weekly and target regular reviewed content releases, prioritising genuine new subject matter and challenges. Weekly selection rotation is automatic; authoring, reviewing and publishing additional content remain separate work. A calendar change does not create new content. Announce a content update only after the actual new challenges are available.

Verification includes all ten actual fresh/exhausted/replay entries, reload and theme checks, native Daily preservation, filter-scoped pure history tests, new identifiers after exhaustion, owner separation, corrupt history preservation and unavailable storage. Viewport testing is not a substitute for a physical-device playtest.
