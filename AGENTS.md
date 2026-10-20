# Break Room project memory

The repository is named Midnight-Arcade, but the current website brand is **Break Room**.

## Check installed skills before each task

The user requests that, before starting any task, inspect the currently installed skills and assess whether any can help complete it. Read and apply relevant skill instructions; do not invoke unrelated skills merely because they are installed. Discover the current catalog rather than assuming the installed set is unchanged. Tell the user when first applying a skill in the conversation.

## Canonical layout for future games

The user explicitly selected the current, centred **Stake layout** as the starting point for future added games. This file is durable repository guidance: read it again when adding a game.

- Start from `games/_template/index.html` and read `games/_template/README.md` and `design/GAME-LAYOUT.md`. Use `game-shell.css` and the shared shell controls. Older `game.html`, placeholder-game pages, and `design/prototypes/` are historical references, not the current new-game standard.
- Keep the shared site header: **Menu button opening the left navigation drawer**, centred Break Room brand, account link. The user specifically wants the left menu retained.
- Centre the game on the viewport, independently of the right-hand reset rail. Keep title left, **Streak / Best / Played** centred in that header row, and **? / trophy** tools right. Do not introduce an extra stats row that pushes the game down.
- Keep plain **Daily / Unlimited** mode buttons, centred progress slot, centred playing surface, and the existing responsive geometry. Use `daily-reset.css` for the exact Stack Up reset box and `daily-clock.js` for **midnight Australia/Sydney**, including DST.
- Keep help/stats popup visuals from `game-dialog.css`, keyboard controls, focus trapping/restoration, Escape, and working navigation. A sound control is optional; if a game has actual audio, put its real toggle **bottom centre below the game**. Do not add a fake sound toggle.
- Replace title, description, help rules, engine surface, scoring, progress contents and game-specific stats. Stake's trivia, 30-second question timer, bets, circular poker chips and green felt are **Stake-specific**, not requirements for new games. No fake scores, playable demos or stored Daily completions in an unimplemented template.
- Do not add per-game standalone legal links/disclaimers. The user intends to add universal legal information later.
- Preserve existing Lowball/Stake mechanics, artwork, saved progress and the current production placeholder games unless the user requests changes. The template is a development starting point, not another homepage game.
- Validate at least 320/390/768/1100/1440px, ensure the central game does not shift to make room for the reset box, and check the left menu, popups, real game flow, Daily/Unlimited and saved state as appropriate. Use explicit `index.html` navigation targets so downloaded copies work.

User requests take priority over these defaults. For details, component IDs, responsive placement and the new-game checklist, see `design/GAME-LAYOUT.md`.

## Real local profile

`profile.html` uses `profile-records.js` (read-only save adapters), `profile.js` and `profile.css`. Preserve each game’s native score and add the common 0–100 Arcade score defined in `SCORING.md`. Count only completed Dailies, excluding Unlimited, pending runs and demo data. Opening the profile must never migrate/write game saves or invoke engine initialization/reset scripts. Lowball normally retains up to 121 days of dated scores locally plus a lifetime play counter; cloud snapshots can preserve older merged results, so best/average/activity and history streaks must be labelled accordingly; do not invent older results or achievements. Legacy Stake scoring reconstructs its frozen 164-question option permutations; protect compatibility with the real-engine comparison in `tests/profile.cjs`. Accounts/cloud sync are implemented through Supabase; read `ACCOUNTS.md`. Friends are implemented; read `FRIENDS.md` and apply `supabase/friends.sql` for live activation.

## Shared scoring standard

The user selected a shared 0–100 score **alongside** native chips/points. Use `arcade-score.js` and read `SCORING.md`: Lowball keeps its Daily average; Stake uses chips staked on correct answers / total staked; Stack Up uses clamped Daily points / 31,000. Profile Arcade averages use a common 120-day Sydney-date window, equal weight per played game, full precision until display, and explicit game/run sample counts. Real zeroes count; missing, pending and Unlimited scores do not. Never average raw chips with raw points, silently rewrite saved scores or claim this scale is a population percentile. Define and test a bounded, documented Arcade score and read-only record adapter when adding future games.

## Hosting and checks

Read `HOSTING.md` before publishing or changing CI. `npm ci` installs locked development tools; `npm test` builds/checks the production artifact and runs all regression checks beneath the real project URL prefix. Only `dist/` is published by `.github/workflows/site.yml`, after passing checks on `main`. Add new runtime asset types/routes to the build deliberately. Keep credentials out of all client files/artifacts. Authentication forms use the official Supabase client and stay disabled until handlers are ready; friend forms stay disabled until authenticated handlers are ready. Don't claim a public deployment from a Git push, workflow file or environment draft: check successful Pages deployment and the live site. Browser records are origin-specific; preserve the source saves and explain domain migration limits.

## Accounts and cloud-save ownership

Read `ACCOUNTS.md` and `supabase/setup.sql` before changing account behavior. `account-config.js` contains only public Supabase settings. Never add a secret/service-role key or SQL-admin credential to client code. Maintain RLS and revision-checked, auth-derived ownership. `cloud-saves.js` preserves native save formats/scoring. Account activation and guest import are explicit; never silently upload guest saves on login. Keep local guest/per-user backups, restore guest data on logout, and redirect stale game tabs when save ownership changes. Active game pages upload; remote saves are installed only on Account, before returning to games. Do not reintroduce old one-time Daily reset blocks; they destroy freshly restored saves on a new device. Route account redirects through the single guarded navigation helper: auth, ownership and save-generation events can arrive together and must not restart an in-flight navigation. Keep auth/callback/recovery forms, no-JavaScript safety, real PostgreSQL access tests and two-account/device browser coverage. Live account readiness requires owner-applied SQL, redirect URLs and working email delivery; mocked tests do not establish those dashboard settings.

## Friends and private comparisons

Read `FRIENDS.md` before social changes. Codes, requests/acceptance, remove/block and explicit score sharing use constrained Supabase RPCs. Keep the social tables inaccessible directly to browser roles. Do not give friends access to raw `game_saves` or email addresses. Only `friend_scores` returns bounded, completed, synced Daily Arcade records after checking accepted/unblocked/sharing relationships. SQL v1 scoring must stay in parity with `arcade-score.js`/`profile-records.js`, including legacy Stake shuffles, weighted bets/timeouts, Stack Up clamping, Lowball fallback and Sydney's common 120-day window. Use the existing account readiness/RPC bridge rather than another auth client. Clear private UI on logout, errors and identity changes; discard stale responses and preserve unsaved settings during refresh. Retain real PostgreSQL security/parity tests and two-account browser integration. No example friends, guessed scores or claims of anti-cheat ranking.
