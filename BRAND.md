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

# Break Room identity

## Approved Break Room logo — owner decision, 25 October 2026

The owner chose **option 05**: four stepped, overlapping blue/lime/coral/yellow tiles with navy outlines and a short hard shadow, alongside the bold stacked **Break Room** wordmark. This supersedes the original equal four-square placeholder and the unselected concept boards. Use the supplied approved assets rather than recreating the lettering or substituting another option.

Production assets: `assets/break-room-wordmark.png`, `assets/break-room-mark.png`, `assets/break-room-icon.svg` and `assets/break-room-touch-icon.png`. `assets/favicon.svg` and `assets/logo.svg` retain compatible URLs. The transparent master is archived in `assets/source/break-room-option05.png`, excluded from production. With Sharp 0.34.5 available, `node scripts/export-break-room-brand.cjs` reproduces the exports.

`scripts/site-brand.cjs` applies accessible static logo links, favicon/touch links and `brand.css` during the production build, including nested game routes and JavaScript-free pages. Keep the accessible brand name and Home destinations. At phone widths use the compact supplied wordmark while preserving 44px link targets and clear Menu/Account controls. Do not change game banks, Dailies, save identities, scores, artwork or account configuration for a branding change. Verify shared headers/navigation at affected widths, rather than replaying every game.


The final site name remains **Break Room** (two words). Keep the existing warm cream/grid backgrounds, navy outlines, rectangular panels, hard shadows and muted playful colours. The website's own approved identity is permitted; third-party logos and protected emblems remain excluded from game artwork.

## Approved homepage card artwork — owner decision, 26 October 2026

The owner approved the second, flat pixel-style ten-card preview after rejecting the glossy cartoon direction as looking AI-generated. Use crisp geometric sprites, solid muted fills, navy outlines and hard shadows close to the games' actual graphics. No glossy cartoon scenes, realistic hands/faces, third-party logos or branded packaging. The approved master is `assets/source/homepage-cards-pixel-approved.png`, excluded from production; `scripts/export-homepage-cards.cjs` uses Sharp 0.34.5 to reproduce the exact panel crops as lossless WebP under `assets/cards/`. Do not regenerate/redraw the approved art during exports. The board's captions and gutters are not part of the shipped card images.

Homepage titles, descriptions and play links remain real HTML. Treat the images as decorative because the adjacent text identifies each game. Keep the original responsive artwork heights, sharp pixel scaling, complete subject silhouettes at every supported width, and the ten existing routes/order/Daily progress. Changes here do not alter game engines, content, saves or scoring. Validate the homepage artwork, image loading, mobile/desktop layout and navigation; no full-game sweep is required.

