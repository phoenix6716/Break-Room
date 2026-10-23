# Time Drop release evidence

The owner-approved implementation is documented in [the game contract](games/time-drop/README.md). The original uploaded prototype and all Prior source events/saves remain preserved.

## Live Supabase — verified 23 October 2026

Project `quhyzwivpdznmffmwhcr` (Break Room) received `supabase/time-drop.sql` through migration `20261023085848`, named `time_drop_snapshot_scoring_and_cloud_support`.

Read-only live fixtures returned Arcade 94 for ten modern guesses three years away, 0 for ten wide misses, and 100 for accepted approximate ranges. A malformed snapshot was rejected. Anonymous/authenticated roles cannot execute the private scoring helper. All four save/social tables retained RLS, row counts and aggregate content fingerprints before/after the migration. Security advisor findings remained at their existing baseline: RPC-only social tables, intentionally guarded authenticated definer RPCs, and the pre-existing leaked-password protection warning. No customer test records, emails or invitations were created.

## Engineering checks and deployment

Time Drop's pure rules/content/save/SQL suite and affected legacy/model/security checks passed in Actions run [39928363981](https://github.com/phoenix6716/Break-Room/actions/runs/39928363981). That run also passed cross-device account coverage; publication remained blocked by an outdated profile-basis wording assertion. The assertion is updated to the current saved-history wording, which preserves archived results.

Browser checks and final deployment are still in progress. A green unit check or successful live SQL migration is not evidence of Pages publication. Physical-phone/screen-reader testing and full independent editorial certification of the 202 new event additions remain distinct from browser automation and sampled source crosschecks.
