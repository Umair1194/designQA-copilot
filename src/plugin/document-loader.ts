import type { ScanScope } from '../shared/types';
import { flatten,normalizeNode } from './node-index';
import { REPORT_KEY } from './report-frame';
const normalizeTree=async(node:SceneNode,pageId:string)=>[await normalizeNode(node,pageId),...('children'in node?await flatten(node,pageId):[])];
const unique=<T extends {id:string}>(nodes:T[])=>[...new Map(nodes.map(node=>[node.id,node])).values()];
const withoutGeneratedReport=(nodes:Awaited<ReturnType<typeof flatten>>,page:PageNode)=>{const reportIds=new Set(page.findAll(n=>n.type==='FRAME'&&n.getPluginData(REPORT_KEY)==='true').map(n=>n.id));const byId=new Map(nodes.map(n=>[n.id,n]));return nodes.filter(node=>{let current:typeof node|undefined=node;while(current){if(reportIds.has(current.id))return false;current=current.parentId?byId.get(current.parentId):undefined;}return true;});};
export async function loadScope(scope:ScanScope,onPage?:(name:string,index:number,total:number)=>void){
 if(scope==='selection'||scope==='top-level-frames')return withoutGeneratedReport(unique((await Promise.all(figma.currentPage.selection.filter(n=>scope==='selection'||n.type==='FRAME').map(n=>normalizeTree(n,figma.currentPage.id)))).flat()),figma.currentPage);
 if(scope==='page'||scope==='component-library'||scope==='prototype-flow'){
 const nodes=withoutGeneratedReport(await flatten(figma.currentPage,figma.currentPage.id),figma.currentPage);
 if(scope==='page')return nodes;
 const byId=new Map(nodes.map(n=>[n.id,n]));
 const roots=new Set(nodes.filter(n=>scope==='component-library'?['COMPONENT','COMPONENT_SET'].includes(n.type):n.reactionsCount>0).map(n=>n.id));
 return nodes.filter(n=>{let current:typeof n|undefined=n;while(current){if(roots.has(current.id))return true;current=current.parentId?byId.get(current.parentId):undefined;}return false;});
 }
 const pages=figma.root.children,out=[];for(let i=0;i<pages.length;i++){const page=pages[i]!;onPage?.(page.name,i,pages.length);await page.loadAsync();out.push(...withoutGeneratedReport(await flatten(page,page.id),page));await new Promise(r=>setTimeout(r,0));}return out;
}
