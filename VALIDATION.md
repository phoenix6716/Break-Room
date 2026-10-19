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
