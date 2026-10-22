import { websiteCopy } from './copy';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { lookup } from 'node:dns/promises';
import type { AuditIssue, AuditSummary } from '../shared/types';
import { reviewPlan } from '../engine/review-plan';
import { publicAddress, websiteUrl } from './url';
export interface WebsiteCapture { width:number; image:Buffer; findings:Array<{id:string;x:number;y:number;width:number;height:number}> }
export async function auditWebsite(input:string):Promise<{summary:AuditSummary;captures:WebsiteCapture[]}>{
 const url=websiteUrl(input),start=Date.now(),browser=await chromium.launch();
 const issueByLocation=new Map<string,AuditIssue>();const issues:AuditIssue[]=[],captures:WebsiteCapture[]=[];let inspected=0;const checks=new Set<string>();
 const add=(rule:string,title:string,reason:string,fix:string,selector:string,width:number,criterion:string,severity:AuditIssue['severity']='major')=>{
 const key=`${rule}:${selector}`;const existing=issueByLocation.get(key);
 if(existing){const viewport=existing.evidence.find(e=>e.property==='Viewport');if(viewport)viewport.observed+=`, ${width}px`;return existing.id;}
 const id=`${rule}:${issues.length+1}`;
 issues.push({id,fingerprint:id,ruleId:rule,title,description:reason,severity,confidence:rule==='web/hierarchy'||rule==='web/link-copy'?'medium':'high',automationLevel:'automatic',status:'open',nodeIds:[],evidence:[{property:'Location',observed:selector},{property:'Viewport',observed:`${width}px`}],standardReferences:[{standard:criterion,url:criterion.startsWith('WCAG')?'https://www.w3.org/TR/WCAG22/':'https://www.nngroup.com/articles/ten-usability-heuristics/'}],remediation:[fix],fixAvailability:'none',createdAt:Date.now()});issueByLocation.set(key,issues[issues.length-1]!);return id;
 };
 try {
 const context=await browser.newContext({serviceWorkers:'block',acceptDownloads:false});
 await context.route('**/*',async route=>{try{const target=websiteUrl(route.request().url());const addresses=await lookup(target.hostname.replace(/^\[|\]$/g,''),{all:true});if(!addresses.length||addresses.some(a=>!publicAddress(a.address)))return await route.abort();await route.continue();}catch{await route.abort();}});
 const page=await context.newPage();page.setDefaultTimeout(10000);page.on('dialog',dialog=>void dialog.dismiss());
 for(const width of [390,768,1440]){
 await page.setViewportSize({width,height:900});const response=await page.goto(url.href,{waitUntil:'domcontentloaded',timeout:30000});if(!response||response.status()>=400)throw new Error(`The page returned ${response?.status()??'no response'}. Check the URL or access restrictions.`);await page.waitForTimeout(750);
 if(width===390)inspected=await page.locator('*').count();
 await page.evaluate(()=>window.scrollTo(0,0));
 const findings:WebsiteCapture['findings']=[];
 const mark=async(id:string,selector:string)=>{try{const bounds=await page.locator(selector).first().boundingBox();if(bounds)findings.push({id,...bounds});}catch{/* Some axe targets reference shadow roots. Keep their textual evidence. */}};
 const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
 for(const rule of [...result.passes,...result.violations,...result.incomplete,...result.inapplicable])checks.add(rule.id);
 for(const violation of result.violations){for(const node of violation.nodes.slice(0,5)){
 const selector=node.target.map(String).join(' '),criterion=`WCAG 2.2 · ${violation.tags.filter(t=>/^wcag\d{3,4}$/.test(t)).join(', ')} · ${violation.id}`;
 const copy=websiteCopy[violation.id];const id=add(`web/${violation.id}`,copy?.title??violation.help,copy?.reason??violation.description,copy?.action??`Correct the reported ${violation.id} condition. Retest the element and its states. Reference: ${violation.helpUrl}`,selector,width,criterion,violation.impact==='critical'?'critical':violation.impact==='serious'?'major':'minor');await mark(id,selector);
 }}
 checks.add('reflow');checks.add('title');checks.add('hierarchy');checks.add('link-copy');
 const signals=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+2,title:document.title.trim(),h1:document.querySelectorAll('h1').length,ambiguous:Array.from(document.querySelectorAll('a')).filter(a=>/^(click here|here|read more|learn more)$/i.test(a.textContent?.trim()??'')).slice(0,5).map(a=>({text:a.textContent!.trim(),href:a.getAttribute('href')??''}))}));
 if(signals.overflow)add('web/reflow','The page scrolls sideways','Content extends beyond the viewport. Reading or reaching controls may require horizontal scrolling. Wide data tables may be an intentional exception.','Identify the overflowing section. Let text wrap and controls reflow; confirm at 320 CSS px and 400% zoom.','html',width,'WCAG 2.2 · 1.4.10');
 if(!signals.title)add('web/document-title','The page has no title','People navigating tabs or using a screen reader cannot identify this page from its title.','Add a concise title describing this page and the product.','head > title',width,'WCAG 2.2 · 2.4.2');
 if(signals.h1===0)add('web/hierarchy','The main page heading is missing','Without a main heading, readers have less structure for identifying the page purpose. Review the page’s heading hierarchy before adding one.','Use a descriptive main heading and organize section headings beneath it.','body',width,'NN/G · Recognition rather than recall','minor');
 for(const link of signals.ambiguous)add('web/link-copy',`“${link.text}” gives little context`,'Repeated generic links make destinations harder to distinguish when scanning or listening to a link list. Surrounding context may resolve this; check the accessible name.','Name the destination or outcome, such as “View delivery options”.',`Link to ${link.href}`,width,'NN/G · Match between system and the real world','minor');
 const image=await page.screenshot({fullPage:true,animations:'disabled'});captures.push({width,image,findings});
 }
 return {summary:{source:'website',sourceUrl:url.href,issues,scannedNodes:inspected,durationMs:Date.now()-start,cancelled:false,coverage:{automatic:checks.size,assisted:10,manual:reviewPlan('website').length},scores:{},reviewMethods:reviewPlan('website')},captures};
 }finally{await browser.close();}
}
