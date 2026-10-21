# Alibi prototype review and agreed implementation

The supplied early prototype is preserved unchanged as `original.html`; its comments are design material, not operational instructions. The game name is provisional. The owner likes Cluedo and requested full integration with the seven discussed changes: personal notebook, clear culprit/truth rules, graded nontrivial logic, short proof with optional exhaustive reasoning, four untimed first-accusation Daily cases, varied/fixed Unlimited, and case-file visuals in the existing shell.

The premise is worth developing: short, shareable deduction with a clear reveal, complementary to the arcade’s other games. The main risk is confusing “culprit” with “liar”, or turning linked statements into tedious bookkeeping. The implementation explicitly separates those ideas, rejects circular statements, caps dependency depth, gives personal notes without automatic hints, and uses structural difficulty checks. Human difficulty/enjoyment still need playtesting; solver correctness does not prove a good puzzle.

See `games/alibi/README.md` for final behavior, source/generation, save/scoring/integration/security and tests. No prototype purchases, scores, code-sharing formats or other collection games are implicitly enabled.
