# Launch check — 13 November 2026 (Sydney)

## Completed

- Published payment privacy disclosure: Stripe-hosted details, private purchase/access identifiers, payment/refund/dispute verification, retention and account-deletion limits. Browser storage includes Codebreak's IndexedDB history and temporary per-tab locked-tab selection.
- Corrected the obsolete “Unlimited is free / no analytics” privacy statements. An actual live Chromium journey requested Cloudflare's Insights beacon; Cloudflare performance/usage collection is disclosed. No advertising network was found during the sampled live journey.
- Added billing support, cancellation and refund guidance to Contact. Never ask customers to email card numbers, CVCs, passwords or login links.
- Confirmed live readiness: configured, checkout and enforcement enabled. Unsigned webhook requests return 400; unauthenticated checkout requests return 401. The live webhook is enabled for the twelve handled events.
- Confirmed live merchant charges and payouts are enabled, the website is https://breakroomdaily.com/, and the statement descriptor is BREAKROOMDAILY (card prefix BREAKROOM). Public support email and URL are blank; connector account-profile writes are unavailable, so the owner must set those in Stripe.
- Confirmed active live Customer Portal: billing history, payment-method updates and cancellation at period end; policy links point to the live site.
- Read-only database audit found no unprocessed live billing events. A live monthly checkout record is pending; it is not evidence of a completed charge or active membership. Do not delete it, retry payment or create a fake charge for testing.
- Public routes and a real-SDK Chromium guest journey passed at mobile viewport size. These checks do not replace a physical iPhone/Android check or prove actual email delivery.
- Private billing schema and live dispatcher remain denied to both anon and authenticated roles. Security advisors still report seven existing authenticated SECURITY DEFINER game/social RPCs (intentional API surfaces, not removed during this audit) and disabled leaked-password protection. This is not a full independent security certification. Remediation references: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable and https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
- Provider health advisor reported no health lints. Historical permission/setup failures and headless denied GET requests were observed; current live readiness passes. This is not a claim that every historical failed request was a customer incident or that automated alerting is installed.
- GST collection remains off under the owner's confirmed non-registration. No tax registration or email was created.

## Owner steps

1. Stripe → Settings → Business → Public details: set support email to **support@breakroomdaily.com** and support website to **https://breakroomdaily.com/contact**. These were blank in the read-only account audit. The connector exposes account reads but no matching account-profile update operation.
2. Stripe live Dashboard → Settings → Business → Customer emails: enable **Successful payments** and **Refunds**. Inspect receipt branding/support information. Reference: https://docs.stripe.com/receipts and https://dashboard.stripe.com/settings/emails . The connector cannot read or change these switches; do not mark them verified until the owner checks them. Automatic receipts are not sent for sandbox payments. Do not create a live test charge to force a receipt.
3. Stripe → Settings → Billing → Subscriptions and emails: enable customer emails for failed card payments and payment confirmation when needed, using Stripe-hosted payment-management links. Reference: https://dashboard.stripe.com/settings/billing/automatic and https://docs.stripe.com/billing/revenue-recovery/customer-emails . Current Customer Portal features are already configured. Check Stripe account contact/notification email so operational notices reach the owner; no custom monitoring service has been installed.
4. Cloudflare: `www.breakroomdaily.com` currently has no DNS result from the audit environment, while the apex works. Configure www with HTTPS and a server-side redirect to https://breakroomdaily.com, preserving path and query. Do not add a client HTML redirect or strand GitHub-origin guest saves. Domain/dashboard access is not available to this connector; verify www DNS/HTTPS/redirect after owner setup.
5. On a physical phone, check light/dark header controls, sign-in, one free Daily, locked Unlimited, Subscribe → Plans and Account → Manage billing when a billing account exists. Confirm recovery links and support-email delivery using the owner's devices/inbox. Existing sandbox purchase/cancellation tests need not be repeated just to complete this checklist. No real payment is requested as a synthetic test.

Optional owner hardening: enable leaked-password protection in Supabase Auth if the current plan supports it. Do not purchase an upgrade or change existing game/social RPC permissions without assessing the actual requirement and owner authorization.

## Account-deletion support procedure

Before deleting an Auth account, arrange cancellation of any Stripe renewal and review the customer's billing/refund request. Deleting the Supabase account cascades the local customer/session links and access snapshots; it does not cancel Stripe billing or erase Stripe's financial records, and minimal webhook references are not account-linked rows. Do not destroy legally required accounting records or leave an orphan subscription renewing after its account link is removed. There is no self-service deletion endpoint in this release.

## First genuine purchase

For a real customer who chooses to pay, confirm the signed event was processed, their own verified access appears, and the expected receipt was delivered. Monitor Stripe delivery failures and the Supabase billing logs. No completed live purchase, receipt delivery or physical-phone result is asserted by this audit.
