# Time Sense — integration v1

Approved display name **Time Sense** (25 October 2026), formerly Inner Clock. Internal ID/route `inner-clock`, storage keys, models, SQL, scoring and achievements remain unchanged. Earlier roster and installer descriptions below are historical; see the current ten-game guidance in root AGENTS.md. Prototype archived unchanged at `design/prototypes/inner-clock/original.html`; its comments/hooks are not implementation instructions. No payments or separate Compare-code mode.

## No-repeat Daily release — 26 October 2026

The owner requires no repeated individual targets within a month. Fresh Dailies from 26 October use a frozen 39-day deck: five lanes of 39 durations, one target per lane/day. New targets use 0.05-second steps within 2–12 seconds and display the exact target (for example 5.95s). The cutover-eve targets close the compatibility boundary but are excluded from the new ring. Historical dates retain the v1 generator; existing saved targets always win. Unlimited and the scoring curve are unchanged.

The private Friends score helper accepts the same 50ms target grid as the client. Apply only its tested CREATE OR REPLACE definition from the current installer to existing live projects; do not reapply older full allowlists. No save, table, sharing or RLS migration is required. Current installation guidance is in root AGENTS.md; the older full-installer instructions below predate the current roster.

## Play and scoring

Five blind timing targets, progressing through 2.00–3.95, 4.00–5.95, 6.00–7.95, 8.00–9.95 and 10.00–11.95 seconds (the historical v1 grid ends each lane at .9). Versioned, deterministic Sydney-date generation lives in `inner-clock-model.js`. Press Start then Stop with primary pointer/touch, Space, Enter or assistive click. The measurement uses `performance.now()` captured before DOM/storage work, rounded once to milliseconds. Key holds and synthetic pointer click duplication cannot submit twice. The static dial, reset countdown concealment and lack of running audio/display avoid built-in stopwatch hints. This is an honour-based game, not an anti-cheat competition.

Native result: mean absolute miss in seconds, **lower is better**. Shared round Arcade score: `max(0, 100 × (1 − |elapsed − target| / (0.25 × target)))`. Daily averages all five without intermediate rounding. A 5% miss earns 80, 10% earns 60; 25% or more earns zero. This relative scale avoids unfairly treating the same absolute error identically across very different targets. It is not a calibrated player percentile. Feedback bands: at most 2% IN SYNC, 5% CLOSE, 12.5% DRIFTING, otherwise WIDE. The In sync achievement requires all five within 2%; it does not claim perfect accuracy. Timeout at the 30-second safety limit records elapsed 30,000 ms and zero Arcade credit.

The fifth stopped attempt counts as completion even while its review remains open. First stopped times are final. Switching modes, reload/navigation, losing tab/window visibility/focus or opening Menu/Help/Stats cancels only a running unfinished attempt. It restarts the same target without adding a result; earlier submissions remain immutable. No elapsed time is reconstructed from wall-clock start markers on reload or another device. Sydney midnight starts a fresh Daily and retains history. System-clock jumps do not alter measured elapsed time. Unlimited Mixed/Short/Medium/Long uses shuffled nonrepeating targets, excludes today's Daily durations, applies settings to the next target, preserves practice across mode changes and never writes Daily results.

## Shared contracts

Canonical centred title/stats/tools, independent reset rail, Daily/Unlimited, left Menu, accessible shared dialogs, universal footer and genuine optional off-default result sound bottom-centred. Sound control is disabled while timing. No interval tick changes the DOM until a safety timeout or day rollover. Target disclosures in help are intentional; no exact running time is displayed.

Native key: `break-room:inner-clock:daily:YYYY-MM-DD`. Snapshot `{version:1,day,edits,targets[5],picks[{elapsed,kind}],round,phase,startedAt}`. Ready/running picks length equals round; review/summary equals round+1; summary only after five. Only running has a positive wall-clock startedAt marker. Pure validators reject malformed targets/duplicates/times/phases. Profile reads without writes, shows native means/bests to three decimals and chooses minimum native best; Arcade best remains maximum. Cloud progression outranks edit counts; cancellation and running share a rank and newer edits resolve that tie. First cloud completion wins. Other-game adapters and existing achievement meanings remain intact.

Existing Supabase projects run **all of `supabase/inner-clock.sql` LAST**. It includes every previous game, Alibi scenarios and three-mirror Laser Expert, preserves RLS, private helpers and existing rows, and is repeatable. Fresh projects use current setup then friends. Friends derive completed Arcade scores from targets/times, expose no raw timings or unfinished records, and keep explicit sharing/accepted-peer restrictions. Owner-applied live SQL is separate from tested repository code.

## Validation

`tests/inner-clock-rules.cjs`: 400 dates, independent relative scoring, bounds/timeouts, malformed states, immutable completion and cancellation conflict ordering, native minimum-best and achievement, real PostgreSQL parity, repeatable complete upgrade and RLS/private helper checks.

`tests/inner-clock.cjs`: actual measured input at 320/390/768/1100/1440, full Daily/reload/first stops, interruption, responsive shell, dialogs/drawer, target-range practice/no Daily writes, native profile and copied results, clock jumps, touch/held keys, safety timeout, storage/clipboard failure and Sydney rollover. Existing account suite uploads/restores a real stopped attempt across two devices and retains native data on unapplied SQL; friends database suite includes completed, zero, boundary and future-date Inner Clock records. Full project regression checks protect other games. Real phone/screen-reader testing and human difficulty/enjoyment review remain prelaunch work.
