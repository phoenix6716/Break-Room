# Codebreak

The tenth launch game; Sleeper remains shelved with its source and saves preserved.

## Current rules (version 2)

One untimed Daily code has four digits from 1–6, with repeats allowed and eight distinct guesses. Each guessed digit receives a clue: green ✓ means right place, yellow ↔ means elsewhere, and gray × means no remaining match. Exact positions match first, then other copies match left to right against unused secret digits. An extra copy can be gray even when that digit matches elsewhere. Secret 1123 with guess 1211 gives right place / elsewhere / elsewhere / no remaining match. Text, symbols and full accessible row descriptions supplement colour. Help lives in the existing ? dialog.

Solves within five guesses earn 100 points; guesses 6 / 7 / 8 earn 90 / 80 / 70. An uncracked code scores zero. Duplicate, invalid or incomplete guesses do not consume turns. Native and Arcade scores share the 0–100 scale, with no speed bonus. First completed Dailies lock, including zeroes. Clear signal still means a solve within three guesses; streaks count completed Daily attempts.

## Frozen captures and calendar

Version-1 captured rounds retain count-only clues and original points: 100 through three guesses, then 90 / 80 / 70 / 60 / 50 on guesses 4–8. Help and sharing follow the captured version. Existing results, unfinished drafts and guesses are not rewritten. An already captured Daily remains classic until completion; a new Daily or the next Unlimited code uses version 2.

The 1,296 possible codes and calendar are unchanged: epoch 4 November 2026, Sydney dates, fixed bijection `(slot × 487 + 293) mod 1296`. Every code occurs once per 1,296-day cycle. New Dailies unlock at midnight Australia/Sydney. Both versions use the same secret for a given day. No online judge, question bank or AI API is involved.

`codebreak-model.js` validates both versions. The exact nine snapshot fields remain version, kind, day, id, code, guesses, draft, phase and edits. Daily keys remain `break-room:codebreak:daily:YYYY-MM-DD`; feedback and points are derived. Invalid snapshots remain untouched. Failed storage shows an explicit memory-only warning. Cross-tab completion, ownership guards and draft persistence remain.

Unlimited uses owner-scoped sessionStorage at `break-room:codebreak:practice:OWNER`, excludes today's code and exhausts the other 1,295 codes before refilling. A captured classic practice round finishes unchanged; its next draw uses version 2. Practice never enters Daily, profile, cloud or social history. Type or use the keypad, Enter to submit, Delete/Clear to edit. Shares omit actual digits.

## Cloud compatibility

Fresh setup uses updated `supabase/codebreak.sql` after the existing account/Friends/game/league setup. Existing Codebreak installations apply `supabase/codebreak-v2.sql`. This replaces only three private functions: validation, score derivation and revision-checked saving. It does not update player rows, the daily-code function, public wrappers, other games or the shared save API.

The first valid cloud capture owns its rules. Cross-version merges retain the remote snapshot; the server rejects changes to captured versions and omission of valid captured keys, including pending rounds. Same-version progress continues normally; completed raw records retain the first-completion lock. Own-read RLS, auth-derived writes and private Friends/league score derivation remain. Account deletion cascades remain supported.

Original model, controller, stylesheet, page, cloud merge and installer are archived at `content/archive/2026-11-05-pre-codebreak-digit-feedback/`. They are compatibility evidence, not a rollback installer: once version-2 captures exist, rollback must retain dual-version readers and validators. Never rerun the old SQL over live version-2 saves.

## Verification

`tests/codebreak-rules.cjs` independently checks every one of 1,679,616 code/guess pairs, repeated-digit positions, both scoring tables, all 1,296 calendar slots against archived v1, complete practice exhaustion and cross-version merges. `codebreak-database.cjs` upgrades an actual archived-v1 fixture, preserves its stored row and score, checks both versions in PostgreSQL-compatible PGlite, captured-version/omission locks, first completions, RLS, API privileges and social privacy. `codebreak.cjs` checks 320–1440px layouts, old/new Daily and Unlimited captures, five-guess scores, accessible clues, sharing, storage errors, rollover and ownership. Affected accounts, Friends, leagues, profile and release checks supplement these.

Automation verifies rules and compatibility, not human difficulty or real-device browser certification. Live migration, deployment and site verification are separate release checks.
