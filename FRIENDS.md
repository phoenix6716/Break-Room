# Friends and score comparisons

## Activation

The site code uses the existing Supabase sign-in client and cloud saves. Run the entire [`supabase/friends.sql`](supabase/friends.sql) in **Supabase → SQL Editor → New query → Run**, after the existing `setup.sql` has already been applied. This adds social tables and constrained RPCs; it does not replace or reset `game_saves`, change auth URLs, or require new client secrets. This migration can be re-run without regenerating existing friend codes or deleting relationships.

After the GitHub Pages deployment succeeds, open `friends.html`, sign in, choose a public display name and create a friend code. Score sharing starts unchecked: explicitly select it to share completed Dailies with accepted friends. Send your code to another player yourself, or enter theirs. The recipient accepts the request before either side can see the other's shared scores. No invitations or emails are sent by this feature.

Verify live with two accounts: send/accept a request, enable sharing, complete and sync Dailies, refresh Friends and compare the displayed per-game/Arcade scores. Switch sharing off and refresh the other account; its access to new score responses must disappear. Check remove/block/unblock and the guest/login state. The automated tests below run the actual SQL locally but cannot apply the migration to the live project using a publishable key.

## Behavior

- Friend codes are randomly generated 16-character hexadecimal codes, displayed in four groups. They are not emails, names or sequential account identifiers. Codes remain stable across visits.
- Incoming requests can be accepted, declined or blocked; outgoing requests can be cancelled. Accepted friends can be removed or blocked. Unblocking does not restore a friendship: send and accept another request.
- Each user can have up to 20 outgoing pending requests and 100 accepted friends. Reciprocal requests do not silently become friendships. Blocked users cannot send further requests in either direction until unblocked.
- The display name is specific to the friend profile, separate from the original account sign-up name. Email addresses never enter the social RPC response. Names are rendered as text, including characters that resemble HTML.
- Sharing applies to all accepted friends, is off by default and is editable anytime. Your own cloud results remain visible to you while sharing is off. Friends with sharing off appear with a clear label and no shared score values.
- The comparison offers Today or the last 120 Sydney calendar dates, and an optional game filter. Each score is 0–100; the overall average equally weights played-game averages, exactly as the profile does. Missing/unplayed/in-progress games are excluded, genuine zeroes count and sample counts are visible. No public global leaderboard or guessed demo data is included.
- Comparisons read synced cloud saves, not arbitrary local/guest storage. Unsynced progress appears after cloud upload and refresh. Refresh tries the existing own-account upload first, and the page refreshes on return to the tab and every minute while visible. Remote data is never installed into running engines by Friends.
- Stale score cards are cleared on errors and identity changes; logout clears private friend UI. Changing a sharing setting or removing/blocking a friend prevents subsequent server reads. Another open page can display already received results until its next refresh; this is not a way to retract data someone already viewed.

## Data boundaries and scoring

`friend_profiles`, `friend_links` and `friend_blocks` have RLS enabled with direct client table privileges revoked. Authenticated operations go through `friend_hub`; it derives the caller from `auth.uid()` and restricts each operation to the caller's own relationships. Directory lookup requires an exact code. The RPC returns only the caller's own code, relevant display names/IDs, relationship lists and accepted friends' sharing flags. There is no public directory or email search.

`friend_scores` is a security-definer function with a pinned empty search path. It derives the caller from the session, chooses only self or accepted, unblocked, sharing peers, and computes completed Daily Arcade results from those users' private native cloud snapshots. The only record fields returned are `user_id`, `game`, `date` and `arcadeScore`, plus the authoritative Sydney `today` date. Answers, guesses, item/question snapshots, deadlines, incomplete rounds, preferences and raw cloud saves are never returned to friends. Existing `game_saves` RLS/grants are unchanged.

All internal parser/scoring helpers have API execution privileges revoked. Server calculations preserve version 1: Lowball's dated average/fallback, Stake's chip-weighted correctness including timeout losses, Stack Up's clamped points/31,000, and Pack's earned/optimal usefulness across three untimed bags. Legacy Stake's frozen 164-question shuffle is reproduced with explicit unsigned 32-bit arithmetic. `arcade-score.js` remains the shared presentation/aggregation calculator for the returned records. SQL/JavaScript parity is tested; change both deliberately if a future score version changes.

These are privately shared scores from browser-originated saves. The server derives values rather than accepting a submitted comparison score, but a player can still manipulate their own game save. This is not an anti-cheat system or a basis for prizes/public competitive rankings.

## Implementation and verification

`friends.html`, `friends.css` and `friends.js` replace the old example people/score feed. Sharp cream/navy panels, sky blue invite card, lime actions, type and hard shadows follow the existing site style. Inputs remain disabled until their submission handlers and authenticated state are ready. Guests see sign-in links, not fake codes/results. Request responses are discarded if the user changes while a request is pending, and periodic refresh preserves unsaved settings edits.

`accounts.js` exposes a readiness promise, own-user accessor and a narrowly scoped social-RPC bridge so the page reuses the official Supabase client instead of creating a second session manager. All pre-existing guarded account navigation, cloud ownership and guest-import rules remain in place.

`tests/friends-database.cjs` executes both migrations against real PostgreSQL via PGlite, checks repeatable installation, relationships and authorization across three users, opt-in/revoked sharing, raw-save isolation, anonymized response shape, 120 legacy answer-permutation dates, weighted-bet/timeout cases, Stack Up bounds, malformed/pending saves, score parity and the exact 120-day window. `tests/friends.cjs` combines the real SQL RPCs with two browser contexts and the official auth client (email sign-in transport is mocked). It covers real codes/copy, invite/accept/remove/block/unblock, today/history/game comparisons, zero versus missing scores, sharing changes, HTML-safe names, missing migration/offline failures, logout cleanup, disabled no-JS forms and 320/390/768/1100/1440px layouts. No real users/emails are created by the tests.

## Pack migration

Current existing projects run `supabase/alibi-scenarios.sql` last after setup and friends; it includes Pack. The older Pack-only migration is retained for historical upgrades/tests and must not be reapplied after newer migrations. Fresh projects use updated setup then friends. The Pack parser validates all three completed snapshots and legal masks, independently solves each unique optimum, and returns only the bounded Daily Arcade score. Self-reported score fields are ignored. The profile and private comparison filters include Pack, and averages still weight each played game equally. `tests/pack-rules.cjs` checks every generated bag against SQL and a separate solver; the friend database tests include Pack in accepted/blocked/sharing privacy checks.

## Prior migration and comparisons

Existing projects apply `supabase/alibi-scenarios.sql` last; it includes Pack support as well. Fresh setup/friends includes Prior directly. `_friend_prior_score` validates five complete pair snapshots with distinct event IDs, integer years, unequal pair dates and binary choices, then derives correct × 20. It ignores asserted score fields. Only the bounded completed Arcade result reaches accepted, unblocked, opted-in friends; no event answers, sources, guesses or raw saves are returned. The profile and friend filters include all five games, while missing games remain excluded from equal-game averages. Database tests include Prior positive/zero scores, malformed shapes, shared access boundaries and the exact 120-day window.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/bouncer.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi scenarios — current contract (v2)

The owner approved real scenarios grounded in incidents, timelines and evidence, plus generated men’s/women’s portraits. Alibi now selects **96 new evidence-dependent visit-reconstruction cases**, 24 per tier. Only the culprit’s account is false; everyone else’s account and the verified records are accurate. The incident window determines the relevant visit. Both records and accounts are necessary, and each case has one complete reconstruction. This supersedes the original abstract false-count rules for **new** cases. Personal notes remain ungraded; four untimed Dailies, first-confirmation finality and correct × 25 Arcade scoring are unchanged.

Eight illustrated portraits were generated as an image atlas and encoded as an optimized WebP; CSS selects a cell. New snapshots store stable, distinct random portrait assignments, unrelated to guilt. Existing original-format drafts/notes/completions/history keep their original rules and scores; new scenarios are available in Unlimited immediately and the next fresh Daily. The frozen 144-case original bank and tests remain outside production. Read `games/alibi/README.md` for exact source, schema, behavior and compatibility.

**Current complete upgrade: run `supabase/bouncer.sql` LAST.** It includes Alibi scenarios and three-mirror Laser Expert, so earlier per-game updates need not be reapplied. It includes all earlier games and both Alibi parsers. Fresh projects use current setup then Friends; do not reapply old narrower migrations. Personal raw snapshots/notes remain private; Friends expose only completed normalized records through existing sharing controls. Human playtesting and the separately agreed prelaunch audit remain necessary. No billing or other game was enabled.

## Laser Expert v2

New Expert boards require three player mirrors. Native first-fire hits and Arcade hits × 25 are unchanged; historical two-mirror Expert scores are never reinterpreted. This scale is not a percentile and does not imply equal difficulty across releases. Existing Supabase projects apply `supabase/laser-expert.sql` after the current Alibi update; it extends only the private Laser snapshot scorer and keeps both old/new records valid. Fresh projects use updated setup/Friends. Cloud snapshot uploads require no new allowlist.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/bouncer.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, both Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile/menus/homepage/accounts/Friends include nine playable games and six coming-soon cards. Public billing and prelaunch human/content/device reviews remain deferred.
