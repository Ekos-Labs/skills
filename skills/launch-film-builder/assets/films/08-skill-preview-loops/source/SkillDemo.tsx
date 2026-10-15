import React, {createContext, useContext, useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {skills} from '../../../../src/app/skills/skills-data';
import {DEMOS, type Art} from './demos';

// One short, loopable demo per Ekos skill. Three clean styles rotate across the catalog:
//   agent  - dark navy, agent terminal on the left, white result card on the right
//   canvas - light editorial page, big title, the result builds in the centre
//   chat   - light chat: your request, the agent's steps, then the result card
// Content is illustrative of what each skill produces (a fictional company, "Acme").

export const SKILL_DEMO_FRAMES = 210;
export const SKILL_DEMO_W = 1280;
export const SKILL_DEMO_H = 800;

const SANS = 'Inter, ui-sans-serif, system-ui, sans-serif';
const SERIF = 'InstrumentSerif, Georgia, serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const INK = '#0b1050';
const MUTED = 'rgba(11,16,80,.5)';
const SOFT = 'rgba(11,16,80,.08)';
const TINT = '#f4f6ff';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const AGENT = {claude: {name: 'Claude Code', icon: 'logos/agents/claude.svg'}, codex: {name: 'Codex', icon: 'logos/agents/codex.svg'}};

// The frame at which the result starts building; every artifact staggers from it.
const StartCtx = createContext(96);
const ColorCtx = createContext('#3663ff');

const useEnter = (from: number, damping = 16) => {
 const f = useCurrentFrame();
 const {fps} = useVideoConfig();
 return spring({frame: f - from, fps, config: {damping, stiffness: 140, mass: .7}});
};

const Pop: React.FC<{d: number; children: React.ReactNode; style?: React.CSSProperties; y?: number}> = ({d, children, style, y = 16}) => {
 const s = useContext(StartCtx);
 const p = useEnter(s + d);
 return <div style={{opacity: p, transform: `translateY(${(1 - p) * y}px)`, ...style}}>{children}</div>;
};

const Grow: React.FC<{d: number; to: number; c: string; h?: number}> = ({d, to, c, h = 10}) => {
 const s = useContext(StartCtx);
 const p = useEnter(s + d, 20);
 return <div style={{width: `${p * to}%`, height: h, borderRadius: h, background: c}}/>;
};

const Label: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = MUTED}) =>
 <div style={{fontSize: 12, fontWeight: 700, letterSpacing: 1.4, textTransform: 'uppercase', color}}>{children}</div>;

const Chip: React.FC<{children: React.ReactNode; c?: string}> = ({children, c}) => {
 const color = useContext(ColorCtx);
 const k = c ?? color;
 return <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 99, background: `${k}1f`, color: INK, fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap'}}>
  <span style={{width: 7, height: 7, borderRadius: 9, background: k}}/>{children}</span>;
};

const Tick: React.FC<{ok: boolean}> = ({ok}) => {
 const c = useContext(ColorCtx);
 return ok
  ? <span style={{display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: 22, background: c, color: '#fff', fontSize: 12, fontWeight: 800}}>✓</span>
  : <span style={{display: 'grid', placeItems: 'center', width: 22, height: 22, borderRadius: 22, border: `2px solid ${SOFT}`, color: 'rgba(11,16,80,.3)', fontSize: 11, fontWeight: 800}}>✕</span>;
};

const Row: React.FC<{children: React.ReactNode; hi?: boolean; cols: string}> = ({children, hi, cols}) => {
 const c = useContext(ColorCtx);
 return <div style={{display: 'grid', gridTemplateColumns: cols, gap: 10, alignItems: 'center', padding: '9px 12px', borderRadius: 12, background: hi ? `${c}1f` : TINT, fontSize: 14, color: INK, fontWeight: 600}}>{children}</div>;
};

const Dark: React.FC<{children: React.ReactNode}> = ({children}) =>
 <div style={{padding: 16, borderRadius: 16, background: INK, color: '#fff'}}>{children}</div>;

// ---------------------------------------------------------------- artifacts
const Artifact: React.FC<{art: Art}> = ({art}) => {
 const c = useContext(ColorCtx);
 const f = useCurrentFrame();
 const s = useContext(StartCtx);
 const col = {display: 'flex', flexDirection: 'column', gap: 10} as const;
 switch (art.kind) {
  case 'profile':
   return <div style={col}>
    <Pop d={2}><div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
     <div style={{width: 54, height: 54, borderRadius: 54, background: `linear-gradient(135deg, ${c}, #ffd0a8)`}}/>
     <div><Label color={c}>{art.label}</Label><div style={{fontSize: 22, fontWeight: 700, color: INK, letterSpacing: -.5}}>{art.headline}</div></div>
    </div></Pop>
    <Pop d={10}><div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
     {art.boxes.map(([l, t]) => <div key={l} style={{padding: 12, borderRadius: 14, background: TINT}}><Label>{l}</Label><div style={{marginTop: 4, fontSize: 15, color: INK, fontWeight: 600}}>{t}</div></div>)}
    </div></Pop>
    <Pop d={18}><Label>{art.rowsLabel}</Label></Pop>
    {art.rows.map(([n, v], i) => <Pop key={n} d={22 + i * 6}><div style={{display: 'grid', gridTemplateColumns: '24px 170px 1fr', alignItems: 'center', gap: 10}}>
     <span style={{fontSize: 13, fontWeight: 700, color: c}}>0{i + 1}</span><span style={{fontSize: 14, color: INK, fontWeight: 600}}>{n}</span>
     <div style={{height: 9, borderRadius: 9, background: SOFT}}><Grow d={26 + i * 6} to={v} c={i === 0 ? c : `${c}99`} h={9}/></div>
    </div></Pop>)}
    <Pop d={46}><div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>{art.chips.map((x) => <Chip key={x}>{x}</Chip>)}</div></Pop>
   </div>;
  case 'table': {
   const cols = `1.6fr ${art.cols.map(() => '1fr').join(' ')}`;
   return <div style={col}>
    <Pop d={2}><div style={{display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '0 12px'}}><Label>{art.rowLabel}</Label>{art.cols.map((h, i) => <div key={h} style={{textAlign: 'center', fontSize: 13, fontWeight: 700, color: i === 0 ? c : INK}}>{h}</div>)}</div></Pop>
    {art.rows.map(([n, ...v], i) => <Pop key={n} d={8 + i * 6}><Row cols={cols} hi={i === art.highlight}><span>{n}</span>{v.map((ok, k) => <div key={k} style={{display: 'grid', placeItems: 'center'}}><Tick ok={ok}/></div>)}</Row></Pop>)}
    <Pop d={40}><Dark><Label color={c}>{art.callout[0]}</Label><div style={{marginTop: 4, fontSize: 18, fontWeight: 700}}>{art.callout[1]}</div></Dark></Pop>
   </div>;
  }
  case 'beforeAfter': {
   const strike = interpolate(f, [s + 18, s + 32], [0, 100], clamp);
   return <div style={{...col, gap: 14}}>
    <Pop d={2}><div style={{padding: 16, borderRadius: 16, background: TINT}}>
     <Label>{art.beforeLabel ?? 'Before'}</Label>
     <div style={{position: 'relative', marginTop: 6, fontSize: 21, fontWeight: 700, color: MUTED, letterSpacing: -.4}}>{art.before}
      <div style={{position: 'absolute', left: 0, top: '52%', height: 3, width: `${strike}%`, background: '#ff5d73'}}/></div>
    </div></Pop>
    <Pop d={32}><div style={{padding: 18, borderRadius: 16, border: `2px solid ${c}`, background: '#fff'}}>
     <Label color={c}>{art.afterLabel ?? 'After'}</Label>
     <div style={{marginTop: 6, fontSize: 30, fontWeight: 800, color: INK, letterSpacing: -1, lineHeight: 1.1}}>{art.after}</div>
     <div style={{marginTop: 8, fontSize: 15, color: MUTED}}>{art.sub}</div>
    </div></Pop>
    <Pop d={46}><div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>{art.chips.map((x, i) => <Chip key={x} c={['#36d6a0', '#5b8cff', '#ff8f4a'][i % 3]}>{x}</Chip>)}</div></Pop>
   </div>;
  }
  case 'images':
   return <div>
    <Pop d={2}><div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><Label color={c}>{art.label}</Label><Chip>{art.chip}</Chip></div></Pop>
    <div style={{marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10}}>
     {art.sizes.map((size, i) => {
      const [a, b] = [['#ffd0a8', c], [c, '#1b2a9e'], ['#ffe9a3', '#ff7fb0'], ['#9fd8ff', '#3663ff'], ['#ff9ac2', '#ffe9a3'], ['#1b2a9e', c]][i % 6];
      return <Pop key={i} d={8 + i * 5} y={26}><div style={{position: 'relative', height: 132, borderRadius: 14, overflow: 'hidden', background: `linear-gradient(${130 + i * 30}deg, ${a}, ${b})`}}>
       <div style={{position: 'absolute', width: 70, height: 70, borderRadius: 70, left: 16 + (i * 23) % 60, top: 16 + (i * 17) % 34, background: 'rgba(255,255,255,.55)'}}/>
       <div style={{position: 'absolute', right: 12, bottom: 12, width: 62, height: 38, borderRadius: 9, background: 'rgba(255,255,255,.88)'}}/>
       <span style={{position: 'absolute', left: 9, bottom: 9, padding: '3px 7px', borderRadius: 7, background: 'rgba(11,16,80,.72)', color: '#fff', fontSize: 11, fontWeight: 600}}>{size}</span>
      </div></Pop>;
     })}
    </div>
   </div>;
  case 'film': {
   const head = interpolate(f, [s + 26, SKILL_DEMO_FRAMES - 12], [0, 100], clamp);
   const beat = Math.min(art.beats.length - 1, Math.floor(head / (100 / art.beats.length)));
   return <div style={col}>
    <Pop d={2}><div style={{position: 'relative', height: 210, borderRadius: 18, overflow: 'hidden', background: `linear-gradient(135deg, ${c}, ${INK})`}}>
     <div style={{position: 'absolute', left: 22, top: 20, color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: -.6, maxWidth: 340, lineHeight: 1.08}}>{art.headline}</div>
     <div style={{position: 'absolute', left: '50%', top: '58%', width: 56, height: 56, marginLeft: -28, borderRadius: 56, background: 'rgba(255,255,255,.92)', display: 'grid', placeItems: 'center'}}><div style={{marginLeft: 5, width: 0, height: 0, borderTop: '11px solid transparent', borderBottom: '11px solid transparent', borderLeft: `17px solid ${INK}`}}/></div>
     <div style={{position: 'absolute', left: 20, right: 20, bottom: 16, height: 5, borderRadius: 5, background: 'rgba(255,255,255,.3)'}}><div style={{width: `${head}%`, height: '100%', borderRadius: 5, background: '#fff'}}/></div>
    </div></Pop>
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${art.beats.length}, 1fr)`, gap: 8}}>
     {art.beats.map((b, i) => <Pop key={b} d={14 + i * 5}><div style={{height: 62, borderRadius: 12, padding: 9, display: 'flex', alignItems: 'flex-end', fontSize: 12.5, fontWeight: 700, background: i === beat ? c : TINT, color: i === beat ? '#fff' : INK}}>{i + 1}. {b}</div></Pop>)}
    </div>
    <Pop d={44}><div style={{fontFamily: MONO, fontSize: 13, color: MUTED}}>{art.caption}</div></Pop>
   </div>;
  }
  case 'posts':
   return <div style={col}>
    <Pop d={2}><div style={{display: 'flex', gap: 8}}>{art.chips.map((x) => <Chip key={x}>{x}</Chip>)}</div></Pop>
    {art.posts.map(([p, t], i) => <Pop key={i} d={8 + i * 9} y={24}><div style={{padding: 14, borderRadius: 16, background: '#fff', border: `1px solid ${SOFT}`, boxShadow: '0 10px 30px rgba(11,16,80,.07)'}}>
     <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
      <div style={{width: 30, height: 30, borderRadius: 30, background: `linear-gradient(135deg, ${c}, #3663ff)`}}/>
      <div style={{fontSize: 14, fontWeight: 700, color: INK}}>{art.author ?? 'You'}</div>
      <span style={{marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: MUTED}}>{p}</span>
     </div>
     <div style={{marginTop: 8, fontSize: 16, fontWeight: 600, color: INK, lineHeight: 1.3}}>{t}</div>
    </div></Pop>)}
   </div>;
  case 'bars':
   return <div style={col}>
    <Pop d={2}><Label color={c}>{art.label}</Label></Pop>
    {art.rows.map(([n, v, tag], i) => <Pop key={n} d={6 + i * 5}><div style={{display: 'grid', gridTemplateColumns: '210px 1fr 54px', alignItems: 'center', gap: 10}}>
     <span style={{fontSize: 14, fontWeight: 600, color: i < 2 ? INK : MUTED}}>{n}</span>
     <div style={{height: 12, borderRadius: 12, background: SOFT}}><Grow d={10 + i * 5} to={v} c={i === 0 ? c : i === 1 ? `${c}aa` : 'rgba(11,16,80,.22)'} h={12}/></div>
     <span style={{fontSize: 14, fontWeight: 700, color: INK, textAlign: 'right'}}>{tag ?? v}</span>
    </div></Pop>)}
    <Pop d={40}><div style={{padding: 14, borderRadius: 16, background: TINT}}>
     <Label>{art.listLabel}</Label>
     {art.list.map((m, i) => <div key={m} style={{marginTop: 7, display: 'flex', gap: 9, fontSize: 14.5, fontWeight: 600, color: INK}}><span style={{color: c}}>{i + 1}</span>{m}</div>)}
    </div></Pop>
   </div>;
  case 'page':
   return <div style={{display: 'flex', gap: 12, alignItems: 'flex-end'}}>
    <Pop d={2} style={{flex: 1}}><div style={{borderRadius: 16, overflow: 'hidden', border: `1px solid ${SOFT}`, background: '#fff'}}>
     <div style={{display: 'flex', gap: 6, padding: '9px 12px', borderBottom: `1px solid ${SOFT}`}}>{['#ff5f57', '#febc2e', '#28c840'].map((x) => <span key={x} style={{width: 9, height: 9, borderRadius: 9, background: x}}/>)}<span style={{marginLeft: 8, fontFamily: MONO, fontSize: 11, color: MUTED}}>localhost:3000</span></div>
     <div style={{padding: 20, background: `radial-gradient(80% 90% at 50% 0%, ${c}55, transparent)`}}>
      <Pop d={10}><div style={{fontSize: 26, fontWeight: 800, color: INK, letterSpacing: -.8, textAlign: 'center', lineHeight: 1.06}}>{art.headline}</div></Pop>
      <Pop d={16}><div style={{marginTop: 6, fontSize: 13.5, color: MUTED, textAlign: 'center'}}>{art.sub}</div></Pop>
      <Pop d={22}><div style={{margin: '12px auto 0', width: 160, padding: '9px 0', borderRadius: 99, background: c, textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: INK}}>{art.cta}</div></Pop>
      <div style={{marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9}}>{[0, 1, 2].map((i) => <Pop key={i} d={30 + i * 5}><div style={{height: 60, borderRadius: 11, background: TINT, padding: 9}}><div style={{width: '60%', height: 7, borderRadius: 7, background: INK}}/><div style={{marginTop: 7, width: '80%', height: 5, borderRadius: 5, background: SOFT}}/><div style={{marginTop: 5, width: '70%', height: 5, borderRadius: 5, background: SOFT}}/></div></Pop>)}</div>
     </div>
    </div></Pop>
    <Pop d={40}><div style={{width: 104, height: 204, borderRadius: 20, border: `4px solid ${INK}`, padding: 9, display: 'flex', flexDirection: 'column', gap: 7, background: `linear-gradient(180deg, ${c}44, #fff 50%)`}}>
     <div style={{width: '90%', height: 8, borderRadius: 8, background: INK}}/><div style={{width: '70%', height: 8, borderRadius: 8, background: INK}}/><div style={{marginTop: 4, height: 20, borderRadius: 20, background: c}}/><div style={{flex: 1, borderRadius: 9, background: TINT}}/>
    </div></Pop>
   </div>;
  case 'funnel':
   return <div style={col}>
    <Pop d={2}><Label color={c}>{art.label}</Label></Pop>
    {art.steps.map(([n, v], i) => <Pop key={n} d={6 + i * 6}><div style={{display: 'grid', gridTemplateColumns: '150px 1fr 52px', alignItems: 'center', gap: 10}}>
     <span style={{fontSize: 14, fontWeight: 600, color: INK}}>{n}</span>
     <div style={{display: 'flex', justifyContent: 'center'}}><div style={{width: `${v}%`, minWidth: 36, height: 30, borderRadius: 9, background: i === art.drop ? c : i < art.drop ? '#3663ff' : 'rgba(11,16,80,.22)'}}/></div>
     <span style={{fontSize: 14, fontWeight: 700, color: INK, textAlign: 'right'}}>{v}%</span>
    </div></Pop>)}
    <Pop d={38}><Dark><Label color={c}>{art.callout}</Label>{art.fixes.map((m, i) => <div key={m} style={{marginTop: 7, display: 'flex', gap: 9, fontSize: 15, fontWeight: 600}}><span style={{color: c}}>Fix {i + 1}</span>{m}</div>)}</Dark></Pop>
   </div>;
  case 'leads': {
   const cols = art.cols.map((x) => x.w).join(' ');
   return <div style={col}>
    <Pop d={2}><div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><Label color={c}>{art.label}</Label><span style={{fontFamily: MONO, fontSize: 12, color: MUTED}}>{art.file}</span></div></Pop>
    <Pop d={6}><div style={{display: 'grid', gridTemplateColumns: cols, gap: 10, padding: '0 12px'}}>{art.cols.map((x) => <Label key={x.h}>{x.h}</Label>)}</div></Pop>
    {art.rows.map((r, i) => <Pop key={i} d={10 + i * 5}><Row cols={cols} hi={i === art.highlight}>{r.map((cell, k) => k === r.length - 1 && art.lastIsChip
     ? <span key={k}><Chip c={['#3663ff', '#ff8f4a', '#36d6a0', '#9b7bff'][(i + k) % 4]}>{cell}</Chip></span>
     : <span key={k} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: k === 0 ? 700 : 500, color: k === 0 ? INK : 'rgba(11,16,80,.7)', fontSize: 13.5}}>{cell}</span>)}</Row></Pop>)}
    <Pop d={44}><div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>{art.footer.map((x, i) => <Chip key={x} c={['#36d6a0', '#ffc233', '#5b8cff'][i % 3]}>{x}</Chip>)}</div></Pop>
   </div>;
  }
  case 'checklist':
   return <div style={col}>
    <Pop d={2}><Label color={c}>{art.label}</Label></Pop>
    {art.items.map(([t, ok, note], i) => <Pop key={t} d={6 + i * 5}><div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '9px 12px', borderRadius: 12, background: ok ? TINT : '#fff2f4'}}>
     <Tick ok={ok}/><span style={{fontSize: 14.5, fontWeight: 600, color: INK}}>{t}</span>{note && <span style={{marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: ok ? MUTED : '#d6334f'}}>{note}</span>}
    </div></Pop>)}
    <Pop d={44}><Dark><div style={{fontSize: 17, fontWeight: 700}}>{art.verdict}</div></Dark></Pop>
   </div>;
  case 'doc':
   return <div style={{...col, gap: 12}}>
    <Pop d={2}><div style={{display: 'flex', alignItems: 'center', gap: 10}}><span style={{fontFamily: MONO, fontSize: 13, color: MUTED}}>{art.file}</span>{art.badge && <span style={{marginLeft: 'auto'}}><Chip>{art.badge}</Chip></span>}</div></Pop>
    <Pop d={6}><div style={{fontSize: 24, fontWeight: 800, color: INK, letterSpacing: -.6, lineHeight: 1.1}}>{art.title}</div></Pop>
    {art.sections.map(([h, t], i) => <Pop key={h} d={12 + i * 6}><div style={{display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12, padding: '10px 12px', borderRadius: 12, background: i % 2 ? '#fff' : TINT, border: i % 2 ? `1px solid ${SOFT}` : 'none'}}>
     <Label color={c}>{h}</Label><span style={{fontSize: 14.5, fontWeight: 600, color: INK, lineHeight: 1.35}}>{t}</span>
    </div></Pop>)}
   </div>;
  case 'threads':
   return <div style={col}>
    <Pop d={2}><Label color={c}>{art.label}</Label></Pop>
    {art.items.map(([sub, title, meta, fit], i) => <Pop key={title} d={8 + i * 8} y={22}><div style={{padding: 14, borderRadius: 16, background: '#fff', border: `1px solid ${SOFT}`, boxShadow: '0 10px 30px rgba(11,16,80,.06)'}}>
     <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#ff4500'}}><span style={{width: 18, height: 18, borderRadius: 18, background: '#ff4500'}}/>{sub}<span style={{color: MUTED, fontWeight: 600}}>{meta}</span><span style={{marginLeft: 'auto'}}><Chip>{fit}</Chip></span></div>
     <div style={{marginTop: 8, fontSize: 16, fontWeight: 700, color: INK, lineHeight: 1.3}}>{title}</div>
    </div></Pop>)}
   </div>;
  case 'plan':
   return <div style={{...col, gap: 12}}>
    <Pop d={2}><Dark><Label color={c}>The constraint</Label><div style={{marginTop: 4, fontSize: 22, fontWeight: 800, letterSpacing: -.5}}>{art.constraint}</div><div style={{marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,.7)'}}>{art.why}</div></Dark></Pop>
    <Pop d={16}><Label>Run next</Label></Pop>
    {art.next.map((n, i) => <Pop key={n} d={20 + i * 6}><div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 14, background: i === 0 ? `${c}24` : TINT}}>
     <span style={{display: 'grid', placeItems: 'center', width: 26, height: 26, borderRadius: 26, background: i === 0 ? c : '#fff', color: i === 0 ? '#fff' : INK, fontSize: 13, fontWeight: 800}}>{i + 1}</span>
     <span style={{fontSize: 16, fontWeight: 700, color: INK}}>{n}</span>
    </div></Pop>)}
    <Pop d={42}><div style={{display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center'}}><Label>Ignore for now</Label>{art.ignore.map((x) => <Chip key={x} c="#aab0cc">{x}</Chip>)}</div></Pop>
   </div>;
  case 'sequence':
   return <div style={col}>
    {art.steps.map(([day, ch, subj, prev], i) => <Pop key={day + ch} d={4 + i * 9} y={20}><div style={{display: 'grid', gridTemplateColumns: '64px 1fr', gap: 12, alignItems: 'start'}}>
     <div style={{paddingTop: 12}}><div style={{fontSize: 13, fontWeight: 800, color: INK}}>{day}</div><div style={{fontSize: 11, fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: 1}}>{ch}</div></div>
     <div style={{padding: 13, borderRadius: 14, background: i === 0 ? '#fff' : TINT, border: i === 0 ? `1px solid ${SOFT}` : 'none', boxShadow: i === 0 ? '0 10px 30px rgba(11,16,80,.07)' : 'none'}}>
      {subj && <div style={{fontSize: 14.5, fontWeight: 800, color: INK}}>{subj}</div>}
      <div style={{marginTop: subj ? 5 : 0, fontSize: 14, color: 'rgba(11,16,80,.72)', lineHeight: 1.35}}>{prev}</div>
     </div>
    </div></Pop>)}
    <Pop d={44}><div style={{display: 'flex', gap: 8}}><Chip c="#36d6a0">Draft, not sent</Chip><Chip c="#5b8cff">{art.note}</Chip></div></Pop>
   </div>;
  case 'script':
   return <div style={col}>
    <Pop d={2}><div style={{display: 'flex', justifyContent: 'space-between'}}><Label color={c}>{art.label}</Label><Chip>{art.length}</Chip></div></Pop>
    {art.lines.map(([t, line], i) => <Pop key={i} d={6 + i * 5}><div style={{display: 'grid', gridTemplateColumns: '54px 1fr', gap: 12, alignItems: 'baseline'}}>
     <span style={{fontFamily: MONO, fontSize: 12.5, color: MUTED}}>{t}</span>
     <span style={{fontSize: i === 0 ? 19 : 16, fontWeight: i === 0 ? 800 : 600, color: INK, lineHeight: 1.3}}>{line}</span>
    </div></Pop>)}
   </div>;
  case 'reel':
   return <div style={{display: 'flex', gap: 16}}>
    <Pop d={2}><div style={{width: 168, height: 300, borderRadius: 20, overflow: 'hidden', position: 'relative', background: `linear-gradient(160deg, ${c}, ${INK})`}}>
     <div style={{position: 'absolute', left: 14, right: 14, top: 22, color: '#fff', fontSize: 17, fontWeight: 800, lineHeight: 1.15}}>{art.hook}</div>
     <div style={{position: 'absolute', left: 14, right: 14, bottom: 16, height: 4, borderRadius: 4, background: 'rgba(255,255,255,.3)'}}><div style={{width: `${interpolate(f, [s, SKILL_DEMO_FRAMES - 10], [0, 100], clamp)}%`, height: '100%', background: '#fff', borderRadius: 4}}/></div>
    </div></Pop>
    <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
     <Pop d={8}><div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{height: 64, borderRadius: 9, background: `linear-gradient(${120 + i * 40}deg, ${c}${['ff', 'aa', '77', '44'][i]}, #1b2a9e)`}}/>)}</div></Pop>
     {art.rows.map(([k, v], i) => <Pop key={k} d={16 + i * 6}><div style={{padding: '9px 12px', borderRadius: 12, background: TINT}}><Label color={c}>{k}</Label><div style={{marginTop: 3, fontSize: 14.5, fontWeight: 600, color: INK}}>{v}</div></div></Pop>)}
    </div>
   </div>;
  case 'carousel':
   return <div>
    <Pop d={2}><div style={{display: 'flex', justifyContent: 'space-between'}}><Label color={c}>{art.label}</Label><Chip>8 slides · 1080 x 1350</Chip></div></Pop>
    <div style={{marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10}}>
     {art.slides.map((t, i) => <Pop key={i} d={8 + i * 6} y={30}><div style={{position: 'relative', aspectRatio: '4 / 5', borderRadius: 14, overflow: 'hidden', background: `linear-gradient(${150 + i * 25}deg, #2b2f45, ${i % 2 ? c : '#1b2a9e'})`}}>
      <div style={{position: 'absolute', left: 10, right: 10, top: '34%', textAlign: 'center'}}><span style={{display: 'inline', padding: '3px 6px', lineHeight: 1.7, borderRadius: 6, background: i === 0 ? '#fff' : 'transparent', color: i === 0 ? INK : '#fff', fontSize: 14.5, fontWeight: 800, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{t}</span></div>
      <span style={{position: 'absolute', right: 8, bottom: 8, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.7)'}}>{i + 1}/8</span>
     </div></Pop>)}
    </div>
   </div>;
  case 'ads':
   return <div>
    <Pop d={2}><Label color={c}>{art.label}</Label></Pop>
    <div style={{marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10}}>
     {art.ads.map(([angle, head], i) => <Pop key={angle} d={8 + i * 7} y={26}><div style={{borderRadius: 14, overflow: 'hidden', background: '#fff', border: `1px solid ${SOFT}`}}>
      <div style={{height: 130, position: 'relative', background: `linear-gradient(${140 + i * 30}deg, ${['#ffd0a8', c, '#9fd8ff'][i]}, ${['#ff7fb0', '#1b2a9e', '#3663ff'][i]})`}}>
       <div style={{position: 'absolute', left: 12, right: 12, top: 14, color: '#fff', fontSize: 16, fontWeight: 800, lineHeight: 1.15, textShadow: '0 2px 10px rgba(0,0,0,.2)'}}>{head}</div>
      </div>
      <div style={{padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><Chip c={['#ff8f4a', '#3663ff', '#36d6a0'][i]}>{angle}</Chip><span style={{fontSize: 11, color: MUTED, fontWeight: 600}}>1080 x 1080</span></div>
     </div></Pop>)}
    </div>
    <Pop d={40}><div style={{marginTop: 12, fontSize: 14, fontWeight: 600, color: INK}}>Test first: <span style={{color: c}}>{art.testFirst}</span></div></Pop>
   </div>;
 }
};

// ---------------------------------------------------------------- shared pieces
const useFonts = () => {
 const [handle] = useState(() => delayRender('Load fonts'));
 useEffect(() => {
  Promise.all([
   new FontFace('Inter', `url(${staticFile('fonts/inter.woff2')})`, {weight: '100 900'}).load(),
   new FontFace('InstrumentSerif', `url(${staticFile('fonts/instrument-serif-italic.woff2')})`, {style: 'italic', weight: '400'}).load(),
  ]).then((fonts) => { fonts.forEach((x) => document.fonts.add(x)); continueRender(handle); }).catch(() => continueRender(handle));
 }, [handle]);
};

const Spinner: React.FC<{c: string; light?: boolean}> = ({c, light}) => {
 const f = useCurrentFrame();
 return <span style={{width: 16, height: 16, borderRadius: 16, border: `3px solid ${light ? 'rgba(11,16,80,.12)' : 'rgba(255,255,255,.18)'}`, borderTopColor: c, transform: `rotate(${f * 14}deg)`, display: 'inline-block'}}/>;
};

const Steps: React.FC<{steps: string[]; done: string; c: string; light?: boolean; at: number[]}> = ({steps, done, c, light, at}) => {
 const f = useCurrentFrame();
 const ink = light ? INK : '#fff';
 return <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
  {steps.map((s, i) => f >= at[i] && <div key={s} style={{display: 'flex', alignItems: 'center', gap: 11, fontSize: 15.5, color: ink, opacity: interpolate(f, [at[i], at[i] + 6], [0, 1], clamp)}}>
   {f >= at[i] + 12 ? <span style={{display: 'grid', placeItems: 'center', width: 18, height: 18, borderRadius: 18, background: '#36d6a0', color: INK, fontSize: 11, fontWeight: 900}}>✓</span> : <Spinner c={c} light={light}/>}
   {s}
  </div>)}
  {f >= at[2] + 18 && <div style={{marginTop: 4, fontSize: 15, color: light ? INK : c, fontWeight: 600, opacity: interpolate(f, [at[2] + 18, at[2] + 26], [0, 1], clamp)}}><span style={{color: c}}>✓</span> {done}</div>}
 </div>;
};

const ResultCard: React.FC<{title: string; output: string; c: string; style: React.CSSProperties; enter: number; children: React.ReactNode; from?: 'right' | 'bottom'; zoom?: number; center?: boolean}> = ({title, output, c, style, enter, children, from = 'right', zoom = 1, center = false}) => {
 const p = useEnter(enter, 18);
 const move = from === 'right' ? `translateX(${(1 - p) * 60}px)` : `translateY(${(1 - p) * 70}px)`;
 return <div style={{position: 'absolute', opacity: p, transform: `${center ? 'translateY(-50%) ' : ''}${move} scale(${.97 + p * .03})`, borderRadius: 26, background: '#fff', boxShadow: '0 40px 100px rgba(8,12,48,.22)', padding: 26, ...style}}>
  <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18}}>
   <span style={{width: 11, height: 11, borderRadius: 11, background: c}}/>
   <span style={{fontSize: 14, fontWeight: 700, color: INK}}>{title}</span>
   <span style={{marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: MUTED}}>{output}</span>
  </div>
  <div style={{zoom}}>{children}</div>
 </div>;
};

const AgentChip: React.FC<{agent: keyof typeof AGENT; light?: boolean}> = ({agent, light}) =>
 <span style={{display: 'inline-flex', alignItems: 'center', gap: 9}}>
  <span style={{display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 9, background: '#fff', boxShadow: light ? `0 0 0 1px ${SOFT}` : 'none'}}><Img src={staticFile(AGENT[agent].icon)} style={{width: 19, height: 19}}/></span>
  <span style={{color: light ? INK : '#fff', fontSize: 15, fontWeight: 600}}>{AGENT[agent].name}</span>
 </span>;

// ---------------------------------------------------------------- composition
export const SkillDemo: React.FC<{slug: string}> = ({slug}) => {
 useFonts();
 const f = useCurrentFrame();
 const index = Math.max(0, skills.findIndex((s) => s.slug === slug));
 const skill = skills[index];
 const demo = DEMOS[skill.slug];
 const c = skill.color;
 const style = (['agent', 'canvas', 'chat'] as const)[index % 3];
 const fade = interpolate(f, [0, 10, SKILL_DEMO_FRAMES - 14, SKILL_DEMO_FRAMES - 1], [0, 1, 1, 0], clamp);
 const typed = Math.floor(interpolate(f, [14, 42], [0, demo.command.length], clamp));
 const caret = f < 48 && Math.floor(f / 8) % 2 === 0;
 const intro = useEnter(2);
 const bubble = useEnter(46);

 let scene: React.ReactNode;
 if (style === 'agent') {
  scene = <AbsoluteFill style={{background: `radial-gradient(70% 80% at 88% 18%, ${c}3d, transparent 60%), radial-gradient(60% 70% at 0% 100%, #3663ff4d, transparent 60%), linear-gradient(160deg, #0d1452, #060a2b)`}}>
   <div style={{position: 'absolute', left: 52, top: '50%', marginTop: -150, width: 430, opacity: intro, transform: `translateY(${(1 - intro) * 28}px)`, borderRadius: 22, background: 'rgba(8,12,48,.82)', border: '1px solid rgba(255,255,255,.12)', overflow: 'hidden'}}>
    <div style={{display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid rgba(255,255,255,.08)'}}><AgentChip agent={demo.agent}/></div>
    <div style={{padding: '22px 22px 26px', fontFamily: MONO}}>
     <div style={{fontSize: 19, color: '#fff'}}><span style={{color: c}}>&gt; </span>{demo.command.slice(0, typed)}{caret && '▍'}</div>
     <div style={{marginTop: 22}}><Steps steps={demo.steps} done={demo.done} c={c} at={[54, 68, 82]}/></div>
    </div>
   </div>
   <ResultCard title={skill.title} output={skill.output} c={c} enter={90} center zoom={1.18} style={{right: 52, top: '50%', width: 712}}>
    <StartCtx.Provider value={96}><Artifact art={demo.art}/></StartCtx.Provider>
   </ResultCard>
   <div style={{position: 'absolute', left: 52, bottom: 52, display: 'flex', alignItems: 'center', gap: 12, opacity: intro}}>
    <span style={{color: 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: 700, letterSpacing: 2}}>EKOS SKILLS</span>
    <span style={{color: '#fff', fontSize: 21, fontWeight: 700, letterSpacing: -.4}}>{skill.title}</span>
   </div>
  </AbsoluteFill>;
 } else if (style === 'canvas') {
  scene = <AbsoluteFill style={{background: `radial-gradient(60% 60% at 82% 8%, ${c}33, transparent 60%), #f6f5f1`}}>
   <div style={{position: 'absolute', left: 64, top: 56, opacity: intro, transform: `translateY(${(1 - intro) * 20}px)`}}>
    <div style={{fontSize: 13, fontWeight: 700, letterSpacing: 2, color: MUTED}}>EKOS SKILLS</div>
    <div style={{marginTop: 8, fontSize: 52, fontWeight: 700, letterSpacing: -2, color: INK, lineHeight: 1}}>{skill.title}</div>
    <div style={{marginTop: 4, fontFamily: SERIF, fontStyle: 'italic', fontSize: 34, color: c, filter: 'brightness(.85)'}}>{skill.output.toLowerCase()}</div>
   </div>
   <div style={{position: 'absolute', right: 64, top: 64, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, opacity: intro}}>
    <AgentChip agent={demo.agent} light/>
    <div style={{padding: '10px 16px', borderRadius: 14, background: '#fff', boxShadow: `0 0 0 1px ${SOFT}, 0 12px 30px rgba(11,16,80,.06)`, fontFamily: MONO, fontSize: 16, color: INK}}><span style={{color: c}}>&gt; </span>{demo.command.slice(0, typed)}{caret && '▍'}</div>
   </div>
   <ResultCard title={skill.title} output={skill.output} c={c} enter={44} from="bottom" zoom={1.3} style={{left: 110, right: 110, top: 232}}>
    <StartCtx.Provider value={52}><Artifact art={demo.art}/></StartCtx.Provider>
   </ResultCard>
  </AbsoluteFill>;
 } else {
  scene = <AbsoluteFill style={{background: `linear-gradient(160deg, #eef1ff, #ffffff 55%), #fff`}}>
   <div style={{position: 'absolute', left: 56, top: '50%', transform: 'translateY(-55%)', width: 420, display: 'flex', flexDirection: 'column', gap: 16}}>
    <div style={{opacity: intro, display: 'flex', justifyContent: 'flex-end'}}>
     <div style={{maxWidth: 400, padding: '14px 18px', borderRadius: '20px 20px 6px 20px', background: INK, color: '#fff', fontSize: 17, lineHeight: 1.35}}>
      {demo.ask.slice(0, Math.floor(interpolate(f, [10, 40], [0, demo.ask.length], clamp)))}{f < 44 && Math.floor(f / 8) % 2 === 0 && '▍'}
     </div>
    </div>
    <div style={{opacity: bubble, transform: `translateY(${(1 - bubble) * 16}px)`, padding: 18, borderRadius: '20px 20px 20px 6px', background: '#fff', boxShadow: `0 0 0 1px ${SOFT}, 0 16px 40px rgba(11,16,80,.07)`}}>
     <AgentChip agent={demo.agent} light/>
     <div style={{marginTop: 12, fontFamily: MONO, fontSize: 14, color: MUTED}}>{demo.command}</div>
     <div style={{marginTop: 14}}><Steps steps={demo.steps} done={demo.done} c={c} light at={[56, 70, 84]}/></div>
    </div>
   </div>
   <ResultCard title={skill.title} output={skill.output} c={c} enter={94} center zoom={1.18} style={{right: 56, top: '50%', width: 718, boxShadow: `0 0 0 1px ${SOFT}, 0 40px 100px rgba(11,16,80,.12)`}}>
    <StartCtx.Provider value={100}><Artifact art={demo.art}/></StartCtx.Provider>
   </ResultCard>
   <div style={{position: 'absolute', left: 56, bottom: 52, display: 'flex', alignItems: 'center', gap: 12, opacity: intro}}>
    <span style={{color: MUTED, fontSize: 13, fontWeight: 700, letterSpacing: 2}}>EKOS SKILLS</span>
    <span style={{color: INK, fontSize: 21, fontWeight: 700, letterSpacing: -.4}}>{skill.title}</span>
   </div>
  </AbsoluteFill>;
 }

 return <ColorCtx.Provider value={c}>
  <AbsoluteFill style={{fontFamily: SANS, background: style === 'agent' ? '#060a2b' : '#f6f5f1'}}>
   <AbsoluteFill style={{opacity: fade}}>{scene}</AbsoluteFill>
  </AbsoluteFill>
 </ColorCtx.Provider>;
};
