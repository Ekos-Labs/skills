# 07 · Finder reel (9:16 dark product reel with synthesised sound)

Frames: [frames.jpg](../../assets/films/07-finder-vertical-reel/frames.jpg) · Source: [source/](../../assets/films/07-finder-vertical-reel/source/) · Build notes: [README.md](../../assets/films/07-finder-vertical-reel/README.md)

## What it is

A 40-second vertical reel (1080x1920, 30 fps) for the same free tool. Dark, built in Remotion on the explanatory film's tokens so the reel and the 16:9 films stay one system. It has no voice. A full sound design is synthesised from a cue list, and captions are burned in plus an SRT sidecar for upload.

Use it for: Reels, TikTok and Shorts launches of a product with a clear input-to-output story, when there is no voice or the team wants one system across formats.

## The Ekos cut

| Act | Time | On screen |
|---|---|---|
| Hook | 0.0 to 4.0 | The product page's own hero footage (an aerial crowd with buyers marked in the accent colour) as a band; market-signal fragments pin to the crowd, a scan pass collects them, the street dims and the name resolves |
| Input | 4.0 to 9.2 | The product's own intake pill. The URL types live, submits, and the first three read steps confirm |
| Engine | 9.2 to 15.2 | Three inputs (a judgement model, AI and the company's GTM data) joined on one accent bus, handed down into one report |
| Result | 15.2 to 28.4 | The report assembles: market, audience simulation, decision makers, communities and channels |
| Payoff | 28.4 to 37.0 | The sections collapse into a first month of work, then "Find the signal. *Move first.*" over the hero footage |
| CTA | 37.0 to 40.0 | Name, by Ekos Labs, free of cost, the URL |

## How it was made

- **One source of truth:** `source/timeline.json` holds the acts, caption cues, typing schedule and every audio cue. `copy.ts` holds every word on screen, with where in the product it came from.
- **Primitives:** `ui.tsx` re-exports the website tokens and re-cuts the type for vertical (about 1.6x the 16:9 sizes). Scenes live in `source/scenes/`.
- **Footage:** `prepare-finder-media.mjs` crops the site's hero video into a 1080x1180 band graded into the stage. A band stays sharp; a full-bleed 9:16 crop of 16:9 footage would be a 1.78x upscale. `HeroBand` owns the treatment, and the close reuses it so both ends match.
- **Sound:** `sound-design.py` synthesises the mix from the cue list:
  - a restrained 100 BPM bed with one root note per act;
  - keyboard entry locked to the typed frames;
  - three scan sweeps, act-cut impacts and section ticks;
  - a two-note confirm on submit and at the end;
  - mixed to about -17 LUFS, leaving room for a voiceover.
- **Captions:** a burned-in caption band (white Inter, no plate); `finder-srt.mjs` writes the SRT.

## Rules it keeps

- The website's palette and fonts, one accent, no rotation, blur, glass or loading bars.
- A mobile-safe box (x 80 to 1000, y 150 to 1560); nothing readable leaves it, and the band below 1560 stays clear for captions and platform UI.
- An example report with `EXAMPLE OUTPUT` badges, the product's own disclaimer on simulations, and a typed domain of `yourcompany.com`. No client names, logo grids or results claims.

## Make your own

1. Write `timeline.json` first: acts, captions, typing times and sound cues.
2. Put every on-screen word in a copy file, sourced from the real product.
3. Use the product's own hero footage as a graded band, not a stretched full-bleed.
4. Synthesise the sound from the same cue list, so picture and sound cannot drift apart.
5. Render stills per act, then the reel. Write the SRT from the same cues.

To add a voice later, put the dialogue stem next to the mix, add it as a second `<Audio>`, and lower the bed.
