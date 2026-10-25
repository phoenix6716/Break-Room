# Shift Work

Three untimed Daily boards use the approved middle challenge: **Easy 4–5 minimum slides → Steady 6–7 → Tricky 8–9**. Slide office furniture along its long side to move the blue trolley to the right edge of a 6×6 room. Preserve the approved artwork, drag/tap/keyboard controls, centred Stake shell, left menu, shared Sydney reset and ?-only help/stats. No timer, hearts, intro screen or Daily replay.

One committed slide is one move, regardless of distance. Arrow keys preview distance, Enter commits and Escape cancels; numbered slide buttons provide a keyboard/tap alternative to dragging. Undo restores the layout but retains moves. Restart clears the unsolved layout/moves/trace while retaining hints. Hints suggest a shortest next slide and cap that board at 75. First solve locks; the third solve counts before final Next.

Board Arcade score = round(min(100, minimum/moves ×100)), capped at75 with any hints. Daily Arcade score = round(mean of the three integer board scores), higher is better. Native total moves remains alongside it, lower is better. Header/extended best, averages and Friends use Arcade credit; profile native best uses the minimum. Smooth shift requires all three minimum solutions without hints.

## Frozen deck and practice
content/shift-work-boards.json is authoritative. Its 180 distinct starting layouts contain 40 Easy Daily boards (4–5 moves), 40 Steady (6–7), 40 Tricky (8–9), 20 optional sparse Starter boards (2–3) and 40 optional Hard boards (10–21). The 120 Daily IDs cycle across 40 Sydney dates from 25 October 2026, each ID appearing once before repeating. Selection is independent of source-array order. This provides more than a month of Daily content from any start date.

Unlimited defaults to Easy, with Starter/Easy/Medium/Hard/Mixed settings applied next board. Its 177 eligible IDs exclude today's three. Eligible IDs do not repeat within the chosen pool until exhaustion. Practice is free, owner-scoped and tab-local; it never creates Daily, profile or cloud records.

scripts/build-shift-work-boards.cjs reproduces browser boards and exact JS/SQL validation catalogs. Every minimum is independently BFS checked and solutions replay through real collision rules. V1 IDs/layouts/minima/catalog entries are frozen: future versions must preserve old records. Solver depth and layout uniqueness do not certify human difficulty, variety or enjoyment.

## State and compatibility
shift-work-model.js is pure, with no DOM or storage writes. Official version1 Daily keys: break-room:shift-work:daily:YYYY-MM-DD. Runs snapshot boards, current positions/moves/hints, action trace/Undo stack, first-solve results and monotonic edits. Actions are [pieceIndex,distance]; [-1,0] is Undo. Records reconstruct legal moves against the exact frozen catalog and date's Daily IDs; claimed score fields do not create credit. Saved presentation metadata is also validated.

The trace budget is 2,000 actions per board. Restart clears an unsolved trace while retaining hints. Immediate saves, cross-tab advancement/first completions, account ownership guards, corrupt-entry preservation and memory-only warnings are required. Reset uses daily-clock.js at midnight Australia/Sydney including DST. Practice is break-room:shift-work:practice:OWNER in sessionStorage.

The approved standalone prototype remains on prototype-shift-work under game-drafts/shift-work. Its keys, test replays, results and snapshots are not imported. All previous games' saves, scoring and artwork remain supported. No fake sound, telemetry, purchases or new processor.

## Cloud, Friends and release
Apply supabase/shift-work.sql after setup/Friends/Hidden Gem. Fresh install: setup.sql → friends.sql → hidden-gem.sql → shift-work.sql. It adds only private shift_work_saves, ownership RLS, revision-checked save_shift_work, private replay helpers and authenticated shift_work_friend_scores. Legacy and Hidden Gem tables/functions remain unchanged. Raw reads are owner-only and direct writes are revoked; private helpers have empty search paths and browser execution revoked.

Only user_id/game/date/Arcade score reaches self or accepted, unblocked, explicitly sharing friends within the common 120-day Sydney window. Raw layouts/moves stay private. This is reliable private backup/comparison, not public anti-cheat certification.

tests/shift-work-rules.cjs verifies all 180 minima, 40-day rotation, 177-board practice/refill, move evidence, hinted/perfect/zero scores, first cloud completions, read-only native profile, real PostgreSQL parity, revisions/RLS/private sharing and unchanged legacy functions. tests/shift-work.cjs covers five widths, real controls/full Daily, locks, reload/modes, hints, practice, profile/shelf/share, dialogs, corrupt/denied storage, tabs and rollover. Affected account/device/Friends/profile/navigation checks also run. Verify live SQL and Pages independently; tests do not configure email, callbacks or SMTP. Physical-device/assistive-technology testing and continued human calibration remain launch followups.
