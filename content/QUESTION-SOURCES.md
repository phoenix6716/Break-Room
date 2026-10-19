# Question expansion and verification

This update adds **100 Stake questions** (164 → 264) and **100 Stack Up sets** (12 → 112). The original twelve Stack Up sets are replaced for new runs with harder, precisely defined comparisons. Existing runs retain their earlier question snapshots.

## What was checked

Every new question/set has an entry in [question-audit.json](question-audit.json). The relevant factual rows and full-download checksums are retained in [reference-data.json](reference-data.json). The question banks are generated reproducibly by `scripts/build-question-banks.py`; they do not make network requests during play.

- Stack Up: every five-item answer order is checked against the stored reference measurements, with no ties. All cards have **empty descriptions** before the answer, including cards recovered from older runs. Quantities/dates/measurements appear only in the post-round explanation.
- Stake: every added answer is checked against the corresponding element, capital, author, release year or independently calculated result. Answer options are distinct; question wording and sorting-set signatures are checked for duplicates.
- Maths: separate expected-answer checks cover all 20 added arithmetic trivia questions and 10 mathematical sorting sets.
- The comparison is explicit: total country area, airport field elevation, signed airport longitude, airport latitude, pure-solid element density near room temperature, standard-pressure melting point, atomic number, original-language complete-book publication year, or US film-release year.

These are curated reference datasets, not a claim that every source entry is infallible. We checked the specific facts used, resolved a detected conflict, and excluded ambiguous material rather than silently treating a data dump as authoritative.

## Factual references accessed

| Reference | Used for | URL |
| --- | --- | --- |
| Periodic Table JSON | Element symbols, atomic numbers, melting points (K), solid density (g/cm³) | https://github.com/Bowserinator/Periodic-Table-JSON/blob/master/PeriodicTableJSON.json |
| mledoze countries | National capitals and area | https://github.com/mledoze/countries/blob/master/countries.json |
| OurAirports export in DataHub airport-codes | Airport locations and field elevations | https://github.com/datasets/airport-codes/blob/master/data/airport-codes.csv |
| mwgg Airports | Independent coordinate cross-check and elevation conflict detection | https://github.com/mwgg/Airports/blob/master/airports.json |
| 100 Best Books | Selected authors and unambiguous complete-book publication years | https://github.com/benoitvallon/100-best-books/blob/master/books.json |
| Vega movie reference table | Selected US film-release years | https://github.com/vega/vega-datasets/blob/main/data/movies.json |

The raw download URLs, retrieval times and SHA-256 hashes are recorded in the source snapshot. The checked-in snapshot contains factual fields only, rather than entire third-party datasets or copied encyclopaedia summaries. Game prompts and explanations are authored for these games.

## Corrections and exclusions

- Removed the old weight/date/size descriptions that disclosed the Stack Up answers. Removed the original broad categories involving variable food portions, animal averages and unspecified journeys from new runs.
- Qualified potentially ambiguous film titles (for example James Cameron’s *Titanic*, the hand-drawn Disney *Lion King*, and Pixar’s *Up*). Novel cards identify the author without giving the date.
- Avoided mixing serial-publication dates with full-book dates. Ambiguous entries such as the source's dates for *War and Peace*, *Ficciones*, *The Book of Disquiet* and *In Search of Lost Time* are **not** used in publication-order sets.
- Excluded country-area comparisons affected by overseas-territory scope, and excluded close pairs where source conventions might affect the result.
- Avoided density ties/near-ties and closely spaced melting points in the 100 additional sets.
- Cross-checked airport coordinates between both airport exports. Quito/SEQM had a stale 9,200-ft elevation in mwgg; the questions use the OurAirports field elevation of **7,841 ft**. The two exports agree on the airport location.
- Clarified existing Stake wording for calcium (an element), cellular ATP production, Mohs hardness, Michelangelo's specific marble *David*, French Polynesia, Naples-style pizza, Greenland sharks and New Zealand's 1893 parliamentary suffrage.

## Saved-run protection

Appending questions changes a seeded shuffle unless the selected questions are frozen. Stack Up now stores five selected question snapshots per Daily run. Version-1 runs are reconstructed against the frozen former twelve-set bank, then upgraded without discarding their progress or penalties. The frozen file is recovery data and is not part of the new playable question pool.

Stake now stores its five shuffled question/option snapshots with the existing bets and picks. Older records without snapshots are reconstructed against the original 164-question pool; their scoring is not reinterpreted against the expanded bank. Dates, daily limits and storage namespaces are retained.

## Validation commands

From the repository root:

```sh
node tests/question-banks.cjs
python3 tests/question-maths.py
ARCADE_TEST_URL=http://127.0.0.1:8011 node tests/question-migrations.cjs
ARCADE_TEST_URL=http://127.0.0.1:8011 node tests/stack-up.cjs
ARCADE_TEST_URL=http://127.0.0.1:8011 node tests/stake-sharing.cjs
ARCADE_TEST_URL=http://127.0.0.1:8011 node tests/homepage-reset.cjs
```

Use the port of the running repository-root static server. The migration tests verify preserved questions/scores after bank reordering and blank descriptions even for older saved runs. The Stack Up suite exercises complete daily/practice runs at four responsive widths, touch/keyboard/drag controls, timeouts, refresh, scoring, sharing and midnight rollover.
