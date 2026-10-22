import type { AuditIssue } from '../shared/types';
const KEY='design-qa-copilot-v1';export interface StoredData{version:1;baseline:AuditIssue[];suppressions:Array<{fingerprint:string;reason:string}>}
export const loadData=async():Promise<StoredData>=>(await figma.clientStorage.getAsync(KEY))??{version:1,baseline:[],suppressions:[]};
export const saveBaseline=async(issues:AuditIssue[])=>{const data=await loadData();await figma.clientStorage.setAsync(KEY,{...data,baseline:issues})};
export const clearData=()=>figma.clientStorage.deleteAsync(KEY);
