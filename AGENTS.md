# Break Room project memory

The repository is named Midnight-Arcade, but the current website brand is **Break Room**.

## Canonical layout for future games

The user explicitly selected the current, centred **Stake layout** as the starting point for future added games. This file is durable repository guidance: read it again when adding a game.

- Start from `games/_template/index.html` and read `games/_template/README.md` and `design/GAME-LAYOUT.md`. Use `game-shell.css` and the shared shell controls. Older `game.html`, placeholder-game pages, and `design/prototypes/` are historical references, not the current new-game standard.
- Keep the shared site header: **Menu button opening the left navigation drawer**, centred Break Room brand, account link. The user specifically wants the left menu retained.
- Centre the game on the viewport, independently of the right-hand reset rail. Keep title left, **Streak / Best / Played** centred in that header row, and **? / trophy** tools right. Do not introduce an extra stats row that pushes the game down.
- Keep plain **Daily / Unlimited** mode buttons, centred progress slot, centred playing surface, and the existing responsive geometry. Use `daily-reset.css` for the exact Stack Up reset box and `daily-clock.js` for **midnight Australia/Sydney**, including DST.
- Keep help/stats popup visuals from `game-dialog.css`, keyboard controls, focus trapping/restoration, Escape, and working navigation. A sound control is optional; if a game has actual audio, put its real toggle **bottom centre below the game**. Do not add a fake sound toggle.
- Replace title, description, help rules, engine surface, scoring, progress contents and game-specific stats. Stake's trivia, 30-second question timer, bets, circular poker chips and green felt are **Stake-specific**, not requirements for new games. No fake scores, playable demos or stored Daily completions in an unimplemented template.
- Do not add per-game standalone legal links/disclaimers. The user intends to add universal legal information later.
- Preserve existing Lowball/Stake mechanics, artwork, saved progress and the current production placeholder games unless the user requests changes. The template is a development starting point, not another homepage game.
- Validate at least 320/390/768/1100/1440px, ensure the central game does not shift to make room for the reset box, and check the left menu, popups, real game flow, Daily/Unlimited and saved state as appropriate. Use explicit `index.html` navigation targets so downloaded copies work.

User requests take priority over these defaults. For details, component IDs, responsive placement and the new-game checklist, see `design/GAME-LAYOUT.md`.
