export interface Rgb { r:number; g:number; b:number }
export interface Rgba extends Rgb { a:number }
const linearize=(v:number)=>v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4);
export const relativeLuminance=(c:Rgb)=>0.2126*linearize(c.r)+0.7152*linearize(c.g)+0.0722*linearize(c.b);
export const contrastRatio=(a:Rgb,b:Rgb)=>{const l1=relativeLuminance(a),l2=relativeLuminance(b);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05)};
export const composite=(fg:Rgba,bg:Rgba):Rgba=>{const a=fg.a+bg.a*(1-fg.a);if(a===0)return{r:0,g:0,b:0,a:0};return{r:(fg.r*fg.a+bg.r*bg.a*(1-fg.a))/a,g:(fg.g*fg.a+bg.g*bg.a*(1-fg.a))/a,b:(fg.b*fg.a+bg.b*bg.a*(1-fg.a))/a,a}};
export const isLargeText=(size:number,weight:number)=>size>=24||(size>=18.66&&weight>=700);
