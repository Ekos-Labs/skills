import {bundle} from '@remotion/bundler';
import {renderStill,renderMedia,selectComposition,openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const mode=process.argv[2]||'preview';
const root=process.cwd();
const isFinder=mode.startsWith('finder');
const isJarvis=mode.startsWith('jarvis')||mode.startsWith('heard')||mode.startsWith('findpromo')||mode.startsWith('mascot');
fs.mkdirSync(path.join(root,'out'),{recursive:true});
/* The Finder reel's mix and hero band are generated, not committed (both paths are gitignored). */
if(isFinder&&!fs.existsSync(path.join(root,'public/find/hero-band.mp4'))){
 console.log('Preparing the Finder hero footage');
 const r=spawnSync('node',['scripts/prepare-finder-media.mjs'],{stdio:'inherit'});
 if(r.status!==0)throw new Error('prepare-finder-media.mjs failed');
}
if(isFinder&&!fs.existsSync(path.join(root,'public/audio/finder/reel.wav'))){
 console.log('Generating the Finder mix');
 const r=spawnSync('python3',['scripts/sound-design.py'],{stdio:'inherit'});
 if(r.status!==0)throw new Error('sound-design.py failed');
}
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public'),onProgress:p=>{if(p===100)console.log('Bundle ready');}});
const localChrome='<optional-local-chrome-headless-shell>';
const chromiumOptions={gl:'angle'};
const browser=await openBrowser('chrome',{browserExecutable:fs.existsSync(localChrome)?localChrome:undefined,chromiumOptions});
const composition=await selectComposition({serveUrl,id:mode.startsWith('mascot')?'EkosMascotTest':mode.startsWith('findpromo-v')?'EkosFindPromoVertical':mode.startsWith('findpromo')?'EkosFindPromo':mode.startsWith('heard')?(mode.includes('captions')?'EkosHeardCaptions':'EkosHeard'):isJarvis?'EkosJarvis':isFinder?(mode==='finder-4k'?'FinderReel4K':'FinderReel'):mode==='study'?'EkosMotionStudy':mode.startsWith('v3')?'EkosLaunchV3':mode.startsWith('v2')?'EkosLaunchV2':mode==='4k'?'EkosLaunch4K':'EkosLaunch',puppeteerInstance:browser,chromiumOptions});
if(mode.endsWith('stills')){
 const points=process.argv[3]?process.argv[3].split(',').map(Number):mode==='finder-stills'?[1,2.2,3.6,5.2,7.4,8.8,10.2,11.6,14,16,18.4,20.6,22.8,25,27.2,29.6,32,35.2,38.4]:mode==='v2-stills'?[22.9,23.3,24.7,26,28.2,29.8,31.5,34.3,37.2,40.5,44.8,50.6,53.2,55.2,57.6,61.6,63.4,65.7,67.1,68.5,71.8,75.1,77.8,80.1,83.3,87]:[1.2,4.8,8.7,11.8,14.8,22.6,24.3,28,33.6,37,47.9,50.8,55.8,59.5,68.9,71.9,77.5,83.5,86.9];
 const stillDir=mode==='mascot-stills'?'out/mascot-stills':mode==='findpromo-v-stills'?'out/findpromo-v-stills':mode==='findpromo-stills'?'out/findpromo-stills':mode==='heard-stills'?'out/heard-stills':mode==='jarvis-stills'?'out/jarvis-stills':mode==='finder-stills'?'out/finder-stills':mode==='v3-stills'?'out/v3-stills':mode==='v2-stills'?'out/v2-stills':'out/stills';fs.mkdirSync(stillDir,{recursive:true});
 for(const t of points){await renderStill({serveUrl,composition,frame:Math.round(t*composition.fps),output:`${stillDir}/${String(t).padStart(4,'0')}.jpg`,imageFormat:'jpeg',scale:.5,puppeteerInstance:browser,chromiumOptions});console.log('Still',t);}
}else{
 let last=-1;
 await renderMedia({serveUrl,composition,outputLocation:isJarvis?`out/ekos-${mode}.mp4`:isFinder?`out/${mode==='finder'?'finder-reel':'finder-reel-'+mode.slice(7)}.mp4`:`out/ekos-launch-${mode}.mp4`,codec:'h264',crf:isJarvis?17:mode==='4k'||mode==='v3-4k'||mode==='finder-4k'?18:mode==='finder'?18:19,pixelFormat:'yuv420p',scale:mode==='jarvis-preview'?.5:mode==='finder-preview'?.5:mode==='v3-4k'?2:mode==='preview'||mode==='v2-preview'?.5:1,concurrency:4,puppeteerInstance:browser,chromiumOptions,onProgress:({progress})=>{const p=Math.floor(progress*100);if(p!==last&&p%5===0){last=p;console.log(`Render ${p}%`);}}});
 console.log('Rendered '+(isFinder?(mode==='finder'?'out/finder-reel.mp4':'out/finder-reel-'+mode.slice(7)+'.mp4'):`out/ekos-launch-${mode}.mp4`));
}
await browser.close({silent:true});
