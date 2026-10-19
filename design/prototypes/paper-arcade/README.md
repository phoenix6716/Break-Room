# Midnight Arcade — Stack Up style menu prototype

A separate working main-menu prototype based on the uploaded `stack-up.html`. The current homepage, shared styles, game routes, and game logic are unchanged.

## View

Serve the full repository root with Python's HTTP server, then open `/design/prototypes/paper-arcade/`. The prototype's `index.html` and `menu.css` are isolated from the production homepage. Screenshots are `menu-desktop.png` and `menu-mobile.png`.

## Design choices

- Exact Stack Up palette: warm paper `#f4eddc`, navy `#17263a`, dusty blue `#91c7dc`, lime `#b8d957`, coral `#ee6557`, cream-white `#fffdf5`, with pale purple/yellow panels.
- The same 10px two-layer square grid, Courier New display lettering, system sans-serif body text, compact monospace labels, and offset pixel shadows.
- Notched card/button edges, solid outlines, and two-pixel stepped hover/press states; reduced-motion support.
- A centred text-based brand treatment adapted to the light palette. This does not replace the current website logo.
- The existing mixed menu arrangement: three columns on desktop, two on mobile. Lowball and Stake remain first, Stack Up is shown as the third new-game preview, followed by six coming-soon games.
- One actual Sydney-midnight countdown, reusing the existing shared `daily-clock.js`. Its small coloured strip is decorative, not an elapsed-time indicator.

`stack-up.html` is an unmodified copy of the user upload, retained solely as a linked local game preview. It has not been integrated into the production game registry or aligned with the production game engines. Its existing points, state, and timing behavior are unchanged. Lowball/Stake and account/social links lead to the current website, which retains its current styling.

## Validation

Checked at 320, 390, 768, 900, and 1440 pixel widths using Chromium/Playwright. All nine cards, the six coming-soon states, three game links, centred header branding, live countdown, two/three-column grid, and absence of horizontal overflow were confirmed. There were no failed HTTP resource responses or browser JavaScript errors on the menu. The Stack Up link opens the uploaded game's introduction; the Lowball link reaches the existing game route. No external fonts or package dependencies are required.

## Break Room game template

Open `game-template.html` through the repository's static server. This is an isolated design prototype using Word Forge as sample content, not an implemented word game. It imports the paper menu palette and the real shared Sydney countdown. Production pages and game records are untouched.

The preview selector exposes Ready, Playing, Results, Daily complete and Coming soon. Start / Finish demo navigate sample states; mode and sound controls toggle preview state only. No gameplay or audio engine is connected. Help, stats and menu dialogs support Escape, focus trapping and focus restoration. Copy result shares labelled sample data. Existing account, legal and style-guide link targets are retained (legal pages remain existing placeholders).

Coverage: all IDs from the six current standalone placeholder templates are preserved, including menu/account navigation, title/description/countdown, help/stats buttons, Daily/Unlimited, Streak/Best/Played, item subline, round indicators, artwork/instructions/score/attempt badges, start, game engine panel and demo finish, results/score/message/all games/copy, daily-used score/pick another game, both popup panels and all six extended stats, close/done/back controls, sound/share/exit, legal and footer links. Generic game.html scoring information is represented by the max-score badge and subline.

Browser checks: 320, 390, 768 and 1440px; no horizontal overflow or console/resource errors; sample start/finish flow, all five states, disabled Coming soon, dialogs/menu and restored focus. Screenshots `game-template-*.png` show desktop, mobile, playing, results, daily complete, help and stats.

### Stack Up layout revision

The template now uses the uploaded Stack Up CSS directly (`stack-layout.css`, extracted unchanged) for its header grid, split introduction, instruction rows, artwork, gameplay board, two note cards, and 300px sidebar. `game-template.css` adds the existing template controls and panels. Daily/Unlimited replace Daily/Infinite; Account replaces global points; Start run replaces the two launch buttons; the sidebar uses the universal reset, run score, and original Streak/Best/Played with extended stats instead of Stack Up's timer and leaderboard. Help, menu, sharing, sound, legal links, result and completed states remain available. All IDs from the previous template are retained. The source Stack Up game is untouched.

Rechecked all states, dialogs, menu, mode toggles, focus restoration and overflow at 320, 390, 768 and 1440px with no JavaScript or resource errors. Updated all screenshots to this revision.
