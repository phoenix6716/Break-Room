## Complete bounded Sleeper rosters — 31 October 2026

Revision 8 supersedes the open-ended bank for fresh Daily and Unlimited rounds. It has **240 questions, 7,700 canonical answers, 10–321 per question**, plus reviewed aliases and symbol inputs. Each question names a finite roster, edition, classification or date cutoff. This provides a checkable complete canonical set within that boundary; it does not promise every arbitrary paraphrase or that external classifications never change. Earlier broad examples are replaced where their unrestricted membership cannot be enumerated fairly offline. No online judge or API billing is introduced.

Author `content/hidden-gem-bounded-source.json`: dated factual universes, expected counts, roster fingerprints, explicit question membership, per-answer editorial ratings, provenance and the fixed rotation. Run `node scripts/build-hidden-gem-questions.cjs` to regenerate `content/hidden-gem-questions.json` and `games/hidden-gem/questions.js`. Include every selected canonical member; aliases are not additional answers. Update roster fingerprints with SHA-256 of `JSON.stringify(members)` after a factual edit. Keep scopes short, with no accepted answers disclosed. Ratings are designer estimates, not measured player-popularity data; earlier editorial familiarity estimates and roster-order tie breaking are documented in the source. Independent human difficulty and wording calibration remains outstanding.

The **48-day rotation starts 31 October 2026**, with five distinct topics each day. All 444 marked family/overlap pairs avoid the same and adjacent days, including wraparound. Topics are WORLD, PLACES, SCIENCE, GAMES, WORDS, SPORT, LANDMARKS, CULTURE, SCREEN and ARTS. Dailies unlock at **midnight Australia/Sydney** (13:00 UTC in AEDT, 14:00 UTC in AEST). Already captured Dailies stay captured; the next newly captured day uses revision 8. An unfinished Unlimited question finishes under its captured rules, then draws only revision 8.

Revision 7 is archived in `content/archive/2026-10-31/`. Preserve full old snapshots, completed and zero-point picks, deadlines, scores, cloud keys and first-completion locks. A recovery-only alias correction table retains the previously reviewed pants/jeans fix for unanswered hg7 questions; it never enters the active question pool. Browser and private SQL validators now allow 512 answers, 32 aliases and 240-character names/input. Optional snapshot-owned exact symbol maps handle emoji and symbols, including case-sensitive SI prefixes; old questions without those maps keep their original matching rules. No score formula, account data, public API, RLS, timer or save-version changes.

Existing databases apply the updated **`supabase/hidden-gem-broader-answers.sql` before release**; fresh installs use updated `hidden-gem.sql`. This replaces only private validation/matching/score helpers and preserves their revoked client privileges. The existing 2 MB cloud limit is retained: a 120-day replacement-bank completion fixture is about 1.87 MB. Tests cover all canonical names/aliases/symbols, published roster sizes, generated-file reproducibility, Daily/Unlimited replacement, old captures, PostgreSQL parity, ownership/sharing gates and phone/desktop gameplay.

## Offline Sleeper corrections — 30 October 2026

Sleeper remains offline by owner choice. Its source includes explicit `points` for every answer; preserve existing ratings when adding coverage. The follow-up bank has 6,315 canonical answers across the same 240 questions and 48-day schedule. Only reviewed aliases for a matching canonical name/rating may be added to an unanswered captured question. New canonical answers are for fresh captures. Completed snapshots and scores stay untouched. The first accessible release is archived in `content/archive/2026-10-30-accessible-v1/`.

## Sleeper authoring — revision 7, 30 October 2026

The active source is `content/hidden-gem-accessible-source.json`: 240 broad prompts, explicit aliases, editorial ordering and a fixed 48-day schedule. Run `node scripts/build-hidden-gem-questions.cjs` to emit `content/hidden-gem-questions.json` and `games/hidden-gem/questions.js`. Both generated files must be committed. Review additions for distinct canonical identities, ordinary obvious answers, regional aliases and clear boundaries. Do not inflate counts with synonyms or inflections. All fresh lists must contain at least ten canonical answers (this release has 19–148). Update the source's spacing review when editing categories or the schedule; conflicting pairs cannot share or neighbour a day, including the cycle boundary.

The original 50 examples and scope decisions are mapped in `design/content-reviews/2026-10-30-sleeper.json`. The previous complete bank and selector are archived under `content/archive/2026-10-30/`. Captured questions and saves retain their own rules; the new minimum applies to authoring, never to old save validation. Fixed ratings estimate familiarity, without survey claims. The Studio's original three-game review export does not import Sleeper; integrate through this source/generator workflow.

## Broader Sleeper questions — owner correction, 28 October 2026

Every newly offered Sleeper question must have at least ten canonical answers, preferably more. Revision 5 replaces all 55 undersized sets across SCIENCE, AUSTRALIA, LANGUAGE and EVERYDAY with broader scoped questions. The compass-point, demonstrative and states-of-matter prompts are retired. The bank has 160 questions and 4,722 answers; aliases do not count towards the minimum. Fixed editorial ratings remain 1–100, not popularity measurements.

Preserve all IDs, topics, date slots, timers, scores and full captured snapshots. The prior revision is archived in `content/archive/2026-10-28/hidden-gem-questions.json`; historical two-answer snapshots remain valid in the model and SQL. Enforce the new minimum in source generation and bank tests, not legacy record validators. `design/content-reviews/2026-10-28-sleeper.json` records every replacement and the invalid Oceania alias removal. No SQL migration is needed.

## Stack Up without numerical trivia or time-unit tasks — owner correction, 27 October 2026

The owner explicitly wants to keep ordering films/books by release and historical events by date, while removing maths, number facts and time-unit questions. New Dailies replace 32 weekday/month/duration slots and eight continent-area slots with story, nature, crafting and everyday-process ordering. Keep the other 120 familiar stacks, all 160 IDs, five 32-item lanes and their exact Daily assignments.

Unlimited replaces 105 atomic-number, melting-point, density, area, coordinate and elevation slots with plot, quest, route and process ordering. `content/stack-up-familiar-challenge-topics.json` defines the replacements; `scripts/build-familiar-stacks.cjs` emits them alongside the familiar bank and `content/stack-up-familiar-challenge-audit.json`. The original 208-row `stacks.js` stays frozen; the engine overlays replacements by ID before selecting new practice. Challenge mix remains 134 stacks, Familiar stays 160, and the 74 old NUMBER SENSE stacks stay excluded from every filter.

Do not rewrite captured Dailies or old scoring. `content/archive/2026-10-27/stack-up-familiar-stacks.js` preserves the prior familiar bank. Test every Unlimited filter, 32-day content/date-slot continuity, reproducible source generation and old numerical/time-unit snapshot completion. No SQL update or save reset is required. See `design/content-reviews/2026-10-27-stack-up.json`.

## Broader answer lists — 27 October 2026

Revision 3 integrates the 96 drafted WORLD, SPORT, FILM, BOOKS, GAMES and SPACE slots, with 4013 canonical answers across the full 160-question bank. The other four topics remain unchanged. IDs, topics, calendar slots, 32-day rotation, 30-second deadlines, first-result locks and native/Arcade formulas are unchanged. Existing full snapshots keep their captured questions and ratings. Revision 2 is archived under `content/archive/2026-10-26/`.

Lists can now contain up to 160 canonical answers, including all 151 Kanto Pokemon. Fixed integer ratings remain 1–100; more than 100 answers necessarily share ratings. This supersedes the former distinct-rating-per-answer limit for broad lists. Names for the same identity resolve to one canonical rating; ambiguous aliases are excluded. See `design/content-reviews/2026-10-27-sleeper.json` for scope corrections and editorial limits.

Existing databases apply `supabase/hidden-gem-broader-answers.sql` before publishing: it only widens `_hg_question`'s answer-count bound from 40 to 160 and keeps the helper private. Fresh installs use the updated `hidden-gem.sql`. No user data, tables, policies, sharing gates or score formula changes.

## Stack Up without maths — owner decision, 26 October 2026

The owner finds maths questions boring and repetitive. New Dailies and every Unlimited filter must exclude calculations, fractions, percentages, geometry exercises and unit-conversion drills. Keep ordinary chronological, science, geography and other knowledge ordering. Replace the 64 arithmetic/fraction slots and 16 unit/data-conversion slots with non-maths topics while retaining all 160 IDs, five 32-item lanes and their exact Daily date assignments. The added source is `content/stack-up-familiar-topics.json`, rebuilt by `scripts/build-familiar-stacks.cjs`.

Keep the original 208-set bank and legacy snapshots intact for saved-history compatibility. Its 74 NUMBER SENSE stacks are excluded from all new Unlimited draws and its topic list; 134 non-maths Challenge stacks remain. Existing captured Dailies can still contain retired content and must retain their answers, deadlines, scoring and progress. Do not reset these saves or change native/Arcade formulas. Keep at least 32 days without repeated individual stacks and verify Daily, every practice filter and old-run restoration with Stack Up's affected checks.

## Familiar and contemporary questions — owner feedback, 26 October 2026

Players found some Sleeper, Time Drop and Clue Ladder questions too obscure. Prefer recognisable subjects and approachable wording; add contemporary film, books, games, technology and screen/music culture to Sleeper and Clue Ladder. Time Drop keeps ancient history and its full era range, using better-known milestones rather than minor battles or treaties. Later Clue Ladder clues should give a direct everyday route to the answer. This supersedes older claims that specialist questions and the original banks were already calibrated for players.

Editorial bank revision 2 replaces 44 Sleeper prompts (160 total / 922 answers), 39 Clue Ladder answers and clarifies nine other ladders (300 total), and replaces 38 Time Drop additions (330 total). See `design/content-reviews/2026-10-26.json` for the complete before/after record. The former banks are archived under `content/archive/2026-10-25/`, outside production. All IDs, topic/category slots and Daily assignments stay fixed; Time Drop also preserves each era bucket. Historical ID slugs now identify stable authoring slots, not necessarily the revised subject. Existing saved snapshots, answers, deadlines, scores and archived Prior content remain unchanged. No SQL or save migration.

Keep at least 32 consecutive days without repeated individual content, including across old/new-bank boundaries. Run the three affected game suites and `tests/content-refresh.cjs` / `tests/daily-content.cjs`; do not replay unrelated games. Reference links and automation support review but do not certify that every player knows each answer. Continue calibrating from human playtests.

## Artwork without third-party logos — owner requirement, 25 October 2026

Use generic illustrations for products and services. Do not include third-party logos, wordmarks, recognisable brand marks, branded clothing/packaging patterns or protected medical emblems in images. Keep device backs and packaging labels blank. This applies to future generated artwork and overrides earlier instructions to preserve an image when it contains such marks. Break Room's own identity remains permitted; factual product names in question text are unchanged.

Lowball's visually reviewed replacements are listed in `content/lowball-art-review.json` and sourced from the transparent `items-unbranded.png` atlas. Apply these overrides last when regenerating art with `scripts/extract-lowball-unbranded.cjs`; preserve filenames, item/save identities, prices, rotations and scores. Update the compatibility PNG aliases as well as the generated sprites, and retain the cache version for affected images. Historical source sheets/design previews are unpublished archives and must not be used to restore branded artwork. Automated hashes and decoding checks protect the reviewed files; new illustrations still need visual inspection.

## No repeated Daily ingredients — owner requirement, 25 October 2026

The owner explicitly rejected repeated individual content within the month. All ten active games must provide **32 consecutive days without repeating individual questions, products, boards or target durations**, including repeats hidden under another ID. Different full Daily combinations are not sufficient. Read [DAILY-CONTENT.md](DAILY-CONTENT.md); `node tests/daily-content.cjs` enforces the actual shipped selectors across the release boundary, current/future windows and a leap-day window. This supersedes the earlier Lowball/Time Sense reuse exceptions.

Lowball appends 28 genuinely different products (128 total / four per day) and uses a fixed 32-day ring from 26 October 2026 Sydney. Freeze the original 100 identities/order/base prices and their v1 selector in `content/lowball-original-*.{json,js}`. Existing captured snapshots always win; snapshotless drafts reconstruct the original 100-item selector even after cutover. New authoritative additions/evidence are in `content/lowball-additions.json`; regenerate via `node scripts/build-lowball-additions.cjs`. Preserve original art and numeric scoring. The 112 additional regional references were checked 25 October; upfront scopes distinguish model/pack/channel, preorder, launch RRP, sale and unavailable published references. They are dated reference prices, not universal or live quotes.

Time Sense uses a fixed 39-day duration deck from 26 October, with exact 50ms target steps within the existing 2–12-second range. Show half-tenth targets exactly (5.95s, not 6.0s); preserve v1 targets and old saves. Client/private SQL validators accept the same grid; score formulas, keys, tables, RLS and sharing remain unchanged. Only the private `_friend_inner_clock_score(jsonb,date)` helper needs a narrow live replacement; main code, CI and confirmed deployment are separate milestones.

Both schedules hold out the previous day's individual content to protect 25 October's existing Daily and the release boundary. This is a rolling-month guarantee, not an infinite uniqueness claim; later pool/order changes need deliberate versioned compatibility review. The other eight banks already satisfy it. Current display names: Desk Jam, Sleeper and Time Sense; older roster/installer notes below remain historical.

## Current release: Shift Work — 25 October 2026

Shift Work is the tenth active game, after Seating Chart. Current shelf: Laser, Time Drop, Clue Ladder, Seating Chart, Shift Work, Hidden Gem, Stack Up, Pack, Lowball, Inner Clock. Stake/Prior/Alibi/Bouncer are archived; fourteen native formats remain supported. Older roster counts and complete-installer claims below are historical and superseded.

Three untimed Daily boards keep the approved 4–5 / 6–7 / 8–9-slide challenge. 180 frozen boards provide 40 nonrepeating Daily sets and free Unlimited. Native total moves is lower-is-better; Arcade scores are higher-is-better. First solves lock, third counts immediately, and prototype records remain separate. Read [the full contract](games/shift-work/README.md).

Apply [supabase/shift-work.sql](supabase/shift-work.sql) after setup/Friends/Hidden Gem. Fresh install: setup.sql → friends.sql → hidden-gem.sql → shift-work.sql. Only the game's private table, constrained APIs and private replay helpers are added; older tables/functions remain unchanged. Verify live SQL/configuration/Pages separately from CI. Human/device playtesting remains a launch check.

# Content Studio and authoring workflow

## Current release: Hidden Gem

Hidden Gem is the tenth active game, after Seating Chart. It has five 30-second Daily questions, one input with retries for unlisted answers, individual 1–100 editorial answer ratings, and a five-question average out of 100 for both native and Arcade scores. Its 160 scoped questions / 1,004 answers provide 32 Daily sets and free nonrepeating Unlimited practice. See [the current contract](games/hidden-gem/README.md).

Existing saves and archived games remain supported: thirteen native formats. Apply [supabase/hidden-gem.sql](supabase/hidden-gem.sql) after setup/Friends. This creates only Hidden Gem’s private table/RPCs; the older shared save and Friends functions are unchanged. Fresh installation is setup.sql → friends.sql → hidden-gem.sql. Older roster counts and “complete installer” statements below are historical and superseded for this release. Live database and Pages status must be verified separately from CI.


## Previous release: Seating Chart

Nine active games and twelve supported native cloud formats including archives. Seating Chart adds five untimed Daily seating puzzles, 360 frozen tables / 72 Daily sets, immediate draft saving and free Unlimited. Read [its current contract](games/seating-chart/README.md) for scoring, accessibility, save/schema and verification details. This supersedes older roster counts below; prior game contracts remain compatibility documentation.


## Clue Ladder — owner-approved build, 23 October 2026

Clue Ladder is the eighth active game: Laser → Time Drop → Clue Ladder → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain archived; eleven native save formats are supported. This supersedes older roster counts below.

Five untimed Daily puzzles use five progressively clearer clues. Solves on clue 1 / 2 / 3 / 4 / 5 earn 1,000 / 800 / 600 / 400 / 200 points; unsolved earns zero. Maximum 5,000 native points, Arcade = points / 50. No speed penalty, Daily multiplier, hearts, intro screen or live AI. Preserve the ladder and pixel climber inside the centred Stake shell with ?-only help. Read `games/clue-ladder/README.md`.

The 300 distinct, editorially reviewed familiar answers span eight topics and provide 60 nonrepeating Daily sets, each with five different topics. References and automation do not establish independent primary-source certification or human difficulty calibration. Save input, hints, attempts and frozen puzzle snapshots immediately; first completion wins. Owner-scoped tab-local Unlimited excludes today's five answers, applies topic changes next puzzle and reshuffles after eligible-pool exhaustion.

Existing Time Drop projects apply `supabase/clue-ladder.sql`; updated complete `supabase/inner-clock.sql`, or fresh setup then friends, also includes it. Verify live SQL and deployment separately. Preserve existing saves, scores, artwork and archived routes.


## Time Drop — owner direction, 23 October 2026

Time Drop replaces Prior in the active lineup: Laser → Time Drop → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain shelved with their engines, sources and historical saves preserved. Seven active games; ten supported native save formats including archives.

The owner requested no hearts anywhere in Time Drop, reasonable partial-credit scoring, expanded/balanced content, reliable saves and locked answers, a large ongoing Unlimited mode (never call it Endless), and the canonical Stake layout. Read `games/time-drop/README.md` for the exact 330-event/66-day deck, fixed era-based linear scoring, accepted date ranges, native 5,000-point / Arcade 100-point scales for new five-round Dailies (version 2); original ten-round version 1 saves retain their 10,000-point scale, first-lock saves and tab-owned practice. Preserve Prior's source and legacy results rather than reinterpreting them. Keep the original uploaded prototype outside the production artifact.

Existing live projects apply `supabase/time-drop.sql` after the current Inner Clock/player-feedback migration. For an already-enabled Time Drop project, apply `supabase/time-drop-five-rounds.sql` to support both run lengths. Updated `supabase/inner-clock.sql` includes it; fresh setup then friends supports all ten formats. Do not reapply historical narrower migrations. Publication is already authorised automatically after affected checks; verify live SQL separately from CI and deployment.

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

## Alibi evidence files — current contract (v3)

New games use **128 evidence-led files**, 32 per tier, across stamp matches, paired badge permissions, inventory differences and seal custody. All observations are verified; players match the physical evidence to a catalogue entry and deduce its owner. Each fresh Daily uses all four methods, with a 32-day rotation. Assignment notes are ungraded, and reveals explain the evidence match and deductions. Four untimed cases, first-confirmation finality and correct × 25 Arcade scoring remain.

The 155 v2 visit scenarios and original v1 snapshots retain their original rules, notes, choices and scores. The existing eight-person portrait atlas is unchanged. See [the current Alibi contract](games/alibi/README.md) and [the player-feedback release](PLAYTEST-FEEDBACK.md) for sources, validation and limits.

Before deploying this release to an existing project, apply **`supabase/playtest-feedback.sql` after the previous Inner Clock migration**, or use the updated complete `supabase/inner-clock.sql`. Fresh projects use current setup then Friends. These repeatable migrations support all three Alibi formats and versioned Stack Up scores without rewriting saves, RLS, relationships or sharing settings. Live SQL and deployment are separate from passing repository tests.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/inner-clock.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, all three Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile/menus/homepage/accounts/Friends include nine playable games; cancelled placeholder cards remain removed. Public billing and prelaunch human/content/device reviews remain deferred.

## Current proposed launch extension

Read `LAUNCH-CONTENT.md` for revised bank counts, the additive generator, exact-fraction Stack Up content, harder final tiers, repeat-free rotation and compatibility rules. The completed factual/price editorial review is in `FACTS-AND-PRICES-AUDIT.md`; arithmetic/solver checks remain distinct from source review and human difficulty calibration.

## Current Alibi and Stack Up player feedback

`PLAYTEST-FEEDBACK.md` supersedes their earlier forced-hard/visit-only defaults. Alibi has 128 new v3 physical-evidence files in `evidence-cases.js`, reproduced by `build-alibi-evidence.cjs`; v1/v2 snapshots retain their rules. Stack Up has 160 familiar defaults and 208 optional challenges, no intro screen and explicit `scoreVersion:2` base points. Its original scores keep their original scale. Use the new audit/source generators and SQL migration documented in the game READMEs; apply `playtest-feedback.sql` after the existing Inner Clock update before deployment.
