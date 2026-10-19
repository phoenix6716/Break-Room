## Stake question timer and shared popups

Stake now gives 30 seconds **after a bet is placed**, when the question/choices appear. A timeout loses that bet and opens the same answer-review flow as an incorrect answer. It applies to Daily and Unlimited. Daily deadlines persist across refreshes; both modes continue counting while another mode or a popup is open. Correct/incorrect answers stop that question's timer. Choosing the next stake is not timed.

Saved records retain `b`, `p`, `qs` and now also `deadline` (absolute milliseconds or null) and `rv` (answer review). A pick of `-1` means timeout and is scored/shared as a loss. Earlier pending bets receive a persisted 30-second deadline on their first upgraded load. No existing completed scores are reset.

`game-dialog.css` supplies the shared cream/navy popup visuals for Stack Up and Stake. Stake's late purple popup override has been removed. Both Stake dialogs support focus trapping, focus restoration and Escape, and the guide explains timer behaviour. `games/stake/timer.css` styles the sticky question countdown.

Run `ARCADE_TEST_URL=http://127.0.0.1:8000 node tests/stake-timer.cjs` for timing, penalties, persistence, mode switching, popup styling/accessibility and responsive checks. Updated screenshots are in `design/previews/stake-timer/`.

## Expanded question banks

Stack Up now has 112 harder sorting sets and Stake has 264 questions: 100 additions to each game, plus harder replacements for Stack Up's original twelve. Pre-answer card descriptions are blank, so weights, dates and other answer values cannot give away the order. The quantities are shown only in the result explanation. Sources, checks and exclusions are documented in [content/QUESTION-SOURCES.md](content/QUESTION-SOURCES.md).

Saved runs keep question snapshots; earlier records migrate against their original banks, preserving progress and scores after content updates. New question sources are loaded locally (`games/stack-up/stacks.js` and `games/stake/questions.js`), so downloaded copies need the complete updated folder.

## Stack Up is live

`games/stack-up/index.html` is the production game. The homepage, game drawers and `game.html?id=stack-up` all open it directly. The original uploaded game remains archived under `design/prototypes/`.

Daily selects five of 112 stacks from a date seed, with identical challenges across device timezones. Each stack has 90 seconds; points are multiplied by ten in Daily. A correct answer earns `(100 + remaining seconds × 5 + consecutive stack streak × 35) × multiplier`. A wrong guess costs 300 Daily points / 30 Infinite points and resets the stack streak. Timeout costs 400 / 40. Scores may be negative. Infinite is free practice and never enters Daily stats.

Daily state is saved under `break-room:stack-up:daily:YYYY-MM-DD`. Orders, penalties, deadlines, round results and completion survive reloads and mode switches. Timers use wall-clock deadlines and continue while a stack is left open; they stop between stacks. The next Daily unlocks at midnight Australia/Sydney. Stats, best scores, play streaks and sharing are backed by completed local Daily records. Browser storage failure is shown explicitly. There is no sample leaderboard or invented point balance. Cross-device accounts and online rankings are not part of this local game engine.

Sort using desktop drag-and-drop, labelled touch buttons, or arrow keys on a focused card. Dialogs support Escape, focus trapping and focus restoration. Mobile keeps the timer sticky. Run `ARCADE_TEST_URL=http://127.0.0.1:8000 node tests/stack-up.cjs` for full-run, persistence, timer, mode, sharing, keyboard, touch, storage failure, midnight and responsive coverage. Screenshots are in `design/previews/stack-up/`.

## Downloaded-site navigation and replay update

Game cards use explicit `games/<name>/index.html` links so opening the downloaded homepage does not navigate to a folder listing. Lowball's board uses a blue gridded mat and printed price slip. `SITE.unlimitedFree` is enabled in `games/lowball/engine/site-config.js`; Unlimited opens without a purchase flag.

This update runs a one-time local migration per game (`break-room:<game>:daily-reset:2026-10-19`) to reopen the current daily. Stake removes only the current day's stored attempt. Lowball clears current progress and, if completed today, removes that day's history/completion and subtracts it from the played/streak counters while retaining older records and settings. The marker prevents repeated resets on refresh.

Run `ARCADE_TEST_URL=http://127.0.0.1:8000 node tests/replay-unlimited.cjs` for explicit link targets, actual card navigation, seeded daily reset/preserved history, subsequent reload persistence, free Unlimited and responsive play-area checks. Managed Chromium blocks `file://`, so direct downloaded-file browser navigation could not be exercised here; real local HTML targets and equivalent HTTP navigation were verified.

# Break Room

The production site now uses the approved cream grid, navy outlines, pastel palette and hard pixel shadows. The homepage uses the approved menu; placeholder games use the Stack Up introduction layout, and Lowball/Stake use broad boards with supporting controls.

Shared styles: `break-room.css` (core pages and Stake), `menu.css` (homepage), `stack-layout.css` + `game-layout.css` + `placeholder-layout.css` (placeholder templates), and `games/lowball/engine/break-room-engine.css` (Lowball iframe). Existing storage keys and game engines are retained. Stack Up is now a full game at `games/stack-up/index.html`, with saved Daily runs, the shared Sydney reset, free Infinite practice, and real local stats.

# Midnight Arcade

A static daily games website with the approved purple arcade styling and shared game header. No framework, package installation, or build step is required.

## Run locally

From this checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The homepage is `index.html`; each game has a standalone route in `games/<id>/`.

## Current games

- **Lowball** — integrated price-guessing engine, four daily items, region selector, local progress/statistics, and free unlocked Unlimited practice. Daily reset is midnight in Australia/Sydney.
- **Stake** — five daily trivia questions, chip betting, local progress/statistics, and playable Unlimited practice. Daily reset is midnight in Australia/Sydney, shared with Lowball and the homepage countdown.
- **Coming soon** — Pixel Pairs, Word Forge, Gridlock, Number Drop, Memory Lane, and Mystery Cabinet. Their pages intentionally preserve the default game layout for future integrations. They do not accept attempts or create demonstration scores.

The homepage lists Lowball and Stake first. One compact introduction and a live universal countdown lead into the original mixed game grid. Availability is shown beside the games heading rather than in separate statistics panels. Homepage effects are quieter and supporting text is larger. Profile, friends, login, and signup remain visual prototypes with sample data; no authentication service is connected. Lowball's external statistics, checkout, and restore services remain unset in `games/lowball/engine/site-config.js`.

## Shared files

- `styles.css`: the approved website styling and homepage cards.
- `game-flow.css`: the approved game layout and drawer styling.
- `navigation.js`: shared drawer behavior, focus management, and backdrop dismissal for every game page.
- `daily-clock.js`: shared Sydney calendar, next-midnight calculation, and live homepage countdown; handles daylight-saving changes.
- `game-config.js`: game registry. Existing browser storage namespaces are retained for compatibility.
- `game.js`: availability controller for coming-soon pages; implemented games own their engines.
- `assets/cabinet-badge-logo.png`: selected Cabinet Badge wordmark, displayed at its visible bounds without modifying the source PNG.
- `assets/midnight-moon-icon.png`: matching moon badge used as the website favicon.

See [GAME-INTEGRATION-PLAN.md](GAME-INTEGRATION-PLAN.md) for the template contract. The user selected option 1 (Cabinet Badge) from the latest logo explorations; that wordmark is installed. The existing moon favicon is retained. The original comparison sheet remains in `design/` as history.

## Browser regression checks

With the local server running, and Node.js, Playwright, and Chromium available:

```sh
node tests/smoke.cjs
```

The prepared cloud environment supplies these tools. `ARCADE_TEST_URL` overrides the default test server address; `ARCADE_CHROMIUM` overrides `/usr/bin/chromium`.

Checks cover homepage ordering/availability; drawers and keyboard focus at 320, 390, 768, and 1440 pixels; coming-soon layouts; and complete Lowball/Stake daily runs, refresh/resume, statistics, and existing Unlimited behavior in isolated browser contexts. External Google Fonts requests are blocked in these functional tests, so they use fallback fonts. Tests do not validate payment providers, authentication, real-device behavior, or production hosting.

## Preserve when extending

Keep the current styling and header layout. Lowball and Stake are substantially complete; do not replace their mechanics or artwork with placeholder logic. Keep Lowball's region selector exclusive to Lowball. Browser storage is device-local, not shared account storage or server-enforced access.

For Stake's question typography and result-copying checks, run `node tests/stake-sharing.cjs` against the same local server. This checks real clipboard contents and its fallback behavior at mobile and desktop widths.

## Shared daily reset

All daily games use midnight **Australia/Sydney**, regardless of the device timezone. The homepage, Stake, Lowball, and future-game storage helpers use `daily-clock.js`. Countdown calculations handle 23-hour and 25-hour days. Historical storage keys and saved records are preserved. Stake now chooses its daily set and calculates streaks using the shared calendar rather than the device's local date. Lowball keeps its new-daily-ready interaction, and stale submissions after midnight load the new challenge instead of saving the previous puzzle as a new-day attempt.

Run `node tests/daily-clock.cjs` for calendar/DST cases and `node tests/homepage-reset.cjs` (server running) for responsive layout and cross-timezone rollover checks. Serve the entire repository root even when opening Lowball's engine route directly, so its shared clock script remains accessible.

### Lowball generated artwork and score receipts

Lowball uses actual generated PNG images in `games/lowball/engine/icons/generated/`: 100 individual item illustrations and nine game icons (trophy, lock, stats, four gem colours, sound on/off). They match the original shaded pixel-art references. `item-art.js` maps each item explicitly to its image; it does not draw SVGs, match categories, or silently substitute an unrelated image. Existing items, prices, and mechanics are unchanged.

The original generated atlases are retained in `icons/generated/source/`. `manifest.json` records each asset's atlas, cell, and extraction bounds. If needed, run `node scripts/extract-lowball-images.cjs` with Sharp available to reproduce the individual transparent 192px PNGs from those atlases. This extraction only crops and sizes generated artwork; it does not draw the illustrations. A new item needs its own generated PNG and an explicit mapping in `item-art.js`.

Score receipts retain the clean system sans-serif numerals, compact monospace labels, side-by-side price comparison, and small verification date. Preview images and a complete HTML catalogue are in `design/previews/lowball-images/`.

Run `ARCADE_TEST_URL=http://127.0.0.1:8015 node tests/lowball-art.cjs` against a local static server. It checks every asset through the actual game, all gem tiers, sound switching/persistence, and result/play layouts at four widths. The artwork needs no external image host, API key, or generation service at runtime.

### Lowball counter and Stake tabletop

Lowball's active playing surface is styled by `games/lowball/engine/counter.css`: a large item display on a shop shelf, printed product label, cash-register price input, and a receipt reveal with a stamped verdict and perforated paper edge. Existing generated PNGs, prices, regions, score calculations, and saved rounds are retained. Personal stats sit in the header between the title and utility buttons. Lowball now uses one centred column: the countdown and region selector share a balanced row below the playing surface, and the sound toggle sits at the bottom centre above the legal footer. Enter submits a price and focuses Next; Enter again moves to the next item without skipping the receipt.

Stake's active surface is styled by `games/stake/table.css`: textured green felt with a stitched edge, paper question cards and category tabs, a three-chip betting dock, and chip-stack feedback. The countdown is integrated into the question card and turns coral in the last ten seconds. The score tally, 30-second deadline, timeout penalties, Daily/Unlimited state, and shared popup design remain intact. Chips stay circular at every screen width. Keyboard betting/answering retains focus inside the game, and the mode tabs support arrow keys, Home, and End.

Short stepped entrance, receipt, stamp, and chip animations respect reduced-motion preferences. Previews of play, receipt, review, timeout, and final-score states are in `design/previews/game-polish/`. Run `tests/game-surfaces.cjs` against the local server for keyboard, responsive layout, long-question, chip-shape and reduced-motion checks. Continue to use `tests/smoke.cjs`, `tests/lowball-art.cjs`, `tests/stake-timer.cjs`, and `tests/stake-sharing.cjs` for gameplay, image coverage, persistence and sharing.

### Restored Lowball score gems

Lowball's round and final results use the original Break Room cut-corner, faceted score gems again: soft green, yellow, orange, and coral. The shared `LOWBALL_ART.gem()` renderer restores the exact earlier design and preserves existing tier thresholds and animations. Item illustrations and the trophy, lock, stats, and sound icons remain generated PNGs. The glossy square gem PNGs are archived with their source atlas but no longer mapped into the game.
