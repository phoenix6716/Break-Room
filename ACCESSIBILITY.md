# Game usability and accessibility

This pass covers the three live games (Lowball, Stake and Stack Up), shared game navigation and the canonical starter. It preserves native/Arcade scoring, seeded questions, generated artwork, save formats, timers and the centred shell/reset rail.

## Implemented behavior

- `game-access.css` provides visible keyboard focus, 44px game controls, larger game instructions/answer text and wrapping Stack Up move controls. Compact phone headers keep title, centred stats and the two tools on one row; 320px headers use a 118px stats column so tools do not overlap. Circular Stake chips and Lowball's bottom-centred sound control are retained.
- Lowball does not automatically focus its price field on load. Keyboard advancement focuses the next price field; touch advancement focuses the item label without summoning a keyboard. Blank/nonpositive/nonfinite guesses produce an announced visible error and do not submit. Receipt and completion messages expose real score/price information to assistive technology; final keyboard focus moves to Copy result.
- Lowball's Help/Stats dialogs start at their title, keep focus inside visible controls, make the game and outer iframe background inert, and restore focus/inert/scroll state on close. The delayed first-visit help stays out of the way after play/navigation starts. The title start avoids focusing a button below the fold in short landscape windows. `frame.js` accounts for visual viewport resize/scroll (including keyboard viewport changes), and the panel remains scrollable. Escape and backdrop dismissal remain available.
- Lowball's region picker exposes its controlled list, active option and selected region. Arrow keys navigate; Home/End move to endpoints while open; Enter/Space commit; Escape cancels and Tab closes. All three games expose their selected mode with one tab stop and arrow/Home/End navigation.
- Stake moves focus to the visible answer review after an active timeout, preserving the same lost-bet mechanics. A timeout in the other mode no longer rebuilds the active table and discards focus. Dialog focus is never stolen. New questions/reviews scroll into view when they would otherwise be off-screen.
- Stake and Stack Up issue one short warning near ten seconds instead of announcing a ticking clock every second. Stack Up starts new stacks at the visible question, then Tab enters the cards. Card descriptions reference the ordering prompt, including after moving them. It retains arrow-key moves, labelled touch buttons, positional text/checks and shared dialog controls.

## Verification

`tests/mobile-access.cjs` exercises actual touch-emulated 320×640, 390×844 and 844×390 screens, full Lowball play, target geometry, iframe/inner dialog containment and restoration, visible initial dialog focus, region/mode controls, validation, real receipt/final announcements and focus, visible Stake questions, and Stack Up touch/keyboard sorting. Controlled-clock checks cover both Stake modes expiring at different times, focus preservation, dialog protection and single timer warnings. Existing suites cover complete games, 320/390/768/1100/1440px geometry, midnight/DST, keyboard/touch, feedback, sharing and account/save isolation.

These are browser automation and structural checks, not a claim of WCAG certification or exhaustive screen-reader/device testing. Mobile emulation cannot reproduce an actual iOS/Android keyboard, browser chrome or touch feel. A final real-phone check should include portrait/landscape play, decimal keyboard/currency entry, opening/scrolling/closing Help and Stats, rotating with a question open, region selection, all sorting controls and returning after a timed game was backgrounded. Check with VoiceOver/TalkBack before claiming support for those specific assistive tools. Do not require every game to fit on one screen by shrinking text or touch controls.

## Future games

Load `game-access.css` after game-specific styles and use the canonical starter. Preserve visible focus, readable questions, ≥44px primary controls without overlapping targets, explicit labels/status feedback, modal focus restoration, selected tab/panel semantics and a keyboard alternative to dragging. Keep timers off continuous live announcements; announce meaningful thresholds/results. Test error, timeout and completed states as well as the empty board. Use the actual content and save adapters; do not invent demo records for accessibility UI.

## Pack

Pack uses real labelled toggle buttons with `aria-pressed`, live over-capacity errors, a labelled capacity meter, disabled empty/overweight submission, keyboard result focus, mode tabs and the canonical inert/trapped Help/Stats dialogs. It has no timer or fake audio control. `tests/pack.cjs` covers five widths, touch and keyboard play, focus, menus/dialogs, full Daily review/results, saved-state reload, Sydney rollover and storage failure.

## Prior

Prior uses two large real choice buttons, with dates/facts/references revealed only after the immutable choice. The earlier/later colors are accompanied by explicit text and your-pick labels. Review headings receive visible keyboard focus; year-gap/timeline text is readable without color or dragging. Reference links explain that they open a new tab. Five labelled progress marks describe each committed result. The canonical keyboard modes, inert/trapped Help/Stats, left menu, visible focus and common reset are retained. It has no timer or fake audio control. `tests/prior.cjs` covers complete responsive games, real zeroes, keyboard/touch, same-origin tabs, saved reviews, snapshot stability after bank reordering and denied clipboard/storage.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/alibi-scenarios.sql`, then `supabase/laser-expert.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi scenarios — current contract (v2)

The owner approved real scenarios grounded in incidents, timelines and evidence, plus generated men’s/women’s portraits. Alibi now selects **96 new evidence-dependent visit-reconstruction cases**, 24 per tier. Only the culprit’s account is false; everyone else’s account and the verified records are accurate. The incident window determines the relevant visit. Both records and accounts are necessary, and each case has one complete reconstruction. This supersedes the original abstract false-count rules for **new** cases. Personal notes remain ungraded; four untimed Dailies, first-confirmation finality and correct × 25 Arcade scoring are unchanged.

Eight illustrated portraits were generated as an image atlas and encoded as an optimized WebP; CSS selects a cell. New snapshots store stable, distinct random portrait assignments, unrelated to guilt. Existing original-format drafts/notes/completions/history keep their original rules and scores; new scenarios are available in Unlimited immediately and the next fresh Daily. The frozen 144-case original bank and tests remain outside production. Read `games/alibi/README.md` for exact source, schema, behavior and compatibility.

**Current upgrade order: run `supabase/alibi-scenarios.sql`, then `supabase/laser-expert.sql` LAST.** If the Alibi update is already applied, run only the Expert update. It includes all earlier games and both Alibi parsers. Fresh projects use current setup then Friends; do not reapply old narrower migrations. Personal raw snapshots/notes remain private; Friends expose only completed normalized records through existing sharing controls. Human playtesting and the separately agreed prelaunch audit remain necessary. No billing or other game was enabled.
