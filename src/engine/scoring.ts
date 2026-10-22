import type { AuditIssue } from '../shared/types';
const weights={blocker:20,critical:12,major:6,minor:2,info:0};const confidence={high:1,medium:.65,low:.35};
export function scoreIssues(issues:AuditIssue[]){const result:Record<string,number>={};for(const issue of issues){const key=issue.standardReferences[0]?.standard==='WCAG'?'Accessibility risk':'Overall';result[key]=(result[key]??100)-weights[issue.severity]*confidence[issue.confidence]}for(const key of Object.keys(result))result[key]=Math.max(0,Math.round(result[key]??0));return result}
