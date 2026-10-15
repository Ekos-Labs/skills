import React from 'react';
import {Img,staticFile,useCurrentFrame} from 'remotion';
import {T,Stage,Frame,Card,Tag,Pill,Serif,H,Eyebrow,Logo,FolderIcon,FileIcon,Check,Cursor,HLine,ease,clamp,rise} from './kit';

/* 48.420 -> 51.900. "None of these results came from a playbook that we can just simply
   copy and paste." Type only, the way the site's philosophy section speaks. */
export const NoCopy=()=>{
 const f=useCurrentFrame();
 return <Stage>
  <div style={{position:'absolute',left:160,top:330,...rise(f,0,14,30)}}><H size={112}>Not a <Serif dim>playbook</Serif>.</H></div>
  <div style={{position:'absolute',left:160,top:470,...rise(f,50,14,30)}}><H size={112}>A <Serif>system</Serif>, built for one company.</H></div>
 </Stage>;
};

/* 67.440 -> 69.480. "…or run ads across Meta and ChatGPT." */
export const Ads=()=>{
 const f=useCurrentFrame();
 return <Stage>
  <div style={{position:'absolute',left:160,top:104}}><H size={62}>Launch the <Serif>right campaigns.</Serif></H></div>
  <div style={{position:'absolute',left:260,top:330,display:'flex',gap:28}}>{([['meta','Meta',0],['chatgpt','ChatGPT',10]] as const).map(([id,n,at])=><Card key={n} style={{width:686,padding:'36px 38px 34px',...rise(f,at,14,30)}}><div style={{display:'flex',alignItems:'center',gap:18}}><Logo id={id} size={52}/><span style={{fontSize:38,letterSpacing:-1}}>{n}</span><span style={{marginLeft:'auto'}}><Pill on>Configured</Pill></span></div>
   <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginTop:30}}>{['Creative','Audience','Measurement'].map((s,j)=><Card key={s} style={{padding:'58px 12px',textAlign:'center',fontSize:25,background:T.raised2,...rise(f,at+8+j*4,10,8)}}>{s}</Card>)}</div>
   <div style={{display:'flex',gap:10,marginTop:24}}>{['Same ICP','Same message','Same proof'].map(s=><Tag key={s}>{s}</Tag>)}</div><div style={{fontSize:21,color:T.muted,marginTop:26}}>Built from the same context as every other branch.</div></Card>)}</div>
 </Stage>;
};

/* 69.480 -> 72.700. "And all of this happens with AI and human both in the loop." */
export const Review=()=>{
 const f=useCurrentFrame(),approved=f>=78;
 return <Stage>
  <div style={{position:'absolute',left:160,top:104}}><H size={62}>AI drafts. <Serif>You decide.</Serif></H></div>
  <div style={{position:'absolute',left:260,top:290,width:760,...rise(f,0,14,24)}}><Frame label="AI Agents / Reply Agent" width={760} height={470}><div style={{padding:'28px 32px'}}>
   <div style={{display:'flex',alignItems:'center',gap:14}}><Logo id="claude" size={40}/><span style={{fontSize:26}}>Draft prepared</span><span style={{marginLeft:'auto'}}><Tag tone="accent">Ready for review</Tag></span></div>
   <div style={{fontSize:30,lineHeight:1.5,marginTop:26}}>{['Research summarised.','Lead qualified.','Personalised message written.'].map((l,i)=><div key={l} style={rise(f,8+i*6,10,8)}>{l}</div>)}</div>
   <div style={{display:'flex',gap:10,marginTop:28}}>{['Context checked','Signal attached','Score included'].map((s,i)=><span key={s} style={rise(f,28+i*4,10,6)}><Tag>{s}</Tag></span>)}</div></div></Frame></div>
  <div style={{position:'absolute',left:1060,top:290,width:600,...rise(f,30,14,24)}}><Card accent style={{padding:'30px 34px'}}>
   <Eyebrow color={T.accentText}>Human review</Eyebrow><div style={{fontSize:38,letterSpacing:-1,marginTop:14}}>You own the judgment.</div>
   <div style={{fontSize:23,color:T.muted,lineHeight:1.5,marginTop:18}}>Read the context.<br/>Approve the message.<br/>Keep the relationship.</div>
   <div style={{marginTop:30,height:64,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',gap:10,background:approved?T.accentSoft:'#fff',color:approved?T.accentText:'#000',fontSize:24,fontWeight:500}}>{approved?<><Check/> Approved</>:'Approve message'}</div>
  </Card></div>
  {f>=40&&<Cursor x={1520-(1520-1330)*ease((f-52)/22)} y={840-(840-560)*ease((f-52)/22)} click={f>=76&&f<84}/>}
 </Stage>;
};

/* 72.700 -> 78.860. "Once one channel works, the engine can expand to the next. So you can
   scale without rebuilding your growth from zero every time." */
const ADD:[string,'linkedin'|'email'|'meta',number][]=[['Founder content','linkedin',0],['Email outbound','email',41],['Paid distribution','meta',88]];
export const Scale=()=>{
 const f=useCurrentFrame(),n=f<41?0:f<88?1:2;
 return <Stage>
  <div style={{position:'absolute',left:160,top:104}}>{[<H key={0} size={62}>Start with <Serif>one working channel.</Serif></H>,<H key={1} size={62}>Add the <Serif>next branch.</Serif></H>,<H key={2} size={62}>Keep the foundation. <Serif>Expand the engine.</Serif></H>].map((h,i)=><div key={i} style={{position:'absolute',left:0,top:0,whiteSpace:'nowrap',opacity:i===n?ease((f-ADD[i][2])/10):0}}>{h}</div>)}</div>
  <div style={{position:'absolute',left:260,top:250,...rise(f,0,12,20)}}><Frame label="GTM Engine / Expansion" width={1400} height={620}>
   <div style={{position:'absolute',left:0,top:0,bottom:0,width:400,borderRight:`1px solid ${T.hair}`,padding:'26px 28px'}}>
    <div style={{display:'flex',alignItems:'center',gap:12}}><FolderIcon open size={28}/><span style={{fontSize:27}}>Context</span></div>
    {['Product','ICP','Tone of Voice','Customer journey'].map((v,i)=><div key={v} style={{display:'flex',alignItems:'center',gap:12,fontSize:23,color:T.fg70,marginTop:i?14:22,...rise(f,6+i*3,10,6)}}><FileIcon/>{v}</div>)}
    <div style={{marginTop:30}}><Tag tone="accent">Foundation retained</Tag></div>
   </div>
   <div style={{position:'absolute',left:430,top:26,right:30}}>
    <Eyebrow>Channels</Eyebrow>
    {ADD.map(([v,id,at],i)=><Card key={v} accent={n>=i} style={{display:'flex',alignItems:'center',gap:18,padding:'22px 26px',marginTop:i?14:18,...rise(f,at,14,24)}}><Logo id={id} size={36}/><span style={{fontSize:28}}>{v}</span><span style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:20,color:T.accentText}}>{i===0?'Working':'Added to the engine'}</span><Check/></span></Card>)}
    <div style={{fontSize:21,color:T.muted,marginTop:22,...rise(f,100,10,8)}}>Same context, same team, one more branch. Nothing rebuilt.</div>
   </div>
  </Frame></div>
 </Stage>;
};

/* 78.860 -> 84.080. "And we do not stop here. We are also building open source tools and
   products that help solo founders scale." Both products, as the site shows them. */
export const Products=()=>{
 const f=useCurrentFrame();
 return <Stage>
  <div style={{position:'absolute',left:160,top:104}}><H size={62}>Tools for <Serif>solo founders.</Serif></H></div>
  <div style={{position:'absolute',left:160,top:250,display:'flex',gap:40}}>
   {([['Pocket CMO','pocketcmo.online','products/pocket-cmo.png','Open source','emerald',10],['Remy','tryremy.online','products/remy.png','Join the waitlist','accent',60]] as const).map(([n,url,src,tag,tone,at])=><div key={n} style={{width:780,...rise(f,at,16,34)}}>
    <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:18}}><span style={{fontSize:38,letterSpacing:-1}}>{n}</span><span style={{fontSize:21,color:T.fg45}}>{url}</span><span style={{marginLeft:'auto'}}><Tag tone={tone}>{tag}</Tag></span></div>
    <div style={{borderRadius:22,overflow:'hidden',boxShadow:`inset 0 0 0 1px ${T.ring}`,background:T.raised}}><Img src={staticFile(src)} style={{width:'100%',display:'block'}}/></div>
   </div>)}
  </div>
 </Stage>;
};

/* 84.080 -> 89.000. "Presenting you all Ekos Labs." */
export const End=()=>{
 const f=useCurrentFrame(),a=ease(f/16),b=ease((f-14)/18),drift=1+.02*clamp(f/147);
 return <Stage style={{background:'#000'}}>
  <div style={{position:'absolute',left:895,top:408,width:130,height:116,opacity:a*(1-ease((f-22)/8)),transform:`scale(${.3+.7*a}) rotate(${-200+200*a}deg)`,filter:'drop-shadow(0 8px 30px rgba(54,99,255,.5))'}}><Img src={staticFile('brand/mark.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/></div>
  <div style={{position:'absolute',left:480,top:330,width:960,opacity:b,clipPath:`inset(0 ${50-50*b}% 0 ${50-50*b}%)`,transform:`scale(${drift})`}}><Img src={staticFile('brand/7.png')} style={{width:'100%',display:'block'}}/></div>
  <HLine x={760} y={640} w={400} f={f} at={30} dur={16} opacity={.5}/>
  <div style={{position:'absolute',top:690,width:'100%',textAlign:'center',fontSize:34,letterSpacing:-.6,...rise(f,38,14,10)}}>Custom GTM <Serif>engines & products</Serif> for founders.</div>
  <div style={{position:'absolute',top:760,width:'100%',textAlign:'center',fontSize:24,color:T.fg45,...rise(f,54,14,8)}}>ekoslabs.com</div>
 </Stage>;
};
