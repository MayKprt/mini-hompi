import {useEffect,useRef,useState,type FormEvent} from 'react';
import {SOCIAL_KEY,parseSocialState,initialSocialState,newId,displayDate,type SocialState,type DiaryEntry} from './socialStore';

function useSocialState(){
 const [state,setState]=useState<SocialState>(()=>{try{return parseSocialState(localStorage.getItem(SOCIAL_KEY))}catch{return initialSocialState()}});
 const [saved,setSaved]=useState(true);
 useEffect(()=>{try{localStorage.setItem(SOCIAL_KEY,JSON.stringify(state));setSaved(true)}catch{setSaved(false)}},[state]);
 return {state,setState,saved};
}
function StorageNote({saved}:{saved:boolean}){return <p className="local-save-note">{saved?'Saved in this browser only. Nothing is posted online.':'Browser storage is unavailable. Changes will last while this view stays open.'}</p>}

export function DiaryView(){
 const {state,setState,saved}=useSocialState();
 const dialog=useRef<HTMLDialogElement>(null);
 const [openComments,setOpenComments]=useState<Record<string,boolean>>({});
 const [title,setTitle]=useState(''),[body,setBody]=useState(''),[mood,setMood]=useState('cozy'),[status,setStatus]=useState('');
 function publish(e:FormEvent){
  e.preventDefault();if(!title.trim()||!body.trim())return;
  const entry:DiaryEntry={id:newId(),title:title.trim(),body:body.trim(),mood,date:new Date().toISOString()};
  setState(s=>({...s,diary:[entry,...s.diary]}));setTitle('');setBody('');setMood('cozy');dialog.current?.close();setStatus('A new page for your little world. Your diary entry was added.');
 }
 return <div className="diary-entries">
  <p className="social-status" role="status">{status}</p>
  {state.diary.map(entry=><article className="diary-entry" key={entry.id} aria-labelledby={`entry-${entry.id}`}>
   <time dateTime={entry.date}>{displayDate(entry.date).toUpperCase()}</time><h3 id={`entry-${entry.id}`}>{entry.title}</h3><p className="diary-body">{entry.body}</p><span className="entry-mood">Feeling: {entry.mood}</span>
   <div className="entry-social"><button className="diary-like" aria-label={`Like ${entry.title}`} aria-pressed={!!state.likes[entry.id]} onClick={()=>setState(s=>({...s,likes:{...s.likes,[entry.id]:!s.likes[entry.id]}}))}><span aria-hidden="true">♡</span> Like <span>{state.likes[entry.id]?1:0}</span></button><button className="comment-count" aria-label={`Comments on ${entry.title}`} aria-expanded={!!openComments[entry.id]} aria-controls={`comment-form-${entry.id}`} onClick={()=>setOpenComments(s=>({...s,[entry.id]:!s[entry.id]}))}>{state.comments[entry.id]?.length??0} {(state.comments[entry.id]?.length??0)===1?'comment':'comments'}</button></div>
   {(state.comments[entry.id]??[]).map(comment=><div className="diary-comment" key={comment.id}><header><strong>{comment.name}</strong><time dateTime={comment.date}>{displayDate(comment.date)}</time></header><p>{comment.body}</p></div>)}
   <CommentForm entry={entry} open={!!openComments[entry.id]} onSubmit={text=>{const comment={id:newId(),name:'You',body:text,date:new Date().toISOString()};setState(s=>({...s,comments:{...s.comments,[entry.id]:[...(s.comments[entry.id]??[]),comment]}}));setStatus(`Your comment on “${entry.title}” was added.`)}}/>
  </article>)}
  <div className="diary-write-row"><StorageNote saved={saved}/><button className="write-diary" onClick={()=>{dialog.current?.showModal();dialog.current?.querySelector<HTMLInputElement>('#diary-title')?.focus()}}>+ Write diary</button></div>
  <dialog ref={dialog} className="diary-notepad" aria-labelledby="diary-editor-title">
   <div className="notepad-header"><div><p>A PAGE FROM YOUR DAY</p><h2 id="diary-editor-title">Write a diary</h2></div><button type="button" aria-label="Close diary editor" onClick={()=>dialog.current?.close()}>×</button></div>
   <form onSubmit={publish}>
    <label htmlFor="diary-title">Title</label><input id="diary-title" autoFocus required maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Give today a little title"/>
    <label htmlFor="diary-body">Dear diary…</label><textarea id="diary-body" className="notepad-paper" required maxLength={5000} rows={8} value={body} onChange={e=>setBody(e.target.value)} placeholder="What would you like to remember?"/>
    <label htmlFor="diary-mood">How are you feeling?</label><select id="diary-mood" value={mood} onChange={e=>setMood(e.target.value)}>{['cozy','inspired','grateful','thoughtful','happy'].map(value=><option key={value} value={value}>{value}</option>)}</select>
    <div className="notepad-footer"><span>Just for this browser, just for you.</span><div><button type="button" onClick={()=>dialog.current?.close()}>Cancel</button><button className="social-primary" disabled={!title.trim()||!body.trim()} type="submit">Save entry</button></div></div>
   </form>
  </dialog>
 </div>;
}
function CommentForm({entry,onSubmit,open}:{entry:DiaryEntry;onSubmit:(text:string)=>void;open:boolean}){
 const [text,setText]=useState('');
 const input=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{if(open)input.current?.focus()},[open]);
 return <form id={`comment-form-${entry.id}`} hidden={!open} className="comment-composer" onSubmit={e=>{e.preventDefault();if(!text.trim())return;onSubmit(text.trim());setText('')}}><label htmlFor={`comment-${entry.id}`}>Comment on {entry.title}</label><textarea ref={input} id={`comment-${entry.id}`} required maxLength={1000} rows={2} value={text} onChange={e=>setText(e.target.value)} placeholder="Leave a little kindness…"/><button className="social-primary" type="submit" disabled={!text.trim()}>Post comment</button></form>;
}

export function GuestbookView(){
 const {state,setState,saved}=useSocialState();
 const [body,setBody]=useState(''),[status,setStatus]=useState('');
 function submit(e:FormEvent){e.preventDefault();if(!body.trim())return;const note={id:newId(),name:'You',body:body.trim(),date:new Date().toISOString()};setState(s=>({...s,visitors:[note,...s.visitors]}));setBody('');setStatus('Your note was added to this browser’s guestbook. Thanks for stopping by!')}
 return <>
  <div className="visitor-notes">{state.visitors.map(visitor=><article className="visitor-note" key={visitor.id}><VisitorCharacter name={visitor.name}/><div><header><h3>{visitor.name}</h3><time dateTime={visitor.date}>{displayDate(visitor.date).toUpperCase()}</time></header><p>{visitor.body}</p></div></article>)}</div>
  <form className="guestbook-form" onSubmit={submit} aria-labelledby="leave-note-title"><h3 id="leave-note-title">Leave a little note</h3><label htmlFor="visitor-message">Your message</label><textarea id="visitor-message" required maxLength={1000} rows={3} value={body} onChange={e=>setBody(e.target.value)} placeholder="A friendly hello goes a long way…"/><div className="guestbook-submit"><StorageNote saved={saved}/><button className="social-primary" type="submit" disabled={!body.trim()}>Submit message</button></div><p className="social-status" role="status">{status}</p></form>
 </>;
}




// Four original transparent sprites generated to match Bomi's pixel-art family.
function VisitorCharacter({name}:{name:string}){
 const known:Record<string,number>={Robin:0,Jamie:1,Alex:2,Sophie:3,You:0};
 const index=known[name]??Array.from(name).reduce((sum,c)=>sum+c.charCodeAt(0),0)%4;
 if(name==='Robin')return <span className="visitor-character" role="img" aria-label="Robin’s mini character"><img className="visitor-robin-baby" src="/assets/robin-baby.svg" alt=""/></span>;
 return <span className="visitor-character" role="img" aria-label={name+'’s mini character'}><PixelVisitorSprite index={index}/></span>;
}

// Give the face more of the existing slot: enlarge the head and shorten the
// body on a crisp 48×64 grid while preserving the original outfit artwork.
function PixelVisitorSprite({index}:{index:number}){
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  let active=true;
  const image=new Image();
  image.onload=()=>{
   if(!active)return;
   const context=canvas.current?.getContext('2d');if(!context)return;
   context.clearRect(0,0,48,64);
   context.imageSmoothingEnabled=false;
   const cellWidth=image.naturalWidth/4;
   const neck=image.naturalHeight*.55;
   // Wider head crop fills the slot; the face receives 44 of its 64 rows.
   context.drawImage(image,index*cellWidth+cellWidth*.04,0,cellWidth*.92,neck,0,0,48,44);
   context.drawImage(image,index*cellWidth,neck,cellWidth,image.naturalHeight-neck,0,44,48,20);
   // Preserve readable dark eyes and a one-pixel glint at this small display size.
   context.fillStyle='#432b24';
   context.fillRect(17,31,4,5);context.fillRect(30,31,4,5);
   context.fillStyle='#fff7e3';
   context.fillRect(18,31,1,2);context.fillRect(31,31,1,2);
  };
  image.src='/assets/visitor-friends.png';
  return()=>{active=false;image.onload=null};
 },[index]);
 return <canvas ref={canvas} width={48} height={64} className="visitor-pixel-sprite" aria-hidden="true"/>;
}
