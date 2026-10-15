import React from 'react';
import {useCurrentFrame} from 'remotion';
import {T,Stage,Title,Label,Body,Micro,Serif,Sheet,Card,Tag,Pill,Logo,UserIcon,TargetIcon,ease,rise,recede,SAFE} from '../ui';
import {MARKET,SIM,ICP,DMS,CHANNELS,REPORT_BADGE} from '../copy';

/* 15.20 -> 28.40. The report assembles section by section, in the order the real report reads:
   market, audience simulation, ICP, decision makers, then communities and channels. Each
   section is the live product's own section label and heading. Figures are an example output,
   badged as one in the sheet header. */

const SHEET={top:455,h:832},BODY_W=SAFE.w-68,PANEL_AT=[64,130,196,262,328];
const inner:React.CSSProperties={position:'absolute',left:34,top:30,width:BODY_W};

const PanelTitle=({children,size=46}:{children:React.ReactNode;size?:number})=>
 <div style={{fontSize:size,lineHeight:1.1,letterSpacing:size*-.035,color:T.fg}}>{children}</div>;

/* 1. What to do in your market */
const Market=({f}:{f:number})=><div style={inner}>
 <PanelTitle>{MARKET.title}</PanelTitle>
 <div style={{marginTop:38}}>{MARKET.bars.map(([label,w,tag],i)=>{const a=ease((f-(10+i*8))/16);
  return <div key={label} style={{marginTop:i?34:0,...rise(f,8+i*8,12,10)}}>
   <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between'}}>
    <span style={{fontSize:30,color:T.fg70}}>{label}</span>
    <span style={{fontSize:21,letterSpacing:2,textTransform:'uppercase',fontWeight:500,color:i===2?T.accentText:T.fg30}}>{tag}</span>
   </div>
   <div style={{marginTop:14,height:16,borderRadius:999,background:'rgba(255,255,255,0.06)',overflow:'hidden'}}>
    <div style={{height:16,width:`${w*100}%`,borderRadius:999,background:T.accent,opacity:i===0?.35:i===1?.62:1,transform:`scaleX(${a})`,transformOrigin:'left'}}/>
   </div>
  </div>;})}
 </div>
 <Card accent style={{marginTop:52,padding:'30px 32px',...rise(f,40,14,16)}}>
  <div style={{display:'flex',alignItems:'center',gap:14}}><TargetIcon size={28}/><Label color={T.accentText}>{MARKET.move[0]}</Label></div>
  <div style={{marginTop:16,fontSize:34,lineHeight:1.3,letterSpacing:-.8,color:T.fg}}>{MARKET.move[1]}</div>
 </Card>
</div>;

/* 2. How the ICP reacts. The JEV audience simulation, 200 modelled buyers. */
const COLS=20,DOT=18,GAP=11;
const bucketOf=(i:number)=>{let n=0;for(let b=0;b<SIM.buckets.length;b++){n+=SIM.buckets[b][1];if(i<n)return b;}return 3;};
const TONE=['rgba(240,240,245,0.16)','rgba(54,99,255,0.34)','rgba(54,99,255,0.62)','#3663ff'];
const Simulation=({f}:{f:number})=><div style={inner}>
 <PanelTitle size={42}>{SIM.title}</PanelTitle>
 <div style={{display:'flex',flexWrap:'wrap',width:COLS*(DOT+GAP)-GAP,marginTop:22}}>
  {Array.from({length:200},(_,i)=>{const col=i%COLS,row=Math.floor(i/COLS);
   const a=ease((f-(4+(col*.7+row*.6)))/7),g=ease((f-(16+i*.07))/8);
   return <span key={i} style={{width:DOT,height:DOT,borderRadius:DOT,marginRight:GAP,marginBottom:GAP,
    background:g>.5?TONE[bucketOf(i)]:'rgba(240,240,245,0.10)',opacity:a,transform:`scale(${.7+a*.3})`}}/>;})}
 </div>
 <div style={{display:'flex',gap:12,marginTop:8}}>{SIM.buckets.map(([label,n],i)=>
  <div key={label} style={{flex:1,...rise(f,32+i*3,12,10)}}>
   <div style={{display:'flex',alignItems:'center',gap:8}}><span style={{width:12,height:12,borderRadius:12,background:TONE[i]}}/>
    <span style={{fontSize:20,color:T.fg45,whiteSpace:'nowrap'}}>{label}</span></div>
   <div style={{fontSize:38,fontWeight:500,letterSpacing:-1,marginTop:6,fontVariantNumeric:'tabular-nums'}}>{n}</div>
  </div>)}
 </div>
 <div style={{display:'flex',gap:16,marginTop:20}}>
  {SIM.stats.map(([label,v],i)=><Card key={label} style={{flex:1,padding:'22px 24px',...rise(f,40+i*4,12,10)}}>
   <Micro color={T.fg30}>{label}</Micro>
   <div style={{fontSize:44,fontWeight:500,letterSpacing:-1.4,marginTop:8,fontVariantNumeric:'tabular-nums'}}>{v}<span style={{fontSize:26,color:T.fg45}}>%</span></div>
  </Card>)}
  <Card style={{flex:1.35,padding:'22px 24px',...rise(f,48,12,10)}}>
   <Micro color={T.fg30}>{SIM.friction[0]}</Micro>
   <div style={{fontSize:28,marginTop:10,color:T.fg70}}>{SIM.friction[1]}</div>
  </Card>
 </div>
 <div style={{marginTop:18,...rise(f,54,12,8)}}><Micro>{SIM.disclaimer}</Micro></div>
</div>;

/* 3. Which buyer to pursue */
const Icp=({f}:{f:number})=><div style={inner}>
 <PanelTitle>{ICP.title}</PanelTitle>
 <div style={{marginTop:26,...rise(f,8,14,12)}}><Body size={32} color={T.fg70}>{ICP.profile}</Body></div>
 <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:34}}>
  {ICP.firmographics.map((c,i)=><span key={c} style={rise(f,16+i*4,12,10)}><Tag tone={i===0?'accent':'neutral'}>{c}</Tag></span>)}
 </div>
 <div style={{marginTop:46,paddingTop:34,borderTop:`1px solid ${T.hair}`,...rise(f,40,14,10)}}>
  <Label>Also in scope, later</Label>
  {ICP.later.map((l,i)=><div key={l} style={{display:'flex',alignItems:'center',gap:16,marginTop:20,opacity:.42,...rise(f,44+i*5,12,8)}}>
   <span style={{width:10,height:10,borderRadius:10,background:T.faint}}/><span style={{fontSize:28,color:T.fg70}}>{l}</span></div>)}
 </div>
</div>;

/* 4. Who can say yes, and how to reach them */
const People=({f}:{f:number})=><div style={inner}>
 <PanelTitle>{DMS.title}</PanelTitle>
 <div style={{marginTop:30}}>{DMS.people.map(([ini,role,rel,tag],i)=>
  <Card key={role} accent={i===0} style={{display:'flex',alignItems:'center',gap:20,padding:'20px 24px',marginTop:i?12:0,...rise(f,8+i*6,12,14)}}>
   <span style={{width:58,height:58,borderRadius:14,background:i===0?T.accentSoft:'rgba(255,255,255,0.06)',display:'grid',placeItems:'center',
    fontSize:22,fontWeight:500,color:i===0?T.accentText:T.fg45,letterSpacing:.5}}>{ini}</span>
   <span style={{minWidth:0}}>
    <div style={{fontSize:32,letterSpacing:-.6}}>{role}</div>
    <div style={{fontSize:22,color:T.fg45,marginTop:4}}>{rel}</div>
   </span>
   {tag?<span style={{marginLeft:'auto'}}><Tag tone="accent">{tag}</Tag></span>:<span style={{marginLeft:'auto'}}><UserIcon color={T.fg30}/></span>}
  </Card>)}
 </div>
 <div style={{marginTop:34,paddingTop:28,borderTop:`1px solid ${T.hair}`,...rise(f,34,14,10)}}>
  <Label>How to find them</Label>
  {DMS.how.map((h,i)=><div key={h.text} style={{display:'flex',alignItems:'center',gap:18,marginTop:18,...rise(f,38+i*6,12,10)}}>
   <Logo id={h.logo} size={30}/><span style={{fontSize:27,color:T.fg70,lineHeight:1.35}}>{h.text}</span></div>)}
 </div>
</div>;

/* 5. Communities and channels */
const Channels=({f}:{f:number})=><div style={inner}>
 <PanelTitle size={42}>{CHANNELS.title}</PanelTitle>
 <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:30}}>
  {CHANNELS.communities.map((c,i)=><span key={c} style={{display:'inline-flex',alignItems:'center',gap:12,padding:'12px 20px',borderRadius:12,
   background:'rgba(255,255,255,0.05)',boxShadow:`inset 0 0 0 1px ${T.hair}`,...rise(f,6+i*4,12,10)}}>
   <Logo id="reddit" size={26}/><span style={{fontSize:28,color:T.fg,fontVariantNumeric:'tabular-nums'}}>{c}</span></span>)}
 </div>
 <div style={{marginTop:20,...rise(f,24,12,8)}}><Micro color={T.fg45}>{CHANNELS.communityNote}</Micro></div>
 <div style={{marginTop:38,paddingTop:32,borderTop:`1px solid ${T.hair}`}}>
  {CHANNELS.rows.map((r,i)=><div key={r.name} style={{display:'flex',alignItems:'center',gap:20,paddingBottom:22,marginTop:i?22:6,
   borderBottom:i<2?`1px solid ${T.hair}`:'none',...rise(f,30+i*7,12,12)}}>
   <Logo id={r.logo} size={34}/>
   <span style={{minWidth:0,flex:1}}>
    <div style={{fontSize:32,letterSpacing:-.6}}>{r.name}</div>
    <div style={{fontSize:24,color:T.fg45,marginTop:5}}>{r.reason}</div>
   </span>
   <Tag tone={i===0?'accent':'neutral'}>{r.fit}</Tag>
  </div>)}
 </div>
</div>;

const PANELS=[
 {label:MARKET.sheet,view:Market},
 {label:SIM.sheet,view:Simulation},
 {label:ICP.sheet,view:Icp},
 {label:DMS.sheet,view:People},
 {label:CHANNELS.sheet,view:Channels},
];
const DOTS=['Market','Buyers','ICP','People','Channels'];

export const Report=()=>{
 const f=useCurrentFrame();
 const active=PANEL_AT.reduce((a,at,i)=>f>=at?i:a,-1);
 return <Stage>
  <div style={{position:'absolute',left:SAFE.x,top:236,...rise(f,0,14,24)}}>
   <Label>Your GTM report</Label>
   <div style={{marginTop:20}}><Title size={82}>Every answer, <Serif>in minutes.</Serif></Title></div>
  </div>

  <div style={{position:'absolute',left:SAFE.x,top:SHEET.top,...rise(f,10,18,30)}}>
   <Sheet label={active<0?'Your report · Assembling':PANELS[active].label} height={SHEET.h}
    badge={<Pill on={active>=0}>{active<0?'Building':REPORT_BADGE}</Pill>}>
    {/* the sheet fills in before the first section lands */}
    {active<0&&<div style={{...inner,top:40}}>
     {[0,1,2,3,4].map(i=><div key={i} style={{height:i?22:44,borderRadius:8,background:'rgba(255,255,255,0.05)',
      marginTop:i?22:0,width:i?`${92-i*13}%`:'62%',opacity:ease((f-(14+i*5))/12)}}/>)}
    </div>}
    {PANELS.map((p,i)=>{if(f<PANEL_AT[i]||i<active-1)return null;
     const next=PANEL_AT[i+1]??9999,out=ease((f-next)/14),lf=f-PANEL_AT[i];
     return <div key={p.label} style={{position:'absolute',inset:0,zIndex:i,
      ...(out>0?recede(out,-150,.94,0):rise(lf,0,16,40))}}><p.view f={lf}/></div>;})}
   </Sheet>
  </div>

  <div style={{position:'absolute',left:SAFE.x,top:SHEET.top+SHEET.h+34,display:'flex',gap:26,alignItems:'center'}}>
   {DOTS.map((d,i)=><div key={d} style={{display:'flex',alignItems:'center',gap:10,fontSize:22,color:i===active?T.fg:T.fg30,
    opacity:ease((f-(PANEL_AT[i]-10))/12)}}>
    <span style={{width:9,height:9,borderRadius:9,background:i<=active?T.accent:'rgba(255,255,255,0.14)'}}/>{d}</div>)}
  </div>
 </Stage>;
};
