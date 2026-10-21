# Break Room

A static daily games website with a warm cream grid, navy outlines, pastel panels and hard pixel shadows. The repository is `phoenix6716/Break-Room`, formerly `Midnight-Arcade`.

## Play and develop

The expected GitHub Pages address is [Break Room](https://phoenix6716.github.io/Break-Room/). Publication is gated by [Check and publish Break Room](https://github.com/phoenix6716/Break-Room/actions/workflows/site.yml); check its latest deployment when verifying a release.

For a local source preview:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/index.html`. Keep the full folder structure; links use explicit `index.html` targets for downloaded copies. A local server is recommended for account features and consistent browser storage.

| Game | Current gameplay |
| --- | --- |
| Lowball | Four Daily price guesses, AU/US/UK/CA selection, generated pixel-art items and free Unlimited practice. |
| Stake | Five Daily trivia questions, 1–3-chip bets and a 30-second timer after each bet; Unlimited practice. A timeout loses the bet. |
| Laser | Four untimed mirror puzzles, first-fire Daily scoring, unscored retries/solutions and free practice. 216 solver-checked boards, including 96 three-mirror Experts. |
| Prior | Five untimed earlier-event choices, progressive gap bands, timeline/date reveals and free endless practice. 128 scoped events. |
| Pack | Three untimed easy/medium/hard packing puzzles, a visual bag, personalized swaps and free Unlimited practice. 180 validated bags. |
| Alibi | Four untimed evidence-based Daily cases, personal notes, illustrated suspects and free Unlimited practice. |
| Bouncer | Two untimed Daily secret spelling rules, optional half-credit probes and free Unlimited practice. |
| Inner Clock | Five blind Daily timing targets, native average miss and free Unlimited practice. |
| Stack Up | Five Daily ordering sets, drag/touch/keyboard controls, 90 seconds per stack and position feedback; Infinite practice. |

All Dailies reset at midnight **Australia/Sydney**, including daylight-saving changes. The homepage lists only the nine playable games; all six cancelled placeholder cards have been removed. Native scores remain alongside the shared 0–100 Arcade score. See [SCORING.md](SCORING.md) for the exact formulas and equal-game average over the common 120-day window.

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

Friends use private codes, accepted requests, remove/block controls and opt-in Today/120-day score comparisons. Apply the additional database migration as documented in [FRIENDS.md](FRIENDS.md). Friends receive server-derived scores, not raw guesses, answers or email addresses. Existing browser records are origin-specific; changing domains does not automatically migrate guest saves. The repository-path rename from `/Midnight-Arcade/` to `/Break-Room/` keeps the same HTTPS origin; it does not by itself move or erase localStorage saves.

## Checks and deployment

Use Node 24, Python 3.12+ and the locked dependencies:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install --with-deps chromium
npm test
```

The suite creates a content review report, runs unit/database checks, builds `dist/`, validates shipped references/scripts and tests actual game/account/friend flows below the legacy test prefix `/Midnight-Arcade/` (the live Pages path is now `/Break-Room/`). Tests use isolated browser records and a local PostgreSQL implementation; mocked authentication transport does not establish live Supabase configuration or email delivery. `ARCADE_CHROMIUM` selects a browser executable; the managed environment can use `/usr/bin/chromium`.

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

Pack is now a real fourth game, with the name still provisional. See [its implementation notes](games/pack/README.md). Existing Supabase projects should now use the complete [nine-game migration](supabase/inner-clock.sql), which includes Pack support, in SQL Editor for cloud saves and private friend comparisons; browser play and local profiles work immediately. Fresh projects apply updated `setup.sql` then `friends.sql`. The Content Studio still edits the three factual-content banks; Pack’s fictional, solver-checked bank uses its dedicated generator.

## Prior integration

Prior is the fifth game, with the name still provisional. See [its implementation notes](games/prior/README.md) and [candid prototype review](design/prototypes/prior/REVIEW.md). Existing Supabase projects run [supabase/inner-clock.sql](supabase/inner-clock.sql) **last**, after the earlier setup/social migrations; it also includes Pack support. Fresh projects use updated setup then friends. Browser play and local profiles work before the migration. Event source references are included, but independent source verification and human difficulty checks remain part of the prelaunch audit.

## Laser integration

Laser is the sixth game. See [its implementation notes](games/laser/README.md). Existing Supabase projects now run the complete [nine-game migration](supabase/inner-clock.sql) **last**, after setup/Friends; it includes both Laser formats and all other games. Fresh projects use updated setup then Friends. Local play works immediately; live cloud/Friends support needs this owner-applied SQL. The original prototype is preserved outside the build.

## Alibi scenarios — current contract (v2)

The owner approved real scenarios grounded in incidents, timelines and evidence, plus generated men’s/women’s portraits. Alibi now selects **96 new evidence-dependent visit-reconstruction cases**, 24 per tier. Only the culprit’s account is false; everyone else’s account and the verified records are accurate. The incident window determines the relevant visit. Both records and accounts are necessary, and each case has one complete reconstruction. This supersedes the original abstract false-count rules for **new** cases. Personal notes remain ungraded; four untimed Dailies, first-confirmation finality and correct × 25 Arcade scoring are unchanged.

Eight illustrated portraits were generated as an image atlas and encoded as an optimized WebP; CSS selects a cell. New snapshots store stable, distinct random portrait assignments, unrelated to guilt. Existing original-format drafts/notes/completions/history keep their original rules and scores; new scenarios are available in Unlimited immediately and the next fresh Daily. The frozen 144-case original bank and tests remain outside production. Read `games/alibi/README.md` for exact source, schema, behavior and compatibility.

**Current complete upgrade: run `supabase/inner-clock.sql` LAST.** It includes Alibi scenarios and three-mirror Laser Expert, so earlier per-game updates need not be reapplied. It includes all earlier games and both Alibi parsers. Fresh projects use current setup then Friends; do not reapply old narrower migrations. Personal raw snapshots/notes remain private; Friends expose only completed normalized records through existing sharing controls. Human playtesting and the separately agreed prelaunch audit remain necessary. No billing or other game was enabled.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/inner-clock.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.
