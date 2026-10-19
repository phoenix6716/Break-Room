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
