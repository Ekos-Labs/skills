import React from 'react';
import {OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {T,Stage,Title,Label,Body,Serif,Mark,ease,clamp,rise,W,SAFE} from '../ui';
import {SIGNALS} from '../copy';

/* 0.00 -> 4.00. Opens on the /find hero footage itself: the aerial crossing with buyers picked
   out in the brand blue (find/public/main.mp4, prepared by scripts/prepare-finder-media.mjs).
   Signal fragments pin onto the crowd, a scan pass collects them, the street falls away and
   Finder resolves. Same shot returns behind the closing line, so the reel is bookended by the
   page it sends people to. */

const rnd=(i:number,s:number)=>{const x=Math.sin(i*127.1+s*311.7)*43758.5453;return x-Math.floor(x);};
const FOCUS={x:W/2,y:980};
export const BAND_H=1180;

/** The hero shot as a band with its lower edge melted into the stage. Full bleed would mean a
    1.78x upscale of a narrow slice; this keeps it close to native resolution. */
export const HeroBand=({from,push=0,dim=0,opacity=1}:{from:number;push?:number;dim?:number;opacity?:number})=>
 <div style={{position:'absolute',left:0,top:0,width:W,height:BAND_H,overflow:'hidden',opacity}}>
  <OffthreadVideo src={staticFile('find/hero-band.mp4')} startFrom={from} muted
   style={{position:'absolute',left:0,top:0,width:W,height:BAND_H,objectFit:'cover',
    transform:`scale(${1.04+push*.09})`,transformOrigin:'52% 42%'}}/>
  <div style={{position:'absolute',inset:0,background:
   `linear-gradient(180deg, rgba(9,9,11,.42) 0%, rgba(9,9,11,.10) 34%, rgba(9,9,11,.62) 76%, ${T.bg} 100%)`}}/>
  <div style={{position:'absolute',inset:0,background:T.bg,opacity:dim}}/>
 </div>;

const Fragment=({i,f}:{i:number;f:number})=>{
 const x=60+rnd(i,1)*(W-350),y=230+rnd(i,2)*830;
 const inAt=1+i*.8,c=ease((f-36)/30); // collect
 const a=ease((f-inAt)/10)*(1-c)*(.55+rnd(i,4)*.45);
 const jx=Math.sin((f+i*9)/13)*3.5,jy=Math.cos((f+i*7)/17)*3;
 const cx=x+(FOCUS.x-x-90)*c,cy=y+(FOCUS.y-y)*c;
 return <div style={{position:'absolute',left:cx+jx,top:cy+jy,opacity:a,transform:`scale(${1-c*.22})`,
  background:'rgba(9,9,11,0.82)',borderRadius:12,boxShadow:`inset 0 0 0 1px ${T.ring}`,padding:'10px 16px',
  fontSize:23,color:T.fg70,whiteSpace:'nowrap'}}>{SIGNALS[i%SIGNALS.length]}</div>;
};

export const Hook=()=>{
 const f=useCurrentFrame();
 const scan=ease((f-40)/30),lock=f-58;
 return <Stage>
  <HeroBand from={24} push={ease(f/150)} dim={.08+.60*ease((f-46)/40)}/>

  {Array.from({length:28},(_,i)=><Fragment key={i} i={i} f={f}/>)}

  {/* one scan pass down the crowd, the product reading the noise */}
  {f>=38&&f<=76&&<div style={{position:'absolute',left:0,right:0,top:140+scan*1040,height:2,background:T.accent,
   opacity:.6*(1-clamp((f-68)/8))}}/>}

  {/* Finder resolves */}
  {f>=56&&<div style={{position:'absolute',left:SAFE.x,right:SAFE.x,top:880,textAlign:'center',...rise(lock,0,18,34)}}>
   <div style={{display:'flex',justifyContent:'center',marginBottom:34,...rise(lock,0,16,18)}}><Mark size={96}/></div>
   <Title size={118} align="center">Finder</Title>
   <div style={{marginTop:26,display:'flex',justifyContent:'center',...rise(lock,10,14,14)}}><Label>by Ekos Labs</Label></div>
   <div style={{height:1.5,background:T.accent,opacity:.6,margin:'40px auto 0',width:220,transform:`scaleX(${ease((lock-14)/16)})`}}/>
   <div style={{marginTop:36,...rise(lock,20,14,14)}}><Body size={34} color={T.fg70} align="center">The GTM move you cannot see <Serif>from the inside.</Serif></Body></div>
  </div>}
 </Stage>;
};
