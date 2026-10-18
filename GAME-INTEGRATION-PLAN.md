# INSERT COIN — game integration and scoring plan

## What is in this template
- `game-config.js`: one registry entry per cabinet. Add `id`, `title`, `category`, `description`, `instructions`, `accent`, `status`, `scoreMax`, `attemptsPerDay`, and `engine` here.
- `game.html`: shared game shell and lifecycle states: ready, playing, results, and already played. Each game also has a clean, standalone route at `games/<game-id>/index.html`.
- `game.js`: loads the selected cabinet from `?id=`, manages lifecycle, provides a playable Number Drop example, and stores a demo result.
- `game-flow.css`: reusable lifecycle and playfield styling. Keep the colourful arcade look while game engines own their own internal mechanics.

## Adding a game
1. Add a unique registry entry in `game-config.js`.
2. Set status to `demo` while prototyping, then `live` when the game engine is ready. Use `coming-soon` or `locked` for unavailable cabinets.
3. Implement a game module that mounts into `#engine-slot`, reads the configuration, and reports a final score from 0 to `scoreMax` to the shared lifecycle. Keep the game logic separate from the shared page shell.
4. Create `games/your-id/index.html` from the standalone page pattern, with a unique title and meta description; link the homepage card to `games/your-id/`.
5. Test start, in-progress, win/loss, refresh, repeat attempt, next-day rollover, keyboard, touch and narrow-screen layouts.

## Prioritised implementation plan

### P0 — before public launch (security and correctness)
- Move user identity, attempt records, score validation, streak calculation and daily reset to a backend/database. Browser `localStorage` is editable and only applies to one browser/device; it is a demo guard, not enforcement.
- Define the daily boundary and timezone policy (e.g. UTC or a user-selected IANA timezone), and use the same server-authoritative date for every game.
- Create a unique constraint on `(user_id, game_id, challenge_date)` so only one scored submission can be accepted per user/game/day. Enforce it server-side atomically.
- Validate scores on the server from trusted game results where possible. Never trust a client-submitted score alone for competitive leaderboards.
- Add authentication/session handling, request validation, rate limiting and basic abuse logging before publishing profiles/friends/leaderboards.

### P1 — game engine contract
- Standardise a game module interface: `mount(container, context)`, `start()`, `destroy()`, and `onComplete(result)`; result should include score, duration and optional game-specific stats.
- Define per-game scoring rubrics and difficulty/versioning. Persist the daily challenge seed/config so all players receive a fair challenge.
- Add automated tests for each lifecycle state and attempt edge case.

### P2 — player experience
- Replace sample dashboard numbers with API data and real loading/empty/error states.
- Implement results sharing, streaks, achievements, friends and leaderboard pages from server data.
- Add accessibility checks, reduced-motion support, keyboard controls and mobile device testing.

## Prototype caveats
The current attempt guard and score persistence are local-only, for demonstration. Clearing storage, changing devices, or editing browser data bypasses it. The current Number Drop game is a sample playable engine; Pixel Pairs, Word Forge and Gridlock still need their real game modules. Sample homepage statistics remain illustrative until connected to an API.


## Standalone game pages and search discovery
- The original `index.html` homepage and its visual layout remain the primary arcade menu. Homepage game cards now link to clean per-game URLs such as `/games/lowball/`.
- Standalone game pages keep the game centred and provide a compact menu toggle. The INSERT COIN wordmark links back to the full arcade menu; the expanded menu links to other games, stats, friends, and account pages.
- Each route has its own HTML title and meta description and is indexable. Before launch, add the production domain to a sitemap, configure canonical URLs, verify crawlability, and add Search Console. Search indexing/ranking cannot be guaranteed.
- Lowball currently has a route and registry entry, but its gameplay engine is intentionally marked coming-soon pending integration of the actual Lowball source project.
- These are static prototype routes. For production, use absolute/root-relative paths or configure hosting rewrites carefully, and implement server-side account/attempt/purchase enforcement.
