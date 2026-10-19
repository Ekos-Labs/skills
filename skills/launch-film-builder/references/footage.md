# Footage: sourcing, cutting, grading, film look

Used by the films built from real footage: [01 SF launch](films/01-sf-launch-teaser.md), [03 Jarvis](films/03-jarvis-build-film.md) and [04 Heard](films/04-heard-manifesto.md). The working scripts are [prepare-jarvis.py](../assets/films/03-jarvis-build-film/source/prepare-jarvis.py) (simple: one cut list, one grade) and [prepare-heard.py](../assets/films/04-heard-manifesto/source/prepare-heard.py) (full: sections fitted to music marks, per-shot crops, two grades, captions).

## Footage

- **Sources:** public-domain archives (Prelinger Archives on archive.org, NASA, Library of Congress, British Pathé where licensed), stock libraries the user has, and the user's own product capture. Clips from YouTube, Instagram or Pinterest are sometimes acceptable for an organic social post. They are not acceptable for paid ads. Confirm with the user.
- **Download** with the latest yt-dlp, since older builds get 403 errors: `uvx --from "yt-dlp[default]@latest" yt-dlp -f "bv*[height<=1080]+ba/b" -o "src/%(id)s.%(ext)s" <url>`.
- **Keep a shot list** in a JSON file next to `script.json`: id, source file, in point, out point, crop, and archival or modern. Prepare each shot once with ffmpeg and cache it by its settings:

```bash
ffmpeg -ss <in> -t <dur> -i <src> -vf "crop=<w>:<h>:<x>:<y>,scale=1440:1080,setsar=1,fps=30,<grade>" -an -c:v libx264 -crf 16 public/shots/<id>.mp4
```

- **Watch for:** burned-in timecodes, title cards and watermarks. Move the in point or crop past them. Check every prepared shot in a contact sheet before cutting with it.

## Finding footage with your agent

This is how the agent found every clip, sound bite and music track for films 01, 03 and 04. The footage itself is not bundled: it shows real people, news broadcasts and brand logos that are not ours to share. Use the method to find footage for a new film. Do not rebuild ours.

1. **Write the want list first.** One line per shot, saying what must be on screen, for example "town crier ringing a bell, archival" or "laptop glowing in a dark room, night". For each sound bite, write the exact sentence you want someone to say, and who might have said it.
2. **Search in parallel.** Run six to ten YouTube searches at once, each with a tag, so the results come back as one labelled list of id, length, title and channel:

```bash
Y(){ uvx --quiet --from "yt-dlp[default]@latest" yt-dlp "$@"; }
search(){ Y "ytsearch8:$1" --flat-playlist --print "%(id)s | %(duration_string)s | %(title).75s | %(channel).25s" 2>/dev/null | sed "s/^/[$2] /"; }
search "town crier ringing bell archival footage" A1 &
search "1930s printing press newspaper archival" A2 &
search "laptop screen glowing dark room night cinematic b-roll" B1 &
search "Jensen Huang keynote everybody is a programmer" S1 &
search "no copyright cinematic documentary music build up" M1 &
wait
```

   Search words that worked: "archival footage", "public domain", a decade ("1950s"), "cinematic b-roll 4k", "stock footage no copyright". For a bite, use the speaker, the event and a few words of the line. For music, use "no copyright" or "free to use" plus the mood.
3. **Choose from the list.** Prefer the official channel (the archive, the event, the company) over re-uploads. A bite from a 20-minute talk is fine, because you only cut 3 to 6 seconds of it. Check the length before downloading anything long.
4. **Download** at 1080p or below into `sources/`, bites into `bites/`, and name each file by its id. Download several at once:

```bash
cd sources
Y -q --no-warnings -f "bv*[height<=1080]+ba/b[height<=1080]" --merge-output-format mp4 -o "%(id)s.%(ext)s" -- <id> &
Y -q --no-warnings -f "ba" -x --audio-format wav -o "%(id)s.%(ext)s" -- <music-id> &
wait
```

   Errors such as 403 or "sign in" usually mean an old yt-dlp. Running it through `uvx ...@latest`, as above, fixes most of them. The same command downloads a reference film from an X or Instagram post URL.
5. **Find the exact words.** Transcribe each bite with word timestamps, search the transcript for the sentence, and take its in and out to two decimals:

```python
import mlx_whisper  # or faster_whisper on non-Mac machines
r = mlx_whisper.transcribe("bites/<id>.wav", path_or_hf_repo="mlx-community/whisper-large-v3-turbo", word_timestamps=True)
for s in r["segments"]:
    for w in s["words"]:
        print(f'{w["start"]:7.2f}-{w["end"]:7.2f} {w["word"]}')
```

   Extract audio first with `ffmpeg -i bites/<id>.mp4 -ac 1 -ar 16000 bites/<id>.wav`. Save each bite as `{"src": "<id>", "in": 238.75, "out": 244.1, "text": "..."}` in `script.json`; the text is used for the captions. Pad the in and out by about 0.1 s so the first and last syllables are not clipped.
6. **Check every shot before using it.** Make a contact sheet of each candidate with `contact_sheet.py` and look at it. Drop or crop shots with watermarks, burned-in timecodes, a generator mark (one factory shot had a "Veo" mark cropped off), a title card, or anything private on a screen (a lock screen with someone else's message was swapped out).
7. **Mark the music.** Find where the track breathes and where it hits, by listening or from its loudness curve, and write those seconds into `script.json`. The turn goes on the breath and the reveal or logo burst on the hit.
8. **Keep a source list** in `project.md`: every id, what it was used for, and the music credit. Before the film is posted, the user decides with that list which clips they may use where (see Sources above).

**Where the browser comes in.** Search and download run in the terminal; a browser is needed only for pages that need a login or a real page:
- Reading a reference post on X: the thread, the replies and the links the author shared. That is how the video-use method behind film 04 was found.
- Making images or clips in a generator such as Gemini or Google Flow, for example a character sheet or a shot no archive has.

Drive the user's own signed-in browser (Claude in Chrome or a computer-use tool) for these, never a password typed by the agent, and save every generated file into `sources/` next to the downloads.

**The edit itself** follows video-use, browser-use's open-source editing skill (MIT): inventory the sources, get the strategy approved, write an edit list, extract and grade the segments, render, and check every cut. Films [03](films/03-jarvis-build-film.md) and [04](films/04-heard-manifesto.md) show it step by step.

To study a reference film the same way: download it, transcribe it, and list its cuts with `ffmpeg -i ref.mp4 -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*"`. The gaps between the cut times give the shot lengths: a16z's film has a median shot of 0.8 s.

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

## A shot component in Remotion

For a 4:3 film, add a composition at 1440x1080 next to `PromoWide`. Drive it from the same `timeline.json`: add the narrator lines to `script.json` and keep the sound bites and shots in your own JSON. A shot component:

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
