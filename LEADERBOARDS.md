# Global Daily leaderboards

Casual public standings for each of the ten current games. Entry is an explicit, independent opt-in with a separate leaderboard name. Guests can browse; existing Friends sharing and league membership never enroll anyone. Discover the page from Leagues, Settings → Saves & privacy, or the link below each game. Participation can be withdrawn immediately without changing other sharing choices.

## Rules and privacy

Standings show the current Australia/Sydney date and reset at midnight there. Only synced, completed Dailies using the current captured scoring rules qualify. Unlimited and partial attempts do not count. Earlier captures retain their native history/scores and get an explanatory eligibility message. Scores are rounded to the displayed one decimal before ranking; equal scores share a competition rank (1, 1, 3), with no time tiebreaker. A stable random public identifier orders tied rows for pagination without changing their shared rank. Five rows appear per phone page, ten otherwise; each RPC returns at most 25. A player's own rank and optional nearby rows are available even outside the current page. There is no overall or lifetime ranking.

Opt-in names, public identifiers and eligible scores are visible to everyone, including guests and blocked Friends. Emails, authentication UUIDs, friend codes, relationship metadata, raw saves, answers and unfinished rounds are never returned. The page is noindex to discourage search indexing; previously viewed public information cannot be recalled. Private profile/cache records remain with the account after withdrawal; account deletion cascades them. The operator can set the private profile's `suspended` flag to hide abuse; participants cannot clear it themselves.

These are browser-originated results. Current cloud integrity guards prevent changing finished cloud receipts, but browser answers, offline modification, outside help and plausible forged first submissions remain possible. No verified competitive-play, cash or prize claim is made.

## Installation and data flow

Apply `supabase/migrations/20261106094324_daily_leaderboards.sql` after the current game/scoring installers and active integrity guards. It is additive and repeatable; no existing player is enrolled or regraded. All old save/relationship records remain intact. The migration creates private `br_leaderboard.profiles` and `entries`, with RLS and no direct client table privileges. Public SQL-invoker wrappers delegate to narrowly granted private functions; writes derive ownership from `auth.uid()` and validate the expected actor to prevent account-switch races. Public reads expose only opted-in, unsuspended current-day listings.

After-save triggers on the three native save tables derive entries with existing private score validators. Clients cannot submit leaderboard scores or write cache rows. The first valid published result is retained. Joining backfills only the current day's eligible cloud completions. An indexed `(day,game,score,user_id)` cache avoids rescoring everyone on each read; already cached receipts skip repeat derivation. Helpers and direct table access remain private. Installing does not change timers, models, gameplay, existing save formats or sharing flags.

`leaderboard_profile(get/set)` manages the signed-in player's listing; set requests carry `p_expected_user` equal to the authenticated actor. `daily_leaderboard(game,offset,limit)` returns a bounded current-day page, total, own position and neighbors. These are the only new browser RPCs. Leaderboard reads await initial account restoration and pending uploads; later refreshes use upload-only sync. Requests are invalidated on account switches, network failures clear stale rows, and names render as text.

## Checks

`tests/leaderboards-database.cjs` runs the real PostgreSQL migration and save APIs: independent consent, no enrollment on install, trigger/backfill derivation, no client score writes, zeroes, ties/rounding, pagination, own/neighbors, legacy-rule exclusion, moderation, withdrawal, role privacy and account-deletion cascades. `tests/leaderboards.cjs` uses the official SDK against isolated real SQL fixtures to check guest/signed-in phone/desktop layouts, opt-in/out, XSS-safe names, pagination, sync ordering, errors, logout and navigation. Production verification must not publish fake players or alter real user records.
