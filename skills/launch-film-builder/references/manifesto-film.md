# Manifesto film (the a16z method)

A belief film: one narrator, real archival sound bites, footage cut under a second a shot, a burst of names on the music's downbeat, and the mark at the end. No pitch. Ekos made one ("It's time to be heard") after a16z's "It's time to build".

## Contents
- Structure
- Footage
- The look
- Sound
- Building it in the template
- Captions

## Structure

Write the narration first, as a manifesto: 10 to 16 short lines, present tense, "we" or "you", no product claims. Then cut it against:
- archival sound bites: real voices from history saying a line that fits;
- footage of the old world, then the new;
- one or two product or UI shots, only if the user wants them.

Beats: cold open, old world, the turn, the belief, the downbeat burst, the mark ([film-patterns.md](film-patterns.md)).

Rules from doing it:

- **The narrator carries the film; footage illustrates every line.** Cut on the words: a new shot at the start of each phrase and on strong nouns.
- **Shots last 0.4 to 1.2 seconds**, and longer only on the turn and the last line.
- **No founder on camera** unless asked; this format is about the idea.
- **Caption the speech** (see Captions); most people watch muted.
- **Do not let the second half turn into an ad.** If the film starts listing features, cut back to the belief.

## Footage

- **Sources:** public-domain archives (Prelinger Archives on archive.org, NASA, Library of Congress, British Pathé where licensed), stock libraries the user has, and the user's own product capture. Clips from YouTube, Instagram or Pinterest are sometimes acceptable for an organic social post. They are not acceptable for paid ads. Confirm with the user.
- **Download** with the latest yt-dlp, since older builds get 403 errors: `uvx --from "yt-dlp[default]@latest" yt-dlp -f "bv*[height<=1080]+ba/b" -o "src/%(id)s.%(ext)s" <url>`.
- **Keep a shot list** in a JSON file next to `script.json`: id, source file, in point, out point, crop, and archival or modern. Prepare each shot once with ffmpeg and cache it by its settings:

```bash
ffmpeg -ss <in> -t <dur> -i <src> -vf "crop=<w>:<h>:<x>:<y>,scale=1440:1080,setsar=1,fps=30,<grade>" -an -c:v libx264 -crf 16 public/shots/<id>.mp4
```

- **Watch for:** burned-in timecodes, title cards and watermarks. Move the in point or crop past them. Check every prepared shot in a contact sheet before cutting with it.

## The look

- **Frame:** 4:3 (1440x1080) reads as film and archive. Show modern UI inside the 4:3 frame too.
- **Grades,** applied with ffmpeg when preparing shots:
  - archival: `eq=contrast=1.12:brightness=-0.01:saturation=0.9,colorbalance=rs=0.05:gs=0.01:bs=-0.05:rm=0.04:bm=-0.04,curves=master='0/0.02 0.25/0.22 0.75/0.8 1/0.97'`
  - modern: `eq=contrast=1.08:brightness=-0.02:saturation=0.8,colorbalance=rs=0.03:bs=-0.03:rm=0.03:bm=-0.02:rh=0.05:bh=-0.04,curves=master='0/0.02 0.25/0.22 0.75/0.78 1/0.97'`
- **Gate weave and flicker on archival shots:** a deterministic per-frame jitter of about ±1 px and ±3.5% brightness (see the code below).
- **A slow push** on every shot: scale from 1.02 by 0.02 to 0.04 over the shot.
- **Grain:** make a 2-second loop once, then overlay it at 30% with `mixBlendMode: 'overlay'`:

```bash
ffmpeg -f lavfi -i color=c=gray:s=1440x1080:d=2:r=30 -vf "noise=alls=40:allf=t+u,format=yuv420p" -c:v libx264 -crf 18 public/grain.mp4
```

- **Vignette:** a radial gradient from transparent to 60% black at the edges.

## Sound

- **Music:** an orchestral or piano build with one clear downbeat. Put the downbeat where the burst starts; `prepare_audio.py` lines the track up with `kick` and `kick_at`.
- **Music level:** duck to about 40% under the narrator and 25% under sound bites after the downbeat. Fade in over the first two seconds and out under the mark.
- **Sound bites:** cut them from the source with short fades and normalise each to -18 LUFS. Leave a breath before and after.
- **Narrator:** a calm, low voice. On ElevenLabs, `eleven_multilingual_v2` with stability around 0.55 gives an even read. A light `aecho=0.8:0.6:45|90:0.08|0.05` adds space.
- **Optional:** a bell or a single hit on the cold open and on the mark.

## Building it in the template

Add a composition next to `PromoWide` at 1440x1080. Drive it from the same `timeline.json`: add the narrator lines to `script.json` and keep the sound bites and shots in your own JSON. A shot component:

```tsx
const rnd=(n:number)=>{const x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const Shot=({file,dur,archival}:{file:string;dur:number;archival:boolean})=>{
 const f=useCurrentFrame();const p=clamp(f/F(dur));
 const wx=archival?(rnd(f)-.5)*2.2:0,wy=archival?(rnd(f*1.7)-.5)*1.6:0;
 const flick=archival?1+(rnd(f*3.1)-.5)*.07:1;
 return <AbsoluteFill style={{background:'#000',overflow:'hidden'}}>
  <AbsoluteFill style={{filter:`brightness(${flick})`,transform:`translate(${wx}px,${wy}px) scale(${1.02+.03*Math.sin(p*Math.PI/2)})`}}>
   <OffthreadVideo src={staticFile(file)} muted style={{width:1440,height:1080}}/>
  </AbsoluteFill>
 </AbsoluteFill>;
};
```

Mount each shot in a `<Sequence from={F(at)} durationInFrames={F(dur)}>`, then lay the grain, vignette and captions over everything.

The burst: on the downbeat, show one logo or name every third of a second, centred and big, over a 50% black veil. Only use logos of tools or channels the product actually uses or connects to, never of customers it does not have.

The mark: the logo fades in clean, or is first filled with a texture of the film's own words, then turns clean, then the URL appears. Hold it two to three seconds after the music resolves.

## Captions

`Captions` in `kit.tsx` builds phrases from the voice lines' word timings: up to seven words, broken at punctuation, never overlapping. It draws them in white Inter with a soft shadow, 78 px from the bottom (in a reel, raise this above 320 px). Render a captioned version and a clean version, since some platforms add their own captions. Sound bites need captions too: add them as lines in `script.json` with their own file, or write their captions by hand.
