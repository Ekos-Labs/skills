import React from 'react';
import {Img,staticFile,useCurrentFrame} from 'remotion';
import {T,Stage,Frame,Card,Tag,Pill,Serif,H,Eyebrow,Logo,LogoTile,LogoId,FolderIcon,FileIcon,Chevron,Check,Count,UserIcon,Cursor,HLine,VLine,ease,clamp,rise} from './kit';

/* The engine, as the website draws it: gtm-engine.tsx's Finder tree, the team and agent
   rails with their accent hairlines, and engine-configs.tsx's per-ICP configuration.
   Same branches, same file names, same logos. */

type Branch={name:string;files:string[];logos?:LogoId[];icon?:'file'|'radar'};
const BRANCHES:Branch[]=[
 {name:'Context',icon:'file',files:['Business Context','Product','ICP','Competitors','Tone of Voice','Examples']},
 {name:'LinkedIn Outreach',logos:['linkedin'],files:['Lead Discovery','Prospect Research','LinkedIn Activity','Personalisation','DM Generation','Google Sheets']},
 {name:'Email Outreach',logos:['email'],files:['Company Research','Buying Signals','Contact Discovery','Personalisation','Email Generation','CSV Export']},
 {name:'SEO',logos:['google'],files:['Keyword Map','Comparison Pages','Programmatic Pages','Internal Links']},
 {name:'Content',logos:['linkedin','x'],files:['Post Bank','Hooks','Repurposing','Calendar']},
 {name:'UGC',logos:['instagram','youtube'],files:['Creator Briefs','Shot Lists','Edit Pipeline','Usage Rights']},
 {name:'AI Agents',logos:['openai','n8n'],files:['Research Agent','Scoring Agent','Reply Agent','Report Agent']},
 {name:'Competitor Analysis',icon:'radar',files:['Positioning Diff','Ad Library','Pricing Watch','Win/Loss Notes']},
];
const Radar=({size=22,color=T.fg30}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={{width:size,height:size,fill:'none',stroke:color,strokeWidth:1.6,strokeLinecap:'round',strokeLinejoin:'round',flexShrink:0}}><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34M4 6h.01M2.29 9.62A10 10 0 1 0 21.31 8.35M16.24 7.76A6 6 0 1 0 8.23 16.67M12 18h.01M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/><path d="m13.41 10.59 5.66-5.66"/></svg>;

/** One tree row in the site's grammar: chevron, accent folder, name, marks, count. */
const Row=({b,open=false,on=false,dim=false,check=false,f,at=0,height=56,size=24}:{b:Branch;open?:boolean;on?:boolean;dim?:boolean;check?:boolean;f:number;at?:number;height?:number;size?:number})=>
 <div style={{display:'flex',alignItems:'center',gap:14,height,padding:'0 14px',borderRadius:12,background:on?T.accentSoft:'transparent',opacity:dim?.35:1,...rise(f,at,12,0),transform:`translateX(${(1-ease((f-at)/12))*-12}px)`}}>
  <Chevron open={open}/><FolderIcon size={size} open={open}/><span style={{fontSize:size,color:on?T.fg:T.fg70,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.name}</span>
  <span style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}>{check&&<Check/>}{b.logos?.map(id=><Logo key={id} id={id} size={size*.85}/>)}{b.icon==='file'&&<FileIcon size={size*.85}/>}{b.icon==='radar'&&<Radar size={size*.85}/>}<Count n={b.files.length}/></span>
 </div>;

/* 23.340 -> 30.380. "But the real value is how we build it. We first understand your
   product, your problems, and how your customers actually buy. Then we choose the right
   channels." Context opens and its files light up on the words; then the channel
   branches are chosen. */
const CTX_HITS:[number,number][]=[[43,1],[98,0],[130,2]]; // frame, file index: Product, Business Context, ICP
const CHANNELS:[number,number][]=[[155,1],[170,2],[186,3]]; // frame, branch index
export const EngineTree=()=>{
 const f=useCurrentFrame(),open=f>=38&&f<152,choosing=f>=152;
 const hits=CTX_HITS.filter(([at])=>f>=at).map(([,i])=>i),chosen=CHANNELS.filter(([at])=>f>=at).map(([,i])=>i);
 const cx=f<20?1180:f<40?1180-(1180-560)*ease((f-20)/18):f<140?560:560+(150)*ease((f-140)/12);
 const cy=f<20?700:f<40?700-(700-352)*ease((f-20)/18):f<140?352:352+(56*1)*ease((f-140)/12);
 return <Stage>
  <div style={{position:'absolute',left:160,top:104}}><H size={62}>How we <Serif>build it.</Serif></H></div>
  <div style={{position:'absolute',left:420,top:248,...rise(f,0,14,30)}}>
   <Frame label="GTM Engine" width={1080} height={600} badge={<Pill on={choosing}>{choosing?'Choosing channels':'Building context'}</Pill>}>
    <div style={{position:'absolute',left:0,top:0,bottom:0,width:470,padding:'12px 10px',borderRight:`1px solid ${T.hair}`}}>
     {BRANCHES.map((b,i)=><Row key={b.name} b={b} f={f} at={4+i*3} open={i===0&&open} on={(i===0&&open)||chosen.includes(i)} check={chosen.includes(i)} dim={choosing&&!chosen.includes(i)&&i!==0}/>)}
    </div>
    <div style={{position:'absolute',left:500,top:24,right:30,bottom:24}}>
     {open?<>
      <div style={{display:'flex',alignItems:'center',gap:12,...rise(f,38,10,12)}}><FolderIcon open/><span style={{fontSize:27}}>Context</span><span style={{fontSize:22,color:T.fg30,marginLeft:6}}>6 files</span></div>
      {BRANCHES[0].files.map((n,j)=>{const hit=hits.includes(j);return <div key={n} style={{display:'flex',alignItems:'center',gap:14,height:66,padding:'0 16px',borderRadius:12,marginTop:j?4:16,background:hit?T.accentSoft:'transparent',...rise(f,42+j*3,10,8)}}><FileIcon color={hit?T.accentText:T.fg30}/><span style={{fontSize:25,color:hit?T.fg:T.fg45}}>{n}</span>{hit&&<span style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}><span style={{fontSize:20,color:T.accentText}}>{j===1?'What it helps people do':j===0?'Where growth breaks':'How they actually buy'}</span><Check/></span>}</div>})}
     </>:choosing?<>
      <div style={{...rise(f,152,10,12)}}><Eyebrow>Chosen for this company</Eyebrow></div>
      {CHANNELS.map(([at,i],k)=>{const b=BRANCHES[i];return <Card key={b.name} accent style={{display:'flex',alignItems:'center',gap:16,padding:'18px 22px',marginTop:k?12:22,...rise(f,at,12,18)}}><FolderIcon/><span style={{fontSize:26}}>{b.name}</span><span style={{marginLeft:'auto',display:'flex',gap:10,alignItems:'center'}}>{b.logos?.map(id=><Logo key={id} id={id} size={24}/>)}<Check/></span></Card>})}
      <div style={{fontSize:22,color:T.muted,marginTop:24,...rise(f,190,10,8)}}>Never all of them. The diagnosis picks.</div>
     </>:<div style={{fontSize:24,color:T.fg30,...rise(f,8,12,8)}}>Every branch ships with its own context, prompts and exports.</div>}
    </div>
   </Frame>
  </div>
  <Cursor x={cx} y={cy} click={(f>=40&&f<48)||(f>=152&&f<160)}/>
 </Stage>;
};

/* 30.380 -> 35.280. "…and build a strategy and systems around your company, alongside your
   founder, marketing, and tech." The website's engine section: Ekos above, the team on the
   left, the agents and tools on the right, wired with accent hairlines. */
const TEAM:[string,string,number][]=[['Founder','Approves the plan',62],['Marketing','Owns the message',123],['Tech','Ships the integrations',136]];
const POWERED:LogoId[]=['claude','openai','perplexity'],CONNECTS:LogoId[]=['hubspot','notion','slack','google'];
export const EngineTeam=()=>{
 const f=useCurrentFrame();
 const busTop=430,busBot=642,railTop=413,railBot=597;
 return <Stage>
  {/* Ekos, and the line down into the engine */}
  <div style={{position:'absolute',left:740,top:118,width:440,...rise(f,14,14,-16)}}><Card accent style={{display:'flex',alignItems:'center',gap:18,padding:'14px 22px',boxShadow:`inset 0 0 0 1px ${T.accentBorder}, 0 0 0 8px rgba(54,99,255,0.05)`}}><Img src={staticFile('brand/mark.png')} style={{width:52,height:46,objectFit:'contain'}}/><div><div style={{fontSize:17,letterSpacing:2.6,textTransform:'uppercase',color:T.fg30,fontWeight:500}}>Built & run by</div><div style={{fontSize:28,marginTop:2}}>Ekos Labs</div><div style={{fontSize:19,color:T.fg45,marginTop:2}}>with your founder, marketing & tech</div></div></Card></div>
  <VLine x={960} y={210} h={40} f={f} at={24}/>
  {/* elbow from the card to the team bus, as useBuilderLink draws it */}
  <svg width={1920} height={1080} style={{position:'absolute',left:0,top:0}}><path d="M740 160 H503 Q495 160 495 168 V430" fill="none" stroke={T.accent} strokeOpacity={.5} strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1-ease((f-56)/20)}/></svg>

  {/* your team */}
  <div style={{position:'absolute',left:120,top:376,width:310}}>
   <div style={{...rise(f,56,10,6)}}><Eyebrow>Your team</Eyebrow></div>
   {TEAM.map(([n,r,at],i)=><Card key={n} style={{display:'flex',alignItems:'center',gap:14,height:72,padding:'0 16px',marginTop:i?18:16,...rise(f,at,12,14)}}><span style={{width:40,height:40,borderRadius:10,background:'rgba(255,255,255,0.06)',display:'grid',placeItems:'center'}}><UserIcon/></span><span><div style={{fontSize:23}}>{n}</div><div style={{fontSize:18,color:T.fg45,marginTop:2}}>{r}</div></span></Card>)}
  </div>
  {TEAM.map(([n,,at],i)=><HLine key={n} x={430} y={busTop+6+i*90} w={65} f={f} at={at+6} opacity={.7}/>)}
  <VLine x={495} y={busTop} h={busBot-busTop} f={f} at={70}/>
  <HLine x={495} y={(busTop+busBot)/2} w={65} f={f} at={80} opacity={.9}/>

  {/* the engine */}
  <div style={{position:'absolute',left:560,top:250,...rise(f,0,12,16)}}><Frame label="GTM Engine" width={800} height={600}>
   <div style={{padding:'10px 12px'}}>{BRANCHES.map(b=><Row key={b.name} b={b} f={f+12} height={56} size={23}/>)}</div>
   <div style={{position:'absolute',left:0,right:0,bottom:0,height:50,borderTop:`1px solid ${T.hair}`,display:'flex',alignItems:'center',padding:'0 22px',fontSize:19,color:T.fg30}}>Every branch ships with its own context, prompts and exports.</div>
  </Frame></div>

  {/* powered by, connects with */}
  <HLine x={1360} y={550} w={40} f={f} at={36} opacity={.7}/>
  <VLine x={1400} y={railTop} h={railBot-railTop} f={f} at={44}/>
  <HLine x={1400} y={railTop} w={40} f={f} at={54} opacity={.7}/><HLine x={1400} y={railBot} w={40} f={f} at={58} opacity={.7}/>
  <div style={{position:'absolute',left:1440,top:322,width:380}}>
   <div style={{...rise(f,30,10,6)}}><Eyebrow>Powered by</Eyebrow></div>
   <div style={{display:'flex',gap:14,marginTop:14}}>{POWERED.map((id,i)=><div key={id} style={rise(f,34+i*3,12,10)}><LogoTile id={id} size={92}/></div>)}</div>
   <div style={{marginTop:36,...rise(f,44,10,6)}}><Eyebrow>Connects with</Eyebrow></div>
   <div style={{display:'flex',gap:14,marginTop:14}}>{CONNECTS.map((id,i)=><div key={id} style={rise(f,48+i*3,12,10)}><LogoTile id={id} size={78}/></div>)}</div>
   <div style={{fontSize:22,lineHeight:1.4,color:T.fg45,marginTop:30,...rise(f,66,12,8)}}>AI that runs the engine, <span style={{color:T.fg}}>plugged into the tools you already use.</span></div>
  </div>
 </Stage>;
};

/* 35.280 -> 38.120. "Because every company is different, so no two engines should look
   the same." engine-configs.tsx, cycled: what gets produced, where it goes, what captures
   it, what keeps the touchpoints going. Volumes are production commitments, never results. */
type Stagе={label:string;detail:string;value:string;unit:string;logos:LogoId[]};
const CONFIGS:{label:string;tags:[string,LogoId][];stages:Stagе[];touch:string}[]=[
 {label:'B2B SaaS',tags:[['LinkedIn Outbound','linkedin'],['Email Outbound','email'],['Founder Content','linkedin'],['Comparison Pages','google'],['Newsletter','email'],['Webinar Assets','youtube'],['ChatGPT Ads','chatgpt'],['Meta Ads','meta']],
  stages:[{label:'Produce',detail:'Comparison, AEO and webinar assets',value:'10',unit:'assets / week',logos:['google','linkedin']},{label:'Distribute',detail:'Founder cadence, search and paid',value:'5',unit:'channels',logos:['linkedin','google','email','meta','chatgpt']},{label:'Capture',detail:'Pages built to be cited and ranked',value:'20',unit:'pages',logos:['google']},{label:'Stay in touch',detail:'Sequences and newsletter',value:'4',unit:'touches',logos:['email','linkedin']}],touch:'Seven touchpoints before anyone books a call'},
 {label:'App / consumer tech',tags:[['UGC Campaigns','instagram'],['Creator Partnerships','youtube'],['Brand Content','x'],['Meta Ads','meta'],['ChatGPT Ads','chatgpt'],['Reddit Campaigns','reddit'],['Lifecycle Email','email'],['Store Listing SEO','google']],
  stages:[{label:'Produce',detail:'AI and live UGC',value:'150',unit:'assets / week',logos:['instagram','youtube']},{label:'Distribute',detail:'Posted daily, boosted with paid',value:'6',unit:'channels',logos:['instagram','youtube','reddit','meta','chatgpt']},{label:'Capture',detail:'Store listing and landing pages',value:'12',unit:'pages',logos:['google']},{label:'Stay in touch',detail:'Email and retargeting',value:'5',unit:'touches',logos:['email']}],touch:'Five touchpoints per person, off one month of creative'},
 {label:'Service business',tags:[['Local SEO','google'],['LinkedIn Outbound','linkedin'],['Email Outbound','email'],['Meta Ads','meta'],['ChatGPT Ads','chatgpt'],['Proof Content','instagram'],['Case Study Pages','google'],['Referral Sequences','email']],
  stages:[{label:'Produce',detail:'Proof, case studies and before-afters',value:'25',unit:'assets / week',logos:['instagram','youtube']},{label:'Distribute',detail:'Local search, founder cadence and paid',value:'6',unit:'channels',logos:['google','linkedin','email','meta','chatgpt']},{label:'Capture',detail:'Service pages and a booking flow',value:'20',unit:'pages',logos:['google']},{label:'Stay in touch',detail:'Follow-up and referral asks',value:'4',unit:'touches',logos:['email','linkedin']}],touch:'Six touchpoints between the first search and the booked call'},
];
const SWITCH=[0,30,58];
export const EngineConfigs=()=>{
 const f=useCurrentFrame(),active=SWITCH.reduce((a,t,i)=>f>=t?i:a,0),local=f-SWITCH[active],c=CONFIGS[active];
 const swap=active===0?1:clamp(local/8);
 return <Stage>
  <div style={{position:'absolute',left:160,top:104,right:160,display:'flex',alignItems:'flex-end',justifyContent:'space-between'}}>
   <H size={62}>Different company. <Serif>Different engine.</Serif></H>
   <div style={{display:'flex',gap:8,paddingBottom:10}}>{CONFIGS.map((o,i)=><span key={o.label} style={{padding:'9px 20px',borderRadius:999,fontSize:21,fontWeight:500,background:i===active?'#fff':'transparent',color:i===active?'#000':T.fg45}}>{o.label}</span>)}</div>
  </div>
  <div style={{position:'absolute',left:260,top:236,...rise(f,0,12,20)}}><Frame label={`Engine configuration · ${c.label}`} width={1400} height={600} badge={<span style={{fontSize:19,color:T.fg30}}>Volumes are what the engine is built to produce, not client results</span>}>
   <div style={{opacity:swap,transform:`translateY(${(1-swap)*8}px)`}}>
    <div style={{padding:'18px 26px 0',fontSize:21,color:T.fg45}}>The diagnosis picks which of these you need. Never all of them.</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,padding:'14px 26px 20px',borderBottom:`1px solid ${T.hair}`}}>{c.tags.map(([t,id],i)=><Card key={t} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 18px',...rise(local,i*2,10,6)}}><Logo id={id} size={26}/><span style={{fontSize:22,letterSpacing:-.3}}>{t}</span></Card>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 36px 1fr 36px 1fr 36px 1fr',padding:'20px 26px 0',alignItems:'stretch'}}>{c.stages.map((s,i)=><React.Fragment key={s.label}>{i>0&&<div style={{alignSelf:'center',height:1,background:T.accent,opacity:.5,transform:`scaleX(${ease((local-8-i*4)/8)})`,transformOrigin:'left'}}/>}<Card style={{padding:'18px 20px',...rise(local,4+i*3,10,10)}}><Eyebrow>{s.label}</Eyebrow><div style={{display:'flex',alignItems:'baseline',gap:10,marginTop:12}}><span style={{fontSize:44,letterSpacing:-1.5,fontVariantNumeric:'tabular-nums'}}>{s.value}</span><span style={{fontSize:20,color:T.fg45}}>{s.unit}</span></div><div style={{fontSize:20,color:T.fg45,marginTop:8,lineHeight:1.35}}>{s.detail}</div><div style={{display:'flex',gap:10,marginTop:12}}>{s.logos.map(id=><Logo key={id} id={id} size={20}/>)}</div></Card></React.Fragment>)}</div>
    <div style={{padding:'26px 26px 0',fontSize:26,letterSpacing:-.4}}>{c.touch}</div>
   </div>
  </Frame></div>
 </Stage>;
};
