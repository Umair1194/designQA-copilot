import { describe,it,expect } from 'vitest';
import { publicAddress,websiteUrl } from '../../src/website/url';
import { reviewPlan } from '../../src/engine/review-plan';
import { runAudit } from '../../src/engine/audit-engine';
import { serializeReport } from '../../src/engine/report';
import type { NormalizedNode } from '../../src/shared/types';
const node=(patch:Partial<NormalizedNode>):NormalizedNode=>({id:'n',name:'Content',type:'TEXT',pageId:'p',visible:true,locked:false,opacity:1,fills:[],strokes:[],childrenIds:[],styleIds:[],reactionsCount:0,...patch});
describe('review quality',()=>{
 it('does not flag paragraph length as long rendered lines',async()=>{const result=await runAudit({profile:'responsive-web',nodes:[node({bounds:{x:0,y:0,width:300,height:200},text:{characters:'A paragraph. '.repeat(30),fontSize:16}})]});expect(result.issues.some(i=>i.ruleId==='typography/very-long-line-length')).toBe(false);});
 it('only flags clipping when visible content crosses the frame',async()=>{const frame=node({id:'f',type:'FRAME',bounds:{x:0,y:0,width:300,height:200},layout:{clipsContent:true},childrenIds:['c']});const child=node({id:'c',parentId:'f',bounds:{x:10,y:10,width:100,height:20}});const inside=await runAudit({profile:'responsive-web',nodes:[frame,child]});expect(inside.issues.some(i=>i.ruleId==='layout/content-clipping')).toBe(false);child.bounds!.x=290;const outside=await runAudit({profile:'responsive-web',nodes:[frame,child]});expect(outside.issues.find(i=>i.ruleId==='layout/content-clipping')?.confidence).toBe('medium');});
 it('links copy findings to a relevant heuristic and includes recovery',async()=>{const summary=await runAudit({profile:'responsive-web',nodes:[node({text:{characters:'Something went wrong'}})]});const issue=summary.issues.find(i=>i.ruleId==='forms/generic-error-message');expect(issue?.standardReferences[0]?.standard).toBe('NN/G');expect(issue?.remediation.join(' ')).toContain('preserve entered work');expect(summary.reviewMethods?.map(m=>m.name)).toContain('Card sorting');expect(summary.coverage.automatic).toBe(18);});
 it('includes every requested method without claiming research outcomes',()=>{for(const source of ['figma','website'] as const){const methods=reviewPlan(source);expect(methods).toHaveLength(19);expect(methods.filter(m=>m.name.startsWith('Heuristic'))).toHaveLength(10);expect(methods.find(m=>m.name==='A/B testing')?.status).toMatch(/Needs/);}});
 it('exports evidence, action and safe CSV cells',async()=>{const summary=await runAudit({profile:'responsive-web',nodes:[node({name:'=SUM(1)',text:{characters:'Click here'}})]});summary.issues[0]!.title='=malicious';expect(serializeReport('csv',summary)).toContain("'=malicious");const html=serializeReport('html',summary);expect(html).toContain('Recommended change');expect(html).toContain('Validation still needed');});
});
describe('website destination boundaries',()=>{
 it('rejects credentials and non-web URLs',()=>{expect(()=>websiteUrl('file:///etc/passwd')).toThrow();expect(()=>websiteUrl('https://user:secret@example.com')).toThrow();expect(websiteUrl('https://example.com/path').hostname).toBe('example.com');});
 it('rejects private, loopback and reserved destinations',()=>{for(const address of ['127.0.0.1','10.0.0.1','172.16.1.1','192.168.1.1','169.254.169.254','100.64.0.1','0.0.0.0','224.0.0.1','::1','fc00::1','fe80::1','::ffff:127.0.0.1','2001:db8::1'])expect(publicAddress(address),address).toBe(false);expect(publicAddress('93.184.216.34')).toBe(true);expect(publicAddress('2606:4700:4700::1111')).toBe(true);});
});
