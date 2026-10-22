import { nngHeuristics } from '../standards/nng-heuristics';
export interface ReviewMethod { name:string; status:string; reason:string; action:string; reference:string }
export function reviewPlan(source:'figma'|'website'):ReviewMethod[]{
 const prototype=source==='figma';
 return [
 ...nngHeuristics.map(h=>({name:`Heuristic ${h.id.slice(4)}: ${h.title}`,status:'Needs reviewer',reason:'A layer tree or page snapshot cannot establish whether the main task is clear and recoverable.',action:[
 'Walk through a task. Check that loading, progress and completion are visible.',
 'Check labels against words customers use; remove internal terminology.',
 'Check back, cancel and undo paths without losing entered work.',
 'Compare repeated controls, labels and navigation across screens.',
 'Check constraints, confirmation of destructive actions and helpful defaults.',
 'Keep choices, instructions and prior selections visible at the point of use.',
 'Check shortcuts and repeat-task paths without hiding the basic path.',
 'Remove content that competes with the primary decision or action.',
 'Trigger an error. Check that it names the problem and explains recovery.',
 'Check that task-specific help is easy to find when a user needs it.'
 ][Number(h.id.slice(4))-1]!,reference:'https://www.nngroup.com/articles/ten-usability-heuristics/'})),
 {name:'A/B testing',status:prototype?'Needs prototype study':'Needs experiment data',reason:'A preferred layout is a hypothesis until measured against an alternative.',action:'Compare one change against the current design. Define task completion as the primary measure, randomize allocation and set sample size and stopping rules before starting.',reference:'https://www.nngroup.com/articles/which-ux-research-methods/'},
 {name:'Multivariate testing',status:'Needs experiment data',reason:'Several simultaneous changes can interact; a single review cannot measure their contribution.',action:'Test planned combinations of copy, layout and action placement with sufficient traffic. Track completion and errors; avoid selecting a winner from an underpowered test.',reference:'https://www.nngroup.com/articles/which-ux-research-methods/'},
 {name:'Usability testing',status:'Needs participants',reason:'A design review cannot reveal actual task success or user hesitation.',action:`Give representative users realistic tasks in the ${prototype?'interactive prototype':'website'}. Record completion, wrong turns, errors and points where help is needed.`,reference:'https://www.nngroup.com/articles/which-ux-research-methods/'},
 {name:'Tree testing',status:'Needs participants',reason:'Menu wording can look clear while people still choose the wrong category.',action:'Extract the navigation hierarchy. Ask people to find key items without visual cues; measure direct success and first-choice errors.',reference:'https://www.nngroup.com/articles/tree-testing/'},
 {name:'Card sorting',status:'Needs participants',reason:'The team’s categories may differ from customers’ mental models.',action:'Ask users to group representative content and name the groups. Use repeated patterns to revise categories, then validate them with a tree test.',reference:'https://www.nngroup.com/articles/card-sorting-definition/'},
 {name:'Visual regression testing',status:'Needs approved baseline',reason:'A current snapshot cannot identify unintended changes without an approved previous version.',action:`Compare ${prototype?'exported frames':'screenshots'} at matching dimensions and states against an approved baseline. Review differences before accepting an update.`,reference:'https://playwright.dev/docs/test-snapshots'},
 {name:'Responsive and cross-browser testing',status:prototype?'Needs implementation':'Sampled widths; needs browser matrix',reason:prototype?'Frame dimensions do not prove reflow or browser behavior.':'The scan samples Chromium at 390, 768 and 1440 px. Other browsers and interactive states remain untested.',action:'Check long content, zoom, navigation, forms and dialogs across supported widths in Chromium, Firefox and WebKit. Verify critical tasks in each.',reference:'https://playwright.dev/docs/test-projects'},
 {name:'Accessibility audit',status:prototype?'Static checks only':'Automated DOM checks; needs manual review',reason:'Automated checks cannot establish WCAG conformance or whether an experience works with assistive technology.',action:'Verify keyboard order, visible focus, zoom/reflow, meaningful alternatives and screen-reader feedback. Record the criterion, evidence and recovery for each failure.',reference:'https://www.w3.org/TR/WCAG22/'},
 {name:'Behavioral analytics',status:'Needs usage data',reason:'A snapshot contains no reliable evidence of drop-off, repeat clicks or conversion.',action:`Define events for the main task${prototype?' in the prototype study':''}. Inspect completion funnels and error rates by device; use session evidence to investigate the largest drop-off.`,reference:'https://www.nngroup.com/articles/which-ux-research-methods/'}
 ];
}
