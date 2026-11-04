# Sleeper source-based authoring (work in progress)

The active bank remains revision 15 until a complete reviewed replacement passes export. Imported source records and `.artifacts/sleeper-candidates/` are **candidates**, never an answer-coverage claim.

## Sources and reproducibility

Install `requirements.txt` in an isolated Python environment. Download WordNet with NLTK to a chosen data directory. The import entry point accepts the GeoNames `cities5000.zip`, a validated Wikidata film-label response, batched film facts, and completed GBIF captures. `sources.json` records the raw/normalised/compressed hashes, licences and source identities. Normalised source snapshots are versioned with the content. No API credentials or paid online judge are required.

- `import_sources.py --nltk-data DIR --geonames ZIP --films JSON --film-facts DIR [--film-facts DIR] [--film-seeds JSON] [--gbif DIR]` imports independently sourced concepts. GBIF accepted species lacking a parseable canonical name are quarantined.
- `fetch_wikidata.py --query FILE --out FILE` validates complete SPARQL JSON before writing. `--facts-for LABEL_JSON --out DIR` collects frozen type, genre, date and sitelink evidence in resumable batches. HTTP 200 is insufficient: the service can append a timeout to a truncated JSON result.
- `fetch_gbif.py --name TAXON --rank CLASS --out DIR` requires a unique exact accepted root and checks contiguous source coverage. `--start OFFSET --page-size 100` can resume with smaller pages after a truncated response. Never turn scientific-name synonyms into extra species.
- `import_usda.py --zip ZIP --database TEMP_SQLITE` imports the October 2026 public-domain branded-food release. It merges historical records for the same UPC/market, excludes discontinued records and turns package sizes/counts into aliases. Brand-owner corporate names must not be fabricated into product names. Actual distinct named products may be eligible only where the prompt/scope permits them; they are not automatically distinct generic foods.
- `import_onet.py --zip ZIP` imports O*NET 31.0 occupation groups, work activities and software. Its 57,000-plus alternate job titles are aliases of 1,016 source occupation groups, not 57,000 canonical jobs. Work-context ratings describe work conditions, not game-answer popularity.

`licenses/` contains required notices. Wordfreq-derived frequency fields are CC BY-SA 4.0; credit Robyn Speer and every source credited in its NOTICE. They are estimates of language familiarity, not measured player-answer frequencies or a 2026 survey. USDA is CC0; GeoNames, Catalogue of Life/GBIF and O*NET are CC BY 4.0; Wikidata structured data is CC0; WordNet has its included Princeton licence.

## Candidate membership

Edit `question-selections.json`, then run `python scripts/sleeper-data/build_candidates.py`. It writes traceable candidate pools and a per-question report outside the published site. Merge synonym-connected concepts before counting. Preserve all source IDs through unions. Literal hierarchy membership cannot establish a narrower property: a botanical herb is not necessarily a cooking herb; a worker role is not necessarily a job; an animal body part is not necessarily human or paired.

Familiar answers are independent acceptance probes. Import size cannot excuse a missing straightforward answer. Root selections and broad product categories need membership review, including negative cases and samples of the uncommon end. Wording changes need fresh accessibility and overlap reviews. Do not pad lists with package sizes, spelling variants, invented recipes or unrelated source records.

## Reviewed publication

Prepare `content/sleeper-data/release.json` only after all questions have reviewed source documents with explicit contextual points and aliases. It identifies each reviewed file by SHA-256, familiar low-scoring starting answers, less-obvious anchors, the complete rotation and conflicting pairs. Source documents use `sleeper-bank-v1` and retain per-answer `sourceIds`. The generated immutable file ID is the exact UTF-8 SHA-256, including any final newline.

Run the existing `node scripts/build-hidden-gem-questions.cjs` workflow. Without a reviewed release descriptor it regenerates revision 15. With a descriptor it calls `build-hidden-gem-catalogues.cjs`, which refuses partial sets, lists below 300 canonical answers, alias collisions, missing ratings/provenance, compressed score distributions, leaked scope answers, missing familiar footholds and adjacent conflicting prompts. `--check` verifies generated output without writing. No candidate is automatically promoted.

The export produces a small manifest, hash-addressed static answer files and repeatable private registry imports. Never delete old immutable answer files or overwrite an existing hash. Publish the verified server registry **before** the frontend starts capturing its references. Apply `supabase/hidden-gem-catalogues.sql` after the existing Sleeper setup, and seed child answers/forms before inserting the sealing header. No account-history rows need rewriting. Existing full snapshots use their original validators, matcher and scores. Compact completed captures retain receipts; the server independently checks those against its trusted versioned registry.

## Focused verification

Regenerate the model and SQL with `build-hidden-gem-model.cjs` and `build-hidden-gem-sql.cjs`. Run the new bank model, database, authoring, source and browser checks alongside existing Sleeper, profile and cloud checks. The browser fixture explicitly labels its 20,000 answers synthetic; none ships as game content. It checks first-load failures, hash integrity, original saved deadlines, Daily/Unlimited, cached restoration and bounded searchable result rendering at mobile and desktop sizes.

A release is incomplete until **all 240 questions** pass content review and minimum counts, the long rotation passes, server/client parity and legacy save checks pass, deployment succeeds and the live site is verified. Do not report the source inventory or synthetic fixtures as shipped answer counts.
