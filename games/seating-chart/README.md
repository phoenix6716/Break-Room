# Seating Chart
Nine active games: Laser → Time Drop → Clue Ladder → Seating Chart → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain archived, with twelve native cloud formats supported.

## Rules and scoring
Five untimed Daily tables have 6 / 7 / 8 / 9 / 10 guests. A = immediate neighbours; N = not neighbours; D = exactly one guest between on the shorter circular path; O = directly opposite (even tables only). First/last seats are neighbours. Rotations and reflections count equally. All optimal seatings earn full credit; a unique hidden order is not required.

Every broken request creates one drama point. Show the minimum before placement, including explicit conflict wording when above zero. Tiers 1–3 allow zero drama; tier 4 varies between zero and one, tier 5 between zero, one and two. No fixed triangle construction. Reveals explain every request with seat numbers and actual separation, keep wedding mishaps, and show one optimal arrangement plus each request's status. Offline exhaustive checks establish the minimum, not a human difficulty rating.

Native history = total drama, lower is better. Table credit = max(0,100 − 20 × (drama − minimum)). Daily Arcade = average of five table credits. Integer internal points = 1,000 − 200 × avoidable, floored at zero; maximum 5,000, Arcade = points / 50. No speed bonus, multiplier, hearts or elimination. Header Best uses maximum Arcade; native profile best uses minimum drama. Perfect host requires five optimal tables; older achievement meanings remain unchanged.

## Frozen content
`content/seating-chart-puzzles.json` has 360 tables, 72 per tier. `scripts/build-seating-chart-puzzles.cjs` reproduces it and `puzzles.js`. The 72 Sydney Daily sets use one table per tier with no repeated IDs before the cycle repeats; epoch 24 October 2026. Names, stories and requests are fictional. This is a finite generated library, not 360 human-authored or independently playtested scenarios. Structural patterns can recur.

Run the generator explicitly when changing the bank; commit both outputs. Never mutate IDs, rules, scores or solution semantics for saved snapshots. Independent brute-force tests exhaust all circular arrangements (fixing rotation/reflection) for every table and record optimal fractions in `.artifacts/seating-chart-solvers.json`. Higher tiers use more guests/requests and varied relationships, but enjoyment and difficulty still need human calibration.

## State, ownership and accessibility
`seating-chart-model.js` owns v1 snapshots under `break-room:seating-chart:daily:YYYY-MM-DD`. Full tables, current seats, selected guest, bounded Undo history, immutable picks, round/phase and monotonic edit count are saved immediately. First reception is final; fifth reception counts before the final Next. Stats/streak derive from dated completed runs. Corrupt saves stay untouched with an explanation; denied storage keeps a visible memory-only warning. Cross-tab changes load before further actions. Account changes block stale-tab writes. Reset uses `daily-clock.js`, midnight Australia/Sydney including DST.

Free Unlimited uses owner-scoped sessionStorage, excludes today's five IDs at selection time, tracks played IDs and refills only after the chosen eligible pool is exhausted. Difficulty applies next table; changing mode or reloading preserves the current practice table. It never contributes to Daily/cloud/profile history. There is no separate Compare rehearsal route; use private Friends.

The circle and original wedding premise sit inside the canonical centred Stake shell. Tap/click or keyboard-select guest then seat; a seated guest can move/swap. Undo/Reset cost nothing before reception. Selection highlights related guests/requests without live answer validation. Rebuilt controls retain keyboard focus, primary seat targets are at least 44px, and instructions use only header ?. Help/stats/drawer retain shared focus/inert/Escape behaviour. No fake audio or monetization controls.

## Integration and release
Existing installations apply `supabase/seating-chart.sql` after Clue Ladder, or latest complete `supabase/inner-clock.sql`. Fresh setup then friends includes all twelve formats. Helpers are invoker functions with empty search paths and browser execute revoked. Scores reconstruct from validated frozen snapshots, with existing revision/auth/RLS and private relationship gates retained. This is private comparison, not anti-cheat certification.

Run focused `npm test` for changes. New suites: `tests/seating-chart-rules.cjs` and `tests/seating-chart.cjs`; account/Friends coverage checks two users/devices and real PostgreSQL-derived comparisons. Browser tests cover 320/390/768/1100/1440px, 356 Unlimited receptions including refill, snapshots, draft/Undo/review restore, locks, copy fallback, blocked storage, corrupt saves, cross-tab edits and Sydney rollover. CI evidence and live database/Pages verification must be reported separately.

Original upload remains `design/prototypes/Seating Chart.html`, excluded from production. No other engine, artwork, save or native score is changed. Real-device and human difficulty testing remain launch checks.
