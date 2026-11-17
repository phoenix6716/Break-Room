# Hosting and deployment

Updated 17 November 2026. Current status: [CURRENT-STATUS.md](CURRENT-STATUS.md). Previous setup proposals and dated release notes are retained in [HOSTING-HISTORY.md](HOSTING-HISTORY.md).

## Production

- Primary site: https://breakroomdaily.com/ .
- Host: Cloudflare Workers Static Assets, worker `break-room`.
- Fallback: https://break-room.phillipsphoenix09.workers.dev/ .
- Source: `phoenix6716/Break-Room`, branch `main`; automatic Cloudflare builds are connected.
- `wrangler.json` serves `./dist`, uses `404-page` for missing assets and `auto-trailing-slash` clean URLs. Account/recovery routes work with clean and retained legacy links.
- Production canonical/share metadata defaults to the verified domain. Preserve queries and paths in server-side www redirects.

GitHub Pages at https://phoenix6716.github.io/Break-Room/ remains the checked preview/legacy origin. `.github/workflows/site.yml` runs selected checks and publishes that preview after success. A Cloudflare deployment and a GitHub Pages workflow are separate results; report their actual state accurately.

The original domain and www setup were completed in the owner’s launch work. Historical statements that the domain is unbought, Cloudflare merely proposed or www certainly absent are not current findings.

## Commands

Use Node 24. Install the lockfile, build and validate:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm run check
npm test
```

Cloudflare build: `npm run build`. Deploy: `npx wrangler deploy`. Local site preview: `npx wrangler dev`. Dashboard-configured builds already publish production; do not create a duplicate service when reconnecting a coding account.

The test runner uses `/usr/bin/chromium` when available, or `ARCADE_CHROMIUM`, otherwise Playwright’s installed browser. In a new environment install the browser if needed with `npx playwright install chromium`; system dependencies depend on that environment. Python 3.12+ is needed for Python checks. Source builds use the bundled official Auth SDK.

`npm test` selects checks for changed paths. To compare a known base use `npm test -- --base <commit>`. `npm run test:all` is for an explicitly needed full audit, not every small edit. Documentation-only work does not require game/browser regression suites; public HTML/copy edits still need appropriate build/reference and page checks.

## Release and recovery

Automatic deployment after focused checks is authorized. Check the Cloudflare build result, verify the relevant production routes/assets and use appropriate browser checks before claiming a release is live. Check GitHub preview publication separately when relevant.

Keep the existing domain, Supabase project, Stripe account, secrets and origin-specific guest saves. Changing ChatGPT accounts does not require changing hosting or moving a database. A fresh coding environment may need a new clone and new app authorizations, not a second website.

Do not erase `localStorage`, IndexedDB, cloud rows or captured rounds during a migration/rollback. Older saves are intentionally versioned. Roll back code with attention to database compatibility; never blindly run historical setup installers against production. Retained legacy URLs are for compatibility, not a reason to restore client-only HTML redirects for production www handling.
