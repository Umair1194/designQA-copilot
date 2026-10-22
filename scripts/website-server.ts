import { createServer } from 'node:http';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { auditWebsite } from '../src/website/audit';
import { serializeReport } from '../src/engine/report';
const token=randomUUID();const reports=new Map<string,{html:string;images:Buffer[]}>();let busy=false;
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const server=createServer(async(req,res)=>{
 res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');res.setHeader('Access-Control-Allow-Private-Network','true');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='OPTIONS'){res.writeHead(204);res.end();return;}
 const path=req.url??'';const match=path.match(/^\/reports\/([a-f0-9-]+)(?:\/(\d+)\.png)?$/);const report=match?reports.get(match[1]!):undefined;
 if(req.method==='GET'&&report){res.setHeader('Content-Type',match![2]?'image/png':'text/html; charset=utf-8');res.setHeader('Content-Security-Policy',"default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'");res.end(match![2]?report.images[Number(match![2])]:report.html);return;}
 const auth=Buffer.from(req.headers.authorization??''),expected=Buffer.from(`Bearer ${token}`);
 if(req.method!=='POST'||path!=='/audit'||auth.length!==expected.length||!timingSafeEqual(auth,expected)){res.writeHead(401);res.end('Connect with the session key shown in the server terminal.');return;}
 if(busy){res.writeHead(409);res.end('A website review is already running. Try again when it finishes.');return;}
 busy=true;
 try{
 let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)throw new Error('Request too large.');}const data=JSON.parse(body) as {url?:unknown};if(typeof data.url!=='string')throw new Error('Enter a website URL.');
 const {summary,captures}=await auditWebsite(data.url);const id=randomUUID();summary.annotationUrl=`http://localhost:4318/reports/${id}`;
 const images=captures.map(c=>c.image);const base=serializeReport('html',summary);
 const html=base+`<h2>Feedback on the page</h2><p>Numbered markers refer to the findings above. This is a captured copy of the page; the live website has not been edited.</p>`+captures.map((c,index)=>`<h3>${c.width}px · Chromium</h3><div style="position:relative;width:${c.width}px;max-width:none"><img alt="Website captured at ${c.width} pixels" src="/reports/${id}/${index}.png" style="width:100%;display:block">${c.findings.map(f=>`<div title="Finding ${summary.issues.findIndex(i=>i.id===f.id)+1}" style="position:absolute;left:${f.x}px;top:${f.y}px;width:${f.width}px;height:${f.height}px;border:2px solid #d92d20;box-sizing:border-box"><a href="#finding-${esc(f.id)}" style="background:#b42318;color:white;font:12px system-ui;padding:2px 5px">${summary.issues.findIndex(i=>i.id===f.id)+1}</a></div>`).join('')}</div>`).join('');
 if(reports.size>=10)reports.delete(reports.keys().next().value!);reports.set(id,{html,images});res.setHeader('Content-Type','application/json');res.end(JSON.stringify(summary));
 }catch(error){res.writeHead(400);res.end(error instanceof Error?error.message:'Website review failed.');}finally{busy=false;}
});
server.listen(4318,'127.0.0.1',()=>{console.log('Website QA service: http://localhost:4318');console.log(`Session key: ${token}`);console.log('Paste this key into the plugin’s Website tab. Reports remain in memory until this process stops.');});
