# Finder promo — 16:9, white, silent

Motion graphic promo for the Finder lead magnet (`ekoslabs.com/find`). Built with the
[Bang Motion](https://github.com/bangtutorial/bang-motion) agent skill: one `index.html`
that plays like video in any browser, no build step, no player UI, no sound.

Deliverable: **`index.html`** — double-click it. 59 seconds, 1920 × 1080, autoplay, loops.
Rendered master: **`out/finder-promo.mp4`** (H.264, 60 fps, silent).

```sh
open index.html                 # watch it
open "index.html?debug=1"       # scrub panel for review (R = restart, Space = pause)
node tools/snap.mjs shots 2.9 24.5 32.4 40.2 51.5    # frames at key seconds, for checking layout
URL="file://$PWD/index.html?clean=1" FPS=60 OUT=frames node tools/export-frames.mjs
ffmpeg -framerate 60 -i frames/f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 16 -an out/finder-promo.mp4
```

`npm i` is only needed for the two tools (puppeteer). Nothing is needed to watch the file.

## The cut

Concept: **claim → how → result** (concept 15 in the skill's menu), chosen over "one feature
demoed" and "question answered diegetically" because Finder's proof is the artefact it
produces, and that artefact is visual. No hard cuts anywhere: every scene change is carried
by the UI itself.

| Time | Beat | On screen |
| --- | --- | --- |
| 0.0 – 4.6 | A homepage being read | Opens already in close-up on **the real ekoslabs.com**, inside a browser frame, while Finder reads it: a scan line passes, three findings underline themselves and label as offer, customer, market |
| 4.6 – 7.4 | Claim | The site shrinks to context, "It starts with your *homepage*" builds word by word |
| 7.4 – 12.2 | How: the input | The field assembles, `ekoslabs.com` types itself, the camera moves in on the button, the cursor presses it |
| 12.2 – 16.4 | How: evidence | Six evidence chips fly in and dock, JEV lights each one, then all of them collapse inward and become the report |
| 16.4 – 22.2 | Result: market | The report card arrives rotating out of depth, market bars fill, the first move appears |
| 22.2 – 28.9 | ✦ Result: 200 buyers | 200 dots stream out of the card, fill the frame **over the find page's own crowd footage**, resolve into four reaction groups, then collapse back in as the simulation panel |
| 28.9 – 35.6 | Result: competitors | Three comparable companies with monthly revenue, 30-day growth and their review scores |
| 35.6 – 42.4 | Result: channels | Four channels, each with the reason it was picked, then the subreddits named one by one |
| 42.4 – 46.6 | Result: people | Who can say yes, and what each of them does |
| 46.6 – 54.3 | Result: the plan | Four weeks assemble and hold long enough to read, then the card shrinks through pill to dot |
| 54.3 – 59.0 | Close | The dot grows into the Ekos mark, Finder, free of cost, ekoslabs.com/find |

Structure fingerprint (for the next piece to differ from):
`claim → how → result · 11 beats · real homepage read / sentence / typed input / evidence
gathered / report card blooms / 200 dots over real crowd / competitor revenue + reviews /
channels + subreddits / decision makers / four-week plan / mark born from the card ·
opens on the founder's own page mid-read · closes with the logo born from the result`

## What changed from V1 (37s → 59s)

1. **The page being read is real.** `assets/ekos-home.png` is a live capture of ekoslabs.com,
   shown inside a browser frame with the Ekos mark as its favicon. The typed URL is
   `ekoslabs.com` too, so the whole film is one honest run on one real site.
2. **Cleaner graphics.** Grain dropped from `.42` to `.14`, both light fields and the hairline
   curve pulled back, fewer and slower camera moves, one idea per pane.
3. **Longer, because the content earned it.** The beats that used to get cut now hold.
4. **Channels are shown properly** — four of them, each carrying the reason it was chosen,
   and the Reddit communities are named: r/SaaS, r/startups, r/Entrepreneur, r/B2BSaaS,
   r/marketing, r/YCombinator.
5. **Competitors are shown** — monthly revenue, 30-day growth and review scores.
6. **Four weeks, not three**, matching the product's own "four-week GTM plan", each week on
   screen long enough to read.
7. **Real brand assets.** `assets/brand/mark.png` and `wordmark-black.png` from the find app,
   and the channel rows use the find page's own `linkedin.svg`, `google.svg`, `reddit.svg`
   and `slack.svg` rather than lettered squares.
8. **The find page's own hero video** (`assets/find-bg.mp4`, the crowd with buyers highlighted
   in blue) appears twice: behind the 200 dots, and as the soft ground of the close.

## What the film shows that the site gates

On `ekoslabs.com/find`, the competitor benchmark, the channel detail, the decision makers and
the week-by-week plan sit behind the unlock. The film shows all of it. It never asks for a
call, a booking or a demo — there is no CTA language anywhere in the piece. The close is the
product name, who made it, that it costs nothing, and where it lives.

## Look

Everything comes from the product, not from a template.

- Palette, all sourced from `find/src/app/globals.css` light theme: background `#f7f7f8`,
  ink `#0a0a0c`, surface `#ffffff`, line `#e2e2e8`, muted `#606068`, faint `#96969f`, and a
  single accent `#3663ff`. The dark rectangle in beat 1 is a real screenshot, not a second
  colour; the channel logos are real brand marks, for the same reason.
- Type is the product's own UI font (Inter, plus Instrument Serif italic on one word per
  sentence) so the film reads as an extension of the page rather than an ad about it.
- The background is three layers and never still: warm white, two accent light fields
  drifting, fine grain, and one hairline curve crossing slowly behind the type.
- Signature motion: a container that blooms out of the UI, changes its contents six times,
  and later shrinks back through pill to dot. It produces the logo at the end.
- No sound at all. Everything reads silent, which is how it will be watched in a feed.

## Honesty

Every figure on the card is an example and the card is badged `EXAMPLE OUTPUT` in every frame
it appears. **Competitors are never named** and their revenue and review figures are
illustrative — the real ones come from `find/src/lib/public-traction.ts`, whose data is
licensed for internal sales research, so no API-derived value appears here. The audience
simulation carries the product's own disclaimer ("AI-modeled buyer reactions based on the
supplied evidence. This is not a survey of real people."). No client names, no customer logos,
no results claims.

## Files

```
index.html          the deliverable, self-contained (GSAP + fonts from CDN, everything else local)
assets/
  ekos-home.png     live capture of ekoslabs.com, 1440×1000 @2x
  find-bg.mp4       the find page's own hero video (public/main.mp4)
  find-bg-poster.jpg
  brand/            mark.png + wordmark-black.png, from find/public/brand
  logos/            linkedin, google, reddit, slack — from find/public/logos and public/logos
tools/              snap.mjs and export-frames.mjs, copied from the Bang Motion skill
out/                rendered master
shots*/             review frames from snap.mjs, safe to delete
frames/             PNG sequence from the last export, safe to delete
```

Video clips are exported deterministically: `window.OPENER.seekFrame(t)` sets each clip's
`currentTime` from the timeline and waits for `seeked` before the frame is captured, so the
PNG sequence is identical on every run.

The earlier vertical cut of this product lives in `../remotion` (Remotion, 9:16, dark, with
sound design). This one supersedes it for 16:9 and for white.
