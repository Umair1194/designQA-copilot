# Design QA Copilot

Review Figma designs and public website pages. Each finding includes evidence, user impact, a recommended change and a basis for the recommendation.

## Figma reviews

- Selection, selected frames, page, file, component-library and interaction-node scopes.
- 18 automatic checks for supported layer properties and copy signals. The broader catalog contains assisted review prompts, not 171 automatic tests.
- On-canvas feedback, issue navigation, previewed changes and JSON, CSV and HTML exports.
- Validation plans covering all ten NN/G heuristics, A/B and multivariate testing, usability testing, tree testing, card sorting, visual regression, responsive/browser testing, accessibility and behavioral analytics.

Participant research and experiments require participants or measured data. Figma layer properties cannot prove production behavior or WCAG conformance. Product profiles currently label the report; automatic checks use the same rules across profiles.

## Live website reviews

The plugin connects to a local Playwright/axe-core service. It visits one public URL in Chromium at 390, 768 and 1440 px, runs automated accessibility checks and inspects overflow, headings, page titles and generic links. Open the resulting annotated page copy to see feedback over screenshots. Reports can also be added to the Figma canvas or exported.

```sh
npm install
npx playwright install chromium
npm run website:serve
```

Keep the service terminal open. In the plugin, choose **Live website**, enter the URL and paste the session key printed in the terminal. The key is held in UI memory, not saved. Reports are available while the service runs; it retains the latest ten reports in memory.

Feedback annotates a captured copy, not the deployed website. No account login, form submissions or authenticated pages are supported. Browser checks cover page-load states in Chromium; other engines, interactive states, visual baseline comparisons and actual participant/traffic studies remain validation steps. Large, blocked or slow sites may fail to load. Disconnect stops waiting in the plugin; the service may finish its current review before accepting another.

Figma Desktop must allow the connection to `http://localhost:4318`. The manifest authorizes only this local service. Browser requests originate from the service, so website CORS restrictions do not prevent inspection. Public-address checks reject private and reserved destinations, including page assets and redirects.

## Build and import

```sh
npm run check
```

Replace `REPLACE_WITH_FIGMA_PLUGIN_ID` in `manifest.json` with your development plugin ID, rebuild, then import `dist/manifest.json` in Figma Desktop. Run `npm run watch` for rebuilds; reopen the plugin to load a new build.

```sh
RUN_BROWSER_TESTS=1 npm test
```

The browser test requires the Chromium download. It uses a controlled page fixture with deliberate accessibility and overflow problems.

See [the UX/UI audit](docs/UX_UI_AUDIT.md), [limitations](docs/LIMITATIONS.md), [privacy](PRIVACY.md) and [manual Figma checklist](docs/MANUAL_FIGMA_CHECKLIST.md).
