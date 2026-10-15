import React from 'react';
import {Img,staticFile,useCurrentFrame} from 'remotion';
import {T,Stage,Frame,Card,Tag,Pill,Eyebrow,Logo,LogoId,Check,ease,clamp,rise,retire} from './kit';
import {UGC_SHOTS} from './media';

/* 60.440 -> 67.440. "The engine could produce hundreds of UGC assets, run theme pages,
   build a customized outbound system, create proper inbound flow." Four sections on the
   words: the brief and the footage; the asset library and theme pages; the outbound
   system; the inbound pages. Volumes are the website's app/consumer configuration,
   labelled as such. */

const Shot=({i,w,h,r=14}:{i:number;w:number;h:number;r?:number})=><div style={{width:w,height:h,borderRadius:r,overflow:'hidden',background:T.raised2,boxShadow:`inset 0 0 0 1px ${T.ring}`,flexShrink:0}}><Img src={staticFile(UGC_SHOTS[i%UGC_SHOTS.length])} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:`${30+(i*19)%40}% ${20+(i*23)%50}%`,filter:'blur(3.5px)',transform:'scale(1.06)'}}/></div>;
const Sec=({f,at,out,children}:{f:number;at:number;out:number;children:React.ReactNode})=>{const a=ease((f-at)/10),b=ease((f-out)/6);if(f<at||b>=1)return null;return <div style={{position:'absolute',inset:0,opacity:a*(1-b),transform:`translateY(${(1-a)*18}px) scale(${1-.03*b})`,transformOrigin:'50% 40%'}}>{children}</div>;};

const BRIEF:[string,string,string,string][]=[['Hook','0:00-0:03','Open on the problem, straight to camera','9:16'],['Demo','0:03-0:14','Screen capture over voiceover, three cuts','1:1'],['CTA','0:14-0:20','Direct ask, product name on screen','4:5']];
const THEME:[LogoId,string,string][]=[['instagram','Instagram','Theme-page reels'],['youtube','YouTube','Theme-page shorts'],['reddit','Reddit','Campaign posts']];
const PAGES=['Store listing · EN','Store listing · DE','Category comparison','App vs alternative','How it works','Pricing','Download','Use cases','For individuals','For teams','Changelog','Help centre'];

export const UGC=()=>{
 const f=useCurrentFrame(),assets=Math.round(150*ease((f-50)/26)),pages=Math.round(12*ease((f-168)/22));
 return <Stage>
  <div style={{position:'absolute',left:260,top:150,...rise(f,0,12,20)}}><Frame label={f<48?'GTM Engine / UGC / Creator Briefs':f<106?'GTM Engine / UGC / Edit Pipeline':f<166?'GTM Engine / Email Outreach':'GTM Engine / SEO / Programmatic Pages'} width={1400} height={720} badge={<span style={{fontSize:19,color:T.fg30}}>Example production configuration</span>}>

   <Sec f={f} at={0} out={42}>
    <div style={{position:'absolute',left:30,top:26,width:620}}>
     <Eyebrow>Creative brief</Eyebrow>
     {BRIEF.map(([tag,time,line,ratio],i)=><Card key={tag} style={{display:'flex',gap:18,alignItems:'center',padding:'16px 18px',marginTop:i?12:18,...rise(f,6+i*6,12,14)}}><Shot i={i*2} w={56} h={78} r={10}/><div style={{flex:1}}><div style={{display:'flex',gap:12,alignItems:'baseline'}}><span style={{fontSize:20,letterSpacing:2.4,textTransform:'uppercase',color:T.accentText,fontWeight:500}}>{tag}</span><span style={{fontSize:19,color:T.fg30}}>{time}</span></div><div style={{fontSize:23,marginTop:4}}>{line}</div></div><Tag>{ratio}</Tag></Card>)}
     <div style={{fontSize:21,color:T.muted,marginTop:18}}>Three cut-downs, three ratios, from one shoot.</div></div>
    <div style={{position:'absolute',left:690,top:26,width:680}}>
     <Eyebrow>Source footage · 6 selects</Eyebrow>
     <div style={{display:'flex',flexWrap:'wrap',gap:16,marginTop:18}}>{UGC_SHOTS.map((_,i)=><div key={i} style={rise(f,4+i*3,12,20)}><Shot i={i} w={212} h={268}/></div>)}</div></div>
   </Sec>

   <Sec f={f} at={48} out={104}>
    <div style={{position:'absolute',left:30,top:26,width:860}}>
     <Eyebrow>Asset library · this week</Eyebrow>
     <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:18,width:860}}>{Array.from({length:12},(_,i)=><div key={i} style={rise(f,48+i*2,12,16)}><Shot i={i} w={130} h={164} r={12}/></div>)}</div></div>
    <div style={{position:'absolute',left:930,top:26,width:440}}>
     <Card style={{padding:'22px 26px',...rise(f,52,12,12)}}><Eyebrow>Produce</Eyebrow><div style={{display:'flex',alignItems:'baseline',gap:12,marginTop:10}}><span style={{fontSize:84,fontWeight:500,letterSpacing:-3,fontVariantNumeric:'tabular-nums'}}>{assets}</span><span style={{fontSize:22,color:T.fg45}}>assets / week</span></div><div style={{fontSize:20,color:T.fg45,marginTop:4}}>AI and live UGC, cut into three ratios.</div></Card>
     <div style={{marginTop:22,...rise(f,72,10,8)}}><Eyebrow>Theme pages</Eyebrow></div>
     {THEME.map(([id,n,sub],i)=><Card key={n} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 16px',marginTop:10,...rise(f,76+i*6,12,12)}}><Logo id={id} size={28}/><span style={{fontSize:22}}>{n}</span><span style={{marginLeft:'auto',fontSize:19,color:T.fg45}}>{sub}</span></Card>)}
    </div>
   </Sec>

   <Sec f={f} at={106} out={160}>
    <div style={{position:'absolute',left:30,top:26,width:1340}}>
     <div style={{display:'flex',alignItems:'center',gap:14}}><Eyebrow>Outbound system · customised for this company</Eyebrow><span style={{marginLeft:'auto'}}><Pill on>Configured</Pill></span></div>
     <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:20}}>
      {[['linkedin','LinkedIn Outbound','Lead Discovery → Prospect Research → LinkedIn Activity → Personalisation → DM Generation'],['email','Email Outbound','Company Research → Buying Signals → Contact Discovery → Personalisation → Email Generation']].map(([id,n,flow],i)=><Card key={n} style={{padding:'20px 24px',...rise(f,107+i*6,12,14)}}><div style={{display:'flex',alignItems:'center',gap:12}}><Logo id={id as LogoId} size={28}/><span style={{fontSize:25}}>{n}</span><span style={{marginLeft:'auto'}}><Check/></span></div><div style={{fontSize:20,color:T.fg45,marginTop:12,lineHeight:1.5}}>{flow}</div></Card>)}
     </div>
     <div style={{display:'flex',gap:16,marginTop:16}}>{[['Day 0','LinkedIn DM'],['Day 2','Email'],['Day 6','LinkedIn reply'],['Day 10','Email'],['Day 14','Call ask']].map(([d,c],i)=><Card key={d} style={{flex:1,padding:'16px 18px',...rise(f,120+i*4,12,12)}}><div style={{fontSize:19,color:T.accentText}}>{d}</div><div style={{fontSize:22,marginTop:6}}>{c}</div></Card>)}</div>
     <div style={{fontSize:21,color:T.muted,marginTop:18,...rise(f,142,10,8)}}>Five touches per person. Every message reviewed by a human before it goes out.</div>
    </div>
   </Sec>

   <Sec f={f} at={166} out={999}>
    <div style={{position:'absolute',left:30,top:26,width:1340}}>
     <div style={{display:'flex',alignItems:'center',gap:14}}><Eyebrow>Inbound · pages built to capture</Eyebrow><span style={{marginLeft:'auto',display:'flex',alignItems:'baseline',gap:10}}><span style={{fontSize:44,fontWeight:500,letterSpacing:-1.5,fontVariantNumeric:'tabular-nums'}}>{pages}</span><span style={{fontSize:20,color:T.fg45}}>landing & store pages</span></span></div>
     <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginTop:18}}>{PAGES.map((p,i)=><Card key={p} style={{display:'flex',alignItems:'center',gap:12,padding:'16px 18px',...rise(f,168+i*2,10,10)}}><Logo id="google" size={22}/><span style={{fontSize:21,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p}</span></Card>)}</div>
     <div style={{display:'flex',gap:16,marginTop:16}}>{[['email','Lifecycle email','Onboarding, activation, win-back'],['meta','Retargeting','Warm audiences from the pages above']].map(([id,n,sub],i)=><Card key={n} style={{flex:1,display:'flex',alignItems:'center',gap:14,padding:'16px 20px',...rise(f,190+i*6,12,12)}}><Logo id={id as LogoId} size={28}/><span style={{fontSize:23}}>{n}</span><span style={{marginLeft:'auto',fontSize:19,color:T.fg45}}>{sub}</span></Card>)}</div>
    </div>
   </Sec>
  </Frame></div>
 </Stage>;
};
