# Dark appearance contract

Light remains the default. The sun/moon button stores a device preference, outside gameplay and cloud saves. All public pages and the Lowball iframe load the shared theme through the build workflow.

Use navy surfaces (`#141e2a`, `#202d3c`, `#293b4c`) with white or high-contrast pale labels. Use paired muted-blue controls with white text; distinguish disabled controls with a dark-grey surface and readable pale labels rather than reducing the entire control’s opacity. Preserve green/red success and miss distinctions on dark surfaces. Source links use pale blue and underlines.

Do not globally change all text to white. Light puzzle pieces, seats, coordinate tags, the combination display and other intentionally light artwork retain their appropriate dark or brass labels. Keep the approved logo silhouette and coloured cube. Preserve background-image artwork when overriding `background`; check the actual rendered stopwatch, icons and furniture labels.

Component-local CSS variables can override inherited root values even when root declarations are important. Apply the dark palette to local modal/game scopes explicitly. Pair the background and text changes for receipts, result cards, progress indicators and Unlimited settings.

Run `npm test` for the repository-selected checks. The new `dark-contrast.cjs` suite uses real native-model receipts and engine controls to inspect ready/active, complete/lost, review, summary, help/stats and Unlimited states at 390 and 1440 pixels. It includes all Profile paging and public site pages. `dark-social.cjs` repeats real authenticated social flows with dark mode. Existing `theme.cjs` checks 320/390/768/1440px, save isolation and active-timer preservation. Review screenshots and reports under `.artifacts/dark-audit/` before publishing. Never claim these tests establish every possible future state or complete accessibility compliance.

The shared rendered-state audit also runs in light mode through `tests/light-contrast.cjs`, using identical native receipts and phone/desktop states. Light reports and screenshots live under `.artifacts/light-audit/`. Shared theme changes select both suites automatically.
