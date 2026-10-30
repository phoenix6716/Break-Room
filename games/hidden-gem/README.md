## Offline answer coverage and captured-round alias corrections — 30 October 2026

The owner reports valid answers being rejected and explicitly chooses to keep Sleeper offline. Revision 7's answer-coverage follow-up accepts pants/jeans/trousers as wording for the existing rolled-up trouser-leg answer (69), and sleeves/shirt sleeves as the existing sleeve answer (64). The current bank already accepted plain sleeves; that rejection was not reproduced, so regression checks exercise it through both real game modes. The wider review adds everyday answers and regional/action/plural wording: 240 questions, 6,315 canonical answers (19–148 each), with the same IDs, topics and 48-day slots.

Every original canonical answer, alias mapping and rating stays fixed. The source now has explicit per-answer points; adding an answer cannot rescale existing ratings. `content/archive/2026-10-30-accessible-v1/` preserves the first accessible release. Before an unanswered current question is graded, the engine may copy reviewed aliases from the matching published question, only for the same canonical name and captured rating. It does not add new canonical answers to that snapshot, replace past picks, restart deadlines or alter completed records. This narrowly supersedes the former rule that even alias corrections must wait for a fresh capture. New canonical additions apply to fresh captures only. No model, SQL, account format, network judge or API billing change.

Offline lists remain finite: this improves coverage but cannot promise to recognise every technically correct answer. Unrecognised input must not be treated as proof that the answer is factually wrong. See `design/content-reviews/2026-10-30-sleeper-offline.json` and the captured-round browser regressions in `tests/sleeper-expansion.cjs`.

## Complete accessible Sleeper replacement — 30 October 2026

Revision 7 replaces all 240 active prompts in Daily and Unlimited with broad, original everyday categories: 5,481 canonical answers, 19–148 per question, plus aliases. The 50 owner-approved examples form the foundation; wording is tightened for Australia, paired body parts, human characters and word constraints. Food preservation includes culinary vegetables. New IDs are `hg7-001`–`hg7-240`; none of revision 6 remains in either fresh pool.

`content/hidden-gem-accessible-source.json` is the authoring source, including explicit aliases, the fixed 48-day rotation and reviewed conflicting pairs. Run `node scripts/build-hidden-gem-questions.cjs` to regenerate both `content/hidden-gem-questions.json` and `games/hidden-gem/questions.js`. Each day has five different topics. Marked semantic families and canonical-overlap pairs are separated by at least one intervening day, including cycle wraparound. The epoch is 30 October 2026; fresh captures use this bank immediately. Dailies reset at midnight Australia/Sydney (13:00 UTC during AEDT; 14:00 UTC during AEST).

Revision 6 and its selector are archived in `content/archive/2026-10-30/`. Preserve every historical and unfinished full snapshot, rating, deadline, account save and first completion. Captured ready Dailies also stay unchanged until the next day. An already captured Unlimited question resumes under its original rules; its next question comes from revision 7. Retired filter choices fall back to All topics without replacing the current question or counters. No schema/SQL, scoring, timer, visual-design or save-version changes. This supersedes prior instructions to preserve future question IDs or calendar slots when refreshing Sleeper.

Answer lists are finite editorial lists, not exhaustive dictionaries. Ratings are editorial familiarity estimates, not measured player popularity. General reference links are background resources, not per-answer primary-source certification. See `design/content-reviews/2026-10-30-sleeper.json` for the review and limits. Physical-device and human enjoyment testing remain separate from automated browser checks.

## Broader Sleeper questions — owner correction, 28 October 2026

Every newly offered Sleeper question must have at least ten canonical answers, preferably more. Revision 5 replaces all 55 undersized sets across SCIENCE, AUSTRALIA, LANGUAGE and EVERYDAY with broader scoped questions. The compass-point, demonstrative and states-of-matter prompts are retired. The bank has 160 questions and 4,722 answers; aliases do not count towards the minimum. Fixed editorial ratings remain 1–100, not popularity measurements.

Preserve all IDs, topics, date slots, timers, scores and full captured snapshots. The prior revision is archived in `content/archive/2026-10-28/hidden-gem-questions.json`; historical two-answer snapshots remain valid in the model and SQL. Enforce the new minimum in source generation and bank tests, not legacy record validators. `design/content-reviews/2026-10-28-sleeper.json` records every replacement and the invalid Oceania alias removal. No SQL migration is needed.

## No answer giveaways — owner correction, 27 October 2026

Sleeper descriptions must explain the scope without naming accepted answers or aliases, listing the solution set, or using an answer as a release cutoff. Use dates and neutral boundary wording. Where a prompt must name a series or character that is itself an accepted answer, assign that answer the minimum 1 point; it must never be a Sleeper/Breakout giveaway. Multiple such answers can share the 1-point floor. These are editorial common-answer choices, not measured popularity.

Revision 4 repairs 39 question slots, including the plant/renewable-source prompts, and replaces the organ-identification clues with the conventional five-vital-organs question (liver replaces stomach). IDs, topics, schedule, timers and score formulas stay fixed; captured revision-3 questions and ratings remain authoritative. Regression checks scan all 160 prompts/descriptions and complete old snapshots at their captured scores. See `design/content-reviews/2026-10-27-sleeper-no-giveaways.json`. No SQL update is required.

## Broader answer lists — 27 October 2026

Revision 3 integrates the 96 drafted WORLD, SPORT, FILM, BOOKS, GAMES and SPACE slots, with 4013 canonical answers across the full 160-question bank. The other four topics remain unchanged. IDs, topics, calendar slots, 32-day rotation, 30-second deadlines, first-result locks and native/Arcade formulas are unchanged. Existing full snapshots keep their captured questions and ratings. Revision 2 is archived under `content/archive/2026-10-26/`.

Lists can now contain up to 160 canonical answers, including all 151 Kanto Pokemon. Fixed integer ratings remain 1–100; more than 100 answers necessarily share ratings. This supersedes the former distinct-rating-per-answer limit for broad lists. Names for the same identity resolve to one canonical rating; ambiguous aliases are excluded. See `design/content-reviews/2026-10-27-sleeper.json` for scope corrections and editorial limits.

Existing databases apply `supabase/hidden-gem-broader-answers.sql` before publishing: it only widens `_hg_question`'s answer-count bound from 40 to 160 and keeps the helper private. Fresh installs use the updated `hidden-gem.sql`. No user data, tables, policies, sharing gates or score formula changes.

# Sleeper

## Player-feedback revision — 26 October 2026

The owner requested more recognisable and recent questions. Revision 2 replaces 44 prompts with approachable sets including 2015–2025 Pixar films, Inside Out 2 emotions, recent books, Pokémon starters, Minecraft and familiar online language. The bank remains 160 questions over ten topics and 32 repeat-free Daily sets; it now contains 922 canonical answers. Original date slots/IDs remain fixed. Old question/answer/rating snapshots always win; no existing score or deadline is changed. Historical ID slugs remain stable authoring slots. See `design/content-reviews/2026-10-26.json` and `tests/content-refresh.cjs`. Recency is scoped explicitly, not a promise that every topic is breaking news.


Approved display name **Sleeper** (25 October 2026), formerly Hidden Gem. Keep the `hidden-gem` internal ID/route, all native/cloud keys, frozen question snapshots, scores and achievements. The rebrand uses static radar/star artwork and the headline “Quiet answers. Big points.” Answer labels now match the sleeper-hit theme; numeric thresholds and points are unchanged. Current ten-game shelf: Laser → Time Drop → Clue Ladder → Seating Chart → Shift Work → Sleeper → Stack Up → Pack → Lowball → Time Sense. Stake, Prior, Alibi and Bouncer retain archived history; fourteen native formats are supported.

## Rules and scores
Five Daily questions have 30 seconds each, starting when revealed. Type in one box and press Enter or Submit. An unlisted submission shows “Not in the answer list. Try again.” and remains editable under the original deadline. Blank submissions also retry. Clear, unique one-letter typos in longer answers and listed aliases resolve to the canonical answer; ambiguous guesses are rejected. At the deadline a listed saved draft is accepted automatically; otherwise the question ends with no accepted answer and zero points.

Each accepted answer has its own fixed integer editorial rating from 1–100. Display bands: Everyday 1–19, Good Call 20–39, Under the Radar 40–59, Sleeper 60–79 and Breakout 80–100. Ratings are design choices, not survey/popularity/percentile evidence. Your native score and Arcade score are both the average of five question scores, out of 100. Zeroes count. Internal summed points (maximum 500) are bookkeeping, not a second player-facing score. A completed fifth answer counts immediately, before the final Next.

The first result is final. Daily has no replay/reset mechanism. Unlimited is free, has no Daily/cloud/profile score and resumes in this tab for the current account. Topic changes apply to the next question. Today's five IDs are excluded, leaving 155 eligible questions across all topics; no eligible ID repeats before the selected pool is exhausted.

## Content
`content/hidden-gem-questions.json` is authoritative: 160 scoped prompts, 4,722 canonical answers, ten topics with sixteen questions each, plus aliases. Each question has a reference link and an explicit scope or historical cutoff. The current revision favours recognisable subjects, contemporary references and accessible answer sets. Ratings distinguish answers within a question; they do not establish equal real-world difficulty across questions.

`scripts/build-hidden-gem-questions.cjs` reproduces the shipped `questions.js`. Daily cycles through 32 sets from 24 October 2026 Sydney, five different topics per set, no repeated question IDs before the cycle repeats. Do not reorder existing IDs or reinterpret frozen snapshots. The original standalone prototype and its v2 saves remain separate and are not imported into official stats.

Scopes/aliases were editorially checked and automation validates every canonical answer, alias and score. References include primary sites and reference works; this is not independent primary-source certification of all 4,722 facts. Human question quality, missing aliases and difficulty calibration remain launch checks. Changes to future questions must retain existing captured snapshots and scores.

## State and accessibility
`hidden-gem-model.js` owns v1 records at `break-room:hidden-gem:daily:YYYY-MM-DD`. Store complete question/answer/rating snapshots, current input, retry state, immutable results, absolute deadline, round/phase and edit count. All edits save immediately. Refresh, Help, mode changes and backgrounding do not pause/reset the clock. Cross-tab progress loads before further input; account ownership changes block stale writes. A corrupt record is left untouched and explained; denied storage falls back to memory with a warning. Reset uses shared `daily-clock.js`, midnight Australia/Sydney, including DST.

Practice uses `break-room:hidden-gem:practice:OWNER` in sessionStorage. It never replaces or writes Daily history. Keyboard submission, visible validation, labelled input/meter, 44px controls and the canonical inert/focus-trapped Help/Stats/drawer are retained. Use only the header ? for instructions.

The approved count-up, segmented meter, round tiles and original pixel category icons are kept. Sleeper stamps start at 60, Breakout at 80, and sparkles require exactly 100. The legacy pure model returns its original band strings; only the engine’s presentation mapping changes them. The existing five-100-point achievement is displayed as Breakout run; its ID and condition stay fixed. Effects are visual only, never delay Next, honor reduced motion and do not replay on hydration or another tab's stored result. No sound, hearts, paid controls or survey claims.

## Accounts, Friends and release
Apply `supabase/hidden-gem.sql` after existing setup/Friends. Fresh projects run setup.sql, friends.sql, then hidden-gem.sql. The historical inner-clock.sql installer covers the earlier games; it is not the Hidden Gem installer.

Hidden Gem uses its own `hidden_gem_saves` table, ownership RLS, authenticated `save_hidden_gem` RPC and revision conflicts. Existing game_saves constraints, its save_game RPC and old Friends functions are unchanged. Clients read only their own rows. Helpers are invoker functions with empty search paths and browser execution revoked. The constrained `hidden_gem_friend_scores` RPC exposes only completed 0–100 scores for self or accepted, unblocked, explicitly sharing friends, under the same 120-day comparison window. Raw answers and save data stay private. These checks are not anti-cheat certification.

Cloud activation/import remains explicit. Guest/per-user backups, first cloud completion and all older games' native formats remain protected. Verify live migration, authenticated clients and Pages separately from passing local/CI checks.

Focused suites: tests/hidden-gem-rules.cjs (bank, timing, locks, profiles, merge, real PostgreSQL parity, RLS, revision conflicts and private social gates) and tests/hidden-gem.cjs (five widths, complete Daily, pool/refill, drafts, error/timeout/refresh/mode flows, dialogs, sharing, cross-tab, ownership and Sydney rollover). Accounts/Friends and shared integration checks cover the changed dependent flows. Physical-device and human playtesting remain launch checks.
