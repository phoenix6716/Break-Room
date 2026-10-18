# Lowball

A daily price-guessing game. Single-page site: open `index.html`, no build step.

## Before launch
- Open `site-config.js` and fill in your business name, ABN, support email and domain. The privacy policy, terms and refund pages read from it.
- Have a lawyer read `privacy.html`, `terms.html` and `refunds.html` before you take payments or show ads.
- When you add an ad network, set `adsEnabled: true` in `site-config.js` (turns on the cookie banner) and load the ad script inside `PC_CONSENT.onGranted(...)`.
- Replace `YOURDOMAIN.com` in the `<head>` of `index.html` with the real domain.
- Add the analytics script tag in the `<head>` (see the comment there).
- Prices were last checked on the date in `PRICES_CHECKED` in `index.html`.

## Daily reset
The daily puzzle changes at midnight Sydney time (`Australia/Sydney`).

## Adding items
Add a row to `ITEMS` in `index.html`, add its icon file to `icons/`, and map it in `ICON_FILES`.

## Percentile ("Better than 72% today")
Hidden until `statsApi` in `site-config.js` is set to your server's base URL. The server needs two endpoints. `day` is the game's day number and `score` is the player's daily average (0 to 100):
- `POST {statsApi}/score` with JSON `{ "day": 15, "score": 89 }`. Stores the score and replies `{ "percentile": 72.4, "players": 310 }`. The game sends this once per player per day.
- `GET {statsApi}/percentile?day=15&score=89`. Replies with the same JSON without storing anything. The game calls it when a player returns after finishing.

`percentile` is the share of that day's players (0 to 100) who scored lower. The server must allow requests from your site (CORS).

## Unlimited paywall
Daily is free. Unlimited shows a locked screen until `localStorage.pc_pro` is `"1"`. Set these in `site-config.js`:
- `unlimitedPrice`: text shown on the locked screen (placeholder `A$9.99`).
- `checkoutUrl`: your Lemon Squeezy checkout link. While empty, Buy says it is not open yet.
- `restoreApi`: a URL that accepts `POST { "key": "<email or licence key>" }` and replies `{ "ok": true }` for a valid purchase. While empty, Restore says it is not available yet.

This lock only runs in the browser, so anyone who edits the page can skip it. A real paywall needs the server to hold the prices and check the purchase.

## Player stats
Streak, best streak, played and the 14 day chart are stored on the player's device (`pc_history`, `pc_streak`, and so on). Clearing browser data resets them.
