import React from 'react';
import {AbsoluteFill,Audio,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {BRAND,Card,Check,Grid,Header,MONO,Mono,SANS,SERIF,VCtx,Wipe,Words,clamp,inOut,out3,pop,useFonts,useLay} from './kit';
import {F,FPS,DURATION,L,LINES,MUSIC,SFX_DIR,speaking,w} from './timing';
import {Char} from './Char';

/* Example film: a 30-second promo for "Acme", a made-up AI support inbox. It is the mascot
   promo format: a character who talks, a word-by-word headline with one serif accent word, a
   circle wipe, cards on colour, a phone console, a whip into a grid of live cards with a stamp,
   a black proof line, a try-it beat, and the logo with the character peeking over it.

   Replace the story, keep the mechanics:
   - every beat keys off a spoken word: w('v4',3).s is when word 3 of line v4 starts;
   - scene boundaries are derived from line start times (T below), so a re-voiced line moves
     its scene with it;
   - one component renders both formats; each scene picks its own numbers when v is true. */

const at=(id:string)=>L(id).at;
const T={
 wipe:at('v3')-.73,  // circle wipe out of the hook's accent word
 who:at('v3')-.15,   // who it is for: cards on colour
 what:at('v4')-.32,  // what it does: the colour panel zooms out to the phone console
 grid:at('v5')-.28,  // whip into the grid of live cards
 proof:at('v7')-.1,  // black, one line
 tryIt:at('v8')-.1,  // put your thing in here
 end:at('v9')-.15,   // logo, character peeks over it, call to action
};

/* ---------- 1. hook ---------- */
const Hook=({t}:{t:number})=>{
 const {v}=useLay();
 const enter=pop(t,0,120,14);const x=v?1000-1000*enter:1780-780*enter,cy=v?800:40;
 const b0=at('v1')+.07,b1=at('v2');
 const bub=clamp((t-b0)/.12)*(1-clamp((t-b1)/.12));const typed='psst..'.slice(0,Math.floor(clamp((t-b0-.04)/.35)*6));
 const fire=w('v2',2);
 return <AbsoluteFill style={{background:BRAND.paper}}>
  <Grid/>
  <Char keys={[['psst',0],['front',at('v2')-.1],['wink',fire.e+.3]]} x={x} y={cy} size={1080} t={t}/>
  {bub>0&&<div style={{position:'absolute',left:x+120,top:cy+520,opacity:bub,transform:`scale(${.7+.3*bub})`,transformOrigin:'100% 100%',
   background:'#fff',border:`2px solid ${BRAND.ink}`,borderRadius:26,padding:'10px 22px',fontFamily:MONO,fontSize:30,color:BRAND.ink}}>{typed}&nbsp;</div>}
  <Mono style={{position:'absolute',left:v?60:72,top:v?248:196,fontSize:v?26:24,opacity:out3((t-at('v2')+.2)/.2)}}>// for online shops</Mono>
  <div style={{position:'absolute',left:v?56:64,top:v?292:236,fontFamily:SANS,fontWeight:600,fontSize:v?150:180,letterSpacing:v?-6:-7,color:BRAND.ink,lineHeight:1}}>
   <Words t={t} items={[{text:'Inbox',at:w('v2',0).s}]}/>
   <div style={{marginTop:v?24:34}}>
    <Words t={t} items={[{text:'on',at:w('v2',1).s},{text:'fire?',at:fire.s,serif:true,accent:true,size:v?190:230,underlineAt:fire.e-.02}]}/>
   </div>
  </div>
 </AbsoluteFill>;
};

/* ---------- 2. who it is for ---------- */
const ICONS:Record<string,React.ReactNode>={
 refund:<><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4v5h-5"/></>,
 box:<><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/></>,
 tag:<><path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.6"/></>,
};
const CARDS=[{icon:'refund',title:'Refunds',sub:'returns · exchanges',word:0},{icon:'box',title:'Orders',sub:'where is it · delays',word:1},{icon:'tag',title:'Stock',sub:'sizes · restocks',word:4}];
const Who=({t}:{t:number})=>{
 const {v}=useLay();
 const exit=inOut((t-T.what)/.42);
 return <AbsoluteFill style={{background:BRAND.accent,transformOrigin:v?'68% 62%':'64% 62%',transform:`scale(${1-.62*exit}) translate(${(v?0:120)*exit}px,${40*exit}px)`,borderRadius:60*exit,overflow:'hidden',opacity:1-clamp((t-T.what-.27)/.12)}}>
  <Grid color="rgba(255,255,255,.08)"/>
  <Char keys={[['front',0],['wink',w('v3',7).e+.2]]} x={v?-60:-120} y={v?880:120} size={v?1020:960} t={t}/>
  {CARDS.map((c,k)=>{const a0=w('v3',c.word).s-.05;const a=pop(t,a0);if(t<a0)return null;
   return <Card key={c.title} style={{left:v?40+k*340:760+k*380,top:v?300:250,width:v?320:350,height:470,transform:`translateY(${(1-a)*80}px) rotate(${(1-a)*-8}deg) scale(${.6+.4*a})`,boxShadow:'0 30px 60px -20px rgba(0,0,40,.4)'}}>
    <Mono style={{position:'absolute',left:26,top:22}}>// 0{k+1}</Mono>
    <div style={{position:'absolute',left:v?30:35,top:v?56:56,width:v?260:280,height:v?240:250,borderRadius:28,background:'#eef2ff',display:'grid',placeItems:'center'}}>
     <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke={BRAND.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{ICONS[c.icon]}</svg>
    </div>
    <div style={{position:'absolute',left:28,top:v?318:336,fontFamily:SANS,fontWeight:600,fontSize:v?36:40,letterSpacing:-1.4,color:BRAND.ink}}>{c.title}</div>
    <Mono style={{position:'absolute',left:28,right:24,top:v?370:392,fontSize:v?16:18,lineHeight:1.4}}>{c.sub}</Mono>
   </Card>;})}
 </AbsoluteFill>;
};

/* ---------- 3. what it does ---------- */
const TICKETS=[['Maya','Refund for order #2041'],['Jon','Where is my parcel?'],['Priya','Do you have this in M?'],['Leo','Wrong colour arrived']];
const What=({t}:{t:number})=>{
 const {v}=useLay();
 const phone=pop(t,T.what+.24,120,16);const charUp=out3((t-T.what-.72)/.5);
 const whip=inOut((t-T.grid+.03)/.3);
 return <AbsoluteFill style={{background:BRAND.paper,transform:`translateX(${-(v?1080:900)*whip}px)`,filter:whip>0?`blur(${whip*14}px)`:undefined}}>
  <Grid/>
  <div style={{position:'absolute',left:v?60:72,top:v?190:230,fontFamily:SANS,color:BRAND.ink}}>
   <Words t={t} style={{fontSize:v?58:64,fontWeight:500,letterSpacing:-2}} items={[{text:'Acme',at:w('v4',0).s},{text:'reads',at:w('v4',1).s},{text:'every',at:w('v4',2).s}]}/>
   <Words t={t} style={{fontSize:v?178:200,lineHeight:1.05,marginTop:6}} items={[{text:'message,',at:w('v4',3).s,serif:true,accent:true}]}/>
   <Words t={t} style={{fontSize:v?58:66,fontWeight:500,letterSpacing:-2.2,marginTop:26}} items={[{text:'and',at:w('v4',4).s},{text:'answers',at:w('v4',5).s}]}/>
   <Words t={t} style={{fontSize:v?58:66,fontWeight:500,letterSpacing:-2.2,marginTop:6}} items={[{text:'in',at:w('v4',6).s},{text:'your',at:w('v4',7).s},{text:'voice.',at:w('v4',8).s,serif:true,accent:true,size:v?70:80}]}/>
  </div>
  <div style={{position:'absolute',left:v?500:1230,top:(v?700:110)+(1-phone)*(v?1300:900),width:520,height:880,borderRadius:64,background:BRAND.ink,padding:14,boxShadow:'0 40px 80px -30px rgba(0,0,30,.45)'}}>
   <div style={{width:'100%',height:'100%',borderRadius:52,background:'#fff',overflow:'hidden',position:'relative'}}>
    <div style={{height:250,background:BRAND.accent,padding:'70px 36px 0',color:'#fff'}}>
     <Mono style={{color:'rgba(255,255,255,.7)'}}>// your inbox</Mono>
     <div style={{fontFamily:SANS,fontWeight:600,fontSize:46,letterSpacing:-1.6,marginTop:14}}>4 answered</div>
     <div style={{fontFamily:SANS,fontSize:22,opacity:.8,marginTop:6}}>in your voice, while you work</div>
    </div>
    {TICKETS.map(([name,subject],k)=>{const a0=w('v4',3).s+.12+k*.16;const a=pop(t,a0,200,16);if(t<a0)return null;const on=t>a0+.45;const pulse=.6+.4*Math.abs(Math.sin((t-a0)*4));
     return <div key={name} style={{margin:'22px 26px 0',padding:'20px 22px',borderRadius:20,boxShadow:`0 0 0 1.5px ${BRAND.line}`,display:'flex',alignItems:'center',gap:18,transform:`translateY(${(1-a)*40}px) scale(${.9+.1*a})`,opacity:clamp(a)}}>
      <div style={{width:14,height:14,borderRadius:14,background:on?BRAND.accent:BRAND.line,opacity:on?1:pulse,flexShrink:0}}/>
      <div style={{flex:1,minWidth:0}}><div style={{fontFamily:SANS,fontWeight:600,fontSize:26,letterSpacing:-.6,color:BRAND.ink}}>{name}</div><Mono style={{fontSize:16,marginTop:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{subject}</Mono></div>
      <Mono style={{fontSize:15,color:on?BRAND.accent:BRAND.grey}}>{on?'answered':'reading'}</Mono>
     </div>;})}
   </div>
  </div>
  <Char keys={[['peek',0]]} x={v?-40:640} y={v?1920-620*charUp:1080-480*charUp} size={v?620:520} t={t}/>
 </AbsoluteFill>;
};

/* ---------- 4. the grid of live cards, then the stamp ---------- */
type Rect=[number,number,number,number];
const GRID:{h:Record<'A'|'M'|'B'|'C'|'D',Rect>;v:Record<'A'|'M'|'B'|'C'|'D',Rect>}={
 h:{A:[64,96,570,900],M:[664,96,600,430],C:[664,556,600,440],B:[1294,96,562,430],D:[1294,556,562,440]},
 v:{A:[40,170,490,1000],M:[550,170,490,440],B:[550,630,490,540],C:[40,1190,490,420],D:[550,1190,490,420]},
};
const box=(r:Rect):React.CSSProperties=>({left:r[0],top:r[1],width:r[2],height:r[3]});
const TAGS=[['Refund request','billing'],['Late delivery','shipping'],['Size question','product'],['Damaged item','returns']];
const Handled=({t}:{t:number})=>{
 const {v,W,H}=useLay();const R=GRID[v?'v':'h'];
 const tin=inOut((t-T.grid)/.35);const stamp=w('v6',0).s;
 const A=w('v5',0).s,B=w('v5',2).s,C=w('v5',4).s,D=w('v5',6).s;
 const done=(d:number)=>pop(t,stamp+.08+d,260,14);
 const act=(a:number,b:number)=>t>=a&&t<b+.2;
 const ring=clamp((t-stamp)/.7);
 const badge=(k:number)=>t>stamp+.08+k*.06?<div style={{position:'absolute',right:30,top:22}}><Check a={done(k*.06)}/></div>:null;
 const count=Math.round(148*out3((t-A-.15)/1.6));
 const reply='Hi Maya, so sorry about that! Your refund is on its way and lands in 3 to 5 days.';
 const typed=reply.slice(0,Math.floor(clamp((t-B-.1)/1.3)*reply.length));const sent=t>B+1.55;
 const steps=['Asked','Checked','Approved','Paid'];
 const cardIn=(k:number):React.CSSProperties=>{const a=pop(t,T.grid+.03+k*.05,200,18);return {transform:`translateY(${(1-a)*60}px) scale(${.94+.06*a})`,opacity:clamp(a*1.3)};};
 const hi=(on:boolean):React.CSSProperties=>on?{boxShadow:`0 0 0 2.5px ${BRAND.accent}, 0 24px 60px -30px rgba(10,10,30,.25)`}:{};
 return <AbsoluteFill style={{background:'#fafafb',transform:`translateX(${(v?1080:900)*(1-tin)}px)`,filter:tin<1?`blur(${(1-tin)*14}px)`:undefined}}>
  <Grid/>
  <Card style={{...box(R.A),...cardIn(0),...hi(act(A,B))}}>
   <Mono style={{position:'absolute',left:30,top:26}}>// sorting tickets</Mono>
   <div style={{position:'absolute',left:30,top:74,fontFamily:SANS,fontWeight:600,fontSize:120,letterSpacing:-5,color:BRAND.ink,fontVariantNumeric:'tabular-nums'}}>{t<A?0:count}</div>
   <Mono style={{position:'absolute',left:34,top:210,fontSize:20}}>tickets sorted today</Mono>
   {TAGS.map(([s,tag],k)=>{const a0=A+.2+k*.28;if(t<a0)return null;const a=pop(t,a0,220,18);
    return <div key={s} style={{position:'absolute',left:30,right:30,top:280+k*(v?140:112),height:v?112:92,borderRadius:18,boxShadow:`0 0 0 1.5px ${BRAND.line}`,padding:v?'22px 20px':'16px 20px',transform:`translateX(${(1-a)*-40}px)`,opacity:clamp(a)}}>
     <div style={{fontFamily:SANS,fontWeight:600,fontSize:25,letterSpacing:-.6,color:BRAND.ink}}>{s}</div>
     <Mono style={{fontSize:16,color:BRAND.accent,marginTop:8}}>● {tag}</Mono></div>;})}
   <div style={{position:'absolute',left:30,bottom:30,display:'flex',gap:12}}>
    {['Email','Chat','Instagram'].map(n=><div key={n} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 16px',borderRadius:999,boxShadow:`0 0 0 1.5px ${BRAND.line}`,fontFamily:SANS,fontSize:20,color:BRAND.ink}}>
     <span style={{width:9,height:9,borderRadius:9,background:BRAND.accent}}/>{n}</div>)}
   </div>
   {badge(0)}
  </Card>
  <Card style={{...box(R.M),...cardIn(1)}}>
   <Mono style={{position:'absolute',left:30,top:26,zIndex:2}}><span style={{color:BRAND.accent}}>●</span> // on air</Mono>
   <Char keys={[['front',0],['wink',C],['thumbs',stamp]]} x={v?25:80} y={10} size={440} t={t} ox={R.M[0]} oy={R.M[1]}/>
   {badge(1)}
  </Card>
  <Card style={{...box(R.C),...cardIn(2),...hi(act(C,D))}}>
   <Mono style={{position:'absolute',left:30,top:26}}>// chasing refunds</Mono>
   <div style={{position:'absolute',left:30,top:80,fontFamily:SANS,fontWeight:600,fontSize:34,letterSpacing:-1,color:BRAND.ink}}>Refund #2041 · €48.00</div>
   <div style={{position:'absolute',left:30,right:30,top:180}}>
    <div style={{position:'absolute',left:20,right:20,top:18,height:4,background:BRAND.line,borderRadius:4}}>
     <div style={{height:4,background:BRAND.accent,borderRadius:4,width:`${100*clamp((t-C-.1)/1.2)}%`}}/></div>
    <div style={{display:'flex',justifyContent:'space-between'}}>
     {steps.map((d,k)=>{const on=t>C+.1+k*.4;return <div key={d} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
      <div style={{width:40,height:40,borderRadius:40,background:on?BRAND.accent:'#fff',boxShadow:`0 0 0 2px ${on?BRAND.accent:BRAND.line}`,transform:`scale(${on?pop(t,C+.1+k*.4,260,12):1})`}}/>
      <Mono style={{fontSize:15}}>{d}</Mono></div>;})}
    </div>
   </div>
   <Mono style={{position:'absolute',left:30,bottom:30,fontSize:18}}>paid back · customer told</Mono>
   {badge(3)}
  </Card>
  <Card style={{...box(R.B),...cardIn(3),...hi(act(B,C))}}>
   <Mono style={{position:'absolute',left:30,top:26}}>// writing replies</Mono>
   <Mono style={{position:'absolute',left:30,top:78,fontSize:18,color:BRAND.ink}}>to: maya · order #2041</Mono>
   <div style={{position:'absolute',left:30,right:30,top:122,fontFamily:SANS,fontSize:30,lineHeight:1.35,letterSpacing:-.5,color:BRAND.ink}}>{t>B?typed:''}<span style={{opacity:t>B&&!sent&&Math.floor(t*4)%2===0?1:0}}>|</span></div>
   <div style={{position:'absolute',left:30,right:30,bottom:30,height:72,borderRadius:16,background:sent?'#fff':BRAND.accent,boxShadow:sent?`0 0 0 2px ${BRAND.accent}`:'none',color:sent?BRAND.accent:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:SANS,fontWeight:600,fontSize:28}}>{sent?'Sent  ✓':'Send'}</div>
   {badge(2)}
  </Card>
  <Card style={{...box(R.D),...cardIn(4),...hi(act(D,stamp))}}>
   <Mono style={{position:'absolute',left:30,top:26}}>// following up</Mono>
   {t>D+.1&&<div style={{position:'absolute',left:30,top:80,maxWidth:420,padding:'18px 24px',borderRadius:'22px 22px 22px 6px',background:'#f1f1f4',fontFamily:SANS,fontSize:28,color:BRAND.ink,transform:`scale(${pop(t,D+.1)})`,transformOrigin:'0 100%'}}>It worked, thank you!</div>}
   {t>D+.55&&<div style={{position:'absolute',left:30,right:30,bottom:30,height:110,borderRadius:18,boxShadow:`0 0 0 2px ${BRAND.accent}`,display:'flex',alignItems:'center',gap:18,padding:'0 22px',transform:`translateY(${(1-pop(t,D+.55))*40}px)`}}>
    <div style={{flex:1}}><div style={{fontFamily:SANS,fontWeight:600,fontSize:28,letterSpacing:-.6,color:BRAND.ink}}>Ticket closed</div><Mono style={{fontSize:16,marginTop:6}}>customer replied · 2 min ago</Mono></div>
    <Check size={40}/></div>}
   {badge(4)}
  </Card>
  {t>stamp-.02&&<>
   <div style={{position:'absolute',left:W/2-900*ring,top:H/2-900*ring,width:1800*ring,height:1800*ring,borderRadius:'50%',border:`3px solid ${BRAND.accent}`,opacity:.55*(1-ring)}}/>
   {(()=>{const s=pop(t,stamp,320,15);return <div style={{position:'absolute',left:W/2-380,top:H/2-150,width:760,height:260,borderRadius:28,border:`9px solid ${BRAND.accent}`,background:'rgba(255,255,255,.88)',
    display:'grid',placeItems:'center',transform:`rotate(-7deg) scale(${2.2-1.2*s})`,opacity:clamp((t-stamp)/.06)}}>
    <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:190,color:BRAND.accent,letterSpacing:-2,lineHeight:1}}>Handled.</div></div>;})()}
  </>}
 </AbsoluteFill>;
};

/* ---------- 5. proof: black, one line ---------- */
const Proof=({t}:{t:number})=>{
 const {v}=useLay();
 const up=pop(t,T.proof,140,16);
 return <AbsoluteFill style={{background:BRAND.ink}}>
  <Grid color="rgba(255,255,255,.05)"/>
  <Words t={t} style={{position:'absolute',left:v?60:72,top:v?290:250,width:v?960:1100,fontFamily:SANS,fontWeight:600,fontSize:v?176:158,letterSpacing:-7,color:'#fff',lineHeight:1}}
   items={[{text:"Don't",at:w('v7',0).s},{text:'believe',at:w('v7',1).s,serif:true,size:v?214:196},{text:'us?',at:w('v7',2).s}]}/>
  <Char keys={[['skeptical',0]]} x={v?40:1170} y={v?1920-1000*up:1080-860*up} size={v?1000:860} t={t}/>
 </AbsoluteFill>;
};

/* ---------- 6. try it ---------- */
const URL='yourstore.com';
const Q='Can I return shoes I wore once?';
const A_TEXT="Yes! Within 30 days, as long as they're clean. Here's your free return label.";
/* The link types in after "link," and must finish before the button is pressed on "watch". */
const TYPE_AT=w('v8',3).e+.05,TYPE_DUR=Math.max(.2,Math.min(.6,w('v8',5).s-TYPE_AT-.08));
const TryIt=({t}:{t:number})=>{
 const {v}=useLay();
 const boxIn=pop(t,T.tryIt,160,16);const typed=URL.slice(0,Math.floor(clamp((t-TYPE_AT)/TYPE_DUR)*URL.length));
 const press=w('v8',5).s;const pressed=t>press;const btn=t>press&&t<press+.12?.95:1;
 const ans=w('v8',7).s;const card=pop(t,ans,160,16);const char=pop(t,T.tryIt+.15,140,16);
 const answer=A_TEXT.slice(0,Math.floor(clamp((t-ans-.5)/1.4)*A_TEXT.length));
 return <AbsoluteFill style={{background:BRAND.paper}}>
  <Grid/>
  <Words t={t} style={{position:'absolute',left:v?60:72,top:v?210:130,width:v?960:undefined,fontFamily:SANS,fontWeight:600,fontSize:v?124:132,letterSpacing:-5.5,color:BRAND.ink,lineHeight:1}}
   items={[{text:'Paste',at:w('v8',0).s},{text:'your',at:w('v8',1).s},{text:'store',at:w('v8',2).s,serif:true,accent:true,size:v?150:160},{text:'link.',at:w('v8',3).s}]}/>
  <div style={{position:'absolute',left:v?40:72,top:v?540:380,width:v?1000:1180,height:v?116:124,borderRadius:124,background:'#fff',boxShadow:`0 0 0 2px ${pressed?BRAND.accent:BRAND.line}, 0 30px 70px -30px rgba(10,10,40,.3)`,
   transform:`translateY(${(1-boxIn)*60}px) scale(${.92+.08*boxIn})`,opacity:clamp(boxIn*1.5),display:'flex',alignItems:'center',padding:v?'0 12px 0 40px':'0 14px 0 48px'}}>
   <div style={{flex:1,fontFamily:SANS,fontSize:v?34:40,letterSpacing:-.8,color:typed?BRAND.ink:'#a3a3ad'}}>{typed||'Your store link'}<span style={{color:BRAND.accent,opacity:typed.length<URL.length&&Math.floor(t*4)%2===0?1:0}}>|</span></div>
   <div style={{height:v?88:96,padding:v?'0 28px':'0 40px',borderRadius:96,background:BRAND.accent,color:'#fff',display:'flex',alignItems:'center',fontFamily:SANS,fontWeight:600,fontSize:v?26:32,letterSpacing:-.5,transform:`scale(${btn})`}}>
    {pressed?'Answering…':'Ask a real question'} →</div>
  </div>
  {t>ans&&<Card style={{left:v?40:72,top:v?700:560,width:v?1000:1180,height:v?440:400,transform:`translateY(${(1-card)*120}px)`,opacity:clamp(card*1.4)}}>
   <Mono style={{position:'absolute',left:36,top:28}}>// live answer · example</Mono>
   <div style={{position:'absolute',left:36,top:84,maxWidth:v?800:700,padding:'18px 24px',borderRadius:'22px 22px 22px 6px',background:'#f1f1f4',fontFamily:SANS,fontSize:30,color:BRAND.ink}}>{Q}</div>
   {t>ans+.45&&<div style={{position:'absolute',right:36,top:v?200:190,maxWidth:v?820:760,padding:'18px 24px',borderRadius:'22px 22px 6px 22px',background:BRAND.accent,color:'#fff',fontFamily:SANS,fontSize:30,lineHeight:1.3}}>
    {answer}<span style={{opacity:answer.length<A_TEXT.length?1:0}}>|</span></div>}
   {answer.length===A_TEXT.length&&<div style={{position:'absolute',right:36,bottom:30,display:'flex',alignItems:'center',gap:10,padding:'10px 18px',borderRadius:999,boxShadow:`0 0 0 1.5px ${BRAND.line}`,fontFamily:MONO,fontSize:20,color:BRAND.ink}}>
    <span style={{width:10,height:10,borderRadius:10,background:BRAND.accent}}/>return-label.pdf</div>}
  </Card>}
  <Char keys={[['point',0]]} x={v?300:1280} y={v?1920-700*char:1080-760*char} size={v?760:780} t={t}/>
 </AbsoluteFill>;
};

/* ---------- 7. the mark ---------- */
const End=({t}:{t:number})=>{
 const {v,W}=useLay();
 const logo=pop(t,T.end+.05,160,13);const head=out3((t-T.end-.5)/.55);
 const btn=pop(t,w('v9',4).s-.1,180,14);const foot=out3((t-T.end-1.95)/.4);
 const fs=v?300:340,ly=v?760:300;
 const xTop=ly+fs*.36;                      // top of the lowercase letters: the line he hides behind
 const cs=Math.round(fs*1.3),cx=Math.round((W-cs)/2);
 return <AbsoluteFill style={{background:BRAND.paper}}>
  <Grid/>
  {/* the head rises from behind the letters */}
  <div style={{position:'absolute',left:cx,top:xTop-cs,width:cs,height:cs,overflow:'hidden'}}>
   <Char keys={[['front',0],['wink',T.end+1.05]]} x={0} y={Math.round(cs*(1-.64*head))} size={cs} t={t} ox={cx} oy={xTop-cs}/>
  </div>
  <div style={{position:'absolute',left:0,width:W,top:ly,height:fs,textAlign:'center',fontFamily:SANS,fontWeight:700,fontSize:fs,letterSpacing:-fs*.06,lineHeight:`${fs}px`,color:BRAND.ink,
   transform:`scale(${1.12-.12*logo})`,opacity:clamp(logo*1.4)}}>acme<span style={{color:BRAND.accent}}>.</span></div>
  <Words t={t} style={{position:'absolute',left:0,right:0,top:ly+fs+(v?40:20),justifyContent:'center',fontFamily:SANS,fontWeight:500,fontSize:v?66:60,letterSpacing:-2,color:BRAND.ink}}
   items={[{text:'Try',at:w('v9',0).s},{text:'it',at:w('v9',1).s},{text:'free.',at:w('v9',2).s,serif:true,accent:true,size:v?78:72}]}/>
  <div style={{position:'absolute',left:0,right:0,top:ly+fs+(v?160:130),display:'flex',justifyContent:'center',alignItems:'center',gap:26,transform:`scale(${.8+.2*btn})`,opacity:clamp(btn*1.5)}}>
   <div style={{padding:'22px 40px',borderRadius:80,background:BRAND.accent,color:'#fff',fontFamily:SANS,fontWeight:600,fontSize:34,letterSpacing:-.6}}>Start free →</div>
   <div style={{fontFamily:MONO,fontSize:30,color:BRAND.ink}}>acme.app</div>
  </div>
  <Mono style={{position:'absolute',left:0,right:0,bottom:v?340:46,textAlign:'center',fontSize:19,opacity:foot}}>example film&nbsp;&nbsp;·&nbsp;&nbsp;made with launch film builder</Mono>
 </AbsoluteFill>;
};

/* ---------- sound ---------- */
const SFX:[string,number,number][]=[
 ['pop',at('v1')+.07,.5],['whoosh',T.wipe,.55],
 ...CARDS.map(c=>['pop',w('v3',c.word).s-.05,.6] as [string,number,number]),
 ['whoosh',T.what-.03,.5],...[0,1,2,3].map(k=>['pop',w('v4',3).s+.12+k*.16,.35] as [string,number,number]),
 ['swish',T.grid-.05,.6],['stamp',w('v6',0).s,.9],['whoosh',T.proof-.1,.45],['click',w('v8',5).s,.7],['swish',T.end,.5],['pop',w('v9',4).s-.1,.5],
];
const TYPING:number[]=[...Array.from(URL,(_,k)=>TYPE_AT+k*TYPE_DUR/URL.length),...Array.from({length:18},(_,k)=>w('v5',2).s+.1+k*.07)];
const musicVolume=(f:number)=>{if(!MUSIC)return 0;const t=f/FPS;
 const fin=t>DURATION-2.2?clamp((DURATION-t)/2.2):1;return MUSIC.volume*(speaking(t)?.65:1)*fin*clamp(t/.4+.2);};

export const Promo=({vertical=false}:{vertical?:boolean})=>{
 useFonts();
 const t=useCurrentFrame()/FPS;
 const chapter=t<T.who?'// 01 · hook':t<T.what+.27?'// 02 · who':t<T.grid?'// 03 · what it does':t<T.proof?'// 04 · handled':t<T.tryIt?'// 05 · proof':t<T.end?'// 06 · try it':'// 07 · acme.app';
 return <VCtx.Provider value={vertical}><AbsoluteFill style={{background:BRAND.paper,fontFamily:SANS}}>
  {MUSIC&&<Audio src={staticFile(MUSIC.file)} startFrom={F(MUSIC.offset)} volume={musicVolume}/>}
  {LINES.map(l=><Sequence key={l.id} from={F(l.at)} durationInFrames={F(l.dur)+6}><Audio src={staticFile(l.file)}/></Sequence>)}
  {SFX.map(([n,a,vol],k)=><Sequence key={k} from={Math.max(0,F(a))} durationInFrames={F(.6)}><Audio src={staticFile(`${SFX_DIR}/${n}.wav`)} volume={vol}/></Sequence>)}
  {TYPING.map((a,k)=><Sequence key={'k'+k} from={F(a)} durationInFrames={Math.max(1,F(.08))}><Audio src={staticFile(`${SFX_DIR}/key.wav`)} volume={.3}/></Sequence>)}

  {t<T.who+.05&&<Hook t={t}/>}
  <Wipe t={t} at={T.wipe} x={vertical?400:520} y={vertical?540:580}/>
  {t>=T.who&&t<T.what+.44&&<>{t>=T.what&&<What t={t}/>}<Who t={t}/></>}
  {t>=T.what+.44&&t<T.grid+.38&&<What t={t}/>}
  {t>=T.grid&&t<T.proof&&<Handled t={t}/>}
  {t>=T.proof&&t<T.tryIt&&<Proof t={t}/>}
  {t>=T.tryIt&&t<T.end&&<TryIt t={t}/>}
  {t>=T.end&&<End t={t}/>}
  <Header chapter={chapter} t={t} dark={t>=T.proof&&t<T.tryIt}/>
 </AbsoluteFill></VCtx.Provider>;
};
