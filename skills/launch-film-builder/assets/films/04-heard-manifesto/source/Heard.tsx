import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Img,Loop,OffthreadVideo,Sequence,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import {T,SANS,SERIF,ease,clamp,Card,FileIcon,Check,LOGOS} from '../v3/kit';
import {EngineUI} from '../jarvis/Engine';
import tl from './timeline.json';

/* "It's time to be heard." The a16z "It's time to build" method, turned to distribution:
   one narrator cut against real archival sound bites, archival and modern footage cut at
   under a second a shot, a 4:3 film frame with grain and gate weave, a burst of channel
   logos on the music's downbeat, and a mark built out of the words the engine produces.
   Everything is laid out by scripts/prepare-heard.py into timeline.json. */

type Shot={at:number;dur:number;screen?:number[];file?:string;s?:string;ui?:string;state?:number;black?:boolean;logo?:boolean;push?:number;fadein?:number;crop?:string;in?:number;anchor?:number};
type Ev={at:number;dur:number;file:string;kind:string;text:string;who:string};
const FPS=30,W=1440,H=1080;
const F=(s:number)=>Math.round(s*FPS);
export const HEARD_FRAMES=tl.frames;

/* Deterministic per-frame noise for gate weave and exposure flicker. */
const rnd=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};

const ShotView=({s}:{s:Shot})=>{
 const f=useCurrentFrame();const n=F(s.dur);const p=clamp(f/n);
 const archival=(s as {look?:string}).look==='archival';
 const push=s.push??(s.dur>1.2?.04:.02);
 const wx=archival?(rnd(f+s.at*97)-.5)*2.2:0,wy=archival?(rnd(f*1.7+s.at*31)-.5)*1.6:0;
 const flick=archival?1+(rnd(f*3.1+s.at)-.5)*.07:1;
 const fade=s.fadein?ease(f/F(s.fadein)):1;
 if(s.black)return <AbsoluteFill style={{background:'#000'}}/>;
 if(s.logo)return <WordMark/>;
 let body:React.ReactNode=null;
 if(s.ui==='prompt')body=<Prompt/>;
 else if(s.ui==='engine')body=<div style={{position:'absolute',inset:0,background:T.bg}}><div style={{position:'absolute',left:0,top:(H-1080*.75)/2,width:1920,height:1080,transform:'scale(.75)',transformOrigin:'0 0'}}><EngineUI t={(s.state??0)+f/FPS}/></div></div>;
 else if(s.file)body=<><OffthreadVideo src={staticFile(s.file)} muted style={{width:W,height:H}}/>
  {s.screen&&<div style={{position:'absolute',left:s.screen[0],top:s.screen[1],width:s.screen[2],height:s.screen[3],background:T.bg,overflow:'hidden',borderRadius:3}}>
   <div style={{position:'absolute',left:0,top:(s.screen[3]-1080*s.screen[2]/1920)/2,width:1920,height:1080,transform:`scale(${s.screen[2]/1920})`,transformOrigin:'0 0'}}><EngineUI t={f/FPS-1.2}/></div></div>}</>;
 return <AbsoluteFill style={{background:'#000',overflow:'hidden'}}>
  <AbsoluteFill style={{opacity:fade,filter:flick!==1?`brightness(${flick})`:undefined,transform:`translate(${wx}px,${wy}px) scale(${1.02+push*Math.sin(p*Math.PI/2)})`}}>{body}</AbsoluteFill>
 </AbsoluteFill>;
};

/* A machine writes the code. 4:3 version of the v1 prompt shot. */
const Prompt=()=>{
 const f=useCurrentFrame();const t=f/FPS;
 const q='A booking app for my dental clinic';
 const typed=q.slice(0,Math.floor(clamp((t-.05)/.45)*q.length));
 const files=['app/page.tsx','calendar.tsx','booking.ts','payments.ts','reminders.ts'];
 return <AbsoluteFill style={{background:T.bg,fontFamily:SANS,color:T.fg}}>
  <div style={{position:'absolute',left:45,top:200,width:1000,transform:'scale(1.35)',transformOrigin:'0 0'}}>
   <div style={{fontSize:34,color:T.fg45,marginBottom:22}}>What do you want to build?</div>
   <Card style={{padding:'26px 32px',fontSize:42,letterSpacing:-.8,minHeight:54}}>{typed}<span style={{display:'inline-block',width:3,height:46,marginLeft:4,verticalAlign:'-8px',background:T.fg70,opacity:Math.floor(f/8)%2?0:1}}/></Card>
   <div style={{marginTop:24}}>{files.map((n,k)=>{const a=ease((t-.55-k*.09)/.1);
    return <div key={n} style={{display:'flex',alignItems:'center',gap:18,height:58,fontSize:30,color:T.fg70,opacity:a,borderTop:`1px solid ${T.hair}`}}><FileIcon size={26}/>{n}<div style={{flex:1}}/><Check size={28}/></div>;})}
   </div>
  </div>
 </AbsoluteFill>;
};

/* Channel burst on the downbeat, the a16z portfolio burst turned into the places Ekos works. */
const NAMES:{[k:string]:string}={linkedin:'LinkedIn',x:'X',reddit:'Reddit',email:'Gmail',youtube:'YouTube',instagram:'Instagram',google:'Google',chatgpt:'ChatGPT',producthunt:'Product Hunt',slack:'Slack',hubspot:'HubSpot',notion:'Notion'};
const Burst=()=>{
 const f=useCurrentFrame();const L=tl.logos;const k=Math.floor(f/F(L.each));
 const id=L.items[k] as keyof typeof LOGOS;if(!id)return null;
 return <AbsoluteFill style={{background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center',gap:36}}>
  <div style={{width:132,height:132,borderRadius:30,background:'#111114',boxShadow:'inset 0 0 0 2px rgba(255,255,255,.14)',display:'grid',placeItems:'center'}}><Img src={staticFile('logos/'+LOGOS[id])} style={{width:84,height:84,objectFit:'contain'}}/></div>
  <div style={{fontFamily:SANS,fontSize:118,fontWeight:600,letterSpacing:-4,color:'#fff',textShadow:'0 4px 30px rgba(0,0,0,.5)'}}>{NAMES[id]}</div>
 </AbsoluteFill>;
};

/* The mark, first built from the words of being heard, then clean. */
const WORDS='found sent replied booked posted seen heard opened answered shared clicked signed introduced followed trusted chosen'.split(' ');
const TEXTURE=Array.from({length:900},(_,i)=>WORDS[(i*7+Math.floor(i/13))%WORDS.length]).join('  ');
const WordMark=()=>{
 const f=useCurrentFrame();const t=f/FPS;
 const tex=ease((t-.35)/1.6)*(1-ease((t-3.0)/.9));const clean=ease((t-2.9)/1.0);
 const url=ease((t-4.3)/.7);
 const sweep=-40+160*clamp((t-.6)/2.6);
 const box={position:'absolute' as const,left:(W-1060)/2,top:250,width:1060,height:1060*726/1726};
 const mask={WebkitMaskImage:`url(${staticFile('brand/lockup.png')})`,WebkitMaskSize:'100% 100%',WebkitMaskRepeat:'no-repeat',maskImage:`url(${staticFile('brand/lockup.png')})`,maskSize:'100% 100%',maskRepeat:'no-repeat'} as React.CSSProperties;
 return <AbsoluteFill style={{background:'#030304'}}>
  <div style={{...box,...mask,opacity:tex,overflow:'hidden'}}>
   <div style={{position:'absolute',left:-20,top:-40-t*8,width:1100,fontFamily:SANS,fontSize:12.5,lineHeight:1.08,letterSpacing:.2,color:'rgba(240,240,245,.92)',wordBreak:'break-all'}}>{TEXTURE}</div>
   <div style={{position:'absolute',inset:0,background:`linear-gradient(100deg, rgba(54,99,255,0) ${sweep-18}%, rgba(127,155,255,.85) ${sweep}%, rgba(54,99,255,0) ${sweep+18}%)`,mixBlendMode:'screen'}}/>
  </div>
  <div style={{...box,opacity:clean,transform:`scale(${.985+.015*clean})`}}><Img src={staticFile('brand/lockup.png')} style={{width:'100%',height:'100%'}}/></div>
  <div style={{position:'absolute',left:0,right:0,top:780,textAlign:'center',fontFamily:SANS,fontSize:40,letterSpacing:-.4,color:T.fg45,opacity:url}}>ekoslabs.com</div>
 </AbsoluteFill>;
};

/* Burned-in captions for muted autoplay: short phrases timed to the spoken words (prepare-heard.py). */
type Cap={start:number;end:number;text:string;who:string};
const Captions=()=>{
 const f=useCurrentFrame();const t=f/FPS;
 const c=(tl.captions as Cap[]).find(x=>t>=x.start&&t<x.end);
 if(!c)return null;
 const a=clamp((t-c.start)/.08)*clamp((c.end-t)/.08);
 return <><div style={{position:'absolute',left:0,right:0,bottom:0,height:300,opacity:a*.85,background:'linear-gradient(0deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.3) 45%, rgba(0,0,0,0) 100%)'}}/>
 <div style={{position:'absolute',left:80,right:80,bottom:78,display:'flex',justifyContent:'center',opacity:a}}>
  <span style={{fontFamily:SANS,fontSize:46,fontWeight:500,lineHeight:1.25,letterSpacing:-.6,color:'#fff',textAlign:'center',
   textShadow:'0 2px 14px rgba(0,0,0,.95), 0 0 4px rgba(0,0,0,.9)'}}>{c.text}</span>
 </div></>;
};

export const Heard=({captions=false}:{captions?:boolean})=>{
 const [handle]=useState(()=>delayRender('Load fonts'));
 useEffect(()=>{Promise.all([
  new FontFace('Inter',`url(${staticFile('fonts/inter.woff2')})`,{weight:'100 900'}).load(),
  new FontFace('InstrumentSerif',`url(${staticFile('fonts/instrument-serif-italic.woff2')})`,{style:'italic',weight:'400'}).load(),
 ]).then(fonts=>{fonts.forEach(x=>document.fonts.add(x));
  if(!document.fonts.check('400 60px Inter')||!document.fonts.check('italic 400 60px InstrumentSerif'))throw new Error('Fonts did not load');
  continueRender(handle);}).catch(e=>{throw e;});},[handle]);
 const vol=tl.music.volume;
 const L=tl.logos;
 return <AbsoluteFill style={{background:'#000',overflow:'hidden'}}>
  <Audio src={staticFile(tl.music.file)} startFrom={F(tl.music.offset)} volume={f=>vol[Math.min(vol.length-1,f)]}/>
  {(tl.events as Ev[]).map((e,i)=><Sequence key={i} from={F(e.at)} durationInFrames={F(e.dur)+3} name={`${e.kind} ${e.text.slice(0,24)}`}>
   <Audio src={staticFile(e.file)} volume={e.kind==='sfx'?.55:e.kind==='bite'?1:.95}/></Sequence>)}
  {(tl.shots as Shot[]).map((s,i)=><Sequence key={i} from={F(s.at)} durationInFrames={Math.max(1,F(s.at+s.dur)-F(s.at))} name={s.s||s.ui||(s.logo?'mark':'black')}><ShotView s={s}/></Sequence>)}
  <Sequence from={F(L.start)} durationInFrames={F(L.each*L.items.length)} name="channel burst"><Burst/></Sequence>
  <AbsoluteFill style={{background:'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.62) 100%)',pointerEvents:'none'}}/>
  <AbsoluteFill style={{mixBlendMode:'overlay',opacity:.3,pointerEvents:'none'}}>
   <Loop durationInFrames={60}><OffthreadVideo src={staticFile('jarvis/grain.mp4')} muted style={{width:W,height:H,objectFit:'cover'}}/></Loop>
  </AbsoluteFill>
  {captions&&<Captions/>}
 </AbsoluteFill>;
};
