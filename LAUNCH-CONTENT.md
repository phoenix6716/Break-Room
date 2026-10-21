# Launch content release

Proposed cutover: 23 October 2026, midnight Australia/Sydney. All changes remain in draft PR #3 until checked and reviewed; this document is not evidence of deployment.

## Banks and challenge

| Game | Bank after change | Fresh Daily / hardest practice |
| --- | --- | --- |
| Stake | Original 164 frozen rows + 100 sourced additions, unchanged | Four general questions, then a Chemistry/Literature question from the sourced additions; topic practice retains the complete bank. |
| Stack Up | 208 sets: original 112 + 64 exact-fraction comparisons + 32 additional sourced combinations | Four existing-style sets and one close-fraction challenge; topic practice includes all sets. |
| Pack | 212 bags: 60 easy, 60 medium, 60 original hard + 32 advanced hard | New hard rounds use ten items, a unique optimum and at least 14% loss for the usefulness/weight greedy strategy. Easy/medium stay intact. |
| Prior | Same 128 scoped events | Last two comparisons and hard practice use 1–3-year gaps; easy/medium, distinct events per Daily and related-family exclusions stay intact. A fixed 32-day deck avoids repeated pairings. |
| Laser | 248 boards: original 120 easier + 96 previous Experts + 32 advanced Experts | New Expert routes use the same three-mirror budget, at least 24 traced cells and five visited fixed mirrors, a unique solution and no lower-budget shortcut. |
| Alibi | 155 cases: 33 per easier tier, 24 previous Experts + 32 advanced Experts | New Experts require at least six clues even after checking every possible subset, with both accounts and evidence necessary. Five suspects and the same truthful-account contract remain. |
| Bouncer | 272 doors: original 240 + 32 advanced Experts | Fresh Daily uses Standard then Expert. Expert practice uses the new target lists, which exercise all four truth combinations of the two existing rule properties. All 48 rule meanings and easier practice tiers remain. |
| Lowball | Same 100 products, generated artwork and inherited prices | Preserve the existing item cycle. Different four-product Dailies cover a month; individual products recur after a full pool. Independent price verification remains a launch blocker. |
| Inner Clock | Deterministic timing-target combinations | Retain the existing short/medium/long ranges and scoring. Longer waiting is not claimed as deeper gameplay; physical-device input and human challenge calibration remain outstanding. |

These are objective structural increases, not calibrated human solve rates. The per-game audit explains remaining design weaknesses and improvement opportunities.

## Compatibility and selection

- Current and earlier Dailies retain their old bank selections. New runs snapshot their actual questions, boards, targets and choices; existing snapshots are never replaced by a bank lookup.
- New rotation holds out the cutover-eve puzzles and supplies 32 further distinct Dailies. Tests also cover later rolling windows, bank reversal and old snapshots.
- Native save keys, outer versions, Arcade formulas, first-answer finality, timer deadlines, account consent and private Friends boundaries are unchanged.
- Alibi's original clue heuristic is kept only to reproduce the frozen bank. It was a greedy sufficient-set estimate, not a proof of the smallest sufficient set. New Expert generation and regression checks exhaustively enumerate subsets.
- A new bank does not prove live Supabase configuration. The existing complete Inner Clock migration handles the unchanged snapshot contracts; no new SQL migration is introduced here.
- Lowball products and timing durations may recur in different sets. This release does not claim 128 independently priced products or 32 entirely new timing ingredients.

## Regeneration and verification

Run the existing baseline generator for a game as documented, or `node scripts/build-launch-content.cjs GAME` to reproduce only its additions. Supported GAME values: `pack`, `laser`, `alibi`, `bouncer`, `stack-up`. The extension removes only its own generated additions before rebuilding them and keeps original IDs/data.

The full `npm test` suite must pass at the final PR head: content inventory, independent arithmetic/solvers, native saves, PostgreSQL score/security parity, reference/build checks, all game journeys and the new release-window contract. See [the audit](LAUNCH-AUDIT.md) and [ordered launch checklist](LAUNCH-CHECKLIST.md) for human, device, factual and production gates. Do not mark those gates complete from a mocked browser run.
