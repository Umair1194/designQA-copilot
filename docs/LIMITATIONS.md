# Limitations

Static Figma data cannot prove semantic HTML, ARIA correctness, DOM or focus order, keyboard behaviour, screen-reader announcements, live regions, runtime validation, browser zoom/reflow, backend behaviour, authentication, captions, performance, responsive implementation, or assistive-technology compatibility. Overlap, background, hit-area, component-state, and breakpoint inferences may be uncertain. Gradients, images, blend modes, masks, and multiple fills require assisted contrast review.

“No automatically detectable issues found” means only that enabled deterministic rules emitted no finding. Manual review and production testing remain required. Scores express detected design risk and coverage, not compliance.

## Website reviews and research coverage

Website reviews require the local service (`npm run website:serve`) and installed Chromium. The scanner covers one public page at three widths in Chromium. It does not crawl a site, run authenticated flows, test Firefox/WebKit or compare approved screenshots. Feedback is placed on page captures; no deployed page is modified.

All requested research methods appear as concrete validation plans. A/B or multivariate results, participant studies, navigation studies and behavioral analytics cannot be generated from a URL or Figma layer data alone. Reports identify these as pending work, not completed tests. Figma issue baselines track findings, not visual differences.

Contrast detection currently evaluates only fully opaque solid text against a fully opaque immediate parent fill. Layer overlap, image backgrounds and inherited colors require review. Line capacity is an estimate, not measurement of rendered character positions. Clipping may be intentional for scrolling. The interaction scope selects nodes with reactions and their descendants; it does not traverse the full prototype graph.
