# Sound and motion

The ten public games keep their existing gameplay, scores, captured rounds and timers. Effects are short, local and nonblocking. There is no background music, new audio download or third-party audio service.

Nine games use `game-feel.js` and the shared **Sound** control. The existing `break-room:game-sound` preference stays opt-in and carries between those games. Audio is unlocked by a pointer or keyboard gesture, never by page load. Short synthesized cues distinguish picking, moving, placing, rotating, undoing, clearing, locking, revealing, advancing, success, perfect results, misses, timeouts and achievements. Repeated identical interactions are rate-limited; result/achievement sounds take priority. Muting stops scheduled tones and hidden pages do not play cues.

Lowball keeps its existing single control and `pc_sound` preference. Its tone waveform and stepped visual effects are smoother, active tones stop on mute/hide, and newly earned achievements get a brief chime through its iframe's own sound setting. Do not add a second sound control or enable shared sounds in that frame.

Feedback covers actual events: Codebreak keypad/guesses; Desk Jam slides and solved boards; Seating Chart guest placement and table results; Clue Ladder hints, answers and new puzzles; Time Drop year adjustments and reveals; Stack Up live sorting, drops, wrong submissions and results; Pack item choices and bag results; Laser mirrors and beam outcomes; Time Sense stopped attempts; Lowball's existing price reveals and finishes; and new achievement unlocks. Restoring results does not replay these new cues.

Time Sense remains silent and still throughout a running attempt. No sound or animation is emitted then, including inherited entrance effects. Audio contexts cannot be initialized or resumed by a stop gesture before its elapsed time is captured; this also protects a round when a second tab changes the sound setting mid-attempt. Starting an attempt stops any earlier chime; achievement notices pause and stay hidden until the attempt ends. Feedback happens after stopping. There are no timing hints.

Shared reveal, meter and celebration animations use smooth easing instead of stepped movement. Existing Desk Jam glides and Stack Up pointer tracking/preview/drop animations remain intact. Reduced motion disables decorative movement. Effects never disable next/replay controls or wait before accepting a move.

The production builder supplies the shared feedback layer on all nine appropriate top-level game pages and cache-busts its files. Lowball's iframe retains its own integration. Validation includes native Web Audio instrumentation, twelve distinct sound signatures, no-autoplay checks, persistent/cross-tab mute, rate limits, hidden-page suppression, unavailable-audio fallback, Time Sense precision, all affected gameplay and historical-save checks, and mobile/desktop routes.
