# Codebreak v1

The tenth launch game. Sleeper remains shelved, with all its source and saves preserved.

## Rules and points

One untimed Daily code has four digits from 1–6; repeats are allowed. Players get eight distinct guesses. Feedback counts digits in the right position and correct digits elsewhere. A copy of a digit can match only once. Feedback does not identify individual positions. Duplicate or incomplete guesses do not consume a turn.

Solve in three guesses or fewer for 100 points, then subtract 10 per extra guess: 90 / 80 / 70 / 60 / 50 on guesses 4–8. An uncracked code after eight guesses scores 0. Native points and Arcade points use this same 0–100 scale, with no speed bonus. The first completed Daily locks. Clear signal means a Daily solve within three guesses. Streak counts completed Daily attempts, including zeroes.

`codebreak-model.js` is the pure version-1 authority. The 1,296 possible codes are enumerated in base six. Sydney dates use epoch 4 November 2026 and the fixed bijection `(slot × 487 + 293) mod 1296`. Every code appears once per 1,296-day cycle. These constants and v1 judging semantics must stay frozen for saved results. No question bank, online judge, AI API or familiarity estimate is involved.

Independent tests check all 1,679,616 secret/guess pairs against multiset counts. A feedback-only minimax strategy starting with 1122 cracks all 1,296 secrets within five guesses; players have eight. This verifies solvability, not a human difficulty rating.

## State and controls

Daily v1 snapshots live at `break-room:codebreak:daily:YYYY-MM-DD`. The nine fields capture version, kind, day, ID, code, committed guesses, current draft, phase and edit count. Feedback and points are derived, not trusted stored fields. Drafts save immediately. Incomplete captures, completed zeroes, ownership and cross-tab first finishes are preserved. Invalid snapshots remain untouched. Failed storage has an explicit memory-only warning.

Unlimited uses owner-scoped sessionStorage at `break-room:codebreak:practice:OWNER`. It excludes the current Daily code and cycles through the other 1,295 codes before refilling, avoiding immediate repetition. Switching modes and reloading keep the active captured practice code. Practice never enters Daily, profile, cloud or social history. A changed Sydney day creates its own new Daily key without modifying earlier captures.

Type or use the digit keypad; Enter submits. Delete/Clear edit the current guess. Count feedback has text labels and a complete accessible row description. The canonical centred shell, left menu, first-visit/manual Help, Stats, Sydney reset and reduced motion remain consistent with other games. The small safe illustration and homepage card are original vector art. `scripts/build-codebreak-art.cjs` exports its 1200 × 400 WebP; source is `assets/cards/source/codebreak-original.svg`.

## Cloud, profile and comparisons

Install `supabase/codebreak.sql` after the current setup → Friends → Hidden Gem → Shift Work → Leagues scripts. It adds a separate own-read RLS table and auth-derived, revision-checked write API. Completed records cannot be removed or rewritten by later saves. New public RPCs are security-invoker wrappers around auth-checked private helpers in the unexposed `br_codebreak` schema. Existing game save APIs and native scoring rules are unchanged.

Private Friends and league scores derive only validated completed Dailies, including actual zeroes. They expose dates and points, not codes, guesses or drafts. The ten-game league schedule includes Codebreak from 4 November; the current Clue Ladder / Seating Chart pair stays fixed. Older Sleeper weeks and the intervening nine-game period keep their original membership/rules. All ten current games are required once per five-week cycle.

Focused suites: `codebreak-rules.cjs`, `codebreak-solvability.cjs`, `codebreak-database.cjs` and `codebreak.cjs`, plus affected account, profile, Friends, league, roster and responsive checks. Local tests, live schema readiness, deployment and live verification are separate release checks. Guesses originate in the browser; no anti-cheat or human-playtesting certification is claimed.
