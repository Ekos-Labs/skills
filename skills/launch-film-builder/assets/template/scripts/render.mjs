/* Render a composition to MP4, or stills at chosen seconds for quick checks.
     node scripts/render.mjs PromoWide                         -> out/PromoWide.mp4
     node scripts/render.mjs PromoVertical --stills 1,4.5,9    -> out/stills/PromoVertical/*.jpg (half size)
   Options: --out <file>  --scale <n>  --concurrency <n>
   The character is WebGL. Headless Chrome needs a GL backend: angle by default; if frames come
   out blank or the render reports a WebGL error, try REMOTION_GL=swangle (or angle-egl on Linux). */
import {bundle} from '@remotion/bundler';
import {openBrowser,renderMedia,renderStill,selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';

const args=process.argv.slice(2);
const id=args[0];
if(!id||id.startsWith('--')){console.error('Usage: node scripts/render.mjs <CompositionId> [--stills 1,2.5] [--out file] [--scale n] [--concurrency n]');process.exit(1);}
const opt=(name,def)=>{const i=args.indexOf('--'+name);return i<0?def:args[i+1];};
const root=process.cwd();
const chromiumOptions={gl:process.env.REMOTION_GL||'angle'};
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const browser=await openBrowser('chrome',{chromiumOptions});
const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser,chromiumOptions});
const stills=opt('stills',null);
if(stills){
 const dir=path.join(root,'out/stills',id);fs.mkdirSync(dir,{recursive:true});
 for(const s of stills.split(',').map(Number)){
  const frame=Math.min(composition.durationInFrames-1,Math.round(s*composition.fps));
  const output=path.join(dir,`${s.toFixed(2).padStart(6,'0')}.jpg`);
  await renderStill({serveUrl,composition,frame,output,imageFormat:'jpeg',scale:Number(opt('scale',.5)),puppeteerInstance:browser,chromiumOptions});
  console.log('still',output);
 }
}else{
 const out=opt('out',`out/${id}.mp4`);fs.mkdirSync(path.dirname(path.join(root,out)),{recursive:true});
 let last=-1;
 await renderMedia({serveUrl,composition,outputLocation:out,codec:'h264',crf:17,pixelFormat:'yuv420p',scale:Number(opt('scale',1)),
  concurrency:Number(opt('concurrency',4)),puppeteerInstance:browser,chromiumOptions,
  onProgress:({progress})=>{const p=Math.floor(progress*100);if(p!==last&&p%10===0){last=p;console.log(`render ${p}%`);}}});
 console.log('rendered',out);
}
await browser.close({silent:true});
