# Facts and regional price audit

Reviewed **22 October 2026 (Australia/Sydney)** against main commit `87564cac1b06b99db3989fa333d62d8a82047bc6`. Proposed changes are in PR #4; a green PR check is not publication.

## Result

The audit inventories **264 Stake questions, 208 Stack Up sets, 128 Prior events and 400 Lowball regional targets**. It found misleading scopes and unsupported price claims, rather than a widespread failure of the answer keys.

This is a completed inventory-wide screening pass, **not a certificate that every fact and price is launch-ready**. Stable answers/years were compared with retrieved specialist, institutional and secondary references. Much of the evidence is a web search extract rather than a primary document read in full. Incidental explanations and exact measurement conventions still need the specific follow-up below. A search result, the existing data audit and a passing test are different kinds of evidence.

The other five games use fictional puzzles, spelling rules or timing targets. Their existing solver/gameplay tests cover those rules; they do not need invented historical or retail citations.

## Corrections proposed

| Area | Finding | Change and compatibility |
| --- | --- | --- |
| Stake | Rounded light speed stated as an exact answer; “no Rh markers”; unsupported absolute African-elephant record; conventional Roman endpoint; traditional Homer attribution; capsaicin taste/burn distinction; exposed-land scope; football maximum; usual Olympic cycle | Nine wording/explanation overrides for new snapshots and practice. All answer choices and correct-option positions stay the same. The original 164 rows and legacy reconstruction remain frozen. |
| Prior | LEGO patent filing described as a grant; Mendeleev implied to present in person; Space Invaders unveiling conflated with commercial release; Wright flights' location imprecise | Clarify four milestones and link their supporting sources. No year, ID, native score or saved pair changes. |
| Stack Up | Ecuador's inherited 276,841 figure does not match the current stated national total area | Use **256,370 km²** from Ecuador's foreign ministry in the reference and the two affected reveals (`stack-046`, `stack-049`). Card order stays the same. Clarify all 15 book prompts as first book publication in the original language, avoiding an implication that Kafka completed his novels. |
| Lowball | Three stamp targets outdated; Australian iPhone 16 target differs from Apple's list; unsupported global “prices checked” date; 500ml serving named a pint | Four dated target corrections, per-region evidence, truthful estimate labels and Beer (500ml) presentation. Preserve all original item identities, artwork, pool/order, saved scores and unfinished targets. |

Supporting correction sources include [NIST light speed](https://physics.nist.gov/cuu/Constants/Value/c.html), [NHS Blood Donation on RhD](https://www.blood.co.uk/news-and-campaigns/the-donor/latest-stories/what-makes-o-negative-universal/), [Guinness gestation record](https://www.guinnessworldrecords.com/world-records/70491-longest-gestation-period-mammal), [LEGO's application history](https://www.lego.com/en-us/history/articles/d-the-stud-and-tube-principle), [Oxford University Press on Mendeleev's presentation](https://blog.oup.com/2012/03/mendeleev-periodic-table/), [Taito's unveiling account](https://spaceinvaders.jp/whats.html), [the Wright landing site](https://www.nps.gov/places/000/first-flight-landing.htm), and [Ecuador's foreign ministry](https://www.cancilleria.gob.ec/italia/informacion-pais/).

## Lowball: what is actually supported

The baseline has 100 items ×4 countries. All400 target records and their definition problems are in [the regional ledger](content/lowball-price-review.json). The following **13** dated references have sufficiently clear scopes to retain in the game:

| Item | AU | US | UK | CA | Basis |
| --- | ---: | ---: | ---: | ---: | --- |
| AirPods Pro 3 |429 |249 |219 |329 | Apple regular advertised price |
| Spotify Premium |15.99 |12.99 |12.99 |13.99 | Individual, normal monthly price after promotions |
| Domestic stamp |**1.85** |**0.82** |**1.80** |1.44 | Defined local service, weight and single-stamp basis |
| iPhone 16 |**1349** |Open |Open |Open | Apple 128GB unlocked outright, AU only |

Amounts use the column's local currency. Bold values change the inherited target. These are advertised reference amounts checked 22 October, not an assertion about every checkout total: optional extras/delivery and separately added taxes are outside the target. The Canadian 1.44 is a single stamp; a booklet/coil stamp is a different product and rate.

Direct sources: [Apple AU iPhone 16](https://www.apple.com/au/shop/buy-iphone/iphone-16), [Apple AirPods AU](https://www.apple.com/au/shop/buy-airpods/airpods-pro-3), [US](https://www.apple.com/shop/buy-airpods/airpods-pro-3), [UK](https://www.apple.com/uk/shop/buy-airpods/airpods-pro-3), [CA](https://www.apple.com/ca/shop/buy-airpods/airpods-pro-3); [Spotify AU](https://www.spotify.com/au/premium/), [US](https://www.spotify.com/us/premium/), [UK](https://www.spotify.com/uk/premium/), [CA](https://www.spotify.com/ca-en/premium/); [Australia Post](https://auspost.com.au/disruptions-and-updates/pricing-updates/bpr-letter-pricing-update), [USPS](https://store.usps.com/store/product/buy-stamps/us-flag-2026-stamps-S_130104), [Royal Mail](https://www.royalmail.com/sending/uk/1st-class) and [Canada Post](https://www.canadapost-postescanada.ca/cpc/en/support/articles/lettermail/pricing.page).

**387 regional targets remain unresolved:**324 need a defined product/provider,32 need an exact variant,16 need a branch/channel and15 need further country-specific evidence. Examples include a “basic haircut”, unspecified zoo/cinema tickets, “mid-range” wine, a generic LEGO set, iPad/Watch generations and local transport fares. Looking up one arbitrary shop does not validate a national category.

Additional findings are retained as observations rather than silently adopted:
- A US iPhone “from” price can depend on carrier connection.
- Netflix's generic help page returned US prices during other-country searches. It cannot establish four regional prices.
- Disney+ plan names, bundles, regular monthly prices and temporary offers differ by region.
- Nintendo's AU 699.95 launch announcement is superseded by its September 2026 revision to769.95; the game already has the latter.
- Nike variants carry different prices; a rounded110 GBP target is not an exact SKU quote.

The safe implementation uses fresh-Daily corrections from **24 October 2026 Sydney**. Opening a new Daily freezes all four full item/price objects in `pc_progress.items` before the first guess. Existing valid snapshots win; snapshotless drafts keep original baseline targets. Pending receipts, mode switches, cloud transfers and final scores retain their targets. New practice items use dated references while an existing session keeps its already drawn items.

Receipts now say **Reference price** and show only the applicable dated source, or “Game estimate; not independently verified.” The unsupported global date is removed. No pool shrink, artwork replacement, scoring change, native-key change or live SQL update is introduced.

## Factual coverage and limits

[The factual ledger](content/factual-review.json) includes every question/set/event, the checked answer or measurement subjects, review method, crosscheck links and corrections. It deliberately uses “screened” rather than “verified” when the evidence is an extract or exact definitions remain unresolved.

- **Stake:** all 264 prompts/options screened;20 added calculations independently recalculated. No answer-key change proposed. Frozen originals remain usable for old records.
- **Stack Up:** all 208 orders screened; all 74 arithmetic sets independently evaluated, including exact integer cross-multiplication for adjacent fractions. External crosschecks cover30 element subjects,34 countries,27 books,28 movies and48 airports shared with Stake. Country/airport/element numerical values can differ by epoch, scope, reference point and rounding. **Exact-value reconciliation remains open**, even where the five-card rank is stable.
- **Prior:** all 128 event years/milestones received separate searches; no year changes proposed. Distinguish announcement, publication, patent filing, opening and specific release markets. For example, Einstein's special-relativity paper was received in June but published in September; one popular summary conflates those dates. The existing September wording is retained. Ancient or conventional dates are not newly certified by an attractive result snippet.
- **Explanations:** remaining incidental detail checks must be supported by full-page evidence before advertising complete factual verification. The ledger's crosscheck links are an audit trail, not a substitute for reading the relevant passage.

## Remaining launch work, in order

1. Review PR #4, let its final complete CI run pass, merge only after review and confirm the resulting Pages deployment.
2. Define the 387 unresolved Lowball references and retain exact seller/model/portion/region/tax/date evidence. Alternatively, make an explicit product decision to launch Lowball as an estimate-based game; this audit does not make that decision for the owner.
3. Reconcile Stack Up's precise measurement conventions and remaining factual explanation details. Use a coherent dated source; avoid moving saved targets or reinterpreting old answers.
4. Run mixed-skill human playtests and real-device/accessibility checks already listed in [the launch checklist](LAUNCH-CHECKLIST.md). Source accuracy does not establish challenge or enjoyment.

## Validation record

The first implementation commit is `5855d494c23cfc534929a2b5deb03630fed25d6c`; final validation is recorded in the PR description and Actions checks. The managed executor was unavailable, so no local shell/build/test run is claimed. Connector-side JavaScript checks found zero calculation failures across 74 Stack Up sets and20 Stake additions. GitHub Actions provides the authoritative full production-build/unit/PostgreSQL/browser result at the final PR head.

New regression coverage checks legacy Stake option positions, dated price cutover, snapshotless/zero/pending progress, snapshot immutability, whole-record cloud merge, unsafe evidence URLs, five responsive widths, region detail changes, receipt source/date, reload and Daily/Unlimited isolation. Existing suites continue to cover all nine games, scoring parity, old saves and reset behavior. These tests do not verify retail web pages or live Supabase configuration.
