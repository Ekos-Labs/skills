import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Sequence,continueRender,delayRender,staticFile,useVideoConfig} from 'remotion';
import {Opening,Proof,Footage} from './Founder';
import {Intro} from './Intro';
import {EngineTree,EngineTeam,EngineConfigs} from './Engine';
import {Outbound} from './Outbound';
import {UGC} from './UGC';
import {NoCopy,Ads,Review,Scale,Products,End} from './Rest';
import {Captions} from './Captions';
import {SANS,T} from './kit';

/* V3. Website palette and type, captions throughout, founder footage carries the pillars
   and the proof. Cut points are phrase boundaries from captions.json. */
const scenes=[
 {name:'Founder / pillars on trust, attention, distribution, system',from:0,to:16,view:<Opening/>},
 {name:'Engine / ICP, signals, outbound, content, measure',from:16,to:23.34,view:<Intro/>},
 {name:'How we build it / context, then channels',from:23.34,to:30.38,view:<EngineTree/>},
 {name:'Around your company / team, engine, agents',from:30.38,to:35.28,view:<EngineTeam/>},
 {name:'Different company, different engine',from:35.28,to:38.12,view:<EngineConfigs/>},
 {name:'Founder / prior work',from:38.12,to:48.42,view:<Proof/>},
 {name:'Not a playbook',from:48.42,to:51.9,view:<NoCopy/>},
 {name:'Outbound / lead, draft, sequence, review',from:51.9,to:58.42,view:<Outbound/>},
 {name:'Founder bridge',from:58.42,to:60.44,view:<Footage at={58.42}/>},
 {name:'UGC, theme pages, outbound system, inbound',from:60.44,to:67.44,view:<UGC/>},
 {name:'Meta and ChatGPT',from:67.44,to:69.48,view:<Ads/>},
 {name:'AI drafts, human decides',from:69.48,to:72.7,view:<Review/>},
 {name:'Expand the engine',from:72.7,to:78.86,view:<Scale/>},
 {name:'Pocket CMO and Remy',from:78.86,to:84.08,view:<Products/>},
 {name:'Ekos close',from:84.08,to:89,view:<End/>},
];
export const FilmV3=()=>{
 const {width}=useVideoConfig();const [handle]=useState(()=>delayRender('Load fonts'));
 useEffect(()=>{Promise.all([
  new FontFace('Inter',`url(${staticFile('fonts/inter.woff2')})`,{weight:'100 900'}).load(),
  new FontFace('InstrumentSerif',`url(${staticFile('fonts/instrument-serif-italic.woff2')})`,{style:'italic',weight:'400'}).load(),
  new FontFace('InstrumentSerif',`url(${staticFile('fonts/instrument-serif-regular.woff2')})`,{style:'normal',weight:'400'}).load(),
 ]).then(fonts=>{fonts.forEach(x=>document.fonts.add(x));continueRender(handle);}).catch(e=>{throw e;});},[handle]);
 return <AbsoluteFill style={{background:T.bg}}><Audio src={staticFile('audio/v2/mix.wav')}/>
  <div style={{position:'absolute',width:1920,height:1080,transform:`scale(${width/1920})`,transformOrigin:'top left',fontFamily:SANS,color:T.fg,overflow:'hidden'}}>
   {scenes.map(s=>{const from=Math.round(s.from*30);return <Sequence key={s.name} name={s.name} from={from} durationInFrames={Math.round(s.to*30)-from}>{s.view}</Sequence>})}
   <Captions/>
  </div></AbsoluteFill>;
};
