# WCAG coverage

All 86 WCAG 2.2 success criteria are registered in `src/standards/wcag-22.ts` with level, principle, detectability, review question, rule links, platforms, and limitations. SC 4.1.1 Parsing is retained separately as an optional WCAG 2.0/2.1 legacy manual check.

The current deterministic WCAG checks cover solid-color text contrast and near-invisible text risk. A defined assisted subset covers design-visible evidence such as color use, headings/labels, focus appearance, target sizing, and error presentation. Every other criterion remains manual. Registry generation is authoritative because the UI must never imply that an unreviewed criterion passed. Run `npm run validate:rules` to verify the count.
