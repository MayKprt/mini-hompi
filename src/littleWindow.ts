// Original eight-bar composition, 72 BPM. All sound is synthesized locally.
// No samples, external recordings, or melodies from existing soundtracks.
export async function createLittleWindow(context:AudioContext):Promise<AudioBuffer>{
 const rate=24000,beat=60/72,length=32*beat,tail=4;
 const render=new OfflineAudioContext(2,Math.ceil((length+tail)*rate),rate);
 const bus=render.createGain();bus.gain.value=.65;bus.connect(render.destination);
 function note(midi:number,time:number,duration:number,level:number,bell=false){
  const frequency=440*2**((midi-69)/12);
  // A soft fundamental with quickly fading upper partials gives a felt-piano tone.
  const partials=bell?[[1,1],[2.76,.12],[5.4,.035]]:[[1,1],[2,.22],[3,.07]];
  for(const [multiple,weight] of partials){
   const voice=render.createOscillator(),gain=render.createGain();
   voice.type='sine';voice.frequency.value=frequency*multiple;
   gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(level*weight,time+.012);
   gain.gain.exponentialRampToValueAtTime(.00001,time+duration);
   voice.connect(gain);gain.connect(bus);voice.start(time);voice.stop(time+duration+.02);
  }
 }
 const chords=[[48,55,59,64],[45,52,55,60],[53,57,60,64],[55,59,62,69],[48,55,60,64],[45,52,59,64],[53,57,60,67],[55,59,62,65]];
 // Deliberate rests and an answering phrase keep the loop unhurried.
 const melody=[[[0,76],[1.5,79],[2.5,74]],[[.5,72],[2,76],[3,71]],[[0,69],[1,72],[2.5,76]],[[.5,74],[2,71],[3,69]],[[0,67],[1.5,76],[2.5,79]],[[.5,76],[2,71],[3,72]],[[0,74],[1,72],[2.5,69]],[[0,71],[1.5,74],[2.5,67]]];
 chords.forEach((chord,bar)=>{
  const start=bar*4*beat;
  chord.forEach((midi,index)=>note(midi,start+index*.045,3.7*beat,index===0?.12:.055));
  note(chord[1],start+2*beat,1.7*beat,.035);
  melody[bar].forEach(([offset,midi])=>note(midi,start+offset*beat,1.65*beat,.115));
  if(bar===1||bar===5)note(88,start+3.5*beat,2.8,.018,true);
 });
 const rendered=await render.startRendering();
 const frames=Math.round(length*rate),buffer=context.createBuffer(2,frames,rate);
 // Fold note releases across the boundary instead of cutting them off.
 for(let channel=0;channel<2;channel++){
  const source=rendered.getChannelData(channel),output=buffer.getChannelData(channel);
  for(let i=0;i<source.length;i++)output[i%frames]+=source[i];
 }
 return buffer;
}
