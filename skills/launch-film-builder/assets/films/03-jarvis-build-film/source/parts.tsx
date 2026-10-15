import React from 'react';
import {AbsoluteFill,Img,Loop,OffthreadVideo,staticFile,useCurrentFrame} from 'remotion';
import {T,SANS,SERIF,ease,clamp} from '../v3/kit';
import edl from './edl.json';

/* Shared pieces for the Jarvis film. Times are film seconds unless a prop says otherwise. */

export const F=(s:number)=>Math.round(s*30);
export const clip=(id:string)=>{const c=edl.clips.find(x=>x.id===id);if(!c)throw new Error('No clip '+id);return c;};

/** One graded shot (graded at extraction) with a slow push-in and a vignette. Use inside a Sequence. */
export const Shot=({id,push=.05,dim=0,origin='50% 50%'}:{id:string;push?:number;dim?:number;origin?:string})=>{
 const f=useCurrentFrame();const n=F(clip(id).dur);
 const s=1+push*Math.sin(clamp(f/n)*Math.PI/2);
 return <AbsoluteFill style={{overflow:'hidden',background:'#000'}}>
  <AbsoluteFill style={{transform:`scale(${s})`,transformOrigin:origin}}>
   <OffthreadVideo src={staticFile(`jarvis/clips/${id}.mp4`)} muted style={{width:1920,height:1080}}/>
  </AbsoluteFill>
  <AbsoluteFill style={{background:'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.6) 100%)'}}/>
  {dim>0&&<AbsoluteFill style={{background:`rgba(0,0,0,${dim})`}}/>}
 </AbsoluteFill>;
};

type Part={t:string;i?:boolean};
/** The site headline at film scale: Inter 400, tight tracking, italic Instrument Serif accent.
    Rises in, fades out. Renders on the film clock, so place it outside Sequences. */
export const Line=({parts,from,to,y,size=96}:{parts:Part[];from:number;to:number;y:number;size?:number})=>{
 const f=useCurrentFrame();if(f<F(from)-1||f>F(to)+1)return null;
 const a=ease((f-F(from))/16)*clamp((F(to)-f)/10);
 const dy=(1-ease((f-F(from))/20))*22;
 return <div style={{position:'absolute',left:0,right:0,top:y,display:'flex',justifyContent:'center',opacity:a,transform:`translateY(${dy}px)`}}>
  <div style={{fontFamily:SANS,fontWeight:400,fontSize:size,letterSpacing:size*-.03,lineHeight:1.1,color:T.fg,textShadow:'0 2px 26px rgba(0,0,0,.65)',whiteSpace:'nowrap'}}>
   {parts.map((p,k)=><span key={k} style={p.i?{fontFamily:SERIF,fontStyle:'italic',letterSpacing:0,fontSize:size*1.08}:undefined}>{p.t}</span>)}
  </div></div>;
};

/** Ekos speaking: words land one after another, like a sentence being said. `at` is on the caller's clock. */
export const Speak=({text,at,f,size=46,gap=2,style={}}:{text:string;at:number;f:number;size?:number;gap?:number;style?:React.CSSProperties})=>
 <div style={{fontFamily:SANS,fontSize:size,lineHeight:1.24,letterSpacing:size*-.02,color:T.fg,fontWeight:400,...style}}>
  {text.split(' ').map((w,k)=>{const a=ease((f-F(at)-k*gap)/7);return <span key={k} style={{display:'inline-block',opacity:a,transform:`translateY(${(1-a)*10}px)`,marginRight:size*.26}}>{w}</span>;})}
 </div>;

/** Sender row: the Ekos mark and name, as the voice of every message. */
export const Sender=({a=1,size=24}:{a?:number;size?:number})=>
 <div style={{display:'flex',alignItems:'center',gap:14,opacity:a}}>
  <Img src={staticFile('brand/mark.png')} style={{width:size*1.45,height:size*1.3,objectFit:'contain'}}/>
  <span style={{fontFamily:SANS,fontSize:size,letterSpacing:size*.14,textTransform:'uppercase',color:T.fg45,fontWeight:500}}>Ekos</span>
 </div>;

/** Film grain over everything, blended so mid grey is invisible. */
export const Grain=({opacity=.22}:{opacity?:number})=>
 <AbsoluteFill style={{mixBlendMode:'overlay',opacity,pointerEvents:'none'}}>
  <Loop durationInFrames={60}><OffthreadVideo src={staticFile('jarvis/grain.mp4')} muted style={{width:1920,height:1080}}/></Loop>
 </AbsoluteFill>;
