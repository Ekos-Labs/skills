# Finder launch reel

Vertical launch film for the Finder lead magnet (`ekoslabs.com/find`), built in this same
Remotion project so the reel and the 16:9 launch film stay one system.

Current take: **`out/finder-reel.mp4`**, 40 seconds · 1080 × 1920 · 30 fps, with
`out/finder-reel.srt` as an upload caption track.

```sh
npm ci
node scripts/prepare-finder-media.mjs           # -> public/find/hero-band.mp4 (from the live /find hero)
python3 scripts/sound-design.py                 # -> public/audio/finder/reel.wav (40s mix)
node scripts/render.mjs finder-stills 17.9,25.6 # stills into out/finder-stills
node scripts/render.mjs finder-preview          # -> out/finder-reel-preview.mp4 (540x960, ~20s)
node scripts/render.mjs finder                  # -> out/finder-reel.mp4
node scripts/render.mjs finder-4k               # -> out/finder-reel-4k.mp4 (2160x3840)
node scripts/finder-srt.mjs                     # -> out/finder-reel.srt
npx remotion studio src/index.ts                # composition id: FinderReel
```

The render script generates the mix and the hero band itself if they are missing, because
`public/audio/` and `public/find/` are gitignored (28 MB of generated media).

`finder-4k` upscales: the hero footage is 1080-native, so the 2160x3840 master gains nothing
on those two shots. Render it only if a platform demands the frame size.

## The cut

| Act | Time | On screen |
| --- | --- | --- |
| Hook | 0.0 – 4.0 | The /find hero footage, market-signal fragments pinned to the crowd, a scan pass collects them, the street dims and Finder resolves |
| Input | 4.0 – 9.2 | The product's own intake pill. The URL is typed live, submitted, and the first three read steps confirm |
| Engine | 9.2 – 15.2 | JEV, AI and GTM data joined on one accent bus, handed down into one report |
| Result | 15.2 – 28.4 | The report assembles: market, audience simulation, ICP, decision makers, communities and channels |
| Payoff | 28.4 – 37.0 | The five sections collapse into a first month of work, then "Find the signal. Move first." back over the hero footage |
| CTA | 37.0 – 40.0 | Finder by Ekos Labs, free of cost, `ekoslabs.com/find` |

## Files

```
src/finder/
  timeline.json      acts, caption cues, the typing schedule, every audio cue. One source of truth.
  copy.ts            every word on screen, with where in the product it came from
  ui.tsx             1080x1920 primitives on v3/kit.tsx tokens (type re-cut for vertical)
  Captions.tsx       burned-in caption band, white Inter, no plate
  FinderReel.tsx     the composition: fonts, mix, six sequences
  scenes/            Hook, Input, Engine, Report, Payoff, CTA
scripts/
  prepare-finder-media.mjs  cuts the /find hero video into the 1080x1180 band the reel uses
  sound-design.py    synthesises the mix from timeline.json's cue list
  finder-srt.mjs     writes the sidecar caption file from the same cues
```

`src/finder/ui.tsx` re-exports the v3 tokens rather than redefining them, so a palette change
on the website flows into both films. Type is the only thing re-cut: a 1080-wide frame needs
roughly 1.6x the sizes of the 16:9 film.

## Rules this cut keeps

Same rules as V3, because it is the same brand: one accent (`#3663ff`), no Z rotation, no
blur, no glass, no loading bars, website palette and fonts, burned-in captions with no plate.
Nothing readable leaves the mobile-safe box (`SAFE` in `ui.tsx`: x 80–1000, y 150–1560), and
the band below 1560 is kept clear for captions and platform chrome.

## Honesty rules this cut keeps

The reel shows an example report, not a customer's. Every report panel carries an
`EXAMPLE OUTPUT` badge, the audience simulation carries the product's own disclaimer
("AI-modeled buyer reactions based on the supplied evidence. This is not a survey of real
people."), and the typed domain is `yourcompany.com`. No client names, no logo grids, no
results claims. The engine act describes what the product actually does: JEV
(`jev-latest`, via `find/src/lib/typesafe.ts`) scores channel priority, evidence quality and
buyer reaction; the AI reads the submitted site; the GTM data is Ekos Labs' own channel
library and ICP patterns.

## The hero footage

The reel opens and closes on the same shot the /find landing page plays behind its headline:
`website/find/public/main.mp4`, the aerial crossing with buyers picked out in `#3663ff`.
Someone who sees the reel and then lands on the page recognises the frame immediately, and
the shot already carries the product's whole argument, which is that the buyer is in there
and you cannot pick them out unaided.

`scripts/prepare-finder-media.mjs` crops it to `public/find/hero-band.mp4`, 1080x1180. It is a
band with its lower edge graded into the stage, not a full-bleed 9:16 frame: covering 9:16
from a 16:9 source means a 1.78x upscale of a narrow slice, while the band is close to native
resolution and stays sharp. `HeroBand` in `scenes/Hook.tsx` owns the treatment (slow push in,
gradient, and a dim value the scene animates), and the close imports it so both ends of the
reel are graded by one component. Re-run the prepare script if the site's hero video changes.

## Audio

There is no ElevenLabs key anywhere in this workspace, so the reel has no voiceover. It runs
on sound design instead, synthesised by `scripts/sound-design.py` from the cue list in
`timeline.json`: a restrained 100 BPM bed with one root per act, keyboard entry locked to the
frames the URL is typed on, three scan sweeps, act-cut impacts, section ticks, and a two-note
confirm on submit and on the end card. Mixed to about -17 LUFS with a -1.5 dBTP ceiling, so
it sits under a voiceover if one is added later. To add narration, drop a dialogue stem in
`public/audio/finder/`, add it as a second `<Audio>` in `FinderReel.tsx`, and lower the bed
intensities in `timeline.json`.
