# Stake shelved — owner decision, 24 October 2026

Stake is removed from the active shelf, navigation drawers, current Daily checklist and Friends comparisons. Nine active games, in order: Laser → Time Drop → Clue Ladder → Seating Chart → Hidden Gem → Stack Up → Pack → Lowball → Inner Clock. Stake joins Prior, Alibi and Bouncer in the archive. Preserve its direct route, engine, question bank/artwork, local/cloud saves, native/Arcade scores and earned achievements. Profile shows saved Stake history without play prompts; unearned High roller and the legacy three-game Clean sweep are hidden, while earned badges retain their original meaning. Thirteen native save formats remain supported; no database/schema change is needed. The canonical shell still uses Stake's layout. This supersedes older active-roster counts below.

# Break Room

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

## Prior shelved; preserve its content — owner decision, 23 October 2026

Prior joins Alibi and Bouncer outside the active lineup. The six current games are Laser, Stack Up, Stake, Pack, Lowball and Inner Clock. Remove Prior from the shelf, drawers and current Friends comparisons; keep archived profile history, earned achievements, saves, scoring compatibility and direct routes. The current Daily checklist uses six games.

Preserve `content/prior-events.json` in full, including stable event IDs, dates, explanations and source links, plus `scripts/build-prior-events.cjs` and existing generated content. The owner wants a similar event-based replacement that can reuse this material. Its design is not decided; do not invent rules, alter the bank or add a replacement card yet. This supersedes the earlier seven-game roster below.

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
| Pack | Three untimed easy/medium/hard packing puzzles, a visual bag, personalized swaps and free Unlimited practice. 180 validated bags. |
| Inner Clock | Five blind Daily timing targets, native average miss and free Unlimited practice. |
| Time Drop | Five untimed event-year guesses, fixed partial-credit points, era-changing art and 330-event free Unlimited practice. |
| Stack Up | Five familiar Daily ordering sets, 90 seconds per stack and drag/touch/keyboard controls; optional Challenge mix in free Unlimited. |

All Dailies reset at midnight **Australia/Sydney**, including daylight-saving changes. The homepage lists seven current games. Prior, Alibi and Bouncer are shelved; their engines, direct routes and saved history are preserved. All six cancelled placeholder cards remain removed. Native scores remain alongside the shared 0–100 Arcade score. See [SCORING.md](SCORING.md) for the exact formulas and equal-game average over the common 120-day window.

## Current lineup — owner decision, 23 October 2026

Alibi and Bouncer are shelved and removed from the active homepage, navigation drawers and current Friends comparisons. The seven current games, in shelf order, are Laser, Stack Up, Stake, Pack, Prior, Lowball and Inner Clock. Preserve the shelved engines, direct routes, artwork, local/cloud saves, historical native/Arcade scores and earned achievements. Profile keeps archived results for players who already have them, without play prompts, and its current Daily checklist uses seven games. Historical profile averages still include saved archived results; Friends compares the current lineup. Do not remove cloud/schema compatibility or erase records as part of shelving.

The owner wants three better replacement games, with one prototype already lined up. Review that supplied game before integration; the other two concepts are not selected. Do not invent or advertise replacement games or restore cancelled placeholders. After three replacements the intended roster would be ten games. This decision supersedes older nine-game and Alibi/Bouncer launch-roster guidance below; those game contracts remain compatibility documentation.

## Content tools

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run content:studio
```

Open `http://127.0.0.1:9030` on the machine running the command. Search all **264 Stake questions, 368 Stack Up sets and 100 Lowball items**, write drafts, attach factual sources, preview player/answer views and save/download JSON proposals. This is a local development tool; it does not change live banks or publish content. Remote cloud loopback addresses require an attached browser/approved forwarding, or run the checkout on your own computer.

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

## Alibi evidence files — current contract (v3)

New games use **128 evidence-led files**, 32 per tier, across stamp matches, paired badge permissions, inventory differences and seal custody. All observations are verified; players match the physical evidence to a catalogue entry and deduce its owner. Each fresh Daily uses all four methods, with a 32-day rotation. Assignment notes are ungraded, and reveals explain the evidence match and deductions. Four untimed cases, first-confirmation finality and correct × 25 Arcade scoring remain.

The 155 v2 visit scenarios and original v1 snapshots retain their original rules, notes, choices and scores. The existing eight-person portrait atlas is unchanged. See [the current Alibi contract](games/alibi/README.md) and [the player-feedback release](PLAYTEST-FEEDBACK.md) for sources, validation and limits.

Before deploying this release to an existing project, apply **`supabase/playtest-feedback.sql` after the previous Inner Clock migration**, or use the updated complete `supabase/inner-clock.sql`. Fresh projects use current setup then Friends. These repeatable migrations support all three Alibi formats and versioned Stack Up scores without rewriting saves, RLS, relationships or sharing settings. Live SQL and deployment are separate from passing repository tests.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/inner-clock.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.
