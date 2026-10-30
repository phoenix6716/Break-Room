## Sleeper offline coverage follow-up — 30 October 2026

The active bank now has 6,315 canonical answers (19–148 per question). All 240 IDs and date slots remain fixed, retaining the 48-day rotation. New canonical answers appear in fresh captures; reviewed aliases can also repair the current unanswered question without changing captured points, previous picks, deadlines or completed history. Offline lookup is finite, with no AI/network answer judge.

## Sleeper replacement — 30 October 2026

Fresh Daily and Unlimited captures use revision 7 exclusively: 240 questions and 5,481 canonical answers (19–148 each). A fixed 48-day cycle starts 30 October 2026, with five distinct topics per day and reviewed overlapping pairs kept off the same and adjacent days, including wraparound. New Dailies unlock at midnight Australia/Sydney, including daylight-saving changes. Previously captured ready, active and completed rounds retain their original snapshots and deadlines. See the [current Sleeper contract](games/hidden-gem/README.md).

# Daily content coverage — 25 October 2026

All ten active games pass **32 consecutive distinct Daily sets**, covering **25 October–25 November 2026 inclusive**: the requested 31 days plus one day of buffer. The no-repeat follow-up expands Lowball and changes Time Sense's target selector. Existing saves, scoring and original artwork remain protected. The new selectors start 26 October, with the 25 October legacy Daily held out at the boundary.

This audit executes the shipped pure selectors and extracts the existing Stack Up / Lowball selectors from their real engine source. It checks complete round counts, unique whole Daily sets (ignoring order), valid bank entries, deterministic selection, duplicate ingredients and duplicate challenge payloads. No browser/game initialization or player storage is used.

## Current inventory

| Game | Shipped content | Verified coverage |
| --- | --- | --- |
| Laser | 248 boards | 32 days without repeating individual boards |
| Time Drop | 330 events | 66 days without repeating individual events |
| Clue Ladder | 300 answers with five clues each | 60 days without repeating individual puzzles |
| Seating Chart | 360 tables | 72 days without repeating individual tables |
| Desk Jam | 180 boards: 120 Daily, 60 additional practice boards | 40 days without repeating individual Daily boards |
| Sleeper | 240 questions / 6315 answers | 48 days without repeating individual questions |
| Stack Up | 160 non-maths Daily stacks + 134 active optional challenges | 32 days without repeating individual Daily stacks |
| Pack | 212 bags, including 32 advanced Daily hard bags | 32 days without repeating individual bags |
| Lowball | 128 products / 512 explicitly scoped regional references | 32 days without repeating individual products |
| Time Sense | 195 scheduled durations across five lanes, at 50ms precision | 39 days without repeating individual targets |

Lowball's fixed 128-product ring supplies four new products per day for 32 days, including across cycle boundaries. The original 100 rows remain the frozen prefix; 28 additions have their own generated artwork and 112 regional references checked 25 October. Regional prices do not count as different products. Saved item/price snapshots always win; old snapshotless drafts use the legacy selector and baseline prices. The ring begins 26 October and places 25 October's held-out products at its end, protecting the launch boundary.

Time Sense's fixed 39-day deck schedules five distinct targets each day, one per duration lane. Exact targets use 50ms increments within 2–12 seconds; half-tenths display with two decimals. Each lane excludes the 25 October legacy target. Earlier dates and saved targets retain v1 behavior. The private Friends helper accepts the same grid without changing scoring, access, sharing or saved data.

No finite pool guarantees forever-new content. These are **rolling-month individual-content guarantees**, superseding the earlier allowance for product/duration reuse. The other eight games' existing banks already meet the stricter requirement.

## Repeatable check

Run `node tests/daily-content.cjs`.

The check writes `.artifacts/daily-content.json` with the source commit, Sydney date, inventory and exact results. It covers the current Sydney date, the original audit window, a later cycle-boundary window, March 2027 and the February 2028 leap-day window. It also checks the full repeat-free periods listed for the all ten games.

CI runs this check when relevant banks, selectors, models, source content or the active shelf change. Pure styling, ordinary game UI copy and documentation changes do not run every game. No browser sessions are needed for this content-availability check.

## Documentation and compatibility limits

This document supersedes older roster/name/content-coverage notes in CONTENT.md and LAUNCH-CONTENT.md. Those notes predate Time Drop, Clue Ladder, Seating Chart, Sleeper and Desk Jam; the old requirement to run all game sessions or wait for a separate publication request is superseded by the owner's focused-check / automatic-publication direction.

Pack's historical cutover-eve holdout uses its legacy source order. Contrary to the older generic bank-reversal statement, this audit does **not** certify that reordering Pack's source array preserves the same future schedule. Keep the canonical source order and existing snapshots; deliberate pool/order changes still need compatibility review. The month of unique Dailies passes in the actual shipped order.

Structural coverage does not reverify factual answers, current retail prices, human challenge or live account configuration. Existing dated price/reference evidence and captured snapshots retain their meanings. The only SQL change accepts valid 50ms target snapshots in the existing private Time Sense score helper; score formulas and access contracts are untouched.

## Live database compatibility

On 25 October 2026, the narrow `time_sense_exact_daily_targets` migration replaced only the private Time Sense score helper. Live verification returned100 for both legacy and new exact-target runs, rejected an invalid25ms target, retained revoked anonymous/authenticated helper access and the empty search path, and confirmed unchanged save/Friends API definitions and enabled save RLS. The security-advisor findings were unchanged. This records database readiness; the frontend's deployment is verified separately by the Pages workflow.

## Player-feedback revision — 26 October 2026

Sleeper, Clue Ladder and Time Drop use editorial bank revision 2. IDs, category/topic slots, era buckets and each date's selected IDs are unchanged; their 32/60/66-day individual-content guarantees still hold. `tests/content-refresh.cjs` compares the archived banks across every possible old/new rolling-month boundary and checks that old frozen Dailies still complete. Existing captured content remains unchanged, so players resuming a run may see an older question. New questions arrive when a fresh run is created.

## Stack Up maths retirement — 26 October 2026

The 160-slot default deck now contains non-maths questions. Eighty replacements retain the same IDs/lanes and exact 32-day calendar assignment, preserving old/new release-boundary uniqueness. The 74 legacy maths challenges are recovery-only, leaving 134 active non-maths Challenge stacks. Captured Dailies retain their original content and scores.
