const hash=(value:string)=>{let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(36)};
export const fingerprint=(ruleId:string,nodeId:string,property:string,observed:unknown)=>hash([ruleId,nodeId,property,JSON.stringify(observed)].join('|'));
