import React from 'react';
import {Sequence,useCurrentFrame} from 'remotion';
import {T,Stage,Title,Label,Body,Micro,Serif,Card,Tag,Check,ease,rise,SAFE} from '../ui';
import {PLAN,CLOSE} from '../copy';
import {HeroBand} from './Hook';

/* 28.40 -> 37.00. The five sections collapse into one month of work, then the film states the
   promise. Nothing new is claimed here: the weeks are the report's own first moves. */

const SECTIONS=['Market','Buyers','ICP','People','Channels'];
const CLOSE_AT=171;

export const Payoff=()=>{
 const f=useCurrentFrame();
 const out=ease((f-CLOSE_AT)/18); // the plan hands over to the close
 const collapse=ease((f-26)/20);
 return <Stage>
  <div style={{...(out>0?{opacity:1-out,transform:`translateY(${-70*out}px)`}:{})}}>
   {/* the report sections, pulled together */}
   <div style={{position:'absolute',left:SAFE.x,top:300,width:SAFE.w,display:'flex',justifyContent:'center',gap:12}}>
    {SECTIONS.map((s,i)=>{const off=(i-2)*8*collapse;
     return <span key={s} style={{display:'inline-flex',alignItems:'center',gap:10,padding:'11px 18px',borderRadius:10,
      background:'rgba(255,255,255,0.05)',boxShadow:`inset 0 0 0 1px ${T.hair}`,fontSize:23,color:T.fg45,
      transform:`translateX(${-off*10}px)`,...rise(f,i*3,12,10)}}>
      <Check size={20} color={collapse>.5?T.accentText:T.fg30}/>{s}</span>;})}
   </div>

   <div style={{position:'absolute',left:SAFE.x,top:430,width:SAFE.w,...rise(f,6,16,26)}}>
    <Label>{PLAN.label}</Label>
    <div style={{marginTop:20}}><Title size={80}>{PLAN.title}</Title></div>
   </div>

   {PLAN.weeks.map(([week,move],i)=>
    <Card key={week} accent={i===0} style={{position:'absolute',left:SAFE.x,top:660+i*168,width:SAFE.w,height:150,
     padding:'0 32px',display:'flex',alignItems:'center',gap:26,...rise(f,27+i*24,16,22)}}>
     <span style={{width:118,fontSize:22,letterSpacing:2.6,textTransform:'uppercase',fontWeight:500,color:i===0?T.accentText:T.fg30}}>{week}</span>
     <span style={{flex:1,fontSize:33,lineHeight:1.25,letterSpacing:-.7,color:T.fg}}>{move}</span>
     {i===0&&<Tag tone="accent">Start here</Tag>}
    </Card>)}

   <div style={{position:'absolute',left:SAFE.x,top:1200,width:SAFE.w,textAlign:'center',...rise(f,99,16,16)}}>
    <div style={{height:1.5,background:T.accent,opacity:.55,width:200,margin:'0 auto 30px',transform:`scaleX(${ease((f-99)/16)})`}}/>
    <Body size={36} color={T.fg} align="center">{PLAN.rule}</Body>
    <div style={{marginTop:22,...rise(f,123,14,10)}}><Micro>Instead of a hundred experiments you will never run.</Micro></div>
   </div>
  </div>

  {/* the close, back on the /find hero footage the reel opened on */}
  {f>=CLOSE_AT-6&&<Sequence from={CLOSE_AT-6} layout="none">
   <HeroBand from={132} push={ease((f-CLOSE_AT+6)/150)} dim={.52} opacity={ease((f-CLOSE_AT+6)/26)*.9}/>
  </Sequence>}
  {f>=CLOSE_AT&&<div style={{position:'absolute',left:SAFE.x,right:SAFE.x,top:760,textAlign:'center',...rise(f-CLOSE_AT,4,20,34)}}>
   <Title size={112} align="center">{CLOSE.line1}<br/><Serif>{CLOSE.line2}</Serif></Title>
   <div style={{height:1.5,background:T.accent,opacity:.6,width:260,margin:'54px auto 0',transform:`scaleX(${ease((f-CLOSE_AT-18)/18)})`}}/>
  </div>}
 </Stage>;
};
