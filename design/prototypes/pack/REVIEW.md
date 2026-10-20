# Pack — early prototype review

20 October 2026. Working title only. The user explicitly says incoming games are early versions requiring improvement, all names can change, and feedback should be candid. `original.html` preserves the supplied file unchanged. This is an unpublished review, not a production game or approved final rule set. Comments marked HOOK in the upload are not requested features.

## Core idea and verdict

Choose items with displayed weight and point values to maximize points under a bag weight limit. The prototype offers three untimed Daily bags, one-bag Unlimited practice and challenge-code comparisons. Each puzzle has one optimal pack; the result reveals it and scores the selection against that maximum.

This is worth developing. A compact optimization puzzle adds a useful type of reasoning to Break Room. The current experience is quite numerical and needs a stronger reason to care about the items. Random points across generic objects make the packing theme feel decorative. Players could also expect spatial suitcase packing from the name; the introduction/visuals should communicate the actual weight-and-value game clearly. The current list and theme are early material, not a final art direction.

## Findings from this file

- The fixed bank has 66 bags with five to eight items. Enumerating feasible combinations confirms each stored maximum has one corresponding pack. The generator explicitly rejects a best-points-per-weight greedy solution being optimal.
- Nevertheless, greedy selection already receives at least 90% on 58 of the 66 bags. Its shortfall is only one to six native points, averaging about 1.86. This does not measure human difficulty, but exposes weak separation between a simple heuristic and an optimum.
- The item point values are randomized, rather than grounded in a trip or need. Three item appearances in the bank are too heavy to fit even alone. Some easy eliminations are fine, but should be deliberate rather than accidental filler.
- The explanation compares the optimal pack to a generic greedy pack, even when the player chose something else. Personalized swaps and point/weight differences would teach the actual mistake.
- A full three-bag browser run using optimal selections scored 100%. At 390px there was no horizontal overflow or browser exception in that run. Selecting an item then refreshing lost the unsubmitted selection; completed bag masks survive.
- Dates/reset use the device's local calendar; Break Room requires Australia/Sydney. Storage accepts weakly validated submitted masks, omits current selections/review phase and relies on a regenerated bank instead of versioned puzzle snapshots. Share links still use example.com. Clipboard fallback can report success without checking execCommand's result.
- The separate Compare tab and whole-view live region need integration/accessibility work. A shared code encodes selections; it is not secure competitive proof. The current empty-board screen also needs a clear one-sentence objective.

## Recommended starting design — proposals, not approved changes

Keep three untimed Daily bags and free Unlimited. Give the Daily a deliberate easy/medium/hard progression, with curated or bounded generated puzzles validated by an exact solver. Preserve unique optima and require more meaningful trade-offs rather than making every item list longer. Expand/version the content before launch so 66 shared Daily/Unlimited bags do not become familiar quickly.

Use themed trips such as camping, a beach day or a weekend away, with scenario-specific usefulness points. Clearly identify weights/values as puzzle values rather than factual retail/product specifications. A visible bag and selected-item tray can make choices tangible without introducing a new spatial-fitting mechanic. Do not silently turn this into a Tetris-style packing game or add a timer: those would change the core rules.

Show live capacity, selected items and total points, then explain the player's actual choices against the best possible combination. Keep native points; the prototype's total-earned / total-available ratio is a natural bounded Arcade score candidate, to be documented and tested when integrating.

## Integration map

Follow `CONTENT.md`, `design/GAME-LAYOUT.md` and `ACCESSIBILITY.md`. Stage the canonical shell outside publication; implement real Daily/Unlimited state, selection/review snapshots, exact solver checks, Sydney rollover and storage failure behavior. Use the shared Help/Stats, centred header/rail, left Menu and footer. Decide how challenge links fit the existing Friends flow without making a third main mode the default automatically. Add a read-only profile adapter, scoring/version contract, cloud game/key allowlists and SQL friend-score parity, with real database/security and full game tests. Register/publish only after the game is fully playable. Working titles can change independently of stable save IDs.

No live game, account schema, scoring formula or homepage card was changed by this review. The final all-game content audit remains scheduled before launch; new generated puzzles still need mathematical validation as they are added.
