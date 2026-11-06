## Account menu and Settings — owner-approved approach, 6 November 2026

The existing Account link opens a compact keyboard-accessible menu: Your profile, Settings and Log out (Log in for guests). Keep its ordinary destination as the no-JavaScript/modified-click fallback. Never restore the removed question-mark avatar. Settings has three views: Account, Game preferences and Saves & privacy. Keep guest preferences and save exports available, use the official authenticated Supabase SDK for name/email changes and password-reset email, and require email confirmation without claiming a pending address is active. Editing an existing social name preserves its latest sharing choice; a player without a Friends profile is never automatically enrolled. A cross-service name failure may leave the Friends name updated; surface this honestly and allow retry.

The owner approved one sound preference for all ten games, superseding the earlier separate Lowball setting. `preferences.js` loads before controllers. Explicit `break-room:game-sound` wins on migration; otherwise an existing `pc_sound` choice is adopted. New browsers default off. Mirror future choices to the legacy key. Volume and reduced motion are device/browser preferences, excluded from gameplay/cloud saves. Device reduced motion always applies; the player can additionally request it. Propagate changes across tabs and the Lowball iframe without creating audio contexts. Keep each game's single control, preserve Time Sense's silent/still running attempts and timed-stop ordering. No game rules, captured saves, timers, scores or database schema change. See `tests/settings.cjs`, `ACCOUNTS.md` and `IMMERSION.md`.

## Stack Up variety — owner feedback, 5 November 2026

The 160 Daily stacks now cover 80 authored themes, replacing 16 heavily reused templates. Each theme has two distinct five-card selections, at calendar slots 16 days apart. Interleaved subject order prevents runs of film-release, recipe or life-cycle templates. Preserve all 160 IDs, five lanes, original date selector and 32-day repeat-free ID rotation. Author `content/stack-up-familiar-topics.json`; run `node scripts/build-familiar-stacks.cjs`. Each theme has reference links and a clear ordered master sequence. No maths, numerical-fact or time-unit tasks return.

Fresh Unlimited deduplicates by theme/prompt and favours the familiar version: 80 familiar themes plus 10 additional challenge prompts, 90 in All topics. Exclude the entire captured Daily theme from practice, not just its selected five-card variant. Topic changes still apply to the next stack. This deliberately retires near-duplicate practice variants rather than inflating the active count. Original source/challenge data remains for compatibility. Already captured Dailies retain original questions, drafts, timers, score versions and results; cloud merges retain an existing remote capture when question snapshots differ. No database migration, score change or other-game edit is required. Archive: `content/archive/2026-11-05-pre-stack-variety/`. Source retrieval and editorial review are recorded under `design/content-reviews/2026-11-05-stack-variety*`; accessibility is an editorial estimate, not measured player recognition. Earlier content counts below are historical.

## Stack Up first-try scoring — owner correction, 5 November 2026

Fresh Stack Up runs use `scoreVersion:4`: a correct first submission earns 100 regardless of time remaining or prior streak. Deduct 20 per wrong submission, bounded at zero; timeout scores zero. The Daily is the mean of its five round scores. Keep the 90-second timer and all raw receipt fields and mechanics for compatibility. All captured score versions 1/2/3, including unfinished captures, retain original scores, deadlines and rules. No data is regraded or reset. Only Stack Up changes in this correction. Apply `supabase/stack-up-first-try.sql` before publishing; the private receipt validator and score reader support both v3 and v4. Archive: `content/archive/2026-11-05-pre-stack-first-try/`. Earlier scoring entries below are historical.

## 0–100 scores for three games — owner scope, 5 November 2026

This applies only to Clue Ladder, Time Drop and Stack Up. Do not change scoring or presentation for the other seven games. Each of these games shows a score out of 100 for each round and one final Daily score out of 100. Time Drop and Clue Ladder divide existing round points by ten; their final averages are mathematically unchanged. Their captured questions, timers, rules, raw saves and cloud score helpers remain unchanged. Profile/history/sharing for these three games use the same single visible scale.

Fresh Stack Up runs retain outer version 2 and use `scoreVersion:3`: each round's net existing base credit is divided by its maximum (550 + 35 × zero-based round index), scaled to 100 and clamped to 0–100; failures score zero. Daily score is the unrounded average of five round scores, formatted to one decimal for display. Ninety-second timers, wrong-order feedback, raw base credits, streak mechanics and deadlines remain. Old scoreVersion 1/2 or untagged captures retain their original final calculation and data, displayed on the existing normalized 0–100 scale. Cloud merges retain the remote captured score version. Never regrade or restart saved runs.

Apply `supabase/stack-up-score100.sql` before publishing. It adds one private score helper and only a scoreVersion-3 branch to the existing shared reader, leaving all other game branches and the write API unchanged. Existing player rows are not migrated. Current fresh installers include the same helper. Archive: `content/archive/2026-11-05-pre-three-game-scores/`. See the three game contracts and `tests/three-game-scoring.cjs`.

## Seating Chart has three Daily puzzles — 5 November 2026

Fresh version-2 Dailies contain Easy (6 guests, original tier 1), Medium (8 guests, tier 3) and Hard (10 guests, tier 5), in that order. Keep the original 72-day index/epoch and unchanged 360-table bank. These 216 tables provide 72 nonrepeating three-table sets; all five original practice tiers remain available in Unlimited. Structural tiers are not human difficulty certification.

Each table retains the original avoidable-drama formula. Daily Arcade is the three-table average (3,000 internal points / 30); native total drama remains lower-is-better. Saved version-1 Dailies keep five tables, their picks/drafts/Undo, original points / 50 and history. The third or fifth reception counts immediately according to its captured version. Perfect host means all tables in that captured Daily. Cloud merges retain the first remote capture's version. Do not mix three/five-table attempts or regrade history.

Existing projects apply `supabase/seating-chart-three.sql`. Fresh Friends, Inner Clock and standalone Seating Chart installers include both score formats. The live update changes only the private score reader; no player rows or shared write API change. Archive: `content/archive/2026-11-05-pre-seating-chart-three/`. See [the current contract](games/seating-chart/README.md); earlier five-table notes below are historical.

## Codebreak safe input and four-guess scoring — 5 November 2026

The safe display is now the single native code input. Keep tap/keyboard entry, keypad, deletion, clearing, focus visibility, screen-reader labels and immediate draft saves working through that input. Fresh version-4 rounds award 100 through four guesses, then 90 / 80 / 70 / 60 on guesses 5–8; failure remains zero. Existing v1/v2/v3 captures retain their original digit ranges, clues and scoring, while using the new input surface. Do not regrade or change captured versions. The 6,561-day current calendar and eight-guess limit are unchanged; Clear signal still means within three guesses.

Existing projects apply `supabase/codebreak-v4.sql` after v3; fresh setup uses updated `supabase/codebreak.sql`. Only private validation/scoring helpers change. No rows, calendars or write APIs are migrated. Archive: `content/archive/2026-11-05-pre-codebreak-safe-input/`. See [the current contract](games/codebreak/README.md); earlier release notes below are historical.

## Codebreak uses digits 1–9 — 5 November 2026

Fresh version-3 Codebreak rounds use four digits from 1–9, repeats allowed, per-digit clues and eight guesses. Points remain 100 through five guesses, then 90 / 80 / 70. The complete nonrepeating Daily rotation is now 6,561 days, resetting at midnight Australia/Sydney. Existing v1/v2 captures keep digits 1–6, their original 1,296-day calendar, clues, drafts and scores. Unlimited finishes its captured round before drawing v3. First cloud capture still owns its rules; never change captured versions or regrade results. Clear signal remains within three guesses.

Apply `supabase/codebreak-v3.sql` after the v2 update for existing installations, or use updated `supabase/codebreak.sql` for fresh setup. The old private daily function and all player rows remain unchanged. Cache-bust the model on every built account/profile/social page together with the game controller. Archive: `content/archive/2026-11-05-pre-codebreak-nine-digits/`. Read [the current contract](games/codebreak/README.md); previous release notes below describe historical versions.

## Codebreak digit clues — 5 November 2026

Fresh Codebreak rounds use version 2: each digit shows right place, elsewhere or no remaining match. Exact positions match first; remaining copies match left to right. Eight distinct guesses, four digits from 1–6, repeats and the 1,296-day Sydney calendar stay fixed. Solves within five guesses earn 100, then 90 / 80 / 70 on guesses 6–8; failure is zero. Clear signal still requires a solve within three guesses.

Every captured version-1 Daily/Unlimited round retains count-only clues and original scoring (100 through three guesses, then 90 / 80 / 70 / 60 / 50). Never regrade history or switch a captured round's version. First valid cloud capture owns its rules; cross-version merges retain the remote snapshot and the server rejects rule changes or omission of captured keys. Existing projects apply `supabase/codebreak-v2.sql`; fresh projects use updated `supabase/codebreak.sql`. No player rows are migrated. See [the current contract](games/codebreak/README.md); older Codebreak release notes below are historical.

## Codebreak is the tenth launch game — 4 November 2026

The owner chose Codebreak to replace shelved Sleeper in the ten-game launch. One untimed Daily code, four digits from 1–6 with repeats, eight guesses, separate free Unlimited. Full points within three guesses, then 10 fewer per extra guess; an uncracked code scores zero. Read `games/codebreak/README.md` for the frozen v1 rotation, saves, scores, accessibility and verification contract. Preserve every existing game's source and native/cloud history. Existing installations apply `supabase/codebreak.sql` after the current league setup; the new game uses a separate validated save table and private score helpers. The nine-game shelving entries below are historical; Sleeper stays hidden.

## Current release: Shift Work — 25 October 2026

Shift Work is the tenth active game, after Seating Chart. Current shelf: Laser, Time Drop, Clue Ladder, Seating Chart, Shift Work, Hidden Gem, Stack Up, Pack, Lowball, Inner Clock. Stake/Prior/Alibi/Bouncer are archived; fourteen native formats remain supported. Older roster counts and complete-installer claims below are historical and superseded.

Three untimed Daily boards keep the approved 4–5 / 6–7 / 8–9-slide challenge. 180 frozen boards provide 40 nonrepeating Daily sets and free Unlimited. Native total moves is lower-is-better; Arcade scores are higher-is-better. First solves lock, third counts immediately, and prototype records remain separate. Read [the full contract](games/shift-work/README.md).

Apply [supabase/shift-work.sql](supabase/shift-work.sql) after setup/Friends/Hidden Gem. Fresh install: setup.sql → friends.sql → hidden-gem.sql → shift-work.sql. Only the game's private table, constrained APIs and private replay helpers are added; older tables/functions remain unchanged. Verify live SQL/configuration/Pages separately from CI. Human/device playtesting remains a launch check.

# Supabase accounts and cloud saves

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

Break Room stays on GitHub Pages. Authentication and private native-game snapshots use the Supabase project in `account-config.js`. Its publishable key is intentionally public and is not an administrator credential. Never add a database password, personal access token, secret API key or `service_role` key to the site.

## Activate the project

The public key alone cannot install database tables or configure authentication. A project owner must complete these dashboard steps:

1. For a fresh project, open the Break Room project in Supabase. Open **SQL Editor → New query**, paste the entire [`supabase/setup.sql`](supabase/setup.sql) and choose **Run**. The script creates the table, row-level security and revision-checked save function inside one transaction. For an existing setup/Friends installation, apply the complete [`supabase/inner-clock.sql`](supabase/inner-clock.sql) update last. Do not reapply older narrower per-game migrations.
2. In **Authentication → URL Configuration**, set **Site URL** to `https://phoenix6716.github.io/Break-Room/`. Add these exact **Redirect URLs**:
   - `https://phoenix6716.github.io/Break-Room/account.html`
   - `https://phoenix6716.github.io/Break-Room/reset-password.html`
   After the repository rename, verify these new callback URLs in the live dashboard. Keep any old callbacks needed by existing confirmation/recovery links until those links expire; changing this document does not configure Supabase.
3. In **Authentication → Sign In / Providers → Email**, enable email/password and keep email confirmation enabled. Set the minimum password length to at least 8 characters (the client requires 8). Labels may vary with Supabase dashboard updates.
4. Configure **custom SMTP** under Authentication email settings before opening registration to the public. Supabase's built-in test sender restricts recipients and rate limits; it is not a production email service for arbitrary players. Use a verified sender/domain with an email provider. Its credentials belong in Supabase, never the client or Git repository. Google login is not enabled by this integration.
5. After the GitHub Actions deployment succeeds, sign up with an allowed test address, follow its confirmation link in the same browser, log in and choose **Use cloud saves** on `account.html`. If the table is missing the site shows a setup error, not a success message.
6. Complete a Daily or part of one, open Account and **Sync & load latest saves** before switching devices. Log into a second browser and activate/load cloud saves; check the same questions, bets, scores and absolute timer deadline. Check logout restores the second browser's original guest saves. Test real confirmation/recovery emails after SMTP configuration too.

The callback uses Supabase's PKCE flow. Confirmation/recovery links should be opened in the browser that requested them; request a new link there if the verifier is missing or a link expires. The official client handles authorization-code exchange, session persistence, token refresh and callback URL cleanup. Passwords are submitted to Supabase over HTTPS, never sent in URL queries. All form fields stay disabled until JavaScript registers submission handling and the auth client is ready. Without storage or the SDK, guest games remain available and account errors are visible.

## Guest versus account saves

- Guest play needs no account. Sign-in alone does not claim or upload existing saves. The Account page explicitly activates cloud saves, with **Bring this browser's guest results…** unchecked by default. Use it only for your own progress.
- Before activation, an exact guest snapshot is backed up locally at `br:cloud:guest`; per-user snapshots use `br:cloud:cache:USER_ID`. `br:cloud:owner` identifies whose native engine saves are currently installed. These are origin-local recovery data, not cloud credentials.
- Logout backs up the account's current native data and restores the guest snapshot. Local unsynced account data remains available on the next activation if the network was down. Signing out on this browser does not sign out other devices.
- Changing accounts, logging out or loading cloud data in another tab moves running game pages to Account, preventing a stale engine from continuing to write into another account's save area. Do not delete account metadata separately from native saves during development.
- **Download save backup** exports only the allowlisted native saves, with no passwords, auth sessions, payment flags or analytics/consent preferences. Keep downloaded backups private. This release does not offer a file-upload/import tool.
- Original `file://` or old-domain saves do not automatically transfer into the hosted origin. Export/manual migration is separate from cloud activation; never promise access to another origin's local storage.

## Sync and conflict policy

`cloud-saves.js` maps the native storage keys for all nine playable games; it never initializes an engine or changes scoring. The official SDK is pinned, bundled with esbuild and served locally from `assets/vendor/supabase.js`; no runtime CDN dependency is required. Build tools are locked in `package-lock.json`.

Only Daily progress and results are portable. Sound, consent, local help flags, payment/unlimited flags, auth state and Lowball's old percentile responses are excluded. Unlimited practice does not produce cloud Daily results. Lowball's region accompanies its progress so currency-dependent guesses can resume consistently. One-time October 2026 replay resets were removed: first launch on a new device must not erase a restored Daily.

Activated game pages upload native writes after a short debounce, with a 15-second fallback and online retry. Offline saves stay in the engines/local backup; network errors never erase them. Open Account to load remote progress before continuing on another device. Downloads are explicit on Account so an asynchronous response cannot swap out storage while a game is running. Close the previous device's game when switching. A browser closed before its upload finishes will sync when reopened and active; background upload is not guaranteed.

Each game has one private snapshot row per user. The server `save_game` function serializes updates and compares the expected revision, including first inserts. Conflicts retry a fresh read/merge (up to four times). The client uses a browser lock where supported. Daily progress merges by advancement, not score: additional answers/rounds outrank earlier stages; first cloud completion wins duplicate completions; equal-stage cloud data wins, including its original deadline. Stack Up's increasing mistakes break ties for in-progress stacks to retain penalties. Lowball unions dated history (including older cloud-preserved results) with cloud values winning duplicate dates, retains the furthest/latest progress and uses the maximum lifetime play counter rather than summing counters across devices. Full old lifetime totals cannot be reconstructed from missing dated history. Sync never invents an Arcade score or averages chips with points.

Completed games from two simultaneous offline devices can disagree; the first completed cloud record is retained. A current game page can still show its local result until Account reloads cloud data. Account sync reports this general policy; this is private save backup, not a tamper-proof competitive leaderboard. Browser-submitted scores require server-side validation before any future public rankings.

## Database security and tests

`game_saves` is keyed by authenticated user and game, has RLS enabled and gives authenticated clients read-only table access under `auth.uid() = user_id`. Anonymous users cannot read it. Direct insert/update/delete is revoked. Only the constrained `save_game` security-definer function can write; it derives the user ID from the authenticated session (never a caller-supplied ID), pins its search path, validates game/key/value shape/size and checks revision. Authentication-account deletion cascades owned saves. Friends cannot access this table directly. The separate social migration in `FRIENDS.md` exposes only derived completed scores for accepted, unblocked, explicitly sharing friends.

`npm test` includes real PostgreSQL execution via PGlite for schema/RLS/access checks, pure save merge tests, and official-client browser tests with intercepted Supabase HTTPS endpoints. Browser coverage includes two users/devices, consent, logout restore, conflict retries, offline failure, signup/login/recovery/update, no-JavaScript form safety and responsive widths. These do not create live users or send real emails. They do not prove the dashboard SQL, redirect allowlist or SMTP was applied; complete the live checks above before claiming production accounts/cloud sync are active.

## Adding Pack to an existing project

For the current site, run `supabase/inner-clock.sql` last after setup/friends; it includes Pack. The historical `supabase/pack.sql` was the earlier Pack-only installer and must not be reapplied after newer migrations. It is repeatable and preserves existing records/RLS. Pack uses `break-room:pack:daily:YYYY-MM-DD` with versioned snapshots, current selection and three submitted masks. Next-round play outranks the previous review; equal-stage cloud data wins, and the first cloud completion is retained regardless of its score. Old three-game guest/account backups remain valid; a missing Pack section means no Pack saves. Until SQL is updated, Pack writes report the required update and retain local progress. Other game saves continue to upload before that Pack error; no failed exchange installs partial remote data. New projects can use updated setup then friends directly.

## Adding Prior to an existing project

Run the whole `supabase/inner-clock.sql` **last**, after the earlier setup/social migrations. It supports all nine games, preserves data/RLS and is safe to repeat. Do not subsequently rerun older per-game migrations with narrower allowlists. Fresh projects use updated setup then friends. Prior snapshots use `break-room:prior:daily:YYYY-MM-DD`; five pairs and committed answers determine completion/scoring. Equal-stage cloud data wins, next-round play outranks the preceding review, and the first cloud completion is retained regardless of score. Older three/four-game backups with no Prior section remain valid. Until SQL is applied, a Prior upload shows the required migration and leaves native progress intact; failed exchange never installs partial remote data. Browser/account tests restore a real review across devices and exercise failure, import and logout separation.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/inner-clock.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi evidence files — current contract (v3)

New games use **128 evidence-led files**, 32 per tier, across stamp matches, paired badge permissions, inventory differences and seal custody. All observations are verified; players match the physical evidence to a catalogue entry and deduce its owner. Each fresh Daily uses all four methods, with a 32-day rotation. Assignment notes are ungraded, and reveals explain the evidence match and deductions. Four untimed cases, first-confirmation finality and correct × 25 Arcade scoring remain.

The 155 v2 visit scenarios and original v1 snapshots retain their original rules, notes, choices and scores. The existing eight-person portrait atlas is unchanged. See [the current Alibi contract](games/alibi/README.md) and [the player-feedback release](PLAYTEST-FEEDBACK.md) for sources, validation and limits.

Before deploying this release to an existing project, apply **`supabase/playtest-feedback.sql` after the previous Inner Clock migration**, or use the updated complete `supabase/inner-clock.sql`. Fresh projects use current setup then Friends. These repeatable migrations support all three Alibi formats and versioned Stack Up scores without rewriting saves, RLS, relationships or sharing settings. Live SQL and deployment are separate from passing repository tests.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/inner-clock.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, all three Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile, menus, accounts and Friends support nine playable games. The homepage shows only those nine games; the six cancelled placeholder cards remain removed. Public billing and prelaunch human/content/device reviews remain deferred.
