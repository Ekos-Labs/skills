import React,{useContext,useEffect,useState} from 'react';
import {AbsoluteFill,Audio,Img,Sequence,continueRender,delayRender,spring,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import tl from './timeline.json';
import {Mascot,MascotLights,type Arm,type Gesture,type V3} from './Mascot3D';

/* Ekos Find promo. Same moves as the Pocketsflow spot (dithered mascot that peeks in,
   word-by-word headline with a serif accent, blue circle wipe, cards on blue, zoom-out,
   phone-style console, whip into a live card grid, "Handled." stamp, black line,
   logo with the mascot peeking over it), told for Ekos: we deploy AI agents that get you
   customers; put your website into ekoslabs.com/find. Every beat keys off a spoken word
   in timeline.json (scripts/prepare-find-promo.py). 60 fps, in two layouts: 1920x1080, and
   1080x1920 for reels (vertical prop), where every scene is re-laid, not cropped. */

const FPS=60;
const BLUE='#3663ff',INK='#0b0b0f',GREY='#8a8a96',LINE='#ececef';
const SANS='Inter, ui-sans-serif, system-ui, sans-serif';
const SERIF='InstrumentSerif, Georgia, serif';
const MONO='Menlo, "SF Mono", ui-monospace, monospace';
const F=(s:number)=>Math.round(s*FPS);
export const FIND_PROMO_FRAMES=F(tl.duration);

const VCtx=React.createContext(false);
const useLay=()=>{const v=useContext(VCtx);return {v,W:v?1080:1920,H:v?1920:1080};};

type Word={w:string;s:number;e:number};type Line={id:string;at:number;dur:number;file:string;text:string;words:Word[]};
const LINES=tl.lines as Line[];
const L=(id:string)=>LINES.find(l=>l.id===id)!;
const w=(id:string,i:number)=>L(id).words[i];

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const out3=(v:number)=>1-(1-clamp(v))**3;
const inOut=(v:number)=>{const t=clamp(v);return t<.5?4*t*t*t:1-(-2*t+2)**3/2;};
/** A lively spring, the reference pops with a little overshoot. */
const pop=(t:number,at:number,stiff=180,damp=12)=>spring({frame:Math.round((t-at)*FPS),fps:FPS,config:{stiffness:stiff,damping:damp,mass:.9}});

/* ---------- shared pieces ---------- */
const Grid=({color=LINE}:{color?:string})=><AbsoluteFill style={{backgroundImage:`linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,backgroundSize:'240px 240px',backgroundPosition:'-1px -1px'}}/>;

const Header=({chapter,t,dark=false}:{chapter:string;t:number;dark?:boolean})=>{
 const fr=Math.floor(t*30);const tc=`00:00:${String(Math.floor(fr/30)).padStart(2,'0')}:${String(fr%30).padStart(2,'0')}`;
 const c=dark?'rgba(255,255,255,.45)':GREY;
 return <><div style={{position:'absolute',left:48,top:34,fontFamily:MONO,fontSize:17,color:c,letterSpacing:.5}}>{chapter}</div>
  <div style={{position:'absolute',right:48,top:34,fontFamily:MONO,fontSize:17,color:c,letterSpacing:.5}}>EKOS LABS&nbsp;&nbsp;&nbsp;{tc}</div></>;
};

type Pose='front'|'wink'|'psst'|'peek'|'skeptical'|'point'|'thumbs';
/* Each pose is an expression on the coded mascot: where he turns and looks, how much he smiles,
   brows, whether he winks, and what his hands do (L is his right hand, on the screen's left).
   Winks on 'wink' and 'thumbs' are a quick beat, 'psst' holds it. */
type Mood={yaw:number;look:number;lookY?:number;smile:number;brow?:number;wink?:number;pitch?:number;roll?:number;L?:Arm;R?:Arm};
const MOODS:Record<Pose,Mood>={
 front:{yaw:0,look:0,smile:.5},
 wink:{yaw:-.08,look:0,smile:.85},
 psst:{yaw:-.38,look:-1,smile:.7,wink:1,pitch:.1,roll:.12,
  R:{g:'open',elbow:[1.4,-2.35,.7],wrist:[.74,-1.12,1.12],dir:[-.3,1,0],palm:[-1,0,.3]}},
 peek:{yaw:.4,look:.9,lookY:.6,smile:.55,pitch:-.12},
 skeptical:{yaw:-.28,look:-.7,smile:0,brow:1,roll:-.07,
  L:{g:'fist',elbow:[-1.0,-2.6,.8],wrist:[-.3,-1.5,1.0],dir:[.15,1,0],palm:[0,0,1]}},
 point:{yaw:-.36,look:-1,smile:1,
  L:{g:'point',elbow:[-1.3,-2.45,.6],wrist:[-1.35,-1.25,1.0],dir:[-1,.75,.15],palm:[0,-.2,1]}},
 thumbs:{yaw:.06,look:0,smile:1,pitch:-.05,
  R:{g:'thumb',elbow:[1.75,-2.3,.4],wrist:[1.25,-1.15,1.0],dir:[0,1,0],palm:[0,0,1]}},
};
const MOUTH=tl.mouth as number[];
const mix=(a:number,b:number,k:number)=>a+(b-a)*k;
const mix3=(a:V3,b:V3,k:number):V3=>[mix(a[0],b[0],k),mix(a[1],b[1],k),mix(a[2],b[2],k)];
/* An arm with nowhere to be hangs below the frame; raising or dropping it is a blend to or from there. */
const DOWN=(side:number,g:Gesture):Arm=>({g,elbow:[side*1.5,-3.8,.3],wrist:[side*1.3,-3.5,.6],dir:[0,1,0],palm:[0,0,1]});
const armMix=(a:Arm|undefined,b:Arm|undefined,k:number,side:number):Arm|undefined=>{
 if(!a&&!b)return undefined;if(!b&&k>=1)return undefined;
 const A=a??DOWN(side,b!.g),B=b??DOWN(side,a!.g);
 return {g:k<.5?A.g:B.g,elbow:mix3(A.elbow,B.elbow,k),wrist:mix3(A.wrist,B.wrist,k),dir:mix3(A.dir,B.dir,k),palm:mix3(A.palm,B.palm,k)};
};
const MOOD_KEYS=['yaw','look','lookY','smile','brow','wink','pitch','roll'] as const;
/** The mascot: a coded 3D bust in a transparent square canvas at (x,y,size). keys are
    [pose, from time]; he eases between them. ox/oy is the screen position of the parent box,
    so the dither grid stays locked to the frame. */
const Char=({keys,x,y,size,t,ox=0,oy=0}:{keys:[Pose,number][];x:number;y:number;size:number;t:number;ox?:number;oy?:number})=>{
 const {H}=useLay();
 let i=0;for(let k=0;k<keys.length;k++)if(t>=keys[k][1])i=k;
 const [pose,since]=keys[i],prev=MOODS[keys[Math.max(0,i-1)][0]],cur=MOODS[pose];
 const k=i===0?1:inOut((t-since)/.35),ka=i===0?1:inOut((t-since)/.5);
 const m=(f:typeof MOOD_KEYS[number])=>mix(prev[f]??0,cur[f]??0,k);
 const beat=(pose==='wink'||pose==='thumbs')?Math.sin(Math.PI*clamp((t-since-.15)/.45)):0;
 const ph=(t+.7)%3.3,blink=ph<.14?1-Math.abs(ph-.07)/.07:0;
 const talk=MOUTH[Math.min(MOUTH.length-1,Math.max(0,Math.round(t*FPS)))]??0;
 const arms={L:armMix(i===0?undefined:prev.L,cur.L,i===0?1:ka,-1),R:armMix(i===0?undefined:prev.R,cur.R,i===0?1:ka,1)};
 return <div style={{position:'absolute',left:x,top:y,width:size,height:size}}>
  <ThreeCanvas width={size} height={size} gl={{antialias:false,alpha:true,premultipliedAlpha:false}} onCreated={({gl})=>gl.setClearColor(0x000000,0)} camera={{fov:30,position:[0,0,10]}}>
   <MascotLights/>
   <Mascot screen={[ox+x,H-(oy+y+size)]} arms={arms}
    pose={{x:0,y:.27+.015*Math.sin(t*2.2),scale:1.13,yaw:m('yaw')+.07*Math.sin(t*1.1),pitch:m('pitch')+.03*Math.sin(t*1.7)-.12*beat*(pose==='thumbs'?1:0),roll:m('roll')+.025*Math.sin(t*.9)}}
    face={{talk,blink,wink:Math.max(m('wink'),beat),brow:m('brow')+.5*beat*(pose==='wink'?1:0),smile:m('smile'),lookX:m('look'),lookY:m('lookY')}}/>
  </ThreeCanvas>
 </div>;
};

/** Words that land one by one on their spoken time. */
const Words=({t,items,style}:{t:number;items:{text:string;at:number;serif?:boolean;blue?:boolean;size?:number}[];style?:React.CSSProperties})=>
 <div style={{display:'flex',flexWrap:'wrap',alignItems:'baseline',gap:'0 .26em',...style}}>
  {items.map((it,k)=>{const a=out3((t-it.at+.04)/.16);
   return <span key={k} style={{display:'inline-block',opacity:a,transform:`translateY(${(1-a)*.35}em)`,color:it.blue?BLUE:undefined,
    fontFamily:it.serif?SERIF:undefined,fontStyle:it.serif?'italic':undefined,fontWeight:it.serif?400:undefined,letterSpacing:it.serif?0:undefined,
    fontSize:it.size}}>{it.text}</span>;})}
 </div>;

const Mono=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=><div style={{fontFamily:MONO,fontSize:17,color:GREY,letterSpacing:.3,...style}}>{children}</div>;
const Card=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=><div style={{position:'absolute',background:'#fff',borderRadius:22,boxShadow:`0 0 0 1.5px ${LINE}, 0 24px 60px -30px rgba(10,10,30,.25)`,overflow:'hidden',...style}}>{children}</div>;
const Check=({size=34,a=1}:{size?:number;a?:number})=><div style={{width:size,height:size,borderRadius:size,background:BLUE,display:'grid',placeItems:'center',transform:`scale(${a})`}}>
 <svg width={size*.56} height={size*.56} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>;
const Logo=({id,size=26}:{id:string;size?:number})=><Img src={staticFile('logos/'+id)} style={{width:size,height:size,objectFit:'contain'}}/>;

/* ---------- A: hook ---------- */
const Hook=({t}:{t:number})=>{
 const {v}=useLay();
 const enter=pop(t,0.0,120,14);const x=v?1000-1000*enter:1780-780*enter,cy=v?800:40;
 const bub=clamp((t-.62)/.12)*(1-clamp((t-1.55)/.12));const typed='psst..'.slice(0,Math.floor(clamp((t-.66)/.35)*6));
 const sell=w('v2',3);const ul=clamp((t-sell.e+.02)/.32);
 return <AbsoluteFill style={{background:'#fff'}}>
  <Grid/>
  <Char keys={[['psst',0],['front',1.45],['wink',2.75]]} x={x} y={cy} size={1080} t={t}/>
  {bub>0&&<div style={{position:'absolute',left:x+120,top:cy+520,opacity:bub,transform:`scale(${.7+.3*bub})`,transformOrigin:'100% 100%',
   background:'#fff',border:`2px solid ${INK}`,borderRadius:26,padding:'10px 22px',fontFamily:MONO,fontSize:30,color:INK}}>{typed}&nbsp;</div>}
  <Mono style={{position:'absolute',left:v?60:72,top:v?248:196,fontSize:v?26:24,opacity:out3((t-1.35)/.2)}}>// for builders</Mono>
  <div style={{position:'absolute',left:v?56:64,top:v?292:236,fontFamily:SANS,fontWeight:600,fontSize:v?128:168,letterSpacing:v?-5:-7,color:INK,lineHeight:1}}>
   <Words t={t} items={[{text:'Got',at:w('v2',0).s},{text:'something',at:w('v2',1).s}]}/>
   <div style={{display:'flex',alignItems:'baseline',gap:'0 .22em',marginTop:v?28:40}}>
    <Words t={t} items={[{text:'to',at:w('v2',2).s},{text:'sell?',at:sell.s,serif:true,blue:true,size:v?166:210}]}/>
   </div>
  </div>
  <svg style={{position:'absolute',left:v?196:250,top:v?576:606}} width={v?332:420} height={v?47:60} viewBox="0 0 420 60"><path d="M6 38 C 90 18, 200 14, 300 26 S 400 44, 414 30" fill="none" stroke={BLUE} strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1-ul}/></svg>
 </AbsoluteFill>;
};

/* circle wipe to blue, grown out of "sell?" */
const Wipe=({t,at,x,y}:{t:number;at:number;x:number;y:number})=>{
 const p=inOut((t-at)/.55);if(p<=0)return null;const r=2400*p;
 return <div style={{position:'absolute',left:x-r,top:y-r,width:r*2,height:r*2,borderRadius:'50%',background:BLUE,boxShadow:`0 0 60px 30px ${BLUE}`}}/>;
};

/* ---------- B: who it's for ---------- */
const CARDS=[{icon:'phone',title:'Apps',sub:'ios · android · web',word:1},{icon:'laptop',title:'B2B startups',sub:'saas · tools · apis',word:3},{icon:'briefcase',title:'Services',sub:'agencies · studios · consultants',word:6}];
const Who=({t,local}:{t:number;local:number})=>{
 const {v}=useLay();
 const exit=inOut((t-8.18)/.42);
 return <AbsoluteFill style={{background:BLUE,transformOrigin:v?'68% 62%':'64% 62%',transform:`scale(${1-.62*exit}) translate(${(v?0:120)*exit}px,${40*exit}px)`,borderRadius:60*exit,overflow:'hidden',opacity:1-clamp((t-8.45)/.12)}}>
  <Grid color="rgba(255,255,255,.08)"/>
  <Char keys={[['front',0],['wink',t-local+2.2]]} x={v?-60:-120} y={v?880:120} size={v?1020:960} t={t}/>
  {CARDS.map((c,k)=>{const at=w('v3',c.word).s-.05;const a=pop(t,at);if(t<at)return null;
   return <Card key={c.title} style={{left:v?40+k*340:760+k*380,top:v?300:250,width:v?320:350,height:470,transform:`translateY(${(1-a)*80}px) rotate(${(1-a)*-8}deg) scale(${.6+.4*a})`,boxShadow:'0 30px 60px -20px rgba(0,0,40,.4)'}}>
    <Mono style={{position:'absolute',left:26,top:22}}>// 0{k+1}</Mono>
    <Img src={staticFile(`find-promo/icons/${c.icon}.png`)} style={{position:'absolute',left:v?30:35,top:v?44:40,width:v?260:280,height:v?260:280}}/>
    <div style={{position:'absolute',left:28,top:v?318:336,fontFamily:SANS,fontWeight:600,fontSize:v?36:40,letterSpacing:-1.4,color:INK}}>{c.title}</div>
    <Mono style={{position:'absolute',left:28,right:24,top:v?370:392,fontSize:v?16:18,lineHeight:1.4}}>{c.sub}</Mono>
   </Card>;})}
 </AbsoluteFill>;
};

/* ---------- C: what we do ---------- */
const AGENTS=[['Research agent','finding buyers'],['Outreach agent','writing emails'],['Content agent','posting daily'],['Follow-up agent','booking calls']];
const Agents=({t}:{t:number})=>{
 const {v}=useLay();
 const phone=pop(t,8.42,120,16);const charUp=out3((t-8.9)/.5);
 const whip=inOut((t-12.92)/.3);
 return <AbsoluteFill style={{background:'#fff',transform:`translateX(${-(v?1080:900)*whip}px)`,filter:whip>0?`blur(${whip*14}px)`:undefined}}>
  <Grid/>
  <div style={{position:'absolute',left:v?60:72,top:v?190:250,fontFamily:SANS,color:INK}}>
   <Words t={t} style={{fontSize:v?58:64,fontWeight:500,letterSpacing:-2}} items={[{text:'Ekos',at:w('v4',0).s},{text:'deploys',at:w('v4',1).s}]}/>
   <Words t={t} style={{fontSize:v?150:170,fontWeight:600,letterSpacing:v?-6:-7,lineHeight:1.05,marginTop:6}} items={[{text:'AI',at:w('v4',2).s},{text:'agents',at:w('v4',3).s,serif:true,blue:true,size:v?178:200}]}/>
   <Words t={t} style={{fontSize:v?58:66,fontWeight:500,letterSpacing:-2.2,marginTop:26}} items={[{text:'that',at:w('v4',4).s},{text:'do',at:w('v4',5).s},{text:'the',at:w('v4',6).s},{text:'work,',at:w('v4',7).s}]}/>
   <Words t={t} style={{fontSize:v?58:66,fontWeight:500,letterSpacing:-2.2,marginTop:6}} items={[{text:'and',at:w('v4',8).s},{text:'get',at:w('v4',9).s},{text:'you',at:w('v4',10).s},{text:'customers.',at:w('v4',11).s,serif:true,blue:true,size:v?70:80}]}/>
  </div>
  <div style={{position:'absolute',left:v?500:1230,top:(v?700:110)+(1-phone)*(v?1300:900),width:520,height:880,borderRadius:64,background:INK,padding:14,boxShadow:'0 40px 80px -30px rgba(0,0,30,.45)'}}>
   <div style={{width:'100%',height:'100%',borderRadius:52,background:'#fff',overflow:'hidden',position:'relative'}}>
    <div style={{height:250,background:BLUE,padding:'70px 36px 0',color:'#fff'}}>
     <Mono style={{color:'rgba(255,255,255,.7)'}}>// your agents</Mono>
     <div style={{fontFamily:SANS,fontWeight:600,fontSize:46,letterSpacing:-1.6,marginTop:14}}>4 running</div>
     <div style={{fontFamily:SANS,fontSize:22,opacity:.8,marginTop:6}}>built around your business</div>
    </div>
    {AGENTS.map(([name,task],k)=>{const at=w('v4',3).s+.12+k*.16;const a=pop(t,at,200,16);if(t<at)return null;const on=t>at+.35;const pulse=.6+.4*Math.abs(Math.sin((t-at)*4));
     return <div key={name} style={{margin:'22px 26px 0',padding:'20px 22px',borderRadius:20,boxShadow:`0 0 0 1.5px ${LINE}`,display:'flex',alignItems:'center',gap:18,transform:`translateY(${(1-a)*40}px) scale(${.9+.1*a})`,opacity:clamp(a)}}>
      <div style={{width:14,height:14,borderRadius:14,background:on?BLUE:LINE,opacity:on?pulse:1,flexShrink:0}}/>
      <div style={{flex:1}}><div style={{fontFamily:SANS,fontWeight:600,fontSize:26,letterSpacing:-.6,color:INK}}>{name}</div><Mono style={{fontSize:17,marginTop:4}}>{task}</Mono></div>
      <Mono style={{fontSize:15,color:on?BLUE:GREY}}>{on?'running':'starting'}</Mono>
     </div>;})}
   </div>
  </div>
  <Char keys={[['peek',0]]} x={v?-40:640} y={v?1920-620*charUp:1080-480*charUp} size={v?620:520} t={t}/>
 </AbsoluteFill>;
};

/* ---------- D: handled ---------- */
const SIGNALS=[['Hiring a first growth lead','buying window'],['Comparing tools','active research'],['Founder posting weekly','channel signal'],['Raised a seed round','budget unlocked']];
type Rect=[number,number,number,number];
const HANDLED:{h:Record<'A'|'M'|'B'|'C'|'D',Rect>;v:Record<'A'|'M'|'B'|'C'|'D',Rect>}={
 h:{A:[64,96,570,900],M:[664,96,600,430],C:[664,556,600,440],B:[1294,96,562,430],D:[1294,556,562,440]},
 v:{A:[40,170,490,1000],M:[550,170,490,440],B:[550,630,490,540],C:[40,1190,490,420],D:[550,1190,490,420]},
};
const at4=(r:Rect):React.CSSProperties=>({left:r[0],top:r[1],width:r[2],height:r[3]});
const Handled=({t}:{t:number})=>{
 const {v,W,H}=useLay();const R=HANDLED[v?'v':'h'];
 const tin=inOut((t-12.95)/.35);const stamp=w('v6',0).s;
 const A=w('v5',0).s,B=w('v5',2).s,C=w('v5',4).s,D=w('v5',7).s;
 const done=(at:number)=>pop(t,stamp+.08+at,260,14);
 const act=(at:number,next:number)=>t>=at&&t<next+.2?1:0;
 const ring=clamp((t-stamp)/.7);
 const badge=(k:number)=>t>stamp+.08+k*.06?<div style={{position:'absolute',right:30,top:22}}><Check a={done(k*.06)}/></div>:null;
 const count=Math.round(23*out3((t-A-.15)/1.6));
 const email='Hi Lena, saw you are hiring your first growth lead. Worth a quick chat this week?';
 const typed=email.slice(0,Math.floor(clamp((t-B-.1)/1.3)*email.length));const sent=t>B+1.55;
 const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
 const cardStyle=(k:number):React.CSSProperties=>{const a=pop(t,12.98+k*.05,200,18);return {transform:`translateY(${(1-a)*60}px) scale(${.94+.06*a})`,opacity:clamp(a*1.3)};};
 const hi=(on:number):React.CSSProperties=>on?{boxShadow:`0 0 0 2.5px ${BLUE}, 0 24px 60px -30px rgba(10,10,30,.25)`}:{};
 return <AbsoluteFill style={{background:'#fafafb',transform:`translateX(${(v?1080:900)*(1-tin)}px)`,filter:tin<1?`blur(${(1-tin)*14}px)`:undefined}}>
  <Grid/>
  {/* A: finding buyers */}
  <Card style={{...at4(R.A),...cardStyle(0),...hi(act(A,B))}}>
   <Mono style={{position:'absolute',left:30,top:26}}>// finding buyers</Mono>
   <div style={{position:'absolute',left:30,top:74,fontFamily:SANS,fontWeight:600,fontSize:120,letterSpacing:-5,color:INK,fontVariantNumeric:'tabular-nums'}}>{t<A?0:count}</div>
   <Mono style={{position:'absolute',left:34,top:210,fontSize:20}}>buyers found overnight</Mono>
   {SIGNALS.map(([s,tag],k)=>{const at=A+.2+k*.28;if(t<at)return null;const a=pop(t,at,220,18);
    return <div key={s} style={{position:'absolute',left:30,right:30,top:280+k*(v?140:112),height:v?112:92,borderRadius:18,boxShadow:`0 0 0 1.5px ${LINE}`,padding:v?'22px 20px':'16px 20px',transform:`translateX(${(1-a)*-40}px)`,opacity:clamp(a)}}>
     <div style={{fontFamily:SANS,fontWeight:600,fontSize:25,letterSpacing:-.6,color:INK}}>{s}</div>
     <Mono style={{fontSize:16,color:BLUE,marginTop:8}}>● {tag}</Mono></div>;})}
   <div style={{position:'absolute',left:30,bottom:30,display:'flex',gap:12}}>
    {[['linkedin.svg','LinkedIn'],['google.svg','Search'],['reddit.svg','Reddit']].map(([l,n])=><div key={n} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderRadius:999,boxShadow:`0 0 0 1.5px ${LINE}`,fontFamily:SANS,fontSize:20,color:INK}}><Logo id={l} size={22}/>{n}</div>)}
   </div>
   {badge(0)}
  </Card>
  {/* mascot card */}
  <Card style={{...at4(R.M),...cardStyle(1)}}>
   <Mono style={{position:'absolute',left:30,top:26,zIndex:2}}><span style={{color:BLUE}}>●</span> // on air</Mono>
   <Char keys={[['front',0],['wink',C],['thumbs',stamp]]} x={v?25:80} y={10} size={440} t={t} ox={R.M[0]} oy={R.M[1]}/>
   {badge(1)}
  </Card>
  {/* C: posting daily */}
  <Card style={{...at4(R.C),...cardStyle(2),...hi(act(C,D))}}>
   <Mono style={{position:'absolute',left:30,top:26}}>// posting every day</Mono>
   <div style={{position:'absolute',left:30,top:80,display:'flex',alignItems:'center',gap:14}}><Logo id="linkedin.svg" size={34}/><div style={{fontFamily:SANS,fontWeight:600,fontSize:34,letterSpacing:-1,color:INK}}>Tomorrow, 9:00</div></div>
   <div style={{position:'absolute',left:30,right:30,top:180}}>
    <div style={{position:'absolute',left:14,right:14,top:18,height:4,background:LINE,borderRadius:4}}>
     <div style={{height:4,background:BLUE,borderRadius:4,width:`${100*clamp((t-C-.1)/1.4)}%`}}/></div>
    <div style={{display:'flex',justifyContent:'space-between'}}>
     {days.map((d,k)=>{const on=t>C+.1+k*.2;return <div key={d} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
      <div style={{width:40,height:40,borderRadius:40,background:on?BLUE:'#fff',boxShadow:`0 0 0 2px ${on?BLUE:LINE}`,transform:`scale(${on?pop(t,C+.1+k*.2,260,12):1})`}}/>
      <Mono style={{fontSize:15}}>{d}</Mono></div>;})}
    </div>
   </div>
   <Mono style={{position:'absolute',left:30,bottom:30,fontSize:18}}>7 posts scheduled · in your voice</Mono>
   {badge(3)}
  </Card>
  {/* B: writing outreach */}
  <Card style={{...at4(R.B),...cardStyle(3),...hi(act(B,C))}}>
   <Mono style={{position:'absolute',left:30,top:26}}>// writing outreach</Mono>
   <Mono style={{position:'absolute',left:30,top:78,fontSize:18,color:INK}}>to: lena · founder, fintech</Mono>
   <div style={{position:'absolute',left:30,right:30,top:122,fontFamily:SANS,fontSize:30,lineHeight:1.35,letterSpacing:-.5,color:INK}}>{t>B?typed:''}<span style={{opacity:t>B&&!sent&&Math.floor(t*4)%2===0?1:0}}>|</span></div>
   <div style={{position:'absolute',left:30,right:30,bottom:30,height:72,borderRadius:16,background:sent?'#fff':BLUE,boxShadow:sent?`0 0 0 2px ${BLUE}`:'none',color:sent?BLUE:'#fff',display:'flex',alignItems:'center',justifyContent:'center',gap:10,fontFamily:SANS,fontWeight:600,fontSize:28}}>{sent?'Sent  ✓':'Send'}</div>
   {badge(2)}
  </Card>
  {/* D: following up */}
  <Card style={{...at4(R.D),...cardStyle(4),...hi(act(D,stamp))}}>
   <Mono style={{position:'absolute',left:30,top:26}}>// following up</Mono>
   {t>D+.1&&<div style={{position:'absolute',left:30,top:80,maxWidth:420,padding:'18px 24px',borderRadius:'22px 22px 22px 6px',background:'#f1f1f4',fontFamily:SANS,fontSize:28,color:INK,transform:`scale(${pop(t,D+.1)})`,transformOrigin:'0 100%'}}>Sounds good. Thursday?</div>}
   {t>D+.55&&<div style={{position:'absolute',left:30,right:30,bottom:30,height:110,borderRadius:18,boxShadow:`0 0 0 2px ${BLUE}`,display:'flex',alignItems:'center',gap:18,padding:'0 22px',transform:`translateY(${(1-pop(t,D+.55))*40}px)`}}>
    <div style={{width:70,height:70,borderRadius:14,background:BLUE,color:'#fff',display:'grid',placeItems:'center',fontFamily:SANS,fontWeight:600,fontSize:20,lineHeight:1.1,textAlign:'center'}}>THU<br/>10:00</div>
    <div style={{flex:1}}><div style={{fontFamily:SANS,fontWeight:600,fontSize:28,letterSpacing:-.6,color:INK}}>Intro call</div><Mono style={{fontSize:16,marginTop:6}}>booked · on your calendar</Mono></div>
    <Check size={40}/></div>}
   {badge(4)}
  </Card>
  {/* the stamp */}
  {t>stamp-.02&&<>
   <div style={{position:'absolute',left:W/2-900*ring,top:H/2-900*ring,width:1800*ring,height:1800*ring,borderRadius:'50%',border:`3px solid rgba(54,99,255,${.55*(1-ring)})`}}/>
   {(()=>{const s=pop(t,stamp,320,15);return <div style={{position:'absolute',left:W/2-380,top:H/2-150,width:760,height:260,borderRadius:28,border:`9px solid ${BLUE}`,background:'rgba(255,255,255,.88)',
    display:'grid',placeItems:'center',transform:`rotate(-7deg) scale(${2.2-1.2*s})`,opacity:clamp((t-stamp)/.06)}}>
    <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:190,color:BLUE,letterSpacing:-2,lineHeight:1}}>Handled.</div></div>;})()}
  </>}
 </AbsoluteFill>;
};

/* ---------- E: proof ---------- */
const Believe=({t}:{t:number})=>{
 const {v}=useLay();
 const up=pop(t,19.95,140,16);
 return <AbsoluteFill style={{background:INK}}>
  <Grid color="rgba(255,255,255,.05)"/>
  <Words t={t} style={{position:'absolute',left:v?60:72,top:v?290:250,width:v?960:1100,fontFamily:SANS,fontWeight:600,fontSize:v?176:158,letterSpacing:-7,color:'#fff',lineHeight:1}}
   items={[{text:"Don't",at:w('v7',0).s},{text:'believe',at:w('v7',1).s,serif:true,size:v?214:196},{text:'us?',at:w('v7',2).s}]}/>
  <Char keys={[['skeptical',0]]} x={v?40:1170} y={v?1920-1000*up:1080-860*up} size={v?1000:860} t={t}/>
 </AbsoluteFill>;
};

/* ---------- F: try it ---------- */
const URL='yourstartup.com';
const TryIt=({t}:{t:number})=>{
 const {v}=useLay();
 const box=pop(t,22.2,160,16);const tStart=w('v8',3).e+.05;const typed=URL.slice(0,Math.floor(clamp((t-tStart)/.6)*URL.length));
 const press=w('v8',5).s;const pressed=t>press;const btn=t>press&&t<press+.12?.95:1;
 const report=pop(t,w('v8',6).s,160,16);const char=pop(t,22.35,140,16);
 const cols=[['who buys','VP Growth','Head of Content','RevOps lead'],['where they are','LinkedIn','Search','Reddit'],['first move','Website score 72','Fix positioning','Add one proof point']];
 return <AbsoluteFill style={{background:'#fff'}}>
  <Grid/>
  <Words t={t} style={{position:'absolute',left:v?60:72,top:v?210:130,width:v?960:undefined,fontFamily:SANS,fontWeight:600,fontSize:v?124:132,letterSpacing:-5.5,color:INK,lineHeight:1}}
   items={[{text:'Put',at:w('v8',0).s},{text:'your',at:w('v8',1).s},{text:'website',at:w('v8',2).s,serif:true,blue:true,size:v?150:160},{text:'here.',at:w('v8',3).s}]}/>
  <div style={{position:'absolute',left:v?40:72,top:v?540:380,width:v?1000:1180,height:v?116:124,borderRadius:124,background:'#fff',boxShadow:`0 0 0 2px ${pressed?BLUE:LINE}, 0 30px 70px -30px rgba(10,10,40,.3)`,
   transform:`translateY(${(1-box)*60}px) scale(${.92+.08*box})`,opacity:clamp(box*1.5),display:'flex',alignItems:'center',padding:v?'0 12px 0 40px':'0 14px 0 48px'}}>
   <div style={{flex:1,fontFamily:SANS,fontSize:v?34:40,letterSpacing:-.8,color:typed?INK:'#a3a3ad'}}>{typed||'Add your website'}<span style={{color:BLUE,opacity:typed.length<URL.length&&Math.floor(t*4)%2===0?1:0}}>|</span></div>
   <div style={{height:v?88:96,padding:v?'0 28px':'0 40px',borderRadius:96,background:BLUE,color:'#fff',display:'flex',alignItems:'center',gap:14,fontFamily:SANS,fontWeight:600,fontSize:v?26:32,letterSpacing:-.5,transform:`scale(${btn})`}}>
    {pressed?'Finding your customers…':'Generate free report'} →</div>
  </div>
  {t>w('v8',6).s&&<Card style={{left:v?40:72,top:v?700:560,width:v?1000:1180,height:400,transform:`translateY(${(1-report)*120}px)`,opacity:clamp(report*1.4)}}>
   <Mono style={{position:'absolute',left:36,top:28}}>// your free report · example</Mono>
   {cols.map(([h,...items],k)=><div key={h} style={{position:'absolute',left:v?30+k*318:36+k*380,top:84,width:v?296:350}}>
    <Mono style={{fontSize:17,color:BLUE}}>{h}</Mono>
    {items.map((it,j)=>{const at=w('v8',6).s+.25+k*.25+j*.12;return <div key={it} style={{marginTop:v?22:18,padding:v?'18px 16px':'16px 20px',borderRadius:16,boxShadow:`0 0 0 1.5px ${LINE}`,fontFamily:SANS,fontWeight:600,fontSize:v?23:26,letterSpacing:-.6,color:INK,
     opacity:out3((t-at)/.2),transform:`translateY(${(1-out3((t-at)/.2))*20}px)`}}>{it}</div>;})}
   </div>)}
  </Card>}
  <Char keys={[['point',0]]} x={v?300:1280} y={v?1920-700*char:1080-760*char} size={v?760:780} t={t}/>
 </AbsoluteFill>;
};

/* ---------- G: the mark ---------- */
const Mark=({t}:{t:number})=>{
 const {v,W}=useLay();
 const logo=pop(t,27.3,160,13);const head=out3((t-27.75)/.55);
 const btn=pop(t,w('v9',4).s-.1,180,14);const foot=out3((t-29.2)/.4);
 const lw=v?900:940,lh=lw*726/1726,lx=(W-lw)/2,ly=v?760:250,hs=lw/940,cs=Math.round(440*hs);
 return <AbsoluteFill style={{background:'#fff'}}>
  <Grid/>
  {/* the head rises from behind the letters */}
  <div style={{position:'absolute',left:lx+lw*.345,top:ly-300*hs,width:cs,height:310*hs,overflow:'hidden'}}>
   <Char keys={[['front',0],['wink',28.3]]} x={0} y={(353-330*head)*hs} size={cs} t={t} ox={lx+lw*.345} oy={ly-300*hs}/>
  </div>
  <div style={{position:'absolute',left:lx,top:ly,width:lw,height:lh,transform:`scale(${1.12-.12*logo})`,opacity:clamp(logo*1.4)}}>
   <Img src={staticFile('find-promo/lockup-dark.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
  </div>
  <Words t={t} style={{position:'absolute',left:0,right:0,top:ly+lh+(v?40:30),justifyContent:'center',fontFamily:SANS,fontWeight:500,fontSize:v?66:60,letterSpacing:-2,color:INK}}
   items={[{text:'Get',at:w('v9',0).s},{text:'started',at:w('v9',1).s},{text:'today.',at:w('v9',2).s,serif:true,blue:true,size:v?78:72}]}/>
  <div style={{position:'absolute',left:0,right:0,top:ly+lh+(v?160:140),display:'flex',justifyContent:'center',alignItems:'center',gap:26,transform:`scale(${.8+.2*btn})`,opacity:clamp(btn*1.5)}}>
   <div style={{padding:'22px 40px',borderRadius:80,background:BLUE,color:'#fff',fontFamily:SANS,fontWeight:600,fontSize:34,letterSpacing:-.6}}>Find my customers →</div>
   <div style={{fontFamily:MONO,fontSize:30,color:INK}}>ekoslabs.com/find</div>
  </div>
  <Mono style={{position:'absolute',left:0,right:0,bottom:v?340:46,textAlign:'center',fontSize:19,opacity:foot}}>free report&nbsp;&nbsp;·&nbsp;&nbsp;cited sources&nbsp;&nbsp;·&nbsp;&nbsp;private by default</Mono>
 </AbsoluteFill>;
};

/* ---------- sound ---------- */
const SFX:[string,number,number][]=[
 ['pop',.62,.5],['whoosh',3.72,.55],
 ...CARDS.map(c=>['pop',w('v3',c.word).s-.05,.6] as [string,number,number]),
 ['whoosh',8.15,.5],...[0,1,2,3].map(k=>['pop',w('v4',3).s+.12+k*.16,.35] as [string,number,number]),
 ['swish',12.9,.6],['stamp',w('v6',0).s,.9],['whoosh',19.85,.45],['click',w('v8',5).s,.7],['swish',27.25,.5],['pop',w('v9',4).s-.1,.5],
];
const music=(f:number)=>{const t=f/FPS;const speaking=LINES.some(l=>t>l.at-.1&&t<l.at+l.dur+.1);
 const base=speaking?.34:.52;const fin=t>tl.duration-2.2?clamp((tl.duration-t)/2.2):1;return base*fin*clamp(t/.4+.2);};

export const FindPromo=({vertical=false}:{vertical?:boolean})=>{
 const f=useCurrentFrame();const t=f/FPS;const [handle]=useState(()=>delayRender('Load fonts'));
 useEffect(()=>{Promise.all([
  new FontFace('Inter',`url(${staticFile('fonts/inter.woff2')})`,{weight:'100 900'}).load(),
  new FontFace('InstrumentSerif',`url(${staticFile('fonts/instrument-serif-italic.woff2')})`,{style:'italic',weight:'400'}).load(),
 ]).then(fs=>{fs.forEach(x=>document.fonts.add(x));
  if(!document.fonts.check('600 60px Inter')||!document.fonts.check('italic 400 60px InstrumentSerif'))throw new Error('Fonts did not load');
  continueRender(handle);}).catch(e=>{throw e;});},[handle]);
 const chapter=t<4.45?'// 01 · hook':t<8.45?'// 02 · who':t<13.1?'// 03 · what we do':t<19.9?'// 04 · handled':t<22.2?'// 05 · proof':t<27.25?'// 06 · try it':'// 07 · ekoslabs.com/find';
 const typing:number[]=[];const tS=w('v8',3).e+.05;for(let k=0;k<URL.length;k++)typing.push(tS+k*.6/URL.length);
 const B=w('v5',2).s;for(let k=0;k<18;k++)typing.push(B+.1+k*.07);
 return <VCtx.Provider value={vertical}><AbsoluteFill style={{background:'#fff',fontFamily:SANS}}>
  <Audio src={staticFile(tl.music.file)} startFrom={F(tl.music.offset)} volume={music}/>
  {LINES.map(l=><Sequence key={l.id} from={F(l.at)} durationInFrames={F(l.dur)+6}><Audio src={staticFile(l.file)}/></Sequence>)}
  {SFX.map(([n,at,v],k)=><Sequence key={k} from={Math.max(0,F(at))} durationInFrames={F(.6)}><Audio src={staticFile(`find-promo/sfx/${n}.wav`)} volume={v}/></Sequence>)}
  {typing.map((at,k)=><Sequence key={'k'+k} from={F(at)} durationInFrames={F(.08)}><Audio src={staticFile('find-promo/sfx/key.wav')} volume={.3}/></Sequence>)}

  {t<4.5&&<Hook t={t}/>}
  <Wipe t={t} at={3.72} x={vertical?330:520} y={vertical?520:560}/>
  {t>=4.3&&t<8.62&&<>{t>=8.18&&<Agents t={t}/>}<Who t={t} local={t-4.45}/></>}
  {t>=8.62&&t<13.3&&<Agents t={t}/>}
  {t>=12.95&&t<19.95&&<Handled t={t}/>}
  {t>=19.95&&t<22.2&&<Believe t={t}/>}
  {t>=22.2&&t<27.25&&<TryIt t={t}/>}
  {t>=27.25&&<Mark t={t}/>}
  <Header chapter={chapter} t={t} dark={t>=19.95&&t<22.2}/>
 </AbsoluteFill></VCtx.Provider>;
};
