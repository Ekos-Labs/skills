import React from 'react';
import {useCurrentFrame} from 'remotion';
import {T,Stage,Title,Label,Micro,Card,Check,ArrowRight,SearchIcon,ease,clamp,rise,SAFE} from '../ui';
import {INPUT} from '../copy';
import timeline from '../timeline.json';

/* 4.00 -> 9.20. The whole input: one website field. Typed on the schedule in timeline.json so
   the keyboard sound design lands on the same frames. */

const {text:URL_TEXT,startFrame:TYPE_AT,stepFrames:STEP,submitFrame:SUBMIT}=timeline.typing;

const Pointer=({x,y,click}:{x:number;y:number;click:boolean})=>
 <div style={{position:'absolute',left:x,top:y,transform:`scale(${click?.88:1})`,transformOrigin:'top left',zIndex:20,filter:'drop-shadow(0 6px 12px rgba(0,0,0,.65))'}}>
  <svg width="52" height="65" viewBox="0 0 45 56"><path d="M3 3 L4 45 L15 33 L25 52 L34 47 L23 29 L41 29Z" fill="#fff" stroke="#09090b" strokeWidth="3"/></svg>
 </div>;

export const Input=()=>{
 const f=useCurrentFrame();
 const typed=URL_TEXT.slice(0,Math.max(0,Math.min(URL_TEXT.length,Math.floor((f-TYPE_AT)/STEP)+1)));
 const done=typed.length===URL_TEXT.length,sent=f>=SUBMIT;
 const caret=!sent&&f>=TYPE_AT&&(f%20<12||!done);
 const px=done?860-(860-800)*ease((f-84)/18):620,py=done?748+(760-748)*ease((f-84)/18):980;
 return <Stage>
  {[270,540,810].map(x=><div key={x} style={{position:'absolute',left:x,top:0,bottom:0,width:1,background:'rgba(255,255,255,0.035)'}}/>)}

  <div style={{position:'absolute',left:SAFE.x,top:300,...rise(f,0,14,24)}}>
   <Label>{INPUT.label}</Label>
   <div style={{marginTop:22}}><Title size={86}>{INPUT.title}</Title></div>
  </div>

  {/* the intake field, the site's pill with the accent button inside */}
  <div style={{position:'absolute',left:SAFE.x,top:700,width:SAFE.w,height:128,borderRadius:999,background:T.raised,
   boxShadow:`inset 0 0 0 1.5px ${f>=TYPE_AT&&!sent?T.accentBorder:T.ring}${sent?'':''}`,display:'flex',alignItems:'center',padding:10,...rise(f,2,16,22)}}>
   <span style={{display:'flex',alignItems:'center',gap:18,paddingLeft:30,flex:1,minWidth:0}}>
    <SearchIcon size={34}/>
    <span style={{fontSize:42,letterSpacing:-.8,color:typed?T.fg:'rgba(240,240,245,0.30)',whiteSpace:'nowrap'}}>
     {typed||INPUT.placeholder}{caret&&<span style={{color:T.accent}}>|</span>}
    </span>
   </span>
   <span style={{display:'inline-flex',alignItems:'center',gap:14,height:108,padding:'0 34px',borderRadius:999,background:T.accent,color:'#fff',
    fontSize:29,fontWeight:500,whiteSpace:'nowrap',transform:`scale(${f>=SUBMIT&&f<SUBMIT+6?.965:1})`}}>
    {INPUT.cta}<ArrowRight size={28}/>
   </span>
  </div>

  {/* what it starts doing, in the product's own words */}
  {sent&&<div style={{position:'absolute',left:SAFE.x,top:900,width:SAFE.w}}>
   {INPUT.read.map((t,i)=>{const at=SUBMIT+4+i*10-SUBMIT;const lf=f-SUBMIT;const on=lf>=at+12;
    return <Card key={t} style={{display:'flex',alignItems:'center',gap:22,height:104,padding:'0 30px',marginTop:i?20:0,...rise(lf,at,12,16)}}>
     <span style={{width:46,height:46,borderRadius:12,background:T.accentSoft,display:'grid',placeItems:'center'}}>
      <span style={{width:12,height:12,borderRadius:12,background:T.accent,opacity:on?1:.45+.55*Math.abs(Math.sin(lf/6))}}/>
     </span>
     <span style={{fontSize:29,color:T.fg70}}>{t}</span>
     {on&&<span style={{marginLeft:'auto'}}><Check/></span>}
    </Card>;})}
  </div>}

  <div style={{position:'absolute',left:SAFE.x,top:1300,...rise(f,20,14,14)}}>
   <Micro color={T.fg30}>{INPUT.note}</Micro>
  </div>

  {f>=60&&f<SUBMIT+10&&<Pointer x={px} y={py} click={f>=SUBMIT&&f<SUBMIT+6}/>}
  {/* the field settles once the request is away */}
  <div style={{position:'absolute',left:SAFE.x,top:700,width:SAFE.w,height:128,borderRadius:999,
   boxShadow:`0 0 0 ${clamp((f-SUBMIT)/6)*10}px rgba(54,99,255,${.12*(1-clamp((f-SUBMIT)/14))})`,pointerEvents:'none'}}/>
 </Stage>;
};
