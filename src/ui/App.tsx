import { useEffect, useMemo, useRef, useState } from 'react';
import type { AuditIssue, AuditSummary, PlatformProfile, ScanScope } from '../shared/types';
import type { PluginToUi, UiToPlugin } from '../shared/protocol';
import { reviewPlan } from '../engine/review-plan';
import { serializeReport } from '../engine/report';
const post=(message:UiToPlugin)=>parent.postMessage({pluginMessage:message},'*');
const download=(content:string,name:string,mime:string)=>{const href=URL.createObjectURL(new Blob([content],{type:mime})),a=document.createElement('a');a.href=href;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);};
export function App(){
 const [mode,setMode]=useState<'figma'|'website'>('figma'),[scope,setScope]=useState<ScanScope>('selection'),[profile,setProfile]=useState<PlatformProfile>('responsive-web');
 const [summary,setSummary]=useState<AuditSummary>(),[progress,setProgress]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[query,setQuery]=useState(''),[severity,setSeverity]=useState('all'),[selectionCount,setSelectionCount]=useState(0),[confirmed,setConfirmed]=useState(false),[createReport,setCreateReport]=useState(true),[reportStatus,setReportStatus]=useState(''),[tab,setTab]=useState<'results'|'review'|'about'>('results');
 const [url,setUrl]=useState(''),[sessionKey,setSessionKey]=useState(''),[pendingFix,setPendingFix]=useState<AuditIssue>(),[fixPreview,setFixPreview]=useState('');
 const abort=useRef<AbortController|undefined>(undefined);
 useEffect(()=>{
 const listener=(e:MessageEvent<{pluginMessage?:PluginToUi}>)=>{if(e.source!==parent)return;const m=e.data.pluginMessage;if(!m)return;
 if(m.type==='INIT')setSelectionCount(m.selectionCount);
 if(m.type==='PROGRESS'){setBusy(true);setProgress(`${m.phase}: ${m.completed}/${m.total}${m.page?` — ${m.page}`:''}`);}
 if(m.type==='RESULT'){setSummary(m.summary);setBusy(false);setProgress('');}
 if(m.type==='REPORT_CREATED'){setBusy(false);setProgress('');setReportStatus('Report created and selected in Figma.');}
 if(m.type==='CANCELLED'){setBusy(false);setProgress('Review cancelled.');}
 if(m.type==='ERROR'){setError(m.message);setBusy(false);setProgress('');}
 if(m.type==='EXPORT_READY')download(m.content,m.name,m.mime);
 if(m.type==='FIX_PREVIEW')setFixPreview(m.message);
 };window.addEventListener('message',listener);post({type:'READY'});return()=>window.removeEventListener('message',listener);
 },[]);
 const visible=useMemo(()=>summary?.issues.filter(i=>(severity==='all'||i.severity===severity)&&`${i.title} ${i.ruleId} ${i.description}`.toLowerCase().includes(query.toLowerCase()))??[],[summary,severity,query]);
 const scan=async()=>{
 setError('');setReportStatus('');setSummary(undefined);setQuery('');setSeverity('all');
 if(mode==='figma'){setBusy(true);post({type:'START_SCAN',scope,profile,createReport,...(scope==='file'?{confirmedFileScan:confirmed}:{})});return;}
 try{const target=new URL(url);if(!['http:','https:'].includes(target.protocol)||target.username||target.password)throw new Error('Enter a public HTTP or HTTPS URL without credentials.');
 if(!sessionKey.trim())throw new Error('Paste the session key from the website service terminal.');
 setBusy(true);setProgress('Reviewing the website at three widths. This may take a minute.');const controller=new AbortController();abort.current=controller;
 const response=await fetch('http://localhost:4318/audit',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${sessionKey.trim()}`},body:JSON.stringify({url:target.href}),signal:controller.signal});
 if(!response.ok)throw new Error(await response.text());const result=await response.json() as AuditSummary;if(result.source!=='website'||!Array.isArray(result.issues))throw new Error('The website service returned an invalid report.');setSummary(result);setProgress('Website review complete. Open the annotated page to see feedback in context.');
 }catch(e){if(e instanceof Error&&e.name==='AbortError')setProgress('Review disconnected. The service may finish the current page in the background.');else setError(e instanceof TypeError?'Cannot reach the website service. Run npm run website:serve, then retry.':e instanceof Error?e.message:'Website review failed.');}finally{setBusy(false);abort.current=undefined;}
 };
 const changeMode=(next:'figma'|'website')=>{setMode(next);setSummary(undefined);setError('');setProgress('');setReportStatus('');};
 const methods=summary?.reviewMethods??reviewPlan(mode);
 const preview=(issue:AuditIssue)=>{setPendingFix(issue);setFixPreview('');post({type:'PREVIEW_FIX',issue});};
 return <main>
 <header><div className="eyebrow">DESIGN QA COPILOT</div><h1>Review the experience.</h1><p>Find design risks, understand their impact and decide what to fix first.</p></header>
 <nav aria-label="Plugin sections">{(['results','review','about']as const).map(t=><button aria-current={tab===t?'page':undefined} className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t==='results'?'Audit':t==='review'?'Validation plan':'About'}</button>)}</nav>
 {tab==='results'&&<>
 <section className="controls" aria-label="Audit setup">
 <div className="source-switch" role="group" aria-label="Review source"><button disabled={busy} aria-pressed={mode==='figma'} onClick={()=>changeMode('figma')}>Figma design</button><button disabled={busy} aria-pressed={mode==='website'} onClick={()=>changeMode('website')}>Live website</button></div>
 <fieldset disabled={busy}>
 {mode==='figma'?<><label>Scan scope<select value={scope} onChange={e=>{setScope(e.target.value as ScanScope);setConfirmed(false);setError('');}}><option value="selection">Current selection ({selectionCount})</option><option value="top-level-frames">Selected frames</option><option value="page">Current page</option><option value="file">Entire file</option><option value="component-library">Component library</option><option value="prototype-flow">Prototype flow</option></select></label>{scope==='selection'&&selectionCount===0&&<p className="hint">Select a frame or section in Figma to start.</p>}
 <label>Product profile<select value={profile} onChange={e=>setProfile(e.target.value as PlatformProfile)}><option value="responsive-web">Responsive web</option><option value="mobile-web">Mobile web</option><option value="ios">iOS application</option><option value="android">Android application</option><option value="saas">SaaS dashboard</option><option value="ecommerce">E-commerce</option><option value="custom">Custom</option></select></label><p className="setup-note">Profiles label the report. The current automatic checks are shared across profiles.</p>
 <label className="confirm"><input type="checkbox" checked={createReport} onChange={e=>setCreateReport(e.target.checked)}/> Add feedback to a report frame beside the design.</label>{scope==='file'&&<label className="confirm"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/> Load every page. Large files may take longer.</label>}</>:
 <><label>Website URL<input type="url" placeholder="https://example.com" value={url} onChange={e=>setUrl(e.target.value)} autoComplete="off"/></label><label>Local service session key<input type="password" value={sessionKey} onChange={e=>setSessionKey(e.target.value)} autoComplete="off" aria-describedby="connection-help"/></label><details><summary>Connect the website reviewer</summary><p id="connection-help">In the plugin folder, run <code>npx playwright install chromium</code> once, then <code>npm run website:serve</code>. Paste the session key printed in that terminal.</p></details><p className="setup-note">Reviews one public page in Chromium at 390, 768 and 1440 px. Feedback appears on a captured page copy. Reports stay in service memory; the website receives normal browser requests.</p></>}
 </fieldset>
 <div className="actions"><button className="primary" onClick={()=>void scan()} disabled={busy||(mode==='figma'&&((scope==='selection'&&selectionCount===0)||(scope==='file'&&!confirmed)))||(mode==='website'&&(!url.trim()||!sessionKey.trim()))}>{busy?'Reviewing…':'Run review'}</button>{busy&&<button onClick={()=>mode==='website'?abort.current?.abort():post({type:'CANCEL_SCAN'})}>{mode==='website'?'Disconnect':'Cancel'}</button>}</div>
 <div aria-live="polite" className="status">{progress||reportStatus}</div>{error&&<div role="alert" className="error">{error}</div>}
 </section>
 {!summary&&!busy&&<section className="empty"><h2>{mode==='figma'?'Start with the main user flow':'Review a public page'}</h2><p>{mode==='figma'?'Select the frames needed to complete a task. Findings include evidence, impact and a recommended change.':'Enter the full URL. The report places feedback over screenshots so each issue can be reviewed in context.'}</p></section>}
 {summary&&<><section className="metrics"><div><b>{summary.issues.length}</b><span>Findings</span></div><div><b>{summary.scannedNodes}</b><span>Elements inspected</span></div><div><b>{summary.coverage.automatic}</b><span>Checks run</span></div></section>
 {summary.cancelled&&<p role="status" className="hint">Incomplete review. Run again before using this report for decisions.</p>}
 {summary.annotationUrl&&<p className="report-link"><a href={summary.annotationUrl} target="_blank" rel="noreferrer">Open feedback on the captured page ↗</a></p>}
 <section className="filters"><input aria-label="Filter findings" placeholder="Find a finding…" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Priority" value={severity} onChange={e=>setSeverity(e.target.value)}>{['all','blocker','critical','major','minor','info'].map(s=><option key={s} value={s}>{s==='all'?'All priorities':s}</option>)}</select></section>
 <section aria-label="Review findings" className="issues">{visible.length?visible.map(i=><article key={i.fingerprint}><div><span className={`badge ${i.severity}`}>{i.severity}</span><span className="confidence">{i.confidence} confidence</span></div><h2>{i.title}</h2><dl><dt>Evidence</dt><dd>{i.evidence.map(e=>`${e.property}: ${e.observed}${e.expected?` (expected: ${e.expected})`:''}`).join(' · ')}</dd><dt>Why it matters</dt><dd>{i.description}</dd><dt>Recommended change</dt><dd>{i.remediation.join(' ')}</dd><dt>Basis</dt><dd>{i.standardReferences.map(r=><span key={`${r.standard}-${r.criterion}`}>{r.url?<a href={r.url} target="_blank" rel="noreferrer">{r.standard} {r.criterion}</a>:`${r.standard} ${r.criterion??''}`} </span>)}{!i.standardReferences.length&&'Design maintenance guidance. Confirm user impact before prioritizing.'}</dd></dl>{i.primaryNodeId&&summary.source!=='website'&&<button onClick={()=>post({type:'NAVIGATE',nodeId:i.primaryNodeId!})}>Show affected element</button>}{i.fixAvailability!=='none'&&<button onClick={()=>preview(i)}>Preview change</button>}</article>):<div className="empty"><h2>{summary.issues.length?'No findings match these filters.':'No issues detected by these checks.'}</h2><p>{summary.issues.length?'Clear the search or select all priorities.':'Review the validation plan before approving the experience.'}</p></div>}</section>
 {pendingFix&&fixPreview&&<section role="dialog" aria-label="Review proposed change" className="review"><h2>{pendingFix.title}</h2><p>{fixPreview}</p><button onClick={()=>{post({type:'APPLY_FIX',issue:pendingFix});setPendingFix(undefined);setFixPreview('');}}>Apply this change</button><button onClick={()=>{setPendingFix(undefined);setFixPreview('');}}>Keep current design</button></section>}
 <footer><button disabled={busy} onClick={()=>post({type:'CREATE_REPORT',summary,profile})}>Add report to Figma</button>{summary.source!=='website'&&<button onClick={()=>post({type:'SAVE_BASELINE',issues:summary.issues})}>Save issue baseline</button>}{(['json','csv','html']as const).map(f=><button key={f} onClick={()=>download(serializeReport(f,summary),`design-review.${f}`,f==='html'?'text/html':f==='csv'?'text/csv':'application/json')}>Export {f.toUpperCase()}</button>)}</footer></>}
 </>}
 {tab==='review'&&<section className="review"><h2>Validation plan</h2><p>Use these methods to validate the main task. “Needs” means the method has not been run by this review.</p>{methods.map(m=><details key={m.name}><summary>{m.name}<span className="method-status">{m.status}</span></summary><p>{m.reason}</p><p><strong>Next step: </strong>{m.action}</p><a href={m.reference} target="_blank" rel="noreferrer">Method reference ↗</a></details>)}</section>}
 {tab==='about'&&<section className="review"><h2>Evidence before approval</h2><p>Figma scans run locally. Website reviews use a separate browser service on your computer; the service requests the entered page and its assets. No design layers are sent to that service.</p><p>Automatic findings and validation plans support a review. They cannot establish usability, accessibility conformance or experiment outcomes.</p><button onClick={()=>post({type:'CLEAR_DATA'})}>Clear saved Figma baselines and preferences</button><p>To remove website reports, stop the local service. Reports are retained only in memory.</p></section>}
 </main>;
}
