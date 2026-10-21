# Hosting Break Room

## GitHub Pages and automatic checks

The static site can publish from this repository using **Check and publish Break Room** in [GitHub Actions](https://github.com/phoenix6716/Midnight-Arcade/actions/workflows/site.yml).

One repository setting is required before the first deployment:

1. Open [Settings → Pages](https://github.com/phoenix6716/Midnight-Arcade/settings/pages).
2. Under **Build and deployment**, select **GitHub Actions** as the source. This requires repository administration access; the workflow's limited token cannot enable Pages itself.
3. Push to `main`, or open the workflow above and choose **Run workflow** on `main`. If its first run was waiting for Pages, re-run it after enabling the setting.
4. Wait for **Test the production site** and **Publish GitHub Pages** to succeed. The deployment job reports the actual site URL in the `github-pages` environment. The expected default address is `https://phoenix6716.github.io/Midnight-Arcade/`; this is not proof that a deployment has succeeded.

The repository must be eligible for GitHub Pages under its visibility/account plan, and GitHub Actions must be enabled. A custom domain is optional and not configured by this change. Do not change repository visibility to enable hosting without the owner's instruction.

Pull requests run the checks but do **not** deploy. Pushes to `main` and manual runs on `main` publish only after the checks pass. Failed checks stop publication. Checks have read-only repository access; only the deployment job gets Pages/OIDC permissions. No hosting API key, personal token or npm publishing secret needs to be added to Actions.

This gates publication, not merges. For merge protection, a repository administrator can additionally require **Test the production site** in the branch rules for `main`.

## Reproduce the checks

The application remains static. The pinned Supabase client is bundled locally during the build; other npm dependencies are build/test tools. Use Node 24 (`.node-version`), Python 3.12+ and the pinned Playwright in `package-lock.json`:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
npm test
```

In the managed cloud environment, `/usr/bin/chromium` is already available; the runner uses it unless `ARCADE_CHROMIUM` points to another executable. GitHub Actions explicitly uses Chromium matching the locked Playwright version. In restricted workspaces use a writable npm cache, for example `npm_config_cache=/tmp/break-room-npm-cache npm ci --ignore-scripts --no-audit --no-fund`.

`npm test` runs these in order:

1. Shared static-footer consistency and a content inventory/review report, followed by content-tool, calendar/DST, Arcade scoring, account/cloud/friend database security, real local profile, question-bank and independent-maths checks.
2. `npm run build`: a clean plain-file artifact in `dist/`.
3. `npm run check`: all shipped local HTML/CSS references, JSON and JavaScript syntax (including inline engines), and exclusions for development-only content.
4. `npm run test:browser`: every non-unit browser test in `tests/`, including actual complete game flows, profile/scoring, artwork, timers, sharing, saved-state migrations, reset boundaries, keyboard/touch controls and responsive layouts. A temporary server mounts the production artifact under `/Midnight-Arcade/`, not the origin root. The template and template-parity tests use a separate source mount because the development starter is intentionally not published.

Child failures retain a nonzero exit code and stop the workflow. Per-check logs are saved to `.artifacts/` and uploaded by Actions for seven days, including on failure. The runner closes its own temporary servers. Existing visual tests also regenerate their documented screenshots in `design/previews/`; review or restore only those generated changes before committing unrelated work.

To inspect a build locally, serve `dist/` with a static server. To develop templates, serve the repository root as documented in the main README. Neither local server is a public deployment.

## What is published

The builder copies root HTML/CSS/JavaScript plus web assets in `assets/` and `games/`, preserving route names and file bytes. It excludes the development starter, local Content Studio (`tools/`), `game-drafts/`, content proposals, tests/scripts, dependency folders, documentation, design previews and generated-image source atlases. `.nojekyll` keeps Pages from rewriting this plain-file site.

Coming-soon routes remain available; Friends now requires the additional `supabase/friends.sql` migration documented in `FRIENDS.md`. Accounts now use Supabase; see `ACCOUNTS.md` for the required owner-applied SQL, exact redirect URLs and email delivery setup. Account forms stay disabled until their JavaScript handlers are ready, and never submit credentials in query strings. Guest play and the existing local profile remain available; cloud-save activation and importing guest progress are explicit. Friend requests and private score comparisons use the same Supabase project after that separate social migration is applied.

The build fills Lowball’s social URL/image placeholders using the Pages URL; set the non-secret `SITE_URL` repository variable if a custom domain is configured later. Lowball’s copied result URL also retains the game’s project path. Keep local navigation and assets relative, with explicit `index.html` game links. Add new asset extensions to the builder only when needed, and verify their references and actual loading. Do not add secrets to client-side JavaScript or the web artifact.

## Saved progress and rollback

Browser-local saves belong to their site origin. A downloaded `file://` copy and the hosted HTTPS address do not automatically share records. Moving to another domain also creates a separate browser-storage origin; records at the old address are not deleted. Supabase cloud saves now support explicit account activation across devices; see `ACCOUNTS.md`. Accessing saves at a different existing origin still needs a separate migration step.

To undo a bad published change, revert its source commit on `main` and let the same checks/deployment run. A failed check/deployment does not intentionally erase the previous hosted site. Don't manually edit the uploaded artifact separately from its source.

## Cloud access versus public hosting

Codex's development environment and GitHub Pages are separate. Network access to `api.github.com` lets the agent inspect Pages settings and Actions runs; `phoenix6716.github.io` lets it verify the deployed site. Saving those environment domain requirements does not apply them or publish the website. If access is blocked, the repository administrator can still perform the Pages setting above directly in GitHub and inspect Actions there. Claim the site is live only after a successful deployment and HTTP/browser verification.

## Current game migration

The site now includes Lowball, Stake, Stack Up, Pack and Prior. Existing Supabase projects run `supabase/alibi-scenarios.sql` last after setup/social activation; it includes current Pack support. Fresh projects use updated setup then friends. Do not reapply a historical narrower per-game allowlist afterwards. Browser play does not require SQL, but live Prior cloud/Friends support does.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/bouncer.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi scenarios — current contract (v2)

The owner approved real scenarios grounded in incidents, timelines and evidence, plus generated men’s/women’s portraits. Alibi now selects **96 new evidence-dependent visit-reconstruction cases**, 24 per tier. Only the culprit’s account is false; everyone else’s account and the verified records are accurate. The incident window determines the relevant visit. Both records and accounts are necessary, and each case has one complete reconstruction. This supersedes the original abstract false-count rules for **new** cases. Personal notes remain ungraded; four untimed Dailies, first-confirmation finality and correct × 25 Arcade scoring are unchanged.

Eight illustrated portraits were generated as an image atlas and encoded as an optimized WebP; CSS selects a cell. New snapshots store stable, distinct random portrait assignments, unrelated to guilt. Existing original-format drafts/notes/completions/history keep their original rules and scores; new scenarios are available in Unlimited immediately and the next fresh Daily. The frozen 144-case original bank and tests remain outside production. Read `games/alibi/README.md` for exact source, schema, behavior and compatibility.

**Current complete upgrade: run `supabase/bouncer.sql` LAST.** It includes Alibi scenarios and three-mirror Laser Expert, so earlier per-game updates need not be reapplied. It includes all earlier games and both Alibi parsers. Fresh projects use current setup then Friends; do not reapply old narrower migrations. Personal raw snapshots/notes remain private; Friends expose only completed normalized records through existing sharing controls. Human playtesting and the separately agreed prelaunch audit remain necessary. No billing or other game was enabled.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/bouncer.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.
