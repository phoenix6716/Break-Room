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
