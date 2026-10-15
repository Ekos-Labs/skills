import React,{useContext,useEffect,useState} from 'react';
import {AbsoluteFill,continueRender,delayRender,spring} from 'remotion';
import '@fontsource-variable/inter';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import {FPS,LINES} from './timing';

/* Shared pieces for every scene: brand tokens, the wide/vertical layout switch, easing, the
   word-by-word headline, cards, and burned-in captions. Change BRAND first; most of the film
   follows it. */

export const BRAND={
 name:'ACME',          // shown top right and in the end card
 accent:'#3663ff',     // the one colour: serif accent words, wipes, buttons, highlights
 ink:'#0b0b0f',        // text
 grey:'#8a8a96',       // labels
 line:'#ececef',       // hairlines, grid
 paper:'#ffffff',      // background
};
export const SANS='"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif';
export const SERIF='"Instrument Serif", Georgia, serif';
export const MONO='Menlo, "SF Mono", ui-monospace, monospace';

/** Blocks the render until both fonts have loaded, so no frame ever shows a fallback font. */
export const useFonts=()=>{
 const [handle]=useState(()=>delayRender('Load fonts'));
 useEffect(()=>{
  Promise.all([document.fonts.load('600 60px "Inter Variable"'),document.fonts.load('italic 400 60px "Instrument Serif"')])
   .then(()=>{
    if(!document.fonts.check('600 60px "Inter Variable"')||!document.fonts.check('italic 400 60px "Instrument Serif"'))throw new Error('Fonts did not load');
    continueRender(handle);
   }).catch(e=>{throw e;});
 },[handle]);
};

/* One component renders both formats. Scenes read v (vertical) and pick their own numbers for
   each layout: a reel is re-laid out, never a crop of the wide film. */
export const VCtx=React.createContext(false);
export const useLay=()=>{const v=useContext(VCtx);return {v,W:v?1080:1920,H:v?1920:1080};};

export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export const out3=(v:number)=>1-(1-clamp(v))**3;
export const inOut=(v:number)=>{const t=clamp(v);return t<.5?4*t*t*t:1-(-2*t+2)**3/2;};
export const mix=(a:number,b:number,k:number)=>a+(b-a)*k;
/** A lively spring with a little overshoot, starting at second `at`. */
export const pop=(t:number,at:number,stiff=180,damp=12)=>spring({frame:Math.round((t-at)*FPS),fps:FPS,config:{stiffness:stiff,damping:damp,mass:.9}});

export const Grid=({color=BRAND.line,size=240}:{color?:string;size?:number})=><AbsoluteFill style={{backgroundImage:`linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,backgroundSize:`${size}px ${size}px`,backgroundPosition:'-1px -1px'}}/>;

export const Header=({chapter,t,dark=false}:{chapter:string;t:number;dark?:boolean})=>{
 const fr=Math.floor(t*30);const tc=`00:00:${String(Math.floor(fr/30)).padStart(2,'0')}:${String(fr%30).padStart(2,'0')}`;
 const c=dark?'rgba(255,255,255,.45)':BRAND.grey;
 return <><div style={{position:'absolute',left:48,top:34,fontFamily:MONO,fontSize:17,color:c,letterSpacing:.5}}>{chapter}</div>
  <div style={{position:'absolute',right:48,top:34,fontFamily:MONO,fontSize:17,color:c,letterSpacing:.5}}>{BRAND.name}&nbsp;&nbsp;&nbsp;{tc}</div></>;
};

export type WordItem={text:string;at:number;serif?:boolean;accent?:boolean;size?:number;underlineAt?:number};
/** Words that land one by one on their spoken time. underlineAt draws a hand-drawn line under
    that word, starting at that second. */
export const Words=({t,items,style}:{t:number;items:WordItem[];style?:React.CSSProperties})=>
 <div style={{display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:'0 .26em',...style}}>
  {items.map((it,k)=>{const a=out3((t-it.at+.04)/.16);const ul=it.underlineAt===undefined?0:clamp((t-it.underlineAt)/.32);
   return <span key={k} style={{position:'relative',display:'inline-block',opacity:a,transform:`translateY(${(1-a)*.35}em)`,color:it.accent?BRAND.accent:undefined,
    fontFamily:it.serif?SERIF:undefined,fontStyle:it.serif?'italic':undefined,fontWeight:it.serif?400:undefined,letterSpacing:it.serif?0:undefined,fontSize:it.size}}>
    {it.text}
    {ul>0&&<svg style={{position:'absolute',left:'-2%',bottom:'-.16em',width:'104%',height:'.3em',overflow:'visible'}} viewBox="0 0 420 60" preserveAspectRatio="none">
     <path d="M6 38 C 90 18, 200 14, 300 26 S 400 44, 414 30" fill="none" stroke={BRAND.accent} strokeWidth="7" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1" strokeDashoffset={1-ul}/></svg>}
   </span>;})}
 </div>;

export const Mono=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=><div style={{fontFamily:MONO,fontSize:17,color:BRAND.grey,letterSpacing:.3,...style}}>{children}</div>;
export const Card=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=><div style={{position:'absolute',background:'#fff',borderRadius:22,boxShadow:`0 0 0 1.5px ${BRAND.line}, 0 24px 60px -30px rgba(10,10,30,.25)`,overflow:'hidden',...style}}>{children}</div>;
export const Check=({size=34,a=1}:{size?:number;a?:number})=><div style={{width:size,height:size,borderRadius:size,background:BRAND.accent,display:'grid',placeItems:'center',transform:`scale(${a})`,flexShrink:0}}>
 <svg width={size*.56} height={size*.56} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>;

/** Circle wipe in the accent colour, grown from (x,y). */
export const Wipe=({t,at,x,y,color=BRAND.accent}:{t:number;at:number;x:number;y:number;color?:string})=>{
 const p=inOut((t-at)/.55);if(p<=0)return null;const r=2400*p;
 return <div style={{position:'absolute',left:x-r,top:y-r,width:r*2,height:r*2,borderRadius:'50%',background:color,boxShadow:`0 0 60px 30px ${color}`}}/>;
};

/* Burned-in captions for films whose on-screen text does not already say what the voice says
   (the manifesto format). Phrases of up to `most` words, broken at punctuation, timed to words. */
const CAPS=(()=>{const out:{s:number;e:number;text:string}[]=[];
 for(const l of LINES){let cur:typeof l.words=[];
  const flush=()=>{if(cur.length)out.push({s:cur[0].s-.06,e:cur[cur.length-1].e+.12,text:cur.map(x=>x.w).join(' ')});cur=[];};
  for(const x of l.words){cur.push(x);if(/[.?!,;:]$/.test(x.w)&&cur.length>=3||cur.length>=7)flush();}flush();}
 for(let i=0;i<out.length-1;i++)if(out[i].e>out[i+1].s)out[i].e=out[i+1].s;
 return out;})();
export const Captions=({t,bottom=78}:{t:number;bottom?:number})=>{
 const c=CAPS.find(x=>t>=x.s&&t<x.e);if(!c)return null;
 const a=clamp((t-c.s)/.08)*clamp((c.e-t)/.08);
 return <div style={{position:'absolute',left:80,right:80,bottom,display:'flex',justifyContent:'center',opacity:a}}>
  <span style={{fontFamily:SANS,fontSize:46,fontWeight:500,lineHeight:1.25,letterSpacing:-.6,color:'#fff',textAlign:'center',textShadow:'0 2px 14px rgba(0,0,0,.95), 0 0 4px rgba(0,0,0,.9)'}}>{c.text}</span>
 </div>;
};
