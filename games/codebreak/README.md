# Codebreak

The tenth launch game; Sleeper remains shelved with its source and saves preserved.

## Current rules (version 5)

Type directly into the safe’s dark display or use the keypad. It contains the single native input, with a visible focus outline, an associated label and numeric mobile keyboard support. Delete/Clear, Enter, validation and immediate draft saves use that field. The decorative safe is no longer duplicated above a separate answer box. Completed rounds show the revealed code in the same display.

One untimed Daily code has four digits from 1–9, with repeats allowed and eight distinct guesses. Each guessed digit receives a clue: green ✓ means right place, yellow ↔ means elsewhere, and gray × means no remaining match. Exact positions match first, then other copies match left to right against unused secret digits. An extra copy can be gray even when that digit matches elsewhere. Secret 1123 with guess 1211 gives right place / elsewhere / elsewhere / no remaining match. Text, symbols and full accessible row descriptions supplement colour. Help lives in the existing ? dialog.

Solves within four guesses earn 100 points; guesses 5 / 6 / 7 / 8 earn 80 / 60 / 40 / 20. An uncracked code scores zero. Duplicate, invalid or incomplete guesses do not consume turns. Native and Arcade scores share the 0–100 scale, with no speed bonus. First completed Dailies lock, including zeroes. Clear signal still means a solve within three guesses; streaks count completed Daily attempts.

## Frozen captures and calendar

Version-1 captured rounds retain digits 1–6 and count-only clues and original points: 100 through three guesses, then 90 / 80 / 70 / 60 / 50 on guesses 4–8. Help and sharing follow the captured version. Version-2 captures retain digits 1–6, per-digit clues and the five-guess full-score scale. Version-3 captures retain digits 1–9 and the same five-guess scale. Version-4 captures retain 100 through four guesses, then 90 / 80 / 70 / 60 on guesses 5–8. All versions use the new safe input without changing their captured rules. Existing results, unfinished drafts and guesses are not rewritten. An already captured Daily remains classic until completion; a new Daily or the next Unlimited code uses version 5.

Version 3 enumerates all 6,561 four-digit codes in base nine. Sydney dates retain epoch 4 November 2026 and the fixed bijection `(slot × 487 + 293) mod 6561`; 487 is coprime to 6561, so every code occurs once per cycle. Captured v1/v2 rounds use the frozen base-six mapping and `(slot × 487 + 293) mod 1296`. New Dailies unlock at midnight Australia/Sydney. Fresh rounds share the new code; a captured old round keeps its original code. No online judge, question bank or AI API is involved.

`codebreak-model.js` validates all five versions. The exact nine snapshot fields remain version, kind, day, id, code, guesses, draft, phase and edits. Daily keys remain `break-room:codebreak:daily:YYYY-MM-DD`; feedback and points are derived. Invalid snapshots remain untouched. Failed storage shows an explicit memory-only warning. Cross-tab completion, ownership guards and draft persistence remain.

Unlimited uses owner-scoped sessionStorage at `break-room:codebreak:practice:OWNER`, excludes the actual captured Daily code, including when that Daily uses old rules and exhausts the other 6,560 codes before refilling. A captured classic practice round finishes unchanged; its next draw uses version 5. Practice never enters Daily, profile, cloud or social history. Type or use the keypad, Enter to submit, Delete/Clear to edit. Shares omit actual digits.

## Cloud compatibility

Fresh setup uses updated `supabase/codebreak.sql` after the existing account/Friends/game/league setup. Existing Codebreak installations apply `supabase/migrations/20261106040222_codebreak_v5_scoring.sql` after v4. It replaces only the private validation and score helpers, accepting all five captured versions and deriving their original scores. Player rows, both daily-code functions, revision-checked writes, public wrappers, other games and the shared save API remain unchanged. Private helper execution remains revoked. Do not rerun older version-specific migrations after v5.

The first valid cloud capture owns its rules. Cross-version merges retain the remote snapshot; the server rejects changes to captured versions and omission of valid captured keys, including pending rounds. Same-version progress continues normally; completed raw records retain the first-completion lock. Own-read RLS, auth-derived writes and private Friends/league score derivation remain. Account deletion cascades remain supported.

Original model, controller, stylesheet, page, cloud merge and installer are archived at `content/archive/2026-11-05-pre-codebreak-digit-feedback/`. Version-3 files before this scoring/input change are archived in `content/archive/2026-11-05-pre-codebreak-safe-input/`. Version-4 source and installer before twenty-point deductions are archived in `content/archive/2026-11-06-pre-codebreak-twenty-point/`. The pre-1–9 version-2 files are also archived in `content/archive/2026-11-05-pre-codebreak-nine-digits/`. These are compatibility evidence, not rollback installers: once version-5 captures exist, rollback must retain readers and validators for all five versions. Never rerun the old SQL over live newer-version saves.

## Verification

`tests/codebreak-rules.cjs` checks every one of the 4,140 equality patterns across eight secret/guess positions, rotated through all nine digit labels. This covers repeated-digit structures without testing 43 million redundant label combinations. It checks the full 6,561-day calendar, frozen old calendars and scoring, complete practice exhaustion and cross-version merges. The solver exhausts all 6,561 secrets using only per-digit clues; its measured worst case is recorded in `.artifacts/codebreak-v3-solvability.json`. The archived six-digit solver remains independently checked.

`codebreak-database.cjs` upgrades actual v1/v2/v3/v4 fixtures, preserves their stored rows and scores, checks all five versions in PostgreSQL-compatible PGlite, full JS/SQL calendar parity, captured-version/omission locks, first completions, RLS, API privileges and social privacy. `codebreak.cjs` checks 320–1440px layouts, the nine-key keypad, rejection of zero, all five versions' captured Daily/Unlimited rounds, four/five/eight-guess score boundaries, safe-input geometry and focus, accessible clues, sharing, storage errors, rollover and ownership. Affected accounts, Friends, leagues, profile and release checks supplement these.

Automation verifies rules and compatibility, not human difficulty or real-device browser certification. Live migration, deployment and site verification are separate release checks.
