## Stack Up variety — owner feedback, 5 November 2026

The 160 Daily stacks now cover 80 authored themes, replacing 16 heavily reused templates. Each theme has two distinct five-card selections, at calendar slots 16 days apart. Interleaved subject order prevents runs of film-release, recipe or life-cycle templates. Preserve all 160 IDs, five lanes, original date selector and 32-day repeat-free ID rotation. Author `content/stack-up-familiar-topics.json`; run `node scripts/build-familiar-stacks.cjs`. Each theme has reference links and a clear ordered master sequence. No maths, numerical-fact or time-unit tasks return.

Fresh Unlimited deduplicates by theme/prompt and favours the familiar version: 80 familiar themes plus 10 additional challenge prompts, 90 in All topics. Exclude the entire captured Daily theme from practice, not just its selected five-card variant. Topic changes still apply to the next stack. This deliberately retires near-duplicate practice variants rather than inflating the active count. Original source/challenge data remains for compatibility. Already captured Dailies retain original questions, drafts, timers, score versions and results; cloud merges retain an existing remote capture when question snapshots differ. No database migration, score change or other-game edit is required. Archive: `content/archive/2026-11-05-pre-stack-variety/`. Source retrieval and editorial review are recorded under `design/content-reviews/2026-11-05-stack-variety*`; accessibility is an editorial estimate, not measured player recognition. Earlier content counts below are historical.

## Stack Up first-try scoring — owner correction, 5 November 2026

Fresh Stack Up runs use `scoreVersion:4`: a correct first submission earns 100 regardless of time remaining or prior streak. Deduct 20 per wrong submission, bounded at zero; timeout scores zero. The Daily is the mean of its five round scores. Keep the 90-second timer and all raw receipt fields and mechanics for compatibility. All captured score versions 1/2/3, including unfinished captures, retain original scores, deadlines and rules. No data is regraded or reset. Only Stack Up changes in this correction. Apply `supabase/stack-up-first-try.sql` before publishing; the private receipt validator and score reader support both v3 and v4. Archive: `content/archive/2026-11-05-pre-stack-first-try/`. Earlier scoring entries below are historical.

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

## Time Drop familiarity revision — 5 November 2026

330 events, five per Daily, 66-day cycle. Revision 3 replaces 111 specialist subjects and simplifies 57 titles. Retained events keep their old calendar positions; new familiar subjects fill retired slots. Every Daily has three or more topics and two editorial familiarity anchors. Scores, saved captures and Prior originals remain fixed. Read [Time Drop’s current contract](games/time-drop/README.md). Earlier era-preserving revision notes below are historical.

## Codebreak is the tenth launch game — 4 November 2026

The owner chose Codebreak to replace shelved Sleeper in the ten-game launch. One untimed Daily code, four digits from 1–6 with repeats, eight guesses, separate free Unlimited. Full points within three guesses, then 10 fewer per extra guess; an uncracked code scores zero. Read `games/codebreak/README.md` for the frozen v1 rotation, saves, scores, accessibility and verification contract. Preserve every existing game's source and native/cloud history. Existing installations apply `supabase/codebreak.sql` after the current league setup; the new game uses a separate validated save table and private score helpers. The nine-game shelving entries below are historical; Sleeper stays hidden.

## Launch roster update — 4 November 2026

Sleeper is shelved by owner decision. The launch has nine games; earlier ten-game inventories below are historical. Public Sleeper routes redirect home, with source, native/cloud saves and scores preserved. `tests/daily-content.cjs` checks the nine shipped selectors. See the current roster in `game-config.js` and [README.md](README.md).

## Remove UNESCO prompts — owner correction, 31 October 2026

Revision 10 removes all 24 UNESCO World Heritage property prompts from fresh Daily and Unlimited pools and replaces them with familiar everyday emoji categories: clothing, household items, tools, buildings, transport, flowers/plants, sporting equipment, toys, office items, technology, cameras/lighting, stationery, sound objects, weather/sky, hand gestures, jobs and foods. The category filter is now Everyday instead of Landmarks. All 240 prompts have at least ten canonical answers; the active bank has 7,633 answers, 10–321 per question. Each replacement uses the complete stated Unicode 16.0 subgroup roster with merged duplicate depictions, common aliases and emoji input; short scopes identify that finite boundary. Ratings use reviewed familiar/less-obvious anchors and neutral 50 for other entries.

The 48-day, five-topic-per-day rotation is retained. All 177 current family/overlap pairs avoid the same and adjacent days. Old full snapshots/results/deadlines remain playable unchanged; revision-9 content is archived in `content/archive/2026-10-31-pre-everyday/`. Retired topic selections fall back to All topics without resetting the captured round. Source and generator remain `content/hidden-gem-bounded-source.json` and `scripts/build-hidden-gem-questions.cjs`. No gameplay, scoring formula, visual layout, save schema or SQL changes.

## Question-context rating correction — 31 October 2026

Revision 9 corrects a systematic editorial error: roster/chronological order and ratings from unrelated questions had put obvious answers such as Crash Bandicoot at 100. All 240 questions now have explicit familiar and less-obvious anchors reviewed within their own context. Other answers receive a neutral 50 points, rather than an invented precise rarity ranking. The generator may enforce the 1-point floor for an answer disclosed by the prompt, but must never manufacture a 100-point answer from array position. Every question has a deliberately reviewed maximum. Ratings remain estimates, not measured player-popularity data.

Crash Team Racing now scores Crash 1, Coco 5, Cortex 10 and Penta Penguin 100. The original revision-8 bank/source are archived in `content/archive/2026-10-31-bounded-v1/`. New captures use revised ratings; every previously captured ready/active/completed round retains its old points, deadlines and results. All 240 IDs, 7,700 canonical answers, date slots, 48-day schedule, timers, save version and score formula stay fixed. No SQL changes are needed. Author explicit points and `ratingReview` in `content/hidden-gem-bounded-source.json`; regenerate with `node scripts/build-hidden-gem-questions.cjs`. See `design/content-reviews/2026-10-31-sleeper-ratings.json` and the old/new snapshot regressions. This supersedes revision 8’s roster-order/cross-question rating methodology for future captures.

## Complete bounded Sleeper rosters — 31 October 2026

Revision 8 supersedes the open-ended bank for fresh Daily and Unlimited rounds. It has **240 questions, 7,700 canonical answers, 10–321 per question**, plus reviewed aliases and symbol inputs. Each question names a finite roster, edition, classification or date cutoff. This provides a checkable complete canonical set within that boundary; it does not promise every arbitrary paraphrase or that external classifications never change. Earlier broad examples are replaced where their unrestricted membership cannot be enumerated fairly offline. No online judge or API billing is introduced.

Author `content/hidden-gem-bounded-source.json`: dated factual universes, expected counts, roster fingerprints, explicit question membership, per-answer editorial ratings, provenance and the fixed rotation. Run `node scripts/build-hidden-gem-questions.cjs` to regenerate `content/hidden-gem-questions.json` and `games/hidden-gem/questions.js`. Include every selected canonical member; aliases are not additional answers. Update roster fingerprints with SHA-256 of `JSON.stringify(members)` after a factual edit. Keep scopes short, with no accepted answers disclosed. Ratings are designer estimates, not measured player-popularity data; earlier editorial familiarity estimates and roster-order tie breaking are documented in the source. Independent human difficulty and wording calibration remains outstanding.

The **48-day rotation starts 31 October 2026**, with five distinct topics each day. All 444 marked family/overlap pairs avoid the same and adjacent days, including wraparound. Topics are WORLD, PLACES, SCIENCE, GAMES, WORDS, SPORT, LANDMARKS, CULTURE, SCREEN and ARTS. Dailies unlock at **midnight Australia/Sydney** (13:00 UTC in AEDT, 14:00 UTC in AEST). Already captured Dailies stay captured; the next newly captured day uses revision 8. An unfinished Unlimited question finishes under its captured rules, then draws only revision 8.

Revision 7 is archived in `content/archive/2026-10-31/`. Preserve full old snapshots, completed and zero-point picks, deadlines, scores, cloud keys and first-completion locks. A recovery-only alias correction table retains the previously reviewed pants/jeans fix for unanswered hg7 questions; it never enters the active question pool. Browser and private SQL validators now allow 512 answers, 32 aliases and 240-character names/input. Optional snapshot-owned exact symbol maps handle emoji and symbols, including case-sensitive SI prefixes; old questions without those maps keep their original matching rules. No score formula, account data, public API, RLS, timer or save-version changes. Sleeper’s client payload allowance is raised within the existing 2 MB server budget (1.95 million characters, 1.99 MB UTF-8); other games retain their existing limits. This avoids rejecting a valid 120-day full-snapshot history at the previous generic 1.5-million-character client cap. No history is pruned.

Existing databases apply the updated **`supabase/hidden-gem-broader-answers.sql` before release**; fresh installs use updated `hidden-gem.sql`. This replaces only private validation/matching/score helpers and preserves their revoked client privileges. The existing 2 MB cloud limit is retained: the largest 120-day completed replacement-bank fixture across all rotation starting slots is about 1.91 MB. Tests cover all canonical names/aliases/symbols, published roster sizes, generated-file reproducibility, Daily/Unlimited replacement, old captures, PostgreSQL parity, ownership/sharing gates and phone/desktop gameplay.

## Sleeper offline coverage follow-up — 30 October 2026

The active bank now has 6,315 canonical answers (19–148 per question). All 240 IDs and date slots remain fixed, retaining the 48-day rotation. New canonical answers appear in fresh captures; reviewed aliases can also repair the current unanswered question without changing captured points, previous picks, deadlines or completed history. Offline lookup is finite, with no AI/network answer judge.

## Sleeper replacement — 30 October 2026

Fresh Daily and Unlimited captures use revision 7 exclusively: 240 questions and 5,481 canonical answers (19–148 each). A fixed 48-day cycle starts 30 October 2026, with five distinct topics per day and reviewed overlapping pairs kept off the same and adjacent days, including wraparound. New Dailies unlock at midnight Australia/Sydney, including daylight-saving changes. Previously captured ready, active and completed rounds retain their original snapshots and deadlines. See the [current Sleeper contract](games/hidden-gem/README.md).

# Daily content coverage — 25 October 2026

All ten active games pass **32 consecutive distinct Daily sets**, covering **25 October–25 November 2026 inclusive**: the requested 31 days plus one day of buffer. The no-repeat follow-up expands Lowball and changes Time Sense's target selector. Existing saves, scoring and original artwork remain protected. The new selectors start 26 October, with the 25 October legacy Daily held out at the boundary.

This audit executes the shipped pure selectors and extracts the existing Stack Up / Lowball selectors from their real engine source. It checks complete round counts, unique whole Daily sets (ignoring order), valid bank entries, deterministic selection, duplicate ingredients and duplicate challenge payloads. No browser/game initialization or player storage is used.

## Current inventory

| Game | Shipped content | Verified coverage |
| --- | --- | --- |
| Laser | 248 boards | 32 days without repeating individual boards |
| Time Drop | 330 events | 66 days without repeating individual events |
| Clue Ladder | 300 answers with five clues each | 60 days without repeating individual puzzles |
| Seating Chart | 360 tables | 72 days without repeating individual tables |
| Desk Jam | 180 boards: 120 Daily, 60 additional practice boards | 40 days without repeating individual Daily boards |
| Sleeper | 240 questions / 7700 answers | 48 days without repeating individual questions |
| Stack Up | 160 non-maths Daily stacks + 134 active optional challenges | 32 days without repeating individual Daily stacks |
| Pack | 212 bags, including 32 advanced Daily hard bags | 32 days without repeating individual bags |
| Lowball | 128 products / 512 explicitly scoped regional references | 32 days without repeating individual products |
| Time Sense | 195 scheduled durations across five lanes, at 50ms precision | 39 days without repeating individual targets |

Lowball's fixed 128-product ring supplies four new products per day for 32 days, including across cycle boundaries. The original 100 rows remain the frozen prefix; 28 additions have their own generated artwork and 112 regional references checked 25 October. Regional prices do not count as different products. Saved item/price snapshots always win; old snapshotless drafts use the legacy selector and baseline prices. The ring begins 26 October and places 25 October's held-out products at its end, protecting the launch boundary.

Time Sense's fixed 39-day deck schedules five distinct targets each day, one per duration lane. Exact targets use 50ms increments within 2–12 seconds; half-tenths display with two decimals. Each lane excludes the 25 October legacy target. Earlier dates and saved targets retain v1 behavior. The private Friends helper accepts the same grid without changing scoring, access, sharing or saved data.

No finite pool guarantees forever-new content. These are **rolling-month individual-content guarantees**, superseding the earlier allowance for product/duration reuse. The other eight games' existing banks already meet the stricter requirement.

## Repeatable check

Run `node tests/daily-content.cjs`.

The check writes `.artifacts/daily-content.json` with the source commit, Sydney date, inventory and exact results. It covers the current Sydney date, the original audit window, a later cycle-boundary window, March 2027 and the February 2028 leap-day window. It also checks the full repeat-free periods listed for the all ten games.

CI runs this check when relevant banks, selectors, models, source content or the active shelf change. Pure styling, ordinary game UI copy and documentation changes do not run every game. No browser sessions are needed for this content-availability check.

## Documentation and compatibility limits

This document supersedes older roster/name/content-coverage notes in CONTENT.md and LAUNCH-CONTENT.md. Those notes predate Time Drop, Clue Ladder, Seating Chart, Sleeper and Desk Jam; the old requirement to run all game sessions or wait for a separate publication request is superseded by the owner's focused-check / automatic-publication direction.

Pack's historical cutover-eve holdout uses its legacy source order. Contrary to the older generic bank-reversal statement, this audit does **not** certify that reordering Pack's source array preserves the same future schedule. Keep the canonical source order and existing snapshots; deliberate pool/order changes still need compatibility review. The month of unique Dailies passes in the actual shipped order.

Structural coverage does not reverify factual answers, current retail prices, human challenge or live account configuration. Existing dated price/reference evidence and captured snapshots retain their meanings. The only SQL change accepts valid 50ms target snapshots in the existing private Time Sense score helper; score formulas and access contracts are untouched.

## Live database compatibility

On 25 October 2026, the narrow `time_sense_exact_daily_targets` migration replaced only the private Time Sense score helper. Live verification returned100 for both legacy and new exact-target runs, rejected an invalid25ms target, retained revoked anonymous/authenticated helper access and the empty search path, and confirmed unchanged save/Friends API definitions and enabled save RLS. The security-advisor findings were unchanged. This records database readiness; the frontend's deployment is verified separately by the Pages workflow.

## Player-feedback revision — 26 October 2026

Sleeper, Clue Ladder and Time Drop use editorial bank revision 2. IDs, category/topic slots, era buckets and each date's selected IDs are unchanged; their 32/60/66-day individual-content guarantees still hold. `tests/content-refresh.cjs` compares the archived banks across every possible old/new rolling-month boundary and checks that old frozen Dailies still complete. Existing captured content remains unchanged, so players resuming a run may see an older question. New questions arrive when a fresh run is created.

## Stack Up maths retirement — 26 October 2026

The 160-slot default deck now contains non-maths questions. Eighty replacements retain the same IDs/lanes and exact 32-day calendar assignment, preserving old/new release-boundary uniqueness. The 74 legacy maths challenges are recovery-only, leaving 134 active non-maths Challenge stacks. Captured Dailies retain their original content and scores.
