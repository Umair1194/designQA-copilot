# Standards baseline

Reviewed 2026-07-22.

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — W3C Recommendation 12 December 2024; normative accessibility baseline. It incorporates WCAG 2.0/2.1 except removed SC 4.1.1 Parsing. Parsing remains an optional legacy manual review.
- [WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) — W3C Recommendation 6 June 2023. ARIA implementation checks are manual because Figma cannot expose the production accessibility tree. Prefer native semantic HTML before ARIA.
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) — current guidance reviewed for names/descriptions, keyboard interfaces, focus, dialogs, menus, tabs, accordions, comboboxes, listboxes, grids, and tooltips. APG is informative, not a conformance standard.
- [Figma plugin manifest](https://developers.figma.com/docs/plugins/manifest/) — current docs require `documentAccess: "dynamic-page"`; `networkAccess.allowedDomains: ["none"]` denies external requests.
- WCAG 3.0 is future, experimental guidance only and is excluded from WCAG 2.2 scores.
- Nielsen’s ten heuristics are paraphrased as assisted prompts; they are not compliance tests.

WCAG thresholds used: normal text 4.5:1 AA and 7:1 AAA; large text 3:1 AA and 4.5:1 AAA; applicable non-text contrast 3:1. WCAG 2.2 target size minimum is 24×24 CSS px subject to its exceptions; enhanced is 44×44. Platform guidance such as 44 pt iOS or 48 dp Android is advisory and never reported as WCAG failure.
