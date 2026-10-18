# Midnight Arcade

A static daily games website with the approved purple arcade styling and shared game header. No framework, package installation, or build step is required.

## Run locally

From this checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The homepage is `index.html`; each game has a standalone route in `games/<id>/`.

## Current games

- **Lowball** — integrated price-guessing engine, four daily items, region selector, local progress/statistics, and its existing Unlimited purchase placeholder. Daily reset is midnight in Australia/Sydney.
- **Stake** — five daily trivia questions, chip betting, local progress/statistics, and playable Unlimited practice. Daily reset follows the device's local date.
- **Coming soon** — Pixel Pairs, Word Forge, Gridlock, Number Drop, Memory Lane, and Mystery Cabinet. Their pages intentionally preserve the default game layout for future integrations. They do not accept attempts or create demonstration scores.

The homepage lists Lowball and Stake first. Its lineup counts describe availability rather than fabricated player results. Profile, friends, login, and signup remain visual prototypes with sample data; no authentication service is connected. Lowball's external statistics, checkout, and restore services remain unset in `games/lowball/engine/site-config.js`.

## Shared files

- `styles.css`: the approved website styling and homepage cards.
- `game-flow.css`: the approved game layout and drawer styling.
- `navigation.js`: shared drawer behavior, focus management, and backdrop dismissal for every game page.
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
