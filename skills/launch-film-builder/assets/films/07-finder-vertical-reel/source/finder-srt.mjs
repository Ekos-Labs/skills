/* Burned-in captions are in the picture; this writes the same cues as a sidecar .srt for
   platforms that want an upload caption track. Reads the one timeline both the film and the
   sound design read. */
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const {captions}=JSON.parse(fs.readFileSync(path.join(root,'src/finder/timeline.json'),'utf8'));
const stamp=s=>{const h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=Math.floor(s%60),ms=Math.round((s%1)*1000);
 return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')},${String(ms).padStart(3,'0')}`;};
const srt=captions.map((c,i)=>`${i+1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n');
fs.mkdirSync(path.join(root,'out'),{recursive:true});
fs.writeFileSync(path.join(root,'out/finder-reel.srt'),srt);
console.log(`Wrote out/finder-reel.srt (${captions.length} cues)`);
