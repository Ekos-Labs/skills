import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useVideoConfig} from 'remotion';
import {T,SANS,W,HGT} from './ui';
import {Captions} from './Captions';
import {Hook} from './scenes/Hook';
import {Input} from './scenes/Input';
import {Engine} from './scenes/Engine';
import {Report} from './scenes/Report';
import {Payoff} from './scenes/Payoff';
import {CTA} from './scenes/CTA';
import timeline from './timeline.json';

/* Finder launch reel. 1080x1920, 40s, 30fps.
   Six acts, cut on the boundaries in timeline.json, which the sound design reads too.
   Scenes are authored at 1080x1920 and scaled to the composition width, so the same file
   renders a 4K vertical master without re-laying anything out. */

const VIEWS=[<Hook/>,<Input/>,<Engine/>,<Report/>,<Payoff/>,<CTA/>];
const MIX='audio/finder/reel.wav';

export const FinderReel=()=>{
 const {width}=useVideoConfig();
 const [handle]=useState(()=>delayRender('Load fonts'));
 useEffect(()=>{Promise.all([
  new FontFace('Inter',`url(${staticFile('fonts/inter.woff2')})`,{weight:'100 900'}).load(),
  new FontFace('InstrumentSerif',`url(${staticFile('fonts/instrument-serif-italic.woff2')})`,{style:'italic',weight:'400'}).load(),
  new FontFace('InstrumentSerif',`url(${staticFile('fonts/instrument-serif-regular.woff2')})`,{style:'normal',weight:'400'}).load(),
 ]).then(fonts=>{fonts.forEach(x=>document.fonts.add(x));continueRender(handle);}).catch(e=>{throw e;});},[handle]);

 return <AbsoluteFill style={{background:T.bg}}>
  <Audio src={staticFile(MIX)}/>
  <div style={{position:'absolute',width:W,height:HGT,transform:`scale(${width/W})`,transformOrigin:'top left',
   fontFamily:SANS,color:T.fg,overflow:'hidden'}}>
   {timeline.scenes.map((s,i)=><Sequence key={s.name} name={s.name} from={s.from} durationInFrames={s.to-s.from}>{VIEWS[i]}</Sequence>)}
   <Captions/>
  </div>
 </AbsoluteFill>;
};
