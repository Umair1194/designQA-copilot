import { createServer } from 'node:http';
import { describe,it,expect,vi } from 'vitest';
// Only this fixture test substitutes DNS validation; production always checks real addresses.
vi.mock('node:dns/promises',()=>({lookup:async()=>[{address:'93.184.216.34',family:4}]}));
import { auditWebsite } from '../../src/website/audit';
describe.skipIf(!process.env.RUN_BROWSER_TESTS)('rendered website review',()=>{
 it('reviews all widths and returns screenshots with element markers',async()=>{
 const server=createServer((_,res)=>{res.setHeader('Content-Type','text/html');res.end('<html lang="en"><head><title>Fixture</title></head><body><h1>Checkout</h1><main><div style="width:1100px">Wide content</div><input><button></button><a href="/delivery">Click here</a></main></body></html>');});
 await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));const address=server.address();if(!address||typeof address==='string')throw new Error('Missing fixture address');
 try{const {summary,captures}=await auditWebsite(`http://127.0.0.1:${address.port}`);expect(captures.map(c=>c.width)).toEqual([390,768,1440]);expect(summary.issues.some(i=>i.ruleId==='web/label')).toBe(true);expect(summary.issues.some(i=>i.ruleId==='web/reflow')).toBe(true);expect(summary.issues.some(i=>i.ruleId==='web/link-copy')).toBe(true);expect(captures[0]!.findings.length).toBeGreaterThan(0);expect(captures.every(c=>c.image.length>100)).toBe(true);expect(summary.reviewMethods).toHaveLength(19);}finally{server.close();}
 },60000);
});
