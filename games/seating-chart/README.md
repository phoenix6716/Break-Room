# Seating Chart

One of the ten launch games. Sleeper remains shelved.

## Rules and scoring
Fresh version-2 Dailies have three untimed tables: Easy (6 guests, tier 1), Medium (8 guests, tier 3), then Hard (10 guests, tier 5). Captured version-1 Dailies retain all five original tables and their original tier labels. A = immediate neighbours; N = not neighbours; D = exactly one guest between on the shorter circular path; O = directly opposite (even tables only). First/last seats are neighbours. Rotations and reflections count equally. All optimal seatings earn full credit; a unique hidden order is not required.

Every broken request creates one drama point. Show the minimum before placement, including explicit conflict wording when above zero. Tiers 1–3 allow zero drama; tier 4 varies between zero and one, tier 5 between zero, one and two. No fixed triangle construction. Reveals explain every request with seat numbers and actual separation, keep wedding mishaps, and show one optimal arrangement plus each request's status. Offline exhaustive checks establish the minimum, not a human difficulty rating.

Native history = total drama, lower is better. Table credit = max(0,100 − 20 × (drama − minimum)). Daily Arcade = average of the captured run’s table credits. Integer internal points = 1,000 − 200 × avoidable, floored at zero; new maximum 3,000, Arcade = points / 30. Version-1 captures retain maximum 5,000 and points / 50. No speed bonus, multiplier, hearts or elimination. Header Best uses maximum Arcade; native profile best uses minimum drama. Perfect host requires every table in the captured Daily to be optimal (three for v2, five for v1); older achievement meanings remain unchanged.

## Frozen content
`content/seating-chart-puzzles.json` has 360 tables, 72 per tier. `scripts/build-seating-chart-puzzles.cjs` reproduces it and `puzzles.js`. The 72 Sydney Daily sets use tiers 1 / 3 / 5 (216 of the existing tables) with no repeated IDs before the cycle repeats; epoch 24 October 2026. Names, stories and requests are fictional. This is a finite generated library, not 360 human-authored or independently playtested scenarios. Structural patterns can recur.

Run the generator explicitly when changing the bank; commit both outputs. Never mutate IDs, rules, scores or solution semantics for saved snapshots. Independent brute-force tests exhaust all circular arrangements (fixing rotation/reflection) for every table and record optimal fractions in `.artifacts/seating-chart-solvers.json`. The Easy/Medium/Hard labels use increasing guest counts and existing tier complexity; higher tiers use more guests/requests and varied relationships, but enjoyment and difficulty still need human calibration.

## State, ownership and accessibility
`seating-chart-model.js` reads v1/v2 snapshots and creates only v2 snapshots under `break-room:seating-chart:daily:YYYY-MM-DD`. Full tables, current seats, selected guest, bounded Undo history, immutable picks, round/phase and monotonic edit count are saved immediately. First reception is final; final reception (third for v2, fifth for v1) counts before the final Next. Stats/streak derive from dated completed runs. Corrupt saves stay untouched with an explanation; denied storage keeps a visible memory-only warning. Cross-tab changes load before further actions. Account changes block stale-tab writes. Reset uses `daily-clock.js`, midnight Australia/Sydney including DST.

Free Unlimited uses owner-scoped sessionStorage, excludes the captured Daily's three or five IDs at selection time, tracks played IDs and refills only after the chosen eligible pool is exhausted. Difficulty applies next table; changing mode or reloading preserves the current practice table. It never contributes to Daily/cloud/profile history. There is no separate Compare rehearsal route; use private Friends.

The circle and original wedding premise sit inside the canonical centred Stake shell. Tap/click or keyboard-select guest then seat; a seated guest can move/swap. Undo/Reset cost nothing before reception. Selection highlights related guests/requests without live answer validation. Rebuilt controls retain keyboard focus, primary seat targets are at least 44px, and instructions use only header ?. Help/stats/drawer retain shared focus/inert/Escape behaviour. No fake audio or monetization controls.

## Integration and release
Existing installations apply `supabase/seating-chart-three.sql` before the v2 frontend. Fresh `friends.sql`, `inner-clock.sql` and `seating-chart.sql` installers include both score formats. The update replaces only the private snapshot score reader, with an empty search path and client execution revoked. Live player rows, the shared revision/auth/RLS write API and private relationship gates remain unchanged. Do not rerun older installers over a current live setup.

The original model/controller/page, cloud merge/profile adapter and SQL are archived in `content/archive/2026-11-05-pre-seating-chart-three/`. Captured cloud versions remain authoritative, even when pending; local attempts from a different version never replace that snapshot. Existing completed results and zeroes are read with their original five-table score scale. Native total drama spans different table counts across versions; Arcade averages provide the common 0–100 comparison.

Run focused `npm test` for changes. New suites: `tests/seating-chart-rules.cjs` and `tests/seating-chart.cjs`; account/Friends coverage checks two users/devices and real PostgreSQL-derived comparisons. Browser tests cover 320/390/768/1100/1440px, 358 Unlimited receptions including refill, snapshots, draft/Undo/review restore, locks, copy fallback, blocked storage, corrupt saves, cross-tab edits and Sydney rollover. CI evidence and live database/Pages verification must be reported separately.

Original upload remains `design/prototypes/Seating Chart.html`, excluded from production. No other engine, artwork, save or native score is changed. Real-device and human difficulty testing remain launch checks.
