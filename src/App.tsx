import React,{useState,useRef,useEffect,useLayoutEffect} from 'react';
import {defaults,project,unproject,blocked,placement,pathfind,type Point,type Furniture} from './engine';
import {translator} from './locale';
import {Connections, HompiSidebar, SideTabs, ExtraView, type HompiView} from './HompiExtras';
const KEY='bom-miniroom-v1';
const EMBED_KEY='bom-miniroom-embed-v1';
type Saved={items:Furniture[];night:boolean;lamp:boolean};
function load(key=KEY):Saved{try{const s=JSON.parse(localStorage.getItem(key)||'null');if(s&&typeof s.night==='boolean'&&typeof s.lamp==='boolean'&&Array.isArray(s.items)){const items=defaults.map(d=>{const v=s.items.find((f:Furniture)=>f.id===d.id);return {...d,x:Number.isFinite(v?.x)?v.x:d.x,y:Number.isFinite(v?.y)?v.y:d.y}});if(items.every(f=>placement(f,items)))return {items,night:s.night,lamp:s.lamp}}}catch{}return {items:defaults.map(f=>({...f})),night:false,lamp:true}}
export function App({embedded=false,portfolio=false}:{embedded?:boolean;portfolio?:boolean}){
 const t=translator(portfolio);
 const [view,setView]=useState<HompiView>('room');
 function changeView(next:HompiView){if(edit&&next!=='room')toggleEdit();setView(next)}
 const [initial]=useState(()=>load(embedded?EMBED_KEY:KEY)),[items,setItems]=useState(initial.items),[night,setNight]=useState(initial.night),[lamp,setLamp]=useState(initial.lamp),[edit,setEdit]=useState(false),[selected,setSelected]=useState('sofa'),[person,setPerson]=useState<Point>({x:6.6,y:7}),[action,setAction]=useState('idle'),[bubble,setBubble]=useState(t('오늘도, 좋은 하루!')),[notice,setNotice]=useState(t('나만의 작은 세상에 오신 걸 환영해요.')),[saved,setSaved]=useState(true);
 const scene=useRef<HTMLDivElement>(null),route=useRef<Point[]>([]),position=useRef(person),arrival=useRef<null|(()=>void)>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null),drag=useRef<{id:string;start:Point;origin:Point}|null>(null);
 useEffect(()=>{try{localStorage.setItem(embedded?EMBED_KEY:KEY,JSON.stringify({items,night,lamp}));setSaved(true)}catch{setSaved(false)}},[items,night,lamp,embedded]);
 useEffect(()=>{let frame:number,last=0;function tick(t:number){const dt=Math.min((t-last)/1000,.05);last=t;if(route.current.length){const p=position.current,q=route.current[0],d=Math.hypot(q.x-p.x,q.y-p.y),speed=2.7*dt;if(d<=speed){position.current=q;route.current.shift()}else position.current={x:p.x+(q.x-p.x)/d*speed,y:p.y+(q.y-p.y)/d*speed};setPerson({...position.current});if(!route.current.length){setAction('idle');const cb=arrival.current;arrival.current=null;cb?.()}}frame=requestAnimationFrame(tick)}frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame)},[]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current)},[]);
 function say(text:string){setBubble(text);if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>{setBubble('');setAction(a=>a==='wave'?'idle':a)},3300)}
 function move(p:Point,cb?:()=>void){const path=pathfind(position.current,p,items);if(!path.length){setNotice(t('가구가 없는 바닥을 눌러 주세요.'));return false}route.current=path;arrival.current=cb||null;setAction('walk');setBubble('');setNotice(t('사뿐사뿐, 미니미가 걸어가요.'));return true}
 function interact(f:Furniture){if(edit){setSelected(f.id);return}if(f.id==='lamp'){setLamp(v=>!v);setNotice(lamp?t('스탠드를 껐어요.'):t('따뜻한 불을 켰어요.'))}else if(f.id==='sofa'){const candidates=[{x:f.x,y:f.y+f.h/2+.55},{x:f.x+f.w/2+.55,y:f.y}];let ok=false;for(const p of candidates){if(!blocked(p,items)){ok=move(p,()=>{setAction('sit');say(t('잠깐 쉬어 갈까요?'));setNotice(t('포근한 소파에서 쉬는 중 · 바닥을 누르면 일어나요.'))});if(ok)break}}if(!ok)setNotice(t('소파 옆에 걸어갈 공간을 만들어 주세요.'))}else say(f.id==='plant'?t('너도 무럭무럭 자라렴.'):t('내가 아끼는 작은 물건들.'));}
 function point(e:React.PointerEvent):Point{const r=scene.current!.getBoundingClientRect();return unproject((e.clientX-r.left)*940/r.width,(e.clientY-r.top)*680/r.height)}
 function floor(e:React.PointerEvent){if(edit||drag.current)return;const p=point(e);if(!blocked(p,items))move(p)}
 function start(e:React.PointerEvent,f:Furniture){if(!edit)return;e.stopPropagation();setSelected(f.id);drag.current={id:f.id,start:point(e),origin:{x:f.x,y:f.y}};scene.current?.setPointerCapture(e.pointerId)}
 function dragging(e:React.PointerEvent){if(!drag.current)return;const d=drag.current,p=point(e);setItems(old=>{const f=old.find(o=>o.id===d.id)!;const next={...f,x:Math.round((d.origin.x+p.x-d.start.x)*4)/4,y:Math.round((d.origin.y+p.y-d.start.y)*4)/4};return placement(next,old)?old.map(o=>o.id===d.id?next:o):old})}
 function nudge(dx:number,dy:number){setItems(old=>{const f=old.find(o=>o.id===selected)!,next={...f,x:f.x+dx,y:f.y+dy};return placement(next,old)?old.map(o=>o.id===selected?next:o):old})}
 function toggleEdit(){route.current=[];arrival.current=null;setAction('idle');setEdit(v=>!v);setBubble('');setNotice(edit?t('꾸미기를 마쳤어요. 가구 배치를 저장했어요.'):t('가구를 드래그해 보세요. 겹치는 자리는 피할게요.'));if(edit){if(blocked(position.current,items)){let free:Point|undefined;for(let y=9;y>=.5&&!free;y-=.5)for(let x=9;x>=.5;x-=.5){if(!blocked({x,y},items)){free={x,y};break}}if(free){position.current=free;setPerson(free)}}}}
 function reset(){route.current=[];arrival.current=null;drag.current=null;setItems(defaults.map(f=>({...f})));setNight(false);setLamp(true);setEdit(false);setAction('idle');position.current={x:6.6,y:7};setPerson(position.current);say(t('다시, 처음의 설렘으로!'));setNotice(t('처음의 방으로 돌아왔어요.'))}
 const sofa=items.find(f=>f.id==='sofa')!; const seat=project(sofa); const p=action==='sit'?{x:seat.x-9,y:seat.y-24}:project(person);const ordered=[...items.map(f=>({type:'f' as const,depth:f.x+f.y+f.h/2,f})),{type:'p' as const,depth:person.x+person.y,f:null}].sort((a,b)=>a.depth-b.depth);
 const roomScene=<div className={`scene ${night?'night':''} ${edit?'decorating':''}`} ref={scene} onPointerDown={floor} onPointerMove={dragging} onPointerUp={()=>{drag.current=null}} onPointerCancel={()=>{drag.current=null}}>
 <Room night={night} lamp={lamp} portfolio={portfolio}/><button className="window-hit" aria-label={t('창문: 낮과 밤 바꾸기')} onPointerDown={e=>e.stopPropagation()} onClick={()=>{setNight(v=>!v);setNotice(night?t('햇살이 방 안으로 들어와요.'):t('별이 뜨는 밤이 되었어요.'))}}><span>{night?t('밤 → 낮'):t('낮 → 밤')}</span></button>
 {edit&&<div className="edit-label">{t('꾸미기 모드 · 가구를 끌어서 옮겨 보세요')}</div>}
 {ordered.map((o,i)=>o.type==='f'?<button key={o.f!.id} aria-label={t(o.f!.label)} className={`furniture ${edit&&selected===o.f!.id?'selected':''} ${o.f!.id==='lamp'&&lamp?'lit':''}`} style={{left:`${project(o.f!).x/9.4}%`,top:`${project(o.f!).y/6.8}%`,width:`${o.f!.width/9.4}%`,height:`${o.f!.height/6.8}%`,zIndex:10+i}} onPointerDown={e=>{e.stopPropagation();start(e,o.f!)}} onClick={()=>interact(o.f!)}><img src={`/assets/${o.f!.asset}.png`} alt="" draggable={false}/>{edit&&selected===o.f!.id&&<span className="furniture-label">{t(o.f!.label)}</span>}</button>:!edit&&<button key="mini" className={`character ${action}`} aria-label={`${t('미니미 봄이')} ${action==='sit'?t('앉아 있음'):action==='walk'?t('걷는 중'):t('인사하기')}`} style={{left:`${p.x/9.4}%`,top:`${p.y/6.8}%`,zIndex:10+i}} onPointerDown={e=>e.stopPropagation()} onClick={()=>{route.current=[];arrival.current=null;setAction('wave');say(t('안녕! 내 방에 놀러 와 줘서 고마워 ♡'))}}><img src={action==='sit'?'/assets/mini-sit.png':'/assets/mini.png'} alt=""/>{action==='walk'&&<><img className="motion-frame frame-a" src="/assets/mini-walk1.png" alt=""/><img className="motion-frame frame-b" src="/assets/mini-walk2.png" alt=""/></>}{action==='wave'&&<><img className="motion-frame frame-a" src="/assets/mini-wave1.png" alt=""/><img className="motion-frame frame-b" src="/assets/mini-wave2.png" alt=""/></>}{bubble&&!portfolio&&<span className="speech">{bubble}</span>}<span className="mini-name">{t('봄이')}</span></button>)}
 {portfolio&&bubble&&<PortfolioSpeech text={bubble} anchor={p} roomRef={scene}/>}
 </div>;
 if(embedded)return <main className="embed-room" aria-label={t('인터랙티브 미니룸')}>{roomScene}<span className="embed-status" role="status">{notice}</span></main>;
 return <main className="page"><header className="masthead"><a className="brand" href="#room">mini<span>hompi</span><small>{t('나의 작은 취향이 모이는 곳')}</small></a><div className="date">2026.11.03 <span>{t('화요일의 작은 행복')}</span></div></header><section className="hompi"><aside className="profile"><div className="visits">TODAY <b>24</b><i/> TOTAL <b>2,004</b></div><div className="profile-inner"><div className="portrait"><img src="/assets/mini.png" alt={t('분홍 카디건을 입은 미니미 봄이')}/></div><div className="mood"><span>TODAY IS</span>{t(' 포근함')}</div><p className="intro">{t('좋아하는 것들로 채운')}<br/>{t('나의 작은 방.')}<br/><br/>{t('잠깐 쉬었다 가요.')}</p><div className="profile-name">{t('봄이 ')}<span>♡</span></div><p className="profile-caption">{t('작고 소중한 일상의 기록')}</p><div className="profile-divider"/><Connections/></div><div className="since">EST. 2004 · MADE FOR TODAY</div></aside><article className="room-panel" id="room"><div className="room-heading"><div><p className="eyebrow">A LITTLE SPACE, ALL MINE</p><h1>{t('봄이의 미니홈피 ')}<span>♡</span></h1></div><span className="privacy">{t('나만의 공간')}</span></div><div id="miniroom-view" hidden={view!=='room'}>{view==='room'&&<nav className="tabs"><button className={!edit?'active':''} onClick={()=>{setView('room');if(edit)toggleEdit()}}>{t('미니룸')}</button><button className={edit?'editing':''} onClick={()=>{setView('room');toggleEdit()}}>{t('꾸미기 ')}<span>✧</span></button><span className="tab-note">{t('오늘도 내 방에서, 편안하게.')}</span></nav>}<div className="room-title"><h2>{t('햇살이 머무는 방')}</h2><span><i className={night?'night-dot':''}/>{night?t('고요한 밤'):t('나른한 오후')} <b>·</b> ROOM 01</span></div>{roomScene}<div className="room-toolbar"><div className="room-status" role="status"><span className="status-dot"/>{notice}</div><button className={`decorate-button ${edit?'on':''}`} onClick={toggleEdit}>{edit?t('꾸미기 완료'):t('꾸미기')}</button><button className="reset" onClick={reset}>{t('처음으로')}</button></div>{edit&&<div className="edit-controls"><select aria-label={t('이동할 가구')} value={selected} onChange={e=>setSelected(e.target.value)}>{items.map(f=><option key={f.id} value={f.id}>{t(f.label)}</option>)}</select><span>{t('미세 조정')}</span>{[['↖',-.25,0],['↗',0,-.25],['↙',0,.25],['↘',.25,0]].map(([label,x,y])=><button key={label} aria-label={`${t('가구 이동')} ${label}`} onClick={()=>nudge(Number(x),Number(y))}>{label}</button>)}</div>}<div className="instructions"><span className="instruction-title">{t('작은 방 사용법')}</span><p>{t('바닥을 누르면 걷고, 미니미를 누르면 인사해요.')}<br className="mobile-break"/>{t(' 소파에서 쉬고, 조명과 창문도 눌러 보세요.')}</p><span className="save-status">{saved?t('저장됨'):t('저장 공간 확인 필요')}</span></div></div>{view!=='room'&&<ExtraView view={view}/>}</article><HompiSidebar/><SideTabs view={view} onChange={changeView}/></section><footer><span>{t('조금 느려도 괜찮아, 여기는 나의 작은 세상.')}</span><span>mini hompi · a little nostalgia</span></footer></main>
}
function Room({night,lamp,portfolio}:{night:boolean;lamp:boolean;portfolio:boolean}){const t=translator(portfolio);const ref=useRef<HTMLCanvasElement>(null);useEffect(()=>{const c=ref.current!,ctx=c.getContext('2d')!;ctx.clearRect(0,0,940,680);ctx.imageSmoothingEnabled=false;const poly=(points:number[][],fill:string,stroke='#bca18e')=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()};
 poly([[100,420],[470,235],[840,420],[470,605]],night?'#b89b83':'#d9ad77');poly([[100,420],[470,605],[470,620],[100,435]],'#b98b61');poly([[470,605],[840,420],[840,435],[470,620]],'#c29970');
 poly([[100,420],[100,195],[470,10],[470,235]],night?'#c4bac9':'#f3e9df');poly([[470,10],[840,195],[840,420],[470,235]],night?'#b9b2c7':'#f6eee7');
 ctx.save();ctx.beginPath();ctx.moveTo(100,420);ctx.lineTo(470,235);ctx.lineTo(840,420);ctx.lineTo(470,605);ctx.clip();for(let i=-30;i<50;i++){ctx.strokeStyle=i%3===0?'#b88759':'#c79a69';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,i*13);ctx.lineTo(940,i*13+470);ctx.stroke();for(let j=0;j<10;j++){const x=j*94+(i%2)*47;ctx.beginPath();ctx.moveTo(x,i*13+x*.5);ctx.lineTo(x-13,i*13+x*.5+6.5);ctx.stroke()}}ctx.restore();
 for(let i=0;i<19;i++){const x=100+i*19.5;ctx.strokeStyle=night?'#b9afbf':'#e5d9d0';ctx.beginPath();ctx.moveTo(x,195-(x-100)*.5);ctx.lineTo(x,420-(x-100)*.5);ctx.stroke();const xr=470+i*19.5;ctx.beginPath();ctx.moveTo(xr,10+(xr-470)*.5);ctx.lineTo(xr,235+(xr-470)*.5);ctx.stroke()}
 poly([[100,401],[470,216],[470,235],[100,420]],'#dfb8b6');poly([[470,216],[840,401],[840,420],[470,235]],'#dfb8b6');poly([[100,393],[470,208],[470,214],[100,399]],'#fff6ec');poly([[470,208],[840,393],[840,399],[470,214]],'#fff6ec');
 // Right-wall window, with its own changeable sky and panes.
 poly([[586,99],[733,172],[733,297],[586,224]],'#ab7850');poly([[594,112],[725,177],[725,284],[594,219]],night?'#415474':'#b8dce4','#f5d6a2');
 if(night){ctx.fillStyle='#fff5cf';ctx.fillRect(686,190,12,12);for(const [x,y] of [[607,145],[663,172],[705,231]]){ctx.fillRect(x,y,3,3)}}else{poly([[594,192],[630,192],[661,231],[695,227],[725,256],[725,284],[594,219]],'#9ebc9a','#9ebc9a')}
 poly([[656,143],[663,147],[663,254],[656,251]],'#f5d6a2');poly([[594,163],[725,228],[725,235],[594,170]],'#f5d6a2');poly([[578,218],[739,298],[739,307],[578,227]],'#c08d5f');
 // Pink curtain pair.
 poly([[577,96],[600,107],[604,156],[594,213],[578,205],[585,155]],'#db9ca5');poly([[716,165],[740,177],[737,286],[720,278],[727,229]],'#db9ca5');
 // Framed prints on the left wall.
 for(const [x,y] of [[268,181],[323,153]]){poly([[x,y],[x+35,y-18],[x+35,y+27],[x,y+45]],'#c08d64');poly([[x+5,y+3],[x+30,y-10],[x+30,y+23],[x+5,y+36]],'#fff7e7');ctx.fillStyle='#d5a6ac';ctx.fillRect(x+13,y+9,12,12)}
 // Rug is a non-blocking floor asset.
 poly([[310,429],[457,356],[627,441],[480,514]],night?'#bb909d':'#e9bdc3','#c895a1');poly([[326,429],[457,364],[611,441],[480,506]],'#efd0ce','#f8e3db');
 if(lamp){ctx.globalAlpha=.09;ctx.fillStyle='#ffe2a2';ctx.beginPath();ctx.ellipse(355,433,130,62,0,0,7);ctx.fill();ctx.globalAlpha=1}
 },[night,lamp]);return <canvas ref={ref} width="940" height="680" aria-label={t('따뜻한 나무 바닥과 두 벽이 있는 아이소메트릭 미니룸')}/>}

// English copy can be longer. Position only its text bubble within the room;
// the character, depth order, floor coordinates, and Korean rendering stay unchanged.
function PortfolioSpeech({text,anchor,roomRef}:{text:string;anchor:Point;roomRef:React.RefObject<HTMLDivElement|null>}) {
 const ref=useRef<HTMLSpanElement>(null);
 const [layout,setLayout]=useState({left:0,top:0,arrow:0,below:false,ready:false});
 useLayoutEffect(()=>{
  const bubble=ref.current,room=roomRef.current??bubble?.parentElement;
  if(!room||!bubble)return;
  function positionBubble(){
   const roomWidth=room!.clientWidth,roomHeight=room!.clientHeight;
   const width=bubble!.offsetWidth,height=bubble!.offsetHeight;
   const x=anchor.x/940*roomWidth,y=anchor.y/680*roomHeight;
   const above=y-roomHeight*.18-height-6;
   const below=above<8;
   const left=Math.max(8,Math.min(x-width/2,roomWidth-width-8));
   const top=Math.max(8,Math.min(below?y+16:above,roomHeight-height-8));
   setLayout({left,top,arrow:Math.max(10,Math.min(x-left-4,width-14)),below,ready:true});
  }
  positionBubble();
  const observer=new ResizeObserver(positionBubble);
  observer.observe(room);observer.observe(bubble);
  return()=>observer.disconnect();
 },[text,anchor.x,anchor.y,roomRef]);
 return <span ref={ref} className={`speech portfolio-speech ${layout.below?'below':''}`} style={{left:layout.left,top:layout.top,visibility:layout.ready?'visible':'hidden','--speech-arrow':`${layout.arrow}px`} as React.CSSProperties}>{text}</span>;
}
