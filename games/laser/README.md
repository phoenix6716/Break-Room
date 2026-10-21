# Laser — working name

Four untimed Daily optical puzzles: place exactly two diagonal mirrors, then fire the beam from the left-hand entry to a target. The first fire is final for score. A hit earns one solved board; Arcade score is solved × 25, alongside the native 0–4 result. Zero is a valid completed Daily. There are no speed bonuses, purchases or retries that improve a Daily score.

## Boards and controls

The 160-board library is built by `node scripts/build-laser-boards.cjs`: forty each at Warm-up (5×5, two fixed mirrors), Standard (6×6, three fixed), Tricky (6×6, three fixed, two walls), Expert (7×7, four fixed, three walls). A solver rejects boards solved with fewer than two placed mirrors, accepts one to three valid two-mirror solutions and limits solution paths to thirty cells. Standard/Tricky solutions must use at least one fixed mirror and Expert at least two; minimum route lengths also increase. All solutions count, not just the first solver result. These are structural difficulty levels, not measured human difficulty. The library/seed is version 1; do not silently regenerate a changed bank for players mid-Daily. Existing snapshots always win over library/seed changes.

Tap a square to cycle empty → / → backslash → empty. Dark mirrors are fixed; walls are striped and the target is a bullseye. Undo and Clear edit the plan before committing. The grid uses roving keyboard focus: arrows, Home/End (Ctrl for board endpoints), Enter/Space to edit. Controls remain at least 44px at 320/390/768/1100/1440 widths. Beam tracing stops on exit, wall, target or repeated position/direction. The connected SVG reveal is decorative; text reports the actual outcome. Reduced motion shows the final path immediately. Optional real sound uses the common bottom-centred off-by-default control.

After a miss, Retry opens an unscored exploration of the same board. Its mirror edits and fires are never saved over the scored pick. Show one solution demonstrates a valid path, with explicit unchanged-score wording. Players can advance immediately, including during animation. Completed Dailies offer a per-board review of their scored placement and a solution for missed boards. Reopening never plays victory effects again.

Daily uses midnight Australia/Sydney, one board from each level, and snapshots its layouts and placements. Unlimited has Mixed/Warm-up/Standard/Tricky/Expert selection applying to the next board, excludes today's Daily boards, and uses a shuffled eligible deck with repeat avoidance. Its active board, draft, first-fire review and session accuracy/best run survive mode switches within the tab. Practice does not affect Daily/cloud/profile/Friends. Unscored exploration is temporary and resets to the original scored review when changing modes or reloading.

## Save and integration contract

`laser-model.js` is pure: layout/placement validation, exact trace/solver, Daily selection and read-only records. Native prefix `break-room:laser:daily:YYYY-MM-DD` stores `{version:1,edits,day,boards,picks,mirrors,round,phase}`. Four full board snapshots include id/level/n/row/target/fixed mirrors/walls. Picks are two legal placed mirrors, never claimed hit booleans. A monotonic edit counter advances cloud drafts within the same board; scored-review/completed stages still take precedence. Current drafts save on edits; phase is play/review/summary. Fourth first fire completes the Daily before the summary is opened. Reloads, bank reordering and later edits preserve valid snapshots. Same-origin tabs adopt committed results and guard against a stale second scored fire.

Scoring/profile/cloud/Friends/game registry/homepage/drawers include Laser. Existing achievement meanings remain intact; Light work requires four first-fire Daily hits. The common 120-day equal-game average now has six available games. Sharing is spoiler-free; comparisons use existing private opt-in Friends rather than answer-encoding prototype codes. Prototype local keys are not imported or erased. The uploaded original is archived in `design/prototypes/laser/original.html`, outside the production artifact.

Existing Supabase installations run **all of `supabase/alibi-scenarios.sql` LAST**, after setup and Friends. It includes Pack/Prior support, preserves ownership/revision/RLS checks, and independently traces saved boards before returning only completed normalized scores to authorized friends. Never reapply older narrower per-game migrations. Fresh projects run updated setup then Friends. Missing SQL leaves browser saves intact and shows an actionable update message. The code/mocked tests do not apply or verify live SQL. No administrator key belongs in the client.

## Verification

`tests/laser-rules.cjs`: all 160 boards, independent ray checks, exact two-mirror requirements, all sixteen Daily hit/miss patterns, 400 seeded Dailies, malformed snapshots, zeros/partials, stable bank ordering, native cloud merge/profile behavior, actual PostgreSQL/JS parity and repeatable migration/security tests.

`tests/laser.cjs`: full real Daily at five widths, saved drafts/reviews/results, target geometry, immutable retries/solutions, copy/profile integration, practice settings/deck/isolation, keyboard/touch, modal/menu behavior, Sydney rollover, shared tabs, denied storage and manual clipboard fallback. Account tests restore actual Laser drafts on another browser, preserve user isolation and show a missing-migration error. Friends database tests include Laser at the exact comparison-window boundary and test sharing/outsider/blocking behavior.

These checks establish implementation behavior, not long-term player enjoyment, physical-phone usability or calibrated difficulty. Human playtesting is the next game-design gate.
