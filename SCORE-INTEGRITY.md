# Shared score integrity

Activation confirmed (6 November 2026): installed and verified on the live Break Room database. All three guard triggers are enabled. Existing save-row counts and digests match the pre-install baseline; helpers remain inaccessible to browser/anonymous roles. Trigger installation only creates missing guards and does not drop existing triggers.

The ten launch games retain their current rules, scoring, timers, captured rounds, offline play and native saves. No leaderboard or paid service is introduced.

Apply `supabase/migrations/20261106042358_score_integrity_guards.sql` **last**, after the current game installers and score-version migrations, on existing and fresh projects. It installs private BEFORE INSERT/UPDATE guards on `game_saves`, `shift_work_saves` and `codebreak_saves`. Reapplying it is safe. It never updates existing rows or regrades history. Retired game data is left alone. Keep this migration installed when applying future game updates.

## What is enforced

- The first server-readable completed Daily for each date is retained, including zeroes. Later writes cannot delete it, replace its committed answers/results, change its captured puzzles or change its server-derived score.
- Normal review-to-summary changes, formatting, UI counters, new dates, unfinished progress and account sync continue. The existing Stack Up v1-to-v2 snapshot hydration remains supported. Revision checks, ownership, RLS and existing write RPCs stay in place.
- Lowball retains its first dated cloud result from history or the legacy last-result fields. Region/preferences and history union still work. New numeric day aliases cannot create duplicate copies of a result.
- New or changed future Daily captures/results are rejected using the database's Australia/Sydney date. Existing future cloud captures can be carried unchanged. Errors explain the device-date issue; local saves remain intact. New incorrectly dated local records cannot sync ahead of their date.

The guards reuse each game's existing score reader and protect its scoring inputs. Helpers live in the unexposed `br_integrity` schema, have no client execution grants and use the existing save RPC's authority. Indexed owner/game lookups handle PostgreSQL's INSERT phase of UPSERT; unchanged historical receipts skip score recalculation. No per-action request or additional client network round trip is added.

## Practical limits

The browser still contains game answers and supports offline play. A technically skilled person can inspect answers, use outside help or construct a plausible first submission. These guards protect cloud history after its first completion; they cannot prove that a human played honestly. Competitive global rankings would need server-owned attempts and secrets, per-game replay validation, abuse controls and a separate review of historical/offline submissions. Local guest profiles can still be edited on the player's own device.

## Verification

`tests/score-integrity.cjs` executes the real migration and ten games' native saves in PostgreSQL-compatible PGlite. It covers pending-to-complete progress, review-to-summary transitions, result deletion/reset, zero-to-perfect replacement, future dates, stale revisions, grandfathered captures, Lowball history/fallback/aliases, legacy Stack Up hydration, repeatable installation, private privileges and account isolation. `tests/friends.cjs` installs the guards before testing real account/cloud/social flows against SQL. No production player record is modified for these tests.
