// Renders the Ekos Skills demo videos and their stills into the website's public folder.
//   node scripts/render-skills.mjs                 all skills
//   node scripts/render-skills.mjs stills a,b,c    stills only, for a quick look
//   node scripts/render-skills.mjs videos a,b,c    selected skills only
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const root = process.cwd();
const mode = process.argv[2] || 'videos';
const compId = process.env.SKILL_COMP || 'SkillDemo';
const only = process.argv[3] ? process.argv[3].split(',') : null;

const dataFile = fs.readFileSync(path.join(root, '../../src/app/skills/skills-data.ts'), 'utf8');
const slugs = [...dataFile.matchAll(/slug: "([^"]+)"/g)].map((m) => m[1]).filter((s) => !only || only.includes(s));

const outDir = process.env.SKILL_OUT ? path.join(root, process.env.SKILL_OUT) : path.join(root, '../../public/skills/videos');
const stillDir = mode === 'stills' ? path.join(root, 'out/skill-stills') : outDir;
fs.mkdirSync(outDir, {recursive: true});
fs.mkdirSync(stillDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public')});
const localChrome = '<optional-local-chrome-headless-shell>';
const chromiumOptions = {gl: 'angle'};
const browser = await openBrowser('chrome', {browserExecutable: fs.existsSync(localChrome) ? localChrome : undefined, chromiumOptions});

// Thumbnails for the website gallery: the result building, built, and the final hold.
const STILL_FRAMES = [70, 125, 165, 192];

for (const slug of slugs) {
  const inputProps = {slug};
  const composition = await selectComposition({serveUrl, id: compId, inputProps, puppeteerInstance: browser, chromiumOptions});
  for (const [k, frame] of STILL_FRAMES.entries()) {
    await renderStill({serveUrl, composition, inputProps, frame, output: path.join(stillDir, `${slug}-${k + 1}.jpg`), imageFormat: 'jpeg', jpegQuality: 82, scale: mode === 'stills' ? 0.5 : 0.75, puppeteerInstance: browser, chromiumOptions});
  }
  if (mode !== 'stills') {
    await renderMedia({serveUrl, composition, inputProps, outputLocation: path.join(outDir, `${slug}.mp4`), codec: 'h264', crf: 27, pixelFormat: 'yuv420p', muted: true, concurrency: 4, puppeteerInstance: browser, chromiumOptions});
  }
  console.log('done', slug);
}
await browser.close({silent: true});
