import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {Mascot,MascotLights,type Arm,type Gesture,type V3} from './Mascot3D';
import {FPS,MOUTH} from './timing';
import {clamp,inOut,mix,useLay} from './kit';

/* The character as a scene element: a transparent square canvas at (x,y,size) holding the
   bust, framed with the head near the top. Poses are expressions: where he turns and looks, how
   much he smiles, brows, a wink, and what his hands do. Give Char a list of [pose, fromSecond]
   keys and he eases from one to the next. His mouth follows the voice (timeline mouth curve),
   he blinks every few seconds and sways a little, so he is never a still. */

export type Pose='front'|'wink'|'psst'|'peek'|'skeptical'|'point'|'thumbs';
/* L is his right hand (on the screen's left), R his left. Arm space: x right, y up, z toward the
   camera, head centre near y .35; the visible square runs about x -2.3..2.3, y -2.6..2.1. */
type Mood={yaw:number;look:number;lookY?:number;smile:number;brow?:number;wink?:number;pitch?:number;roll?:number;L?:Arm;R?:Arm};
export const MOODS:Record<Pose,Mood>={
 front:{yaw:0,look:0,smile:.5},
 wink:{yaw:-.08,look:0,smile:.85},                                    // wink is a quick beat on arrival
 psst:{yaw:-.38,look:-1,smile:.7,wink:1,pitch:.1,roll:.12,             // whisper: hand by the mouth, held wink
  R:{g:'open',elbow:[1.4,-2.35,.7],wrist:[.74,-1.12,1.12],dir:[-.3,1,0],palm:[-1,0,.3]}},
 peek:{yaw:.4,look:.9,lookY:.6,smile:.55,pitch:-.12},                   // looks up and to the right
 skeptical:{yaw:-.28,look:-.7,smile:0,brow:1,roll:-.07,                // one brow up, fist under the chin
  L:{g:'fist',elbow:[-1.0,-2.6,.8],wrist:[-.3,-1.5,1.0],dir:[.15,1,0],palm:[0,0,1]}},
 point:{yaw:-.36,look:-1,smile:1,                                       // points up and to the left
  L:{g:'point',elbow:[-1.3,-2.45,.6],wrist:[-1.35,-1.25,1.0],dir:[-1,.75,.15],palm:[0,-.2,1]}},
 thumbs:{yaw:.06,look:0,smile:1,pitch:-.05,                             // thumbs up beside the face, nod
  R:{g:'thumb',elbow:[1.75,-2.3,.4],wrist:[1.25,-1.15,1.0],dir:[0,1,0],palm:[0,0,1]}},
};
const mix3=(a:V3,b:V3,k:number):V3=>[mix(a[0],b[0],k),mix(a[1],b[1],k),mix(a[2],b[2],k)];
/* An arm with nowhere to be hangs below the frame; raising or dropping it is a blend to or from there. */
const DOWN=(side:number,g:Gesture):Arm=>({g,elbow:[side*1.5,-3.8,.3],wrist:[side*1.3,-3.5,.6],dir:[0,1,0],palm:[0,0,1]});
const armMix=(a:Arm|undefined,b:Arm|undefined,k:number,side:number):Arm|undefined=>{
 if(!a&&!b)return undefined;if(!b&&k>=1)return undefined;
 const A=a??DOWN(side,b!.g),B=b??DOWN(side,a!.g);
 return {g:k<.5?A.g:B.g,elbow:mix3(A.elbow,B.elbow,k),wrist:mix3(A.wrist,B.wrist,k),dir:mix3(A.dir,B.dir,k),palm:mix3(A.palm,B.palm,k)};
};
const KEYS=['yaw','look','lookY','smile','brow','wink','pitch','roll'] as const;

/** ox/oy: screen position of the parent box when Char sits inside a positioned card or clip, so
    the dither grid stays locked to the frame. size must be a whole number of pixels. */
export const Char=({keys,x,y,size,t,ox=0,oy=0}:{keys:[Pose,number][];x:number;y:number;size:number;t:number;ox?:number;oy?:number})=>{
 const {H}=useLay();
 let i=0;for(let k=0;k<keys.length;k++)if(t>=keys[k][1])i=k;
 const [pose,since]=keys[i],prev=MOODS[keys[Math.max(0,i-1)][0]],cur=MOODS[pose];
 const k=i===0?1:inOut((t-since)/.35),ka=i===0?1:inOut((t-since)/.5);
 const m=(f:typeof KEYS[number])=>mix(prev[f]??0,cur[f]??0,k);
 const beat=(pose==='wink'||pose==='thumbs')?Math.sin(Math.PI*clamp((t-since-.15)/.45)):0;
 const ph=(t+.7)%3.3,blink=ph<.14?1-Math.abs(ph-.07)/.07:0;
 const talk=MOUTH[Math.min(MOUTH.length-1,Math.max(0,Math.round(t*FPS)))]??0;
 const arms={L:armMix(i===0?undefined:prev.L,cur.L,ka,-1),R:armMix(i===0?undefined:prev.R,cur.R,ka,1)};
 const px=Math.round(size);
 return <div style={{position:'absolute',left:x,top:y,width:px,height:px}}>
  <ThreeCanvas width={px} height={px} gl={{antialias:false,alpha:true,premultipliedAlpha:false}} onCreated={({gl})=>gl.setClearColor(0x000000,0)} camera={{fov:30,position:[0,0,10]}}>
   <MascotLights/>
   <Mascot screen={[ox+x,H-(oy+y+px)]} arms={arms}
    pose={{x:0,y:.27+.015*Math.sin(t*2.2),scale:1.13,yaw:m('yaw')+.07*Math.sin(t*1.1),pitch:m('pitch')+.03*Math.sin(t*1.7)-.12*beat*(pose==='thumbs'?1:0),roll:m('roll')+.025*Math.sin(t*.9)}}
    face={{talk,blink,wink:Math.max(m('wink'),beat),brow:m('brow')+.5*beat*(pose==='wink'?1:0),smile:m('smile'),lookX:m('look'),lookY:m('lookY')}}/>
  </ThreeCanvas>
 </div>;
};
