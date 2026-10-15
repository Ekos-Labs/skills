import React from 'react';
import {Img,staticFile} from 'remotion';
import {T,SANS,SERIF,ease,clamp} from '../v3/kit';

/* Vertical (1080x1920) primitives for the Finder reel. Tokens, easing and the one-accent
   rule come from v3/kit.tsx, which mirrors the website. Only the type scale and the surface
   geometry are re-cut here: a 1080-wide frame needs roughly 1.6x the type of the 1920 film,
   and panels are full-bleed columns instead of side-by-side cards.
   Rules carried over: no Z rotation, no blur, no glass, no progress bars, one accent. */

export const W=1080,HGT=1920;
/** Mobile-safe box. Nothing that must be read leaves it. */
export const SAFE={x:80,w:920,top:150,bottom:1560};
export const CAPTION_TOP=1610;

export {T,SANS,SERIF,ease,clamp};

/* Type */
export const Serif=({children}:{children:React.ReactNode})=><span style={{fontFamily:SERIF,fontStyle:'italic',fontWeight:400}}>{children}</span>;
export const Title=({children,size=84,color=T.fg,align='left'}:{children:React.ReactNode;size?:number;color?:string;align?:'left'|'center'})=>
 <div style={{fontFamily:SANS,fontSize:size,lineHeight:1.04,fontWeight:400,letterSpacing:size*-.035,color,textAlign:align}}>{children}</div>;
export const Label=({children,color=T.fg30}:{children:React.ReactNode;color?:string})=>
 <div style={{fontSize:22,letterSpacing:3.4,textTransform:'uppercase',color,fontWeight:500}}>{children}</div>;
export const Body=({children,size=30,color=T.muted,align='left'}:{children:React.ReactNode;size?:number;color?:string;align?:'left'|'center'})=>
 <div style={{fontSize:size,lineHeight:1.4,color,textAlign:align}}>{children}</div>;
export const Micro=({children,color=T.faint}:{children:React.ReactNode;color?:string})=>
 <div style={{fontSize:20,lineHeight:1.4,color}}>{children}</div>;

/* Motion */
export const rise=(f:number,at=0,dur=14,dy=28):React.CSSProperties=>{const a=ease((f-at)/dur);return {opacity:a,transform:`translateY(${(1-a)*dy}px)`};};
/** Send a panel up and behind the next one. Dim and shrink, never blur. */
export const recede=(b:number,dy=-120,scale=.9,dim=.22):React.CSSProperties=>
 ({opacity:1-b*(1-dim),transform:`translateY(${dy*b}px) scale(${1-b*(1-scale)})`});

/* Surfaces */
export const Stage=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=>
 <div style={{position:'absolute',inset:0,background:T.bg,color:T.fg,fontFamily:SANS,overflow:'hidden',...style}}>{children}</div>;
export const Sheet=({label,badge,width=SAFE.w,height,children,style={}}:{label:string;badge?:React.ReactNode;width?:number;height:number;children:React.ReactNode;style?:React.CSSProperties})=>
 <div style={{position:'relative',width,height,borderRadius:32,background:T.frame,boxShadow:`inset 0 0 0 1px ${T.ring}, 0 50px 110px -50px rgba(0,0,0,.95)`,overflow:'hidden',...style}}>
  <div style={{height:80,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px',borderBottom:`1px solid ${T.hair}`}}>
   <span style={{fontSize:26,fontWeight:500,letterSpacing:-.3,color:T.fg45}}>{label}</span>{badge}
  </div>
  <div style={{position:'absolute',left:0,right:0,top:80,bottom:0,overflow:'hidden'}}>{children}</div>
 </div>;
export const Card=({children,style={},accent=false}:{children:React.ReactNode;style?:React.CSSProperties;accent?:boolean})=>
 <div style={{background:T.raised,borderRadius:22,boxShadow:`inset 0 0 0 1px ${accent?T.accentBorder:T.ring}`,...style}}>{children}</div>;
export const Pill=({children,on=false}:{children:React.ReactNode;on?:boolean})=>
 <span style={{display:'inline-flex',alignItems:'center',gap:10,padding:'9px 20px',borderRadius:999,fontSize:21,fontWeight:500,letterSpacing:2,textTransform:'uppercase',background:on?T.accentSoft:'rgba(255,255,255,0.05)',color:on?T.accentText:T.fg30}}>{children}</span>;
export const Tag=({children,tone='neutral'}:{children:React.ReactNode;tone?:'neutral'|'accent'|'emerald'})=>{
 const c=tone==='accent'?[T.accentSoft,T.accentText]:tone==='emerald'?[T.emeraldSoft,T.emerald]:['rgba(255,255,255,0.06)',T.fg70];
 return <span style={{display:'inline-flex',alignItems:'center',padding:'9px 18px',borderRadius:10,fontSize:24,fontWeight:500,background:c[0],color:c[1],whiteSpace:'nowrap'}}>{children}</span>;};

/* Connectors, the site's hairline language */
export const HLine=({x,y,w,f,at=0,dur=14,opacity=.6}:{x:number;y:number;w:number;f:number;at?:number;dur?:number;opacity?:number})=>
 <div style={{position:'absolute',left:x,top:y,width:w,height:1.5,background:T.accent,opacity,transform:`scaleX(${ease((f-at)/dur)})`,transformOrigin:'left'}}/>;
export const VLine=({x,y,h,f,at=0,dur=14,opacity=.6,from='top'}:{x:number;y:number;h:number;f:number;at?:number;dur?:number;opacity?:number;from?:'top'|'bottom'})=>
 <div style={{position:'absolute',left:x,top:y,width:1.5,height:h,background:T.accent,opacity,transform:`scaleY(${ease((f-at)/dur)})`,transformOrigin:from}}/>;

/* Icons, lucide grammar at video weight */
const ic=(size:number,color:string)=>({width:size,height:size,fill:'none',stroke:color,strokeWidth:1.7,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,flexShrink:0});
export const Check=({size=26,color=T.accentText}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><path d="M20 6 9 17l-5-5"/></svg>;
export const UserIcon=({size=26,color=T.fg70}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
export const FileIcon=({size=26,color=T.fg30}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/></svg>;
export const SearchIcon=({size=26,color=T.fg45}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>;
export const ArrowRight=({size=28,color='#fff'}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
export const TargetIcon=({size=26,color=T.accent}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></svg>;

/* Brand */
export const LOGOS={linkedin:'linkedin.svg',google:'google.svg',reddit:'reddit.svg',youtube:'youtube.svg',email:'gmail.svg',x:'x_dark.svg',instagram:'instagram-icon.svg',claude:'claude-ai-icon.svg',producthunt:'producthunt.svg'} as const;
export type LogoId=keyof typeof LOGOS;
export const Logo=({id,size=32}:{id:LogoId;size?:number})=><Img src={staticFile('logos/'+LOGOS[id])} style={{width:size,height:size,objectFit:'contain',flexShrink:0}}/>;
export const Mark=({size=72}:{size?:number})=><Img src={staticFile('brand/mark.png')} style={{width:size,height:size*.88,objectFit:'contain'}}/>;
export const Wordmark=({width=300}:{width?:number})=><Img src={staticFile('brand/wordmark-white.png')} style={{width,objectFit:'contain'}}/>;
