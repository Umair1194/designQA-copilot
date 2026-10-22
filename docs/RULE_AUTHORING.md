# Rule authoring

Add a definition to `src/rules/catalog.ts` and, for automatic detection, a deterministic evaluator in `src/rules/evaluators.ts`. Each rule needs a stable namespaced ID, rationale, impact, limitations, false-positive conditions, evidence, remediation, confidence, severity, automation level, and standards references. Never turn absence of evidence into a pass. Add passing, failing, boundary, unsupported, and relevant false-positive fixtures. Run `npm run validate:rules` and `npm run check`.
