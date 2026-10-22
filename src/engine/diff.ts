import type { AuditIssue } from '../shared/types';
export const diffIssues=(before:AuditIssue[],after:AuditIssue[])=>{const old=new Set(before.map(i=>i.fingerprint)),next=new Set(after.map(i=>i.fingerprint));return{newIssues:after.filter(i=>!old.has(i.fingerprint)),resolved:before.filter(i=>!next.has(i.fingerprint)),unchanged:after.filter(i=>old.has(i.fingerprint))}};
