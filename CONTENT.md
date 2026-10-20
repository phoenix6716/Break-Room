# Content Studio and authoring workflow

These are local development tools, not a public administration page. They help write and review proposals without changing live games, saves, schedules or Supabase data. Current inventory: **264 Stake questions, 112 Stack Up sets, 100 Lowball items**.

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
| Stack Up | `games/stack-up/stacks.js`; recovery-only `legacy-stacks.js` | Preserve IDs and question snapshots; keep descriptions blank. |
| Lowball | `ITEMS` in `games/lowball/engine/index.html`; explicit `item-art.js` mapping | Pool size/order and price changes can change date-seeded items and unfinished guesses. Plan versioned snapshots/releases before integrating changes. |

`scripts/build-question-banks.py` reproducibly generates the **existing audited baseline** from `content/reference-data.json` and writes `content/question-audit.json`. Do not rerun it over independently added questions unless those additions have also been integrated into that generator. Do not edit generated banks and assume later regeneration will preserve the edits.

The Studio report checks the current structure, duplicate IDs/questions/stacks, known audit answers/order/reference measurements and image/region completeness. The existing question-bank and independent-maths tests remain part of `npm test`. Human fact checking is still needed for new proposals.

Current review gaps are explicit: the original 164 Stake questions have no checked-in per-question source audit; 100 Lowball items inherit starting price estimates with no retained local-shop evidence. Lowball's inherited 15 October 2026 display date is not verification newly performed by these tools. Review those prices/models/region scopes before launch. No new factual questions, price values, artwork or check dates were published by this tooling change.

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

Pack has 180 fictional weight/usefulness puzzles, separate from the Studio’s three factual-content editors. Its authoritative source is `scripts/build-pack-puzzles.cjs`; run `node scripts/build-pack-puzzles.cjs` to rebuild `games/pack/puzzles.js`. The generator enforces unique exact optima, tier-specific greedy trade-offs and individually feasible items; `tests/pack-rules.cjs` verifies all optima independently in CI. These checks do not establish human difficulty or real-world product weights. Preserve versioned saved snapshots and stable seeds on later revisions; never reset existing Dailies. See `games/pack/README.md`.
