import React from 'react';
import {useCurrentFrame} from 'remotion';
import {T,Stage,Cam,Frame,Card,Tag,Pill,Eyebrow,Logo,FolderIcon,FileIcon,Check,Cursor,ease,clamp,rise,easeIO} from './kit';

/* 51.900 -> 58.420. "Each came from a system that I designed for that specific founder and
   company and the people that it needed to reach." The LinkedIn Outreach branch, run once:
   the branch completes step by step, a lead is opened, a message is written from its
   context, a sequence is set, and the record goes to a person for review.
   Identifiers are fictional (Lead 011–016). Nothing claims to have been sent. */

const STEPS=['Lead Discovery','Prospect Research','LinkedIn Activity','Personalisation','DM Generation','Google Sheets'];
const LEADS:[string,string,string,string][]=[['011','Dev tools','Posted 3× this week','78'],['012','Fintech','Announced a funding round','84'],['013','Analytics SaaS','Viewed pricing twice','88'],['014','B2B SaaS','Hiring first growth lead','96'],['015','Retail tech','Commented on a competitor','71'],['016','CRM platform','Job post mentions GTM','82']];
const DRAFT='Hiring your first growth lead usually means someone inherits a blank distribution system. Happy to send the outbound build we would hand that person.';
const TOUCH:[string,string,string,'linkedin'|'email'][]=[['Day 0','LinkedIn DM','The opening above','linkedin'],['Day 2','Email','Two-page build outline','email'],['Day 6','LinkedIn','Reply under their hiring post','linkedin']];

export const Outbound=()=>{
 const f=useCurrentFrame();
 const sel=f>=52,opened=ease((f-58)/12),drafting=f>=98,typed=DRAFT.slice(0,Math.round(clamp((f-104)/40)*DRAFT.length)),seq=ease((f-146)/12),review=ease((f-172)/12);
 // one slow push in on the working area, then a settle back out for the review row
 const s=1+.06*easeIO((f-40)/40)-.06*easeIO((f-165)/20),cx=960+40*easeIO((f-60)/30)-40*easeIO((f-165)/20),cy=540+20*easeIO((f-60)/30)-20*easeIO((f-165)/20);
 return <Stage><Cam s={s} x={cx} y={cy}>
  <div style={{position:'absolute',left:260,top:150,...rise(f,0,12,20)}}><Frame label="GTM Engine / LinkedIn Outreach" width={1400} height={720} badge={<Pill on={drafting}>{review>.5?'Human review':drafting?'Writing':'Running'}</Pill>}>
   {/* the branch, completing one file at a time */}
   <div style={{position:'absolute',left:0,top:0,bottom:0,width:380,borderRight:`1px solid ${T.hair}`,padding:'22px 24px'}}>
    <div style={{display:'flex',alignItems:'center',gap:12}}><FolderIcon open/><span style={{fontSize:25}}>LinkedIn Outreach</span></div>
    {STEPS.map((n,i)=>{const done=f>=18+i*9;return <div key={n} style={{display:'flex',alignItems:'center',gap:12,height:58,marginTop:i?2:14,...rise(f,6+i*3,10,8)}}>{i===5?<Logo id="google" size={22}/>:<FileIcon color={done?T.accentText:T.fg30}/>}<span style={{fontSize:23,color:done?T.fg:T.fg45}}>{n}</span><span style={{marginLeft:'auto',opacity:done?1:0}}><Check size={20}/></span></div>})}
    <div style={{position:'absolute',left:24,bottom:22,fontSize:19,color:T.fg30}}>Runs daily · writes to Google Sheets</div>
   </div>

   {/* the lead table, dimmed once one record is open */}
   <div style={{position:'absolute',left:410,top:22,width:960,opacity:(1-.7*opened)*(1-review)}}>
    <div style={{display:'flex',alignItems:'baseline',gap:12}}><span style={{fontSize:25}}>Lead Discovery</span><span style={{fontSize:21,color:T.fg45}}>6 new signals · sorted by score</span></div>
    <div style={{display:'flex',height:40,alignItems:'center',marginTop:8,borderBottom:`1px solid ${T.hair}`}}>{[['Lead',110],['Company',230],['Signal',380],['Score',0]].map(([t,w])=><span key={t as string} style={{width:w as number||'auto',fontSize:18,letterSpacing:2.4,textTransform:'uppercase',color:T.fg30,fontWeight:500}}>{t}</span>)}</div>
    {LEADS.map((L,i)=>{const on=sel&&i===3;return <div key={L[0]} style={{display:'flex',alignItems:'center',height:56,padding:'0 10px',marginLeft:-10,borderRadius:10,background:on?T.accentSoft:'transparent',borderBottom:`1px solid ${T.hair}`,opacity:sel&&!on?.35:1,...rise(f,12+i*3,10,10)}}>
     <span style={{width:100,fontSize:22,fontVariantNumeric:'tabular-nums'}}>{L[0]}</span><span style={{width:230,fontSize:22,color:T.fg70}}>{L[1]}</span><span style={{width:380,fontSize:21,color:T.muted}}>{L[2]}</span><Tag tone={Number(L[3])>=90?'accent':'neutral'}>{L[3]}</Tag></div>})}
   </div>
   {f>=34&&f<60&&<Cursor x={1030-(1030-470)*ease((f-34)/14)} y={100+(300-100)*ease((f-34)/14)} click={f>=50&&f<58}/>}

   {/* the opened record */}
   {f>=58&&<div style={{position:'absolute',left:410,top:60,width:520,opacity:opened*(1-review),transform:`translateY(${(1-opened)*20}px)`}}><Card accent style={{padding:'22px 26px'}}>
    <div style={{display:'flex',alignItems:'center',gap:12}}><Eyebrow>Lead 014</Eyebrow><Tag tone="accent">96</Tag></div>
    <div style={{fontSize:34,letterSpacing:-1,marginTop:10}}>B2B SaaS</div><div style={{fontSize:20,color:T.fg45,marginTop:2}}>Example prospect · Series A · 40 to 80 staff</div>
    <Card style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',marginTop:18,...rise(f,66,10,8)}}><Logo id="linkedin" size={24}/><span style={{fontSize:23}}>Hiring first growth lead</span><span style={{marginLeft:'auto',fontSize:18,color:T.fg30}}>2d ago</span></Card>
    {['Careers page lists two GTM roles','No marketing lead on the team page','Founder posts weekly about hiring'].map((s,i)=><div key={s} style={{display:'flex',gap:10,fontSize:21,color:T.fg70,marginTop:10,...rise(f,72+i*5,10,6)}}><span style={{color:T.accentText}}>·</span>{s}</div>)}
   </Card></div>}

   {/* the message, written from that context, then the sequence around it */}
   {drafting&&<div style={{position:'absolute',left:960,top:60,width:410,opacity:1-review,transform:`translateX(${(1-ease((f-98)/12))*24}px)`}}>
    <Card style={{padding:'20px 24px',opacity:1-seq,transform:`scale(${1-.04*seq})`,transformOrigin:'top left'}}>
     <div style={{display:'flex',alignItems:'center',gap:10}}><Logo id="claude" size={24}/><span style={{fontSize:23}}>DM Generation</span><span style={{marginLeft:'auto'}}><Tag tone="accent">Personalised</Tag></span></div>
     <div style={{fontSize:22,lineHeight:1.45,color:T.fg,marginTop:14,minHeight:190}}>{typed}<span style={{display:'inline-block',width:2,height:22,marginLeft:2,verticalAlign:'-3px',background:Math.floor(f/8)%2?T.accentText:'transparent'}}/></div>
     <div style={{fontSize:18,color:T.fg30,marginTop:12}}>Written from LinkedIn Activity + Prospect Research</div>
    </Card>
    {f>=144&&<div style={{position:'absolute',left:0,top:0,width:410,opacity:seq,transform:`translateY(${(1-seq)*16}px)`}}>
     <Eyebrow>Sequence · three touches</Eyebrow>
     {TOUCH.map(([d,ch,line,id],i)=><Card key={d} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',marginTop:12,...rise(f,148+i*6,10,12)}}><Logo id={id} size={26}/><div><div style={{fontSize:22}}>{ch}</div><div style={{fontSize:18,color:T.fg45,marginTop:2}}>{line}</div></div><span style={{marginLeft:'auto',fontSize:20,color:T.accentText}}>{d}</span></Card>)}
    </div>}
   </div>}

   {/* the record leaves the queue for a person */}
   {f>=168&&<div style={{position:'absolute',left:410,top:60,width:960,opacity:review,transform:`translateY(${(1-review)*16}px)`}}>
    <div style={{display:'flex',gap:0}}>{[['Queued','2'],['Drafted','3'],['Human review','1']].map(([n,c],i)=><div key={n} style={{flex:1,borderLeft:i?`1px solid ${T.hair}`:'none',padding:'0 22px'}}><Eyebrow color={i===2?T.accentText:T.fg30}>{n} · {c}</Eyebrow>
     {i===2&&<Card accent style={{display:'flex',alignItems:'center',gap:12,padding:'14px 18px',marginTop:18,...rise(f,178,12,14)}}><span style={{fontSize:23}}>Lead 014</span><span style={{marginLeft:'auto'}}><Check/></span></Card>}
     {i===1&&<Card style={{display:'flex',alignItems:'center',gap:12,padding:'14px 18px',marginTop:18,opacity:1-ease((f-176)/10)}}><span style={{fontSize:23,color:T.fg70}}>Lead 014</span><span style={{marginLeft:'auto',fontSize:22,color:T.fg30}}>→</span></Card>}
     {i===0&&['Lead 012','Lead 016'].map(l=><Card key={l} style={{padding:'14px 18px',marginTop:18,fontSize:23,color:T.fg45}}>{l}</Card>)}
    </div>)}</div>
    <div style={{fontSize:26,letterSpacing:-.4,marginTop:40,...rise(f,184,10,8)}}>You approve every message before it goes out.</div>
   </div>}
  </Frame></div>
 </Cam></Stage>;
};
