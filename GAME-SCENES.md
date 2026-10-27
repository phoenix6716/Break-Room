# Game settings and motion

Each current game has a physical setting built around its mechanics: Laser's optical breadboard, Time Drop's archive and date readout, Clue Ladder's bound clue notebook, Seating Chart's reception table, Desk Jam's office plan, Sleeper's quiz-show console, Stack Up's sorting desk, Pack's canvas luggage, Lowball's shop counter and Time Sense's quiet instrument.

`game-scenes.css` is scoped to static `data-game-scene` attributes; the normal game remains readable and playable without the presentation script. Original native products, furniture, pixel climber, era art and topic icons are retained. Sleeper's decorative radar is replaced by an original score-tower prop, with no sample statistics. The shared header, modes, reset rail and help/stats remain in their established geometry.

`game-scenes.js` observes native surfaces and animates only after local interaction. Card reordering and furniture moves interpolate actual positions; clue advances move the original climber, placements settle into seats, item tags enter the bag, date reviews stamp onto paper and completed answers reveal their real feedback. Effects never alter data, add sound, disable controls or await completion before advancing. Reloads, remote saves and backgrounded tabs stay quiet. Reduced motion cancels active effects and suppresses movement.

Time Sense registers presentation listeners after the native timing handler. The entire page remains motionless during an attempt; no dial, light, background, countdown or sound supplies a timing cue. Its measurement and save rules are unchanged.

`tests/game-scenes.cjs` exercises actual controls in every game with normal and reduced motion, checks quiet reloads and unchanged saved results during effects, verifies Time Sense's still running DOM, and captures mobile/desktop/review contact sheets under `.artifacts/game-scenes`. Native affected game suites continue to check scoring, saves, practice, keyboard/touch, dialogs and responsive layouts. Screenshots support visual review; browser emulation does not establish physical-device certification.
