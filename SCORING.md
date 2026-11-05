## 0–100 scores for three games — owner scope, 5 November 2026

This applies only to Clue Ladder, Time Drop and Stack Up. Do not change scoring or presentation for the other seven games. Each of these games shows a score out of 100 for each round and one final Daily score out of 100. Time Drop and Clue Ladder divide existing round points by ten; their final averages are mathematically unchanged. Their captured questions, timers, rules, raw saves and cloud score helpers remain unchanged. Profile/history/sharing for these three games use the same single visible scale.

Fresh Stack Up runs retain outer version 2 and use `scoreVersion:3`: each round's net existing base credit is divided by its maximum (550 + 35 × zero-based round index), scaled to 100 and clamped to 0–100; failures score zero. Daily score is the unrounded average of five round scores, formatted to one decimal for display. Ninety-second timers, wrong-order feedback, raw base credits, streak mechanics and deadlines remain. Old scoreVersion 1/2 or untagged captures retain their original final calculation and data, displayed on the existing normalized 0–100 scale. Cloud merges retain the remote captured score version. Never regrade or restart saved runs.

Apply `supabase/stack-up-score100.sql` before publishing. It adds one private score helper and only a scoreVersion-3 branch to the existing shared reader, leaving all other game branches and the write API unchanged. Existing player rows are not migrated. Current fresh installers include the same helper. Archive: `content/archive/2026-11-05-pre-three-game-scores/`. See the three game contracts and `tests/three-game-scoring.cjs`.

## Seating Chart has three Daily puzzles — 5 November 2026

Fresh version-2 Dailies contain Easy (6 guests, original tier 1), Medium (8 guests, tier 3) and Hard (10 guests, tier 5), in that order. Keep the original 72-day index/epoch and unchanged 360-table bank. These 216 tables provide 72 nonrepeating three-table sets; all five original practice tiers remain available in Unlimited. Structural tiers are not human difficulty certification.

Each table retains the original avoidable-drama formula. Daily Arcade is the three-table average (3,000 internal points / 30); native total drama remains lower-is-better. Saved version-1 Dailies keep five tables, their picks/drafts/Undo, original points / 50 and history. The third or fifth reception counts immediately according to its captured version. Perfect host means all tables in that captured Daily. Cloud merges retain the first remote capture's version. Do not mix three/five-table attempts or regrade history.

Existing projects apply `supabase/seating-chart-three.sql`. Fresh Friends, Inner Clock and standalone Seating Chart installers include both score formats. The live update changes only the private score reader; no player rows or shared write API change. Archive: `content/archive/2026-11-05-pre-seating-chart-three/`. See [the current contract](games/seating-chart/README.md); earlier five-table notes below are historical.

## Codebreak safe input and four-guess scoring — 5 November 2026

The safe display is now the single native code input. Keep tap/keyboard entry, keypad, deletion, clearing, focus visibility, screen-reader labels and immediate draft saves working through that input. Fresh version-4 rounds award 100 through four guesses, then 90 / 80 / 70 / 60 on guesses 5–8; failure remains zero. Existing v1/v2/v3 captures retain their original digit ranges, clues and scoring, while using the new input surface. Do not regrade or change captured versions. The 6,561-day current calendar and eight-guess limit are unchanged; Clear signal still means within three guesses.

Existing projects apply `supabase/codebreak-v4.sql` after v3; fresh setup uses updated `supabase/codebreak.sql`. Only private validation/scoring helpers change. No rows, calendars or write APIs are migrated. Archive: `content/archive/2026-11-05-pre-codebreak-safe-input/`. See [the current contract](games/codebreak/README.md); earlier release notes below are historical.

## Codebreak uses digits 1–9 — 5 November 2026

Fresh version-3 Codebreak rounds use four digits from 1–9, repeats allowed, per-digit clues and eight guesses. Points remain 100 through five guesses, then 90 / 80 / 70. The complete nonrepeating Daily rotation is now 6,561 days, resetting at midnight Australia/Sydney. Existing v1/v2 captures keep digits 1–6, their original 1,296-day calendar, clues, drafts and scores. Unlimited finishes its captured round before drawing v3. First cloud capture still owns its rules; never change captured versions or regrade results. Clear signal remains within three guesses.

Apply `supabase/codebreak-v3.sql` after the v2 update for existing installations, or use updated `supabase/codebreak.sql` for fresh setup. The old private daily function and all player rows remain unchanged. Cache-bust the model on every built account/profile/social page together with the game controller. Archive: `content/archive/2026-11-05-pre-codebreak-nine-digits/`. Read [the current contract](games/codebreak/README.md); previous release notes below describe historical versions.

## Codebreak digit clues — 5 November 2026

Fresh Codebreak rounds use version 2: each digit shows right place, elsewhere or no remaining match. Exact positions match first; remaining copies match left to right. Eight distinct guesses, four digits from 1–6, repeats and the 1,296-day Sydney calendar stay fixed. Solves within five guesses earn 100, then 90 / 80 / 70 on guesses 6–8; failure is zero. Clear signal still requires a solve within three guesses.

Every captured version-1 Daily/Unlimited round retains count-only clues and original scoring (100 through three guesses, then 90 / 80 / 70 / 60 / 50). Never regrade history or switch a captured round's version. First valid cloud capture owns its rules; cross-version merges retain the remote snapshot and the server rejects rule changes or omission of captured keys. Existing projects apply `supabase/codebreak-v2.sql`; fresh projects use updated `supabase/codebreak.sql`. No player rows are migrated. See [the current contract](games/codebreak/README.md); older Codebreak release notes below are historical.

## Codebreak is the tenth launch game — 4 November 2026

The owner chose Codebreak to replace shelved Sleeper in the ten-game launch. One untimed Daily code, four digits from 1–6 with repeats, eight guesses, separate free Unlimited. Full points within three guesses, then 10 fewer per extra guess; an uncracked code scores zero. Read `games/codebreak/README.md` for the frozen v1 rotation, saves, scores, accessibility and verification contract. Preserve every existing game's source and native/cloud history. Existing installations apply `supabase/codebreak.sql` after the current league setup; the new game uses a separate validated save table and private score helpers. The nine-game shelving entries below are historical; Sleeper stays hidden.

## Current release: Shift Work — 25 October 2026

Shift Work is the tenth active game, after Seating Chart. Current shelf: Laser, Time Drop, Clue Ladder, Seating Chart, Shift Work, Hidden Gem, Stack Up, Pack, Lowball, Inner Clock. Stake/Prior/Alibi/Bouncer are archived; fourteen native formats remain supported. Older roster counts and complete-installer claims below are historical and superseded.

Three untimed Daily boards keep the approved 4–5 / 6–7 / 8–9-slide challenge. 180 frozen boards provide 40 nonrepeating Daily sets and free Unlimited. Native total moves is lower-is-better; Arcade scores are higher-is-better. First solves lock, third counts immediately, and prototype records remain separate. Read [the full contract](games/shift-work/README.md).

Apply [supabase/shift-work.sql](supabase/shift-work.sql) after setup/Friends/Hidden Gem. Fresh install: setup.sql → friends.sql → hidden-gem.sql → shift-work.sql. Only the game's private table, constrained APIs and private replay helpers are added; older tables/functions remain unchanged. Verify live SQL/configuration/Pages separately from CI. Human/device playtesting remains a launch check.

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

Time Sense accepts exact 50ms target increments across the game model, shared Arcade calculator and private SQL scorer. The 26 October 2026 calculator correction restores missing profile Arcade values for valid saved Dailies without rewriting saves or changing the accuracy formula. Regression coverage checks every day in the 39-day rotation, non-perfect results, timeouts, invalid targets and profile aggregation.

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


## Current public history (27 October 2026)

Profile statistics, Arcade average, history, activity, streaks and badges include only the ten current games. Retired results and badges are hidden even when previously earned; the Stake-dependent Clean sweep badge is also hidden. Native archived saves and scoring adapters below remain private compatibility data and are not rewritten or deleted.
