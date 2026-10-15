import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, interpolate, Easing, spring, staticFile, useCurrentFrame} from 'remotion';

import {REELS, type Reel} from './reels';

// Skill preview films: the deliverable builds itself on screen (pages slide in, rows fill,
// numbers count up, text types out), holds on the finished result, then fades back to
// the empty set so the loop restarts cleanly. Real photography, slow camera drift.
// Every company, person and number in these films is fictional.

export const SKILL_REEL_FRAMES = 240;
const SANS = 'Inter, ui-sans-serif, system-ui, sans-serif';
const SERIF = 'InstrumentSerif, Georgia, serif';
const MONO = 'ui-monospace, Menlo, monospace';
const INK = '#14161f';
const MUTED = '#6b675d';
const FAINT = '#8a8478';
const LINE = '#eeece6';
const PAPER = '#fbfaf7';
const BLUE = '#3663ff';
const GREEN = '#1f9d6b';
const RED = '#d9485f';
const AMBER = '#c98a12';
const HUES = ['#3663ff', '#ff8f4a', '#36d6a0', '#9b7bff', '#ff5d73', '#46c8ff', '#ffc233', '#5b8cff'];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const photo = (id: string) => staticFile(`stock/u-${id}.jpg`);

const useFonts = () => {
 const [handle] = useState(() => delayRender('Load fonts'));
 useEffect(() => {
  Promise.all([
   new FontFace('Inter', `url(${staticFile('fonts/inter.woff2')})`, {weight: '100 900'}).load(),
   new FontFace('InstrumentSerif', `url(${staticFile('fonts/instrument-serif-italic.woff2')})`, {style: 'italic', weight: '400'}).load(),
  ]).then((fonts) => { fonts.forEach((f) => document.fonts.add(f)); continueRender(handle); }).catch(() => continueRender(handle));
 }, [handle]);
};

/** A camera that drifts through keyframes [frame, x, y, scale] and eases between them. */
const useCamera = (keys: [number, number, number, number][]) => {
 const f = useCurrentFrame();
 const frames = keys.map((k) => k[0]);
 const ease = {...clamp, easing: Easing.inOut(Easing.cubic)};
 return {
  x: interpolate(f, frames, keys.map((k) => k[1]), ease),
  y: interpolate(f, frames, keys.map((k) => k[2]), ease),
  s: interpolate(f, frames, keys.map((k) => k[3]), ease),
 };
};

const CAMS: [number, number, number, number][][] = [
 [[0, 0, 0, 1], [80, -50, 18, 1.07], [160, 55, 12, 1.06], [240, 0, 0, 1]],
 [[0, 0, 0, 1], [90, 40, 24, 1.07], [170, -40, -12, 1.05], [240, 0, 0, 1]],
 [[0, 0, 0, 1], [120, -30, 6, 1.05], [240, 0, 0, 1]],
];

const Stage: React.FC<{bg: string; cam?: number; children: React.ReactNode}> = ({bg, cam = 0, children}) => {
 const c = useCamera(CAMS[cam % CAMS.length]);
 const out = interpolate(useCurrentFrame(), [222, 238], [1, 0], clamp);
 return <AbsoluteFill style={{background: bg, overflow: 'hidden', fontFamily: SANS}}>
  <AbsoluteFill style={{opacity: out, transform: `translate(${c.x}px, ${c.y}px) scale(${c.s})`, transformOrigin: '50% 50%'}}>{children}</AbsoluteFill>
 </AbsoluteFill>;
};

/** A sweep that lights rows one after another once the build has finished. */
const useSweep = (count: number) => interpolate(useCurrentFrame(), [130, 215], [0, count], clamp);

/** Entrance springs: `enter(at)` goes 0 → 1 starting at frame `at`. */
const useEnter = () => {
 const f = useCurrentFrame();
 return (at: number, damping = 15) => spring({frame: f - at, fps: 30, config: {damping, mass: .7}});
};
/** Rises into place while fading in. */
const rise = (p: number, dist = 40): React.CSSProperties => ({opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * dist}px)`});
const pop = (p: number): React.CSSProperties => ({display: 'inline-block', opacity: Math.min(1, p * 1.5), transform: `scale(${.6 + .4 * p})`});
/** Types `text` out from frame `at`, `cps` characters per frame. */
const typed = (text: string, f: number, at: number, cps = 1.8) => text.slice(0, Math.max(0, Math.floor((f - at) * cps)));
/** Counts the first number in `value` up to its full size. */
const counted = (value: string, p: number) => value.replace(/\d+(\.\d+)?/, (m) => (parseFloat(m) * Math.min(1, p)).toFixed(m.includes('.') ? m.split('.')[1].length : 0));

const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = FAINT}) =>
 <div style={{fontSize: 11, letterSpacing: 2, color, fontWeight: 600, textTransform: 'uppercase'}}>{children}</div>;

const Mark: React.FC = () => <div style={{display: 'flex', alignItems: 'center', gap: 8}}><Img src={staticFile('brand/mark.png')} style={{width: 18}}/><span style={{fontSize: 11.5, fontWeight: 700, letterSpacing: 1, color: INK}}>EKOS</span></div>;

const Pill: React.FC<{tone: 'good' | 'bad' | 'warn' | 'blue'; children: React.ReactNode}> = ({tone, children}) => {
 const c = {good: GREEN, bad: RED, warn: AMBER, blue: BLUE}[tone];
 return <span style={{display: 'inline-block', padding: '3px 10px', borderRadius: 99, background: `${c}18`, color: c, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap'}}>{children}</span>;
};

const Paper: React.FC<{x: number; y: number; w: number; h?: number; r?: number; z?: number; children: React.ReactNode; radius?: number; p?: number}> = ({x, y, w, h, r = 0, z = 1, children, radius = 4, p = 1}) =>
 <div style={{position: 'absolute', left: x, top: y, width: w, height: h ?? w * 1.414, background: PAPER, borderRadius: radius, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 90}px) rotate(${r + (1 - p) * 6}deg)`, boxShadow: '0 30px 60px rgba(20,22,31,.18), 0 4px 10px rgba(20,22,31,.08)', overflow: 'hidden', zIndex: z}}>{children}</div>;

// ---------------------------------------------------------------- report: three fanned pages
const ReportScene: React.FC<{d: Extract<Reel, {kind: 'report'}>}> = ({d}) => {
 const enter = useEnter();
 return <Stage bg={d.bg ?? '#e9e5dd'} cam={0}>
  <Paper x={830} y={160} r={4} w={390} p={enter(40)}>
   <div style={{padding: 34}}>
    <Kicker>{d.bars.kicker}</Kicker>
    <div style={{marginTop: 14, fontFamily: SERIF, fontStyle: 'italic', fontSize: 38, lineHeight: 1, color: INK}}>{d.bars.title}</div>
    <div style={{marginTop: 28, display: 'flex', flexDirection: 'column', gap: 16}}>
     {d.bars.items.map(([n, v], i) => <div key={n}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, color: INK, fontWeight: i < 2 ? 700 : 500}}><span>{n}</span><span>{Math.round(v * enter(62 + i * 9, 26))}</span></div>
      <div style={{marginTop: 6, height: 6, background: '#e6e1d7'}}><div style={{width: `${v * enter(62 + i * 9, 26)}%`, height: '100%', background: i === 0 ? BLUE : i === 1 ? '#7d97ff' : '#b9b2a4'}}/></div>
     </div>)}
    </div>
    <div style={{marginTop: 28, paddingTop: 16, borderTop: '1px solid #e6e1d7', fontSize: 12.5, lineHeight: 1.6, color: '#4b4840', ...rise(enter(115), 14)}}><b>{d.bars.noteLead}</b> {d.bars.note}</div>
   </div>
  </Paper>
  <Paper x={500} y={130} r={-1.5} w={390} z={2} p={enter(22)}>
   <div style={{padding: 34}}>
    <Kicker>{d.stat.kicker}</Kicker>
    <div style={{marginTop: 26, fontSize: 88, fontWeight: 700, letterSpacing: -4, color: INK, lineHeight: .9}}>{counted(d.stat.value, enter(34, 30))}</div>
    <div style={{marginTop: 8, fontSize: 14, color: '#4b4840'}}>{d.stat.label}</div>
    <div style={{marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
     {d.stat.minis.map(([k, v, t], i) => <div key={k} style={rise(enter(50 + i * 10), 18)}>
      <Kicker>{k}</Kicker>
      <div style={{marginTop: 4, fontSize: 32, fontWeight: 700, letterSpacing: -1.2, color: INK}}>{v}</div>
      <div style={{marginTop: 4, fontSize: 12, color: MUTED, lineHeight: 1.4}}>{t}</div>
     </div>)}
    </div>
    <div style={{marginTop: 32, fontSize: 11, color: FAINT, lineHeight: 1.6}}>{d.stat.source}</div>
   </div>
  </Paper>
  <Paper x={140} y={100} r={-4} w={400} z={3} p={enter(4)}>
   <div style={{height: '52%'}}><Img src={photo(d.photo)} style={{width: '100%', height: '100%', objectFit: 'cover'}}/></div>
   <div style={{padding: '28px 32px'}}>
    <Kicker>{d.kicker}</Kicker>
    <div style={{marginTop: 14, fontSize: 44, fontWeight: 700, letterSpacing: -1.8, lineHeight: .98, color: INK}}>{d.title}</div>
    <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 36, lineHeight: 1.05, color: BLUE}}>{d.subtitle}</div>
    <div style={{position: 'absolute', left: 32, bottom: 26}}><Mark/></div>
   </div>
  </Paper>
 </Stage>;
};

// ---------------------------------------------------------------- sheet: a clean table
const SheetScene: React.FC<{d: Extract<Reel, {kind: 'sheet'}>}> = ({d}) => {
 const sweep = useSweep(d.rows.length);
 const enter = useEnter();
 const step = Math.min(12, 90 / d.rows.length);
 const cols = d.widths.map((w) => `${w}fr`).join(' ');
 return <Stage bg={d.bg ?? '#f3f2ef'} cam={1}>
  <div style={{position: 'absolute', left: 90, right: 90, top: '50%', opacity: Math.min(1, enter(0) * 1.5), transform: `translateY(calc(-50% + ${(1 - enter(0)) * 60}px))`, background: '#fff', borderRadius: 18, boxShadow: '0 40px 90px rgba(20,22,31,.12), 0 0 0 1px rgba(20,22,31,.06)', overflow: 'hidden'}}>
   <div style={{display: 'flex', alignItems: 'baseline', gap: 16, padding: '30px 36px 22px'}}>
    <div style={{fontSize: 32, fontWeight: 700, letterSpacing: -1.2, color: INK}}>{d.title}</div>
    <div style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 27, color: BLUE}}>{d.subtitle}</div>
    <div style={{marginLeft: 'auto', fontSize: 13, color: MUTED}}>{d.meta}</div>
   </div>
   <div style={{display: 'grid', gridTemplateColumns: cols, gap: 14, padding: '10px 36px', borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, fontSize: 11, letterSpacing: 1.6, color: FAINT, fontWeight: 600}}>
    {d.columns.map((h) => <span key={h}>{h.toUpperCase()}</span>)}
   </div>
   {d.rows.map((r, i) => {
    const lit = Math.max(0, 1 - Math.abs(sweep - i - .5));
    const p = enter(16 + i * step);
    return <div key={i} style={{...rise(p, 18), display: 'grid', gridTemplateColumns: cols, gap: 14, alignItems: 'center', padding: `${d.rows.length <= 6 ? 19 : 13}px 36px`, borderBottom: '1px solid #f3f1ec', fontSize: 15.5, color: INK, background: `rgba(54,99,255,${lit * .06})`}}>
     {r.map((cell, c) => {
      if (c === 0 && d.avatars) return <span key={c} style={{display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, minWidth: 0}}><span style={{display: 'grid', placeItems: 'center', flexShrink: 0, width: 30, height: 30, borderRadius: 30, background: `${HUES[i % 8]}22`, color: HUES[i % 8], fontSize: 12, fontWeight: 700}}>{cell.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span><span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{cell}</span></span>;
      if (d.scoreColumn === c) {
       const n = Number(cell);
       return <span key={c} style={pop(enter(26 + i * step, 10))}><Pill tone={n >= 80 ? 'good' : n >= 60 ? 'blue' : 'warn'}>{counted(cell, enter(26 + i * step, 22))}</Pill></span>;
      }
      if (d.tagColumn === c) return <span key={c} style={pop(enter(28 + i * step, 10))}><Pill tone={/fix|no|bad|skip|C$/i.test(cell) ? 'bad' : /check|risky|B$|maybe/i.test(cell) ? 'warn' : 'good'}>{cell}</Pill></span>;
      return <span key={c} style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: c === 0 ? INK : '#4b4840', fontWeight: c === 0 ? 600 : 400, fontFamily: d.monoColumn === c ? MONO : SANS, fontSize: d.monoColumn === c ? 13.5 : 15.5}}>{cell}</span>;
     })}
    </div>;
   })}
  </div>
 </Stage>;
};

// ---------------------------------------------------------------- slides: photo cards in a row
const SlidesScene: React.FC<{d: Extract<Reel, {kind: 'slides'}>}> = ({d}) => {
 const f = useCurrentFrame();
 const enter = useEnter();
 const drift = (i: number) => Math.sin((f / 240) * Math.PI * 2 + i) * 6;
 const w = d.wide ? 330 : 300;
 const h = d.wide ? 330 : 375;
 return <Stage bg={d.bg ?? 'linear-gradient(160deg, #efe9df, #e4ddd0)'} cam={2}>
  {d.cards.map((card, i) => { const p = enter(10 + i * 16); return <div key={i} style={{position: 'absolute', left: (d.wide ? 70 : 110) + i * (d.wide ? 285 : 262), top: 200 + (i % 2) * 40 + drift(i), width: w, height: h, borderRadius: 14, overflow: 'hidden', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 260}px) rotate(${[-6, 2, -2, 5][i] + (1 - p) * 14}deg)`, boxShadow: '0 30px 60px rgba(20,22,31,.25)', zIndex: 4 - i, background: '#000'}}>
   <Img src={photo(card.photo)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.78)'}}/>
   {card.lines.length > 0 && <div style={{position: 'absolute', left: 22, right: 22, top: card.cta ? '30%' : '38%', textAlign: 'center', lineHeight: 1.55}}>
    {card.lines.map((l, j) => <div key={j} style={rise(enter(34 + i * 16 + j * 6), 14)}><span style={{background: '#fff', color: INK, padding: '3px 10px', borderRadius: 8, fontSize: 21, fontWeight: 800, letterSpacing: -.3}}>{l}</span></div>)}
   </div>}
   {card.cta && <div style={{position: 'absolute', left: 22, right: 22, bottom: 24, display: 'flex', justifyContent: 'center'}}><span style={{...pop(enter(50 + i * 16, 10)), background: BLUE, color: '#fff', padding: '9px 18px', borderRadius: 99, fontSize: 14, fontWeight: 700}}>{card.cta}</span></div>}
   {card.tag && <span style={{position: 'absolute', left: 12, top: 12, background: 'rgba(255,255,255,.9)', color: INK, padding: '4px 9px', borderRadius: 7, fontSize: 11, fontWeight: 700}}>{card.tag}</span>}
   {!card.cta && <span style={{position: 'absolute', right: 12, bottom: 10, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.85)'}}>{card.corner ?? `${i + 1}/${d.cards.length * 2}`}</span>}
  </div>; })}
  <div style={{position: 'absolute', left: 110, top: 70, ...rise(enter(0), 20)}}>
   <Kicker>{d.kicker}</Kicker>
   <div style={{marginTop: 8, fontSize: 40, fontWeight: 700, letterSpacing: -1.4, color: INK}}>{d.title}</div>
  </div>
 </Stage>;
};

// ---------------------------------------------------------------- posts: social post cards
const PostCard: React.FC<{p: Extract<Reel, {kind: 'posts'}>['posts'][number]; x: number; y: number; r: number; z: number; at: number}> = ({p, x, y, r, z, at}) => {
 const f = useCurrentFrame();
 const enter = useEnter();
 const e = enter(at);
 return <div style={{position: 'absolute', left: x, top: y, width: 372, background: '#fff', borderRadius: 18, opacity: Math.min(1, e * 1.5), transform: `translateY(${(1 - e) * 120}px) rotate(${r + (1 - e) * 5}deg)`, boxShadow: '0 30px 60px rgba(20,22,31,.16), 0 0 0 1px rgba(20,22,31,.05)', overflow: 'hidden', zIndex: z}}>
  <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px 10px'}}>
   <Img src={photo(p.avatar)} style={{width: 44, height: 44, borderRadius: 44, objectFit: 'cover'}}/>
   <div><div style={{fontSize: 16, fontWeight: 700, color: INK}}>{p.name}</div><div style={{fontSize: 12.5, color: FAINT}}>{p.handle}</div></div>
   <span style={{marginLeft: 'auto'}}><Pill tone={p.label === 'Before' ? 'bad' : p.label === 'After' ? 'good' : 'blue'}>{p.label}</Pill></span>
  </div>
  <div style={{position: 'relative', padding: '6px 20px 20px', fontSize: 18, lineHeight: 1.5, whiteSpace: 'pre-line'}}>
   <span style={{visibility: 'hidden'}}>{p.text}</span>
   <span style={{position: 'absolute', left: 20, right: 20, top: 6, color: INK}}>{typed(p.text, f, at + 14, 2.4)}</span>
  </div>
  {p.image && <Img src={photo(p.image)} style={{width: '100%', height: 200, objectFit: 'cover', display: 'block', opacity: enter(at + 50)}}/>}
 </div>;
};

const PostsScene: React.FC<{d: Extract<Reel, {kind: 'posts'}>}> = ({d}) => {
 const enter = useEnter();
 return <Stage bg={d.bg ?? 'linear-gradient(160deg, #eef0f6, #e3e6ef)'} cam={1}>
  <div style={{position: 'absolute', left: 60, top: 66, ...rise(enter(0), 20)}}>
   <Kicker>{d.kicker}</Kicker>
   <div style={{marginTop: 8, fontSize: 38, fontWeight: 700, letterSpacing: -1.4, color: INK}}>{d.title}</div>
  </div>
  {d.posts.map((p, i) => <PostCard key={i} p={p} at={8 + i * 30} x={60 + i * 392} y={[200, 170, 220][i]} r={[-2.5, 1.5, -1][i]} z={3 - i}/>)}
 </Stage>;
};

// ---------------------------------------------------------------- emails: stacked drafts
const EmailsScene: React.FC<{d: Extract<Reel, {kind: 'emails'}>}> = ({d}) => {
 const f = useCurrentFrame();
 const enter = useEnter();
 return <Stage bg={d.bg ?? '#ecebe6'} cam={0}>
  <div style={{position: 'absolute', left: 100, top: 70, width: 330, ...rise(enter(0), 20)}}>
   <Kicker>{d.kicker}</Kicker>
   <div style={{marginTop: 10, fontSize: 38, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1.05, color: INK}}>{d.title}</div>
   <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10}}>
    {d.steps.map(([day, label], i) => <div key={i} style={{...rise(enter(10 + i * 8), 12), display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: INK}}>
     <span style={{display: 'grid', placeItems: 'center', width: 54, height: 28, borderRadius: 8, background: i === 0 ? BLUE : '#fff', color: i === 0 ? '#fff' : INK, fontSize: 12, fontWeight: 700, boxShadow: '0 0 0 1px rgba(20,22,31,.08)'}}>{day}</span>{label}
    </div>)}
   </div>
   {d.status && <div style={{marginTop: 26, ...pop(enter(130, 10))}}><Pill tone="warn">{d.status}</Pill></div>}
  </div>
  {d.emails.map((e, i) => { const at = 18 + i * 34; const p = enter(at); return <div key={i} style={{position: 'absolute', left: 500 + i * 34, top: 90 + i * 150, width: 620, background: '#fff', borderRadius: 14, boxShadow: '0 30px 60px rgba(20,22,31,.14), 0 0 0 1px rgba(20,22,31,.05)', overflow: 'hidden', zIndex: 3 - i, opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 160}px) rotate(${[-1, .8, -.4][i]}deg)`}}>
   <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: `1px solid ${LINE}`, fontSize: 12.5, color: MUTED}}>
    <span>To <b style={{color: INK}}>{e.to}</b></span><span style={{marginLeft: 'auto'}}>{e.when}</span>
   </div>
   <div style={{padding: '16px 20px 20px'}}>
    <div style={{fontSize: 19, fontWeight: 700, color: INK, minHeight: 24}}>{typed(e.subject, f, at + 8, 1.2)}</div>
    <div style={{position: 'relative', marginTop: 10, fontSize: 15.5, lineHeight: 1.6, whiteSpace: 'pre-line'}}>
     <span style={{visibility: 'hidden'}}>{e.body}</span>
     <span style={{position: 'absolute', inset: 0, color: '#3d3a33'}}>{typed(e.body, f, at + 22, 3.2)}</span>
    </div>
   </div>
  </div>; })}
 </Stage>;
};

// ---------------------------------------------------------------- phone: a vertical video plus its breakdown
const PhoneScene: React.FC<{d: Extract<Reel, {kind: 'phone'}>}> = ({d}) => {
 const sweep = useSweep(d.beats.length);
 const f = useCurrentFrame();
 const enter = useEnter();
 const words = d.onScreen.split(' ');
 return <Stage bg={d.bg ?? 'linear-gradient(160deg, #1b1d27, #0f1016)'} cam={2}>
  <div style={{position: 'absolute', left: 170, top: 70, width: 330, height: 660, borderRadius: 46, background: '#000', padding: 12, boxShadow: '0 40px 90px rgba(0,0,0,.5)', ...rise(enter(0), 80)}}>
   <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden'}}>
    <Img src={photo(d.photo)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${interpolate(f, [0, 240], [1.18, 1])})`}}/>
    <div style={{position: 'absolute', left: 18, right: 18, top: 120, textAlign: 'center', lineHeight: 1.9}}>
     {words.map((w, k) => <span key={k} style={{...pop(enter(16 + k * 5, 11)), background: '#fff', color: INK, padding: '4px 7px', margin: '0 2px', borderRadius: 8, fontSize: 21, fontWeight: 800}}>{w}</span>)}
    </div>
    <div style={{position: 'absolute', left: 16, right: 16, bottom: 22, color: '#fff', fontSize: 13, lineHeight: 1.4, textShadow: '0 1px 6px rgba(0,0,0,.6)'}}><b>{d.handle}</b><br/>{d.caption}</div>
   </div>
  </div>
  <div style={{position: 'absolute', left: 580, top: 90, right: 100, background: '#fff', borderRadius: 18, padding: '28px 30px', boxShadow: '0 40px 90px rgba(0,0,0,.35)', ...rise(enter(12), 50)}}>
   <Kicker>{d.kicker}</Kicker>
   <div style={{marginTop: 8, fontSize: 30, fontWeight: 700, letterSpacing: -1, color: INK}}>{d.title}</div>
   <div style={{marginTop: 20, display: 'flex', flexDirection: 'column', gap: 4}}>
    {d.beats.map(([t, line, role], i) => {
     const lit = Math.max(0, 1 - Math.abs(sweep - i - .5));
     return <div key={i} style={{...rise(enter(30 + i * 13), 14), display: 'grid', gridTemplateColumns: '64px 1fr 110px', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: `rgba(54,99,255,${lit * .08})`}}>
      <span style={{fontFamily: MONO, fontSize: 12.5, color: FAINT}}>{t}</span>
      <span style={{fontSize: 14.5, color: INK, fontWeight: i === 0 ? 700 : 500}}>{line}</span>
      <span style={{justifySelf: 'end'}}><Pill tone={i === 0 ? 'blue' : 'good'}>{role}</Pill></span>
     </div>;
    })}
   </div>
   <div style={{marginTop: 18, paddingTop: 14, borderTop: `1px solid ${LINE}`, display: 'flex', gap: 26, fontSize: 13, color: MUTED, ...rise(enter(30 + d.beats.length * 13), 10)}}>
    {d.stats.map(([k, v]) => <span key={k}>{k} <b style={{color: INK}}>{v}</b></span>)}
   </div>
  </div>
 </Stage>;
};

// ---------------------------------------------------------------- web: a landing page in a browser
const WebScene: React.FC<{d: Extract<Reel, {kind: 'web'}>}> = ({d}) => {
 const f = useCurrentFrame();
 const enter = useEnter();
 return <Stage bg={d.bg ?? 'linear-gradient(160deg, #e8ecf7, #dfe4f1)'} cam={1}>
  <div style={{position: 'absolute', left: 80, top: 70, width: 860, height: 640, background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 40px 90px rgba(20,22,31,.18)', ...rise(enter(0), 70)}}>
   <div style={{display: 'flex', alignItems: 'center', gap: 7, padding: '12px 16px', background: '#f3f2ef', borderBottom: `1px solid ${LINE}`}}>
    {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} style={{width: 11, height: 11, borderRadius: 11, background: c}}/>)}
    <span style={{marginLeft: 16, padding: '4px 14px', borderRadius: 7, background: '#fff', fontSize: 12, color: MUTED}}>{d.url}</span>
   </div>
   <div style={{display: 'grid', gridTemplateColumns: '1.05fr 1fr', height: 330}}>
    <div style={{padding: '48px 40px'}}>
     <Kicker color={BLUE}>{d.kicker}</Kicker>
     <div style={{position: 'relative', marginTop: 14, fontSize: 40, fontWeight: 700, letterSpacing: -1.6, lineHeight: 1.02}}>
      <span style={{visibility: 'hidden'}}>{d.headline}</span>
      <span style={{position: 'absolute', inset: 0, color: INK}}>{typed(d.headline, f, 16, 1.1)}</span>
     </div>
     <div style={{marginTop: 14, fontSize: 15, lineHeight: 1.55, color: MUTED, ...rise(enter(62), 12)}}>{d.sub}</div>
     <div style={{marginTop: 22, display: 'flex', gap: 10, ...rise(enter(74), 12)}}><span style={{background: INK, color: '#fff', padding: '11px 18px', borderRadius: 99, fontSize: 14, fontWeight: 700}}>{d.cta}</span><span style={{padding: '11px 18px', borderRadius: 99, fontSize: 14, fontWeight: 600, color: INK, boxShadow: '0 0 0 1px rgba(20,22,31,.15)'}}>See how it works</span></div>
    </div>
    <Img src={photo(d.photo)} style={{width: '100%', height: '100%', objectFit: 'cover', clipPath: `inset(0 0 0 ${(1 - enter(10, 24)) * 100}%)`}}/>
   </div>
   <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, padding: '30px 40px'}}>
    {d.points.map(([t, b], i) => <div key={t} style={rise(enter(90 + i * 10), 16)}><div style={{fontSize: 15, fontWeight: 700, color: INK}}>{t}</div><div style={{marginTop: 6, fontSize: 13, lineHeight: 1.5, color: MUTED}}>{b}</div></div>)}
   </div>
  </div>
  <div style={{position: 'absolute', left: 990, top: 170, width: 210, height: 440, background: '#fff', borderRadius: 30, border: '8px solid #14161f', overflow: 'hidden', boxShadow: '0 30px 70px rgba(20,22,31,.25)', ...rise(enter(120), 120)}}>
   <Img src={photo(d.photo)} style={{width: '100%', height: 150, objectFit: 'cover'}}/>
   <div style={{padding: 14}}>
    <div style={{fontSize: 18, fontWeight: 700, letterSpacing: -.6, lineHeight: 1.08, color: INK}}>{d.headline}</div>
    <div style={{marginTop: 10, background: INK, color: '#fff', padding: '9px 0', borderRadius: 99, fontSize: 12, fontWeight: 700, textAlign: 'center'}}>{d.cta}</div>
   </div>
  </div>
 </Stage>;
};

// ---------------------------------------------------------------- scorecard: checks with a verdict
const ScoreScene: React.FC<{d: Extract<Reel, {kind: 'score'}>}> = ({d}) => {
 const sweep = useSweep(d.checks.length);
 const enter = useEnter();
 const verdictAt = 30 + d.checks.length * 10;
 return <Stage bg={d.bg ?? '#ecebe6'} cam={0}>
  <div style={{position: 'absolute', left: 90, top: 90, width: 420, height: 620, borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 60px rgba(20,22,31,.18)', ...rise(enter(0), 60)}}>
   <Img src={photo(d.photo)} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
   <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: 26, background: 'linear-gradient(transparent, rgba(0,0,0,.75))', color: '#fff'}}>
    <div style={{fontSize: 12, letterSpacing: 2, fontWeight: 600, opacity: .8}}>{d.subjectKicker}</div>
    <div style={{marginTop: 8, fontSize: 24, fontWeight: 700, lineHeight: 1.2}}>{d.subject}</div>
   </div>
  </div>
  <div style={{position: 'absolute', left: 560, top: 70, right: 90, background: '#fff', borderRadius: 18, padding: '28px 32px', boxShadow: '0 30px 70px rgba(20,22,31,.14)', ...rise(enter(10), 60)}}>
   <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <div><Kicker>{d.kicker}</Kicker><div style={{marginTop: 6, fontSize: 30, fontWeight: 700, letterSpacing: -1, color: INK}}>{d.title}</div></div>
    <span style={{marginLeft: 'auto', opacity: Math.min(1, enter(verdictAt, 9) * 2), transform: `scale(${1.8 - .8 * enter(verdictAt, 9)}) rotate(${(1 - enter(verdictAt, 9)) * -8}deg)`, padding: '10px 18px', borderRadius: 12, background: d.verdictTone === 'good' ? GREEN : d.verdictTone === 'bad' ? RED : AMBER, color: '#fff', fontSize: 18, fontWeight: 800}}>{d.verdict}</span>
   </div>
   <div style={{marginTop: 18}}>
    {d.checks.map(([name, ok, why], i) => {
     const lit = Math.max(0, 1 - Math.abs(sweep - i - .5));
     return <div key={i} style={{...rise(enter(24 + i * 10), 12), display: 'grid', gridTemplateColumns: '170px 74px 1fr', alignItems: 'center', gap: 12, padding: '9px 10px', borderBottom: '1px solid #f3f1ec', background: `rgba(54,99,255,${lit * .06})`}}>
      <span style={{fontSize: 14, fontWeight: 600, color: INK}}>{name}</span>
      <span style={pop(enter(30 + i * 10, 10))}><Pill tone={ok === 'pass' ? 'good' : ok === 'fail' ? 'bad' : 'warn'}>{ok}</Pill></span>
      <span style={{fontSize: 13, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{why}</span>
     </div>;
    })}
   </div>
   {d.footer && <div style={{marginTop: 16, fontSize: 13.5, lineHeight: 1.5, color: '#3d3a33', ...rise(enter(verdictAt + 12), 10)}}><b>Fix first.</b> {d.footer}</div>}
  </div>
 </Stage>;
};

// ---------------------------------------------------------------- doc: one brief page beside a photo
const DocScene: React.FC<{d: Extract<Reel, {kind: 'doc'}>}> = ({d}) => {
 const f = useCurrentFrame();
 const enter = useEnter();
 const ph = enter(0);
 return <Stage bg={d.bg ?? '#e9e5dd'} cam={1}>
  <div style={{position: 'absolute', left: 90, top: 110, width: 470, height: 590, borderRadius: 18, overflow: 'hidden', opacity: Math.min(1, ph * 1.5), transform: `translateY(${(1 - ph) * 80}px) rotate(${-3 - (1 - ph) * 5}deg)`, boxShadow: '0 30px 60px rgba(20,22,31,.2)'}}>
   <Img src={photo(d.photo)} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
  </div>
  <Paper x={500} y={70} w={680} h={660} r={1.2} z={2} radius={10} p={enter(12)}>
   <div style={{padding: '38px 44px'}}>
    <div style={{display: 'flex', alignItems: 'center'}}><Kicker>{d.kicker}</Kicker><span style={{marginLeft: 'auto'}}><Mark/></span></div>
    <div style={{position: 'relative', marginTop: 14, fontSize: 36, fontWeight: 700, letterSpacing: -1.4, lineHeight: 1.04}}>
     <span style={{visibility: 'hidden'}}>{d.title}</span>
     <span style={{position: 'absolute', inset: 0, color: INK}}>{typed(d.title, f, 26, 1.3)}</span>
    </div>
    {d.subtitle && <div style={{marginTop: 4, fontFamily: SERIF, fontStyle: 'italic', fontSize: 28, color: BLUE, ...rise(enter(52), 10)}}>{d.subtitle}</div>}
    <div style={{marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16}}>
     {d.sections.map(([h, body], i) => <div key={h} style={rise(enter(60 + i * 16), 16)}>
      <div style={{fontSize: 12, letterSpacing: 1.6, color: FAINT, fontWeight: 700}}>{h.toUpperCase()}</div>
      {Array.isArray(body)
       ? <div style={{marginTop: 6, display: 'flex', flexDirection: 'column', gap: 5}}>{body.map((b, i) => <div key={i} style={{display: 'flex', gap: 10, fontSize: 14.5, lineHeight: 1.45, color: INK}}><span style={{color: BLUE, fontWeight: 700}}>{i + 1}</span><span>{b}</span></div>)}</div>
       : <div style={{marginTop: 6, fontSize: 14.5, lineHeight: 1.55, color: '#3d3a33'}}>{body}</div>}
     </div>)}
    </div>
   </div>
  </Paper>
 </Stage>;
};

const SCENES = {report: ReportScene, sheet: SheetScene, slides: SlidesScene, posts: PostsScene, emails: EmailsScene, phone: PhoneScene, web: WebScene, score: ScoreScene, doc: DocScene} as const;

export const SkillReel: React.FC<{slug: string}> = ({slug}) => {
 useFonts();
 const reel = REELS[slug] ?? REELS['distribution-report'];
 const Scene = SCENES[reel.kind] as React.FC<{d: typeof reel}>;
 return <Scene d={reel}/>;
};
