# Seating Chart release — 24 October 2026 (Sydney)

## Implemented
Five untimed Daily tables (6–10 guests), four distinct relationship types, upfront minimum drama and varied advanced conflicts. Reveals include wedding mishaps, every request's actual seat relationship, an optimal seating and the specific subset of requests that establishes any unavoidable-drama lower bound. All optimal arrangements count. No timer, lives, intro, rehearsal Compare route or monetization hooks.

Native total drama remains lower-is-better; Daily Arcade averages max(0,100 − 20 × avoidable drama) across five tables. Immediate saved seating/selection/Undo, immutable first receptions, fifth-reception completion, owner-scoped session practice and Sydney reset use the shared Stake shell. Added shelf/drawer/registry/Profile/cloud/Friends integration without rewriting other saves or changing existing engines/artwork.

360 frozen generated tables provide 72 Daily sets. The original prototype remains outside production. Generated structural variety and exhaustive correctness do not establish human enjoyment or difficulty calibration.

## Verification
No local execution workspace was available. Pure model checks ran in the orchestration runtime; executable browser and PostgreSQL checks ran in GitHub Actions against the production artifact under a project URL prefix. [PR CI run 40040627565](https://github.com/phoenix6716/Break-Room/actions/runs/40040627565) passed all selected checks at runtime commit b9b7e39e9f12a50d073943115d5f5ef459aa0d4a. A final 44px reveal-control style and matching browser assertion are included in the main release check. Pages publication is still pending; it is not established by the PR run.

The test set includes independent exhaustive minimum checks for all 360 tables and conflicting-request subsets, generator reproducibility, 72-day rotation, score reconstruction, malformed saves, cloud merge/first-completion rules and private SQL ownership. Browser coverage includes five viewport widths, full Daily flows, keyboard/touch seating, swaps/Undo/Reset, refresh/mode preservation, locked reviews, sharing/profile/stats, Help/Stats/drawer focus, Unlimited exclusion/refill, cross-tab updates, Sydney rollover, denied storage/clipboard and corrupt-save preservation. Shared account/Friends checks cover two users/devices and real PostgreSQL-derived private comparisons.

## Live database
Project quhyzwivpdznmffmwhcr; applied migration `20261023232900_seating_chart_frozen_tables_and_private_scores`. All 360 tables validated and their optimal costs matched. Live fixtures matched JavaScript scores at 100 / 96 / 92 / 88 / 84 / 80, including the zero-credit floor for an individual table, and rejected a malformed seating. No synthetic customer rows were created. Existing save row count remained one, all four tables retained RLS, and browser roles cannot execute the new private score helper.

Security advisor findings stayed at the prior baseline: three deliberately RPC-only social tables with no direct RLS policies, three existing guarded authenticated SECURITY DEFINER RPCs, and disabled leaked-password protection. No new advisor category or finding was added. Those pre-existing launch settings were not changed by this game release.

## Remaining human checks
Real phones, assistive-technology use and player difficulty/engagement calibration remain launch work. Automated emulation is not certification of those experiences.
