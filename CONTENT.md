# Content Studio and authoring workflow

These are local development tools, not a public administration page. They help write and review proposals without changing live games, saves, schedules or Supabase data. Current Studio inventory: **264 Stake questions, 368 Stack Up sets (160 familiar defaults +208 optional challenges), 100 Lowball items**.

## Open the studio

From a local checkout with Node 24 and the existing dependencies installed:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run content:studio
```

Open **http://127.0.0.1:9030** on that same machine. In a remote Codex environment, this is a loopback development address, not a public URL; an attached browser/approved port forward is needed to view it, or run it from a downloaded local checkout. `CONTENT_STUDIO_PORT` optionally changes the port. Stop with Ctrl+C.

Choose a game, search the current inventory and select a record to propose a revision, or click **New draft**. The 164 original Stake questions are browse-only because older saves depend on their frozen bank. The Studio uses the current authoritative game data rather than maintaining a second writable question bank.

- **Stake:** category, question, one correct answer, two wrong answers, post-answer explanation. Signed numeric options such as −10 and 10 remain distinct; case/whitespace duplicates are rejected.
- **Stack Up:** five card names in their correct order, five strictly increasing source measurements, measured quantity/units/scope, endpoint labels and post-answer explanation. Card descriptions stay blank. Names are shown in a shuffled-style preview; measurements and explanation stay behind the answer reveal. Review difficulty and ambiguities yourself—strict ordering is not proof a question is hard or well scoped.
- **Lowball:** exact model/size/portion, prices for AU/US/UK/CA, source URLs for all four regions and an existing generated item PNG. To add a new image, generate it consistently with the existing artwork, save it under `games/lowball/engine/icons/generated/`, and reload the inventory. The tool does not generate replacement graphics or fall back to code-drawn icons.

Provide HTTPS factual sources, a real check date and verification notes. Tick the factual-review checkbox **after checking the sources**. Editing fields clears that checkbox. The tool validates structure, source-link format and supplied measurements; it does not visit those URLs or independently certify the facts. For Stack Up, ensure card names themselves do not disclose the requested answer even though descriptions are blank.

**Check draft** displays errors/warnings. **Preview card** and **Reveal answer** separate player-visible information from the answer. **Save local draft** preserves an in-progress proposal under `content/drafts/<UUID>.json`, even if it still has validation errors. **Download JSON** exports it; **Import a draft** opens a downloaded/saved file. Local draft JSON files are git-ignored; intentionally add a reviewed proposal if it should be kept in version control. Unsaved edits prompt before switching records/reloading, and navigation warns before losing edits.

Nothing in this interface writes the live question files, uploads to Supabase, commits, pushes or publishes. There is no hidden public admin role or service key.

## Check and export for review

```sh
npm run content:check
npm run content:report
npm run content:check -- content/drafts/FILE.json
npm run content:check -- content/drafts/FILE.json --reviewed
npm run content:export -- content/drafts/FILE.json
```

The report writes `.artifacts/content-report.json` and `.artifacts/content-report.md`; `npm test` creates this report before the normal checks, so it is included with CI check artifacts. Errors fail the command. Warnings identify review gaps and release risks; they are not silently converted into a claim of verification.

`content:export` requires a complete, explicitly checked proposal (including regional sources for Lowball) and writes `.artifacts/content-review-ID.json`. It is a **review bundle, not a deployable bank or automatic content importer**. Its base fingerprint must match the current inventory, which protects against integrating a stale proposal without comparing newer content. If stale, reload the latest record/new-draft form, reconcile the changes and re-enter/import the reviewed fields against that current baseline; do not blindly replace the fingerprint.

Give the bundle to the maintainer/agent to integrate into the authoritative generator/source and audit, then run the game checks and review the Git diff. The game engines and factual baseline generator remain the publishing sources in this release. A public content CMS, direct website editing and automatic publishing are separate features.

## Sources and compatibility when integrating a proposal

| Game | Current source | Important constraint |
| --- | --- | --- |
| Stake | Frozen 164-row bank in `games/stake/index.html`; sourced additions in `games/stake/questions.js` | Never reorder/remove the frozen prefix or reinterpret legacy picks. New runs store question snapshots. |
| Stack Up | `familiar-stacks.js`/`content/stack-up-familiar.json` generated by `build-familiar-stacks.cjs`; original `stacks.js`; recovery-only `legacy-stacks.js` | Familiar lane-based defaults; old bank optional. Preserve all IDs/snapshots and blank descriptions. |
| Lowball | Frozen `ITEMS` in `games/lowball/engine/index.html`, dated overrides in `reference-prices.js`, explicit `item-art.js` mapping | Keep pool/order/art stable. New Dailies capture all four full item/price snapshots; snapshotless drafts retain baseline targets. Update dated overrides with exact regional evidence. |

`scripts/build-question-banks.py` delegates to `scripts/review-question-banks.cjs` for the reviewed release. This reconciles current reference measurements against the retained puzzle IDs and subject sets; it does not redraw puzzles. The additive Stack Up builder follows the same rule. Integrate new questions deliberately into the authoritative source and audit rather than relying on random regeneration to preserve existing IDs.

The Studio report checks the current structure, duplicate IDs/questions/stacks, known audit answers/order/reference measurements and image/region completeness. The existing question-bank and independent-maths tests remain part of `npm test`. Human fact checking is still needed for new proposals.

Read `FACTS-AND-PRICES-AUDIT.md`, `content/factual-review.json` and `content/lowball-price-review.json` for the completed 22 October 2026 editorial review and evidence limits. From 24 October 2026 Sydney, fresh Lowball Dailies use 400 scoped regional references (345 changed amounts, 55 matches). All 100 original identities/order/art remain intact. Definitions, pack/fee conventions and the check date appear before guessing; evidence links appear afterwards. RRP, offers, base menu listings, dated tariffs and published averages are explicitly identified instead of claiming universal live prices. Captured snapshots and snapshotless old drafts retain their targets. The Studio applies the same dated overlay. Stack Up uses coherent RSC/UNdata conventions, and Prior explanations have per-record checks; source URLs and tests are not blanket primary-document certification.

## Stage a new game

```sh
npm run game:new -- word-ladder "Word Ladder"
```

This copies the canonical Stake-based starter to **`game-drafts/word-ladder/`**, fills its title and adds `IMPLEMENTATION.md`. It refuses invalid slugs/titles and existing game/draft paths. Drafts can be committed to the repository, but the site builder excludes the whole development directory; no homepage entry, fake result, game ID or playable engine is invented.

Serve the repository root for a local preview (for example `python3 -m http.server 8000 --bind 127.0.0.1`) and open `/game-drafts/word-ladder/index.html`. The draft stays two directories deep so shared asset paths work. Read `design/GAME-LAYOUT.md` and the generated checklist. Implement the game, real stats/saves, version-1 Arcade scoring, account/cloud allowlists and private SQL friend scoring, accessibility and full game tests. Once playable, move it into `games/<slug>/`, register metadata/navigation/homepage, remove template notices/noindex and run `npm test` before publishing.

## Verification and boundaries

`tests/content-tools.cjs` covers read-only inventory/audits, factual-review metadata, duplicate/sign handling, legacy and stale-base protection, answer-description leaks, measurement ties, regional prices/art and safe nonpublishing scaffolds. `tests/content-studio.cjs` exercises the actual local server/UI: forms, search, preview/reveal, local save/download, art/region fields, five responsive widths and malformed JSON/CSRF/path boundaries. Its draft directory is temporary, not a game save or production source.

The server binds only loopback, checks Host/Origin and a per-run token for JSON writes, serves an explicit route list and writes draft filenames it generates. Do not expose this local file-writing development server publicly. Studio assets, draft sources and game scaffolds are explicitly forbidden in the published artifact. Public players keep the existing games and account/friend flows.

## Pack: fictional puzzle bank

Pack has 212 fictional weight/usefulness puzzles, separate from the Studio’s three factual-content editors. Its authoritative source is `scripts/build-pack-puzzles.cjs`; run `node scripts/build-pack-puzzles.cjs` to rebuild `games/pack/puzzles.js`. The generator enforces unique exact optima, tier-specific greedy trade-offs and individually feasible items; `tests/pack-rules.cjs` verifies all optima independently in CI. These checks do not establish human difficulty or real-world product weights. Preserve versioned saved snapshots and stable seeds on later revisions; never reset existing Dailies. See `games/pack/README.md`.

## Prior: scoped historical events

Prior’s dedicated source is `content/prior-events.json` (128 events); rebuild its runtime bank with `node scripts/build-prior-events.cjs`. This is separate from the Studio’s original three editors. Use stable IDs and precise milestones, integer AD years, category, post-answer fact and an HTTPS reference. Do not put answer years in titles. Avoid approximate dates, unspecified release markets, conflicting firsts and same-year pairs; group direct related milestones with `family`. Preserve existing run snapshots when correcting data.

The builder checks shape, title years and pair-band coverage. Tests check known historical anchors, deterministic no-repeat/tie-free Dailies and scoring; neither structural validation nor a reference URL proves the date. The completed 22 October editorial review and its limitations are recorded in `content/factual-review.json`. All 128 full explanations were checked, four milestone descriptions clarified, the Japanese Mario explanation corrected to Famicom and 111 links improved. Years/IDs are unchanged; human difficulty review remains distinct from structural checks. Wider world-history coverage would improve the bank’s current Western/technology emphasis. Read `games/prior/README.md`.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/inner-clock.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi scenarios — current contract (v2)

The owner approved real scenarios grounded in incidents, timelines and evidence, plus generated men’s/women’s portraits. Alibi now selects **96 new evidence-dependent visit-reconstruction cases**, 24 per tier. Only the culprit’s account is false; everyone else’s account and the verified records are accurate. The incident window determines the relevant visit. Both records and accounts are necessary, and each case has one complete reconstruction. This supersedes the original abstract false-count rules for **new** cases. Personal notes remain ungraded; four untimed Dailies, first-confirmation finality and correct × 25 Arcade scoring are unchanged.

Eight illustrated portraits were generated as an image atlas and encoded as an optimized WebP; CSS selects a cell. New snapshots store stable, distinct random portrait assignments, unrelated to guilt. Existing original-format drafts/notes/completions/history keep their original rules and scores; new scenarios are available in Unlimited immediately and the next fresh Daily. The frozen 144-case original bank and tests remain outside production. Read `games/alibi/README.md` for exact source, schema, behavior and compatibility.

**Current complete upgrade: run `supabase/inner-clock.sql` LAST.** It includes Alibi scenarios and three-mirror Laser Expert, so earlier per-game updates need not be reapplied. It includes all earlier games and both Alibi parsers. Fresh projects use current setup then Friends; do not reapply old narrower migrations. Personal raw snapshots/notes remain private; Friends expose only completed normalized records through existing sharing controls. Human playtesting and the separately agreed prelaunch audit remain necessary. No billing or other game was enabled.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/inner-clock.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, both Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile/menus/homepage/accounts/Friends include nine playable games; cancelled placeholder cards remain removed. Public billing and prelaunch human/content/device reviews remain deferred.

## Current proposed launch extension

Read `LAUNCH-CONTENT.md` for revised bank counts, the additive generator, exact-fraction Stack Up content, harder final tiers, repeat-free rotation and compatibility rules. The completed factual/price editorial review is in `FACTS-AND-PRICES-AUDIT.md`; arithmetic/solver checks remain distinct from source review and human difficulty calibration.

## Current Alibi and Stack Up player feedback

`PLAYTEST-FEEDBACK.md` supersedes their earlier forced-hard/visit-only defaults. Alibi has 128 new v3 physical-evidence files in `evidence-cases.js`, reproduced by `build-alibi-evidence.cjs`; v1/v2 snapshots retain their rules. Stack Up has 160 familiar defaults and 208 optional challenges, no intro screen and explicit `scoreVersion:2` base points. Its original scores keep their original scale. Use the new audit/source generators and SQL migration documented in the game READMEs; apply `playtest-feedback.sql` after the existing Inner Clock update before deployment.
