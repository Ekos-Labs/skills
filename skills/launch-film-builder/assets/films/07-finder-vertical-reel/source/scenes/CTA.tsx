import React from 'react';
import {useCurrentFrame} from 'remotion';
import {T,Stage,Title,Label,Micro,Card,Mark,ArrowRight,rise,SAFE} from '../ui';
import {PRODUCT} from '../copy';

/* 37.00 -> 40.00. The end card. Product, who made it, price, and where to get it. */

export const CTA=()=>{
 const f=useCurrentFrame();
 return <Stage>
  <div style={{position:'absolute',left:SAFE.x,right:SAFE.x,top:660,textAlign:'center'}}>
   <div style={{display:'flex',justifyContent:'center',...rise(f,0,16,20)}}><Mark size={104}/></div>
   <div style={{marginTop:38,...rise(f,4,16,22)}}><Title size={126} align="center">{PRODUCT.name}</Title></div>
   <div style={{marginTop:24,display:'flex',justifyContent:'center',...rise(f,10,14,14)}}><Label>{PRODUCT.by}</Label></div>

   <div style={{marginTop:56,display:'flex',justifyContent:'center',...rise(f,16,16,18)}}>
    <Card accent style={{display:'inline-flex',alignItems:'center',gap:18,padding:'22px 38px',
     boxShadow:`inset 0 0 0 1.5px ${T.accentBorder}, 0 0 0 10px rgba(54,99,255,0.05)`}}>
     <span style={{fontSize:40,letterSpacing:-.8,color:T.fg}}>{PRODUCT.price}</span>
     <span style={{width:1,height:34,background:T.ring}}/>
     <span style={{fontSize:34,color:T.accentText}}>{PRODUCT.url}</span>
     <ArrowRight size={30} color={T.accentText}/>
    </Card>
   </div>

   <div style={{marginTop:40,...rise(f,26,14,12)}}><Micro color={T.fg30}>No sales call. The report is yours to keep.</Micro></div>
  </div>
 </Stage>;
};
