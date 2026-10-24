# Break Room Arcade score — version 1

## Current release: Hidden Gem

Hidden Gem is the tenth active game, after Seating Chart. It has five 30-second Daily questions, one input with retries for unlisted answers, individual 1–100 editorial answer ratings, and a five-question average out of 100 for both native and Arcade scores. Its 160 scoped questions / 1,004 answers provide 32 Daily sets and free nonrepeating Unlimited practice. See [the current contract](games/hidden-gem/README.md).

Existing saves and archived games remain supported: thirteen native formats. Apply [supabase/hidden-gem.sql](supabase/hidden-gem.sql) after setup/Friends. This creates only Hidden Gem’s private table/RPCs; the older shared save and Friends functions are unchanged. Fresh installation is setup.sql → friends.sql → hidden-gem.sql. Older roster counts and “complete installer” statements below are historical and superseded for this release. Live database and Pages status must be verified separately from CI.


## Previous release: Seating Chart

Nine active games and twelve supported native cloud formats including archives. Seating Chart adds five untimed Daily seating puzzles, 360 frozen tables / 72 Daily sets, immediate draft saving and free Unlimited. Read [its current contract](games/seating-chart/README.md) for scoring, accessibility, save/schema and verification details. This supersedes older roster counts below; prior game contracts remain compatibility documentation.


## Clue Ladder — owner-approved build, 23 October 2026

Clue Ladder is the eighth active game: Laser → Time Drop → Clue Ladder → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain archived; eleven native save formats are supported. This supersedes older roster counts below.

Five untimed Daily puzzles use five progressively clearer clues. Solves on clue 1 / 2 / 3 / 4 / 5 earn 1,000 / 800 / 600 / 400 / 200 points; unsolved earns zero. Maximum 5,000 native points, Arcade = points / 50. No speed penalty, Daily multiplier, hearts, intro screen or live AI. Preserve the ladder and pixel climber inside the centred Stake shell with ?-only help. Read `games/clue-ladder/README.md`.

The 300 distinct, editorially reviewed familiar answers span eight topics and provide 60 nonrepeating Daily sets, each with five different topics. References and automation do not establish independent primary-source certification or human difficulty calibration. Save input, hints, attempts and frozen puzzle snapshots immediately; first completion wins. Owner-scoped tab-local Unlimited excludes today's five answers, applies topic changes next puzzle and reshuffles after eligible-pool exhaustion.

Existing Time Drop projects apply `supabase/clue-ladder.sql`; updated complete `supabase/inner-clock.sql`, or fresh setup then friends, also includes it. Verify live SQL and deployment separately. Preserve existing saves, scores, artwork and archived routes.


## Time Drop — owner direction, 23 October 2026

Time Drop replaces Prior in the active lineup: Laser → Time Drop → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain shelved with their engines, sources and historical saves preserved. Seven active games; ten supported native save formats including archives.

The owner requested no hearts anywhere in Time Drop, reasonable partial-credit scoring, expanded/balanced content, reliable saves and locked answers, a large ongoing Unlimited mode (never call it Endless), and the canonical Stake layout. Read `games/time-drop/README.md` for the exact 330-event/66-day deck, fixed era-based linear scoring, accepted date ranges, native 5,000-point / Arcade 100-point scales for new five-round Dailies (version 2); original ten-round version 1 saves retain their 10,000-point scale, first-lock saves and tab-owned practice. Preserve Prior's source and legacy results rather than reinterpreting them. Keep the original uploaded prototype outside the production artifact.

Existing live projects apply `supabase/time-drop.sql` after the current Inner Clock/player-feedback migration. For an already-enabled Time Drop project, apply `supabase/time-drop-five-rounds.sql` to support both run lengths. Updated `supabase/inner-clock.sql` includes it; fresh setup then friends supports all ten formats. Do not reapply historical narrower migrations. Publication is already authorised automatically after affected checks; verify live SQL separately from CI and deployment.

Every completed Daily has a shared **0–100 Arcade score**, alongside its original game score. Chips, points, deadlines, penalties, saved runs and game-specific achievements remain unchanged. `arcade-score.js` is the single calculator for the result screens and read-only profile adapters. Values are kept at full precision for averages and displayed to at most one decimal place.

| Game | Arcade score | Examples |
| --- | --- | --- |
| Inner Clock | Mean of five `max(0,100*(1-absoluteMiss/(target*.25)))` round scores | 5% miss → 80/100. Native average absolute miss in seconds is lower-is-better. |
| Bouncer | `(correct − tests/2) ÷ 16 × 100` | 16 correct with 2 tests → 93.75/100. |
| Lowball | The existing completed Daily average | 75 points → 75/100 |
| Stake | `100 × chips staked on correct answers ÷ total chips staked` | Five correct 1-chip bets → 100/100 and +5 chips. Three correct out of five equal bets → 60/100. All wrong/timeouts → 0/100. |
| Pack | `100 × total usefulness earned ÷ total optimal usefulness across three bags` | 72 of 90 usefulness → 80/100. All three optimal → 100/100. |
| Alibi | `25 × correct first accusations` | 3/4 correct → 75/100; all wrong → completed 0/100. No speed bonus. |
| Laser | `25 × first-fire hits` | 3/4 hits → 75/100; unscored retries never change it. |
| Prior | `20 × correct earlier-event choices` | 4/5 correct → 80/100. All wrong → a completed 0/100. |
| Stack Up | `100 × Daily points ÷ 3,100` for scoreVersion 2; original saved runs use 31,000; bounded to 0–100 | 1,550 new points → 50/100. 3,100 → 100/100. Original 15,500/31,000 still gives 50/100. Zero or negative points → 0/100. |

Stake measures weighted accuracy, not net profit divided by the largest possible profit. A correct 3-chip bet contributes three times the weight of a correct 1-chip bet; incorrect answers and timeouts contribute their bet to the denominator but nothing to the numerator. Correctly answering every question scores 100 regardless of the stakes selected. Native chip profit remains visible and the +15-chip achievement keeps its original requirement.

Stack Up's new maximum is five immediate correct stacks: `100 + 90 × 5 + streak × 35` for streaks 0 through 4, totalling 3,100. New runs carry `scoreVersion:2`, use −30 wrong submissions and −40 timeouts, and have no Daily multiplier. Untagged/scoreVersion 1 saved runs retain their original tenfold scale and 31,000 denominator, including unfinished runs; historical native scores are not rewritten. Header/stats use comparable Arcade results. See `PLAYTEST-FEEDBACK.md` for the player decision and required SQL update.

Pack is untimed. Its exact solver derives each maximum from the versioned saved puzzle, not a mutable current bank or self-reported score. Native totals can vary with the bags, so normalized totals are used for comparisons. Empty, overweight, incomplete or malformed submitted runs do not create results.

## A reliable calculation, with an explicit sample

The profile uses **120 Sydney calendar dates, including today**, for every game's Arcade average. Lowball only retains around four months of dated results, so using all available years of the other games would give different time ranges.

1. Select completed, valid Daily records within that common window. Exclude practice, pending runs, missing/invalid results and future dates.
2. Compute each game's mean Arcade score from those records, without rounding intermediate values.
3. Average the means of games with at least one included result. Each game has equal weight, independent of how often it was played.
4. Show the number of games and completed results supporting the average. A real zero counts; an unplayed game does not count as a zero. No included results means “—”.

For example, 100 Lowball runs averaging 80, one Stake run scoring 0 and one Stack Up run scoring 50 produce `(80 + 0 + 50) / 3 = 43.3`, rather than letting Lowball dominate the result count. If only Lowball has results, the average is based on **1 of 9 games**, clearly labelled.

This is a deterministic shared performance scale. It is not a player percentile or evidence that all games have identical difficulty. Difficulty calibration would need real player outcome data. Browser storage may omit older results; neither old lifetime counters nor missing days are invented into score history.

## Compatibility and future games

Existing saves are read without alteration and historical Arcade scores are derived from the actual saved data. Stake uses its question snapshots (or frozen legacy option permutations), not current questions. The profile does not import game engines or trigger their replay resets. Lowball lifetime play counts remain separate from the number of recent scored records used by the average.

Future games must provide a documented deterministic 0–100 Daily calculation, preserve native score meaning where appropriate, expose the shared result alongside native values, and register a read-only record adapter. Include endpoint, penalty, pending/timeout, historical compatibility and precision tests. Do not assign arbitrary demo values. Keep version 1 formulas stable; any later scoring change needs explicit versioning and a considered history policy.

Tests: `node tests/arcade-score.cjs`, `node tests/profile-records.cjs`, and `ARCADE_TEST_URL=http://127.0.0.1:8000 node tests/arcade-score-ui.cjs` / `node tests/profile.cjs` with the static server running.

## Private friend comparisons

`supabase/friends.sql` derives version 1 completed Daily scores server-side from private synced snapshots and returns only normalized score records to authorized friends. `friends.js` aggregates those records with the same `BREAK_ROOM_SCORE.summary` used by the profile. Today uses the server's Sydney date; historical comparisons use that date and the same 120-day window. The UI shows game/run sample counts and distinguishes missing results from genuine zeroes. SQL/JavaScript parity, including frozen legacy Stake shuffles and nonuniform bets, is covered by `tests/friends-database.cjs`. Cloud history may preserve older Lowball records; the common comparison window remains 120 days. See `FRIENDS.md` for sharing and data boundaries.

Pack validation, independent optima and SQL parity are covered by `tests/pack-rules.cjs`; its engine/profile/sharing and responsive flow by `tests/pack.cjs`. Current existing projects apply `supabase/alibi-scenarios.sql` last for Pack/Prior cloud/Friends support.

Prior keeps five untimed binary comparisons and native correct choices out of five. Its snapshot dates determine correctness, not a mutable current bank or stored score field. A zero completion counts; partials and Unlimited are excluded. The fifth answer completes the Daily even if its final review is still open. `tests/prior-rules.cjs` covers all 32 correctness patterns, all six Arcade outcomes and SQL parity; `tests/prior.cjs` covers actual result/profile/copy integration. Prior’s chance baseline and coarse 20-point steps differ from other games; the shared scale remains a transparent performance calculation, not proof of equal difficulty. Existing projects apply `supabase/alibi-scenarios.sql` last.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/bouncer.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi evidence files — current contract (v3)

New games use **128 evidence-led files**, 32 per tier, across stamp matches, paired badge permissions, inventory differences and seal custody. All observations are verified; players match the physical evidence to a catalogue entry and deduce its owner. Each fresh Daily uses all four methods, with a 32-day rotation. Assignment notes are ungraded, and reveals explain the evidence match and deductions. Four untimed cases, first-confirmation finality and correct × 25 Arcade scoring remain.

The 155 v2 visit scenarios and original v1 snapshots retain their original rules, notes, choices and scores. The existing eight-person portrait atlas is unchanged. See [the current Alibi contract](games/alibi/README.md) and [the player-feedback release](PLAYTEST-FEEDBACK.md) for sources, validation and limits.

Before deploying this release to an existing project, apply **`supabase/playtest-feedback.sql` after the previous Inner Clock migration**, or use the updated complete `supabase/inner-clock.sql`. Fresh projects use current setup then Friends. These repeatable migrations support all three Alibi formats and versioned Stack Up scores without rewriting saves, RLS, relationships or sharing settings. Live SQL and deployment are separate from passing repository tests.

## Laser Expert v2

New Expert boards require three player mirrors. Native first-fire hits and Arcade hits × 25 are unchanged; historical two-mirror Expert scores are never reinterpreted. This scale is not a percentile and does not imply equal difficulty across releases. Existing Supabase projects apply `supabase/laser-expert.sql` after the current Alibi update; it extends only the private Laser snapshot scorer and keeps both old/new records valid. Fresh projects use updated setup/Friends. Cloud snapshot uploads require no new allowlist.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/bouncer.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, all three Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile/menus/homepage/accounts/Friends include nine playable games and six coming-soon cards. Public billing and prelaunch human/content/device reviews remain deferred.

## Player-feedback compatibility — 23 October 2026

Alibi v3 changes the deduction mechanism, not its four-case native/Arcade formula; the server derives the answer through verified evidence rather than trusting an answer field. Apply `supabase/playtest-feedback.sql` after the previous Inner Clock update, or the updated complete Inner Clock SQL, before deployment. Fresh setup/current Friends includes all three Alibi formats and both Stack Up score versions. This supersedes narrower historical migration notes above.
