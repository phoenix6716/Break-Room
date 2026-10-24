# Break Room game integration

The canonical baseline is the current Stake shell and newer integrated engines. The former Midnight Arcade placeholder-template handover was outdated: accounts, cloud saves and private Friends are implemented, and the six placeholder cards remain removed. Use AGENTS.md and the current game contracts as source of truth.

1. Prototype outside production until the owner approves integration. Keep the supplied/prototype source archived; do not import test scores into official history.
2. Implement a pure versioned model, stable scoped content, deterministic Sydney Daily sets, frozen snapshots, immediate durable first locks and separate free owner-scoped Unlimited.
3. Use the centred shared game shell: left drawer, common header/stats, Daily/Unlimited, Sydney-midnight reset rail, ?-only help, accessible dialogs and shared footer. Keep visual effects independent of scoring, timers and saves.
4. Add a truthful registry entry and themed shelf art only when playable. Wire navigation, generic redirects, read-only profile records, native/Arcade scoring, accounts, private Friends and content generation.
5. Preserve existing saves and SQL security contracts. Test new cloud paths against real PostgreSQL, two-account ownership, revision conflicts and private sharing gates. Hidden Gem uses its own private table/RPCs so earlier save rules are not rewritten. Read ACCOUNTS.md, FRIENDS.md and games/hidden-gem/README.md.
6. Map new files to focused tests; check affected game, menu/profile/account/social interactions and mobile widths. Automatically deploy authorised completed work after checks and required live migration; verify the published artifact separately. Do not run every game after routine isolated updates.

Current roster: Laser, Time Drop, Clue Ladder, Seating Chart, Hidden Gem, Stack Up, Stake, Pack, Lowball, Inner Clock. Alibi, Bouncer and Prior remain archived with their native compatibility intact. No fake players, surveys, prices, monetisation controls or demo scores.
