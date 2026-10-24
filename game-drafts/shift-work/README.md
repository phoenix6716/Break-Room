# Shift Work — standalone prototype

## Play
Open index.html directly in a browser. Everything is embedded: no installation, server, account, external asset request or internet connection is needed to play. Optional live-site/policy links need internet.

Clear a route for the blue trolley to reach the right edge. Each piece slides only along its long side. One committed slide counts as one move, regardless of distance. Three untimed Daily boards progress Easy → Medium → Hard; final 0–100 score averages their rounded minimum-moves / your-moves × 100 scores. This ratio is a provisional design choice, not a difficulty-adjusted rating. The last solved board counts before final Next. First finish locks until New Daily test.

Drag, or select a piece and use the numbered slide buttons. Keyboard arrows preview a slide; Enter commits, Escape cancels. Undo retains spent moves. Restart restores the starting layout and resets moves, retaining any hint flag. Hints suggest a shortest next slide and cap that board at 75. All scoring remains provisional for playtesting.

Unlimited has Mixed/Easy/Medium/Hard, applies settings next board and preserves independent progress on mode switches/reload. It excludes current Daily IDs. Eligible IDs do not repeat until the selected pool is exhausted. No practice result enters Daily stats. Menu → New Daily test and the final replay button make feedback iterations quick.

30 independently solver-checked starting boards: ten per tier. Easy minima 4–7; Medium 8–11; Hard 12–16. Hard starting states currently reuse two underlying furniture arrangements; this is a test bank, not a varied month-long launch library. The three-board date-based Daily selection can repeat within a month; no launch content guarantee is made. Solver depth does not certify human difficulty or enjoyment.

The file embeds the canonical centred Stake shell, cream grid/navy borders/hard shadows, left menu, Streak/Best/Played, Daily/Unlimited, Sydney reset and ?-only Help/Stats dialogs. All furniture artwork is inline SVG. No sound, hearts, billing, telemetry, fake scores or account links that pretend to sync.

Only br-prototypes:shift-work:v1 is read/written. Up to 30 completed Daily tests are retained. Draft positions, Undo stack, moves, hints, locked results, mode and practice settings save immediately where storage works. Denied storage plays in memory; corrupt data remains untouched. Existing Break Room and Hidden Gem prototype saves are separate. Local-file storage behaviour varies by browser. No official scores, cloud saves or Friends integration.

## Check and iterate
Branch prototype-shift-work, directory game-drafts/shift-work. Edit index.html; it is the authoritative portable source. check.cjs tests the embedded model and actual offline Chromium UI. The branch-only shift-work-prototype.yml workflow runs only these checks and packages the HTML/README plus screenshots. It does not build or deploy the live site or change Supabase.

Checks: independent BFS verifies all 30 minimum slide counts; actual keyboard previews/commit/cancel, drag, numbered controls, Undo/Restart, full Daily and exact scores at 320/390/768/1100/1440; help/drawer focus/inertness; save/refresh/mode isolation; hints and difficulty; copy fallback; immutable finishes; corrupt/denied storage; cross-tab updates; Sydney rollover. Screenshots aid visual review. Real-device drag feel, screen-reader use, variety and human challenge remain playtest questions.

Optional online preview uses raw.githack.com against an immutable commit of this standalone HTML. Downloading and opening index.html is the offline fallback. This is third-party preview hosting, not a Break Room Pages deployment.
