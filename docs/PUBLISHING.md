# Publishing

1. Create a development plugin in Figma Desktop.
2. Copy its generated ID into the source `manifest.json`.
3. Install dependencies with `npm install`.
4. Run `npm run watch` once during development and leave it running; saved changes rebuild automatically.
5. Import `dist/manifest.json` in Figma.
6. Test with the documented sample-file checklist.
7. Run `npm run check` for production output.
8. Prepare Community icon, cover, screenshots, description, and support link.
9. Complete privacy disclosures accurately; the core has no network access.
10. Publish, then smoke-test the Community build.
