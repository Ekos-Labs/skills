import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Img,OffthreadVideo,Sequence,continueRender,delayRender,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {T,SANS,ease,easeIO,clamp,Card,FileIcon,Check} from '../v3/kit';
import {F,Shot,Line,Speak,Sender,Grain,clip} from './parts';
import {EngineUI,ENGINE_START,TASKS} from './Engine';
import edl from './edl.json';

/* "You build. Ekos does the rest." Jarvis, for marketing. 62 s, 1920x1080, 30 fps.
   Shape follows the a16z "It's time to build" film: a quiet open, a montage of builders,
   a turn, the product, a held mark. Music: film t = track t - 3.75 s, so the track's
   breath (29.75 to 34.25) sits under "Building got easy. Selling didn't." and its first
   big downbeat lands on "Jarvis, for marketing." at 30.5 s. Cut list: edl.json. */

export const JARVIS_FRAMES=F(edl.duration);

const at=(id:string)=>({from:F(clip(id).at),durationInFrames:F(clip(id).dur)});
const FOOTAGE=['c1','c2','m1','m2','m3','m4','m5','m6','m7','r1','r2','r3','r4','r5','r6','r7','r8','g1','e1','e2','o1','o2'];
const DIM:{[k:string]:number}={g1:.25,m7:.1};

/* Cold open: Ekos's morning briefing over the phone lighting up in a dark room. */
const BRIEF=[
 {at:1.3,text:'Good morning.'},
 {at:2.6,text:'While you slept, I found 14 companies hiring their first marketer.'},
 {at:5.2,text:'I wrote to 9 of them. 3 replied.'},
 {at:7.0,text:'One wants to talk on Thursday.'},
];
const Briefing=()=>{
 const f=useCurrentFrame();if(f>F(9.2))return null;
 const out=clamp((F(9.2)-f)/8);
 return <AbsoluteFill style={{opacity:out}}>
  <AbsoluteFill style={{background:'linear-gradient(90deg, rgba(0,0,0,.7) 0%, rgba(0,0,0,.45) 45%, rgba(0,0,0,0) 72%)'}}/>
  <div style={{position:'absolute',left:130,top:300,width:1060}}>
   <div style={{marginBottom:34}}><Sender a={ease((f-F(.9))/10)} size={30}/></div>
   {BRIEF.map((b,k)=>{const next=BRIEF[k+1];const dim=next?1-.42*ease((f-F(next.at))/12):1;
    return <div key={k} style={{opacity:dim,marginBottom:22}}><Speak text={b.text} at={b.at} f={f} size={66} gap={2}/></div>;})}
  </div>
 </AbsoluteFill>;
};

/* A machine writes the code: a prompt becomes files. Local clock, 1.7 s. */
const Prompt=()=>{
 const f=useCurrentFrame();const t=f/30;
 const q='A booking app for my dental clinic';
 const typed=q.slice(0,Math.floor(clamp((t-.08)/.5)*q.length));
 const files=['app/page.tsx','calendar.tsx','booking.ts','payments.ts','reminders.ts'];
 return <AbsoluteFill style={{background:T.bg,fontFamily:SANS,color:T.fg}}>
  <div style={{position:'absolute',left:235,top:96,width:1000,transform:'scale(1.45)',transformOrigin:'0 0'}}>
   <div style={{fontSize:32,color:T.fg45,marginBottom:22}}>What do you want to build?</div>
   <Card style={{padding:'26px 32px',fontSize:40,letterSpacing:-.8,minHeight:52}}>{typed}<span style={{display:'inline-block',width:3,height:44,marginLeft:4,verticalAlign:'-8px',background:T.fg70,opacity:Math.floor(f/8)%2?0:1}}/></Card>
   <div style={{marginTop:24}}>{files.map((n,k)=>{const a=ease((t-.66-k*.1)/.12);
    return <div key={n} style={{display:'flex',alignItems:'center',gap:18,height:54,fontSize:28,color:T.fg70,opacity:a,borderTop:`1px solid ${T.hair}`}}><FileIcon size={24}/>{n}<div style={{flex:1}}/><Check size={26}/></div>;})}
   </div>
  </div>
 </AbsoluteFill>;
};

/* The turn: the laptop in the dark is already working. Push in until its screen is the frame,
   then the full-frame engine takes over on the same picture. Screen rect measured on t1. */
const SCREEN={x:704,y:372,w:566,h:350};
const Turn=()=>{
 const f=useCurrentFrame();const t=f/30;
 const Z=1920/SCREEN.w,cxS=SCREEN.x+SCREEN.w/2,cyS=SCREEN.y+SCREEN.h/2;
 const END=2.95;const p=clamp((t-1.75)/(END-1.75));
 const s=t<1.75?1+.07*easeIO(t/1.75)*1:1.07+(Z-1.07)*p*p*p;
 const k=clamp(t/END);const cx=960+(cxS-960)*k,cy=540+(cyS-540)*k;
 const ui=SCREEN.w/1920;
 return <AbsoluteFill style={{background:'#000',overflow:'hidden'}}>
  <div style={{position:'absolute',left:0,top:0,width:1920,height:1080,transformOrigin:'0 0',transform:`translate(${960-cx*s}px,${540-cy*s}px) scale(${s})`}}>
   <OffthreadVideo src={staticFile('jarvis/clips/t1.mp4')} muted style={{width:1920,height:1080}}/>
   <div style={{position:'absolute',left:SCREEN.x,top:SCREEN.y,width:SCREEN.w,height:SCREEN.h,background:T.bg,overflow:'hidden',borderRadius:3}}>
    <div style={{position:'absolute',left:0,top:(SCREEN.h-1080*ui)/2,width:1920,height:1080,transform:`scale(${ui})`,transformOrigin:'0 0'}}>
     <EngineUI t={(F(clip('t1').at)+f)/30-ENGINE_START}/>
    </div>
   </div>
  </div>
  <AbsoluteFill style={{background:'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)',opacity:1-p}}/>
 </AbsoluteFill>;
};

/** Darkens the bottom of the frame while a line sits there on footage. */
const Floor=({from,to}:{from:number;to:number})=>{const f=useCurrentFrame();if(f<F(from)||f>=F(to))return null;
 return <AbsoluteFill style={{background:'linear-gradient(0deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.28) 30%, rgba(0,0,0,0) 52%)',pointerEvents:'none'}}/>;};

const Engine=()=>{const f=useCurrentFrame();return <EngineUI t={f/30}/>;};

/* Close: two lines, then the mark. */
const Close=()=>{
 const f=useCurrentFrame();const t=f/30;
 const logo=ease((t-3.3)/.8);const url=ease((t-4.1)/.6);
 return <AbsoluteFill style={{background:T.bg}}>
  <div style={{position:'absolute',left:0,right:0,top:330,display:'flex',justifyContent:'center',opacity:logo,transform:`scale(${.97+.03*logo})`}}>
   <Img src={staticFile('brand/lockup.png')} style={{width:720,height:'auto'}}/>
  </div>
  <div style={{position:'absolute',left:0,right:0,top:690,textAlign:'center',fontFamily:SANS,fontSize:42,letterSpacing:-.4,color:T.fg45,opacity:url}}>ekoslabs.com</div>
 </AbsoluteFill>;
};

const music=(f:number)=>{const t=f/30;
 if(t<1)return .3*t;if(t<8.6)return .3;if(t<9.4)return .3+.7*easeIO((t-8.6)/.8);
 if(t<59)return 1;return Math.max(0,1-easeIO((t-59)/3));};

export const Jarvis=()=>{
 const {width}=useVideoConfig();const f=useCurrentFrame();const [handle]=useState(()=>delayRender('Load fonts'));
 useEffect(()=>{Promise.all([
  new FontFace('Inter',`url(${staticFile('fonts/inter.woff2')})`,{weight:'100 900'}).load(),
  new FontFace('InstrumentSerif',`url(${staticFile('fonts/instrument-serif-italic.woff2')})`,{style:'italic',weight:'400'}).load(),
  new FontFace('InstrumentSerif',`url(${staticFile('fonts/instrument-serif-regular.woff2')})`,{style:'normal',weight:'400'}).load(),
 ]).then(fonts=>{fonts.forEach(x=>document.fonts.add(x));
  if(!document.fonts.check('400 60px Inter')||!document.fonts.check('italic 400 60px InstrumentSerif'))throw new Error('Fonts did not load');
  continueRender(handle);}).catch(e=>{throw e;});},[handle]);
 const opening=1-ease(f/18);
 return <AbsoluteFill style={{background:'#000'}}>
  <Audio src={staticFile('jarvis/music.wav')} volume={music}/>
  <Sequence from={F(1.1)} durationInFrames={F(1.2)}><Audio src={staticFile('jarvis/sfx/buzz.wav')} volume={.9}/></Sequence>
  {BRIEF.map(b=><Sequence key={b.at} from={F(b.at)} durationInFrames={6}><Audio src={staticFile('jarvis/sfx/tick.wav')} volume={.45}/></Sequence>)}
  {TASKS.map(k=><Sequence key={k.at} from={F(ENGINE_START+k.at)} durationInFrames={6}><Audio src={staticFile('jarvis/sfx/tick.wav')} volume={.45}/></Sequence>)}
  <Sequence from={F(ENGINE_START+8.0+2.4)} durationInFrames={4}><Audio src={staticFile('jarvis/sfx/click.wav')} volume={.7}/></Sequence>
  <div style={{position:'absolute',width:1920,height:1080,transform:`scale(${width/1920})`,transformOrigin:'top left',overflow:'hidden',fontFamily:SANS,color:T.fg}}>
   {/* Picture */}
   <Sequence from={F(14.3)} durationInFrames={F(1.7)}><Prompt/></Sequence>
   <Sequence from={F(26.0)} durationInFrames={F(2.2)}><AbsoluteFill style={{background:T.bg}}/></Sequence>
   <Sequence {...at('t1')}><Turn/></Sequence>
   <Sequence from={F(ENGINE_START)} durationInFrames={F(52.0-ENGINE_START)}><Engine/></Sequence>
   <Sequence from={F(55.0)} durationInFrames={F(7.0)}><Close/></Sequence>
   {FOOTAGE.map(id=><Sequence key={id} {...at(id)} name={id}><Shot id={id} dim={DIM[id]||0} push={id.startsWith('r')?.03:.05}/></Sequence>)}
   {/* Words */}
   <Floor from={9.2} to={22.8}/><Floor from={52.0} to={55.0}/>
   <Briefing/>
   <Line parts={[{t:'Today, anyone can '},{t:'build.',i:true}]} from={9.35} to={12.45} y={830}/>
   <Line parts={[{t:'A machine writes the '},{t:'code.',i:true}]} from={12.75} to={15.85} y={830}/>
   <Line parts={[{t:'Designs the '},{t:'product.',i:true}]} from={16.15} to={19.25} y={830}/>
   <Line parts={[{t:'Ships it '},{t:'overnight.',i:true}]} from={19.55} to={22.65} y={830}/>
   <Line parts={[{t:'Building got '},{t:'easy.',i:true}]} from={26.0} to={28.1} y={470} size={104}/>
   <Line parts={[{t:'Selling '},{t:"didn't.",i:true}]} from={28.25} to={30.4} y={470} size={104}/>
   <Line parts={[{t:'Jarvis, '},{t:'for marketing.',i:true}]} from={30.5} to={32.75} y={150} size={112}/>
   <Line parts={[{t:'Built around your business.'}]} from={52.2} to={54.9} y={720} size={84}/>
   <Line parts={[{t:'Yours to keep.',i:true}]} from={53.3} to={54.9} y={826} size={84}/>
   <Line parts={[{t:'You build.'}]} from={55.1} to={58.0} y={400} size={112}/>
   <Line parts={[{t:'Ekos does '},{t:'the rest.',i:true}]} from={56.4} to={58.0} y={540} size={112}/>
   <Grain opacity={.2}/>
   <AbsoluteFill style={{background:'#000',opacity:opening,pointerEvents:'none'}}/>
  </div>
 </AbsoluteFill>;
};
