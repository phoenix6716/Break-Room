# Subscriber-triggered content plan — 14 November 2026

Status: account-history service and subscriber activation implemented; content authorship remains gated. The owner asked to start the content expansion after the first subscriber. Bulk content creation is deferred. The implementation adds a private cloud history service, shared weekly allocation and a verified first-payment activation record. It does not install a content authoring job or promise a fixed publication schedule.

## Start condition

Start production after the first successfully paid **live monthly subscription** is confirmed. A sign-up, Checkout redirect, pending/unpaid session, sandbox transaction, free trial, zero-value invoice or individual game purchase does not satisfy this monthly-subscriber trigger.

The existing verified live webhook/reconciliation path is the appropriate place for the eventual activation signal. Resolve the invoice through the Subscription and the existing live catalogue/customer mapping; verify a real successful payment, the monthly price, correct account and live mode. A subscription becoming active by itself can precede a delayed payment. Browser flags and the success URL are not activation signals.

Activation record: first qualifying invoice reference, verified payment time, activation time and programme state. Create it once through a transaction with a uniqueness constraint. Duplicate or out-of-order events must not start production twice. A later cancellation does not erase the historical first-payment event or remove published content. Reconciliation should be able to recover a missed event. Keep the existing pinned Stripe API version and billing enforcement; implementing this signal is not a reason to change API versions or payment configuration.

Re-check the private live billing records and provider state when evaluating the trigger. A dated app-record audit is not continuous monitoring or a complete historical Stripe audit. The service is installed separately from any real payment; activation is not claimed until a qualifying payment is observed.

## Demand-driven replenishment — owner decision, 14 November 2026

Save production time by reusing the published bank and writing more only when subscribers need it. **There is no fixed monthly authoring quota.** The weekly selection of up to 100 unseen challenges is a distribution limit, not an instruction to manufacture 100 new challenges every week.

Keep unplayed questions in the archive across weeks and months. A newer subscriber can use older releases they have not seen. Previously seen questions remain labelled replays; a new calendar month does not discard content or reset exposure history.

For each game, review the smallest eligible unseen reserve among active subscribers, especially the most advanced returning player. Estimate time to exhaustion from actual consumption and selected filters. Start planning a top-up around **2–4 weeks of remaining supply**, allowing enough lead time for authoring and review. If subscribers still have ample unseen content, skip production for that game.

400–500 unseen challenges per game can be a useful reserve for a player consuming the full allowance across four or five weekly releases. It is not 400–500 newly written challenges every calendar month. Include the current partial-week selection and applicable Daily reservations when forecasting; total catalogue size alone does not measure a returning subscriber's remaining supply.

The same authored question can serve many subscribers who have not seen it, so production should follow the furthest-advanced active user's needs rather than multiply by the number of subscribers. Newcomers should draw suitable unseen back-catalogue content before extra content is authored solely for them.

Bulk production remains gated on the first confirmed paid live monthly subscription. That event starts inventory/consumption review; it does not automatically require a large batch for every game. Current captured rounds, Daily calendars, scores and paid access remain unchanged. A private demand report is implemented; content authorship is still a reviewed production task.

Codebreak already has 10,000 possible codes; that is not 10,000 authored stories. Time Sense has 101 current practice durations (201 on its wider supported 50ms grid), so expanding its meaningful variety needs a separate game-design decision. Do not pad either inventory with cosmetic duplicates or new IDs for the same challenge. Prioritise whichever authored bank is actually running low, using Stack Up, Laser and Lowball as initial inventory-review candidates.

## Account-wide seen-history design

The authenticated account owns its private cloud ledger and shared weekly selection across devices. Browser recovery ledgers remain available and are union-imported when each game opens. Guest history remains browser-local.

Private records:

| Record | Purpose |
| --- | --- |
| Published challenge catalogue | Stable game ID, canonical challenge ID, content version/fingerprint, publish time, eligible modes, difficulty/topic and retirement state. |
| Account exposure | One row per authenticated account + game + canonical challenge, with first-shown time and optional last-shown time. |
| Account weekly selection | One shared selection of up to 100 IDs per account + game + Sydney week, with assignment and actual exposure tracked separately. |
| Content programme state | One verified first-paid activation and dated inventory/release review state. |

A stable canonical ID represents the actual challenge. A wording correction, renamed character, new illustration or shuffled display order does not erase seen history. Preserve old captured content versions. Materially different challenges get genuinely new IDs after review; maintain lineage where appropriate. Stack Up variants of the same theme should not inflate the distinct pool.

Record **seen when first shown**, even if the player skips or answers incorrectly. Record completion separately only if needed; it must not control freshness. Assigning 100 IDs must not mark all 100 as seen: if only ten are displayed, the other ninety remain unseen.

Capture future Daily and Unlimited exposure events where the instrumentation can establish that the question was actually displayed. Do not import unopened future ingredients merely because a Daily save captured the entire run in advance. Existing browser-local Unlimited history can be merged into the account ledger as known exposure; it does not supply a reliable historical first-shown timestamp. Deleted, never-recorded or never-synced play cannot be reconstructed.

## Selection and archive reuse

1. Restore the official Auth session and hydrate the actor's server history and current selection before assigning a new challenge. Keep the current synchronous engine selection cache behind that readiness step; preserve actor fences during login/logout.
2. Consider all published, eligible back-catalogue entries, including releases from previous weeks. Exclude that account's recorded seen IDs, applicable Daily holdouts/reservations, retired content and unsuitable filters.
3. Atomically assign up to 100 distinct unseen IDs for the game and Sydney week, balanced across its topics/difficulties. Reuse the same assignment on other devices and tabs. Weekly assignment and exposure writes need database constraints/locking, not independent browser counters.
4. Serve unshown assigned entries first. Mark each as seen only on presentation. Retain the first-shown record on retries, refreshes and restored rounds.
5. Retain all known challenges as labelled replays. Reset the weekly assignment window on Sydney Monday, never the lifetime exposure ledger. Unshown assignments from older weeks may be eligible again.
6. If there are fewer than 100 eligible unseen challenges, serve the real number and keep replays available. Do not rename old questions or invent a depleted-source-bank explanation.

Example: a subscriber joining in week five can receive week-one questions they have never seen. A subscriber who already played those questions receives other unseen challenges or labelled replays. “New to you” is different from “newly published this week.”

## Integration and privacy requirements for implementation

- Derive account identity from the verified Supabase Auth session, not a request-body user ID or editable profile metadata. Validate submitted challenge IDs against the published catalogue.
- Account histories/selections must be private. Use owner-scoped RLS and suitable grants for every exposed table, or a private schema behind an authenticated service boundary. Prefer security-invoker database code; do not expose a privileged public function to work around permissions.
- Unique exposure and weekly-selection constraints make retries idempotent. Merge local/imported records by union, never replace a newer server history with an older browser backup.
- History controls freshness only. It must never grant a subscription or individual-game entitlement. Keep the existing live-only billing checks authoritative.
- Preserve active captured rounds and timers while syncing. Continue a captured attempt safely through a connection failure; do not label a newly assigned question as globally unseen when account history could not be checked. Specify the offline/replay fallback before rollout.
- Update the privacy/storage description when cloud history is actually shipped. Do not claim cross-device seen protection before the data path is deployed and verified. Keep payment records and subscription cancellation separate from challenge-history deletion.

## Implementation order

Prepare and test the account-wide ledger/selection service before or alongside the first-paid rollout, retaining the current browser history for migration and recovery. Earlier deployment of exposure tracking would preserve more free Daily history before a user subscribes; the content-production gate does not require delaying that infrastructure. The service implements this preparation; bulk authorship remains gated.

After the qualifying real payment is confirmed, begin inventory and consumption review. Author and publish top-ups only for games whose eligible unseen reserve is approaching the 2–4-week planning threshold. Expand Unlimited archives additively rather than changing frozen Daily deck sizes without assessment. Keep the distinction between infrastructure preparation and gated content authorship explicit.

Verify: older unseen content is eligible for a newcomer; an existing subscriber does not receive the same canonical challenge as fresh; two devices share one selection; assignments do not count as exposure; duplicate writes are harmless; a new week preserves seen history; non-owners cannot read/write another account's rows; corrupt/offline history preserves current rounds; and all native scoring, Daily saves and paid-access guards continue to pass.

Weekly rotation already exists. It does not automatically author, review or publish new content. Additional questions need real production and quality checks after activation.

## References

- Existing inventory and selection behaviour: [UNLIMITED-POOLS.md](UNLIMITED-POOLS.md).
- Supabase account ownership and RLS: https://supabase.com/docs/guides/database/postgres/row-level-security .
- Supabase database building blocks: https://supabase.com/docs/guides/getting-started/the-supabase-way-to-build .
- Stripe subscription events: https://docs.stripe.com/billing/subscriptions/webhooks .
- Stripe delayed-payment confirmation: https://docs.stripe.com/billing/subscriptions/bacs-debit .

## Implemented service — 14 November 2026

`content-library` authenticates through the official Auth user endpoint and only exposes sync/shown operations for that actor. A service-only invoker RPC owns private `br_content` records. Account/game transaction locks serialize weekly allocation and exposures. The catalogue is reproducible with `scripts/content-catalog.cjs`; new authored releases must update the private catalogue additively before publishing the corresponding bank. Stack Up uses canonical themes; Codebreak codes and Time Sense targets are not cosmetic content releases.

All ten controllers record the currently displayed Daily challenge, not unopened captured rounds. Unlimited entry and Next hydrate the shared account history, retain local imports and preserve native round state on failure. The exposure acknowledgement decides whether a newly drawn challenge is labelled new or replay: concurrent devices may briefly display the same question, but a duplicate acknowledgement is labelled replay. While checking, the badge says Checking history; failed acknowledgements never claim a globally unseen challenge. Native Codebreak IndexedDB reservations remain intact.

The live billing reconciler records programme activation only from a paid monthly invoice with a verified successful, non-reversed payment and a positive approved amount. Storage failures remain retryable before reconciliation/event completion; duplicate activation retains the first stored proof. No real payment is generated for testing. This rollout starts with the existing source banks, not a manufactured 400-question monthly release.

`br_content.inventory_review` is a private live report of active monthly subscribers who have played in the last 28 days. It calculates remaining unseen eligible inventory and recent consumption, suggesting top-up planning at four weeks or less. Imported history reduces available inventory but does not invent historical consumption dates. Zero observed usage requests observation, not automatic production. The view stays empty until programme activation. The estimate is an aggregate planning aid: selected filters and Daily holdouts still need review before authoring.
