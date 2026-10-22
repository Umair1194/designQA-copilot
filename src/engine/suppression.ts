export interface Suppression { fingerprint:string; reason:string; createdAt:number }
export const applySuppressions=<T extends {fingerprint:string}>(issues:T[],suppressions:Suppression[])=>{const hidden=new Set(suppressions.filter(s=>s.reason.trim()).map(s=>s.fingerprint));return issues.filter(i=>!hidden.has(i.fingerprint))};
