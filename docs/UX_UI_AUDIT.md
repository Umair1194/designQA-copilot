# Plugin UX and UI review

Reviewed against the source interface and scanner on 4 October 2026. Browser fixtures verify the website scanner; the native Figma workflow still needs the manual checklist.

| Priority | Finding | Why it matters | Change |
| --- | --- | --- | --- |
| High | The README advertised more than 100 checks, but only 16 produced automatic findings. | Reviewers could mistake catalog size for tested coverage and approve an untested flow. NN/G: visibility of system status. | Report checks actually run; describe remaining entries as assisted review prompts. Two copy checks bring the automatic Figma set to 18. |
| High | A fix preview could apply to the first fixable issue instead of the selected issue. | An approved change could affect the wrong element. NN/G: error prevention and user control. | Hold the selected issue through preview and approval. |
| High | Clipping and long paragraphs were reported without evidence of overflow or long rendered lines. | False positives waste review time and weaken trust in legitimate findings. | Require a child to cross frame bounds; estimate line capacity from width and font size, with medium confidence. Scroll containers still need reviewer judgment. |
| High | The report gave no structured path for validating task completion or navigation. | Visual consistency does not show whether people can use the product. | Add ten heuristic review steps and explicit plans for every requested research method to Figma and website reports. |
| Medium | “No issues found” also appeared when filters hid all findings. | The user could mistake a filtered view for a clean review. NN/G: visibility of system status. | Give filters a separate empty state. |
| Medium | HTML and CSV exports omitted useful evidence, actions and rationale. | Findings became harder to assign and defend outside the plugin. | Export evidence, impact, recommended change and basis; include the validation plan in HTML and JSON. |
| Medium | Component-library and prototype-flow scopes scanned the same page contents. | Scope labels promised a distinction the scanner did not make. NN/G: match between system and real world. | Filter components and their descendants; filter nodes with reactions and their descendants. Connected destinations and complete flow traversal remain future work. |
| Medium | Generic error copy and unclear action labels were not evaluated. | People may not know where an action leads or how to recover. NN/G: recognition rather than recall; error recovery. | Add evidence-based copy checks with medium confidence. |
| Medium | Profiles implied customized rules. | Reviewers could assume a platform-specific threshold had been applied. | Explain that current profiles label the report and share the same automatic checks. |

## Next improvements

1. Replace the generated layer rename with a user-editable name. “Frame — reviewed” still does not describe purpose; the current preview requires approval but the rename itself needs better UX.
2. Add prototype graph traversal, task selection and state coverage. A node with a reaction is evidence of an interaction, not proof of a complete user journey.
3. Compare approved screenshots at matching states and dimensions. An issue baseline is not a visual regression baseline.
4. Add a research-results import for task outcomes, experiments and funnels. Keep measured outcomes separate from expert judgment.
5. Validate the plugin in Figma Desktop, including long reports, theme changes, keyboard operation and cancellation during page loading.

## Feedback format

**The error message gives no recovery step** · Major · Medium confidence

**Evidence:** Checkout error: “Something went wrong.”

**Why it matters:** People cannot tell what failed or whether retrying will repeat the payment.

**Recommended change:** Explain whether the payment was processed, preserve entered details and offer a clear next step.

**Basis:** NN/G heuristic 9: help users recognize, diagnose and recover from errors.

This example illustrates the intended writing format. The scanner only reports evidence it has actually observed; it does not infer payment behavior from an error string.

References: [NN/G heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/), [research methods](https://www.nngroup.com/articles/which-ux-research-methods/), [tree testing](https://www.nngroup.com/articles/tree-testing/), [card sorting](https://www.nngroup.com/articles/card-sorting-definition/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/).
