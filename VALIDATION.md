## Stake timed questions and popup repair

Passed `tests/stake-timer.cjs` at 320/390/768/1440px: untimed stake selection; 30-second question timer; persisted absolute deadline across refresh; expiry during help; timeout charged once; all five daily bets lost correctly with a -11-chip total, saved completion and correct stats; Unlimited expiry without affecting Daily stats. Additional checks passed for Daily expiry while viewing Unlimited, stopping the timer after answering, rejecting a late click as timeout, and matching both Stake popup styles to Stack Up's computed styles, focus trapping/restoration and removal of the old purple inner border. Existing question-bank migration, Stake sharing, shared-reset and full Stack Up suites also passed. Screenshots captured with no browser JS/resource errors.

## Question-bank expansion

Verified all 112 sorting-set orders against the checked-in factual reference snapshot and all 100 added trivia answer keys. Independent expected answers check the numerical sets/questions. Duplicate/tie checks and blank pre-answer descriptions pass. Migration tests pass for both games: old questions/scores/progress survive the larger bank, new records use question snapshots, bank reordering does not alter them, and old descriptions do not leak answer values. Full Stack Up, Stake sharing and shared-reset suites pass after the expansion. See `content/QUESTION-SOURCES.md` for reference URLs, excluded ambiguous entries and the reconciled airport-elevation discrepancy.

## Stack Up production integration

- Full Daily five-stack runs passed at 320, 390, 768 and 1440px, including exact perfect score (31,000), daily completion saved once, replay prevented, result copy content, and Infinite scores excluded from Daily stats.
- Passed desktop drag/drop, touch-button sorting, keyboard arrows, help/stats/menu, modal focus trapping/restoration and no-overflow checks.
- Passed order and pending-result persistence, wrong-guess penalties, negative scores, timeout recorded once, wall-clock reload and Daily/Infinite switching without timer resets, and midnight Sydney rollover.
- Passed same date-seeded challenge/order in UTC, Sydney and Los Angeles. Legacy `game.html?id=stack-up` redirects to the live game.
- Passed storage-unavailable feedback with practice remaining playable.
- Existing expanded smoke suite passed 532 assertions across all games. Existing shared-clock/browser rollover checks passed.
- Desktop/mobile gameplay and intro/result/stats screenshots captured with no JavaScript or failed-resource errors.

## Replay and Unlimited update

Passed the 500-assertion smoke suite, shared-clock/browser rollover suite and Stake sharing suite after the link/reset/Unlimited changes. New `tests/replay-unlimited.cjs` passed seeded current-run resets for both games, retention of older history, persistence of subsequent bets/guesses across refreshes, free Lowball Unlimited without `pc_pro`, no daily stats changes in practice, no Lowball overflow at four widths, and card navigation to explicit existing HTML files. Direct `file://` browser navigation was blocked by managed Chromium policy; no policy bypass was attempted. Updated Lowball desktop/mobile screenshots show the blue mat and price-slip design.

# Break Room design rollout validation

- Applied production menu, Break Room wordmark/favicon, cream grid, navy borders, pastel controls, and hard shadows.
- Placeholder games retain all lifecycle markup, help/stats panels, menu and footer controls in the Stack Up introduction layout.
- Lowball/Stake retain their existing engines and storage namespaces. Lowball iframe now resizes with its board and dialogs remain within the visible viewport.
- Passed 500 smoke assertions across 320, 390, 768 and 1440px, including full Lowball/Stake daily runs, reload/resume, saved completion, region selection, stats, Unlimited, menu keyboard behaviour and disabled placeholders.
- Passed Stake sharing tests at 390/1440px: question/review readability, real clipboard content, fallback, failure feedback and focus restoration.
- Passed shared clock tests, including leap/year boundaries and 23/25-hour DST days; passed browser rollover tests in UTC, Los Angeles, Tokyo and Sydney.
- Checked homepage, friends, profile, login, signup, style guide and game routes at four widths: no horizontal overflow. No broken local references found.
- Captured desktop/mobile production-page screenshots under `design/previews/break-room/`; no browser JavaScript or failed-resource errors during capture.

Scope: this rolls out styling, branding and layouts. Account/social backend placeholders remain. Lowball Unlimited is free; Stack Up is now integrated with the shared reset and real local daily records. Historical design files remain archived.

# Validation

Verified in the prepared cloud environment using Chromium and Playwright:

- 500 assertions in `node tests/smoke.cjs`, with no browser JavaScript errors.
- Homepage availability/order and game headers/drawers at 320, 390, 768, and 1440 pixel widths.
- Clickable drawer close and navigation links, outside-click/Escape dismissal, focus containment/restoration, and no horizontal page overflow at those widths.
- All six coming-soon routes retain the template layout with disabled start controls and working help/statistics previews.
- Lowball: first-visit help, region selection, invalid input rejection, all four rounds, refresh during a pending result, persisted completion counted once, statistics, and the existing locked Unlimited screen.
- Stake: betting, answer feedback, all five daily questions, refresh after a bet, saved completion, statistics, and Unlimited practice without adding a daily run.
- 394 local HTML/CSS resource references exist; 17 JavaScript files/inline blocks pass syntax checks.
- The installed Cabinet Badge logo was visually checked on the homepage, Lowball, and Stake at 320, 390, and 1440 pixels. It loads correctly, preserves header sizing, and causes no horizontal overflow. The 500-assertion suite also passed after installation. The installed PNG matches the reviewed concept byte for byte.

Functional browser tests intentionally use fallback fonts rather than depending on Google's font service. Real-device testing, production hosting, authentication, purchase/restore services, external statistics APIs, and cross-device sync were not tested. Lowball's business/legal and external-service configuration still contains its original placeholders.

The current site wordmark is Cabinet Badge (round 4, option 1), with the existing moon badge favicon retained. Existing game mechanics/artwork and storage keys are preserved. A small Lowball iframe integration fix keeps its dialogs inside the visible screen area.

## Stake readability and results-sharing update

`node tests/stake-sharing.cjs` passes at 390 and 1440 pixel widths. It plays all five daily questions, checks the question and review typography, verifies that the share label/textarea are absent, reads the actual copied result from the browser clipboard, and tests fallback copying plus failure feedback/focus restoration. Shared links use the current hosted Stake route. No browser JavaScript errors were observed. Stake's inline scripts also pass syntax checks.

Question and results screenshots are saved in `design/previews/stake-readable-question.png` and `design/previews/stake-copy-button-results.png`. That Stake sharing update left gameplay, scoring, and timing unchanged; the later shared-reset update below aligns daily timing across games.

## Homepage refinements and universal reset

- The original game-grid HTML is preserved byte for byte. The game grouping and ordering remain unchanged.
- `node tests/daily-clock.cjs` passes Sydney-midnight, fractional-second, year/leap boundary, and 23-hour/25-hour daylight-saving cases.
- `node tests/homepage-reset.cjs` passes responsive checks at 320, 390, 768, and 1440 pixels: one introduction, a working countdown, the original two/three-column grid, 14px descriptions, and no horizontal overflow. At 390px, the first game now starts around 567px down the page, compared with roughly 894px previously.
- Browser clock tests in UTC, Los Angeles, Tokyo, and Sydney confirm that the homepage, Stake, and Lowball agree before and after Sydney midnight. Stake rotates its daily set and keeps calendar-based streaks consistent. Lowball signals the new daily and discards stale pending-round progression when loading the new day's challenge.
- Actual responsive screenshots are in `design/previews/homepage-refined-desktop.png` and `design/previews/homepage-refined-mobile.png`; Google Fonts are blocked in the screenshot/test environment, so these use the existing fallback fonts.

- After the shared-reset changes, the complete 500-assertion gameplay/navigation suite and the Stake clipboard/readability checks both pass. The Lowball smoke helper now waits for its iframe navigation before accessing engine controls. All 403 local HTML references exist, and inline scripts pass syntax checks.

## Shared header group order

The six main site pages place Home/Friends/Profile on the left, the logo independently centred, and the Log in/guest group on the right on desktop. At narrower widths the navigation occupies a second row while the logo remains centred above it and the account group stays on the right. Checks at 320, 390, 600, 768, 900, 1024, and 1440 pixels confirmed exact centring, no overlapping groups, no horizontal overflow, and working navigation/login links. Game-page headers remain unchanged. Homepage screenshots were refreshed.

### Lowball visual refresh — 19 October 2026

- `tests/smoke.cjs`: 532 assertions passed; Lowball regions, invalid guesses, four-round completion, saved results, stats and Unlimited all passed; no browser JavaScript errors.
- `tests/lowball-art.cjs`: all 100 item illustrations produce vector geometry with PNG requests blocked; new-item fallback and peanut-butter family checked; exact-price score receipts and layout checked at 320, 390, 768 and 1440px.
- Reviewed screenshots of the playing area and mobile score receipt. Desktop/mobile score previews and an illustration sampler are saved in `design/previews/lowball-refresh/`.
- Validated through the local HTTP server, not a public deployment.

### Generated Lowball image set — 19 October 2026

This update replaces the preceding code-drawn SVG illustrations with actual generated images. All 100 item illustrations and nine utility icons were generated from references to the original shaded pixel art. Five original atlases and an extraction manifest are retained alongside the 109 individual transparent PNGs.

- `tests/lowball-art.cjs`: all 100 item images rendered through `showItem()` and decoded at 192×192; all nine utility images decoded; 109 distinct file hashes; every gem colour checked; sound-on/off artwork and saved sound settings checked; play/result layouts fit 320, 390, 768 and 1440px; no browser JavaScript errors or HTTP errors.
- `tests/smoke.cjs`: 532 assertions passed, including Lowball regions, invalid input, four-round play, saved results, completed stats, and Unlimited; no browser JavaScript errors.
- Visually inspected all four 25-item catalogue screenshots and the actual mobile playing area and desktop score receipt. Full website screenshots, close-ups, final-screen previews, utility art, and the complete HTML catalogue are in `design/previews/lowball-images/`.
- Validated on a local HTTP server. The implementation uses local image paths and requires no remote image service. Public hosting was not deployed or tested.

### Counter and tabletop visual overhaul — 19 October 2026

- `tests/smoke.cjs`: all 532 assertions passed, covering both games' complete Daily flows, saved results, stats, regions, and Unlimited; no browser JavaScript errors.
- `tests/lowball-art.cjs`: all 100 item images and nine utility images decode; each PNG is distinct; gem colours, sound settings, and play/result widths passed.
- `tests/stake-timer.cjs`: passed at 320/390/768/1440px; 30-second deadlines, reload and modal timeouts, mode switching, five-loss totals, saved stats, late clicks, and popup parity with Stack Up all passed.
- `tests/stake-sharing.cjs`: question/review typography, completed results, real clipboard contents, fallback, failure feedback, and focus restoration passed at 390 and 1440px.
- `tests/game-surfaces.cjs`: passed at 320/390/768/1440px; currency stays inside the till, receipt fills the playing area, keyboard-only price/round progression and Stake betting/answering work, all three chips are circular, mode-arrow keys work, the longest bank question wraps, chip stacks reflect the bet, and reduced motion disables new animations.
- Actual game previews saved under `design/previews/game-polish/`, including Lowball's counter/receipt/final screen and Stake's betting/question/win/urgent timer/timeout/final screens. Screenshot runs use isolated browser storage.
- Tested using a local HTTP server; no public-host deployment was performed.

### Lowball gem restoration — 19 October 2026

Restored the exact cut-corner, softly coloured faceted gems from the initial Break Room visual refresh. Round and final scores share the restored renderer; the glossy square PNGs are no longer mapped into the game. `tests/lowball-art.cjs` passed for all four gem tiers on both round and final screens, all 100 item PNGs, the five remaining active utility PNGs, sound settings, and four responsive widths. Updated mobile receipt/final previews show the restored gems.

### Lowball header and reset alignment — 19 October 2026

Moved Lowball's personal stats into the title/tools header row. Matched Stake's countdown wording, styles, shared clock, and desktop/tablet screen coordinates; moved the region selector below it; removed the country-list tagline and its rule. Preserved the midnight-ready reload action. Direct browser checks passed at 320/390/768/1440px for centring, no overlaps/overflow, countdown style parity, region changes, and submitting a guess. `tests/smoke.cjs` passed all 532 assertions. `tests/homepage-reset.cjs` passed responsive and midnight rollover/stale-submission checks in UTC, Los Angeles, Tokyo and Sydney. Updated mobile and desktop Lowball previews are in `design/previews/game-polish/`.

### Centred Lowball layout — 19 October 2026

Replaced the offset sidebar layout with one centred column. Header, mode buttons, progress, playing area, settings row, sound toggle and legal footer share the viewport centre line. Countdown/region controls sit together below the game; sound sits beneath them at the bottom centre. Direct browser checks passed at 320, 390, 650, 768, 900, 1024 and 1440px in play and receipt states, including dropdown fit, no overflow, region switching, scoring, retained faceted gems and sound toggling. `tests/smoke.cjs` passed all 532 assertions; `tests/lowball-art.cjs` passed. Updated desktop/mobile full-page previews show the centred layout.

### Lowball top-right reset rail — 19 October 2026

Moved the countdown and region selector into a stacked top-right rail, independent of the centred game column. The sound toggle remains directly below the playing area on the same centre line. Narrow layouts keep the stacked controls above the game. Browser checks passed at 320, 390, 768, 1024, 1100, 1280 and 1440px: centred header/modes/game/sound, countdown above region selector, desktop rail outside the game without shifting its centre, no clipped dropdown or horizontal overflow, region switching, scoring, and retained faceted gems. Updated mobile/desktop previews are in `design/previews/game-polish/`.

### Four layout goals completed — 19 October 2026

1. Copied Stack Up's boxed daily reset into Lowball and Stake through one shared stylesheet, preserving Stack Up's original appearance.
2. Removed the “(4 rounds)” suffix from Lowball's Daily button without changing the daily rules.
3. Centred Stake's header, stats, modes, progress markers and table on the same responsive axis/width as Lowball. Kept the reset box in an independent top-right rail on wide screens.
4. Verified the requested appearance and behaviour in the browser.

Validation: `tests/layout-goals.cjs` passed at 320/390/768/1024/1100/1440px, including exact computed-style equality against Stack Up with the new stylesheet disabled, unchanged Stack Up styles after enabling it, equal countdown values, literal “Daily” text, equal centred game widths, reset/region/sound placement, no horizontal overflow or clipped dropdown, and working menus, modes and bets. `tests/smoke.cjs` passed all 532 assertions; `tests/stake-timer.cjs` passed all four widths, timeout/persistence/mode and popup checks; `tests/homepage-reset.cjs` passed all responsive and four-timezone midnight rollover checks. Full-page and reset-card previews were saved for desktop and mobile in `design/previews/game-polish/`. No public hosting deployment was performed.
