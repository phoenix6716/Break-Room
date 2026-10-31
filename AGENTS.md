## Complete bounded Sleeper rosters — 31 October 2026

Revision 8 supersedes the open-ended bank for fresh Daily and Unlimited rounds. It has **240 questions, 7,700 canonical answers, 10–321 per question**, plus reviewed aliases and symbol inputs. Each question names a finite roster, edition, classification or date cutoff. This provides a checkable complete canonical set within that boundary; it does not promise every arbitrary paraphrase or that external classifications never change. Earlier broad examples are replaced where their unrestricted membership cannot be enumerated fairly offline. No online judge or API billing is introduced.

Author `content/hidden-gem-bounded-source.json`: dated factual universes, expected counts, roster fingerprints, explicit question membership, per-answer editorial ratings, provenance and the fixed rotation. Run `node scripts/build-hidden-gem-questions.cjs` to regenerate `content/hidden-gem-questions.json` and `games/hidden-gem/questions.js`. Include every selected canonical member; aliases are not additional answers. Update roster fingerprints with SHA-256 of `JSON.stringify(members)` after a factual edit. Keep scopes short, with no accepted answers disclosed. Ratings are designer estimates, not measured player-popularity data; earlier editorial familiarity estimates and roster-order tie breaking are documented in the source. Independent human difficulty and wording calibration remains outstanding.

The **48-day rotation starts 31 October 2026**, with five distinct topics each day. All 444 marked family/overlap pairs avoid the same and adjacent days, including wraparound. Topics are WORLD, PLACES, SCIENCE, GAMES, WORDS, SPORT, LANDMARKS, CULTURE, SCREEN and ARTS. Dailies unlock at **midnight Australia/Sydney** (13:00 UTC in AEDT, 14:00 UTC in AEST). Already captured Dailies stay captured; the next newly captured day uses revision 8. An unfinished Unlimited question finishes under its captured rules, then draws only revision 8.

Revision 7 is archived in `content/archive/2026-10-31/`. Preserve full old snapshots, completed and zero-point picks, deadlines, scores, cloud keys and first-completion locks. A recovery-only alias correction table retains the previously reviewed pants/jeans fix for unanswered hg7 questions; it never enters the active question pool. Browser and private SQL validators now allow 512 answers, 32 aliases and 240-character names/input. Optional snapshot-owned exact symbol maps handle emoji and symbols, including case-sensitive SI prefixes; old questions without those maps keep their original matching rules. No score formula, account data, public API, RLS, timer or save-version changes.

Existing databases apply the updated **`supabase/hidden-gem-broader-answers.sql` before release**; fresh installs use updated `hidden-gem.sql`. This replaces only private validation/matching/score helpers and preserves their revoked client privileges. The existing 2 MB cloud limit is retained: a 120-day replacement-bank completion fixture is about 1.87 MB. Tests cover all canonical names/aliases/symbols, published roster sizes, generated-file reproducibility, Daily/Unlimited replacement, old captures, PostgreSQL parity, ownership/sharing gates and phone/desktop gameplay.

## Offline answer coverage and captured-round alias corrections — 30 October 2026

The owner reports valid answers being rejected and explicitly chooses to keep Sleeper offline. Revision 7's answer-coverage follow-up accepts pants/jeans/trousers as wording for the existing rolled-up trouser-leg answer (69), and sleeves/shirt sleeves as the existing sleeve answer (64). The current bank already accepted plain sleeves; that rejection was not reproduced, so regression checks exercise it through both real game modes. The wider review adds everyday answers and regional/action/plural wording: 240 questions, 6,315 canonical answers (19–148 each), with the same IDs, topics and 48-day slots.

Every original canonical answer, alias mapping and rating stays fixed. The source now has explicit per-answer points; adding an answer cannot rescale existing ratings. `content/archive/2026-10-30-accessible-v1/` preserves the first accessible release. Before an unanswered current question is graded, the engine may copy reviewed aliases from the matching published question, only for the same canonical name and captured rating. It does not add new canonical answers to that snapshot, replace past picks, restart deadlines or alter completed records. This narrowly supersedes the former rule that even alias corrections must wait for a fresh capture. New canonical additions apply to fresh captures only. No model, SQL, account format, network judge or API billing change.

Offline lists remain finite: this improves coverage but cannot promise to recognise every technically correct answer. Unrecognised input must not be treated as proof that the answer is factually wrong. See `design/content-reviews/2026-10-30-sleeper-offline.json` and the captured-round browser regressions in `tests/sleeper-expansion.cjs`.

## Complete accessible Sleeper replacement — 30 October 2026

Revision 7 replaces all 240 active prompts in Daily and Unlimited with broad, original everyday categories: 5,481 canonical answers, 19–148 per question, plus aliases. The 50 owner-approved examples form the foundation; wording is tightened for Australia, paired body parts, human characters and word constraints. Food preservation includes culinary vegetables. New IDs are `hg7-001`–`hg7-240`; none of revision 6 remains in either fresh pool.

`content/hidden-gem-accessible-source.json` is the authoring source, including explicit aliases, the fixed 48-day rotation and reviewed conflicting pairs. Run `node scripts/build-hidden-gem-questions.cjs` to regenerate both `content/hidden-gem-questions.json` and `games/hidden-gem/questions.js`. Each day has five different topics. Marked semantic families and canonical-overlap pairs are separated by at least one intervening day, including cycle wraparound. The epoch is 30 October 2026; fresh captures use this bank immediately. Dailies reset at midnight Australia/Sydney (13:00 UTC during AEDT; 14:00 UTC during AEST).

Revision 6 and its selector are archived in `content/archive/2026-10-30/`. Preserve every historical and unfinished full snapshot, rating, deadline, account save and first completion. Captured ready Dailies also stay unchanged until the next day. An already captured Unlimited question resumes under its original rules; its next question comes from revision 7. Retired filter choices fall back to All topics without replacing the current question or counters. No schema/SQL, scoring, timer, visual-design or save-version changes. This supersedes prior instructions to preserve future question IDs or calendar slots when refreshing Sleeper.

Answer lists are finite editorial lists, not exhaustive dictionaries. Ratings are editorial familiarity estimates, not measured player popularity. General reference links are background resources, not per-answer primary-source certification. See `design/content-reviews/2026-10-30-sleeper.json` for the review and limits. Physical-device and human enjoyment testing remain separate from automated browser checks.

## Broader Sleeper bank and tennis overlap — owner feedback, 29 October 2026

Revision 6 expands Sleeper from 160 to 240 questions with 80 additions across FOOD, MUSIC, TV, NATURE and TRAVEL. Every new question has at least ten canonical answers. Replace six overlapping Australian Open/tennis ranking questions, retaining one broad tennis question. The first six released date slots remain; from 30 October, sixteen new sets precede the unused original slots, extending the cycle to 48 days without repeated individual questions. Existing captured Dailies and answer ratings remain authoritative. Revision 5 is archived in `content/archive/2026-10-29/`; the complete additions/replacements are recorded in `design/content-reviews/2026-10-29-sleeper.json`. Practice includes the new bank immediately. No score, timer, save or SQL migration. This supersedes the former 160-question/32-day bank limit and fixed future calendar slots for Sleeper.

## Automatic account saving — owner correction, 28 October 2026

Remove manual cloud activation, sync/load buttons and import controls from Account. Sign-in returns to Account and automatically restores that account before readiness resolves. Signed-in non-game pages refresh account saves automatically, while native game pages upload without replacing a running engine. Reconnect/visibility retry automatically, concurrent callers share the pending restore/upload, and new owned edits arriving during restore are drained before comparisons. Keep guest data in a separate recovery copy and preserve per-account caches, captured timers and first completions. This supersedes earlier manual activation directions. All built account script references use the current shared cache version.

## Automatic Profile restore — owner cross-device bug report, 28 October 2026

Opening Profile while signed in automatically merges that account’s cloud saves before account readiness resolves and refreshes displayed stats when the restore completes. No cloud button is needed on a new device. Preserve guest saves separately, account isolation, newer owned edits arriving during download, captured deadlines and first-completion locks. Running game pages are never hydrated by this Profile-specific path. Offline restore errors must remain visible and reconnect retries the restore.

## Current navigation on Log in — owner direction, 28 October 2026

Log in uses the same shared hub top bar as Account: Home, Leagues, Friends, Profile, centred cube logo and auth-aware account/profile links. Preserve the sign-in form, recovery links, disabled no-JavaScript fallback and save behaviour.

## League standings freshness — owner bug report, 28 October 2026

Leagues must await the current account upload before reading standings, refresh on native-save events and cross-tab game storage changes, and drain refreshes arriving while busy. Failed sync and inactive cloud saves must be shown explicitly. Never import guest results automatically or replace server scores with local totals.

## Current navigation on Account — owner direction, 28 October 2026

Account uses the shared hub top bar with Home, Leagues, Friends, Profile, the approved centred cube logo and account/profile controls. Keep the header Account link auth-aware through `data-account-link="true"`. No main-navigation item is marked current on the Account route. Preserve account, cloud-save and planned-purchase controls.

## Approved pricing and purchase model — owner decision, 28 October 2026

See `PAYMENTS.md`. Monthly Break Room access is A$4.99 AUD, including Unlimited across current and future games and no ads while subscribed. A$7.99 AUD buys permanent Unlimited for one game and permanent site-wide ad removal. Purchases attach to accounts across devices; individual purchases survive subscription expiry. This supersedes earlier statements that no pricing was approved. Provider integration and live payments are not yet configured; keep development Unlimited available until a verified purchase flow is ready.

## Current navigation on legal/help pages — owner direction, 28 October 2026

Privacy, Terms, and Contact & Data Help use the shared `hub-topbar`/`menu-brand.css` navigation: Home, Leagues, Friends, Profile, centred approved cube logo, Account and profile avatar. No main-navigation item is marked current on these legal routes. Keep these pages static, usable without JavaScript and read-only for game/account storage; retain all policy/help content and footer links. Hide the header when printing.

## Compact mobile countdown — owner decision, 28 October 2026

All ten games use the approved full-width compact reset strip through 650px: label and 19px countdown side by side, 2px navy border, no shadow or supporting paragraph. Keep the existing larger desktop/tablet reset card and rail. Lowball retains its region control and new-daily-ready action; Time Sense still hides the reset during timing. Presentation only: reset calculation, deadlines, saves and scores stay unchanged.

## Approved mobile stats strip — owner decision, 28 October 2026

All ten games use the approved mobile preview at widths through 650px: title on its own row, full-width three-column Streak/Best/Played strip below with bold 2px navy borders and no shadow, then How To Play at the left and a text Stats button at the right. Keep the centred reset card. Desktop retains its original header and trophy icon. This supersedes the earlier phone title/stats same-row direction. Native stats, scores, saves and popup behaviour stay unchanged.

## Mobile game controls — owner direction, 28 October 2026

On phones, How To Play sits at the far left of the tools row and the trophy stays at the far right, vertically aligned. Centre the daily-reset card and its contents. Keep the title and centred stats on the preceding row and preserve desktop layouts.

## First-visit instructions and labelled Help — owner direction, 28 October 2026

All ten active games automatically open their own How To Play instructions on the first visit in a browser. `game-help.js` remembers each game separately, retaining Lowball’s `pc_help_seen` compatibility; preferences stay separate from native scores and cloud saves. Help buttons say “How To Play”. `game-help.css` places tools on a separate phone-header row. New Stack Up runs wait until initial instructions close before creating their timed round; captured deadlines are unchanged. Existing gameplay suites use returning-player profiles through `scripts/browser-fixtures.cjs`; `tests/first-visit-help.cjs` explicitly tests clean profiles and first-time behaviour.

## Closed B cube logo — owner selection, 28 October 2026

Use the approved closed 2×2 B puzzle cube: lime top with one yellow tile, blue left face, and coral/yellow/blue right face. This replaces option05 stepped tiles. `assets/source/break-room-cube-b.png` is the transparent master; `scripts/export-break-room-brand.cjs` extracts the approved art and lettering into the horizontal header logo, cube mark and icons. Keep the original option05 source archived. Production URLs remain compatible with cache version `cube-b-20261028`. Verify headers/navigation at phone/tablet/desktop widths and update the Pages branding check together with future brand changes. Game artwork, content, scores and saves are unchanged.

## Automatic deployment reaffirmed — owner direction, 28 October 2026

The owner explicitly revoked the earlier chat instruction not to publish and requests automatic deployment from this point forward. Commit and deploy completed requested repository changes after the focused checks pass, then verify the Pages workflow and live site without asking for another release approval.

## Original Clue Ladder appearance — owner correction, 28 October 2026

Restore the original cream panel, orange ladder and native pixel climber. Clue Ladder opts out of the later shared game-scenes and game-art styles/scripts; the other games retain their artwork and motion. Keep the current question bank, clues, scores, Daily slots and captured saves. This supersedes the Clue Ladder portion of the shared scene/object artwork directions. The page matches its pre-scene version from before commit `1e56731`; the engine and bank are unchanged.

## Broader Sleeper questions — owner correction, 28 October 2026

Every newly offered Sleeper question must have at least ten canonical answers, preferably more. Revision 5 replaces all 55 undersized sets across SCIENCE, AUSTRALIA, LANGUAGE and EVERYDAY with broader scoped questions. The compass-point, demonstrative and states-of-matter prompts are retired. The bank has 160 questions and 4,722 answers; aliases do not count towards the minimum. Fixed editorial ratings remain 1–100, not popularity measurements.

Preserve all IDs, topics, date slots, timers, scores and full captured snapshots. The prior revision is archived in `content/archive/2026-10-28/hidden-gem-questions.json`; historical two-answer snapshots remain valid in the model and SQL. Enforce the new minimum in source generation and bank tests, not legacy record validators. `design/content-reviews/2026-10-28-sleeper.json` records every replacement and the invalid Oceania alias removal. No SQL migration is needed.

## Homepage-style top bar on social pages — owner direction, 27 October 2026

Use the homepage's text-link top bar on Leagues, Friends and Profile: Home → Leagues → Friends → Profile, the approved centred wordmark, coral underline on the current page, and the existing account/profile controls. `menu-brand.css` scopes the shared layout to `.hub-topbar` inside `.hub-header-frame`; it must not restyle page content or game headers. Keep the homepage artwork/layout and all social, account and score behaviour intact.

At tablet widths put navigation on its own row. On narrow phones place the logo and account controls side by side so their touch targets do not collide. Keep four links, visible keyboard focus, usable no-JavaScript links and the existing auth-aware Account/Log in destination. Verify mobile/tablet/desktop breakpoints and real Friends, Leagues and Profile flows. This is a presentation change, with no database or save migration.

## Stack Up without numerical trivia or time-unit tasks — owner correction, 27 October 2026

The owner explicitly wants to keep ordering films/books by release and historical events by date, while removing maths, number facts and time-unit questions. New Dailies replace 32 weekday/month/duration slots and eight continent-area slots with story, nature, crafting and everyday-process ordering. Keep the other 120 familiar stacks, all 160 IDs, five 32-item lanes and their exact Daily assignments.

Unlimited replaces 105 atomic-number, melting-point, density, area, coordinate and elevation slots with plot, quest, route and process ordering. `content/stack-up-familiar-challenge-topics.json` defines the replacements; `scripts/build-familiar-stacks.cjs` emits them alongside the familiar bank and `content/stack-up-familiar-challenge-audit.json`. The original 208-row `stacks.js` stays frozen; the engine overlays replacements by ID before selecting new practice. Challenge mix remains 134 stacks, Familiar stays 160, and the 74 old NUMBER SENSE stacks stay excluded from every filter.

Do not rewrite captured Dailies or old scoring. `content/archive/2026-10-27/stack-up-familiar-stacks.js` preserves the prior familiar bank. Test every Unlimited filter, 32-day content/date-slot continuity, reproducible source generation and old numerical/time-unit snapshot completion. No SQL update or save reset is required. See `design/content-reviews/2026-10-27-stack-up.json`.

## No answer giveaways — owner correction, 27 October 2026

Sleeper descriptions must explain the scope without naming accepted answers or aliases, listing the solution set, or using an answer as a release cutoff. Use dates and neutral boundary wording. Where a prompt must name a series or character that is itself an accepted answer, assign that answer the minimum 1 point; it must never be a Sleeper/Breakout giveaway. Multiple such answers can share the 1-point floor. These are editorial common-answer choices, not measured popularity.

Revision 4 repairs 39 question slots, including the plant/renewable-source prompts, and replaces the organ-identification clues with the conventional five-vital-organs question (liver replaces stomach). IDs, topics, schedule, timers and score formulas stay fixed; captured revision-3 questions and ratings remain authoritative. Regression checks scan all 160 prompts/descriptions and complete old snapshots at their captured scores. See `design/content-reviews/2026-10-27-sleeper-no-giveaways.json`. No SQL update is required.

## Broader answer lists — 27 October 2026

Revision 3 integrates the 96 drafted WORLD, SPORT, FILM, BOOKS, GAMES and SPACE slots, with 4013 canonical answers across the full 160-question bank. The other four topics remain unchanged. IDs, topics, calendar slots, 32-day rotation, 30-second deadlines, first-result locks and native/Arcade formulas are unchanged. Existing full snapshots keep their captured questions and ratings. Revision 2 is archived under `content/archive/2026-10-26/`.

Lists can now contain up to 160 canonical answers, including all 151 Kanto Pokemon. Fixed integer ratings remain 1–100; more than 100 answers necessarily share ratings. This supersedes the former distinct-rating-per-answer limit for broad lists. Names for the same identity resolve to one canonical rating; ambiguous aliases are excluded. See `design/content-reviews/2026-10-27-sleeper.json` for scope corrections and editorial limits.

Existing databases apply `supabase/hidden-gem-broader-answers.sql` before publishing: it only widens `_hg_question`'s answer-count bound from 40 to 160 and keeps the helper private. Fresh installs use the updated `hidden-gem.sql`. No user data, tables, policies, sharing gates or score formula changes.

## Private weekly leagues — owner-approved format, 26 October 2026

The owner approved a three-game weekly competition: two required games rotate each week, and the third slot automatically counts each player's highest weekly total from the other eight active games. The optional slot is one distinct game across the whole week, not a different game each day. Sum all seven completed Daily Arcade scores for each counted game (up to 700 each), then add the three game totals for a maximum of 2,100. Missed Dailies contribute zero; Unlimited never counts. Weeks run Monday–Sunday in Australia/Sydney, resetting Monday at midnight.

This supersedes the proposed five-game (three required plus two optional) format, best-Daily-of-week scoring and placement-based league points. Preserve existing native/Arcade formulas and saves. The first implementation is documented in LEAGUES.md: private invite-based leagues, a shared five-week required-game schedule, explicit membership score-sharing consent, server-derived current-week totals and owner controls. Read that contract before extending leagues. Current-week standings are implemented; archived weekly winners/history remain future work. Verify live database activation and deployment separately from code and CI. Do not represent the current Friends average as this weekly total.

## Final card illustration refinement — owner direction, 26 October 2026

The owner still found Time Sense too plain and requested slightly larger Pack, Lowball, Laser, Seating Chart and Desk Jam illustrations. Time Sense now combines its pixel stopwatch with a 5s target tile, coral stop control and short timing-marker line. It remains decorative card art; the game rules and blind timing are unchanged.

Enlarge Laser/Seating Chart/Desk Jam by 25%, Pack by 20% and Lowball by 30% at roomy widths. Keep smaller safe scales for the constrained phone cards, especially Desk Jam's wide exit route. Preserve the existing Time Drop, Sleeper, Stack Up and Clue Ladder improvements. All full-width backgrounds and original 172/155/126px card heights remain unchanged. Validate the transformed foreground bounds and navigation at mobile, tablet, desktop and breakpoint widths; no game-session sweep is needed.

## Fuller artwork in five homepage cards — owner direction, 26 October 2026

The owner found Time Sense, Time Drop, Clue Ladder, Stack Up and Sleeper too sparse after background extension. Enlarge the existing Time Sense/Sleeper motifs by 50%, Time Drop by 35% (10% on the narrowest phones), and Stack Up by up to 80% with smaller responsive scales to retain all five cards. These are presentation transforms inside the existing clipped artwork areas; the original 172/155/126px card heights and full-width backgrounds remain fixed. Other illustrations retain their scale.

Clue Ladder is already nearly full-height, so add three small clue slips around its existing ladder rather than stretching it. Its wide source and measured foreground bounds remain reproducible through the existing export script. Verify the actual transformed foreground bounds across phone/tablet/desktop widths, including responsive transitions, and visually inspect the resulting homepage. Do not change game content, scores, saves, controls, links or game layouts.

## Full-width card backgrounds and Sleeper score tower — owner decision, 26 October 2026

The owner approved Sleeper's quiz-show-style score tower (95, coral meter, answer panel and star), replacing the live radar artwork. Retain Sleeper's higher-is-better scoring and avoid survey claims or third-party show logos.

The owner also rejected the visible rectangular image patches over the old card colours. All ten approved motifs now have wide, continuous pastel-grid backgrounds that reach every artwork edge. Use the full-width masters in `assets/cards/source/wide/`, exported by `scripts/export-homepage-cards.cjs` to 1200px palette-optimised WebP. `assets/cards/manifest.json` records the foreground outline and accent-colour bounds so responsive tests can prove the subjects remain visible while the spare background is cropped. Visually review both phone and desktop renderings as well.

Keep the original 172/155/126px artwork heights and unchanged grid, text, buttons, game routes, content, saves and scoring. Use object-fit:cover on these wide masters with the measured foreground centre as the horizontal focus; this supersedes the earlier contain instruction, which exposed the mismatched backgrounds. Source PNGs stay excluded from production. Regenerating old square exports must not restore the rejected inset-panel appearance.

## Desk Jam and Time Sense card revisions — 26 October 2026

The owner approved Desk Jam option B: a recognisable top-down desk, filing cabinet and blue chair with an exit route. Export only the left panel of `assets/cards/source/desk-jam-option-b.png`; the right-hand Sleeper index-card-box concept was explicitly rejected. Time Sense's generic screen/pointer illustration is replaced with a simple blue pixel stopwatch on a pale-blue grid, from `assets/cards/source/time-sense-stopwatch.png`. The new Sleeper star-cluster image is an unselected preview; keep the current live radar artwork until a replacement is chosen.

The revised lossless WebPs keep their public asset filenames with revisioned query strings. The export script reproduces the original eight panels and these two overrides. Source images remain excluded from production. Preserve the restored 172/155/126px artwork frames, use contain sizing and do not enlarge cards again.

## Preserve homepage card sizes — owner correction, 26 October 2026

The owner requested new artwork, not larger cards. Preserve the original menu.css artwork heights: 172px desktop, 155px through 1050px, and 126px through 540px. Do not impose a new image aspect ratio on the card container. Fit the entire illustration inside the existing frame with object-fit:contain, preserving the original grid, text and button layout. Time Sense needs a closer visual match; new Desk Jam and Sleeper alternatives are previews until selected. This supersedes the 4:3 frame instruction below.

## Approved homepage card artwork — owner decision, 26 October 2026

The owner approved the second, flat pixel-style ten-card preview after rejecting the glossy cartoon direction as looking AI-generated. Use crisp geometric sprites, solid muted fills, navy outlines and hard shadows close to the games' actual graphics. No glossy cartoon scenes, realistic hands/faces, third-party logos or branded packaging. The approved master is `assets/source/homepage-cards-pixel-approved.png`, excluded from production; `scripts/export-homepage-cards.cjs` uses Sharp 0.34.5 to reproduce the exact panel crops as lossless WebP under `assets/cards/`. Do not regenerate/redraw the approved art during exports. The board's captions and gutters are not part of the shipped card images.

Homepage titles, descriptions and play links remain real HTML. Treat the images as decorative because the adjacent text identifies each game. Keep the original responsive artwork heights, sharp pixel scaling, complete subject silhouettes at every supported width, and the ten existing routes/order/Daily progress. Changes here do not alter game engines, content, saves or scoring. Validate the homepage artwork, image loading, mobile/desktop layout and navigation; no full-game sweep is required.

## Stack Up without maths — owner decision, 26 October 2026

The owner finds maths questions boring and repetitive. New Dailies and every Unlimited filter must exclude calculations, fractions, percentages, geometry exercises and unit-conversion drills. Keep ordinary chronological, science, geography and other knowledge ordering. Replace the 64 arithmetic/fraction slots and 16 unit/data-conversion slots with non-maths topics while retaining all 160 IDs, five 32-item lanes and their exact Daily date assignments. The added source is `content/stack-up-familiar-topics.json`, rebuilt by `scripts/build-familiar-stacks.cjs`.

Keep the original 208-set bank and legacy snapshots intact for saved-history compatibility. Its 74 NUMBER SENSE stacks are excluded from all new Unlimited draws and its topic list; 134 non-maths Challenge stacks remain. Existing captured Dailies can still contain retired content and must retain their answers, deadlines, scoring and progress. Do not reset these saves or change native/Arcade formulas. Keep at least 32 days without repeated individual stacks and verify Daily, every practice filter and old-run restoration with Stack Up's affected checks.

## Familiar and contemporary questions — owner feedback, 26 October 2026

Players found some Sleeper, Time Drop and Clue Ladder questions too obscure. Prefer recognisable subjects and approachable wording; add contemporary film, books, games, technology and screen/music culture to Sleeper and Clue Ladder. Time Drop keeps ancient history and its full era range, using better-known milestones rather than minor battles or treaties. Later Clue Ladder clues should give a direct everyday route to the answer. This supersedes older claims that specialist questions and the original banks were already calibrated for players.

Editorial bank revision 2 replaces 44 Sleeper prompts (160 total / 922 answers), 39 Clue Ladder answers and clarifies nine other ladders (300 total), and replaces 38 Time Drop additions (330 total). See `design/content-reviews/2026-10-26.json` for the complete before/after record. The former banks are archived under `content/archive/2026-10-25/`, outside production. All IDs, topic/category slots and Daily assignments stay fixed; Time Drop also preserves each era bucket. Historical ID slugs now identify stable authoring slots, not necessarily the revised subject. Existing saved snapshots, answers, deadlines, scores and archived Prior content remain unchanged. No SQL or save migration.

Keep at least 32 consecutive days without repeated individual content, including across old/new-bank boundaries. Run the three affected game suites and `tests/content-refresh.cjs` / `tests/daily-content.cjs`; do not replay unrelated games. Reference links and automation support review but do not certify that every player knows each answer. Continue calibrating from human playtests.

## Approved Break Room logo — owner decision, 25 October 2026

The owner chose **option 05**: four stepped, overlapping blue/lime/coral/yellow tiles with navy outlines and a short hard shadow, alongside the bold stacked **Break Room** wordmark. This supersedes the original equal four-square placeholder and the unselected concept boards. Use the supplied approved assets rather than recreating the lettering or substituting another option.

Production assets: `assets/break-room-wordmark.png`, `assets/break-room-mark.png`, `assets/break-room-icon.svg` and `assets/break-room-touch-icon.png`. `assets/favicon.svg` and `assets/logo.svg` retain compatible URLs. The transparent master is archived in `assets/source/break-room-option05.png`, excluded from production. With Sharp 0.34.5 available, `node scripts/export-break-room-brand.cjs` reproduces the exports.

`scripts/site-brand.cjs` applies accessible static logo links, favicon/touch links and `brand.css` during the production build, including nested game routes and JavaScript-free pages. Keep the accessible brand name and Home destinations. At phone widths use the compact supplied wordmark while preserving 44px link targets and clear Menu/Account controls. Do not change game banks, Dailies, save identities, scores, artwork or account configuration for a branding change. Verify shared headers/navigation at affected widths, rather than replaying every game.

## Final site name — owner decision, 25 October 2026

The owner confirmed **Break Room** as the final website name after considering alternatives. Use two words with this capitalisation throughout the public brand. Midnight Arcade is the former name. Keep the existing visual identity, game names, routes, storage keys and account contracts. Revisit the website name only if the owner asks. This records the branding decision; it does not establish domain availability or trademark clearance.

## Artwork without third-party logos — owner requirement, 25 October 2026

Use generic illustrations for products and services. Do not include third-party logos, wordmarks, recognisable brand marks, branded clothing/packaging patterns or protected medical emblems in images. Keep device backs and packaging labels blank. This applies to future generated artwork and overrides earlier instructions to preserve an image when it contains such marks. Break Room's own identity remains permitted; factual product names in question text are unchanged.

Lowball's visually reviewed replacements are listed in `content/lowball-art-review.json` and sourced from the transparent `items-unbranded.png` atlas. Apply these overrides last when regenerating art with `scripts/extract-lowball-unbranded.cjs`; preserve filenames, item/save identities, prices, rotations and scores. Update the compatibility PNG aliases as well as the generated sprites, and retain the cache version for affected images. Historical source sheets/design previews are unpublished archives and must not be used to restore branded artwork. Automated hashes and decoding checks protect the reviewed files; new illustrations still need visual inspection.

## No repeated Daily ingredients — owner requirement, 25 October 2026

The owner explicitly rejected repeated individual content within the month. All ten active games must provide **32 consecutive days without repeating individual questions, products, boards or target durations**, including repeats hidden under another ID. Different full Daily combinations are not sufficient. Read [DAILY-CONTENT.md](DAILY-CONTENT.md); `node tests/daily-content.cjs` enforces the actual shipped selectors across the release boundary, current/future windows and a leap-day window. This supersedes the earlier Lowball/Time Sense reuse exceptions.

Lowball appends 28 genuinely different products (128 total / four per day) and uses a fixed 32-day ring from 26 October 2026 Sydney. Freeze the original 100 identities/order/base prices and their v1 selector in `content/lowball-original-*.{json,js}`. Existing captured snapshots always win; snapshotless drafts reconstruct the original 100-item selector even after cutover. New authoritative additions/evidence are in `content/lowball-additions.json`; regenerate via `node scripts/build-lowball-additions.cjs`. Preserve original art and numeric scoring. The 112 additional regional references were checked 25 October; upfront scopes distinguish model/pack/channel, preorder, launch RRP, sale and unavailable published references. They are dated reference prices, not universal or live quotes.

Time Sense uses a fixed 39-day duration deck from 26 October, with exact 50ms target steps within the existing 2–12-second range. Show half-tenth targets exactly (5.95s, not 6.0s); preserve v1 targets and old saves. Client/private SQL validators accept the same grid; score formulas, keys, tables, RLS and sharing remain unchanged. Only the private `_friend_inner_clock_score(jsonb,date)` helper needs a narrow live replacement; main code, CI and confirmed deployment are separate milestones.

Both schedules hold out the previous day's individual content to protect 25 October's existing Daily and the release boundary. This is a rolling-month guarantee, not an infinite uniqueness claim; later pool/order changes need deliberate versioned compatibility review. The other eight banks already satisfy it. Current display names: Desk Jam, Sleeper and Time Sense; older roster/installer notes below remain historical.

## Sleeper visual identity — owner direction, 25 October 2026

The owner requested a fuller rebrand to match Sleeper after its initial display-name change. Use a sleeper-hit / off-the-radar identity: static radar/star artwork, muted blue/amber, cream panels, navy outlines and hard shadows. “Quiet answers. Big points.” is its headline. Preserve the canonical header, left drawer, ?-only help, category pixel icons, immediate controls and reduced-motion reveal behavior.

The owner selected **Sleeper**, without “Hit”, for the 60–79 tier. Display answer bands are now Everyday 1–19, Good Call 20–39, Under the Radar 40–59, Sleeper 60–79 and Breakout 80–100; zero remains Time’s Up. These presentation labels replace the earlier gem/crown labels without changing numeric thresholds, saved points, deadlines, question snapshots, matching, first-answer locks, native/Arcade averages or content. The legacy pure model’s scoreBand strings remain internal compatibility labels; the engine maps them for display. Rename the existing badge to Breakout run without changing its ID or five 100-point requirement. No SQL or data migration. This supersedes the earlier instruction to retain the visible Hidden Gem band/artwork.

## Game naming — owner decision, 25 October 2026

The owner explicitly likes and wants to retain **Laser**, **Clue Ladder**, **Seating Chart**, **Pack**, **Lowball**, **Time Sense** (formerly Inner Clock), **Stack Up**, **Sleeper** (formerly Hidden Gem) and **Desk Jam** (formerly Shift Work). Time Drop remains provisional while alternatives are evaluated. Do not rename any game until an alternative is selected. Future display-name changes must preserve internal routes, storage keys, saved snapshots, scoring and account/Friends compatibility unless separately requested.

Time Sense is the approved display name for `inner-clock`. Apply it to the shelf, game/dialog titles, menu labels, share text, profile and Friends. Keep `games/inner-clock/`, JavaScript identifiers, native/cloud keys, SQL functions, scores and earned achievements unchanged; no migration is needed. Older references below use its former name. Static drawer labels are normalised by `scripts/build-site.cjs`, with the same runtime label in `navigation.js`. Restrict display-name normalisation to `.game-menu` navigation only; all homepage play buttons must retain their visible OPEN GAME label and arrow.

Sleeper is the approved display name for `hidden-gem` (25 October 2026). Apply it to the shelf, game/help/stats titles, drawer labels, share/feedback text, profile and Friends. Preserve `games/hidden-gem/`, internal identifiers, local/cloud keys, SQL, answer content, artwork, scores and achievements. The existing answer score band **Hidden Gem (60–79)** stays unchanged; the owner chose a game title, not new score bands. No data migration is needed. Older documentation below uses its former name.

Desk Jam is the approved display name for `shift-work` (25 October 2026). Update the homepage, registry, game/help/stats titles, drawer, share text, profile and Friends. Preserve the existing office artwork, gameplay, Smooth shift badge meaning, numeric scores, `games/shift-work/` route, internal identifiers, local/cloud keys and SQL. No migration is needed. Older references below use the former name.

## Shift Work — full integration authorised, 25 October 2026

The owner approved Shift Work and authorised expansion/full integration. Ten active games in shelf/drawer order: Laser → Time Drop → Clue Ladder → Seating Chart → Shift Work → Hidden Gem → Stack Up → Pack → Lowball → Inner Clock. Stake, Prior, Alibi and Bouncer remain archived with routes/artwork/saves/scoring/earned badges preserved. Fourteen native save formats remain supported. This supersedes older roster totals and prototype-only holds.

Read [games/shift-work/README.md](games/shift-work/README.md). Keep three untimed Daily boards at 4–5 / 6–7 / 8–9 minimum slides and free independent Unlimited. Native total moves is lower-is-better. Board Arcade credit is rounded minimum/moves ×100, capped at75 with hints; Daily is the rounded mean of three board credits. Undo retains moves; Restart clears unsolved moves/trace but retains hints. First solve locks and third counts before final Next. Preserve the approved artwork, controls, canonical shell and ?-only help.

The frozen 180-board deck gives 40 nonrepeating Daily sets (120 IDs), plus20 Starter/40 harder boards. Unlimited defaults Easy, supports all levels/Mixed and nonrepeating pools excluding today's three. Save/replay board snapshots, legal forward/Undo evidence, fixed catalog/minima, positions and first results. No prototype import or Daily replay; owner-scoped practice stays outside cloud/profile history.

Apply supabase/shift-work.sql after setup/Friends/Hidden Gem. It adds only the game's private table/RPCs/helpers, preserving older storage/functions. Require fourteen-format accounts, read-only profiles, native best=min moves, private Arcade comparisons and Smooth shift. Verify live SQL and Pages independently from affected checks; automatic deployment remains authorised. Solvers do not certify human enjoyment/difficulty.

# Stake shelved — owner decision, 24 October 2026

Stake is removed from the active shelf, navigation drawers, current Daily checklist and Friends comparisons. Nine active games, in order: Laser → Time Drop → Clue Ladder → Seating Chart → Hidden Gem → Stack Up → Pack → Lowball → Inner Clock. Stake joins Prior, Alibi and Bouncer in the archive. Preserve its direct route, engine, question bank/artwork, local/cloud saves, native/Arcade scores and earned achievements. Profile shows saved Stake history without play prompts; unearned High roller and the legacy three-game Clean sweep are hidden, while earned badges retain their original meaning. Thirteen native save formats remain supported; no database/schema change is needed. The canonical shell still uses Stake's layout. This supersedes older active-roster counts below.

# Break Room project memory

## Hidden Gem — full integration authorised, 24 October 2026

The owner approved adding Hidden Gem as a full game and expanding its content. This supersedes the earlier prototype-only integration hold. Ten active games in shelf order: Laser → Time Drop → Clue Ladder → Seating Chart → Hidden Gem → Stack Up → Stake → Pack → Lowball → Inner Clock. Preserve the three archived games and every existing save/artwork/native score. Thirteen native save formats remain supported.

Read [games/hidden-gem/README.md](games/hidden-gem/README.md). Five Daily questions, 30 seconds each, one input, unlisted/blank retry without resetting time, guarded canonical typo correction, first accepted answer or timeout final. Each answer has its own integer rating: Familiar 1–19, Nice Find 20–39, Offbeat 40–59, Hidden Gem 60–79, Crown Jewel 80–100. Ratings are editorial, never surveys. Native and Arcade are the five-question average out of 100. Preserve the approved count-up/meter, five tiles, category pixel icons and high-score stamps; sparkles only at 100. Effects respect reduced motion, never delay play, and never replay on restored results.

The authoritative 160-question/1,004-answer bank has ten topics and 32 nonrepeating Daily sets, five different topics daily. Free owner-scoped tab-local Unlimited excludes today's five and refills after eligible IDs are exhausted. Save full snapshots and real deadlines. Prototype history stays separate. Preserve first completions, memory-only warnings, corrupt saves, cross-tab locks and account ownership.

Apply supabase/hidden-gem.sql after setup/Friends. It adds a dedicated private hidden_gem_saves table and authenticated save_hidden_gem / hidden_gem_friend_scores RPCs, preserving legacy save_game, game_saves and old Friends functions. Fresh install is setup.sql → friends.sql → hidden-gem.sql. Confirm live migration and Pages independently from CI. Use focused Hidden Gem, account, profile, Friends and affected shared checks. Keep human difficulty/content/device review distinct from engineering checks.


## Prototype-first game development — owner direction, 24 October 2026

Build initial new-game versions outside the live Break Room integration so the owner can playtest and request quick improvements. Prefer a portable standalone HTML prototype on an isolated branch under `game-drafts/`, with the approved Stake layout embedded. Run only that prototype's affected checks. Do not add a homepage card, registry entry, official saves, accounts/Friends or SQL until the owner approves full integration. Keep live saves and existing engines untouched.

The Pointless/Krillion-inspired prototype has working title **Hidden Gem** (formerly Deep Cut). It uses **30 seconds per question** and **higher-is-better scores**: each answer 0–100, final score the average of five questions. Ratings are designer-assigned; never imply a survey, panel or measured answer popularity. Use one answer box. Reject blank or unlisted submissions without locking, scoring or resetting the 30-second timer; show “Not in the answer list. Try again.” for unlisted guesses. Correct only clear, unambiguous typos to an actual listed answer. At the deadline, accept a listed saved draft or end with no accepted answer and zero points. Source and focused testing: [prototype-deep-cut branch](https://github.com/phoenix6716/Break-Room/tree/prototype-deep-cut/game-drafts/deep-cut). The owner requested a new title and score names plus a filling score meter, five Daily result tiles, category pixel art and high-score stamps/sparkles. The owner wants individual integer ratings for each answer rather than five fixed scores. Bands: 1–19 Familiar, 20–39 Nice Find, 40–59 Offbeat, 60–79 Hidden Gem, 80–100 Crown Jewel; zero is Time’s Up. Give each answer a distinct rating within its question, with editorial rather than survey claims. Existing v2 question/result snapshots retain their captured ratings; new Daily tests and newly drawn Unlimited questions use the current bank. Category labels, stamps, meter, summary and share output follow the ranges; sparkles remain reserved for exactly 100. Preserve the internal prototype path/key and v2 saves. Effects respect reduced motion, never delay controls and never replay on restored results. Name, test-bank scope and ratings remain provisional. The prototype is not a tenth live game. This does not change the native-score compatibility contracts for existing games.


## Seating Chart — owner-approved build, 24 October 2026

Seating Chart is the ninth active game, placed after Clue Ladder: Laser → Time Drop → Clue Ladder → Seating Chart → Stack Up → Stake → Pack → Lowball → Inner Clock. Three archived games retain their routes/history; twelve native cloud formats remain supported. This supersedes older roster totals below. Read [the Seating Chart contract](games/seating-chart/README.md).

Five untimed Daily tables use neighbours, not-neighbours, exactly one guest between, and opposite seats. Varied harder conflicts show their minimum upfront; every optimal arrangement earns full credit. Native total drama is lower-is-better; table Arcade credit is max(0,100 − 20 × avoidable drama), averaged across five. First reception locks immediately; fifth counts before final Next. Preserve snapshots, free Undo/Reset before commit, immediate draft saving, owner-scoped Unlimited, shared Sydney reset and ?-only Stake shell. The 360-table offline-generated deck provides 72 Daily sets. Solver checks are not human difficulty certification. Keep the original prototype outside production; do not activate its monetization hooks or rehearsal Compare route.

Existing projects apply `supabase/seating-chart.sql` after Clue Ladder, or latest complete Inner Clock update. Fresh setup/Friends includes it. Verify live migration and Pages separately from passing CI. Automatic deployment remains authorised after affected checks.


## Clue Ladder — owner-approved build, 23 October 2026

Clue Ladder is the eighth active game: Laser → Time Drop → Clue Ladder → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain archived; eleven native save formats are supported. This supersedes older roster counts below.

Five untimed Daily puzzles use five progressively clearer clues. Solves on clue 1 / 2 / 3 / 4 / 5 earn 1,000 / 800 / 600 / 400 / 200 points; unsolved earns zero. Maximum 5,000 native points, Arcade = points / 50. No speed penalty, Daily multiplier, hearts, intro screen or live AI. Preserve the ladder and pixel climber inside the centred Stake shell with ?-only help. Read `games/clue-ladder/README.md`.

The 300 distinct, editorially reviewed familiar answers span eight topics and provide 60 nonrepeating Daily sets, each with five different topics. References and automation do not establish independent primary-source certification or human difficulty calibration. Save input, hints, attempts and frozen puzzle snapshots immediately; first completion wins. Owner-scoped tab-local Unlimited excludes today's five answers, applies topic changes next puzzle and reshuffles after eligible-pool exhaustion.

Existing Time Drop projects apply `supabase/clue-ladder.sql`; updated complete `supabase/inner-clock.sql`, or fresh setup then friends, also includes it. Verify live SQL and deployment separately. Preserve existing saves, scores, artwork and archived routes.


## Time Drop — owner direction, 23 October 2026

Time Drop replaces Prior in the active lineup: Laser → Time Drop → Stack Up → Stake → Pack → Lowball → Inner Clock. Alibi, Bouncer and Prior remain shelved with their engines, sources and historical saves preserved. Seven active games; ten supported native save formats including archives.

The owner requested no hearts anywhere in Time Drop, reasonable partial-credit scoring, expanded/balanced content, reliable saves and locked answers, a large ongoing Unlimited mode (never call it Endless), and the canonical Stake layout. Read `games/time-drop/README.md` for the exact 330-event/66-day deck, fixed era-based linear scoring, accepted date ranges, native 5,000-point / Arcade 100-point scales for new five-round Dailies (version 2); original ten-round version 1 saves retain their 10,000-point scale, first-lock saves and tab-owned practice. Preserve Prior's source and legacy results rather than reinterpreting them. Keep the original uploaded prototype outside the production artifact.

Existing live projects apply `supabase/time-drop.sql` after the current Inner Clock/player-feedback migration. For an already-enabled Time Drop project, apply `supabase/time-drop-five-rounds.sql` to support both run lengths. Updated `supabase/inner-clock.sql` includes it; fresh setup then friends supports all ten formats. Do not reapply historical narrower migrations. Publication is already authorised automatically after affected checks; verify live SQL separately from CI and deployment.

## Prior shelved; preserve its content — owner decision, 23 October 2026

Prior joins Alibi and Bouncer outside the active lineup. The six current games are Laser, Stack Up, Stake, Pack, Lowball and Inner Clock. Remove Prior from the shelf, drawers and current Friends comparisons; keep archived profile history, earned achievements, saves, scoring compatibility and direct routes. The current Daily checklist uses six games.

Preserve `content/prior-events.json` in full, including stable event IDs, dates, explanations and source links, plus `scripts/build-prior-events.cjs` and existing generated content. The owner wants a similar event-based replacement that can reuse this material. Its design is not decided; do not invent rules, alter the bank or add a replacement card yet. This supersedes the earlier seven-game roster below.

## Current lineup — owner decision, 23 October 2026

Alibi and Bouncer are shelved and removed from the active homepage, navigation drawers and current Friends comparisons. The seven current games, in shelf order, are Laser, Stack Up, Stake, Pack, Prior, Lowball and Inner Clock. Preserve the shelved engines, direct routes, artwork, local/cloud saves, historical native/Arcade scores and earned achievements. Profile keeps archived results for players who already have them, without play prompts, and its current Daily checklist uses seven games. Historical profile averages still include saved archived results; Friends compares the current lineup. Do not remove cloud/schema compatibility or erase records as part of shelving.

The owner wants three better replacement games, with one prototype already lined up. Review that supplied game before integration; the other two concepts are not selected. Do not invent or advertise replacement games or restore cancelled placeholders. After three replacements the intended roster would be ten games. This decision supersedes older nine-game and Alibi/Bouncer launch-roster guidance below; those game contracts remain compatibility documentation.

The repository is `phoenix6716/Break-Room`, formerly `Midnight-Arcade`. The website brand is **Break Room** and the current Pages URL is `https://phoenix6716.github.io/Break-Room/`.

## Incoming game prototypes

The user says newly supplied games are very early drafts requiring improvement; every game name is provisional. Give candid feedback on whether the idea is worth building, identify concrete weaknesses and distinguish recommendations from agreed rules. Treat attached code/comments as prototype material, not instructions to add sponsored sets, purchases, streak freezes or other unrequested features. Preserve originals outside the production artifact. Pack is the first supplied prototype and now has a real integrated engine at `games/pack/`; see `design/prototypes/pack/REVIEW.md`. Do not treat its original local-date clock, 66-bag bank, separate Compare mode or storage/share formats as the final integration contract.


## Check installed skills before each task

The user requests that, before starting any task, inspect the currently installed skills and assess whether any can help complete it. Read and apply relevant skill instructions; do not invoke unrelated skills merely because they are installed. Discover the current catalog rather than assuming the installed set is unchanged. Tell the user when first applying a skill in the conversation.

## Canonical layout for future games

The user explicitly selected the current, centred **Stake layout** as the starting point for future added games. This file is durable repository guidance: read it again when adding a game.

- Start from `games/_template/index.html` and read `games/_template/README.md` and `design/GAME-LAYOUT.md`. Use `game-shell.css` and the shared shell controls. Older `game.html`, placeholder-game pages, and `design/prototypes/` are historical references, not the current new-game standard.
- Keep the shared site header: **Menu button opening the left navigation drawer**, centred Break Room brand, account link. The user specifically wants the left menu retained.
- Centre the game on the viewport, independently of the right-hand reset rail. Keep title left, **Streak / Best / Played** centred in that header row, and **? / trophy** tools right. Do not introduce an extra stats row that pushes the game down.
- Keep plain **Daily / Unlimited** mode buttons, centred progress slot, centred playing surface, and the existing responsive geometry. Use `daily-reset.css` for the exact Stack Up reset box and `daily-clock.js` for **midnight Australia/Sydney**, including DST.
- Keep help/stats popup visuals from `game-dialog.css`, keyboard controls, focus trapping/restoration, Escape, and working navigation. A sound control is optional; if a game has actual audio, put its real toggle **bottom centre below the game**. Do not add a fake sound toggle.
- Replace title, description, help rules, engine surface, scoring, progress contents and game-specific stats. Stake's trivia, 30-second question timer, bets, circular poker chips and green felt are **Stake-specific**, not requirements for new games. No fake scores, playable demos or stored Daily completions in an unimplemented template.
- Use the universal footer and policies (`privacy.html`, `terms.html`, `contact.html`). Run `npm run legal:sync` after adding pages and read `LEGAL.md`. Do not restore a separate Lowball legal footer or stale per-game policies.
- Preserve all nine playable games’ mechanics, artwork and saved progress unless the user requests changes. The six cancelled placeholder cards must stay off the homepage. The template is a development starting point, not another homepage game.
- Validate at least 320/390/768/1100/1440px, ensure the central game does not shift to make room for the reset box, and check the left menu, popups, real game flow, Daily/Unlimited and saved state as appropriate. Use explicit `index.html` navigation targets so downloaded copies work.

User requests take priority over these defaults. For details, component IDs, responsive placement and the new-game checklist, see `design/GAME-LAYOUT.md`.

## Real local profile

`profile.html` uses `profile-records.js` (read-only save adapters), `profile.js` and `profile.css`. Preserve each game’s native score and add the common 0–100 Arcade score defined in `SCORING.md`. Count only completed Dailies, excluding Unlimited, pending runs and demo data. Opening the profile must never migrate/write game saves or invoke engine initialization/reset scripts. Lowball normally retains up to 121 days of dated scores locally plus a lifetime play counter; cloud snapshots can preserve older merged results, so best/average/activity and history streaks must be labelled accordingly; do not invent older results or achievements. Legacy Stake scoring reconstructs its frozen 164-question option permutations; protect compatibility with the real-engine comparison in `tests/profile.cjs`. Accounts/cloud sync are implemented through Supabase; read `ACCOUNTS.md`. Friends are implemented; read `FRIENDS.md` and apply `supabase/friends.sql` for live activation.

## Shared scoring standard

The user selected a shared 0–100 score **alongside** native chips/points. Use `arcade-score.js` and read `SCORING.md`: Lowball keeps its Daily average; Stake uses chips staked on correct answers / total staked; Stack Up uses clamped Daily points / 31,000. Profile Arcade averages use a common 120-day Sydney-date window, equal weight per played game, full precision until display, and explicit game/run sample counts. Real zeroes count; missing, pending and Unlimited scores do not. Never average raw chips with raw points, silently rewrite saved scores or claim this scale is a population percentile. Define and test a bounded, documented Arcade score and read-only record adapter when adding future games.

## Hosting and checks

## Automatic deployment — owner decision, 23 October 2026

The owner explicitly authorised automatic deployment of completed requested changes and wants an efficient workflow without managing PRs or repeating release approvals. This supersedes all earlier PR-only or wait-for-deployment-instruction holds. Run focused checks for the affected game/component and its actual dependencies, fix failures, then publish through the existing main-branch Pages workflow without asking again. PRs are optional implementation tools; if used, merge passing changes yourself. Direct commits to main are permitted when appropriate, with publication still gated by CI. Do not disable checks or broaden the requested work. Verify the deployment result and report failures or verification limits honestly. Preserve saves, scoring and artwork unless the requested change requires otherwise. This release authorisation does not authorise unrelated changes, purchases or destructive data operations.

Read `HOSTING.md` before publishing or changing CI. `npm ci` installs locked development tools; `npm test` builds/checks the production artifact and selects tests for the changed files beneath the real project URL prefix. The owner explicitly requires focused checks (23 October 2026): test the changed game/component and its actual dependencies; do not run every game after routine updates. See `scripts/test-scope.cjs` and the check plan in `.artifacts/check-plan.json`. A single Alibi HTML/help edit selects Alibi’s browser suite. Shared changes select their dependent component tests. Use `npm run test:all` only for an explicitly requested full audit; unknown runtime paths require a scope mapping rather than silently running everything. Only `dist/` is published by `.github/workflows/site.yml`, after passing checks on `main`. Add new runtime asset types/routes to the build deliberately. Keep credentials out of all client files/artifacts. Authentication forms use the official Supabase client and stay disabled until handlers are ready; friend forms stay disabled until authenticated handlers are ready. Don't claim a public deployment from a Git push, workflow file or environment draft: check successful Pages deployment and the live site. Browser records are origin-specific; preserve the source saves and explain domain migration limits.

## Accounts and cloud-save ownership

Read `ACCOUNTS.md` and `supabase/setup.sql` before changing account behavior. `account-config.js` contains only public Supabase settings. Never add a secret/service-role key or SQL-admin credential to client code. Maintain RLS and revision-checked, auth-derived ownership. `cloud-saves.js` preserves native save formats/scoring. Account activation and guest import are explicit; never silently upload guest saves on login. Keep local guest/per-user backups, restore guest data on logout, and redirect stale game tabs when save ownership changes. Active game pages upload; remote saves are installed only on Account, before returning to games. Do not reintroduce old one-time Daily reset blocks; they destroy freshly restored saves on a new device. Route account redirects through the single guarded navigation helper: auth, ownership and save-generation events can arrive together and must not restart an in-flight navigation. Keep auth/callback/recovery forms, no-JavaScript safety, real PostgreSQL access tests and two-account/device browser coverage. Live account readiness requires owner-applied SQL, redirect URLs and working email delivery; mocked tests do not establish those dashboard settings.

## Friends and private comparisons

Read `FRIENDS.md` before social changes. Codes, requests/acceptance, remove/block and explicit score sharing use constrained Supabase RPCs. Keep the social tables inaccessible directly to browser roles. Do not give friends access to raw `game_saves` or email addresses. Only `friend_scores` returns bounded, completed, synced Daily Arcade records after checking accepted/unblocked/sharing relationships. SQL v1 scoring must stay in parity with `arcade-score.js`/`profile-records.js`, including legacy Stake shuffles, weighted bets/timeouts, Stack Up clamping, Lowball fallback and Sydney's common 120-day window. Use the existing account readiness/RPC bridge rather than another auth client. Clear private UI on logout, errors and identity changes; discard stale responses and preserve unsaved settings during refresh. Retain real PostgreSQL security/parity tests and two-account browser integration. No example friends, guessed scores or claims of anti-cheat ranking.

## Content authoring and new-game scaffolds

Read `CONTENT.md` before changing questions, item pools or prices. `npm run content:studio` is a loopback-only draft/review tool; it must never be shipped or exposed as a public admin panel. `content:report` runs in CI and explicitly reports missing source/price evidence. Source URLs and user-entered measurements are not independent fact verification. Reviewed exports are proposal bundles, not automatic bank importers. Integrate approved proposals deliberately into the authoritative generator/source and audit, then run gameplay/save checks. Keep the frozen original 164 Stake rows unchanged for legacy records, Stack Up descriptions blank, generated Lowball PNGs explicitly mapped, and existing snapshots/seed compatibility intact. Lowball pool/order/price changes need a release compatibility plan; do not reset user Dailies or silently change unfinished items. The inherited price date is not newly verified evidence.

`npm run game:new -- slug "Title"` stages the canonical starter in `game-drafts/<slug>/`, outside the published artifact and homepage. Drafts may be versioned, but only move/register a game after implementing real gameplay, read-only records, documented Arcade scoring, cloud/social allowlists and tested SQL parity. Keep tools, proposals and incomplete games out of `dist/`.

## Universal legal content

Read `LEGAL.md` before changing policies, data handling, trackers, purchases or signup disclosures. The shared static footer must work without JavaScript and preserve explicit relative links. Keep policy claims aligned with actual Supabase/local/cloud/social controls; never invent an operator identity, private support address, deletion feature, retention period or compliance certification. Public GitHub issues are for non-sensitive reports; personal account/data requests require a private route. Update policies before enabling new data processors or monetization.

## Game usability and accessibility

Read `ACCESSIBILITY.md` before game interaction/layout work. Load `game-access.css` after game-specific CSS (included in the canonical starter). Preserve ≥44px primary targets without overlaps, readable questions/instructions, visible focus, roving mode tabs, announced validation/results and keyboard alternatives to dragging. Lowball must not summon a phone keyboard on initial load; its dialogs trap focus within the iframe, also inert the outer background, start at a visible title and restore prior state. Stake inactive-mode expiry must not rebuild the active table or steal dialog focus. Timers retain real wall-clock deadlines and announce thresholds once, not every second. Emulation/tests are not real-device or screen-reader certification. The user authorised the comprehensive audit in PRs; the factual/price result is in `FACTS-AND-PRICES-AUDIT.md`. Continue checking new content and keep human difficulty calibration distinct.

## Shared round feedback

Read `GAME-FEEL.md` for the five-game presentation pass. `game-feel.js`/`.css` are presentation-only: effects must never delay play, modify scores/deadlines/saves or replay on hydration. Respect reduced motion. Stake, Stack Up, Pack and Prior have real optional synthesized sound (off by default), with the toggle bottom-centred; Lowball retains its own sound and generated gems/artwork without a second toggle. Daily milestones compare only earlier available completed Arcade records; no fabricated lifetime bests, tie improvements or practice achievements. Keep replay actions ahead of long explanations while preserving feedback, keyboard focus and original mechanics. New templates should adopt effects only once an actual engine emits outcomes; do not add fake audio to a placeholder. Stake uses custom drawn check/cross tiles with bet amounts on screen, retaining emoji only for copied plain text. Lowball uses the same compact sound-button styling as Stake while retaining its own audio and mute preference.

## Launch roadmap and extended play

Use `ROADMAP.md` to keep work focused on the current stage. The owner requested the whole Stage 1 pass across Pack → Prior → Stack Up → Stake → Lowball; see `PLAYABILITY.md`. Unlimited remains free during development. `practice-session.js`/`.css` provide tab-local shuffled pools and accessible next-round settings. Pack/Prior have difficulty selection; Stack Up/Stake have topics; changes must not replace an active round. Stack Up and Lowball now preserve practice across mode switches; do not reintroduce resets, pause wall-clock timers or put practice totals into Daily history. Lowball has an optional Finish session/New session flow, carries unplayed items forward, and retains its generated artwork/gems/audio. The combined extended-session suite covers 30 practice rounds per game at five widths, plus native-save isolation and continued sessions. This is engineering validation, not human enjoyment/retention evidence. Small-group playtesting follows; the factual/price editorial audit is documented in `FACTS-AND-PRICES-AUDIT.md`; human difficulty calibration remains separate. No subscription prices, payment implementation or new hosting provider were approved by this pass.

## Pack implementation

Pack is the fourth live game, with a provisional name. Read `games/pack/README.md` and `pack-model.js` before changes. Preserve three untimed Daily bags, free Unlimited, explicit fictional weight/usefulness values, unique exact optima and snapshot-based native saves. Arcade score is total earned/optimal usefulness × 100, alongside native usefulness. Root scoring/profile/cloud, Friends, menus and registry all include Pack. Current existing Supabase installations use the latest `supabase/inner-clock.sql` (includes Pack/Prior/Laser); new setup/friends SQL includes both. Do not reapply an older per-game allowlist after newer migrations. Preserve the original six achievement meanings (Clean sweep remains the original three games); Pack adds Nothing wasted. Profile progress totals use nine playable games. Never claim the live migration/deployment was applied merely because code was pushed.

## Prior implementation

Prior is the fifth integrated game, with a provisional name. Read `games/prior/README.md`, `prior-model.js` and the archived review at `design/prototypes/prior/REVIEW.md`. Preserve five untimed earlier-event Daily choices, independent free endless practice, first-pick finality and post-answer date/fact/reference reveals. Native score is correct out of five; Arcade is correct × 20, including completed zeroes. Snapshots, not the current bank, determine historical scores. The 128-event source is `content/prior-events.json`; use `scripts/build-prior-events.cjs`. Pair generation must avoid repeated events, same-year ties and direct related milestones, retain the easy/medium/medium/hard/hard progression and randomize answer sides. Structural/gap tests and reference URLs are not independent factual verification; the completed editorial audit is documented in `FACTS-AND-PRICES-AUDIT.md`. Prior uses the same profile/cloud/Friends/menu/registry contracts. Existing projects run `supabase/inner-clock.sql` last (includes Pack); fresh projects use updated setup/friends. Keep previous achievement meanings; Prior adds Past master. Profile availability totals use nine playable games.

## Laser implementation

Laser is the sixth integrated game, added at the owner’s explicit request after reviewing the eleven-game collection. Read `games/laser/README.md` and `laser-model.js`. Keep four untimed graded Daily boards, two placed mirrors on the first three tiers and original v1 Expert snapshots, three on new v2 Expert boards, immutable first-fire picks, unscored retries/solution reveals and independent free practice. The current 216-board library includes 96 unique three-mirror Experts; all 160 originals are frozen in `content/laser-v1-boards.json`. Expert v2 uses six fixed mirrors/four walls, varied entries, at least four fixed reflections and no lower-mirror shortcuts. Preserve the original outer save version and all existing snapshots/scores; new practice boards are immediate, existing Dailies stay unchanged. The library is exhaustively solver checked; structural tiers are not measured human difficulty. Native score is 0–4 first-fire hits; Arcade is hits × 25. Saved layout/placement snapshots determine history, not claimed booleans/current library. Keep connected beam/text outcomes, keyboard/touch grid controls, shared shell/dialogs and bottom-centred real sound. Profile availability is nine playable games; Light work requires four first-fire hits while older achievements retain their meanings. Existing Supabase projects now run `supabase/inner-clock.sql` LAST (includes Pack/Prior); do not reapply older narrower per-game migrations. Fresh setup/Friends includes Laser. Do not claim live SQL or deployment from local tests. Original prototype is archived outside production. Other collection games are recommendations, not authorized additions.

## Alibi evidence files — current contract (v3)

New games use **128 evidence-led files**, 32 per tier, across stamp matches, paired badge permissions, inventory differences and seal custody. All observations are verified; players match the physical evidence to a catalogue entry and deduce its owner. Each fresh Daily uses all four methods, with a 32-day rotation. Assignment notes are ungraded, and reveals explain the evidence match and deductions. Four untimed cases, first-confirmation finality and correct × 25 Arcade scoring remain.

The 155 v2 visit scenarios and original v1 snapshots retain their original rules, notes, choices and scores. The existing eight-person portrait atlas is unchanged. See [the current Alibi contract](games/alibi/README.md) and [the player-feedback release](PLAYTEST-FEEDBACK.md) for sources, validation and limits.

Before deploying this release to an existing project, apply **`supabase/playtest-feedback.sql` after the previous Inner Clock migration**, or use the updated complete `supabase/inner-clock.sql`. Fresh projects use current setup then Friends. These repeatable migrations support all three Alibi formats and versioned Stack Up scores without rewriting saves, RLS, relationships or sharing settings. Live SQL and deployment are separate from passing repository tests.

## Bouncer implementation

The owner selected number three in the collection ranking: **Bouncer**, now the eighth integrated game. Read `games/bouncer/README.md`, `bouncer-model.js` and `design/prototypes/bouncer/REVIEW.md`. Two untimed Daily doors (Standard then Tricky), eight words each; four free examples identify one of 48 spelling-only policies. Optional probes (up to four per door) lock a correct answer for half credit. Remaining choices are editable until the first immutable list confirmation. Native correct words out of sixteen; Arcade = (correct − tests/2)/16 × 100. Keep real zeroes, snapshot descriptors, saved research/choices and tab-local practice isolated from Daily history. The deterministic 240-door bank is sourced from `content/bouncer-words.json` and `scripts/build-bouncer-puzzles.cjs`; operator semantics are frozen at v1. The Rulebook limits the rule universe; no semantic categories or factual trivia. Rule/puzzle decks avoid practice repetition, with settings applied next door and today’s policies excluded. **Latest complete Supabase upgrade: `supabase/inner-clock.sql` LAST**; it includes all earlier games, all three Alibi formats and both Laser formats. Fresh setup/Friends is updated. Preserve original achievement meanings; On the list requires 16 correct without probes. Live migration and human difficulty testing are separate owner/player steps. No billing or other game was enabled.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, all three Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile, menus, accounts and Friends support nine playable games. The homepage shows only those nine games; the six cancelled placeholder cards remain removed. Public billing and prelaunch human/content/device reviews remain deferred.

## Homepage shelf — owner decision

The owner cancelled all six old placeholder games and requested their removal from the homepage. The homepage now lists only the nine playable games, with no Coming Soon cards/count. Do not restore those cards when adding games. Archived placeholder routes and the reusable development template remain separate from this homepage change.

## Owner-authorised launch audit — 22 October 2026

The owner requested an audit of all nine games, every public menu/control/asset, fixes for clear bugs, player-perspective ranking applied to homepage cards, a month of content, harder highest tiers with easier tiers retained, and an ordered public-launch checklist. The original PR-only hold was superseded by the automatic-deployment owner decision on 23 October 2026 below. The editorial order is Laser → Stack Up → Stake → Alibi → Pack → Bouncer → Prior → Lowball → Inner Clock, subject to later human playtesting. Cancelled games must not reappear in drawers.

`LAUNCH-CONTENT.md` is the proposed current content/rotation contract and supersedes earlier bank-count/difficulty notes once that release is merged. Existing saves, native/Arcade formulas, artwork and scoring remain protected. New Expert Alibi minimum-clue claims require exhaustive subset enumeration; the original greedy estimate is only a frozen-bank compatibility heuristic. See `LAUNCH-AUDIT.md` for evidence/limits and `LAUNCH-CHECKLIST.md` for launch gates. These documents do not establish live configuration or deployment.

## Factual and price audit — 22 October 2026

The owner authorised the factual/price audit and corrections in PRs. Read `FACTS-AND-PRICES-AUDIT.md`, `content/factual-review.json` and `content/lowball-price-review.json`. The completed 22 October editorial review covers all 600 factual records and 400 regional targets, with per-record evidence and explicit limits rather than blanket primary certification. Sixteen Stake overlays apply to new snapshots/practice; freeze the original 164 rows and legacy option reconstruction. Prior years/IDs remain fixed; all 128 explanations were checked and the Japanese Mario explanation names Famicom. Stack Up measurements use coherent RSC and UNdata 2023 conventions (Finland excludes Åland); Ecuador is 257,217km², superseding the interim ministry-only value. Use `scripts/review-question-banks.cjs` to reconcile the retained 208 puzzle IDs/subjects without redrawing them.

Lowball's 100 identities/order/art stay frozen. From 24 October 2026 Sydney, fresh Dailies/practice use all 400 dated regional references (345 changed amounts, 55 matches). The owner asked the audit gaps fixed; named products/providers, published offers/averages and explicit channel/pack/fee scopes now replace generic assumptions. Show the regional definition and evidence-check date before guessing and source links after it. These are dated references, not universal/live prices; recheck volatile listings before launch. Keep the dated overlay shared with Content Studio. New Dailies immediately capture full `pc_progress.items` snapshots; valid captured prices always win and snapshotless drafts retain baseline targets. Preserve zeros, pending receipts, cloud keys and scoring. Current generic Beer/Uber ride/Adhesive plasters display names must retain original internal art/save identities; original 500ml snapshots retain their original label.

## Owner playtest direction — 23 October 2026

The owner says Alibi is boring/confusing and needs deductions beyond being present at an incident, with concrete explanations. Stack Up is too obscure/hard, must open straight into play and must remove the Daily 10× bonus. Read `PLAYTEST-FEEDBACK.md`, `games/alibi/README.md` and `games/stack-up/README.md`; this supersedes the forced-hard-Daily guidance for these games. New Alibi v3 files use verified observations and four physical-evidence mechanisms, with assignment notes and actual step-by-step proofs; preserve all v1/v2 snapshots and their rules. Keep the original generated portraits. New Stack Up Dailies use the 160 familiar lane-based stacks; retain the 208-set harder bank as optional Challenge mix/topic practice. No intro screen. New `scoreVersion:2` Dailies use base points and a 3,100 Arcade denominator; untagged old records and unfinished runs retain their original 31,000 scale. Never rewrite stored old scores or mix denominators in profile/Friends. The schema update is `supabase/playtest-feedback.sql` after the existing Inner Clock update, or the updated complete `inner-clock.sql`; apply live SQL before deployment. Fresh setup then current Friends includes it. Follow the automatic-deployment owner decision below; the earlier PR-only hold is superseded.


## Single instructions entry across all games — owner decision, 23 October 2026

Use only the existing header **?** button to open each game’s How to play dialog. This applies to all nine games, not just Alibi. Do not add duplicate expandable guides or a second instructions entry. Keep useful examples and diagrams inside the help dialog. Keep the full instructions, keyboard opening, modal focus trapping, Escape dismissal and focus restoration in the shared help dialog.


## Retired games hidden everywhere — owner decision, 27 October 2026

Only the ten current games appear in public routes, menus, profile history, statistics, activity and achievements. This supersedes earlier instructions to expose archived games or keep their earned badges visible. Stake, Prior, Alibi and Bouncer and the six cancelled placeholders redirect to the home shelf; their engines and question banks must not ship. Preserve private native saves, cloud data, scoring adapters and repository source for compatibility. Profile totals, averages and streaks are computed only from current games. Source-only legacy browser fixtures use ARCADE_LEGACY_TEST_URL; public removal tests always use the built artifact.


## Game-specific sets and motion — owner direction, 27 October 2026

Give each current game a setting as closely tied to its play as Lowball's shop counter. `game-scenes.css` scopes ten physical visual themes to `data-game-scene`; `game-scenes.js` adds finite local interaction feedback and Sleeper's original score-tower prop. Preserve the shared header, centre line, reset rail, help/stats, native artwork, controls, frozen content, saves and scores. Animations follow actual moves, clue advances, submissions and new rounds; hydration and remote saves must stay quiet. Respect reduced motion, cancel effects on backgrounding, and never delay or disable actions for an effect. Time Sense must remain completely still during timing, with its measurement ahead of all presentation work. No new audio or processors.

Test the ten affected public games, reduced/normal motion, quiet hydration, native save continuity, phone/tablet/desktop layouts and real action/review states. Visually inspect screenshots of the production artifact. The homepage and social top bar are unchanged by these scoped game sets.


## Custom Pack item artwork — owner direction, 27 October 2026

The owner wants upgrades to the actual game graphics, including a custom image for each Pack item instead of emoji. All 43 native item names map to original local SVG illustrations in `games/pack/art/`, shared by the selectable items, suitcase and result recaps. `item-art.js` supplies decorative images beside the native readable labels; unknown historical names use a neutral packing-item drawing. Keep native icon fields in banks and snapshots for validator/save compatibility, but do not render those emoji as item artwork. Preserve every item identity, value, optimal pack, Daily assignment, save and score. Use unbranded crisp geometric illustrations in Break Room's muted palette; the first-aid kit uses a bandage rather than a protected medical emblem. Keep the suitcase viewport stable while adding items, respect reduced motion and verify all image decodes plus actual phone/desktop play and legacy save restoration.


## Custom graphics across the remaining games — owner direction, 27 October 2026

The owner asked for actual game objects as well as themed backgrounds. `game-art.js` decorates nine current games with original local SVGs and visible-label mappings in `assets/game-art/manifest.js`. Preserve Pack item images and Lowball product images. Keep labels, keyboard/touch controls, native content/snapshots, saves, scoring and deadlines intact. Do not derive art from hidden answers, correct positions or scores. Time Sense's stopwatch stays still; a late image decode waits until the attempt ends before showing it. Clue Ladder uses generic explorer/lock props, never hidden-answer imagery. Run native affected game checks, catalog decoding, actual action/save/reload and phone/desktop visual checks before automatic deployment.


## Smooth Desk Jam movement — owner direction, 27 October 2026

Desk Jam furniture must follow constrained pointer pixels continuously and glide to committed grid positions. The native engine owns 220ms slide, snap, Undo and Restart transforms; shared scenes must not add a second furniture transform. Moves, scores and saves commit immediately, with no action lock while animating. Re-grabbing furniture keeps its current visible position. Preserve all controls/boards, quiet hydration/remote updates, reduced-motion fallback and cancellation when backgrounded. Test actual fractional drags, rapid input and saved positions.


## Friends uses fresh synced results — owner correction, 27 October 2026

Friends must await the current own-account upload before reading comparisons. `BREAK_ROOM_ACCOUNTS.sync()` coalesces concurrent callers and drains newer local snapshots that arrive during upload. Refresh visible comparisons after native saves in other tabs; preserve private server-derived scores, first-completion locks, account ownership and explicit guest import. Never substitute arbitrary local/guest records for a signed-in player's cloud scores. Surface failed/inactive sync rather than claiming browser progress is shared.
