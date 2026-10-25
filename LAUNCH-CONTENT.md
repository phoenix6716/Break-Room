# Current ten-game Daily coverage — 25 October 2026

Read [DAILY-CONTENT.md](DAILY-CONTENT.md) for the verified current inventory and 32-day coverage check. It supersedes the older nine-game roster, generic bank-reversal claim and full-suite/PR instructions below. The eight puzzle/question games have at least 32 days without individual repeats. Lowball reuses products after a 25-day pool and Time Sense reuses durations; their full Daily sets remain distinct in the checked windows. Existing saves, scoring and content are unchanged. Use focused checks and the authorised automatic-publication workflow.

# Launch content release

The original content release was merged. Player feedback on 23 October supersedes the Alibi/Stack Up defaults below; see `PLAYTEST-FEEDBACK.md`. New feedback changes remain in their own PR and require updated SQL before deployment.

## Banks and challenge

| Game | Bank after change | Fresh Daily / hardest practice |
| --- | --- | --- |
| Stake | Original 164 frozen rows + 100 sourced additions, unchanged | Four general questions, then a Chemistry/Literature question from the sourced additions; topic practice retains the complete bank. |
| Stack Up | 160 familiar default stacks +208 preserved optional challenges | Five familiar lanes with a gentler progression; Challenge mix/topic practice retain the harder bank. Direct entry; new runs use base points, not a 10× Daily multiplier. |
| Pack | 212 bags: 60 easy, 60 medium, 60 original hard + 32 advanced hard | New hard rounds use ten items, a unique optimum and at least 14% loss for the usefulness/weight greedy strategy. Easy/medium stay intact. |
| Prior | Same 128 scoped events | Last two comparisons and hard practice use 1–3-year gaps; easy/medium, distinct events per Daily and related-family exclusions stay intact. A fixed 32-day deck avoids repeated pairings. |
| Laser | 248 boards: original 120 easier + 96 previous Experts + 32 advanced Experts | New Expert routes use the same three-mirror budget, at least 24 traced cells and five visited fixed mirrors, a unique solution and no lower-budget shortcut. |
| Alibi | 128 new physical-evidence cases; 155 visit files retained for compatibility | Four evidence mechanisms per Daily, verified clues, assignment notes and actual deduction proofs. New Expert files require five independently necessary constraints; older snapshots retain their own rules. |
| Bouncer | 272 doors: original 240 + 32 advanced Experts | Fresh Daily uses Standard then Expert. Expert practice uses the new target lists, which exercise all four truth combinations of the two existing rule properties. All 48 rule meanings and easier practice tiers remain. |
| Lowball | Same 100 products/artwork with 400 dated regional references | The factual/price audit is deployed; fresh references start 24 October Sydney. Preserve captured old targets and recheck volatile references before public launch. |
| Inner Clock | Deterministic timing-target combinations | Retain the existing short/medium/long ranges and scoring. Longer waiting is not claimed as deeper gameplay; physical-device input and human challenge calibration remain outstanding. |

These are objective structural increases, not calibrated human solve rates. The per-game audit explains remaining design weaknesses and improvement opportunities.

## Compatibility and selection

- Current and earlier Dailies retain their old bank selections. New runs snapshot their actual questions, boards, targets and choices; existing snapshots are never replaced by a bank lookup.
- New rotation holds out the cutover-eve puzzles and supplies 32 further distinct Dailies. Tests also cover later rolling windows, bank reversal and old snapshots.
- Native save keys and outer versions stay unchanged; Alibi scoring stays unchanged and Stack Up uses explicit per-run score versions. First-answer finality, timer deadlines, account consent and private Friends boundaries remain unchanged.
- Alibi's original clue heuristic is kept only to reproduce the frozen bank. It was a greedy sufficient-set estimate, not a proof of the smallest sufficient set. New Expert generation and regression checks exhaustively enumerate subsets.
- A new bank does not prove live Supabase configuration. Apply `playtest-feedback.sql` after the prior Inner Clock update, or use the updated complete Inner Clock SQL, for new Alibi and Stack Up score-version comparisons.
- Lowball products and timing durations may recur in different sets. This release does not claim 128 independently priced products or 32 entirely new timing ingredients.

## Regeneration and verification

Run the existing baseline generator for a game as documented, or `node scripts/build-launch-content.cjs GAME` to reproduce only its additions. Supported GAME values: `pack`, `laser`, `alibi`, `bouncer`, `stack-up`. The extension removes only its own generated additions before rebuilding them and keeps original IDs/data.

The full `npm test` suite must pass at the final PR head: content inventory, independent arithmetic/solvers, native saves, PostgreSQL score/security parity, reference/build checks, all game journeys and the new release-window contract. See [the audit](LAUNCH-AUDIT.md) and [ordered launch checklist](LAUNCH-CHECKLIST.md) for human, device, factual and production gates. Do not mark those gates complete from a mocked browser run.

Changed models, banks and engines use a shared release query in HTML so a refreshed page does not combine a cached previous bank with a new rotation.
