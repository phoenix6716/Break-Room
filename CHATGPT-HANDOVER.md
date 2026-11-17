# Continue Break Room in another ChatGPT account

Prepared 17 November 2026 (Australia/Sydney). This transfers project context and source access, not your ChatGPT account, subscription, chat history, memory, app sessions or provider credentials.

## What to do

1. Download `Break-Room-Handover.zip` from the old chat before relying on continued access to its workspace. Keep a local copy.
2. Sign in to your other ChatGPT account. Use a coding workspace/Codex if that account has access; available tools and features depend on its plan/workspace.
3. Connect the GitHub app to your **existing** GitHub account and authorize `phoenix6716/Break-Room`. Open/clone branch `main` in the coding workspace. The old `/workspace/Break-Room` path is not guaranteed to exist in a new chat.
4. Upload the handover ZIP or its `CURRENT-STATUS.md`, `CHATGPT-HANDOVER.md`, `START-HERE-NEW-CHAT.md` and `LAUNCH-MARKETING.md`. The ZIP also includes the three local marketing screenshots. A separate Break-Room-Source.zip contains the source snapshot. GitHub’s latest main should be preferred over an old snapshot.
5. Paste `START-HERE-NEW-CHAT.md` into the new chat. Have it read `AGENTS.md`, inspect `git status` and current main, and summarize what it understands before starting a new change.
6. Reauthorize Supabase/Stripe apps in the new account when backend/payment work actually needs them. Reuse the existing service accounts and Supabase project. Cloudflare hosting/DNS and social accounts remain where they are; reconnect any relevant tools separately as needed.
7. Confirm the new workspace can read the repository and the docs/marketing assets are available. Keep control of the existing GitHub, Cloudflare/domain, Supabase, Stripe, mailbox and social logins. No website migration is required merely because ChatGPT changes.

You can cancel the old ChatGPT subscription independently of the website services. Do not cancel Cloudflare/domain, Supabase or Stripe services as part of moving ChatGPT. This pack does not transfer your provider logins or automatically recreate chat memory; it gives the new chat the important working context explicitly.

## Source and infrastructure

- GitHub: https://github.com/phoenix6716/Break-Room ; branch `main`.
- Live: https://breakroomdaily.com/ . Cloudflare worker: `break-room`.
- Supabase: `quhyzwivpdznmffmwhcr`; existing Auth/data/functions stay there.
- Existing Stripe live/sandbox accounts and catalogue remain separate; details are in `STRIPE-LIVE-SETUP.md` and the source catalogues.
- Support: support@breakroomdaily.com, forwarded by Cloudflare to the owner’s verified inbox.

No password, private key, API secret value, session token, customer export or browser profile is included. Existing server secrets stay privately installed with their services. Public browser configuration and project IDs in the source are not administrative credentials. Do not ask the owner to paste secret values into the new conversation.

## Read in order

1. `AGENTS.md`: latest working rules, then historical compatibility notes as needed.
2. `CURRENT-STATUS.md`: authoritative current product/setup state.
3. `README.md`, `HOSTING.md`, `PAYMENTS.md`: development, hosting and live payment model.
4. `UNLIMITED-POOLS.md`, `CONTENT-SUBSCRIPTION-PLAN.md`: actual banks, seen history, weekly selections and demand-driven content policy.
5. `LAUNCH-MARKETING.md`: organic launch copy and video scripts.

Files ending `-HISTORY.md`, dated audits and old roadmap sections record past states. They are not instructions to redo domain purchase, sandbox setup, adult verification, old SQL installers, already-enabled billing or already-deployed social/history features. Verify actual provider requests if a new issue arises.

## Important carried decisions

- Preserve saves, captured rounds, timers, score versions, public IDs, opt-outs and visibility choices.
- Live release after focused checks is already authorized; verify deployment and production before claiming success.
- Daily stays free; monthly A$4.99; one game A$7.99 once. No ads currently installed. GST remains off. Refund requests need a reason and retain statutory consumer rights.
- Unlimited: up to 100 unseen challenges per game per Sydney week from the available bank, plus labelled replays. No visible remaining counter in normal play, honest pre-purchase disclosure. Small banks/filters/prior play can reduce the number.
- Account-wide seen history/shared selection and the paid-monthly activation gate are implemented. First verified positive live monthly payment starts inventory review, not automatic authoring. No fixed 400-new-questions/month quota. Top up only as unseen reserves approach roughly 2–4 weeks for advanced active consumers; newer subscribers can use older unseen content.
- Current priority: launch marketing. The owner has Instagram, YouTube and TikTok and chose free/organic posts plus relevant communities. Start with a real Time Sense recording, then Lowball/Laser; share a clean vertical original across Reels/Shorts/TikTok. No posts have been sent by the assistant, no ad budget was approved, and account handles/published results have not been confirmed.
- Do not promise completed live customer purchases, current subscriber counts, genuine receipt delivery, publication results or present provider verification status from historical audits alone.

## Snapshot and recovery

The source snapshot includes Git-tracked files plus the current handover/marketing docs, but excludes `.git`, dependencies, generated `dist/`, local credentials, browser sessions and customer data. It is a source backup, not a database or Stripe backup. If GitHub is available, clone it instead so commit history and future updates remain connected. If restoring the source snapshot, install dependencies from the pinned lockfile and follow `HOSTING.md`; reconnect the origin deliberately before committing. Do not overwrite a newer working tree or an existing production database with the snapshot.
