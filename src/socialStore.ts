export type DiaryEntry={id:string;title:string;body:string;mood:string;date:string};
export type Note={id:string;name:string;body:string;date:string};
export type SocialState={diary:DiaryEntry[];visitors:Note[];likes:Record<string,boolean>;comments:Record<string,Note[]>};
export const SOCIAL_KEY='full-hompi-social-v1';
const robinNote=():Note=>({id:'robin',name:'Robin',date:'2026-11-07T12:00:00-05:00',body:'A little hello from a cozy corner of the internet.'});
export function initialSocialState():SocialState{return {
 diary:[
  {id:'slow-saturday',date:'2026-11-07T12:00:00-05:00',title:'A slow Saturday',body:'Opened the window, watered my little plant, and let the afternoon wander in. Some days, doing a little less feels just right.',mood:'cozy'},
  {id:'small-joys',date:'2026-11-05T12:00:00-05:00',title:'Making room for small joys',body:'A favorite song, a warm cup of tea, and a pink cushion in just the right spot. Collecting the little things that make this place feel like me.',mood:'inspired'},
 ],
 visitors:[
  robinNote(),
  {id:'jamie',name:'Jamie',date:'2026-11-06T12:00:00-05:00',body:'This room feels like a warm cup of tea. Thanks for letting me stop by!'},
  {id:'alex',name:'Alex',date:'2026-11-04T12:00:00-05:00',body:'That little plant has the best spot in the house. Saving a little sunshine for my own room.'},
  {id:'sophie',name:'Sophie',date:'2026-11-02T12:00:00-05:00',body:'Came for a quick hello, stayed for the cozy pink sofa. See you again soon!'},
 ],likes:{},comments:{},
}}
const record=(value:unknown):value is Record<string,unknown>=>typeof value==='object'&&value!==null&&!Array.isArray(value);
const dated=(value:Record<string,unknown>)=>typeof value.id==='string'&&typeof value.date==='string'&&Number.isFinite(Date.parse(value.date));
const note=(value:unknown):value is Note=>record(value)&&dated(value)&&typeof value.name==='string'&&typeof value.body==='string';
export function parseSocialState(raw:string|null):SocialState{
 try{const s:unknown=JSON.parse(raw??'null');if(record(s)&&Array.isArray(s.diary)&&s.diary.every(e=>record(e)&&dated(e)&&['title','body','mood'].every(k=>typeof e[k]==='string'))&&Array.isArray(s.visitors)&&s.visitors.every(note)&&record(s.likes)&&Object.values(s.likes).every(v=>typeof v==='boolean')&&record(s.comments)&&Object.values(s.comments).every(v=>Array.isArray(v)&&v.every(note))){const state=s as SocialState;const robin=robinNote();if(!state.visitors.some(visitor=>visitor.id===robin.id||(visitor.name===robin.name&&visitor.body===robin.body)))state.visitors.unshift(robin);return state}}catch{}
 return initialSocialState();
}
export function newId(){return globalThis.crypto?.randomUUID?.()??`${Date.now()}-${Math.random().toString(36).slice(2)}`}
export function displayDate(date:string){return new Intl.DateTimeFormat('en-US',{month:'short',day:'2-digit',year:'numeric'}).format(new Date(date))}
