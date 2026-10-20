# Stage 1: five-game playability pass

The pass follows Pack → Prior → Stack Up → Stake → Lowball. Unlimited remains free. The existing Daily rules, score formulas, content banks, generated artwork, native save formats and account/cloud ownership contracts remain intact. Practice improvements are tab-local; they do not award Daily achievements or upload results as Dailies.

## Findings and changes

| Game | Main frustrations found | Implemented improvement |
| --- | --- | --- |
| Pack | Independent random draws could repeat bags immediately; no difficulty choice or session measure; clearing a tentative pack required deselecting everything. | Mixed/Easy/Medium/Hard choice, shuffled eligible pools, usefulness and perfect-pack totals, Clear bag and remaining-capacity text. Mixed cycles the three tiers; usefulness is weighted by the optimum points available in each bag. |
| Prior | Only the immediately previous two events were excluded; difficulty cycled without player control; little sense of improvement across a session. | Difficulty choice, a shuffled pair pool, preferential exclusion of the previous 40 event IDs, accuracy and best correct-run totals. The recency window relaxes gradually if a requested band has no candidate. Dates/facts/references remain post-answer only. |
| Stack Up | Clicking a mode discarded practice progress; random draws could revisit recent stacks; the Enter symbol promised a shortcut that cards did not implement. | Practice retains its stack, order, score and wall-clock deadline across mode switches; topic selection, shuffled pools, cleared/clean session counts, and Enter-to-submit with a card focused. Arrow buttons and dragging remain available. |
| Stake | Practice totals were terse; no topic choice; practice could reveal the active Daily questions. | Topic selection, shuffled eligible question pools, correct-count and bet-weighted accuracy feedback. The current question/bet/deadline are preserved when changing the next topic or switching modes. Native chips and the 30-second timer are unchanged. |
| Lowball | Every return to practice restarted it; Daily draft entry could be lost; practice required completing an entire pool before seeing a final result; duplicate submissions were not explicitly rejected. | Resume practice item/receipt/totals and typed Daily drafts across mode switches; running average/best guess; optional Finish session and New session; unplayed items carry forward; guarded submissions. Help explains the reference-price target and scoring in either direction. Existing artwork, gems, audio and compact sound control remain. |

Pack, Prior, Stack Up and Stake hold out today's actual Daily snapshots when choosing new practice content. Lowball holds today's four items out when preparing a practice session, retaining any already active session snapshot. These are usability/fairness measures, not anti-cheat controls: browser-delivered content is not secret and knowledge naturally carries across days.

Changing difficulty/topic applies to the **next** round. It never silently replaces an active question, bag, sort order, bet or deadline. Session controls explain that totals live in the current tab and are separate from Daily records. The top Streak/Best/Played boxes remain Daily stats. No persistent practice-storage schema, payment gate, tracker or third-party service was added.

## Evidence and acceptance

`tests/extended-play.cjs` runs **30 real practice rounds per game at 320, 390, 768, 1100 and 1440px**: 750 practice rounds, plus actual Daily guard runs and extra Lowball continuation rounds. It includes imperfect results and losses, practice timeouts, next-round settings, mode switches during play/review, keyboard submission, session totals, repetition checks, reference visibility, screenshots and byte-for-byte unchanged Daily records. Earlier focused runs covered the individual games before this combined pass.

`tests/practice-session-rules.cjs` checks eight complete deck cycles, boundary repetition avoidance, filter changes, deterministic random extremes, one-item pools and empty-pool handling. Existing unit/database, responsive, scoring, question-bank, account, cloud, friend, accessibility, artwork, sharing and timer tests remain required through `npm test`.

The engineering acceptance target is playable extended sessions with clear controls and no observed blocking flow, state-loss or layout defects. Automated play and visual review do **not** establish that real players will enjoy a game, retain a subscription or perceive the intended difficulty. The next roadmap stage is small-group playtesting. The previously agreed comprehensive factual/price/difficulty audit and real-device/screen-reader checks remain before public paid launch; this pass does not claim independent verification of the old factual banks or retail estimates.

## Maintenance

`practice-session.js` provides the in-memory deck and accessible control panel; `practice-session.css` provides the shared visual treatment. Keep it separate from `arcade-score.js`, save adapters and SQL. New games should define their practice eligibility and sampling rules explicitly and test mode continuity. Only introduce persistent practice records after specifying ownership, migration and cloud behavior; do not put practice totals into Daily history.
