# Puzzle challenge update

Fresh Daily schedule: 10 November 2026, midnight Australia/Sydney. Captured attempts, including unfinished rounds, retain their exact boards and original scoring.

- Desk Jam: Steady / Tricky / Hard from the frozen library, at 6–7 / 8–9 / 10–21 minimum slides. Old low/mid/high Daily sets remain valid in both JavaScript and SQL.
- Laser: a precomputed selection favours longer routes and more interactions with fixed mirrors. Existing 2/2/2/3 mirror budgets remain unchanged. Warm-up remains approachable; later tiers have 32 routes. A transition schedule avoids repeats against the preceding 31 days. There is no new browser solver.
- Pack: 120 additive bags, 40 per tier, retain the existing item counts. Value-per-weight, highest-value-first and lightest-first strategies each lose at least 8% / 14% / 20% against the unique optimum, by tier. Scoring remains proportional usefulness; exact packs remain recognised in results.
- Seating Chart: 360 additive tables replace two requests with beside-either-person and numbered stage-side preferences. Request counts remain 4/5/7/9/11; Dailies retain 6/8/10 guests at tiers 1/3/5. Stage seats have visible and accessible labels. Review text identifies actual seats. All new tables have zero-drama witnessed solutions; no extra intentional conflicts are introduced.

## Compatibility and validation

`20261108232113_puzzle_challenge_variety.sql` extends only three private validation helpers. Live application succeeded; save-row counts and payload checksums were identical before and after. Live score readback returned 100 for valid completed new Desk Jam and Seating Chart fixtures. No native save rows, scores, public IDs, visibility choices or moderation data were written.

Checked four-game rule suites, independently solved Pack values and Desk Jam minima, 720 new Seating Chart SQL/JavaScript cost comparisons, complete server score parity, migration idempotence and helper privileges. All ten games pass the 32-day rolling content checks across the transition. Existing four-game phone/desktop browser suites pass, including Seating Chart's 358 practice receptions, legacy snapshots, cross-tab locks and rollover. Added future-round browser checks cover ready/completed states, both themes, 390/1440px, new labels and draft reload. Save, database, leaderboard, integrity, profile and test-selection dependency checks pass.

These are structural difficulty measures, not a measured human difficulty rating. Player feedback should guide further tuning.
