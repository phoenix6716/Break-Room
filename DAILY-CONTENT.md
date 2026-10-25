# Daily content coverage — 25 October 2026

All ten active games pass **32 consecutive distinct Daily sets**, covering **25 October–25 November 2026 inclusive**: the requested 31 days plus one day of buffer. No question bank, schedule, score, artwork, saved run or gameplay needed changing.

This audit executes the shipped pure selectors and extracts the existing Stack Up / Lowball selectors from their real engine source. It checks complete round counts, unique whole Daily sets (ignoring order), valid bank entries, deterministic selection, duplicate ingredients and duplicate challenge payloads. No browser/game initialization or player storage is used.

## Current inventory

| Game | Shipped content | Verified coverage |
| --- | --- | --- |
| Laser | 248 boards | 32 days without repeating individual boards |
| Time Drop | 330 events | 66 days without repeating individual events |
| Clue Ladder | 300 answers with five clues each | 60 days without repeating individual puzzles |
| Seating Chart | 360 tables | 72 days without repeating individual tables |
| Desk Jam | 180 boards: 120 Daily, 60 additional practice boards | 40 days without repeating individual Daily boards |
| Sleeper | 160 questions / 1,004 answers | 32 days without repeating individual questions |
| Stack Up | 160 familiar Daily stacks + 208 optional challenges | 32 days without repeating individual Daily stacks |
| Pack | 212 bags, including 32 advanced Daily hard bags | 32 days without repeating individual bags |
| Lowball | 100 products with four regional reference prices each | 32 different full Daily sets; products recur |
| Time Sense | Five date-seeded targets per Daily | 32 different full target sets; individual durations recur |

Lowball's 100 products supply **25 days before the item pool cycles**, at four products per day. Over the checked 32 days it uses 100 distinct products in 128 slots. This is enough for different Daily sets, **not a month of entirely new products**. The 400 regional prices are not 400 separate items. Existing product art, order and captured price snapshots are preserved.

Time Sense has no finite question bank or expiry. A five-target combination is the Daily; its short/medium/long durations recur intentionally. Over the primary 32-day window, 85 distinct durations fill 160 slots. This is not a claim of new timing ingredients every day or indefinite collision-free combinations.

## Repeatable check

Run `node tests/daily-content.cjs`.

The check writes `.artifacts/daily-content.json` with the source commit, Sydney date, inventory and exact results. It covers the current Sydney date, the original audit window, a later cycle-boundary window, March 2027 and the February 2028 leap-day window. It also checks the full repeat-free periods listed for the eight puzzle/question games.

CI runs this check when relevant banks, selectors, models, source content or the active shelf change. Pure styling, ordinary game UI copy and documentation changes do not run every game. No browser sessions are needed for this content-availability check.

## Documentation and compatibility limits

This document supersedes older roster/name/content-coverage notes in CONTENT.md and LAUNCH-CONTENT.md. Those notes predate Time Drop, Clue Ladder, Seating Chart, Sleeper and Desk Jam; the old requirement to run all game sessions or wait for a separate publication request is superseded by the owner's focused-check / automatic-publication direction.

Pack's historical cutover-eve holdout uses its legacy source order. Contrary to the older generic bank-reversal statement, this audit does **not** certify that reordering Pack's source array preserves the same future schedule. Keep the canonical source order and existing snapshots; deliberate pool/order changes still need compatibility review. The month of unique Dailies passes in the actual shipped order.

Structural coverage does not reverify factual answers, current retail prices, human challenge or live account configuration. Existing dated price/reference evidence and captured snapshots retain their meanings. Private account/SQL contracts are untouched.
