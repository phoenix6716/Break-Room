# Midnight Arcade — default game template

The current uploaded implementation takes precedence over the historical handover.

## Approved baseline

Keep the current visual styling and header: menu at the left edge, Midnight Arcade centred independently, account link at the right edge. `navigation.js` owns drawer events across all game routes. The drawer is mounted under `body` so a header stacking context cannot put it beneath the backdrop. It supports close-button, outside-click, Escape, keyboard focus containment, and focus restoration.

Lowball and Stake own separate engines. Lowball is already integrated through its iframe and keeps its custom artwork and region selector. Stake is implemented directly in its route. Neither should run the placeholder lifecycle controller.

## Placeholder pages are the default layout guide

The pages for Pixel Pairs, Word Forge, Gridlock, Number Drop, Memory Lane, and Mystery Cabinet are deliberately retained as the starting layout for future games. They show **Coming soon** until a real game is integrated. Help panels show the planned mechanics. Stats are clearly empty previews.

Preserved layout sections include:

- Shared header and drawer.
- Game title, description, help and statistics buttons.
- Daily/Unlimited control placement, stats strip, and round indicators.
- Central `interchange-card` with ready, playing, results, and already-played sections.
- Footer and game-specific help/statistics panels.

Do not mistake the hidden lifecycle sections for working engines. `game.js` currently sets availability and disables attempts; it never generates a demonstration score. Old local demo records do not override coming-soon availability. The generic `game.html` shell also previews this state, and `?id=lowball` or `?id=stake` routes to the implemented game.

## Integrating a new game

1. Copy one of the placeholder routes, retaining the approved outer layout and shared navigation script.
2. Give it a unique registry entry and route. Keep `status: 'coming-soon'` until its engine is ready.
3. Implement the central gameplay and transitions for ready, playing, results, and already played. Wire controls to actual mechanics and scoring. Replace the disabled availability controller only for the new implemented game.
4. Set up its real round count, modes, statistics, and saved progress. Use `window.MIDNIGHT_ARCADE_CLOCK` from `daily-clock.js` for the shared midnight Australia/Sydney boundary; do not introduce a device-local or separate per-game daily reset. Remove template-only preview labels once backed by working behavior. Do not inherit Lowball's region control.
5. Update the homepage card with game-specific art and accurate scoring/mode details, and change its coming-soon status only when it is playable.
6. Extend `tests/smoke.cjs` with meaningful start, input, completion, refresh/resume, repeat attempt, keyboard, and narrow-screen checks.

Current local storage is browser-specific and editable. Shared accounts, competitive score validation, attempt enforcement, payments, and cross-device statistics require separate backend work. They are not prerequisites for developing these static game pages.
