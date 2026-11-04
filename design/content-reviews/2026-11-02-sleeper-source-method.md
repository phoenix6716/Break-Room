# Sleeper source-based bank rebuild — research and acceptance gates

Status: source evaluation; the live revision-15 bank has not been replaced by this work yet.

## Primary-source findings

The original Krillion FAQ (https://krillion.io/faq, retrieved 2 November 2026) describes aggregating dictionaries, wiki pages and encyclopedias, then merging and cleaning the result. It describes mechanical familiarity scoring for suitable prompts and LLM assistance plus manual review for other prompts. It does not establish that all rarity scores are live player-submission percentages.

Its privacy page (https://krillion.io/privacy, retrieved 2 November 2026) says free-practice answers are retained to tune scoring. Guest daily answers are checked and discarded; synced completed answers are private account history. These statements support using practice data for tuning, without claiming a measured live population ranking for every answer.

Only methodology pages were inspected. No Krillion answer sheet, prompt bank, branding or scoring data is imported.

## Sleeper workflow

1. Import appropriately licensed, versioned source collections suited to each question.
2. Select actual concepts using semantic relationships and question-specific predicates. Retain provenance for each concept.
3. Merge synonyms, spelling variants and duplicate concepts; aliases never increase the canonical-answer count.
4. Review membership and ordinary familiar answers. Broad source membership alone cannot establish a narrow condition such as being a cooking herb, being paired in humans or wearing a hat.
5. Use corpus familiarity as a labelled estimate, with contextual editorial corrections. Do not claim corpus frequency is a player-answer percentage, or mistake missing corpus coverage for proof of obscurity.
6. Use actual aggregate player evidence only when it is available, appropriately collected and large enough to support the claim. Frozen captured scores remain immutable.
7. Publish only after every active question has at least 300 defensible canonical answers. Broad, well-supported sets should reach tens of thousands where the underlying data supports that size. Narrow finite prompts must be replaced or broadened fairly; no invented filler or artificial spelling inflation.
8. Keep familiar prompts, familiar low-scoring starting answers, five-question gameplay and the long nonrepeating rotation. Preserve every old captured question, rule, result, timer and cloud save.

## Initial source probes

Pinned authoring tools: nltk 3.9.2 and wordfreq 3.1.1. WordNet 3.0 and CMUdict were downloaded using NLTK. Initial semantic-descendant counts before deduplication and question-specific review: animal 3,999; plant 4,487; food 1,527; man-made object 10,505; container 745; clothing 561. These are source inventory counts, not accepted answer counts.

The same probe found only 113 bread concepts, 164 musical-instrument concepts, and 210 CMU names/words beginning with a silent K. A single source cannot meet the floor for those questions; aggregation, further review or a defensible prompt change is required.

WordNet licensing: https://wordnet.princeton.edu/license-and-commercial-use. Preserve its license and copyright notices with redistributed data.

wordfreq code/data attribution: https://github.com/rspeer/wordfreq/blob/master/NOTICE.md. Code is Apache-2.0; included frequency data has CC BY-SA 4.0 and source-specific attribution requirements. Credit Robyn Speer and all applicable source authors. This database is not a 2026 player survey.

GeoNames: https://download.geonames.org/export/dump/readme.txt. CC BY 4.0; preserve attribution and source dates. Population is not a measure of player answer frequency.

Wikidata structured data: https://www.wikidata.org/wiki/Wikidata:Licensing. CC0. Membership and release dates still need validation; a label alone does not prove a question-specific property.

## Technical gates

Current revision 15 embeds full answer lists in every captured round, enforces a 512-answer ceiling and has a 1.99 MB client cloud budget within the 2 MB server limit. Simply raising the ceiling or embedding 20,000-answer lists in saves is insufficient.

The larger-bank implementation must use immutable, versioned reference banks, compact captures and matching/validation that preserve legacy full snapshots. It must load and match large banks responsively on mobile, retain saved deadlines, avoid rendering tens of thousands of result-list elements at once, and verify cloud/server parity before release.
