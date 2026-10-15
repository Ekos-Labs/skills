import timeline from './timeline.json';

/* Everything time-based in the film reads from timeline.json, which prepare_audio.py writes from
   script.json: when each voice line starts, when each spoken word starts and ends, the mouth
   curve for the character, and the music offset. Key every visual beat to a word with w(),
   never to a hand-typed second, so a re-voiced line moves its visuals with it. */

export type Word={w:string;s:number;e:number};
export type Line={id:string;at:number;dur:number;file:string;text:string;words:Word[]};
type Timeline={fps:number;duration:number;lines:Line[];mouth:number[];sfx:string;
 music:null|{file:string;offset:number;volume:number}};
const tl=timeline as unknown as Timeline;

export const FPS=tl.fps;
export const F=(s:number)=>Math.round(s*FPS);
export const DURATION=tl.duration;
export const FRAMES=F(tl.duration);
export const LINES=tl.lines;
export const MOUTH=tl.mouth;
export const MUSIC=tl.music;
export const SFX_DIR=tl.sfx;

/** A voice line by id. Throws with a clear message so a typo shows up in the first still. */
export const L=(id:string)=>{
 const l=LINES.find(x=>x.id===id);
 if(!l)throw new Error(`No voice line "${id}" in timeline.json. Add it to script.json and run prepare_audio.py.`);
 return l;
};
/** Word i of line id (0-based, counted in the spoken text without [tags]). */
export const w=(id:string,i:number)=>{
 const l=L(id);const x=l.words[i];
 if(!x)throw new Error(`Line "${id}" has ${l.words.length} words ("${l.text}"), so word ${i} does not exist.`);
 return x;
};
export const lineEnd=(id:string)=>L(id).at+L(id).dur;
/** True while any voice line is playing, for ducking music under speech. */
export const speaking=(t:number)=>LINES.some(l=>t>l.at-.1&&t<l.at+l.dur+.1);
