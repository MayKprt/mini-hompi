export type Point = {x:number;y:number};
export type Furniture = Point & {id:string;label:string;w:number;h:number;asset:string;width:number;height:number};
export const defaults:Furniture[]=[
{id:'sofa',label:'분홍 소파',x:2.2,y:2.2,w:2.5,h:1.3,asset:'sofa',width:186,height:145},
{id:'table',label:'티 테이블',x:4.4,y:4.9,w:1.6,h:1.15,asset:'table',width:116,height:98},
{id:'lamp',label:'스탠드',x:1,y:4.1,w:.6,h:.6,asset:'lamp',width:61,height:154},
{id:'shelf',label:'작은 책장',x:6.8,y:1,w:1.5,h:1,asset:'shelf',width:112,height:126},
{id:'plant',label:'초록 친구',x:8.5,y:2.2,w:.7,h:.7,asset:'plant',width:67,height:100}];
export const project=(p:Point)=>({x:470+(p.x-p.y)*37,y:235+(p.x+p.y)*18.5});
export const unproject=(x:number,y:number):Point=>({x:((x-470)/37+(y-235)/18.5)/2,y:((y-235)/18.5-(x-470)/37)/2});
export const inside=(p:Point)=>p.x>=.35&&p.y>=.35&&p.x<=9.65&&p.y<=9.65;
export const blocked=(p:Point,items:Furniture[],margin=.23)=>!inside(p)||items.some(f=>Math.abs(p.x-f.x)<f.w/2+margin&&Math.abs(p.y-f.y)<f.h/2+margin);
export function placement(f:Furniture,items:Furniture[]){return f.x-f.w/2>=.2&&f.y-f.h/2>=.2&&f.x+f.w/2<=9.8&&f.y+f.h/2<=9.8&&!items.some(o=>o.id!==f.id&&Math.abs(o.x-f.x)<(o.w+f.w)/2+.15&&Math.abs(o.y-f.y)<(o.h+f.h)/2+.15)}
export function pathfind(start:Point,target:Point,items:Furniture[]):Point[]{
 const step=.25,N=41,key=(x:number,y:number)=>y*N+x; const sx=Math.round(start.x/step),sy=Math.round(start.y/step),tx=Math.round(target.x/step),ty=Math.round(target.y/step);
 if(blocked({x:tx*step,y:ty*step},items))return [];
 const queue=[[sx,sy]],prev=new Map<number,number>();prev.set(key(sx,sy),-1);let found=-1;
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(x===tx&&y===ty){found=key(x,y);break}for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<0||ny<0||nx>=N||ny>=N||prev.has(k)||blocked({x:nx*step,y:ny*step},items))continue;if(dx&&dy&&(blocked({x:(x+dx)*step,y:y*step},items)||blocked({x:x*step,y:(y+dy)*step},items)))continue;prev.set(k,key(x,y));queue.push([nx,ny])}}
 if(found<0)return [];const out:Point[]=[];while(prev.get(found)!==-1){out.push({x:(found%N)*step,y:Math.floor(found/N)*step});found=prev.get(found)!}return out.reverse();
}
