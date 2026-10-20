# Supabase accounts and cloud saves

Break Room stays on GitHub Pages. Authentication and private native-game snapshots use the Supabase project in `account-config.js`. Its publishable key is intentionally public and is not an administrator credential. Never add a database password, personal access token, secret API key or `service_role` key to the site.

## Activate the project

The public key alone cannot install database tables or configure authentication. A project owner must complete these dashboard steps:

1. Open the Break Room project in Supabase. Open **SQL Editor → New query**, paste the entire [`supabase/setup.sql`](supabase/setup.sql) and choose **Run**. The script creates the table, row-level security and revision-checked save function inside one transaction. It is safe to re-run this version.
2. In **Authentication → URL Configuration**, set **Site URL** to `https://phoenix6716.github.io/Midnight-Arcade/`. Add these exact **Redirect URLs**:
   - `https://phoenix6716.github.io/Midnight-Arcade/account.html`
   - `https://phoenix6716.github.io/Midnight-Arcade/reset-password.html`
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

`cloud-saves.js` maps the native Stake, Stack Up, Lowball, Pack and Prior storage keys; it never initializes an engine or changes scoring. The official SDK is pinned, bundled with esbuild and served locally from `assets/vendor/supabase.js`; no runtime CDN dependency is required. Build tools are locked in `package-lock.json`.

Only Daily progress and results are portable. Sound, consent, local help flags, payment/unlimited flags, auth state and Lowball's old percentile responses are excluded. Unlimited practice does not produce cloud Daily results. Lowball's region accompanies its progress so currency-dependent guesses can resume consistently. One-time October 2026 replay resets were removed: first launch on a new device must not erase a restored Daily.

Activated game pages upload native writes after a short debounce, with a 15-second fallback and online retry. Offline saves stay in the engines/local backup; network errors never erase them. Open Account to load remote progress before continuing on another device. Downloads are explicit on Account so an asynchronous response cannot swap out storage while a game is running. Close the previous device's game when switching. A browser closed before its upload finishes will sync when reopened and active; background upload is not guaranteed.

Each game has one private snapshot row per user. The server `save_game` function serializes updates and compares the expected revision, including first inserts. Conflicts retry a fresh read/merge (up to four times). The client uses a browser lock where supported. Daily progress merges by advancement, not score: additional answers/rounds outrank earlier stages; first cloud completion wins duplicate completions; equal-stage cloud data wins, including its original deadline. Stack Up's increasing mistakes break ties for in-progress stacks to retain penalties. Lowball unions dated history (including older cloud-preserved results) with cloud values winning duplicate dates, retains the furthest/latest progress and uses the maximum lifetime play counter rather than summing counters across devices. Full old lifetime totals cannot be reconstructed from missing dated history. Sync never invents an Arcade score or averages chips with points.

Completed games from two simultaneous offline devices can disagree; the first completed cloud record is retained. A current game page can still show its local result until Account reloads cloud data. Account sync reports this general policy; this is private save backup, not a tamper-proof competitive leaderboard. Browser-submitted scores require server-side validation before any future public rankings.

## Database security and tests

`game_saves` is keyed by authenticated user and game, has RLS enabled and gives authenticated clients read-only table access under `auth.uid() = user_id`. Anonymous users cannot read it. Direct insert/update/delete is revoked. Only the constrained `save_game` security-definer function can write; it derives the user ID from the authenticated session (never a caller-supplied ID), pins its search path, validates game/key/value shape/size and checks revision. Authentication-account deletion cascades owned saves. Friends cannot access this table directly. The separate social migration in `FRIENDS.md` exposes only derived completed scores for accepted, unblocked, explicitly sharing friends.

`npm test` includes real PostgreSQL execution via PGlite for schema/RLS/access checks, pure save merge tests, and official-client browser tests with intercepted Supabase HTTPS endpoints. Browser coverage includes two users/devices, consent, logout restore, conflict retries, offline failure, signup/login/recovery/update, no-JavaScript form safety and responsive widths. These do not create live users or send real emails. They do not prove the dashboard SQL, redirect allowlist or SMTP was applied; complete the live checks above before claiming production accounts/cloud sync are active.

## Adding Pack to an existing project

For the current site, run `supabase/prior.sql` last after setup/friends; it includes Pack. The historical `supabase/pack.sql` was the earlier Pack-only installer and must not be reapplied after newer migrations. It is repeatable and preserves existing records/RLS. Pack uses `break-room:pack:daily:YYYY-MM-DD` with versioned snapshots, current selection and three submitted masks. Next-round play outranks the previous review; equal-stage cloud data wins, and the first cloud completion is retained regardless of its score. Old three-game guest/account backups remain valid; a missing Pack section means no Pack saves. Until SQL is updated, Pack writes report the required update and retain local progress. Other game saves continue to upload before that Pack error; no failed exchange installs partial remote data. New projects can use updated setup then friends directly.

## Adding Prior to an existing project

Run the whole `supabase/prior.sql` **last**, after the earlier setup/social migrations. It adds the fifth game and current Pack support, preserves data/RLS and is safe to repeat. Do not subsequently rerun older per-game migrations with narrower allowlists. Fresh projects use updated setup then friends. Prior snapshots use `break-room:prior:daily:YYYY-MM-DD`; five pairs and committed answers determine completion/scoring. Equal-stage cloud data wins, next-round play outranks the preceding review, and the first cloud completion is retained regardless of score. Older three/four-game backups with no Prior section remain valid. Until SQL is applied, a Prior upload shows the required migration and leaves native progress intact; failed exchange never installs partial remote data. Browser/account tests restore a real review across devices and exercise failure, import and logout separation.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/laser.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.
