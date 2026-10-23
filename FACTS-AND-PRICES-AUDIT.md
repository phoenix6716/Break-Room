# Facts and regional price audit

Reviewed **22 October 2026** against main `87564cac1b06b99db3989fa333d62d8a82047bc6`. Changes are proposed in [PR #4](https://github.com/phoenix6716/Break-Room/pull/4); passing PR checks do not publish them.

## Result and limits

Completed editorial review of **264 Stake questions, 208 Stack Up sets, 128 Prior events and 400 Lowball regional targets**. The previous 13-reference/387-unresolved report was an interim result and is superseded by this review.

Evidence quality is recorded rather than overstated: institutional/publisher documents, retailer listings and some indexed extracts or third-party menu/price references. This is a completed content review with corrections, not blanket primary-document certification or a guarantee of perpetual accuracy. Tests establish consistency and compatibility, not factual truth or human enjoyment.

The five other games use fictional puzzles, spelling rules or timing targets; their solver/gameplay tests remain the appropriate engineering checks.

## Factual corrections

- **Stake:** 16 overlays clarify scopes and explanations, including fresh *surface* water at Lake Baikal, typical adult bone count, boiling at standard atmospheric pressure, Beethoven's hearing loss, the Great Red Spot's confirmed observation history, byte/kilobyte distinctions and the original ten wording fixes. Choices and correct-option positions remain unchanged. The original 164 rows and legacy `dayQs(day,164)` reconstruction remain frozen; overlays apply to new snapshots/practice.
- **Stack Up:** reconcile all 30 used elements against RSC fact boxes (melting kelvin at standard pressure, density near room temperature); 34 scalar entries change, including precision reconciliation. Reconcile the 25 used country areas to a coherent UNdata **2023 surface-area** snapshot; 19 entries change. Finland excludes Åland and Argentina excludes Antarctic area. Ecuador **257,217 km²** supersedes the interim ministry-only 256,370 override. Correct six airport field elevations in metadata; distinguish field elevation from weather-station/reference-point or runway-threshold heights. Frankfurt stays **364ft**. All 208 sets retain IDs, subjects and card order; 89 sets receive value, explanation or scope updates. All 74 arithmetic comparisons and 20 Stake arithmetic answers were checked separately. Book prompts specify first book publication in the original language; unused Monsters, Inc. director metadata is corrected to Pete Docter.
- **Prior:** read and crosscheck all 128 full explanations as well as years/milestones. Clarify LEGO patent *filing*, Mendeleev's colleague's presentation, Space Invaders' unveiling and the Wright flights' location. The Japanese Super Mario Bros. explanation now names the **Famicom**, and 111 source links are improved. All years, IDs and saved-pair scoring remain unchanged.

Per-record evidence, methods and explanations are retained in [content/factual-review.json](content/factual-review.json). Measurement sources and territorial conventions are in [content/reference-data.json](content/reference-data.json), with retained puzzle measurements in [content/question-audit.json](content/question-audit.json).

## Lowball: defined dated references

All **100 existing items × four regions** now have a named reference and evidence: **345 changed amounts, 55 unchanged matches, zero inherited regional-definition gaps**. The original 100 identities, order and generated-art mappings remain intact.

Every [regional ledger entry](content/lowball-price-review.json) retains its inherited amount, reviewed amount, upfront definition, evidence URL and check date. The definition identifies the product/model/pack, provider/service or published reference average/offer, with purchase channel and fee/tax qualifications. A Canadian single stamp is distinct from a booklet stamp; a fortnightly gym debit is distinct from a monthly membership; a pack is distinct from one unit.

These are **dated references**, not universal national checkout prices. Some references deliberately use a publisher RRP, listed regular price, advertised starting offer, retailer base menu serving, unit conversion, historical tariff or published average. This is disclosed before guessing. Uber's published city/destination averages replace the unsupported generic 5km assumption; the display says **Uber ride**. Current beer servings display as **Beer** with the regional portion in the detail. Original internal identities and artwork are preserved. Base menu listings retain the published default serving rather than inventing an unsupported size.

The evidence retrieval date is **22 October 2026**; source observation periods are separately stated where relevant (for example the July Big Mac Index, weekly petrol reports and June AirportLink tariff). Search indexing and advertised prices do not guarantee stock, branch participation or today's final checkout total. Recheck volatile references before a public release. Do not represent the whole bank as live prices.

Fresh Dailies use these definitions from **24 October 2026 Sydney**. All four complete item/price objects are captured in `pc_progress.items` before the first guess. Existing valid snapshots remain authoritative, and snapshotless old drafts retain baseline targets. New practice draws use the dated reference model; carrying an existing practice queue does not rewrite its prices. Historical scores, zeroes, pending receipts and cloud saves retain their native meaning.

Product details and the reference-check date appear before guessing; receipts say **Reference price** and provide source links, including the second source where a ticket/popcorn calculation needs it. Historical estimates retain their explicit estimate label.

## Rebuilding and validation

`node scripts/review-question-banks.cjs` reconciles retained measurements without redrawing puzzles at existing IDs. The baseline Python generator and additive Stack Up generator delegate to this reconciliation for the reviewed bank. Prior still builds from `content/prior-events.json`; Lowball runtime and Content Studio share the same reference overlay.

Regression coverage checks frozen Stake options, every regional target/evidence pair, dated cutover and snapshot/cloud compatibility, measurement anchors, Prior explanation consistency and byte-identical reconciliation output. Browser checks cover receipt/region/reload/practice behavior and all nine games at the project's responsive widths.

The managed workspace failed to start during this task, so full Node/PostgreSQL/browser validation runs through GitHub Actions. Confirm the latest PR head's checks before merging; earlier green runs do not validate later commits. No merge or deployment is part of this audit.
