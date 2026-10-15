import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SANS,clamp,CAPTION_TOP} from './ui';
import timeline from './timeline.json';

/* Burned-in captions for the reel. White Inter, no plate, no box, one phrase at a time.
   Legibility comes from a soft shadow only. Every scene keeps y >= 1560 clear for this band. */

const CUES=timeline.captions;
const FADE=4/30;

export const Captions=()=>{
 const t=useCurrentFrame()/timeline.fps;
 const cue=CUES.find(c=>t>=c.start&&t<=c.end);
 if(!cue)return null;
 const a=clamp((t-cue.start)/FADE)*clamp((cue.end-t)/FADE);
 return <div style={{position:'absolute',left:0,right:0,top:CAPTION_TOP,display:'flex',justifyContent:'center',pointerEvents:'none',opacity:a}}>
  <div style={{maxWidth:880,textAlign:'center',fontFamily:SANS,fontSize:48,fontWeight:500,lineHeight:1.24,letterSpacing:-1,color:'#ffffff',
   textShadow:'0 2px 16px rgba(0,0,0,.85), 0 0 4px rgba(0,0,0,.7)'}}>{cue.text}</div>
 </div>;
};
