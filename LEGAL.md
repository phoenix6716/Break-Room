# Shared legal pages

`privacy.html`, `terms.html` and `contact.html` cover the whole Break Room site. They use static HTML, the existing header, `legal.css` and a single shared footer definition. Footer links work without JavaScript and retain explicit relative targets for downloaded copies and the GitHub Pages project path. Lowball's embedded engine has no duplicate legal footer. Its old privacy, terms and refunds URLs redirect to the shared policies, with a visible fallback link.

## Keep the content accurate

The current notices describe local saves and recovery copies, Supabase email authentication/private Daily cloud snapshots, explicit guest import, optional friend profiles/score sharing, provider connection logs, backup limits and available controls. They distinguish a 120-day comparison window from data retention and signing out from deletion. They do not claim a self-service deletion/export tool for all account data, a particular database region, a fixed provider backup deletion period, active analytics/ads/payments, or verified Lowball retail prices.

No operator identity, business registration, private support email or jurisdiction has been invented. Contact currently links the public repository tracker for bugs and tells players to arrange a private channel before providing account/data-request details. Do not ask people to post their identity, email, tokens, codes or backups in a public issue. Replace this temporary route with an owner-supplied, monitored private address/form before public launch. Confirm the operator identity, actual provider retention/region/email configuration and applicable legal requirements before treating these pages as final launch policies. These pages document current behavior; automated tests do not certify legal compliance.

If enabling analytics, advertising, purchases, prizes, new social features or a new processor, update both implementation and notices before activation. Never enable a fake consent banner for services that are absent. Stake chips remain fictional, non-purchasable and non-redeemable; Unlimited stays free. Do not restore archived Lowball-only business/provider placeholders.

## Footer maintenance

```sh
npm run legal:sync
npm run legal:check
```

`scripts/sync-legal-footer.cjs` defines the footer and updates root HTML and direct game entry pages, including the development template. It replaces older footer variants, links `legal.css` and keeps the homepage footer inside its existing frame. It never changes the engines, account handlers or native saves. `legal:check` runs first in `npm test`, so future pages cannot silently drift. Do not hand-edit generated footer blocks; update the definition and regenerate. The style is deliberately outside the game frame so it does not move title/stats/playing controls.

Signup presents links to Terms and Privacy beside the existing account explanation. This does not add a claim of recorded consent or change signup/authentication handling. There is no database migration, tracking script or cookie-preference change in this release.

`tests/legal-pages.cjs` checks public routes/footer links without JavaScript, nested project-path navigation, retired Lowball redirects, legal layouts at 320/390/768/1100/1440px, signup fallback safety, missing assets and unchanged browser storage when reading policies. Existing full game/account suites protect gameplay and save behavior.
