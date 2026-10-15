import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Mascot,MascotLights} from './Mascot3D';
import tl from './timeline.json';

/* 4.5 s look test: the coded agent saying the "Ekos deploys AI agents" line. */
const START=8.3;
export const MascotTest=()=>{
 const f=useCurrentFrame();const t=f/60;const ft=START+t;
 const talk=(tl.mouth as number[])[Math.round(ft*60)]||0;
 const blink=[1.1,3.3].reduce((b,at)=>Math.max(b,1-Math.min(1,Math.abs(t-at)/.07)),0);
 return <AbsoluteFill style={{background:'#fff'}}>
  <AbsoluteFill style={{backgroundImage:'linear-gradient(#ececef 1px,transparent 1px),linear-gradient(90deg,#ececef 1px,transparent 1px)',backgroundSize:'240px 240px'}}/>
  <Audio src={staticFile('find-promo/vo/v4.wav')} startFrom={0}/>
  <ThreeCanvas width={1920} height={1080} gl={{antialias:false,alpha:true,premultipliedAlpha:false}} onCreated={({gl})=>gl.setClearColor(0x000000,0)} camera={{fov:30,position:[0,0,10]}} style={{position:'absolute',left:0,top:0}}>
   <MascotLights/>
   <Mascot pose={{x:0,y:-.55,scale:1.25,yaw:.16*Math.sin(t*1.1),pitch:.05*Math.sin(t*1.7),roll:.04*Math.sin(t*.9)}}
    face={{talk:t<.05?0:talk,blink,wink:t>3.8&&t<4.2?1:0,brow:0,smile:.5,lookX:0,lookY:0}}/>
  </ThreeCanvas>
 </AbsoluteFill>;
};
