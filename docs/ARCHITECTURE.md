# Architecture

1. `src/plugin` loads pages, normalizes Figma nodes, navigates, mutates only after preview, and persists local data.
2. `src/shared/types.ts` defines a serializable normalized design model and message contract.
3. `src/engine` runs deterministic rules, fingerprints, scoring, suppression, diffing, and reports without Figma dependencies.
4. Assisted/manual registries provide structured human questions. They never become implicit passes.
5. Optional AI and remote licensing are provider boundaries only; neither is active or required.
6. `src/ui` renders findings and review workflows. Full Figma nodes never enter the iframe.

Selection scans include the selected nodes and all descendants, with node IDs deduplicated. After an audit, `src/plugin/report-frame.ts` creates or updates a plugin-owned canvas report containing scope totals, coverage language, findings, evidence, remediation, and affected layer IDs. Updating the plugin-owned report avoids report-frame duplication.

Entire-file loading yields between pages and rule batches. Cancellation is cooperative. Reports escape user-controlled layer content.
