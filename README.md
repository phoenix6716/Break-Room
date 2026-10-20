# Break Room

A static daily games website with a warm cream grid, navy outlines, pastel panels and hard pixel shadows. The GitHub repository retains its original name, Midnight-Arcade.

## Play and develop

The expected GitHub Pages address is [Break Room](https://phoenix6716.github.io/Midnight-Arcade/). Publication is gated by [Check and publish Break Room](https://github.com/phoenix6716/Midnight-Arcade/actions/workflows/site.yml); check its latest deployment when verifying a release.

For a local source preview:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/index.html`. Keep the full folder structure; links use explicit `index.html` targets for downloaded copies. A local server is recommended for account features and consistent browser storage.

| Game | Current gameplay |
| --- | --- |
| Lowball | Four Daily price guesses, AU/US/UK/CA selection, generated pixel-art items and free Unlimited practice. |
| Stake | Five Daily trivia questions, 1–3-chip bets and a 30-second timer after each bet; Unlimited practice. A timeout loses the bet. |
| Pack | Three untimed easy/medium/hard packing puzzles, a visual bag, personalized swaps and free Unlimited practice. 180 validated bags. |
| Stack Up | Five Daily ordering sets, drag/touch/keyboard controls, 90 seconds per stack and position feedback; Infinite practice. |

All Dailies reset at midnight **Australia/Sydney**, including daylight-saving changes. Other game cards remain clearly **Coming soon** and do not create fake attempts/results. Native scores remain alongside the shared 0–100 Arcade score. See [SCORING.md](SCORING.md) for the exact formulas and equal-game average over the common 120-day window.

## Content tools

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run content:studio
```

Open `http://127.0.0.1:9030` on the machine running the command. Search all **264 Stake questions, 112 Stack Up sets and 100 Lowball items**, write drafts, attach factual sources, preview player/answer views and save/download JSON proposals. This is a local development tool; it does not change live banks or publish content. Remote cloud loopback addresses require an attached browser/approved forwarding, or run the checkout on your own computer.

```sh
npm run content:report
npm run content:check -- content/drafts/FILE.json --reviewed
npm run content:export -- content/drafts/FILE.json
npm run game:new -- word-ladder "Word Ladder"
```

Read [CONTENT.md](CONTENT.md) for the review/integration workflow, current source and price-evidence gaps, and Lowball compatibility risks. New game scaffolds stay in `game-drafts/` until implemented and deliberately registered. They use the canonical [Stake-based starter](games/_template/README.md) and [layout map](design/GAME-LAYOUT.md). Development tools and drafts are excluded from the published site.

## Accounts, profiles and friends

Guest progress stays local. Supabase email accounts support explicit cloud activation, optional guest import, account-isolated native saves and cross-device restore from the Account page. [ACCOUNTS.md](ACCOUNTS.md) explains database migrations, authentication redirects, email delivery and conflict/ownership rules. Only public client configuration belongs in `account-config.js`.

The profile reads real completed Daily records without starting engines or rewriting saves. Missing, pending and Unlimited results are excluded; real zeroes count. Lowball's lifetime play count and retained history have different coverage, which the profile labels.

Friends use private codes, accepted requests, remove/block controls and opt-in Today/120-day score comparisons. Apply the additional database migration as documented in [FRIENDS.md](FRIENDS.md). Friends receive server-derived scores, not raw guesses, answers or email addresses. Existing browser records are origin-specific; changing domains does not automatically migrate guest saves.

## Checks and deployment

Use Node 24, Python 3.12+ and the locked dependencies:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
npm test
```

The suite creates a content review report, runs unit/database checks, builds `dist/`, validates shipped references/scripts and tests actual game/account/friend flows below `/Midnight-Arcade/`. Tests use isolated browser records and a local PostgreSQL implementation; mocked authentication transport does not establish live Supabase configuration or email delivery. `ARCADE_CHROMIUM` selects a browser executable; the managed environment can use `/usr/bin/chromium`.

Only the checked `dist/` artifact is published by GitHub Actions after success on `main`. See [HOSTING.md](HOSTING.md) for activation, rollout, rollback and browser-storage limits. Reports/logs are retained in `.artifacts/`; screenshot tests may regenerate tracked files under `design/previews/`. [VALIDATION.md](VALIDATION.md) records verification scope and historical changes.

## Shared structure and preservation

- `game-shell.css`, `game-dialog.css`, `daily-reset.css` and `daily-clock.js`: canonical centred shell, shared dialogs and Sydney reset rail.
- `navigation.js`: Menu button and left drawer, keyboard/focus management and dismissal.
- `game-config.js`: game metadata and explicit routes; live games own their engines.
- `arcade-score.js`, `profile-records.js`: shared scoring and read-only native record adapters.
- `accounts.js`, `cloud-saves.js`, `friends.js`, `supabase/`: account ownership, sync and private social comparisons.
- `games/lowball/engine/icons/generated/` and `item-art.js`: generated PNG artwork with explicit mappings. No code-drawn substitutes or unrelated fallback images.

Keep the left Menu drawer, centred brand/game, header stats and tools, right reset rail, and optional working sound toggle below the game. Preserve real saves, scoring, generated artwork, circular Stake chips and game-specific mechanics. Use the universal Privacy, Terms and Contact/data-help pages with the shared static footer; see [LEGAL.md](LEGAL.md). Read [AGENTS.md](AGENTS.md) before extending the project; older `design/prototypes/` and generic placeholder pages are historical references, not the canonical new-game standard.

## Privacy, terms and help

[Privacy](privacy.html), [Terms of play](terms.html) and [Contact & data help](contact.html) apply across all games. The footer is shared static HTML and works without JavaScript. Run `npm run legal:sync` after adding pages; CI checks for drift. Legacy Lowball policy links redirect to these universal pages. See [LEGAL.md](LEGAL.md) for maintenance and remaining owner-supplied launch details.

## Game usability

The live games share larger phone controls and readable supporting text, keyboard modes/sorting, visible focus and explicit validation/result feedback. Lowball dialogs contain focus across its iframe; Stake preserves focus during inactive-mode timeouts. See [ACCESSIBILITY.md](ACCESSIBILITY.md) for the verified behaviors, tests and remaining real-device/screen-reader checks.

## Pack integration

Pack is now a real fourth game, with the name still provisional. See [its implementation notes](games/pack/README.md). Existing Supabase projects need the additional [Pack migration](supabase/pack.sql) in SQL Editor for cloud saves and private friend comparisons; browser play and local profiles work immediately. Fresh projects apply updated `setup.sql` then `friends.sql`. The Content Studio still edits the three factual-content banks; Pack’s fictional, solver-checked bank uses its dedicated generator.
