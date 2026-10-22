# Testing

Run `npm run check`. Unit tests cover color math, geometry, fingerprints, scoring, suppression, diffs, protocol validation, reports, and registry completeness. Integration tests exercise the Figma-independent audit engine. Performance tests use large normalized node arrays.

Manual Figma checks: import `dist/manifest.json`; scan selection, page, and confirmed entire file; cancel during loading and rule execution; navigate across pages; preview and apply a rename; save a baseline; export all formats. Test UI entirely by keyboard, visible focus, VoiceOver/NVDA announcements, 200% zoom, light/dark themes, reduced motion, empty/error states, and long localized strings.

Fixture checklist: mobile login, checkout, SaaS dashboard, product page, settings, data table, form, modal, navigation, component library, dark mode, responsive family, RTL, chart, error, empty, loading, and a known-poor design.
