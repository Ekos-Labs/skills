/* The Finder reel opens and closes on the same footage as the /find hero, so the film and the
   landing page read as one piece. Source: website/find/public/main.mp4 (the aerial crossing
   with buyers picked out in the brand blue), the exact file the site plays.

   Cropped to a near-square region and scaled to a 1080x1180 band rather than a full-bleed
   9:16 frame: covering 9:16 from a 16:9 source means a 1.78x upscale of a narrow slice, while
   the band is close to native resolution and stays sharp. The band's lower edge is faded into
   the stage inside the composition, so it still reads full bleed. */
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const src=path.resolve(root,'../../find/public/main.mp4');
const out=path.join(root,'public/find/hero-band.mp4');
if(!fs.existsSync(src))throw new Error(`Missing the /find hero video at ${src}`);
fs.mkdirSync(path.dirname(out),{recursive:true});
execFileSync('ffmpeg',['-y','-loglevel','error','-i',src,
 '-vf','crop=988:1080:466:0,scale=1080:1180:flags=lanczos,unsharp=5:5:0.45:5:5:0.0',
 '-an','-c:v','libx264','-crf','21','-preset','medium','-pix_fmt','yuv420p',out],{stdio:'inherit'});
const mb=(fs.statSync(out).size/1e6).toFixed(1);
console.log(`Wrote public/find/hero-band.mp4 (1080x1180, ${mb} MB)`);
