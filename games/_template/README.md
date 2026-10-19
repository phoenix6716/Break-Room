# Canonical new-game starter

This is the **Stake-based layout template requested by the user**. Open `index.html` to see the layout, live shared reset countdown, mode controls, left menu and help/stats popups. The title, engine, progress and scores are deliberately placeholders. It does not contain Stake's trivia logic or write game progress to browser storage.

The visual map and invariants are in [`design/GAME-LAYOUT.md`](../../design/GAME-LAYOUT.md). [`AGENTS.md`](../../AGENTS.md) preserves the user's preference for future repository work.

## Use it for a new game

1. Copy this directory to `games/<new-slug>/`. Keep the same nesting so `../../` assets/links remain valid. Do not publish `_template` as a game or add it to the registry.
2. Replace `[TITLE]`, category/description and the document title; update popup titles, objective, rules and stat bindings. Remove `noindex` and `.br-template-note` when publishing a real game.
3. Replace `#engine-slot` with the actual game. Change the decorative surface label and progress placeholder. Game-specific CSS belongs in a separate local file loaded after `game-shell.css`; preserve the surrounding layout.
4. Keep `template.js` as shell controls (rename it and update the script tag if desired). Load the engine after it. Read `window.BREAK_ROOM_GAME_SHELL.mode` initially and listen for `break-room:mode-change`; `event.detail.mode` is `daily` or `unlimited`. The engine owns saving, seeds, scoring, game timers and completion. Switching the visual tab must not silently discard an in-progress run.
5. Populate `[data-summary-stat]` and `[data-detail-stat]` using real game records. Leave `—` when unavailable. Replace the popup storage note with an accurate description only after storage exists. Change the game-specific achievement label to the correct metric.
6. If useful, clone `#game-results-template` into the engine slot for a real result. Supply the actual title, score and explanation, implement result copying with success/failure feedback, then enable its button. This template never supplies a fake result.
7. Replace `#game-audio-slot` with a working bottom-centred sound toggle if the game has audio; otherwise remove this optional placeholder. Never display an inactive sound control in the live game.
8. Use `MIDNIGHT_ARCADE_CLOCK.dayKey()` for daily keys and `nextResetAt()` for the boundary. Keep `daily-clock.js` and the boxed reset card unchanged. Namespace saved state by the new game slug; do not reuse Stake's storage keys.
9. Once the actual game is ready, add its metadata/route to `game-config.js`, the homepage and navigation where appropriate. Use explicit `games/<slug>/index.html` links. Do not carry over the older generic engine's fake results or placeholder controls.
10. Test layout, mode changes, menus, modal focus, real gameplay, Daily persistence/reset, stats/sharing and any input/timers used by the game. Reference `tests/game-template.cjs` for shell checks; extend with meaningful engine checks.

## Dependencies

- `styles.css`, `game-flow.css`, `break-room.css`: site frame/navigation and palette.
- `game-shell.css`: canonical centred geometry and neutral placeholder surface.
- `daily-reset.css`, `daily-clock.js`: exact shared reset card and Sydney-midnight clock.
- `game-dialog.css`: shared popup visuals.
- `navigation.js`: actual left sidebar, backdrop, focus management and Escape.
- `template.js`: accessible Daily/Unlimited tabs and help/stats dialogs; no game simulation.

Do not import `games/stake/table.css`, `timer.css`, `questions.js`, its inline engine or `game.js` into a new game just to get the layout. Those are legacy/game-specific dependencies. This starter is independent of Stake's mechanics.

## Existing-engine example

`games/stack-up/` applies this shared shell to a real game. It keeps its own engine and saved-state format, moves its live timer/score into the engine area, and uses its existing dialog/mode handlers with the shared visuals and keyboard conventions. When migrating an existing game, adapt those handlers instead of loading duplicate `template.js` handlers over them.
