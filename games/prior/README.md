# Prior — early working name

Two historical events: choose the one that happened earlier. Five untimed Daily comparisons, one final choice per pair, with dates, a timeline, year gap, short explanations and reference links revealed after answering. Native score is correct choices out of five; the Arcade score is correct × 20. A completed all-wrong Daily is a real zero. There are no speed bonuses, retries, paid modes, freezes or prizes.

## Daily and Unlimited

Daily uses midnight Australia/Sydney. A versioned seed selects one wider-gap comparison (60–600 years), two medium (12–59) and two close (1–11). The five pairs use ten distinct events, exclude same-year ties and known direct related milestones (for example building/falling of the Berlin Wall), and randomize the earlier side. Gap bands do not guarantee measured human difficulty. The first pair is deliberately a warm-up.

Unlimited is endless free practice with Mixed/Easy/Medium/Hard selection. Mixed cycles the three gap bands. Selection applies to the next pair. Today's Daily events are held out; practice prefers avoiding the previous 40 event IDs and relaxes that window gradually only when a selected gap band has no eligible pair. A shuffled pair deck avoids repetition within its eligible pool. Its active pair, correct/answered totals and best correct run stay in memory when changing modes. Practice never affects Daily, streaks, profile, cloud history or achievements. Only Daily survives reload.

## Event authoring and factual review

`content/prior-events.json` is the authoritative 128-event source, with stable IDs, precise milestone titles, integer AD years, categories, post-answer explanations and HTTPS reference URLs. Run `node scripts/build-prior-events.cjs` to validate and emit `events.js`. The local Content Studio still edits its original three banks; Prior uses this dedicated JSON/generator workflow.

Keep titles free of answer years, and place dates/explanations/references only in the reveal. Same-year events cannot be paired. Distinguish announcements, discoveries, births, releases, specific markets, patents and public openings rather than using an ambiguous unqualified “first.” Add an optional `family` identifier to prevent an obvious direct before/after pairing. Avoid uncertain or approximate years; the Niépce photograph and Gutenberg Bible were excluded for that reason.

Dates and milestone wording were checked during implementation and known historical anchors are regression-tested. **Reference articles were not retrieved in this environment; this is not a claim of independent primary-source verification.** The owner-agreed factual audit remains required before launch. A URL, matching two data files, or a structural test does not prove historical accuracy. The bank is still weighted toward European/US technology and popular culture; broader world-history coverage and human difficulty feedback are useful next content work.

## Saving and integration

`prior-model.js` is the pure version 1 date/event/pair/save/scoring contract. `prior.js` owns actual controls and persistence. `shell.js` supplies the canonical accessible Help/Stats and mode controls. The shared left Menu, title/stats/tools row, reset rail, mode tabs and footer remain intact; the shared optional synthesized sound control is initially off.

Each `break-room:prior:daily:YYYY-MM-DD` entry stores `{version:1,day,phase,round,picks,pairs}`. All five pairs include full event snapshots. The fifth submitted answer counts as completion even before viewing the summary. Phase is `play`, `review` or `summary`; picks are integer side indices, not an asserted score. Browser reload, bank reordering and later event revisions must preserve valid snapshots rather than regenerating questions. Changing the working name must not change the native prefix or rewrite history.

Cloud merge advances by round/review; the first completed cloud result wins regardless of score, and remote data wins equal-stage conflicts. Account activation/import/guest restoration use the existing explicit consent and owner-isolation rules. The prototype's `prior1` data and answer-encoding comparison links are not production records and are left untouched; they are not imported. Copy result uses spoiler-free correctness squares, native/Arcade scores and the real nested route. Comparisons use the site's private opt-in Friends system.

For an existing Supabase project, run **all of `supabase/alibi.sql` last**, after the existing setup/social migrations. It includes current Pack support if that migration was not previously applied. Keep older per-game migrations historical; do not reapply an older allowlist after this update. Fresh projects use updated `setup.sql` then `friends.sql`. The internal SQL parser independently derives completed Prior scores and never returns event snapshots to friends. RLS, revision checks and auth-derived ownership remain in force. Local play works before the SQL update; a failed Prior upload reports the needed file and preserves browser data. No administrator credential belongs in the client.

## Validation

`tests/prior-rules.cjs` checks bank/runtime correspondence, historical anchors, 400 deterministic Daily sets, bands, ties/repetition/related-event exclusions, side distribution, every five-answer correctness pattern, zeroes, malformed snapshots, SQL/JS parity, old-project migration repeatability, native merge ordering, read-only profile records and account isolation.

`tests/prior.cjs` completes actual games at 320/390/768/1100/1440px. It checks hidden dates/references before answering, review/focus, reload and bank-reordering stability, mode independence, exact results, copy/profile integration, zeroes, source links, menus/dialogs, keyboard/touch, same-origin tab synchronization, Sydney rollover and denied-storage/clipboard behavior. Account tests restore real Prior answers on a second browser, exercise missing SQL and guest/account separation. Friend database tests include Prior privacy and the exact comparison window. These checks do not certify live Supabase settings, public deployment, screen readers or physical phones.
