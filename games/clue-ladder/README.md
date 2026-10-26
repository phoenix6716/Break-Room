# Clue Ladder

## Player-feedback revision — 26 October 2026

Revision 2 replaces 39 older technology/culture answers with contemporary apps, games, films, music and characters, and makes nine retained ladders' later clues more direct. Examples include TikTok, Bluey, Minecraft, Wednesday and Encanto. The 300-answer/eight-topic/60-day deck keeps every ID, category slot and date assignment; old saved ladders and scores remain authoritative. Historical ID slugs remain authoring slots. See `design/content-reviews/2026-10-26.json` and `tests/content-refresh.cjs`. Familiarity remains a player-testing judgement, not an automated certification.


Owner-approved implementation of `design/prototypes/Clue_Ladder_easier_no_repeats.html`, preserved unchanged outside production. Five untimed Daily puzzles plus free Unlimited. Keep the original ladder and pixel climber with the canonical centred shell, drawer, Sydney reset, mode tabs, ? help, trapped Help/Stats dialogs and universal footer.

## Rules and scoring v1
Each puzzle gives a category and one clue. Type an answer or request Next clue. Wrong guesses and hint requests advance one step. Repeating a normalized guess does not cost another clue. On clue five, a wrong guess or Reveal answer finishes for zero. Solves earn 1,000 / 800 / 600 / 400 / 200 according to clue count. No timer, typewriter delay, speed penalty, 10× multiplier, lives or elimination. Five completed puzzles score out of 5,000; Arcade = points / 50. Zeroes count, incomplete and practice runs do not. First rung requires five first-clue solves.

## Content and matching
`content/clue-ladder-puzzles.json` is authoritative; `node scripts/build-clue-ladder-puzzles.cjs` reproduces the browser bank. Retained authoring rows under the prototype folder document individual creation. Animals, places, food, science, technology and everyday objects have 40 each; culture and sport have 30 each. All 300 answers have five individually authored clues, aliases, a post-answer fact and reference. Editorial review covered familiarity, progression, literal answer leakage, ambiguity and stable facts. References allow follow-up; they are not independent primary-source certification. Human factual/difficulty/device review remains a public-launch task.

Deck v1 assigns five different topics per Daily over 60 Sydney dates, with no answer repeats and bank-order-independent selection. Epoch: 23 October 2026. Future bank changes require deliberate versioning; saved snapshots always win.

Matching v1 normalizes common combining accents, case, punctuation, whitespace, & → and and a leading English article. Canonical names and explicit aliases match exactly. Normalized names of at least six characters allow one insertion, deletion, substitution or adjacent transposition. Whole names are compared; repeated tokens and generic fragments are not enough. Frozen rejects prevent nearby valid answers such as Wallet/Ballet and Carrot/Parrot matching as typos. JavaScript and private SQL share tested semantics. No live AI service or new data processor.

## Saves and Unlimited
`break-room:clue-ladder:daily:YYYY-MM-DD` stores version 1, Sydney day, five full puzzles, current round, committed pick histories, current attempts, input, phase and edits. Each visited clue stores its exact first guess or null hint request. Reconstruct results rather than trusting claimed totals. The completed fifth review counts before opening summary. Save each input/hint/answer/advance, lock review controls, resume on reload/mode change and check newer tabs before writes. Malformed existing saves remain untouched with Account/export guidance. Storage failure uses page memory with a visible warning. Never import prototype summary/best keys.

Owner-scoped sessionStorage holds Unlimited's current puzzle, input, attempts, topic, seen IDs and totals. Every draw excludes today's Daily IDs, including deck refill. Topic changes apply next puzzle. Exhaust each eligible filtered pool before reshuffling; avoid immediate repeats when possible. Practice never enters Daily/cloud/Profile/Friends.

## Integration and validation
Profile is read-only. Friends receives only derived completed Arcade scores through existing opt-in RPCs. Apply `supabase/clue-ladder.sql` to an existing Time Drop project. Current complete Inner Clock and fresh setup/Friends support all eleven formats. Private normalisation/matching/scoring helpers revoke execution from public, anon and authenticated. Existing customer saves, RLS and relationships are preserved.

Focused rule/browser/account/Friends checks cover content/aliases/cross-answer rejection, 60-day rotation, five scoring tiers, zero/partial/malformed results, immutable completion, independent PostgreSQL parity/privacy, complete games at 320/390/768/1100/1440, touch/keyboard, drafts/hints/reviews/reload, source reveals, dialogs/drawer, sharing/failure states, Sydney rollover, two tabs, 296 actual Unlimited puzzles/deck rollover and two-device cloud restoration. CI keeps screenshots/logs. Automation is not real-device or screen-reader certification.
