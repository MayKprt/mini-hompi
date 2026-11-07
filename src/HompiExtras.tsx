import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {DiaryView, GuestbookView} from './SocialViews';
import {createLittleWindow} from './littleWindow';

export type HompiView = 'room' | 'diary' | 'photos' | 'visitors';
const views: {id: HompiView; label: string}[] = [
  {id:'room',label:'My Room'}, {id:'diary',label:'Diary'},
  {id:'photos',label:'Photos'}, {id:'visitors',label:'Visitors'},
];

export function SideTabs({view,onChange}:{view:HompiView;onChange:(view:HompiView)=>void}) {
  return <nav className="hompi-side-tabs" aria-label="Mini hompi views">
    {views.map(tab=><button key={tab.id} className={view===tab.id?'current':''} aria-current={view===tab.id?'page':undefined} aria-controls={tab.id==='room'?'miniroom-view':'hompi-extra-view'} onClick={()=>onChange(tab.id)}>{tab.label}</button>)}
  </nav>;
}

export function Connections() {
  const [name,setName]=useState(''),[message,setMessage]=useState('');
  return <section className="connections" aria-labelledby="connections-title">
    <div className="connections-heading"><label id="connections-title" htmlFor="connections-select">My Connections</label><span>03</span></div>
    <select id="connections-select" value={name} onChange={e=>{setName(e.target.value);setMessage('')}}>
      <option value="">Choose a friend’s room</option>
      <option value="Jamie">Jamie’s Little Corner</option>
      <option value="Alex">Alex’s Cloud Room</option>
      <option value="Sophie">Sophie’s Studio</option>
    </select>
    {name?<div className="connection-visit"><span>{name}’s room</span><button onClick={()=>setMessage(`Room visits are coming soon. ${name}’s room isn’t connected yet.`)}>Visit Room</button></div>:<p className="connections-hint">Three little worlds to discover.</p>}
    <p className="connections-feedback" role="status">{message||'Sample connections · Room visits coming soon'}</p>
  </section>;
}

const tracks=[{title:'Afternoon Sunshine'},{title:'A Little Daydream'}];
const MUSIC_MUTE_KEY='full-hompi-music-muted';

function MusicPlayer() {
  const [track,setTrack]=useState(0),[playing,setPlaying]=useState(false),[muted,setMuted]=useState(()=>{try{return localStorage.getItem(MUSIC_MUTE_KEY)==='true'}catch{return false}}),[error,setError]=useState('');
  const audio=useRef<AudioContext|null>(null),master=useRef<GainNode|null>(null);
  const source=useRef<AudioBufferSourceNode|null>(null),buffer=useRef<AudioBuffer|null>(null),loading=useRef(false);
  const titleBox=useRef<HTMLParagraphElement>(null),titleText=useRef<HTMLSpanElement>(null);
  const [overflow,setOverflow]=useState(0);
  useEffect(()=>{
    let active=true;
    const measure=()=>{if(active)setOverflow(Math.max(36,(titleText.current?.scrollWidth??0)-(titleBox.current?.clientWidth??0)))};
    const observer=new ResizeObserver(measure);if(titleBox.current)observer.observe(titleBox.current);measure();
    void document.fonts.ready.then(measure);return()=>{active=false;observer.disconnect()};
  },[track]);
  useEffect(()=>{
    try{localStorage.setItem(MUSIC_MUTE_KEY,String(muted))}catch{}
    if(master.current&&audio.current)master.current.gain.setTargetAtTime(muted?0:.13,audio.current.currentTime,.03);
  },[muted]);
  useEffect(()=>()=>{source.current?.stop();void audio.current?.close()},[]);
  function restart(direction:number){
    if(source.current&&audio.current&&buffer.current){
      source.current.stop();const next=audio.current.createBufferSource();
      next.buffer=buffer.current;next.loop=true;next.connect(master.current!);next.start();source.current=next;
    }
    setTrack(value=>(value+direction+tracks.length)%tracks.length);
  }
  async function toggle(){
    if(loading.current)return;
    try{
      if(playing){await audio.current?.suspend();setPlaying(false);return}
      if(!audio.current){audio.current=new AudioContext();master.current=audio.current.createGain();master.current.gain.value=muted?0:.13;master.current.connect(audio.current.destination)}
      const context=audio.current;
      await context.resume();
      if(!buffer.current){loading.current=true;buffer.current=await createLittleWindow(context);loading.current=false}
      if(!source.current){const next=context.createBufferSource();next.buffer=buffer.current;next.loop=true;next.connect(master.current!);next.start();source.current=next}
      setError('');setPlaying(true);
    }catch{loading.current=false;setPlaying(false);setError('Audio is unavailable in this browser.')}
  }
  return <section className="sidebar-music" aria-labelledby="music-player-title">
    <div className="sidebar-section-title"><h2 id="music-player-title">My Playlist</h2><span className={playing?'player-indicator playing':'player-indicator'} aria-hidden="true"/></div>
    <div className="track-display"><span className={playing?'player-cd spinning':'player-cd'} aria-hidden="true"/><p ref={titleBox} className="track-title" title={tracks[track].title}><span ref={titleText} className="scrolling-title" style={{'--title-travel':'-'+overflow+'px'} as CSSProperties}>{tracks[track].title}</span></p></div>
    <p className="track-caption">Original sample melody</p>
    <div className="player-controls">
      <button aria-label="Previous track" title="Previous track" onClick={()=>restart(-1)}><span aria-hidden="true">‹</span></button>
      <button className="play-control" aria-label={playing?'Pause music':'Play music'} title={playing?'Pause music':'Play music'} aria-pressed={playing} onClick={()=>void toggle()}><span aria-hidden="true">{playing?'Ⅱ':'▷'}</span></button>
      <button aria-label="Next track" title="Next track" onClick={()=>restart(1)}><span aria-hidden="true">›</span></button>
      <button aria-label={muted?'Unmute music':'Mute music'} title={muted?'Unmute music':'Mute music'} aria-pressed={muted} onClick={()=>setMuted(v=>!v)}><span aria-hidden="true">{muted?'×':'♪'}</span></button>
    </div>
    <p className="player-state" role="status">{error||(playing?(muted?'Playing · muted':'Playing · on repeat'):'Press play for a little sunshine')}</p>
  </section>;
}

export function HompiSidebar(){
  return <aside className="hompi-tools" aria-label="My levels and music">
    <section className="levels-panel" aria-labelledby="my-levels-title">
      <div className="sidebar-section-title"><h2 id="my-levels-title">My Levels</h2><span>Lv. 07</span></div>
      {[{label:'Activity',value:72,color:'activity'},{label:'Creativity',value:88,color:'creativity'},{label:'Connections',value:46,color:'connections-level'}].map(level=><div className="level-row" key={level.label}>
        <div><label htmlFor={`level-${level.color}`}>{level.label}</label><span>{level.value}%</span></div>
        <progress id={`level-${level.color}`} className={level.color} value={level.value} max={100}>{level.value}%</progress>
      </div>)}
      <p className="levels-note">A little more you, every day.<br/><span>Sample levels</span></p>
    </section>
    <MusicPlayer/>
  </aside>;
}

export function ExtraView({view}:{view:Exclude<HompiView,'room'>}){
  const descriptions={diary:'Small moments, saved.',photos:'Little details worth remembering.',visitors:'A hello makes a room feel like home.'};
  return <section id="hompi-extra-view" className="hompi-extra-view" aria-labelledby="extra-view-heading">
    <header className="extra-view-header"><div><p className="extra-eyebrow">BOMI’S LITTLE WORLD</p><h2 id="extra-view-heading">{view==='visitors'?'Connections Only':views.find(tab=>tab.id===view)?.label}</h2><p>{descriptions[view]}</p></div></header>
    {view==='diary'&&<DiaryView/>}
    {view==='photos'&&<><div className="photo-album">
      {[{asset:'sofa',title:'My favorite corner',caption:'A soft place to land.',className:'rose'},{asset:'plant',title:'A little green company',caption:'Growing at our own pace.',className:'sage'},{asset:'mini',title:'Hello, it’s Bomi',caption:'A tiny portrait, a big hello.',className:'peach'}].map(photo=><figure className="album-photo" key={photo.asset}><div className={`photo-mat ${photo.className}`}><img src={`/assets/${photo.asset}.png`} alt={photo.title}/></div><figcaption><h3>{photo.title}</h3><p>{photo.caption}</p></figcaption></figure>)}
    </div><p className="view-coming-soon">Sample room details · Photo uploads are coming soon.</p></>}
    {view==='visitors'&&<GuestbookView/>}
  </section>;
}
