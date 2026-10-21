# Alibi — current scenario game (v2)

The owner approved replacing the abstract true/false puzzles with small office mysteries grounded in timelines, whereabouts and contradictions. Alibi is still the seventh game: four untimed Daily cases, immutable first confirmed accusations, native 0–4 correct and Arcade correct × 25. Changing/fixed-tier Unlimited remains free and independent.

## Solve an actual incident

Each file describes what happened, where it happened and the interval between the last confirmed check and discovery. A complete anonymous log records four visits (five at Expert), exactly one per suspect and nobody else. Exactly one visit falls strictly inside the incident window. The culprit made that visit.

Suspects give personal accounts of when they visited: a specific time, not a particular time, before/after someone, immediately after someone with nobody in between, or an exact minute gap. Verified timestamp records, camera timing or witness sightings provide additional constraints. **Only the culprit’s account is false; every other account and all verified evidence are accurate.** This is explicit in the case and Help. There is no displayed false-statement count to calculate, and no “someone else’s statement is true” metapuzzles in the new bank. The incident window and the records actually determine the answer.

Before the accusation, the timeline keeps identities unknown. The notebook is entirely personal: mark an assumption true/false/undecided, rule out or restore a suspect, clear notes without clearing selection. Notes never auto-check, reveal contradictions, block an accusation or change scoring. Select then Confirm accusation; the first confirmation is final. Afterwards the log fills with the reconstructed identities, the false alibi is labelled, and a short proof identifies the incident-time visitor. Optional full reasoning checks every possible visitor order for each candidate and shows a reduced set of contradictory records/accounts ruling out alternatives. Continue stays before longer reasoning.

## Case library and difficulty

`node scripts/build-alibi-cases.cjs` deterministically builds `cases.js`: **96 scenarios, 24 per tier**. The twelve fictional incident premises include stolen birthday cake, the emergency biscuit tin, missing stationery, a swapped tea label and an edited office playlist. Locations/times are part of each case, not unused flavour. At least two possible culprits remain without the evidence; at least two remain without the accounts. Every published case has exactly one complete visit order. The same solver underlies reveal and scoring; separate person-to-time enumeration in tests and recursive SQL enumeration independently verify it.

Warm-up uses four visits and direct time accounts. Standard adds before/after relationships. Tricky uses at least three relative/adjacent/gap accounts and at least two essential evidence records. Expert has five people, at least four relative accounts and two evidence records. A reduced sufficient clue set must have at least 3/3/4/5 constraints respectively. These are structural proxies, not measured human difficulty. No timer or speed bonus.

Canonical repeat signatures ignore names, portraits, theme and absolute clock offsets. Gap clues are represented by the slot pairs they actually permit, so changing the written time without changing the deduction does not create an extra logical puzzle. Unlimited excludes today’s logical cases and avoids repeats within an eligible tier until its shuffled pool is exhausted. Current practice case, notes, selected accusation, review, difficulty and session totals survive mode switches in the tab. Saved snapshots, not a mutable current bank, determine history.

## Generated suspect portraits

The owner requested real generated images. `assets/source/coworkers.png` is the original generated eight-person illustration atlas: four men and four women, in a matching warm cream/navy printed illustration style. `assets/coworkers.webp` is its optimized ~310KB web encoding; CSS selects a portrait cell without drawing or changing the artwork. The source PNG is excluded from production. See `assets/README.md`.

Each new case selects a mixed cast and randomly assigns distinct portraits from matching men’s/women’s pools. Portrait indices are saved in the case snapshot, stable across notes, selection, reveal, reload, cloud restore and history. A name is not permanently tied to a portrait. Appearance is never a clue to guilt. Older snapshots get deterministic stable portraits without rewriting their data. Names remain real text next to decorative images.

## Compatibility and storage

Native prefix remains `break-room:alibi:daily:YYYY-MM-DD`, run `{version:1,day,edits,cases,picks,round,phase,selection,notes}`. Scenario snapshots have `version:2`, `id:alibi-v2-level-index`, `n`, `level`, `times`, `window`, `s`, `evidence`, `names`, `portraits`, `crime`, `detail`, `item`, `place`, `visit`. Each account is `[type,person,slot-or-person,gap]`; evidence stores a validated rule plus readable title/detail. Exactly one schedule must satisfy all verified rules and the culprit/innocent account truth conditions. Only snapshot-derived picks determine score; self-reported score/winner fields are ignored.

**Existing original-format Daily drafts, answers, notes, completions and scores are preserved.** Their original `alibi-v1` rules still apply: the displayed exact false count and an independently truthful/lying culprit. The UI clearly labels a resumed original file, and Help distinguishes its rules. Finish that saved set normally; new scenarios appear in Unlimited immediately and in the next fresh Daily. The frozen 144-case bank is retained in `tests/fixtures/alibi-v1-cases.js`, with its reproducible generator `scripts/build-alibi-v1-cases.cjs`, outside production. No automatic migration/reset of player snapshots.

Notes/selection save via the existing monotonic edit counter. Same-origin tabs adopt newer drafts/answers and guard stale actions; completed cloud data is immutable rather than replaced with a higher score. Fourth confirmation completes the Daily even before opening summary. Real zeroes count; partials and practice do not. Profiles, shared seven-game averages, Case closed achievement, Friends, menus and registry retain the existing integration. Sydney-midnight reset, shared dialogs, left menu, canonical centred shell/footer and optional bottom-centred off-by-default real sound remain. Clipboard text is spoiler-free; denied storage/clipboard have visible working fallbacks.

## Database update and security

Existing Supabase projects must run **all of `supabase/alibi-scenarios.sql` LAST**. It includes previous games and both Alibi formats; never reapply older narrower migrations afterwards. Fresh projects run current setup then Friends. This is an owner-applied live-dashboard step, not something local tests perform. The old Alibi SQL can store native v2 saves, but its Friends parser cannot derive their scores until this update.

The new private SQL helper independently reconstructs visits; the original helper continues scoring older snapshots unchanged. RLS, auth-derived ownership, revision checks and accepted/unblocked/opt-in sharing are unchanged. Friends receive only completed bounded normalized results, never raw case files, names, notes or emails. All scoring helpers are revoked from browser roles. No administrator credential belongs in client code.

## Checks and limits

`tests/alibi-scenarios.cjs` covers every new case with an independent solver, evidence/account necessity, canonical uniqueness, meaningful difficulty proxies, random stable portraits, 400 seeded dates, all sixteen correctness patterns, malformed snapshots, v1 continuity, fresh/additive/repeatable PostgreSQL parity and private helper permissions. `tests/alibi-rules.cjs` retains all original 144-case compatibility/security checks.

`tests/alibi.cjs` completes actual new Dailies at 320/390/768/1100/1440, checks generated portrait loading on every card, unknown pre-answer identities, notes/reload/mode persistence, final accusations, short/full reasoning, zeroes/copy/profile, changing/fixed practice/deck/isolation, tabs/touch, menu/dialog/focus, denied storage and Sydney rollover. It also resumes an original draft with notes, finishes its four original cases without replacing snapshots, retains its score on reload and opens new scenario practice. Account and Friends checks retain their real engine/draft/ownership/comparison coverage.

Browser automation and solver checks are not measured enjoyment or real-phone/screen-reader certification. Have real players try the new evidence flow and calibrate difficulty before launch; the owner’s all-game prelaunch audit remains separate. No billing or other collection game is enabled.
