import React from 'react';
import {Img,staticFile,spring} from 'remotion';

/* V3 kit. Mirrors the website's tokens (globals.css dark theme, process-visuals.tsx,
   gtm-engine.tsx) so the film and ekoslabs.com read as one system.
   Rules: one accent, no Z rotation, no blur or glass, no progress bars. */

export const T={
 bg:'#09090b',raised:'#0e0e12',raised2:'#101014',frame:'#0a0a0c',
 ring:'rgba(255,255,255,0.10)',hair:'rgba(255,255,255,0.07)',
 fg:'#f0f0f5',fg70:'rgba(240,240,245,0.70)',fg45:'rgba(240,240,245,0.45)',fg30:'rgba(240,240,245,0.30)',
 muted:'#9898a8',faint:'#555568',
 accent:'#3663ff',accentSoft:'rgba(54,99,255,0.14)',accentBorder:'rgba(54,99,255,0.35)',accentText:'#7f9bff',
 emerald:'#34d399',emeraldSoft:'rgba(52,211,153,0.14)',
};
export const SANS='Inter, ui-sans-serif, system-ui, sans-serif';
export const SERIF='InstrumentSerif, Georgia, serif';

export const clamp=(v:number)=>Math.max(0,Math.min(1,v));
/** Quart-out: fast settle, long tail. Default for entrances. */
export const ease=(v:number)=>1-(1-clamp(v))**4;
/** Cubic in-out for camera moves. */
export const easeIO=(v:number)=>{const t=clamp(v);return t<.5?4*t*t*t:1-(-2*t+2)**3/2;};
/** Critically damped spring: no overshoot, no bounce. */
export const pop=(f:number,d=0)=>spring({frame:f-d,fps:30,config:{damping:200,stiffness:220,mass:1}});
/** Fade + rise, the site's `reveal()` at video scale. */
export const rise=(f:number,at=0,dur=14,dy=24):React.CSSProperties=>{const a=ease((f-at)/dur);return {opacity:a,transform:`translateY(${(1-a)*dy}px)`};};

/* Type. The site headline is Inter 400, tight tracking, with an italic Instrument Serif
   accent word. Weights above 500 are reserved for numbers. */
export const Serif=({children,dim=false}:{children:React.ReactNode;dim?:boolean})=><span style={{fontFamily:SERIF,fontStyle:'italic',fontWeight:400,color:dim?T.fg45:T.fg}}>{children}</span>;
export const H=({children,size=84,color=T.fg,align='left'}:{children:React.ReactNode;size?:number;color?:string;align?:'left'|'center'})=><div style={{fontFamily:SANS,fontSize:size,lineHeight:1.08,fontWeight:400,letterSpacing:size*-.03,color,textAlign:align}}>{children}</div>;
export const Eyebrow=({children,color=T.fg30}:{children:React.ReactNode;color?:string})=><div style={{fontSize:21,letterSpacing:3.2,textTransform:'uppercase',color,fontWeight:500}}>{children}</div>;
export const Body=({children,size=26,color=T.muted}:{children:React.ReactNode;size?:number;color?:string})=><div style={{fontSize:size,lineHeight:1.45,color}}>{children}</div>;

/* Surfaces. Frame = process-visuals Frame; Card = the #0e0e12 ring-1 cards. */
export const Frame=({label,badge,width,height,children,style={}}:{label:string;badge?:React.ReactNode;width:number;height:number;children:React.ReactNode;style?:React.CSSProperties})=>
 <div style={{position:'relative',width,height,borderRadius:28,background:T.frame,boxShadow:`inset 0 0 0 1px ${T.ring}, 0 40px 90px -40px rgba(0,0,0,.9)`,overflow:'hidden',...style}}>
  <div style={{height:64,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 30px',borderBottom:`1px solid ${T.hair}`}}>
   <span style={{fontSize:23,fontWeight:500,letterSpacing:-.3,color:T.fg45}}>{label}</span>{badge}</div>
  <div style={{position:'absolute',left:0,right:0,top:64,bottom:0}}>{children}</div>
 </div>;
export const Card=({children,style={},accent=false}:{children:React.ReactNode;style?:React.CSSProperties;accent?:boolean})=>
 <div style={{background:T.raised,borderRadius:18,boxShadow:`inset 0 0 0 1px ${accent?T.accentBorder:T.ring}`,...style}}>{children}</div>;
export const Pill=({children,on=false}:{children:React.ReactNode;on?:boolean})=><span style={{display:'inline-flex',alignItems:'center',gap:8,padding:'7px 16px',borderRadius:999,fontSize:19,fontWeight:500,letterSpacing:2,textTransform:'uppercase',background:on?T.accentSoft:'rgba(255,255,255,0.05)',color:on?T.accentText:T.fg30}}>{children}</span>;
export const Tag=({children,tone='neutral'}:{children:React.ReactNode;tone?:'neutral'|'accent'|'emerald'})=>{const c=tone==='accent'?[T.accentSoft,T.accentText]:tone==='emerald'?[T.emeraldSoft,T.emerald]:['rgba(255,255,255,0.06)',T.fg70];
 return <span style={{display:'inline-flex',alignItems:'center',padding:'6px 14px',borderRadius:8,fontSize:20,fontWeight:500,background:c[0],color:c[1],whiteSpace:'nowrap'}}>{children}</span>;};
export const Count=({n}:{n:number})=><span style={{borderRadius:999,background:'rgba(255,255,255,0.05)',padding:'2px 10px',fontSize:19,color:T.fg30,fontVariantNumeric:'tabular-nums'}}>{n}</span>;

/* Logos: the website's LOGOS map, by id. */
export const LOGOS={linkedin:'linkedin.svg',google:'google.svg',reddit:'reddit.svg',youtube:'youtube.svg',email:'gmail.svg',slack:'slack.svg',x:'x_dark.svg',github:'github_dark.svg',producthunt:'producthunt.svg',instagram:'instagram-icon.svg',openai:'openai_dark.svg',claude:'claude-ai-icon.svg',codex:'codex_dark.svg',clay:'clay.png',perplexity:'perplexity.svg',n8n:'n8n.svg',hubspot:'hubspot_dark.svg',notion:'notion_dark.svg',meta:'meta.svg',chatgpt:'openai_dark.svg'} as const;
export type LogoId=keyof typeof LOGOS;
export const Logo=({id,size=26}:{id:LogoId;size?:number})=><Img src={staticFile('logos/'+LOGOS[id])} style={{width:size,height:size,objectFit:'contain',flexShrink:0}}/>;
export const LogoTile=({id,size=76}:{id:LogoId;size?:number})=><div style={{width:size,height:size,borderRadius:16,background:T.raised,boxShadow:`inset 0 0 0 1px ${T.ring}`,display:'grid',placeItems:'center'}}><Logo id={id} size={size*.42}/></div>;

/* Icons in the site's lucide style: 1.5px strokes, round joins. */
const ic=(size:number,color:string)=>({width:size,height:size,fill:'none',stroke:color,strokeWidth:1.6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,flexShrink:0});
export const FolderIcon=({size=26,color=T.accent,open=false}:{size?:number;color?:string;open?:boolean})=><svg viewBox="0 0 24 24" style={ic(size,color)}>{open?<path d="M6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>:<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>}</svg>;
export const FileIcon=({size=22,color=T.fg30}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/></svg>;
export const Chevron=({size=20,color=T.fg30,open=false}:{size?:number;color?:string;open?:boolean})=><svg viewBox="0 0 24 24" style={{...ic(size,color),transform:open?'rotate(90deg)':'none'}}><path d="m9 18 6-6-6-6"/></svg>;
export const Check=({size=22,color=T.accentText}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><path d="M20 6 9 17l-5-5"/></svg>;
export const UserIcon=({size=22,color=T.fg70}:{size?:number;color?:string})=><svg viewBox="0 0 24 24" style={ic(size,color)}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
export const Cursor=({x,y,click=false}:{x:number;y:number;click?:boolean})=><div style={{position:'absolute',left:x,top:y,transform:`scale(${click?.86:1})`,transformOrigin:'top left',zIndex:20,filter:'drop-shadow(0 4px 8px rgba(0,0,0,.6))'}}><svg width="40" height="50" viewBox="0 0 45 56"><path d="M3 3 L4 45 L15 33 L25 52 L34 47 L23 29 L41 29Z" fill="#fff" stroke="#09090b" strokeWidth="3"/></svg></div>;

/* Accent hairlines, the site's connector language. */
export const HLine=({x,y,w,f,at=0,dur=14,opacity=.6}:{x:number;y:number;w:number;f:number;at?:number;dur?:number;opacity?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:1,background:T.accent,opacity,transform:`scaleX(${ease((f-at)/dur)})`,transformOrigin:'left'}}/>;
export const VLine=({x,y,h,f,at=0,dur=14,opacity=.6}:{x:number;y:number;h:number;f:number;at?:number;dur?:number;opacity?:number})=><div style={{position:'absolute',left:x,top:y,width:1,height:h,background:T.accent,opacity,transform:`scaleY(${ease((f-at)/dur)})`,transformOrigin:'top'}}/>;

/* Stage: the site canvas. Footage scenes use Footage instead. */
export const Stage=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=><div style={{position:'absolute',inset:0,background:T.bg,color:T.fg,fontFamily:SANS,overflow:'hidden',...style}}>{children}</div>;
/** Camera: pan and scale the whole 1920x1080 stage around a focus point, no rotation. */
export const Cam=({s=1,x=960,y=540,children}:{s?:number;x?:number;y?:number;children:React.ReactNode})=><div style={{position:'absolute',left:0,top:0,width:1920,height:1080,transformOrigin:'0 0',transform:`translate(${960-x*s}px,${540-y*s}px) scale(${s})`}}>{children}</div>;
/** Retire a panel behind the next one: shrink, drift up, dim. No blur. */
export const retire=(b:number,dx=-260,dy=-70,scale=.82,dim=.35):React.CSSProperties=>({opacity:1-b*(1-dim),transform:`translate(${dx*b}px,${dy*b}px) scale(${1-b*(1-scale)})`});
