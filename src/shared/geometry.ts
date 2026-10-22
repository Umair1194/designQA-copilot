import type { Rect } from './types';
export const intersects=(a:Rect,b:Rect)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
export const edgeDistance=(a:Rect,b:Rect)=>Math.max(0,Math.hypot(Math.max(b.x-(a.x+a.width),a.x-(b.x+b.width),0),Math.max(b.y-(a.y+a.height),a.y-(b.y+b.height),0)));
export const targetMeets=(r:Rect,min:number)=>r.width>=min&&r.height>=min;
