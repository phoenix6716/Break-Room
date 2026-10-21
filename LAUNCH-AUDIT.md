# Break Room launch audit

Audit baseline: main commit `6783f46`, with navigation/theme fixes proposed in PR #2. Prepared 22 October 2026 (Australia/Sydney).

## Evidence and limits

This is an engineering and editorial assessment, not a player study or launch certification. Source inspection covered all nine game contracts, pure models, bank generators, native score/save integration, shared navigation, public account/profile/Friends/policy pages and the existing regression suites. PR #2 passed GitHub Actions, including the new five-width public-surface checks. No live Supabase dashboard, real email, physical-phone or screen-reader verification was performed. The managed workspace failed to provision; do not describe connector-side JavaScript checks as local browser testing.

The expanded content/difficulty work is a separate proposed release. Its CI and deployed status must be recorded before treating that work as accepted.

## Player-perspective ranking

This order is used by the proposed homepage and game drawers. It weighs clarity, satisfying decisions, skill ceiling, replay variety and friction; it is an editorial judgement, not measured preference or retention.

| Rank | Game | Strength | Main weakness | Most useful improvement |
| --- | --- | --- | --- | --- |
| 1 | Laser | A clear goal, visible cause/effect and genuinely learnable spatial reasoning. | First-fire scoring can punish a small control mistake; repeated route structures weaken discovery. | Curate deeper unique Expert routes; keep unscored retry/solution exploration and test mirror controls on real phones. |
| 2 | Stack Up | Immediate interaction, several decisions per round and satisfying positional feedback. | Obscure factual sets can feel like guessing; a pure speed increase would compound that problem. | More distinct sourced sets and exact numerical challenges; retain readable labels, keyboard movement and the 90-second deadline. |
| 3 | Stake | A familiar trivia loop with meaningful confidence/risk decisions. | Three-choice questions permit lucky runs; betting can outweigh knowledge in the native total. | A more demanding final question from the sourced bank, clearer factual provenance, and no score/formula changes. |
| 4 | Alibi | The most substantial deduction and strongest narrative identity. | High reading load; a generator heuristic can overstate how many clues are actually necessary. | Exhaustively measure the smallest sufficient clue subset for new Experts, retain personal notes and concise proofs. |
| 5 | Pack | Transparent rules, meaningful trade-offs and useful personalised result feedback. | Eight-item hard bags can be brute-forced; repeated travel premises add little novelty. | Ten-item hard bags with unique optima and greedy traps; keep easy/medium bags and fictional-value disclosures. |
| 6 | Bouncer | Distinctive, accessible word deduction without a timer. | Memorising the finite Rulebook can collapse the challenge; spelling-rule ambiguity must remain explicitly bounded. | Advanced target lists that exercise every compound truth case; keep uniquely identifying examples, unchanged operator semantics and optional half-credit tests. |
| 7 | Prior | Very low entry friction and a useful historical reveal. | Binary choices have a low skill ceiling; a close date gap alone is not proof of human difficulty. | Tighter final comparisons, broader world-history coverage and independently verified milestone wording. |
| 8 | Lowball | Strong artwork, an approachable premise and a satisfying receipt reveal. | Price/region ambiguity undermines trust; the inherited estimates are not verified current prices. | Verify exact products, markets, taxes and price evidence before expanding the bank; preserve generated artwork and seeded-save compatibility. |
| 9 | Inner Clock | An immediate novelty with clean, input-focused execution. | Limited decision depth and frequent reuse of timing ingredients; extra waiting is not a good substitute for challenge. | Retain the short-session role, test input latency/interruption on physical devices, and use playtesting to decide its launch prominence. |

## Concrete findings

- Cancelled game cards were removed from the homepage, but every game drawer still advertised those six games. PR #2 removes the links consistently and preserves archived routes.
- Homepage and drawer ordering was historical integration order. PR #2 applies the editorial ranking above and renumbers the visible shelf.
- The style guide's paper/ink and blue/lilac/lime swatches did not match their labels. PR #2 corrects them.
- A legacy friend-code CSS border declaration was malformed. PR #2 repairs it; the shared current theme remains authoritative.
- The build's default social URL and the contact issue link still used the old repository path. PR #2 corrects them.
- Large banks did not guarantee variety: independent per-date random selection repeats individual Pack, Laser, Alibi and Bouncer puzzles inside a 32-day window. Prior repeats pairings too.
- Alibi has only 24 baseline cases per tier. It cannot provide a different case at each tier every day for a month.
- Alibi's original greedy clue-removal heuristic is a sufficient-set estimate, not the true minimum across all subsets. New difficulty claims must use exhaustive subset checking; existing saved cases/scores must not be rewritten.
- Stack Up has 112 sets, all labelled hard. A claim of 32 days without repeating individual sets needs at least 160 appropriately scheduled sets.
- Lowball has 100 products and four guesses per day: 25 complete pool-days. Different four-product Dailies can last beyond a month, but a promise of no repeated individual product for 32 days would require at least 128 verified products plus matching artwork and a compatible release.
- Inner Clock generates target combinations; it does not have a finite story/question bank. Individual durations recur. Distinct Daily sets do not imply entirely new ingredients.
- Runtime code and mocked tests cannot establish that the complete Inner Clock SQL update, callback allowlist, SMTP or live two-account sharing work.

## Content and difficulty release acceptance

Use 22 October–23 November 2026 inclusive as the initial 33-day check: preserve the current Daily and supply 32 fresh following sets. Also test later windows; the generators must not expire at the end of that period.

For Stake and Stack Up, avoid repeating the individual question/set during this window. For Pack, Laser, Alibi, Bouncer and Prior, avoid repeating individual puzzles/pairings, excluding cosmetic reskins as additional logical content. Lowball and Inner Clock may reuse products/durations in different Daily sets; disclose that limit rather than inventing unverified products or claiming infinite novelty.

Harder content must enter fresh Dailies/practice without replacing existing drafts or history. Keep easier tiers, native scoring, the 0–100 formulas, timers, generated artwork, guest/account ownership and private Friends boundaries. Document any changed final-round tier in Help. Stronger structural metrics are not calibrated human difficulty.

## Interaction and visual acceptance matrix

For every playable game: ready, playing, review, complete, resumed, Daily/practice switch, settings applied next round, help/stats open/close/focus, drawer open/close/backdrop/Escape, sound where implemented, copy fallback, denied storage, same-origin tabs and Sydney-midnight/DST.

For shared pages: guest/authenticated/error/loading states; sign-up/login/confirmation/reset; explicit cloud activation/import/sync/logout; profile read-only behaviour; Friends request/accept/share/revoke/remove/block; static policy/footer links. Never trigger real invitations, payments or email merely to fill an automated audit row.

At 320/390/768/1100/1440px: cream/grid surface, navy outlines, rectangular controls, hard shadows, muted colours, readable questions, visible focus and usable touch targets. Preserve Stake's circular chips, Lowball's generated products/gems and the game-specific boards. Check active, hover, selected, disabled, error and modal states, including the Lowball iframe. Old CSS strings or archived artwork are not evidence of a visible theme regression; computed styles and screenshots decide.

## Outstanding launch blockers

See [the ordered launch checklist](LAUNCH-CHECKLIST.md). No payment provider, prices, paid feature, analytics service or new game is approved by this audit. All changes stay in PRs until reviewed.
