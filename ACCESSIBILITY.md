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

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/bouncer.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Single help entry across all games

All nine games use their existing header **?** button for How to play. Duplicate expandable guides have been removed from Stack Up, Pack, Prior, Laser, Bouncer and Inner Clock, following Alibi. Preserve full dialog instructions, Laser’s mirror diagrams, keyboard opening, focus trapping, Escape and focus restoration. The affected game suites check that only one help button exists and no duplicate quick guide remains.

## Alibi evidence files and help

Alibi uses the header **?** button as its only How to play entry. The full shared help dialog retains a labelled modal, keyboard opening, inert background, focus trapping, Escape dismissal and focus restoration. Do not add a duplicate expandable quick guide.

New v3 files use verified observations and four physical-evidence methods, with readable catalogue marks/measurements, assignment notes and explicit culprit explanations. Names, portraits and colours alone are never clues. Existing v1/v2 snapshots retain their displayed rules and notes. See [the current game contract](games/alibi/README.md) for the bank, scoring, compatibility and database migration guidance.

`tests/alibi.cjs` checks the single help entry and keyboard opening/closing alongside full legacy game flows at five widths. `tests/playtest-feedback-ui.cjs` covers modern evidence cases, notes, saved state, explanations and responsive layouts.

## Bouncer addition

Bouncer is the eighth integrated game: two untimed Daily secret spelling rules, eight words each, four free starting examples and up to four optional tests per door. Correct untested words earn one credit; tested words earn half. Native correct words out of sixteen is retained, alongside Arcade **(correct − tests/2)/16 × 100**. Only the first confirmed lists count; completed zeroes count, partials/practice do not. Existing records and achievement meanings stay intact. Read [the game contract](games/bouncer/README.md) for the 240-door bank, finite Rulebook, accessibility, snapshots and independent checks. Existing Supabase projects run **`supabase/bouncer.sql` LAST**; it includes all previous game updates without deleting saves/relationships. Fresh projects use current setup/Friends. Owner-applied live SQL and human playtesting remain separate from local checks.

## Inner Clock — current ninth-game contract

Inner Clock (`games/inner-clock/README.md`) is the ninth playable game; its name remains provisional. Five blind Sydney-date targets use monotonic measured milliseconds, immutable stopped attempts and free cancellation of unfinished timers on interruption. Unlimited offers Mixed/Short/Medium/Long nonrepeating practice and never changes Daily history. No stopwatch animation, ticking sound or reset countdown is visible during an attempt. Native average absolute miss in seconds is lower-is-better; profile native best must use minimum and three decimals. Arcade score averages `max(0,100*(1-absoluteMiss/(target*.25)))` across five, with zero-credit 30-second safety timeouts. Header Best remains maximum Arcade score. In sync requires five misses within 2%; older achievements keep their meanings.

**Current complete existing-project update: run `supabase/inner-clock.sql` LAST.** It includes all earlier games, both Alibi formats and three-mirror Laser Expert, preserves data/RLS, and supersedes earlier narrower migration instructions. Fresh setup then Friends also supports nine games. Repository tests cannot apply live owner SQL. Private comparisons derive completed scores from snapshots; raw timing data stays private. Profile/menus/homepage/accounts/Friends include nine playable games and six coming-soon cards. Public billing and prelaunch human/content/device reviews remain deferred.
