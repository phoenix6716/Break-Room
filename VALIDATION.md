# Validation

Verified in the prepared cloud environment using Chromium and Playwright:

- 500 assertions in `node tests/smoke.cjs`, with no browser JavaScript errors.
- Homepage availability/order and game headers/drawers at 320, 390, 768, and 1440 pixel widths.
- Clickable drawer close and navigation links, outside-click/Escape dismissal, focus containment/restoration, and no horizontal page overflow at those widths.
- All six coming-soon routes retain the template layout with disabled start controls and working help/statistics previews.
- Lowball: first-visit help, region selection, invalid input rejection, all four rounds, refresh during a pending result, persisted completion counted once, statistics, and the existing locked Unlimited screen.
- Stake: betting, answer feedback, all five daily questions, refresh after a bet, saved completion, statistics, and Unlimited practice without adding a daily run.
- 394 local HTML/CSS resource references exist; 17 JavaScript files/inline blocks pass syntax checks.
- The installed Cabinet Badge logo was visually checked on the homepage, Lowball, and Stake at 320, 390, and 1440 pixels. It loads correctly, preserves header sizing, and causes no horizontal overflow. The 500-assertion suite also passed after installation. The installed PNG matches the reviewed concept byte for byte.

Functional browser tests intentionally use fallback fonts rather than depending on Google's font service. Real-device testing, production hosting, authentication, purchase/restore services, external statistics APIs, and cross-device sync were not tested. Lowball's business/legal and external-service configuration still contains its original placeholders.

The current site wordmark is Cabinet Badge (round 4, option 1), with the existing moon badge favicon retained. Existing game mechanics/artwork and storage keys are preserved. A small Lowball iframe integration fix keeps its dialogs inside the visible screen area.
