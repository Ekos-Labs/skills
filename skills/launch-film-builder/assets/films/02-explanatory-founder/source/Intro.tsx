import React from 'react';
import {Img,staticFile,useCurrentFrame} from 'remotion';
import {T,Stage,Frame,Card,Tag,Pill,Serif,H,Eyebrow,Logo,FileIcon,Check,Cursor,ease,clamp,rise,retire} from './kit';
import {UGC_SHOTS} from './media';

/* 16.000 -> 23.340. "The engine can understand your ICP, find real buying signals, run
   outbound, create content, and track what is actually working." Five beats on the word
   timings. Each panel retires behind the next; only one retired panel stays visible. */

const BEATS=[
 {at:0,short:'ICP',label:'GTM Engine / Context / ICP'},
 {at:84,short:'Signals',label:'GTM Engine / Email Outreach / Buying Signals'},
 {at:126,short:'Outbound',label:'GTM Engine / LinkedIn Outreach / DM Generation'},
 {at:152,short:'Content',label:'GTM Engine / UGC / Edit Pipeline'},
 {at:176,short:'Measure',label:'GTM Engine / AI Agents / Report Agent'},
];
const row:React.CSSProperties={display:'flex',alignItems:'center',gap:20,padding:'20px 26px',marginTop:14};

const Detail=({i,f}:{i:number;f:number})=>{
 if(i===0)return <>
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><Eyebrow>Ideal customer profile</Eyebrow><Pill on>Company context</Pill></div>
  <div style={{fontSize:40,letterSpacing:-1.2,marginTop:16}}>Who the product is built for.</div>
  {[['Who','Seed-stage developer tools'],['Need','A repeatable way to reach buyers'],['Where','Developer communities and search']].map(([k,v],j)=><Card key={k} style={{...row,...rise(f,10+j*7,12,20)}}><span style={{width:110,fontSize:20,letterSpacing:2.5,textTransform:'uppercase',color:T.fg30,fontWeight:500}}>{k}</span><span style={{fontSize:27}}>{v}</span><span style={{marginLeft:'auto'}}><Check/></span></Card>)}
 </>;
 if(i===1)return <>
  <div style={{display:'flex',alignItems:'center',gap:16}}><Logo id="linkedin" size={34}/><span style={{fontSize:30}}>Company activity</span><span style={{marginLeft:'auto'}}><Pill on>New signal</Pill></span></div>
  <Card accent style={{padding:'30px 32px',marginTop:24,...rise(f,4,10,16)}}><Eyebrow color={T.accentText}>Hiring signal</Eyebrow><div style={{fontSize:46,letterSpacing:-1.4,marginTop:14}}>First growth hire.</div><div style={{fontSize:26,color:T.muted,marginTop:12}}>A new role. A new distribution need.</div></Card>
  <Card style={{...row,...rise(f,14,10,16)}}><FileIcon/><span style={{fontSize:26}}>Attach the source to the lead record</span><span style={{marginLeft:'auto'}}><Check/></span></Card>
 </>;
 if(i===2)return <>
  <div style={{display:'flex',alignItems:'center',gap:16}}><Logo id="linkedin" size={34}/><span style={{fontSize:30}}>Message prepared from context</span></div>
  <Card style={{padding:'30px 34px',marginTop:24,fontSize:31,lineHeight:1.5,...rise(f,3,10,16)}}>Saw you're hiring your first growth lead.<br/><span style={{color:T.muted}}>Here's where a repeatable outbound system helps.</span></Card>
  <div style={{display:'flex',gap:12,marginTop:22}}>{['Signal attached','Personalised','Reviewed before sending'].map((s,j)=><span key={s} style={rise(f,10+j*4,10,12)}><Tag>{s}</Tag></span>)}</div>
 </>;
 if(i===3)return <>
  <div style={{display:'flex',gap:20}}>{['Hook','Product story','Call to action'].map((s,j)=><Card key={s} style={{flex:1,overflow:'hidden',...rise(f,j*4,12,30)}}><Img src={staticFile(UGC_SHOTS[j])} style={{width:'100%',height:300,objectFit:'cover',display:'block',filter:'blur(3.5px)',transform:'scale(1.06)'}}/><div style={{padding:'16px 20px',fontSize:24}}>{s}</div></Card>)}</div>
  <div style={{display:'flex',gap:12,marginTop:22}}><Tag tone="accent">UGC</Tag><Tag>Theme pages</Tag><Tag>Repurposed cuts</Tag></div>
 </>;
 return <>
  <div style={{display:'flex',alignItems:'center'}}><span style={{fontSize:30}}>What actually worked</span><span style={{marginLeft:'auto'}}><Pill on>Weekly report</Pill></span></div>
  {[['LinkedIn outbound','Qualified replies','Kept'],['Theme pages','Engaged visitors','Kept'],['Reddit campaign','No customer actions','Cut']].map(([c,m,s],j)=><Card key={c} style={{...row,...rise(f,6+j*5,12,18)}}><span style={{width:300,fontSize:27}}>{c}</span><span style={{fontSize:24,color:T.muted}}>{m}</span><span style={{marginLeft:'auto'}}><Tag tone={s==='Kept'?'accent':'neutral'}>{s}</Tag></span></Card>)}
  <div style={{fontSize:23,color:T.muted,marginTop:22}}>The result decides what gets built next.</div>
 </>;
};

export const Intro=()=>{
 const f=useCurrentFrame(),active=BEATS.reduce((a,b,i)=>f>=b.at?i:a,0);
 return <Stage>
  <div style={{position:'absolute',left:160,top:104}}><H size={62}>A growth engine <Serif>around your business.</Serif></H></div>
  {BEATS.map((b,i)=>{if(f<b.at||i<active-1)return null;const next=BEATS[i+1]?.at??9999,out=ease((f-next)/12),a=i===0?1:ease((f-b.at)/12);
   return <div key={b.short} style={{position:'absolute',left:420,top:248,...(out>0?retire(out,-250,-56,.86,.3):{opacity:a,transform:`translateY(${(1-a)*34}px)`}),transformOrigin:'left top',zIndex:i}}>
    <Frame label={b.label} width={1080} height={600} badge={<span style={{fontSize:19,color:T.fg30}}>Illustrative workflow</span>}><div style={{padding:'28px 34px'}}><Detail i={i} f={f-b.at}/></div></Frame></div>;})}
  <div style={{position:'absolute',left:420,top:876,display:'flex',gap:34}}>{BEATS.map((b,i)=><div key={b.short} style={{display:'flex',alignItems:'center',gap:12,fontSize:22,color:i===active?T.fg:T.fg30}}><span style={{width:8,height:8,borderRadius:8,background:i<=active?T.accent:'rgba(255,255,255,0.12)'}}/>{b.short}</div>)}</div>
  {active===1&&<Cursor x={1405} y={652+(clamp((f-100)/8))*0} click={f>108&&f<116}/>}
 </Stage>;
};
