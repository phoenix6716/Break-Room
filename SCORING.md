# Break Room Arcade score — version 1

Every completed Daily has a shared **0–100 Arcade score**, alongside its original game score. Chips, points, deadlines, penalties, saved runs and game-specific achievements remain unchanged. `arcade-score.js` is the single calculator for the result screens and read-only profile adapters. Values are kept at full precision for averages and displayed to at most one decimal place.

| Game | Arcade score | Examples |
| --- | --- | --- |
| Lowball | The existing completed Daily average | 75 points → 75/100 |
| Stake | `100 × chips staked on correct answers ÷ total chips staked` | Five correct 1-chip bets → 100/100 and +5 chips. Three correct out of five equal bets → 60/100. All wrong/timeouts → 0/100. |
| Pack | `100 × total usefulness earned ÷ total optimal usefulness across three bags` | 72 of 90 usefulness → 80/100. All three optimal → 100/100. |
| Alibi | `25 × correct first accusations` | 3/4 correct → 75/100; all wrong → completed 0/100. No speed bonus. |
| Laser | `25 × first-fire hits` | 3/4 hits → 75/100; unscored retries never change it. |
| Prior | `20 × correct earlier-event choices` | 4/5 correct → 80/100. All wrong → a completed 0/100. |
| Stack Up | `100 × Daily points ÷ 31,000`, bounded to 0–100 | 15,500 points → 50/100. 31,000 → 100/100. Zero or negative points → 0/100. |

Stake measures weighted accuracy, not net profit divided by the largest possible profit. A correct 3-chip bet contributes three times the weight of a correct 1-chip bet; incorrect answers and timeouts contribute their bet to the denominator but nothing to the numerator. Correctly answering every question scores 100 regardless of the stakes selected. Native chip profit remains visible and the +15-chip achievement keeps its original requirement.

Stack Up's maximum is five immediate correct stacks: `(100 + 90 × 5 + streak × 35) × 10` for streaks 0 through 4, totalling 31,000. Speed, stack streaks, wrong attempts and timeout penalties still determine the native points. Negative runs remain visible in native points even though their Arcade score is bounded at zero.

Pack is untimed. Its exact solver derives each maximum from the versioned saved puzzle, not a mutable current bank or self-reported score. Native totals can vary with the bags, so normalized totals are used for comparisons. Empty, overweight, incomplete or malformed submitted runs do not create results.

## A reliable calculation, with an explicit sample

The profile uses **120 Sydney calendar dates, including today**, for every game's Arcade average. Lowball only retains around four months of dated results, so using all available years of the other games would give different time ranges.

1. Select completed, valid Daily records within that common window. Exclude practice, pending runs, missing/invalid results and future dates.
2. Compute each game's mean Arcade score from those records, without rounding intermediate values.
3. Average the means of games with at least one included result. Each game has equal weight, independent of how often it was played.
4. Show the number of games and completed results supporting the average. A real zero counts; an unplayed game does not count as a zero. No included results means “—”.

For example, 100 Lowball runs averaging 80, one Stake run scoring 0 and one Stack Up run scoring 50 produce `(80 + 0 + 50) / 3 = 43.3`, rather than letting Lowball dominate the result count. If only Lowball has results, the average is based on **1 of 7 games**, clearly labelled.

This is a deterministic shared performance scale. It is not a player percentile or evidence that all games have identical difficulty. Difficulty calibration would need real player outcome data. Browser storage may omit older results; neither old lifetime counters nor missing days are invented into score history.

## Compatibility and future games

Existing saves are read without alteration and historical Arcade scores are derived from the actual saved data. Stake uses its question snapshots (or frozen legacy option permutations), not current questions. The profile does not import game engines or trigger their replay resets. Lowball lifetime play counts remain separate from the number of recent scored records used by the average.

Future games must provide a documented deterministic 0–100 Daily calculation, preserve native score meaning where appropriate, expose the shared result alongside native values, and register a read-only record adapter. Include endpoint, penalty, pending/timeout, historical compatibility and precision tests. Do not assign arbitrary demo values. Keep version 1 formulas stable; any later scoring change needs explicit versioning and a considered history policy.

Tests: `node tests/arcade-score.cjs`, `node tests/profile-records.cjs`, and `ARCADE_TEST_URL=http://127.0.0.1:8000 node tests/arcade-score-ui.cjs` / `node tests/profile.cjs` with the static server running.

## Private friend comparisons

`supabase/friends.sql` derives version 1 completed Daily scores server-side from private synced snapshots and returns only normalized score records to authorized friends. `friends.js` aggregates those records with the same `BREAK_ROOM_SCORE.summary` used by the profile. Today uses the server's Sydney date; historical comparisons use that date and the same 120-day window. The UI shows game/run sample counts and distinguishes missing results from genuine zeroes. SQL/JavaScript parity, including frozen legacy Stake shuffles and nonuniform bets, is covered by `tests/friends-database.cjs`. Cloud history may preserve older Lowball records; the common comparison window remains 120 days. See `FRIENDS.md` for sharing and data boundaries.

Pack validation, independent optima and SQL parity are covered by `tests/pack-rules.cjs`; its engine/profile/sharing and responsive flow by `tests/pack.cjs`. Current existing projects apply `supabase/alibi.sql` last for Pack/Prior cloud/Friends support.

Prior keeps five untimed binary comparisons and native correct choices out of five. Its snapshot dates determine correctness, not a mutable current bank or stored score field. A zero completion counts; partials and Unlimited are excluded. The fifth answer completes the Daily even if its final review is still open. `tests/prior-rules.cjs` covers all 32 correctness patterns, all six Arcade outcomes and SQL parity; `tests/prior.cjs` covers actual result/profile/copy integration. Prior’s chance baseline and coarse 20-point steps differ from other games; the shared scale remains a transparent performance calculation, not proof of equal difficulty. Existing projects apply `supabase/alibi.sql` last.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/alibi.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi addition — current integration and migration

Alibi is the seventh integrated game, with 144 solver-checked distinct deduction cases, personal ungraded notes, four untimed graded Dailies, final confirmed accusations, concise and expandable reasoning, and independent free Changing/fixed-tier Unlimited. See `games/alibi/README.md` for the exact mechanics, snapshot contract, seven design changes and checks. Native score is correct out of four; Arcade is correct × 25. Real zeroes count; partials and practice do not. The common profile/Friends average now has **seven** available games; Case closed requires four correct and older achievements keep their meanings.

**Current Supabase update: run all of `supabase/alibi.sql` LAST** (includes Pack, Prior and Laser). This supersedes earlier migration pointers above. Fresh projects use current setup then Friends. Do not reapply older narrower migrations. Local tests do not apply live SQL or prove public deployment. Personal notebook data stays inside private native/cloud saves; friend comparisons expose only completed normalized results through the existing sharing controls. The original prototype is archived outside the build. No billing or other collection game was enabled. Structural tiers still need human playtesting before launch.
