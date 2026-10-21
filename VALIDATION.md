## Prior implementation (20 October 2026)

Final `npm test` passed all **35 suites**: 12 unit/database/maths and 23 browser suites. The artifact passed 337 shipped files, 828 local references and 35 parsed scripts; the smoke suite passes 596 assertions. Full local log: `/tmp/br-prior-release.log`. After that run the content CLI report was extended and checked separately to include Prior’s 128-event inventory and explicit independent-source-review gap; this does not change player assets or scoring.

The supplied original is preserved at `design/prototypes/prior/original.html`, with candid findings in `REVIEW.md`. Simulation of the original 65-event bank across 365 days found 1,040 of 1,825 pairs at least 100 years apart, with a median gap of 119 years. The integrated game keeps five untimed comparisons but uses easy/medium/medium/hard/hard gap bands, ten distinct events, no same-year ties, related-milestone exclusions and randomized earlier sides. The 128-event bank has precise milestone wording, dates/facts/source links withheld until the answer and an archive-card/timeline identity inside the shared shell. Source articles were not retrieved here; structural tests and historical anchors are not independent verification of every fact. The owner-agreed prelaunch factual/difficulty audit remains outstanding, including broader world-history coverage.

Focused and full tests check 400 deterministic Daily sets, bank/runtime correspondence, known historical anchors, all 32 answer patterns and all six Arcade outcomes (including a completed zero), malformed/pending/tied snapshots, exact SQL/JS score parity, read-only profile integration, cloud progress ordering, revision/ownership/privacy and repeatable old-project migration. Real Prior answers restore on a second browser, stay separated between Alice/Bob/guest, and remain safe with a visible error when the Prior migration is missing. Friends tests include Prior positive/zero records, opt-in/accepted/blocked boundaries and the exact 120-day window.

Actual complete games pass 320/390/768/1100/1440px: hidden dates before choosing, immutable choices, post-answer reviews and reference links, preserved answers across reload/bank reordering, Daily/Unlimited independence, exact native/Arcade results and spoiler-free copy, completed zeroes, profile/history/achievement, keyboard/touch, inert/trapped popups, left navigation, same-origin tab updates, Sydney rollover and denied-storage/clipboard behavior. Desktop/mobile screenshots were visually inspected (`/tmp/br-prior-board-*.png`, `/tmp/br-prior-results-*.png`). Existing native game engines, generated Lowball images and question/puzzle banks were preserved. Generated tracked regression previews were restored before committing.

Existing Supabase projects run `supabase/alibi.sql` last after the earlier setup/social migrations; it includes Pack support. Fresh projects use updated setup then friends. Older per-game allowlist migrations remain historical and should not be reapplied afterwards. No live SQL-admin credentials were available; local PostgreSQL/intercepted SDK tests do not establish a live migration or email setup. A Git push does not establish Pages success; remote Actions/live verification is separate. Physical-phone and screen-reader checks remain part of the agreed launch review.

## Pack implementation (20 October 2026)

Final `npm test` passed all **33 suites**: 11 unit/database/maths and 22 browser suites. The production artifact passed 331 shipped files, 757 local references and 31 parsed scripts. Full local log: `/tmp/br-pack-release.log`. The smoke suite now passes 564 assertions, including Pack navigation. Existing fixture expectations explicitly include the unplayed fourth game; existing native score formulas, saves, question banks and generated Lowball artwork are preserved.

Pack is a real fourth game with three untimed easy/medium/hard Daily bags and independent free Unlimited practice. The 180-bag bank has unique exact optima and graded greedy trade-offs, checked against an independent capacity-indexed solver. Tests cover every bag's SQL/JS score parity, malformed/pending/overweight records, exact snapshots, progress merge ordering, repeatable existing-project database migration and private ownership. The friend security suite includes derived Pack scores under accepted/blocked/opt-in sharing rules. Account browser checks restore Pack in a second browser, keep Alice/Bob/guest progress separate, accept older three-game backups, and preserve native saves with a visible migration error before Pack SQL is installed.

Full actual Pack play passes 320/390/768/1100/1440px: capacity rejection, selected-item tray, saved selections/reviews/completions, personalized swaps, Arcade/native results, spoiler-free copying, profile/history/achievement integration, Daily/Unlimited independence, keyboard modes, inert/trapped popups, left menu, Sydney rollover, touch controls and unavailable-storage fallback. Desktop/mobile board and result screenshots were visually inspected; local screenshots are `/tmp/br-pack-board-*.png` and `/tmp/br-pack-results-*.png`. Generated tracked regression previews were restored before committing.

Existing Supabase projects require the owner to run `supabase/pack.sql` after the earlier setup and friends migrations. Fresh projects use updated `setup.sql` then `friends.sql`. No live administrator credentials are available; local PostgreSQL and intercepted auth tests do not establish that the live migration was applied. A push alone does not establish successful Pages deployment; remote Actions/live verification remains separate. The all-game factual/price/difficulty launch audit and real-device/screen-reader checks remain deferred as previously agreed. Pack's weights/usefulness are explicitly fictional game values, and mathematical tier checks are not measured human difficulty.

## Mobile usability and keyboard access (20 October 2026)

Final `npm test` passed all **31 suites** (10 unit/database/maths and 21 browser), including the new actual-game mobile/accessibility suite. The production artifact passed checks for 325 shipped files, 690 local references and 27 parsed scripts. Final local log: `/tmp/br-mobile-release.log`. No assertions in existing regression tests were removed or relaxed.

The new suite passes touch-emulated 320×640, 390×844 and 844×390 views: ≥44px primary targets, nonoverlapping centred header tools, Lowball inner/outer iframe modal containment/restoration and visible initial focus, region/mode keyboard semantics, visible price errors with no submission, four real Daily rounds, receipt/final announcements and focus, visible Stake questions/next bets, and question-first keyboard/touch Stack Up play. Controlled-clock cases cover first-visit Help versus the drawer/idle visits, different Daily/Unlimited expiry times, preserved active focus, protected dialog focus and once-per-question timer warnings. Existing full game, account/cloud/Friends, scoring, saves, legacy banks, generated images, legal links, responsive shell, drag/touch, reset and sharing tests also passed.

Earlier full runs exposed genuine interactions: Lowball's delayed introductory dialog could make the drawer inert mid-navigation, and enlarging phone tools constrained the full 31,000-point Stack Up header value. The product fixes preserve the first-visit guide when idle, cancel its interruption after interaction, and fit the full value beside 44px tools with centred stats. Focus now starts at each new Stack Up question so keyboard launch does not scroll past the ordering task. Screenshot review also caught the short-landscape Stats button focus being below the visible panel; Lowball dialogs now start at their title. Focused shell checks pass 320/390/650/768/1024/1100/1440px, including full real best-score text. Mobile screenshots were inspected; generated tracked regression previews were excluded from the commit.

No question/item pools, generated art, scoring formulas, save schemas or Supabase configuration changed. See `ACCESSIBILITY.md` for behavior and future-game guidance. These browser/structural checks do not establish actual iOS/Android keyboard behavior or VoiceOver/TalkBack support; a short physical-phone and assistive-tool check remains useful before launch. Hosted Actions/deployment status must be verified separately after pushing.

## Universal legal pages and static footer (20 October 2026)

The content report, footer consistency, all 10 unit/database/maths suites, production build and reference checks passed. After correcting an ambiguous new test selector to target the footer link specifically, all 20 browser suites passed in the final browser run: **30 suites total**. The artifact contains 324 shipped files, 686 checked local references and 27 parsed scripts; the three obsolete Lowball policy scripts were removed. Logs: `/tmp/br-legal-final.log` (initial checks/build) and `/tmp/br-legal-browser-final.log` (complete passing browser run).

The new legal suite verifies one visible static footer on all 22 public entry pages without JavaScript, explicit project-prefix links, legal navigation, three legacy Lowball redirects, disabled no-JavaScript signup controls with policy links, five responsive widths and unchanged local saves when reading policies. The development template shares the generated footer too. Privacy desktop/mobile screenshots were captured and the mobile layout inspected. Existing account/Friends, actual game flows, scoring/saves, sidebar/dialog focus, reset rails, generated artwork, sharing and Stake timeouts passed. Generated regression screenshot changes were excluded from the commit.

Privacy, Terms and Contact/data help describe current services and controls; they do not add a tracker, payment flow, deletion feature, database migration or new consent record. Old Lowball business/provider placeholders and standalone legal instructions were retired. The temporary contact route is the public repository tracker with explicit instructions to arrange a private channel before disclosing identity/account data. The owner still needs to supply a monitored private contact route and confirm operator/provider/legal launch details; tests do not establish legal compliance. Hosted deployment status must be checked separately after pushing.

## Local content tools and project guidance (20 October 2026)

Full `npm test` passed all **29 suites** (10 unit/database/maths and 19 browser). The unchanged public runtime artifact passed checks for 320 shipped files, 565 local references and 30 parsed scripts. The inventory report contains 264 Stake questions, 112 Stack Up sets and 100 Lowball items with no structural errors. It explicitly flags the original 164 Stake questions without individual source audits and Lowball's estimated regional prices without retained shop evidence; no new factual/price verification is claimed.

New unit checks cover inventory extraction without engine initialization, source/review metadata, signed answer choices, duplicate IDs/questions, frozen legacy and stale-base protection, blank Stack Up descriptions, strict measured ordering, regional prices/PNG files and safe nonpublishing scaffolds. The local Studio browser suite covers actual authoring/search, frozen records, validation, player preview/answer reveal, local draft/download, generated item images and region fields, malformed JSON, CSRF/path restrictions and five responsive widths. The desktop Studio was visually inspected. Draft tests use a temporary directory; no live game bank, player save or Supabase data was changed.

An initial full run exposed an existing Friends test race: the request-success message precedes the subsequent score refresh. The test now waits for `aria-busy=false` before asserting the cards. Its assertions remain intact; the full rerun passed. Local final log: `/tmp/br-content-final.log`. Generated regression screenshot changes were excluded from the commit. Tools, proposals and staged games are forbidden in `dist/`; the README and template guidance now describe current functionality instead of superseded prototypes. Reviewed exports remain proposals requiring deliberate integration, not automatic publication. Hosted Actions/deployment results are separate from these local checks.

## Real friends and private score comparisons (20 October 2026)

Full `npm test` passed all 27 suites (9 unit/database/maths and 18 browser), including all existing game/account regressions. The artifact passed checks for 320 files, 565 local references and 30 parsed scripts. Real PostgreSQL tests install/reinstall the migration, exercise requests and acceptance/cancellation/decline/removal/blocking across three accounts, and verify private table/helper access, anonymous/outsider denial and immediate server revocation after sharing off/removal. Existing game-save access rules remain intact.

Server/client scoring parity passes for real native fixtures, zero/negative results, pending/malformed/future exclusions, Lowball history/last-result fallback, the exact 120-day window, 30 nonuniform Stake-bet/timeout cases, Stack Up bounds, and frozen legacy answer permutations across 120 dates. The added authenticated-helper denial assertion also passed in a final focused database run.

The official-client browser test uses two browser contexts and the real PostgreSQL social RPC implementations; only email authentication transport is mocked. It passed codes/copy, requests/acceptance/removal/block/unblock, Today/history/game filtering, equal-game averages and sample counts, opt-in sharing/revocation, safe text rendering of HTML-like names, missing migration/offline errors, cross-tab logout cleanup, disabled no-JavaScript forms and 320/390/768/1100/1440px overflow checks. Desktop/mobile screenshots were visually inspected. No mock players are published in the site.

These tests neither create live users/send invitations nor apply the migration to Supabase. The project owner must run `supabase/friends.sql` after `setup.sql`; see `FRIENDS.md`. Hosted Actions completion and live two-account friend activation are separate verification steps. Local logs: `/tmp/br-friends-final.log` and `/tmp/br-friends-db-final.log`.

## Account redirect race and blocked deployment (20 October 2026)

The failed GitHub Actions run reported `page.waitForURL: net::ERR_ABORTED` at the cross-tab logout check. Save-generation, ownership and Supabase authentication events could each call `location.replace` before the first navigation finished. `accounts.js` now routes account navigation through one guarded helper so subsequent notifications cannot restart it. Browser checks wait for account-aware game controls, begin waiting before triggering logout/sync, assert the destination is ready and cover bursts of repeated save notifications.

A new test executes the real account module with an in-flight navigation and delivers repeated generation/owner/auth events. It deterministically fails against the previous committed script and passes against the guarded version, asserting exactly one redirect. The targeted official-SDK account browser test passed. Full `npm test` then passed all 25 local suites (8 unit/database/maths, 17 browser), including all game/timer/layout/profile/security checks, 318 published files, 565 local references and 29 parsed scripts. No checks were skipped and deployment gating remains intact. The complete local log is `/tmp/break-room-navigation-fix.log`; hosted Actions/deployment status is not verified by these local results. No Supabase schema/configuration change is part of this fix.

## Supabase accounts and private cloud saves (20 October 2026)

A clean `npm ci --ignore-scripts --no-audit --no-fund` followed by `npm test` passed all 24 suites (7 unit/database/maths and 17 browser) against the project-path production artifact. The build checks passed for 318 published files, 565 local references and 29 parsed scripts. The complete run is captured in the local ignored `/tmp/break-room-accounts-final.log` and `.artifacts/` logs.

New pure-adapter tests verify native-key allowlists, no auth/payment/preference leakage, progress ordering, first cloud completion winning, Lowball history/counter merging and native final-score/history agreement. Real PostgreSQL (PGlite) executes the actual schema and tests revision conflicts, RLS across two users, anonymous denial, direct-write denial, constrained RPC access and account-deletion cascade. Official Supabase-client browser tests intercept HTTPS endpoints and exercise login errors, signup confirmation messaging, recovery/update, missing-schema errors, explicit guest import, guest restoration on logout, two users/devices, cross-tab ownership/load safeguards, conflict retry, offline failure, credential-free URLs, disabled no-JavaScript forms and 320/390/768/1100/1440px layouts. Login/account pages were also visually inspected at desktop/mobile sizes.

All existing score/profile, game-flow, countdown, questions, timer, layout, artwork, sharing, keyboard/touch and regression suites passed, including 532 smoke assertions. The old replay-reset test now confirms restored current-day Lowball/Stake completions survive on fresh devices without reset flags; free Unlimited and reload persistence are still verified. Gameplay/scoring and original source saves were not migrated by this setup.

These checks create no live Supabase users, send no real emails and do not establish live backend readiness. Applying `supabase/setup.sql`, configuring exact auth redirect URLs and verifying confirmation/recovery email delivery require the project owner's dashboard access. Public client settings cannot perform these administrative actions. See `ACCOUNTS.md`. A Git push is not proof that GitHub Pages deployment or live account activation succeeded.

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

### Canonical Stake-based new-game template — 19 October 2026

Added `games/_template/` and scoped `game-shell.css`, with replaceable title, description, progress, engine, help, result and stat bindings. The shell uses the existing navigation, popup visuals and Sydney-midnight reset card; it has no Stake engine, fabricated stats or saved completion. `AGENTS.md`, `design/GAME-LAYOUT.md` and the starter README preserve the user’s chosen standard for future game work. Existing game pages and homepage registration are unchanged.

`node tests/game-template.cjs` passed at 320/390/768/1100/1440px: viewport-centred title row, stats, tabs, progress, board and optional audio slot; independent wide-screen reset rail and narrow-screen reset placement; no overflow; real countdown; mode click/keyboard events and ARIA bindings; retained left menu; popup close, backdrop, Escape, focus trapping/restoration and inert background; no storage writes, page errors or failed assets; all local dependencies and explicit file links exist. Actual desktop/mobile/help/stats screenshots are saved in `design/previews/game-template/`. Tested through a local HTTP server, without a public-host deployment.

### Stack Up shared-template migration — 19 October 2026

Applied `game-shell.css` to Stack Up: shared site header and left menu; one title/stats/tools row; plain Daily/Unlimited tabs; centred progress and sorting engine; and one independent reset rail. Replaced the oversized landing layout with a compact launch panel in the same engine slot. The 90-second timer and current-run score sit together inside the playing area; the timer/score row stays visible while sorting on phones. Personal Streak/Best/Played stats now occupy the header; detailed records remain in the shared popup. Removed the old duplicate reset strip/sidebar and the dependency on historical `stack-layout.css`; retained the original questions, sorting, scoring, sharing, timer deadlines, storage keys, saved snapshots and migrations. “Unlimited” is the visible practice label; the existing internal `infinite` key is intentionally retained.

Validation:

- `tests/stack-shell.cjs` passed at 320/390/650/768/1024/1100/1440px: centred shell, one-row header, reset position, real clock, no overflow, menus/dialogs and focus, mode keyboard controls and ARIA, visible timer bar, unchanged saved Daily when switching modes, and full best-score fit after restoring a completed record. Desktop/mobile launch/play and help/stats screenshots are in `design/previews/stack-shell/`.
- `tests/stack-up.cjs` passed: keyboard/button/drag/touch sorting, complete five-stack Daily, exact scoring, refresh/resume/review, stats/sharing, replay prevention, Unlimited, negative scores, timeout persistence, mode-switch deadlines, Sydney midnight and unavailable storage.
- `tests/question-migrations.cjs` passed: old Stack Up/Stake snapshots retain questions, scores and progress; all Stack Up prompts/cards fit narrow/wide screens without revealing answer details.
- `tests/layout-goals.cjs` passed at all six widths. Its reset-card reference now comes from the canonical template rather than Stack Up’s retired page stylesheet; computed appearance/countdowns still match across all three games.

No public-host deployment was performed.

### Stack Up incorrect-position feedback — 19 October 2026

Incorrect submissions now highlight each correctly placed card green and each incorrectly placed card red for 1.1 seconds, with ✓/✕ markers and accessible position descriptions. The live message announces how many cards are in the right position. Repeated submissions restart the highlight; moving cards or rendering another stack clears it immediately. The clock continues running, normal Daily/Unlimited penalties apply, and no temporary feedback is saved. Updated the real help text.

`tests/stack-feedback.cjs` passed at 320/390/768/1440px in both modes, including actual computed colours on focused cards, correct per-position classification, expiry/repeated submissions, clearing stale feedback, unchanged penalties, continuing timer and normal correct-stack completion. Screenshot: `design/previews/stack-shell/position-feedback.png`.

`tests/stack-up.cjs` also passed the full Daily/Unlimited gameplay, save/resume, scoring, timeout, midnight, sharing and storage-failure checks. The positional-feedback test also checks that the live message stays clear of the submit button.

### Real browser-local player profile — 20 October 2026

Replaced the sample identity, friend code, placeholder-game scores and invented achievements in `profile.html`. `profile-records.js` reads the three existing save formats without loading any game engine or writing/migrating/resetting storage. The profile displays per-game scores/averages/bests/plays/history streaks in their original units, total completed plays, today’s checklist, 14-day dated activity, filterable/paginated recent runs and six provable achievements. Unlimited and valid unfinished runs do not count; today’s unfinished runs offer a Resume link. Empty, malformed/unusable records and denied-storage states have explicit messages. No account or cross-device sync is claimed.

Lowball lifetime plays use its retained counter, while best/average/activity use up to 121 days of retained scores (plus its documented last-result fallback without double counting). History streaks/achievements are labelled as derived from available dated records. Stake snapshots determine new scores; legacy records reconstruct the frozen 164-question option permutations without importing or executing the game. Stack Up accepts completed supported save records without changing them. Each browser-local game remains the owner of its state.

- `node tests/profile-records.cjs` passed: all three formats, lifetime/retained Lowball history, zero/negative results, corrupted/future/pending entries, real streaks and achievement conditions, unavailable storage and read-only access.
- `tests/profile.cjs` passed at 320/390/768/1100/1440px: empty and populated views, exact counts/scores/achievements, recent-result filtering/pagination, no clipping/overflow/asset or JavaScript errors, storage-event refresh, Sydney day rollover and byte-for-byte unchanged saves.
- Actual complete Daily runs through Lowball, Stake and Stack Up populate the exact scores (100, +15 chips, 31,000 points) and checklist. Forty legacy Stake dates match the live engine’s answer permutations. Profile opening/refresh preserves all records; real Stake/Stack Up practice does not change the profile totals. Denied localStorage displays a warning and hides unavailable stats.
- Previews in `design/previews/profile/`: populated desktop/mobile (isolated test fixtures), empty desktop, and a profile populated by actual game completions. No user’s saved results were used or modified during testing.

No public-host deployment or account/backend work was performed.

### Shared 0–100 Arcade score and profile average — 20 October 2026

Added one pure versioned calculator in `arcade-score.js`. Lowball retains its existing Daily average; Stake measures chips staked on correct answers / total chips staked × 100; Stack Up scales Daily points by the theoretical 31,000-point maximum and bounds the result to 0–100. Original chip profits/points, game-specific achievements, stakes, question/stack timers, penalties, seeds and progress records are preserved. Stake and Stack Up now show a secondary shared result badge and include both scales in result copies. Lowball labels its existing final average as the Arcade score, with practice explicitly labelled separately.

The profile shows each game's Arcade average and a common recent 120-Sydney-date, equal-game-weight average with explicit game/run sample counts. True zeroes count; absent/unplayed games do not; pending, practice, invalid, future and out-of-window records are excluded. Original raw stats remain separately labelled. There is an accessible native disclosure explaining formulas, weights, missing data, history retention and the difference from a difficulty-adjusted percentile. Historic shared scores are derived from saves without rewriting them. The starter and project guidance now require a documented bounded Arcade score for future games. `SCORING.md` is the version-1 contract.

Validation:

- `tests/arcade-score.cjs` passed exact weighted-bet/timeouts, all-low/all-high perfect Stake, Stack Up maximum/speed/penalty bounds, no intermediate rounding, the 120-day boundary, zero/missing cases and unequal-sample/equal-game averages.
- `tests/profile-records.cjs` passed all existing compatibility cases plus integrated exact historical Arcade averages.
- `tests/arcade-score-ui.cjs` passed 320/390/768/1440px: +5-chip perfect Stake also scores 100/100, 15,500 Stack Up points scores 50/100, unchanged 75-point Lowball scores 75/100, combined average is 75/100, copied results retain both scales, saves are unchanged on profile views, and there are no overflow, asset or browser errors.
- `tests/profile.cjs` passed five widths, complete actual Daily games, legacy Stake engine comparisons, read-only viewing, filters, rollover and storage-denial states.
- `tests/stake-timer.cjs`, `tests/stake-sharing.cjs`, `tests/stack-up.cjs` and `tests/game-template.cjs` passed their existing gameplay, saved progress, timing, sharing, keyboard and responsive checks.

Actual UI previews are under `design/previews/arcade-score/` (isolated saved-record fixtures). No user saves were modified during testing and no public-host deployment was performed.

### Hosting preparation and automated publication checks — 20 October 2026

Added Node 24 / locked Playwright development dependencies and one repeatable `npm test` command. GitHub Actions runs read-only checks for pull requests and `main`; a separate least-privilege Pages/OIDC deployment job publishes only the tested `dist/` artifact after success. The workflow includes manual dispatch, bounded execution times, deployment concurrency and retained failure/check logs. No hosting secret is required by Actions. Pages must first be enabled using GitHub Actions in the repository settings; the default workflow token cannot perform that administration step.

The plain-file build contains 310 published files (about 10.9 MiB), excluding development docs, source atlases, screenshots, tests, scripts, dependency folders and the development template. The validator passed 468 local references, 25 standalone/inline script syntax checks, JSON validation and artifact exclusions. Public Lowball social metadata uses the deployment URL; result copying preserves the project path instead of linking only to the GitHub account root. Its configured hosting label now reflects GitHub Pages.

Login/signup and friend-add prototype forms are disabled and clearly labelled before hosting; disabled form data cannot put credentials into GET URLs. Friends’ sample names/scores are explicitly labelled examples. Actual games and browser-local profiles remain available.

Validation: frozen `npm ci --ignore-scripts --no-audit --no-fund` succeeded. Final `npm test` passed all **five unit suites and sixteen browser suites**, including 532 smoke assertions, all complete game flows, 100 Lowball illustrations/utility assets, native/shared scores, profile compatibility, dates/DST/reset rollover, migrations, timers, feedback, menus, keyboard/touch, sharing, responsive layouts, empty/denied storage states and prototype form protections. Browser suites run against the production artifact mounted below `/Midnight-Arcade/`; only the development-template/parity suites use a separate source mount. Every test can select the pinned CI Chromium via `ARCADE_CHROMIUM`. Workflow YAML and its permissions/triggers/deployment dependency were parsed and checked locally.

Cloud installation/start instructions and the required GitHub API / expected Pages-site network domains were saved to the environment draft; saving does not apply or publish that configuration. Git repository access works, but `gh api` requests were denied by the environment's current network policy. **GitHub Pages activation, remote Actions results and public HTTPS/browser verification remain unconfirmed. No live public deployment is claimed.** See `HOSTING.md` for activation, rollback and the fact that downloaded-file and hosted-origin browser saves do not automatically migrate.


### Five-game round/reveal/replay pass — 20 October 2026

Added the presentation-only shared feedback layer documented in `GAME-FEEL.md`: brief stepped reveals, exceptional-outcome accents, real optional local sound for Stake/Stack Up/Pack/Prior (off initially), and honest Daily Arcade milestones based on earlier available completed records. Lowball keeps its existing sound and generated images/gems, has faster receipt feedback and no automatic Stats interruption. Continuation actions precede longer explanations; Stake has a direct results-to-Unlimited action. Daily scoring, seeds, deadlines, snapshots, account ownership and free practice access are unchanged.

`npm test` passed all **36 suites**: 12 unit/database/maths and 24 browser suites. Production reference/syntax checks passed for **339 shipped files, 838 local references and 36 parsed scripts**. Existing responsive checks cover 320/390/768/1100/1440px as applicable, complete actual gameplay, artwork decoding, wall-clock timeouts, sharing, keyboard/touch, dialogs, profile, cloud/accounts and SQL isolation. The new `tests/game-feel.cjs` completes all five actual Dailies with and without reduced motion, verifies immediate replay during effects and unchanged Daily saves, perfect/best/tied/zero milestones, no celebrations on reload, and denied preference storage/audio. Final focused checks also cover read-only treatment of an older unfinished Stake bet, Lowball effect cancellation when advancing, and the highlighted practice action.

Screenshots from isolated actual-play browser sessions are in `/tmp/br-feel-*-results-*.png` and `/tmp/br-feel-stake-win-*.png`; regenerated historical preview PNGs are excluded from this commit. Automated behavior checks do not establish improved retention/revenue, real-device audio or screen-reader certification. The separately deferred prelaunch content/price audit remains outstanding. No billing, paid entitlements, trackers, SQL migrations or content-bank changes were introduced by this pass. A push is not evidence of public deployment.


### Stake result tiles and matching Lowball sound — 20 October 2026

Stake's on-screen Daily hand now renders five custom navy-outlined lime/coral tiles with drawn check/cross marks and the original bet values. Each list item describes its question, correctness/timeout and chips won/lost for assistive technology. All five remain on one row at 320/390/768/1100/1440px. Emoji squares remain only in copied plain-text results. Native scores, weighted Arcade scores and save formats are unchanged.

Lowball's sole existing sound toggle now uses the shared compact `feel-sound` button and Sound on/off label. It stays centred beneath the board and retains its existing audio and `pc_sound` mute persistence. The old speaker PNGs remain archived; item artwork and score gems are unchanged. Shared button width and letter spacing are explicit to prevent legacy engine styles from stretching the button.

`npm test` passed all 36 suites. Extended Stake sharing checks complete mixed correct/incorrect runs at five widths, check one-row tiles, accessible bet labels and unchanged clipboard/fallback behavior. Lowball artwork/audio checks pass all assets, gems, mute/reload behavior, and compare the actual sound button's colors, borders, shadows, typography, width and padding with Stake. Final focused checks passed the last compact-button and one-row refinements; the production build/reference checks passed. Generated historical preview PNG changes were restored. Public deployment still requires a successful publish workflow; a Git push alone does not verify it.


### Stage 1 — extended play across all five games — 20 October 2026

Completed Pack → Prior → Stack Up → Stake → Lowball; see `PLAYABILITY.md` for the findings, changes and acceptance limits, and `ROADMAP.md` for the next stages. Unlimited remains free. Added shared tab-local practice controls/shuffled pools, Pack/Prior difficulty choice, Stack Up/Stake topic choice and meaningful session feedback. Settings apply to the next round. Stack Up and Lowball preserve practice on mode switches; timed deadlines do not reset. Pack has clear-bag/remaining-capacity controls; Stack Up implements Enter on a focused card; Lowball preserves typed Daily drafts, rejects duplicate submissions and can finish a session early then continue with unplayed items. Lowball help describes the reference-price target; the inherited date is labelled as reference pricing rather than a newly verified retail check.

`npm test` passed all **38 suites** (13 unit/database/maths, 25 browser), including **750 actual practice rounds** across Pack/Prior/Stack Up/Stake/Lowball at **320/390/768/1100/1440px**, plus actual Daily guard runs and Lowball continuation rounds. Mixed successes/failures, practice timeouts, settings, mode continuity, score/count accuracy, repetitions, hidden answers, native-save byte isolation and responsive overflow all passed. The pure deck checks passed eight full cycles with filter changes, boundary avoidance and deterministic extremes. Existing accounts/cloud/Friends SQL ownership, scoring, seeds/snapshot migrations, Daily reset, actual artwork/gems, sharing, keyboard/touch, dialogs and timers passed. The production artifact passed **341 shipped files, 848 local references and 37 parsed scripts**. Final build/check and focused feel/mobile checks cover the last copy, plural-label and Lowball DOM keyboard-order refinements.

The factual banks, regional price values, generated assets, score formulas, save schemas and Supabase SQL are unchanged. Practice totals remain tab-local and are not uploaded as Daily results. No billing, paid gates, trackers or hosting migration were introduced. Historical preview PNGs regenerated by regression tests are restored before commit; actual-play session screenshots are available in `/tmp/br-extended-*-WIDTH.png` for review.

This is engineering and browser validation, not measured human enjoyment, real-device certification, source verification or proof of retention/revenue. Small-group playtesting is the next roadmap stage. The owner's deferred comprehensive content/price/difficulty audit remains before public paid launch. A Git push alone does not establish public deployment.

### Alibi integration — 21 October 2026

Added Alibi as the seventh live game with all seven agreed changes: personal ungraded notes; explicit culprit/truth rules; structurally graded, acyclic, nontrivial cases; short decisive proof plus optional complete reasoning; four untimed first-accusation Daily cases; Changing/fixed-tier Unlimited with real puzzle repeat avoidance; and case-file visuals in the centred shared shell. All 144 cases are distinct under person relabeling and global truth inversion. Exhaustive browser logic, an independent recursive solver and an independent PostgreSQL propagator agree on every answer. The library rebuild is byte-for-byte reproducible. Native score is 0–4 correct and Arcade is correct × 25.

All **42 suites** passed (15 unit/database/maths and 27 browser), including the existing 750-round five-game practice suite. The initial `npm test` pass reached the profile browser test, which still expected six game cards. That test-only expectation was corrected to seven (the six earned legacy achievements remain six), its controlled clock was made robust against millisecond startup drift, and profile plus every remaining browser suite passed against the unchanged production artifact. The updated content inventory also reports Alibi. Production checks pass for **353 shipped files, 1,010 local references and 45 parsed scripts**; static footers and source whitespace checks pass.

New checks cover all sixteen correctness patterns, real completed zeroes, malformed/cyclic snapshots, 400 deterministic Daily dates, logical uniqueness/grade thresholds, private note/selection cloud ordering, immutable cloud completions, read-only profile/achievement, fresh and repeatable additive SQL, raw-save/anonymous/other-user isolation, actual accepted-friend derived-score parity and the exact 120-day window. Full actual Alibi play passes 320/390/768/1100/1440px, note/review/result reload, first accusation, short/full reasoning, clipboard/fallback, Daily/practice separation and retained practice, changing/fixed settings, same-origin tabs, touch, menu/dialog/focus, denied storage and Sydney rollover. Real account-engine tests preserve notes when SQL is missing, upload a second draft edit, restore it in another browser, and retain guest/user isolation.

Actual desktop and phone play/reveal screenshots were inspected at `/tmp/br-alibi-{play,reveal}-WIDTH.png`; historical regression preview PNGs are restored before committing. Original prototype remains archived outside production. Existing game mechanics, artwork/gems, saved results and prices are unchanged. No billing or other game was added. Structural tiers still require human playtesting, and the owner's all-game prelaunch audit remains outstanding. Existing Supabase projects must run **`supabase/alibi.sql` LAST**; it includes Pack/Prior/Laser. Tests do not apply live SQL, and a push alone does not establish public deployment.
