import React from 'react';
import {AbsoluteFill,Img,OffthreadVideo,staticFile,useCurrentFrame} from 'remotion';
import {SANS,SERIF,T,ease,clamp,rise,FolderIcon,Chevron} from './kit';

/* Scenes that stay on the founder. Type sits beside him, never over his face, and never
   below y=900 where the captions run. Frame numbers come from the word timings in
   captions.json. */

export const Footage=({at=0}:{at?:number})=><AbsoluteFill><OffthreadVideo src={staticFile('camera/eshaan.mp4')} muted startFrom={Math.round(at*30)} style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>;

const word=(size:number,serif=false):React.CSSProperties=>({fontFamily:serif?SERIF:SANS,fontStyle:serif?'italic':'normal',fontSize:size,fontWeight:400,letterSpacing:serif?0:size*-.03,lineHeight:1,color:T.fg,textShadow:'0 2px 24px rgba(0,0,0,.55)',whiteSpace:'nowrap'});

/* 0.000 -> 16.000. "…built on trust, attention, distribution, and the right system."
   Four pillars land on their words, two either side of him, and clear before the
   "pair that with AI" line. */
const PILLARS:[string,number,'l'|'r',number,boolean][]=[ // word, frame, side, row, serif
 ['Trust',101,'l',0,false],['Attention',117,'l',1,false],['Distribution',134,'r',0,false],['System',168,'r',1,true]];
/* 11.500 "Ekos Labs": the mark turns in and the name lands beside him. 12.860 onward,
   "custom GTM engines and software products": the engine's branches start stacking under
   it, one per word, so something is already being built before the 16.000 cut. */
const BUILD:[string,number][]=[['Context',386],['LinkedIn Outreach',397],['Email Outreach',406],['SEO',415],['Content',424],['UGC',433],['AI Agents',442]];
export const Opening=()=>{
 const f=useCurrentFrame(),out=1-ease((f-214)/12),brand=ease((f-345)/14),leave=1-ease((f-470)/10);
 return <>
  <Footage/>
  <div style={{position:'absolute',inset:0,opacity:out}}>
   {PILLARS.map(([w,at,side,row,serif])=><div key={w} style={{position:'absolute',top:410+row*150,...(side==='l'?{right:1300}:{left:1290}),...rise(f,at,12,28),...word(serif?128:104,serif)}}>{w}</div>)}
  </div>
  {f>=345&&<div style={{position:'absolute',left:1260,top:330,width:560,opacity:leave}}>
   <div style={{display:'flex',alignItems:'center',gap:24}}>
    <Img src={staticFile('brand/mark.png')} style={{width:124,height:110,objectFit:'contain',opacity:brand,transform:`scale(${.35+.65*brand}) rotate(${-140+140*brand+(f-345)*.35}deg)`,filter:'drop-shadow(0 8px 30px rgba(54,99,255,.5))'}}/>
    <div style={{...word(66),fontWeight:500,textShadow:'0 2px 10px rgba(0,0,0,.9), 0 6px 30px rgba(0,0,0,.7)',opacity:ease((f-352)/12),transform:`translateX(${(1-ease((f-352)/12))*-18}px)`}}>Ekos Labs</div>
   </div>
   <div style={{marginTop:30,paddingLeft:8}}>{BUILD.map(([n,at])=><div key={n} style={{display:'flex',alignItems:'center',gap:12,height:50,...rise(f,at,10,12)}}><Chevron color={T.fg45}/><FolderIcon size={24}/><span style={{fontFamily:SANS,fontSize:26,color:T.fg,textShadow:'0 2px 14px rgba(0,0,0,.8)'}}>{n}</span></div>)}</div>
  </div>}
 </>;
};

/* 38.120 -> 48.420. "Before Ekos, I've helped companies grow millions of organic views, get
   insane return on ad spend, grow their apps to thousands of downloads, and build systems
   that constantly bring in qualified leads." The site's three numbers, with its attribution
   line, plus the fourth claim as words. Values are the founder's prior work, not Ekos Labs. */
const PROOF:[string,string,number,'l'|'r',number,boolean][]=[ // value, label, frame, side, row, serif
 ['20M+','Organic views',53,'l',0,false],['4x','Return on ad spend',122,'r',0,false],
 ['5000+','App downloads for a client',202,'l',1,false],['Systems','that bring in qualified leads',286,'r',1,true]];
export const Proof=()=>{
 const f=useCurrentFrame(),out=1-ease((f-298)/10);
 return <>
  <Footage at={38.12}/>
  <div style={{position:'absolute',inset:0,opacity:out}}>
   {PROOF.map(([v,l,at,side,row,serif])=><div key={v} style={{position:'absolute',top:250+row*300,...(side==='l'?{right:1300,textAlign:'right'}:{left:1290}),...rise(f,at,14,30)}}>
    <div style={{...word(serif?132:150,serif),fontWeight:serif?400:600,fontVariantNumeric:'tabular-nums'}}>{v}</div>
    <div style={{fontFamily:SANS,fontSize:28,color:T.fg70,marginTop:18,textShadow:'0 2px 14px rgba(0,0,0,.7)',whiteSpace:'nowrap'}}>{l}</div>
   </div>)}
   <div style={{position:'absolute',left:110,top:836,fontFamily:SANS,fontSize:20,color:T.fg45,textShadow:'0 2px 12px rgba(0,0,0,.8)',opacity:clamp((f-60)/12)}}>From the founder's prior work</div>
  </div>
 </>;
};
