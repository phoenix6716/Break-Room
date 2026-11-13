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

## Player behaviour

The owner selected an exhaustion message with continued replays, not a weekly play cap. Each Unlimited engine shows unseen/available counts for its current next-round settings. Once every eligible identifier has been shown, it says **Current pool exhausted**; repeats are labelled **REPLAY**. Counts mean shown in the recorded Unlimited history, not solved or completed. Historical Daily plays are not imported into this separate practice ledger. Narrow filters can exhaust while other filters still contain unseen content. Today's held-out Daily ingredients are not reported as available Unlimited content.

New advisory history uses `break-room:unlimited-library:v1:<owner>:<game>` and a tab-local current-round marker. It is separate from native Daily saves, scoring, billing and cloud records. It survives ordinary reloads on the same browser and stays separate for different games/accounts. It does not grant membership access. Clearing browser data or changing device does not preserve this history. Earlier unsaved practice cannot be reconstructed. Codebreak can also import the codes its existing local reservation history already knows.

The existing first-fire/guess/score mechanics, active snapshots, Daily exclusions and timers remain. Current eligible unseen items are preferred when drawing from the authored decks. After exhaustion, existing shuffled replay selection remains available; it does not reset the ever-shown ledger. Codebreak retains its existing locked IndexedDB reservation mechanism. Lowball's existing session finish/restart behaviour remains available.

History is advisory rather than an anti-tampering limit. Sequential tabs merge stored knowledge, but simultaneous localStorage writes are not an atomic cross-device progress service. Corrupt tracking history is preserved and the UI warns when tracking is not durable; blocked storage falls back to in-memory tracking.

## Content update procedure

1. Review the smallest or most replayed banks first: Stack Up, Lowball and Laser. Review difficulty/topic filters as well as total counts. More Time Sense durations or Codebreak combinations alone are not equivalent to new authored content.
2. Add reviewed content with fresh, stable identifiers (fresh themes for Stack Up). Never repurpose an existing ID for a changed puzzle, rewrite captured rounds, erase saves, or reset player history merely to call old content new.
3. Use the relevant content source/generator and run its existing content, solver, calendar, snapshot and affected engine checks. Some Daily models require fixed bank sizes; do not append indiscriminately or silently change Daily rotations. Separate additive practice banks are an option when the Daily contract is fixed.
4. Re-run this inventory, update this table, publish and verify the live build. Fresh IDs automatically count as unseen after the updated bank loads; existing replays remain known.
5. Review inventory and player feedback weekly. Plan small reviewed batches regularly, prioritising genuine new subject matter and challenges. No automatic content generation, scheduled publication or guaranteed release date is enabled by this change. Announce an update only after its content is available.

Verification includes all ten actual fresh/exhausted/replay entries, reload and theme checks, native Daily preservation, filter-scoped pure history tests, new identifiers after exhaustion, owner separation, corrupt history preservation and unavailable storage. Viewport testing is not a substitute for a physical-device playtest.
