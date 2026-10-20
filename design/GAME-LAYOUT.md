# Break Room game layout standard

**User-approved source: the centred Stake page, after the shared Stack Up reset boxes were added.** Use [`games/_template/index.html`](../games/_template/index.html) for every new game unless the user asks for a different layout. This replaces older prototype/placeholder layouts as the default; it does not change existing production games automatically.

## Layout map

Wide screen (the playing column stays centred on the **viewport**, not the leftover space beside the rail):

```text
┌──────────────────────── shared site header ──────────────────────────┐
│ MENU / left drawer          BREAK ROOM                      ACCOUNT │
└────────────────────────────────────────────────────────────────────┘
               ┌──────────── centred game column ───────────┐  ┌───────────┐
               │ [TITLE]     STREAK | BEST | PLAYED   ?  🏆 │  │ NEXT DAILY│
               │ [description]                              │  │ RESET     │
               ├────────────────────┬───────────────────────┤  │ HH:MM:SS  │
               │       Daily        │       Unlimited       │  │ Same time.│
               └────────────────────┴───────────────────────┘  │ Every game│
                            [progress indicator]                └───────────┘
               ┌────────────────────────────────────────────┐
               │                                            │
               │             [GAME AREA]                    │
               │   Actual game controls / feedback / score  │
               │                                            │
               └────────────────────────────────────────────┘
                            [sound, if used]
```

At widths below 1100px the reset card moves above the modes, aligned right within the centred column. Nothing may overflow or be covered. On phones, title/stats/tools remain in one compact row, the subtitle may hide, mode buttons stay readable and the engine adapts to the available width. Keep the sound control beneath the engine if used. Do not create an asymmetric left-hand playing column or leave sound aligned to the wider site frame.

## Component map

| Area in starter | Placeholder / binding | Keep consistent | Replace for the new game |
| --- | --- | --- | --- |
| Site header and `#game-menu` | Existing navigation | Left Menu drawer, centred brand, account, Escape/focus/backdrop behaviour | Add the real game route when ready |
| `.br-game-heading` | `#game-title`, description | Title left; quick stats centred; ?/trophy right, all in one row | Title, category, one-line description |
| `.quick-stats` | `[data-summary-stat]` | **Streak, Best, Played**, in that order, no invented numbers | Real values and score formatting |
| `.br-mode-tabs` | `[data-game-mode]` | Plain **Daily / Unlimited**, blue selection, keyboard arrows/Home/End | Engine response, Daily/practice rules |
| `#game-progress` | Progress slot | Centred between tabs and playing surface | Actual round count/progress; no universal five-round rule |
| `#game-panel`, `#engine-slot` | Neutral game-area placeholder | Centred surface, navy outlines, hard shadow, responsive fit | Artwork, puzzle/cards/inputs, gameplay actions and states |
| `.br-reset-rail` | `[data-daily-countdown]` | Exact `daily-reset.css` box and shared Sydney-midnight countdown | Nothing per game; region controls only for games that need them |
| `#game-audio-slot` | Optional placeholder | Bottom centre below engine if audio exists | Actual sound toggle, or omit slot entirely |
| `#help-popup` | Objective, instructions | Shared popup appearance, close/Got it, accessible focus | Actual rules and game-specific timing/scoring |
| `#stats-popup` | `[data-detail-stat]` | Extended stats popup and general metrics | Real stats, achievement metric, truthful storage description |
| `#game-results-template` | Result title/score/summary | Reuse panel slot; honest result/share feedback | Real result content and copying, no default fake points |
| Shared site footer | All games / Privacy / Terms / Contact & data help | Static site-level navigation below the game | `npm run legal:sync`; read `LEGAL.md` |

## Fixed visual and interaction rules

- Use the Break Room cream grid, navy ink, hard pixel shadows and restrained blue/lime/yellow/coral palette. Use readable body/question/input text; keep computer-style small labels. The chunky headline style does not belong on long questions.
- The main column is at most **760px**, with equal visual space left/right. On wide screens its width is `min(760px, 100vw - 448px)`, leaving equal side clearances while the independent reset rail uses the right clearance. Keep header, tabs, progress and game surface on that centre line. Do not reintroduce a grid where adding the right rail shifts the game left.
- The reset rail starts level with the game header, 24px beyond the main column on wide screens. The shared card is cream with a 2px navy border, 4px hard shadow, label, monospaced clock and **“Same time. Every game.”** note. It uses midnight **Australia/Sydney**, not each device's local midnight or a fixed 24-hour interval.
- Keep the nav Menu button and left drawer. The user explicitly confirmed they must remain. Use `navigation.js`; do not substitute a dead hamburger icon.
- Daily/Unlimited are modes, not an excuse to inherit Stake's scoring or duration. Retain active runs when switching as appropriate; explain persistence in the real help popup. Time-based engines should use wall-clock deadlines and handle midnight correctly.
- Quick stats must come from real completed records. No fake balance, leaderboard, percentile, sample streak, hidden completion writes or sample share score. Local browser storage is not cross-device account sync.
- Modal background content must be inert; Tab stays inside; Escape/backdrop/close buttons work; focus returns to the opener. Respect reduced motion, visible keyboard focus and touch targets.
- Sound is optional. Do not add a fake toggle or claim audio works when it is not implemented. If present, centre it immediately beneath the game; retain the preference when storage works.
- Use the universal static footer and shared policies; run `npm run legal:sync` when adding a page. Keep it below the game/cloud status, outside the centred playing shell. Do not restore Lowball’s standalone Privacy/Terms/Refunds row or business/provider placeholders. See `LEGAL.md`.
- Use local assets and explicit `index.html` routes, including navigation/share targets, so downloaded copies retain their structure. Do not load Stake's data/engine or old demo state code to obtain a layout.

## Stake-specific content that is intentionally absent

The word Stake, trivia categories/questions, 30-second question clock, 1/2/3-chip bets, win/loss chip bank, circular poker chips, green felt surface, five-question Daily and chip-based final score are all engine-specific. Replace these with the new game's actual design inside the engine slot. Do not interpret the layout map as a requirement that every game have bets, a timer, a green table, four/five rounds, or a 100-point native score. All games now also report a shared 0–100 Arcade score alongside native scores; see `SCORING.md` and `arcade-score.js`.

Lowball's generated products, faceted score gems, till/receipt design and region selector are also game-specific. Existing games keep their approved mechanics/artwork.

## Reuse and verification checklist

Follow the copy/integration steps in [`games/_template/README.md`](../games/_template/README.md). Before calling a new game ready:

1. Replace visible placeholders, document metadata, help and stat labels; remove the template-only note and `noindex` when publishing.
2. Implement the actual engine and all required ready/playing/review/completed/already-played states without demo scores. Keep state in the same engine slot; avoid replacing the site frame.
3. Wire real Daily/Unlimited, scores, persistence, reset, sharing and any optional audio. Handle unavailable storage and failed clipboard actions honestly.
4. Check 320/390/768/1100/1440px at least: centred playing area, no clipped controls or dropdowns, reset rail fits, menus/popups remain accessible. Test long titles/labels/content and reduced motion.
5. Verify a full game, refresh/resume, mode switching, Daily boundary, stats and share text for that engine. Update game registry/homepage/navigation only when the actual game is ready.

## Durable project memory

[`AGENTS.md`](../AGENTS.md) records the user's instruction to use this template for future games. This documentation and the starter are checked into the repository so future work can read them even when the conversation is unavailable. They provide repository memory, not an external/global memory service.
