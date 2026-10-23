# Time Drop release evidence

The owner-approved implementation is documented in [the game contract](games/time-drop/README.md). The original uploaded prototype and all Prior source events/saves remain preserved.

## Live Supabase — verified 23 October 2026

Project `quhyzwivpdznmffmwhcr` (Break Room) received `supabase/time-drop.sql` through migration `20261023085848`, named `time_drop_snapshot_scoring_and_cloud_support`.

Read-only live fixtures returned Arcade 94 for ten modern guesses three years away, 0 for ten wide misses, and 100 for accepted approximate ranges. A malformed snapshot was rejected. Anonymous/authenticated roles cannot execute the private scoring helper. All four save/social tables retained RLS, row counts and aggregate content fingerprints before/after the migration. Security advisor findings remained at their existing baseline: RPC-only social tables, intentionally guarded authenticated definer RPCs, and the pre-existing leaked-password protection warning. No customer test records, emails or invitations were created.

## Engineering checks and deployment

[Actions run 39929019685](https://github.com/phoenix6716/Break-Room/actions/runs/39929019685) passed all selected rules/content/model/security and browser checks. This includes 330 preserved/sourced events, a 33-day nonrepeating deck, ten-round Dailies at five widths, touch/keyboard controls, draft/review/summary reloads, first-lock protection, cross-tab/Sydney rollover, denied storage/clipboard, 321 actual Unlimited rounds/deck rollover, two-device account restoration and real PostgreSQL-derived private Friends comparisons. The old profile-basis wording assertion now reflects archived saved history.

The merged candidate is gated again by the main Pages workflow. The final shipped SHA/run and confirmed publication are recorded in [PR #7](https://github.com/phoenix6716/Break-Room/pull/7). The game route is `games/time-drop/index.html`. CI screenshots are retained with the check logs.

Physical-phone/screen-reader testing and full independent editorial certification of the 202 new event additions remain distinct from browser automation and sampled source crosschecks.

## Source-link pass

The 202 new events' 194 distinct original reference URLs were checked through batched web retrieval. Two missing pages were replaced with American Physical Society/MIT references; the insulin and South Sudan citations were upgraded to University of Toronto and UK government records. The client also resolves those corrected URLs for previously captured snapshots, without changing their facts, guesses, scores or raw saves. See `content/time-drop-source-check.json`. Page retrieval does not independently certify every historical assertion.
