# Deep Cut — standalone prototype v2

Working title for the owner's Pointless/Krillion-inspired game. This is a test file, not a tenth live Break Room game.

## Play
Open `index.html` directly in a browser. It contains all CSS, JavaScript, the Sydney clock and the answer bank; no server, installation, account or internet connection is needed to play. External reference/Break Room links are optional.

- Five questions per replayable Daily preview, 30 seconds per revealed question.
- Type in one answer box. Enter or Submit accepts only a listed answer. Unlisted guesses show “Not in the answer list. Try again.” and leave the original timer running. Clear, unambiguous typos correct to the listed answer.
- A listed saved draft locks automatically at the deadline; otherwise the question ends with no accepted answer and zero points. Refresh, mode changes and Help do not pause/reset the clock.
- Higher is better: designer-assigned 20/40/60/80/100 answer ratings, zero only when time expires without a listed answer. Final score is the five-question average out of 100.
- New question scores count up over 950 ms on reveal. Reduced-motion users see the final score immediately. Saves lock before animation; Next stays available, and refresh does not replay old reveals.
- No survey, panel, measured popularity or percentile claims. These are provisional editorial ratings.
- Menu → choose set 1/2/3 → New Daily test makes repeat testing quick.
- Unlimited shuffles 15 prototype prompts / 146 accepted answers, with aliases and guarded typo matching. Topic changes apply next question.
- Copy feedback after any reveal to report missing answers or ratings you dislike.

Local-only state uses `br-prototypes:deep-cut:v2`. Saves and stats do not touch official Break Room records. At most 20 completed Daily test runs are retained. Old v1 test saves remain untouched. Questions, the input, retry feedback, deadlines and locked results survive refresh where the browser permits storage. Denied storage keeps the test playable in memory.

## Scope
Uses the actual centred Stake shell styles, left drawer, header Streak/Best/Played, Daily/Unlimited controls, Sydney reset rail, ?-only help and stats dialog. Everything is embedded for portability. Header account integration is replaced by a clear prototype badge. No official leaderboard, cloud/Friends, registry, homepage card, purchases, telemetry or live AI judge.

The name, single-answer mechanic, ratings and small test bank remain subject to feedback. This is three repeating five-question sets, not a month-long release library. Initial factual scope/reference checks are not a comprehensive content audit or human difficulty calibration.

## Fast iteration
Edit only this draft file. Keep the prototype in branch `prototype-deep-cut` under `game-drafts/deep-cut/`, outside the production artifact. The branch-only `deep-cut-prototype.yml` workflow tests this prototype, packages the HTML for download and retains screenshots. It never invokes the live-site build, deploys Pages or changes Supabase.

`node game-drafts/deep-cut/check.cjs` checks the model and Chromium interactions using the repository's locked Playwright dependency. It covers 320/390/768/1100/1440px, timers, first locks, averages, invalid-answer retries and canonical correction, refresh/mode persistence, alias/typo handling, modal/drawer focus, deck refill, storage/copy fallbacks, save isolation and direct offline HTML loading. Physical-device and enjoyment testing remain for the owner.
