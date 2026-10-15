import React from 'react';
import {useCurrentFrame} from 'remotion';
import {T,Stage,Title,Label,Body,Micro,Serif,Card,Logo,Mark,TargetIcon,HLine,VLine,ease,clamp,rise,SAFE} from '../ui';
import {ENGINE,CORE} from '../copy';

/* 9.20 -> 15.20. Three real inputs collected on one accent bus, then handed to the report.
   The bus, the hairlines and the tiles are the website's connector language, not particles. */

const Layers=({size=34,color=T.accent})=><svg viewBox="0 0 24 24" style={{width:size,height:size,fill:'none',stroke:color,strokeWidth:1.7,strokeLinecap:'round',strokeLinejoin:'round'}}>
 <path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>;

const BUS=116,CARD_X=172,CARD_W=828,TOPS=[474,694,914],CARD_H=200,CORE_Y=1188,CORE_H=236;
const AT=[12,36,60];

const Tile=({k}:{k:string})=>
 <span style={{width:78,height:78,borderRadius:20,background:T.raised2,boxShadow:`inset 0 0 0 1px ${T.ring}`,display:'grid',placeItems:'center',flexShrink:0}}>
  {k==='jev'?<TargetIcon size={36}/>:k==='ai'?<Logo id="claude" size={36}/>:<Layers/>}
 </span>;

export const Engine=()=>{
 const f=useCurrentFrame();
 const busEnd=CORE_Y+20,travel=clamp((f-124)/34);
 return <Stage>
  <div style={{position:'absolute',left:SAFE.x,top:250,...rise(f,0,14,24)}}>
   <Label>Inside Finder</Label>
   <div style={{marginTop:22}}><Title size={82}>Three inputs.<br/><Serif>One judgment layer.</Serif></Title></div>
  </div>

  {/* the bus, and the joins into each input */}
  <VLine x={BUS} y={TOPS[0]+CARD_H/2} h={busEnd-(TOPS[0]+CARD_H/2)} f={f} at={16} dur={70} opacity={.45}/>
  {TOPS.map((t,i)=><HLine key={t} x={BUS} y={t+CARD_H/2} w={CARD_X-BUS} f={f} at={AT[i]} dur={10} opacity={.75}/>)}

  {/* the plus signs the caption says out loud */}
  {[0,1].map(i=>{const y=(TOPS[i]+CARD_H+TOPS[i+1])/2;const a=ease((f-(AT[i]+14))/10);
   return <div key={i} style={{position:'absolute',left:BUS-19,top:y-19,width:38,height:38,borderRadius:38,background:T.bg,
    boxShadow:`inset 0 0 0 1.5px ${T.accentBorder}`,display:'grid',placeItems:'center',color:T.accentText,fontSize:26,opacity:a}}>+</div>;})}

  {ENGINE.map((e,i)=><div key={e.key} style={{position:'absolute',left:CARD_X,top:TOPS[i],width:CARD_W,...rise(f,AT[i],14,18)}}>
   <Card style={{height:CARD_H,padding:'0 30px',display:'flex',alignItems:'center',gap:26}} accent={i===0}>
    <Tile k={e.key}/>
    <div style={{minWidth:0}}>
     <div style={{display:'flex',alignItems:'baseline',gap:16}}>
      <span style={{fontSize:46,letterSpacing:-1.4}}>{e.name}</span>
      {i===0&&<span style={{fontSize:21,color:T.accentText,letterSpacing:2,textTransform:'uppercase',fontWeight:500}}>judgment model</span>}
     </div>
     <div style={{marginTop:8}}><Body size={26} color={T.fg45}>{e.detail}</Body></div>
     <div style={{display:'flex',gap:10,marginTop:16}}>{e.chips.map((c,j)=>
      <span key={c} style={rise(f,AT[i]+8+j*3,10,8)}><span style={{display:'inline-flex',padding:'7px 14px',borderRadius:8,fontSize:21,fontWeight:500,
       background:i===0?T.accentSoft:'rgba(255,255,255,0.06)',color:i===0?T.accentText:T.fg70,whiteSpace:'nowrap'}}>{c}</span></span>)}</div>
    </div>
   </Card>
  </div>)}

  {/* the signal travelling down the bus into the report */}
  {f>=124&&<div style={{position:'absolute',left:BUS-4.5,top:(TOPS[0]+CARD_H/2)+travel*(busEnd-(TOPS[0]+CARD_H/2)),width:10,height:10,borderRadius:10,
   background:T.accent,opacity:.9*(1-clamp((f-164)/10)),boxShadow:'0 0 18px rgba(54,99,255,.9)'}}/>}

  {/* what the three become */}
  <div style={{position:'absolute',left:CARD_X,top:CORE_Y,width:CARD_W,...rise(f,114,16,20)}}>
   <Card accent style={{height:CORE_H,padding:'0 34px',display:'flex',alignItems:'center',gap:26,
    boxShadow:`inset 0 0 0 1.5px ${T.accentBorder}, 0 0 0 10px rgba(54,99,255,0.045)`}}>
    <Mark size={78}/>
    <div>
     <Label color={T.accentText}>{CORE.label}</Label>
     <div style={{marginTop:12}}><Title size={54}>{CORE.title}</Title></div>
     <div style={{marginTop:12}}><Body size={27} color={T.fg70}>{CORE.line}</Body></div>
    </div>
   </Card>
  </div>
  <div style={{position:'absolute',left:CARD_X,top:CORE_Y+CORE_H+26,...rise(f,140,14,10)}}>
   <Micro>Confidence labels and cited sources travel with every claim.</Micro>
  </div>
 </Stage>;
};
