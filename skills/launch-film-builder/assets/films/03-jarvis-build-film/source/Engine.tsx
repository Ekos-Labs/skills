import React from 'react';
import {T,SANS,ease,Frame,Card,Pill,Logo,FileIcon,Check,Cursor} from '../v3/kit';
import {Speak,Sender} from './parts';

/* The engine at work, told as Ekos's own status messages. `t` is seconds since the engine
   section starts (film 33.6). Negative t is the idle screen seen on the laptop before the
   camera pushes in, so the hand-off from laptop to full frame is the same picture.
   Sized for a phone: nothing a viewer must read is under 32 px on the 1920 canvas. */

export const ENGINE_START=33.6;
export const TASKS=[
 {at:0.0,say:'Learning your business.',label:'Context'},
 {at:3.4,say:'Found 23 people ready to buy.',label:'Buyers'},
 {at:8.0,say:'Wrote to all 23. Waiting for your okay.',label:'Outbound'},
 {at:12.8,say:"Tomorrow's posts are ready.",label:'Content'},
 {at:15.6,say:"Here's what worked this week.",label:'This week'},
];

const P={x:140,y:330,w:1640,h:680};

/** The kit's Tag at film scale. */
const BigTag=({children,tone='neutral'}:{children:React.ReactNode;tone?:'neutral'|'accent'})=>
 <span style={{display:'inline-flex',alignItems:'center',padding:'10px 20px',borderRadius:12,fontSize:30,fontWeight:500,whiteSpace:'nowrap',
  background:tone==='accent'?T.accentSoft:'rgba(255,255,255,0.06)',color:tone==='accent'?T.accentText:T.fg70}}>{children}</span>;

export const EngineUI=({t}:{t:number})=>{
 const f=Math.round(t*30);
 let i=-1;TASKS.forEach((k,j)=>{if(t>=k.at)i=j;});
 const task=i>=0?TASKS[i]:null;
 const local=task?t-task.at:0;
 const caret=Math.floor(f/15)%2===0;
 return <div style={{position:'absolute',left:0,top:0,width:1920,height:1080,background:T.bg,color:T.fg,fontFamily:SANS,overflow:'hidden',isolation:'isolate'}}>
  <div style={{position:'absolute',left:P.x,top:96}}><Sender size={30}/></div>
  <div style={{position:'absolute',left:P.x,top:162,width:P.w}}>
   {task?<Speak key={i} text={task.say} at={0} f={Math.round(local*30)} size={92} gap={2}/>
    :<div style={{width:5,height:92,background:T.fg70,opacity:caret?1:0}}/>}
  </div>
  <Frame label={task?task.label:'Context'} width={P.w} height={P.h} style={{position:'absolute',left:P.x,top:P.y}} badge={<Pill>Example</Pill>}>
   {i===0&&<Context t={local}/>}
   {i===1&&<Buyers t={local}/>}
   {i===2&&<Outbound t={local}/>}
   {i===3&&<Posts t={local}/>}
   {i===4&&<Week t={local}/>}
  </Frame>
 </div>;
};

const fadeUp=(t:number,at:number,dur=.3,dy=18):React.CSSProperties=>{const a=ease((t-at)/dur);return {opacity:a,transform:`translateY(${(1-a)*dy}px)`};};

const Context=({t}:{t:number})=>{
 const rows=[['Product','What it does, who it is for'],['Customers','Who buys and why'],['How they buy','Where they look, who decides'],['Competitors','Who else they consider'],['Tone of voice','How you sound']];
 return <div style={{padding:'28px 56px 0'}}>
  {rows.map(([n,d],k)=>{const at=.5+k*.42;const done=t>=at;const c=ease((t-at)/.18);
   return <div key={n} style={{display:'flex',alignItems:'center',height:110,borderTop:k?`1px solid ${T.hair}`:'none',...fadeUp(t,.1+k*.1)}}>
    <FileIcon size={38} color={done?T.fg70:T.fg30}/>
    <span style={{marginLeft:26,width:470,fontSize:48,letterSpacing:-1,color:done?T.fg:T.fg70}}>{n}</span>
    <span style={{fontSize:36,color:T.fg45}}>{d}</span>
    <div style={{flex:1}}/>
    <div style={{opacity:c,transform:`scale(${.7+.3*c})`}}><Check size={46}/></div>
   </div>;})}
 </div>;
};

const Buyers=({t}:{t:number})=>{
 const rows:[string,string,'linkedin'|'reddit'|'producthunt'][]=[
  ['Fintech, Berlin','Raised seed last week','linkedin'],
  ['Dev tools, London','Hiring first marketer','linkedin'],
  ['Design tool, Lisbon','Launched on Product Hunt','producthunt'],
  ['Field service app, Amsterdam','Asked for tool advice','reddit'],
 ];
 const n=Math.round(23*ease((t-.1)/2.2));
 return <div style={{padding:'26px 56px 0'}}>
  <div style={{display:'flex',alignItems:'baseline',gap:22,height:150}}>
   <span style={{fontSize:132,fontWeight:500,letterSpacing:-5,lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{n}</span>
   <span style={{fontSize:40,color:T.fg45}}>ready to buy, found overnight</span>
  </div>
  {rows.map(([co,sig,src],k)=><div key={co} style={{display:'flex',alignItems:'center',height:108,borderTop:`1px solid ${T.hair}`,...fadeUp(t,.25+k*.3)}}>
   <Logo id={src} size={46}/>
   <span style={{marginLeft:30,width:760,fontSize:44,letterSpacing:-.8}}>{co}</span>
   <BigTag tone="accent">{sig}</BigTag>
  </div>)}
 </div>;
};

const Outbound=({t}:{t:number})=>{
 const clickAt=2.4;const clicked=t>=clickAt;
 const path=ease((t-1.35)/.95);
 const cx=1520+(1372-1520)*path,cy=560+(300-560)*path;
 return <div style={{position:'absolute',inset:0}}>
  <Card style={{position:'absolute',left:40,top:30,width:1060,height:556,padding:'34px 44px',...fadeUp(t,.1)}}>
   <div style={{display:'flex',fontSize:32,color:T.fg45,marginBottom:10}}><span style={{width:150}}>To</span><span style={{color:T.fg70}}>Lena, founder, fintech in Berlin</span></div>
   <div style={{display:'flex',fontSize:32,color:T.fg45,paddingBottom:24,borderBottom:`1px solid ${T.hair}`}}><span style={{width:150}}>Subject</span><span style={{color:T.fg70}}>Congrats on the round</span></div>
   <div style={{fontSize:42,lineHeight:1.38,letterSpacing:-.6,marginTop:26}}>Hi Lena, saw you just raised. Teams your size lose a day a week to invoicing. We fix that in an afternoon. Worth a look?</div>
  </Card>
  <div style={{position:'absolute',left:1140,top:30,width:460,...fadeUp(t,.3)}}>
   <div style={{fontSize:132,fontWeight:500,letterSpacing:-5,lineHeight:1}}>23</div>
   <div style={{fontSize:34,color:T.fg45,margin:'14px 0 40px'}}>one per person</div>
   <div style={{height:112,borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',gap:14,fontSize:40,fontWeight:500,
    background:clicked?T.accentSoft:T.accent,color:clicked?T.accentText:'#fff',boxShadow:clicked?`inset 0 0 0 1px ${T.accentBorder}`:'none',
    transform:`scale(${t>=clickAt&&t<clickAt+.12?.97:1})`}}>
    {clicked?<><Check size={40}/>Approved</>:'Approve all'}
   </div>
   <div style={{height:112,marginTop:20,borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,color:T.fg70,boxShadow:`inset 0 0 0 1px ${T.ring}`}}>Edit first</div>
  </div>
  {t>1.2&&<Cursor x={cx} y={cy} click={t>=clickAt-.04&&t<clickAt+.12}/>}
 </div>;
};

const Posts=({t}:{t:number})=>{
 const posts:['linkedin'|'x',string,string][]=[
  ['linkedin','We almost gave up on outbound.','Then we wrote to the right 20, not everyone.'],
  ['x','3 things our first 100 users told us.','None were about features.'],
  ['linkedin','What a zero budget launch taught us.','Price was never the problem.'],
 ];
 return <div style={{display:'flex',gap:30,padding:'30px 40px'}}>
  {posts.map(([src,head,body],k)=><Card key={head} style={{width:500,height:556,padding:'38px 40px',position:'relative',...fadeUp(t,.12+k*.22)}}>
   <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:38}}><Logo id={src} size={50}/><BigTag tone="accent">Tomorrow 9:00</BigTag></div>
   <div style={{fontSize:48,lineHeight:1.14,letterSpacing:-1.2,marginBottom:24}}>{head}</div>
   <div style={{fontSize:36,lineHeight:1.35,color:T.fg45}}>{body}</div>
  </Card>)}
 </div>;
};

const Week=({t}:{t:number})=>{
 const stats:[number|string,string][]=[[31,'replies'],[6,'calls booked'],['LinkedIn','worked best']];
 return <div style={{padding:'30px 40px'}}>
  <div style={{display:'flex',gap:30}}>
   {stats.map(([v,l],k)=>{const a=ease((t-.15-k*.2)/.9);const num=typeof v==='number';
    return <Card key={l} style={{width:500,height:380,padding:'44px 46px',display:'flex',flexDirection:'column',justifyContent:'space-between',...fadeUp(t,.1+k*.2)}}>
     <div style={{fontSize:num?200:116,fontWeight:500,letterSpacing:num?-8:-4,lineHeight:.9,fontVariantNumeric:'tabular-nums'}}>{num?Math.round((v as number)*a):v}</div>
     <div style={{fontSize:42,color:T.fg45}}>{l}</div>
    </Card>;})}
  </div>
  <div style={{display:'flex',alignItems:'center',gap:20,marginTop:52,fontSize:44,letterSpacing:-.8,color:T.fg70,...fadeUp(t,.9)}}>
   <span style={{color:T.accentText}}>Next week:</span>more founder posts, fewer cold emails.
  </div>
 </div>;
};
