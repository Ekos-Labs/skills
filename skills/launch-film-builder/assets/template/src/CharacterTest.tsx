import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {Char,MOODS,type Pose} from './Char';
import {FPS} from './timing';
import {BRAND,Grid,MONO,useFonts} from './kit';

/* A turntable for the character: every pose in turn, one per second, labelled. Render stills at
   0.5, 1.5, 2.5 ... to check a restyle or a new pose without rendering the film. */
const POSES=Object.keys(MOODS) as Pose[];
export const CHARACTER_TEST_SECONDS=POSES.length;
export const CharacterTest=()=>{
 useFonts();
 const t=useCurrentFrame()/FPS;
 const keys=POSES.map((p,i)=>[p,i] as [Pose,number]);
 const now=POSES[Math.min(POSES.length-1,Math.floor(t))];
 return <AbsoluteFill style={{background:BRAND.paper}}>
  <Grid/>
  <Char keys={keys} x={40} y={60} size={1000} t={t}/>
  <div style={{position:'absolute',left:48,top:34,fontFamily:MONO,fontSize:26,color:BRAND.grey}}>pose: {now}</div>
 </AbsoluteFill>;
};
