# INSERT COIN — Daily Arcade UI pack

Phone-first static HTML/CSS prototype. No framework, package manager, build step or JavaScript required. Open `index.html` in a browser.

## Files
- `index.html`: home hub, score averages, reset countdown sample and game cards in played, ready and locked states.
- `friends.html`: friend-code form, friends list and score-only daily feed.
- `profile.html`: player identity, lifetime average, per-game averages, best scores, streaks and achievements.
- `login.html`: Google/email login screen.
- `signup.html`: Google/email sign-up screen.
- `game.html`: shared wrapper for individual games.
- `style-guide.html`: palette, score badges, button/input/modal/toast states and empty states.
- `styles.css`: all styling, responsive rules and CSS variables.
- `assets/logo.svg` and `assets/favicon.svg`: logo and browser favicon.
- `assets/icons/`: home, friends, profile, streak, trophy, share, settings, sound-on, sound-off, check, lock, clock and close SVGs.

## Prototype limits
Scores and player data are sample content. The reset countdown is a static sample, not a live timer. Forms, Google sign-in, friend adding, sound and sharing are visual placeholders. Daily attempt limits require backend enforcement; do not collect real passwords before implementing secure authentication.

## Art direction
- Balatro-inspired retro pixel-art UI with a playful, slightly cheeky space-arcade personality.
- Nebula palette colours only: near-black violet surfaces, ice-blue highlights, lavender secondary accents, warm off-white text and coral errors.
- Pixel-style headings, clean sans-serif body copy, square/stepped-feeling corners and crisp pixel-offset borders. No gradients, soft glow, or rounded-card aesthetic.

## Main design tokens
`--bg`, `--bg-raised`, `--panel`, `--panel-deep`, `--line`, `--text`, `--muted`, `--pink`, `--cyan`, `--yellow`, `--green`, `--red`, `--purple`, `--pixel`, `--body`, `--space-1` to `--space-10`, `--radius`, `--tap`, `--content`.


## Game integration
See `GAME-INTEGRATION-PLAN.md` for the registry, shared lifecycle, adding games, and the prioritised production scoring plan. `game.html?id=number-drop` demonstrates the playable sample engine. Attempts are currently local-browser demo records only.


## Standalone game URLs
Each game has its own page under `games/<game-id>/`, for example `games/lowball/`. The homepage/menu remains the primary discovery page; individual game pages use a compact menu and the INSERT COIN wordmark to return home. Each route has unique title and description metadata for search discovery. Lowball's route is prepared, but the actual Lowball engine must still be integrated from its separate project.


## Lowball integration
Lowball is linked from the homepage game grid and opens at `games/lowball/index.html`. Its original price-guessing game runs from `games/lowball/engine/index.html`, with its original custom item/icon assets and region selector retained. The embedded game's colours are overridden to match INSERT COIN's purple, cyan, magenta and yellow palette.
