import React from 'react';
import {useCurrentFrame} from 'remotion';
import captions from '../captions.json';
import {SERIF,clamp} from './kit';

/* Burned-in captions for the whole film. White Instrument Serif (the caption face of the
   launch-film references in Drive/EKOS/Inspo-launch-videos), no plate, no box. Legibility over the
   footage comes from a soft shadow only. One phrase at a time, on the transcript's own
   phrase boundaries; every scene keeps y >= 900 clear for this band. */

type Cue={start:number;end:number;words:{start:number;end:number;word:string}[]};
const CUES=captions as Cue[];
const LEAD=.08,TAIL=.22,FADE=5/30;

export const Captions=()=>{
 const t=useCurrentFrame()/30;
 const cue=CUES.find(c=>t>=c.start-LEAD&&t<=c.end+TAIL);
 if(!cue)return null;
 const a=clamp((t-(cue.start-LEAD))/FADE)*clamp(((cue.end+TAIL)-t)/FADE);
 const text=cue.words.map(w=>w.word).join(' ');
 return <div style={{position:'absolute',left:0,right:0,top:938,display:'flex',justifyContent:'center',pointerEvents:'none',opacity:a}}>
  <div style={{maxWidth:1500,textAlign:'center',fontFamily:SERIF,fontStyle:'normal',fontSize:54,fontWeight:400,lineHeight:1.22,letterSpacing:0,color:'#ffffff',textShadow:'0 2px 14px rgba(0,0,0,.8), 0 0 3px rgba(0,0,0,.7)'}}>{text}</div>
 </div>;
};
