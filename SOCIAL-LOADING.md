# Friends and Leagues loading

Previously, account startup restored all 15 save adapters in series. Each social page then called `sync()` before reading scores, which performed the same full restore again. A clean signed-in visit could therefore make 30 sequential save reads before fetching comparisons, plus any writes and score requests. The adapters include archived games because historical saves must remain portable.

The initial restore now uses at most four workers. Each worker processes a game's revision read, merge, optional write and conflict retries in order. Games are independent; their merge rules and validators are unchanged. A failed worker stops new work, and the exchange waits for all in-flight workers before reporting failure or releasing the existing cross-tab account lock. Identity is rechecked before each write. No partial restore is installed.

A social page remembers only in memory which account successfully completed its initial restore. Later `sync()` calls join/drain pending uploads, or return immediately if the owned local snapshot is unchanged. Score RPCs still run after that barrier and return current server records. This does not cache leaderboard scores or import guest results. A failed initial restore is not marked successful; account changes and guest restoration cannot reuse another account's state. Account and Profile retain their full restore behavior.

No database migration, scoring change, save format change or SDK update is required. The account script is cache-busted on every built page. The first signed-in visit still needs authentication, network requests and a complete account restore; server latency and connection quality still affect its duration.

Verification covers request count and bounded concurrency under controlled network delay, unchanged refreshes, dirty uploads and score ordering, concurrent caller coalescing, failures with in-flight requests, private account/guest isolation, existing conflict retries, native historical saves, and mobile/desktop flows. Timing measurements from fixtures are not production-user benchmarks.
