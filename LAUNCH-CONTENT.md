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
