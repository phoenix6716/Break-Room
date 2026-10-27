# Private weekly leagues — 26 October 2026

[Leagues](LEAGUES.md) adds invite-based weekly competition separately from Friends averages. League membership explicitly shares completed Daily scores with current members regardless of the Friends sharing toggle. Two required games plus one best optional weekly total count, up to 2,100. Existing Friends consent, comparisons, blocks and saved scores retain their meanings. Apply supabase/leagues.sql after the current save/Friends/game migrations; no earlier migration is replaced.

## Current release: Shift Work — 25 October 2026

Shift Work is the tenth active game, after Seating Chart. Current shelf: Laser, Time Drop, Clue Ladder, Seating Chart, Shift Work, Hidden Gem, Stack Up, Pack, Lowball, Inner Clock. Stake/Prior/Alibi/Bouncer are archived; fourteen native formats remain supported. Older roster counts and complete-installer claims below are historical and superseded.

Three untimed Daily boards keep the approved 4–5 / 6–7 / 8–9-slide challenge. 180 frozen boards provide 40 nonrepeating Daily sets and free Unlimited. Native total moves is lower-is-better; Arcade scores are higher-is-better. First solves lock, third counts immediately, and prototype records remain separate. Read [the full contract](games/shift-work/README.md).

Apply [supabase/shift-work.sql](supabase/shift-work.sql) after setup/Friends/Hidden Gem. Fresh install: setup.sql → friends.sql → hidden-gem.sql → shift-work.sql. Only the game's private table, constrained APIs and private replay helpers are added; older tables/functions remain unchanged. Verify live SQL/configuration/Pages separately from CI. Human/device playtesting remains a launch check.

# Stake shelved — owner decision, 24 October 2026

Stake is removed from the active shelf, navigation drawers, current Daily checklist and Friends comparisons. Nine active games, in order: Laser → Time Drop → Clue Ladder → Seating Chart → Hidden Gem → Stack Up → Pack → Lowball → Inner Clock. Stake joins Prior, Alibi and Bouncer in the archive. Preserve its direct route, engine, question bank/artwork, local/cloud saves, native/Arcade scores and earned achievements. Profile shows saved Stake history without play prompts; unearned High roller and the legacy three-game Clean sweep are hidden, while earned badges retain their original meaning. Thirteen native save formats remain supported; no database/schema change is needed. The canonical shell still uses Stake's layout. This supersedes older active-roster counts below.

# Friends and score comparisons

## Current release: Hidden Gem

Hidden Gem is the tenth active game, after Seating Chart. It has five 30-second Daily questions, one input with retries for unlisted answers, individual 1–100 editorial answer ratings, and a five-question average out of 100 for both native and Arcade scores. Its 160 scoped questions / 1,004 answers provide 32 Daily sets and free nonrepeating Unlimited practice. See [the current contract](games/hidden-gem/README.md).

Existing saves and archived games remain supported: thirteen native formats. Apply [supabase/hidden-gem.sql](supabase/hidden-gem.sql) after setup/Friends. This creates only Hidden Gem’s private table/RPCs; the older shared save and Friends functions are unchanged. Fresh installation is setup.sql → friends.sql → hidden-gem.sql. Older roster counts and “complete installer” statements below are historical and superseded for this release. Live database and Pages status must be verified separately from CI.


## Previous release: Seating Chart

Nine active games and twelve supported native cloud formats including archives. Seating Chart adds five untimed Daily seating puzzles, 360 frozen tables / 72 Daily sets, immediate draft saving and free Unlimited. Read [its current contract](games/seating-chart/README.md) for scoring, accessibility, save/schema and verification details. This supersedes older roster counts below; prior game contracts remain compatibility documentation.


## Clue Ladder — owner-approved build, 23 October 2026

Clue Ladder is the eighth active game: Laser → Time Drop → Clue Ladder → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain archived; eleven native save formats are supported. This supersedes older roster counts below.

Five untimed Daily puzzles use five progressively clearer clues. Solves on clue 1 / 2 / 3 / 4 / 5 earn 1,000 / 800 / 600 / 400 / 200 points; unsolved earns zero. Maximum 5,000 native points, Arcade = points / 50. No speed penalty, Daily multiplier, hearts, intro screen or live AI. Preserve the ladder and pixel climber inside the centred Stake shell with ?-only help. Read `games/clue-ladder/README.md`.

The 300 distinct, editorially reviewed familiar answers span eight topics and provide 60 nonrepeating Daily sets, each with five different topics. References and automation do not establish independent primary-source certification or human difficulty calibration. Save input, hints, attempts and frozen puzzle snapshots immediately; first completion wins. Owner-scoped tab-local Unlimited excludes today's five answers, applies topic changes next puzzle and reshuffles after eligible-pool exhaustion.

Existing Time Drop projects apply `supabase/clue-ladder.sql`; updated complete `supabase/inner-clock.sql`, or fresh setup then friends, also includes it. Verify live SQL and deployment separately. Preserve existing saves, scores, artwork and archived routes.


## Time Drop — owner direction, 23 October 2026

Time Drop replaces Prior in the active lineup: Laser → Time Drop → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain shelved with their engines, sources and historical saves preserved. Seven active games; ten supported native save formats including archives.

The owner requested no hearts anywhere in Time Drop, reasonable partial-credit scoring, expanded/balanced content, reliable saves and locked answers, a large ongoing Unlimited mode (never call it Endless), and the canonical Stake layout. Read `games/time-drop/README.md` for the exact 330-event/66-day deck, fixed era-based linear scoring, accepted date ranges, native 5,000-point / Arcade 100-point scales for new five-round Dailies (version 2); original ten-round version 1 saves retain their 10,000-point scale, first-lock saves and tab-owned practice. Preserve Prior's source and legacy results rather than reinterpreting them. Keep the original uploaded prototype outside the production artifact.

Existing live projects apply `supabase/time-drop.sql` after the current Inner Clock/player-feedback migration. For an already-enabled Time Drop project, apply `supabase/time-drop-five-rounds.sql` to support both run lengths. Updated `supabase/inner-clock.sql` includes it; fresh setup then friends supports all ten formats. Do not reapply historical narrower migrations. Publication is already authorised automatically after affected checks; verify live SQL separately from CI and deployment.

## Activation

The site code uses the existing Supabase sign-in client and cloud saves. Run the entire [`supabase/friends.sql`](supabase/friends.sql) in **Supabase → SQL Editor → New query → Run**, after the existing `setup.sql` has already been applied. This adds social tables and constrained RPCs; it does not replace or reset `game_saves`, change auth URLs, or require new client secrets. Fresh projects use current `setup.sql` then `friends.sql`. Existing setup/Friends installations apply the complete [`supabase/inner-clock.sql`](supabase/inner-clock.sql) update last; it preserves saves, friend codes and relationships. Do not reapply older narrower per-game migrations.

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

All internal parser/scoring helpers have API execution privileges revoked. Server calculations preserve version 1: Lowball's dated average/fallback, Stake's chip-weighted correctness including timeout losses, Stack Up's clamped points/3,100 for scoreVersion 2 (31,000 for original saved runs), and Pack's earned/optimal usefulness across three untimed bags. Legacy Stake's frozen 164-question shuffle is reproduced with explicit unsigned 32-bit arithmetic. `arcade-score.js` remains the shared presentation/aggregation calculator for the returned records. SQL/JavaScript parity is tested; change both deliberately if a future score version changes.

These are privately shared scores from browser-originated saves. The server derives values rather than accepting a submitted comparison score, but a player can still manipulate their own game save. This is not an anti-cheat system or a basis for prizes/public competitive rankings.

## Implementation and verification

`friends.html`, `friends.css` and `friends.js` replace the old example people/score feed. Sharp cream/navy panels, sky blue invite card, lime actions, type and hard shadows follow the existing site style. Inputs remain disabled until their submission handlers and authenticated state are ready. Guests see sign-in links, not fake codes/results. Request responses are discarded if the user changes while a request is pending, and periodic refresh preserves unsaved settings edits.

`accounts.js` exposes a readiness promise, own-user accessor and a narrowly scoped social-RPC bridge so the page reuses the official Supabase client instead of creating a second session manager. All pre-existing guarded account navigation, cloud ownership and guest-import rules remain in place.

`tests/friends-database.cjs` executes both migrations against real PostgreSQL via PGlite, checks repeatable installation, relationships and authorization across three users, opt-in/revoked sharing, raw-save isolation, anonymized response shape, 120 legacy answer-permutation dates, weighted-bet/timeout cases, Stack Up bounds, malformed/pending saves, score parity and the exact 120-day window. `tests/friends.cjs` combines the real SQL RPCs with two browser contexts and the official auth client (email sign-in transport is mocked). It covers real codes/copy, invite/accept/remove/block/unblock, today/history/game comparisons, zero versus missing scores, sharing changes, HTML-safe names, missing migration/offline failures, logout cleanup, disabled no-JS forms and 320/390/768/1100/1440px layouts. No real users/emails are created by the tests.

## Pack migration

Current existing projects run `supabase/inner-clock.sql` last after setup and friends; it includes Pack. The older Pack-only migration is retained for historical upgrades/tests and must not be reapplied after newer migrations. Fresh projects use updated setup then friends. The Pack parser validates all three completed snapshots and legal masks, independently solves each unique optimum, and returns only the bounded Daily Arcade score. Self-reported score fields are ignored. The profile and private comparison filters include Pack, and averages still weight each played game equally. `tests/pack-rules.cjs` checks every generated bag against SQL and a separate solver; the friend database tests include Pack in accepted/blocked/sharing privacy checks.

## Prior migration and comparisons

Existing projects apply `supabase/inner-clock.sql` last; it includes Pack support as well. Fresh setup/friends includes Prior directly. `_friend_prior_score` validates five complete pair snapshots with distinct event IDs, integer years, unequal pair dates and binary choices, then derives correct × 20. It ignores asserted score fields. Only the bounded completed Arcade result reaches accepted, unblocked, opted-in friends; no event answers, sources, guesses or raw saves are returned. The profile and friend filters include all nine playable games, while missing games remain excluded from equal-game averages. Database tests include Prior positive/zero scores, malformed shapes, shared access boundaries and the exact 120-day window.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/inner-clock.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi evidence files — current contract (v3)

New games use **128 evidence-led files**, 32 per tier, across stamp matches, paired badge permissions, inventory differences and seal custody. All observations are verified; players match the physical evidence to a catalogue entry and deduce its owner. Each fresh Daily uses all four methods, with a 32-day rotation. Assignment notes are ungraded, and reveals explain the evidence match and deductions. Four untimed cases, first-confirmation finality and correct × 25 Arcade scoring remain.

The 155 v2 visit scenarios and original v1 snapshots retain their original rules, notes, choices and scores. The existing eight-person portrait atlas is unchanged. See [the current Alibi contract](games/alibi/README.md) and [the player-feedback release](PLAYTEST-FEEDBACK.md) for sources, validation and limits.

Before deploying this release to an existing project, apply **`supabase/playtest-feedback.sql` after the previous Inner Clock migration**, or use the updated complete `supabase/inner-clock.sql`. Fresh projects use current setup then Friends. These repeatable migrations support all three Alibi formats and versioned Stack Up scores without rewriting saves, RLS, relationships or sharing settings. Live SQL and deployment are separate from passing repository tests.

## Laser Expert v2

New Expert boards require three player mirrors. Native first-fire hits and Arcade hits × 25 are unchanged; historical two-mirror Expert scores are never reinterpreted. This scale is not a percentile and does not imply equal difficulty across releases. Existing Supabase projects apply the complete `supabase/inner-clock.sql` update last after setup/Friends; it supports all nine games and keeps both old/new Laser records valid. Fresh projects use updated setup/Friends. Cloud snapshot uploads require no new allowlist.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/inner-clock.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, all three Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile, menus, accounts and Friends support nine playable games. The homepage shows only those nine games; the six cancelled placeholder cards remain removed. Public billing and prelaunch human/content/device reviews remain deferred.

## Fresh comparison results — 27 October 2026

Every Friends refresh now waits for the current own-account upload before reading server-derived comparison scores. Concurrent sync callers share one promise, and a result completed during upload is included before that promise resolves. Visible Friends pages refresh after native-save storage events from other tabs as well as their existing return/periodic refreshes. Upload failures and inactive cloud saves are described explicitly; guest progress is never imported automatically. Friends still downloads no raw saves, accepts only the existing private score RPCs and preserves sharing/blocking/identity guards. `tests/friends-freshness.cjs` exercises a held upload, a newer completion, another-tab result and self/accepted-friend agreement against isolated PostgreSQL with the official browser auth client.
