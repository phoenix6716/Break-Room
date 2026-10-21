# Bouncer — working name

A word club with a hidden admission policy. Two untimed Daily doors, Standard then Expert for fresh sets from 23 October 2026 (older saved sets retain Tricky), with eight words each. Study two IN and two OUT examples, optionally test up to four target words, then classify the rest. Choices stay editable until **Lock this list**; the first confirmed list is final. Answers and the exact policy appear only after locking. The number of IN words is not fixed/disclosed.

## Fairness and content

This integration deliberately replaces vague semantic categories with **48 precise spelling policies**, covering single properties, AND, inclusive OR and exclusive OR. Only printed letters matter: vowels are A/E/I/O/U, Y is a consonant. Alphabetical order permits equal adjacent letters. Every set of four starting examples identifies exactly one policy from the published, collapsible Rulebook. That is uniqueness within the stated finite rules, not a claim that four examples exclude every imaginable English-language rule.

`content/bouncer-words.json` preserves the prototype's deduplicated vocabulary plus versioned rule descriptors. `node scripts/build-bouncer-puzzles.cjs` reproducibly builds **272 doors**, sixty per easier tier and 92 Experts. Examples and target words never overlap, and compound doors exercise all four combinations of their two component properties. Independent JS and PostgreSQL evaluators verify examples and answers. There are no unverified trivia facts or category memberships in this bank. Human difficulty/enjoyment calibration remains necessary.

Unlimited has Mixed/Warm-up/Standard/Tricky/Expert. Settings apply to the next door, without replacing active research/choices. A rule deck avoids repeating a policy until its eligible tier pool has cycled; today's two policies are excluded. A separate puzzle deck varies words/examples. Research, choices and reviews survive mode switches in the tab. Practice never affects Daily history or cloud records. It is free, with no purchase hooks or prototype comparison codes.

## Score and snapshots

Native score is correct words **out of sixteen**, with tests used shown separately. Untested correct words earn one credit; a tested word locks its correct answer and earns **half credit**. Incorrect words earn zero. Arcade score is **(correct − tests/2) ÷ 16 × 100**. Perfect without tests is 100; all sixteen correct using all eight available tests is 75. A completed zero counts. Tests cannot be undone and do not grant free full-credit answers. Starting examples cost nothing; there is no timer or speed bonus.

`bouncer-model.js` owns the pure version-1 evaluator, validation, deterministic Daily selection and read-only scoring. Keys are `break-room:bouncer:daily:YYYY-MM-DD`. Native state is `{version:1,edits,day,doors,round,phase,picks,probes,answers}`: two full puzzle snapshots, immutable submitted lists, research indices for both doors and an editable active list. Phases are `test`, `sort`, `review`, `summary`. The final second submission completes a Daily before its summary is opened. Snapshot descriptors/words determine all results; claimed scores are ignored. Never change the meaning of v1 operators or regenerate IDs with different data after launch.

Edits save immediately; the monotonic counter advances research/classifications during cloud merges. Round/stage progression outranks previous stages; the first cloud completion wins, rather than the highest score. Same-origin tabs adopt research/submissions and guard stale actions. Sydney-midnight rollover preserves older records. Denied storage falls back to tab memory with a visible reload warning; blocked clipboard provides selectable text.

## Site integration

The canonical centred Stake shell, reset rail, title/stats/tools, left Menu, shared Help/Stats, visible keyboard focus and >=44px targets are retained. All interactions use real buttons; no dragging is required. Optional real synthesized sound is off by default and bottom-centred. Reduced motion, immutable hydration, spoiler-free share text and shared footer/policies apply.

Homepage/registry, menus, profile, shared averages, cloud ownership and Friends include Bouncer as the eighth available game. **On the list** requires sixteen correct words without testing; previous achievement meanings are unchanged. Working names remain provisional. The original upload is archived in `design/prototypes/bouncer/original.html`, outside production, with review notes alongside it. Prototype storage keys and answer-encoding links are not imported or erased.

Existing Supabase projects run **all of `supabase/inner-clock.sql` LAST**, after setup/Friends. This complete upgrade includes Alibi scenarios and three-mirror Laser Expert, so earlier per-game updates need not be reapplied. Fresh projects use current setup then Friends. The update extends the game/key allowlist and independently derives private completed scores; RLS, revision checks, auth-derived ownership, existing relationships and other game saves remain intact. Applying or verifying live SQL requires the project owner; code and local tests do not do that. A missing upgrade leaves browser play intact and displays a clear cloud-save error.

## Verification

`tests/bouncer-rules.cjs`: all 272 doors, 48 policies against an independent spelling evaluator, uniquely identifying examples, 400 seeded Dailies, zero/perfect/test-credit combinations, malformed snapshots, read-only profile, cloud progress/conflicts and real PostgreSQL parity, repeatable upgrade, other-game continuity, RLS/anonymous/ownership boundaries.

`tests/bouncer.cjs`: complete games at 320/390/768/1100/1440, optional research/half credit, editable blind classifications, finality, draft/review/result reloads, independent practice/decks/settings, menu/dialog keyboard behavior, focus/target geometry, profile/copy, Sydney rollover, touch, shared tabs and storage/clipboard failure. Existing account tests restore real Bouncer research and sorting drafts on a second browser and isolate users; Friends database tests compare all eight games at the exact 120-day boundary under the existing sharing/block rules. These checks are engineering validation, not human playtesting or screen-reader/real-phone certification.

## Launch content release — 23 October 2026

Read [the release contract](../../LAUNCH-CONTENT.md). New selection applies to fresh Dailies from 23 October 2026 and to newly requested practice rounds. Existing snapshots, drafts, native scores and completed history stay unchanged. The original banks remain available for compatibility; harder content and deterministic rotation must not regenerate an active run.
