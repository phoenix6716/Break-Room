# Round, reveal, result, replay

This pass improves the five existing games without changing puzzle selection, scoring, save formats, timers or free Unlimited access. It does not implement subscriptions, billing, new content, progression currencies or a Daily-circuit reward system.

## Shared presentation

`game-feel.js` and `game-feel.css` provide brief stepped reveals, local pixel accents for exceptional outcomes, result meters and a saved-history milestone. Effects never disable an action, delay advancing or write a game result. They are triggered by the local interaction, not by reloading an old result or receiving another tab's save. Reduced motion suppresses the new movement and particles entirely. Color is supplementary to existing text, dates, chips and points.

The Daily milestone compares the actual Arcade score against earlier completed Dailies available to that game. A strictly higher score is a new saved best; a tie is not. No earlier records means the first Daily in the *available saved history*, not a claimed lifetime first. Lowball's retained history is limited; none of these labels claim an all-time global record or percentile. Practice never receives a Daily milestone or changes history.

Stake, Stack Up, Pack and Prior now have real synthesized sound, initially **off**, with a labelled, pressed-state toggle centred below the game. The `break-room:game-sound` preference is local to this browser/origin, shared across these four games and synchronised between tabs. There are no audio downloads or new services. Audio failure or denied preference storage must not block play. New sounds stop when muted or backgrounded. Lowball uses the same shared button styling and Sound on/off label while keeping its existing audio, `pc_sound` preference and generated item artwork/gems; it does not acquire a second toggle or layered shared audio. Its retired speaker images remain archived.

## Game-specific changes

- **Lowball:** faster score count and gem cadence; explicit Next item/See Daily results; immediate continuation before receipt details; Daily milestone; no automatic Stats overlay after completion. Stats remains available from its existing button. Its original sound and generated images remain.
- **Stake:** stepped question reveal and chip settlement; stronger local flourish for a correct three-chip bet; native chips and weighted Arcade score retained. Final results now lead directly to Unlimited without changing the completed Daily or overwriting an existing practice table. Prior unfinished records are not migrated when comparing saved bests.
- **Stack Up:** clean-stack feedback for a correct submission with no earlier mistakes, seconds/mistakes breakdown, next action before the longer fact/order explanation, Daily milestone. The existing positional wrong/correct flashes, wall-clock deadline, penalties and perfect-score maximum remain.
- **Pack:** tactile item selection, locked-pack stamp, explicit usefulness-captured meter after submission and continuation before the optimum/explanation. Final replay/share actions precede the three-bag recap. The meter cannot reveal the optimum while choosing items.
- **Prior:** short event-card/date reveal; next action before the timeline/reference notes; replay/share before the final recap. Dates, sources and explanations still appear only after the immutable choice.

Explanations stay available without another payment, and every next/replay action remains voluntary. No auto-advance, paid boosts, new notifications, streak penalties or advertising was added. Content pacing and question accuracy remain governed by the existing banks and the separately agreed prelaunch audit.

## Verification

`tests/game-feel.cjs` completes all five actual Dailies both with and without reduced motion, checks perfect and honest historical milestones, advances while effects are active, verifies practice isolation, checks sound preference/denied audio/storage, and confirms Lowball never overlays Stats on the final result. Existing responsive, engine, timer, account, cloud, sharing, layout, artwork, profile and security tests remain required through `npm test`.

Browser checks and screenshots establish behavior in the automated browser. They do not measure whether these changes improve retention or revenue, nor certify real-phone audio/accessibility. Listening and playtesting on actual phones remain useful before launch.

## Laser addition

Laser is now the sixth integrated game, with four first-fire Daily boards, free independent Unlimited practice, and unscored retries/solution reveals. See `games/laser/README.md` for the exact snapshot, scoring, controls and tests. Arcade score is first-fire hits × 25; partials and practice do not count. Existing Supabase projects apply **`supabase/alibi.sql` LAST** (includes Pack/Prior); this supersedes earlier per-game migration instructions above. Fresh projects use updated setup then Friends. Live SQL/deployment and human playtesting are separate from local implementation verification.

## Alibi addition — current integration and migration

Alibi is the seventh integrated game, with 144 solver-checked distinct deduction cases, personal ungraded notes, four untimed graded Dailies, final confirmed accusations, concise and expandable reasoning, and independent free Changing/fixed-tier Unlimited. See `games/alibi/README.md` for the exact mechanics, snapshot contract, seven design changes and checks. Native score is correct out of four; Arcade is correct × 25. Real zeroes count; partials and practice do not. The common profile/Friends average now has **seven** available games; Case closed requires four correct and older achievements keep their meanings.

**Current Supabase update: run all of `supabase/alibi.sql` LAST** (includes Pack, Prior and Laser). This supersedes earlier migration pointers above. Fresh projects use current setup then Friends. Do not reapply older narrower migrations. Local tests do not apply live SQL or prove public deployment. Personal notebook data stays inside private native/cloud saves; friend comparisons expose only completed normalized results through the existing sharing controls. The original prototype is archived outside the build. No billing or other collection game was enabled. Structural tiers still need human playtesting before launch.
