# Alibi generated portraits

`source/coworkers.png` is the original AI-generated illustration atlas created for this project: four men on the top row, four women below, equally spaced in four columns and two rows. The original output is also preserved in `/workspace/generated_images/exec-e52f91e0-e174-4dcf-ad9a-16cb426a449c.png` in the creation workspace. Portraits are fictional adult coworkers; no appearance implies guilt.

`coworkers.webp` is the same image encoded with Sharp WebP quality 85, effort 6. No portraits were drawn, altered or generated in code. CSS selects one atlas cell at a time, using background-size 400% 200% and the stored portrait index 0–7. The original PNG is excluded from the published build by the existing `source/` exclusion. Keep the 4×2 arrangement and square cells when replacing the atlas.

Each new scenario snapshots distinct randomly assigned portrait indices. Men’s/women’s portrait pools are shuffled separately from the names; the cast includes both. Assignments are stable across selection, notes, reveals, reloads, cloud saves and history. Original-format snapshots use a deterministic per-case fallback. Portraits are decorative next to real text names, and never evidence or an accessible-name replacement.
