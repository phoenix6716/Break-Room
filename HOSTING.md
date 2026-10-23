# Hosting Break Room

## Current release: Seating Chart

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

## Prior shelved; preserve its content — owner decision, 23 October 2026

Prior joins Alibi and Bouncer outside the active lineup. The six current games are Laser, Stack Up, Stake, Pack, Lowball and Inner Clock. Remove Prior from the shelf, drawers and current Friends comparisons; keep archived profile history, earned achievements, saves, scoring compatibility and direct routes. The current Daily checklist uses six games.

Preserve `content/prior-events.json` in full, including stable event IDs, dates, explanations and source links, plus `scripts/build-prior-events.cjs` and existing generated content. The owner wants a similar event-based replacement that can reuse this material. Its design is not decided; do not invent rules, alter the bank or add a replacement card yet. This supersedes the earlier seven-game roster below.

## GitHub Pages and automatic checks

The static site can publish from this repository using **Check and publish Break Room** in [GitHub Actions](https://github.com/phoenix6716/Break-Room/actions/workflows/site.yml).

One repository setting is required before the first deployment:

1. Open [Settings → Pages](https://github.com/phoenix6716/Break-Room/settings/pages).
2. Under **Build and deployment**, select **GitHub Actions** as the source. This requires repository administration access; the workflow's limited token cannot enable Pages itself.
3. Push to `main`, or open the workflow above and choose **Run workflow** on `main`. If its first run was waiting for Pages, re-run it after enabling the setting.
4. Wait for **Test the production site** and **Publish GitHub Pages** to succeed. The deployment job reports the actual site URL in the `github-pages` environment. The expected default address is `https://phoenix6716.github.io/Break-Room/`; this is not proof that a deployment has succeeded.

The repository must be eligible for GitHub Pages under its visibility/account plan, and GitHub Actions must be enabled. A custom domain is optional and not configured by this change. Do not change repository visibility to enable hosting without the owner's instruction.

Pull requests run the checks but do **not** deploy. A newer PR commit cancels obsolete checks on that PR; main publication jobs remain sequential. Pushes to `main` and manual runs on `main` publish only after the checks pass. Failed checks stop publication. Checks have read-only repository access; only the deployment job gets Pages/OIDC permissions. No hosting API key, personal token or npm publishing secret needs to be added to Actions.

This gates publication, not merges. For merge protection, a repository administrator can additionally require **Test the production site** in the branch rules for `main`.

## Automatic releases — owner decision, 23 October 2026

Completed requested changes are authorised for automatic deployment after focused checks. The agent handles commits, any PR merge, and verification of the main Pages deployment without requiring the owner to manage PRs or repeat release approval. This supersedes previous PR-only holds. PRs are optional; direct main commits may use the existing CI publication gate. Failed checks still block publication. Report whether changes are committed, deployed, and independently verified; disclose unavailable live browser access.

## Reproduce the checks

The application remains static. The pinned Supabase client is bundled locally during the build; other npm dependencies are build/test tools. Use Node 24 (`.node-version`), Python 3.12+ and the pinned Playwright in `package-lock.json`:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
npm test
```

In the managed cloud environment, `/usr/bin/chromium` is already available; the runner uses it unless `ARCADE_CHROMIUM` points to another executable. GitHub Actions downloads Chromium matching the locked Playwright version. Its Ubuntu runner already includes Chrome’s system libraries, so CI skips the redundant system-package installation; fresh local machines can use the `--with-deps` command above. In restricted workspaces use a writable npm cache, for example `npm_config_cache=/tmp/break-room-npm-cache npm ci --ignore-scripts --no-audit --no-fund`.

`npm test` uses focused checks by default, as requested by the owner on 23 October 2026. `scripts/affected-checks.cjs` reads changed paths and `scripts/test-scope.cjs` maps them to affected tests. CI compares the PR base or previous main commit with the current commit, including both sides of renames/deletions. It saves the exact plan to `.artifacts/check-plan.json` and installs Chromium/Python only when selected checks need them.

Examples:

```sh
npm test -- --files games/alibi/index.html
npm test -- --base origin/main
node scripts/affected-checks.cjs --plan --files profile.js
npm run test:all  # Only when a full audit is explicitly wanted.
```

Without an explicit base, local checks cover staged/unstaged and untracked changes against `HEAD`. Documentation-only changes run the quick artifact build/reference check with no game sessions. A game page/style edit selects that game’s existing UI checks; engine/model/data edits also select relevant rules/save checks. Shared navigation, layout, clocks, account and scoring changes select their dependent component tests. Newly added runtime paths must have a scope mapping; an unknown path fails with an explanation rather than starting an unrequested full sweep. Changes to an individual test run that test.

The workflow’s manual **full_suite** input and `npm run test:all` retain the complete audit. Automatic main deployments also use focused selection rather than rerunning every game after each merge.

The explicitly requested full suite runs these in order:

1. Shared static-footer consistency and a content inventory/review report, followed by content-tool, calendar/DST, Arcade scoring, account/cloud/friend database security, real local profile, question-bank and independent-maths checks.
2. `npm run build`: a clean plain-file artifact in `dist/`.
3. `npm run check`: all shipped local HTML/CSS references, JSON and JavaScript syntax (including inline engines), and exclusions for development-only content.
4. The full browser selection (or explicit `npm run test:browser`): every non-unit browser test in `tests/`, including actual complete game flows, profile/scoring, artwork, timers, sharing, saved-state migrations, reset boundaries, keyboard/touch controls and responsive layouts. A temporary server mounts the production artifact under the legacy test prefix `/Midnight-Arcade/`, not the origin root. The template and template-parity tests use a separate source mount because the development starter is intentionally not published.

Child failures retain a nonzero exit code and stop the workflow. Per-check logs are saved to `.artifacts/` and uploaded by Actions for seven days, including on failure. The runner closes its own temporary servers. Existing visual tests also regenerate their documented screenshots in `design/previews/`; review or restore only those generated changes before committing unrelated work.

To inspect a build locally, serve `dist/` with a static server. To develop templates, serve the repository root as documented in the main README. Neither local server is a public deployment.

## What is published

The builder copies root HTML/CSS/JavaScript plus web assets in `assets/` and `games/`, preserving route names and file bytes. It excludes the development starter, local Content Studio (`tools/`), `game-drafts/`, content proposals, tests/scripts, dependency folders, documentation, design previews and generated-image source atlases. `.nojekyll` keeps Pages from rewriting this plain-file site.

Coming-soon routes remain available; Friends now requires the additional `supabase/friends.sql` migration documented in `FRIENDS.md`. Accounts now use Supabase; see `ACCOUNTS.md` for the required owner-applied SQL, exact redirect URLs and email delivery setup. Account forms stay disabled until their JavaScript handlers are ready, and never submit credentials in query strings. Guest play and the existing local profile remain available; cloud-save activation and importing guest progress are explicit. Friend requests and private score comparisons use the same Supabase project after that separate social migration is applied.

The build fills Lowball’s social URL/image placeholders using the Pages URL; set the non-secret `SITE_URL` repository variable if a custom domain is configured later. Lowball’s copied result URL also retains the game’s project path. Keep local navigation and assets relative, with explicit `index.html` game links. Add new asset extensions to the builder only when needed, and verify their references and actual loading. Do not add secrets to client-side JavaScript or the web artifact.

## Saved progress and rollback

Browser-local saves belong to their site origin. The repository-path rename from `/Midnight-Arcade/` to `/Break-Room/` keeps the same HTTPS origin; it does not by itself move or erase localStorage saves. A downloaded `file://` copy and the hosted HTTPS address do not automatically share records. Moving to another domain also creates a separate browser-storage origin; records at the old address are not deleted. Supabase cloud saves now support explicit account activation across devices; see `ACCOUNTS.md`. Accessing saves at a different existing origin still needs a separate migration step.

To undo a bad published change, revert its source commit on `main` and let the same checks/deployment run. A failed check/deployment does not intentionally erase the previous hosted site. Don't manually edit the uploaded artifact separately from its source.

## Cloud access versus public hosting

Codex's development environment and GitHub Pages are separate. Network access to `api.github.com` lets the agent inspect Pages settings and Actions runs; `phoenix6716.github.io` lets it verify the deployed site. Saving those environment domain requirements does not apply them or publish the website. If access is blocked, the repository administrator can still perform the Pages setting above directly in GitHub and inspect Actions there. Claim the site is live only after a successful deployment and HTTP/browser verification.

## Current lineup — owner decision, 23 October 2026

Alibi and Bouncer are shelved and removed from the active homepage, navigation drawers and current Friends comparisons. The seven current games, in shelf order, are Laser, Stack Up, Stake, Pack, Prior, Lowball and Inner Clock. Preserve the shelved engines, direct routes, artwork, local/cloud saves, historical native/Arcade scores and earned achievements. Profile keeps archived results for players who already have them, without play prompts, and its current Daily checklist uses seven games. Historical profile averages still include saved archived results; Friends compares the current lineup. Do not remove cloud/schema compatibility or erase records as part of shelving.

The owner wants three better replacement games, with one prototype already lined up. Review that supplied game before integration; the other two concepts are not selected. Do not invent or advertise replacement games or restore cancelled placeholders. After three replacements the intended roster would be ten games. This decision supersedes older nine-game and Alibi/Bouncer launch-roster guidance below; those game contracts remain compatibility documentation.

## Current game migration

Six games are in the active lineup; the nine-game storage/schema support, including archived Alibi and Bouncer, remains for compatibility. Existing Supabase projects run `supabase/inner-clock.sql` last after setup/social activation; it includes current Pack support. Fresh projects use updated setup then friends. Do not reapply a historical narrower per-game allowlist afterwards. Browser play does not require SQL, but live Prior cloud/Friends support does.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/inner-clock.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi and Stack Up player-feedback update — 23 October 2026

Alibi uses **128 v3 evidence-led files**, 32 per tier, across stamp matches, paired badge permissions, inventory differences and seal custody. New Dailies rotate all four methods and avoid repeated files for 32 days. All observations are verified; players match the physical evidence to an entry and deduce its owner. Reveals explain the evidence match and the deductions. Personal assignment notes remain ungraded. Four untimed cases, first-confirmation finality and correct × 25 Arcade scoring remain.

Existing v1/v2 snapshots retain their rules, notes and scores. The 155-case v2 visit bank remains frozen; the older false-count fixture remains outside production. The existing eight-person portrait atlas is unchanged. See [Alibi’s contract](games/alibi/README.md) and [the feedback record](PLAYTEST-FEEDBACK.md).

Stack Up opens directly into Daily play. Its 160 familiar default stacks provide 32 Daily sets; the original 208 harder sets remain in optional Challenge/topic practice. New runs carry `scoreVersion:2`, use base points in both modes and normalize against 3,100. Original saved runs retain their 31,000-point scale, including unfinished Dailies. Native stored scores are not rewritten.

**Before deploying this update to an existing live project, apply `supabase/playtest-feedback.sql` after the previous Inner Clock migration.** The updated complete `supabase/inner-clock.sql` is an alternative. Fresh projects use current setup then Friends. These repeatable migrations add private v3 reconstruction and versioned Stack Up score normalization without rewriting saves or sharing settings. Tests and Git pushes do not apply live SQL.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/inner-clock.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, all three Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile, menus, accounts and Friends support nine playable games. The homepage shows only those nine games; the six cancelled placeholder cards remain removed. Public billing and prelaunch human/content/device reviews remain deferred.
