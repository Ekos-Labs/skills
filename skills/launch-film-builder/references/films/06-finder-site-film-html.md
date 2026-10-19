# 06 · Finder promo (silent site film in HTML + GSAP)

Frames: [frames.jpg](../../assets/films/06-finder-site-film-html/frames.jpg) · Source: [source/index.html](../../assets/films/06-finder-site-film-html/source/index.html) plus the snap and export tools · Full beat table and decisions: [README.md](../../assets/films/06-finder-site-film-html/README.md)

## What it is

A 59-second, 16:9, white, silent motion film for a free tool (Finder at ekoslabs.com/find). It is one self-contained `index.html` built with HTML, CSS and GSAP. It plays like video in any browser, and is exported frame by frame to MP4 at 60 fps. Concept: **claim, then how, then result**. There are no hard cuts: every scene change is carried by the UI itself, and the film never asks for a call. It shows what the product makes, then names it.

Use it for: a tool whose output is visual (a report, a dashboard, a plan), a website hero or demo loop, and muted autoplay feeds. Pick it when the team would rather edit HTML than React.

## The Ekos cut

| Time | Beat |
|---|---|
| 0.0 to 4.6 | Opens in close-up on the **real homepage** inside a browser frame while the tool "reads" it: a scan line passes, three findings underline themselves and get labelled |
| 4.6 to 7.4 | The site shrinks to context; "It starts with your *homepage*" builds word by word |
| 7.4 to 12.2 | The input assembles, the URL types itself, the camera moves in on the button, the cursor presses it |
| 12.2 to 16.4 | Six evidence chips fly in and dock, a judgement model lights each one, then all collapse inward and become the report |
| 16.4 to 22.2 | The report card blooms out of depth; market bars fill; the first move appears |
| 22.2 to 28.9 | 200 dots stream out of the card over the product's own crowd footage, resolve into four reaction groups, and collapse back into the simulation panel |
| 28.9 to 54.3 | Competitors (revenue, growth, reviews), channels with reasons and named subreddits, decision makers, and a four-week plan held long enough to read. The card shrinks through a pill to a dot |
| 54.3 to 59.0 | The dot grows into the mark: "Finder · by Ekos Labs · free of cost · ekoslabs.com/find" |

## Look

- Every colour comes from the product's CSS: light background, ink, white surfaces, one accent. Type is the product's UI font with one Instrument Serif italic word per sentence.
- The background is never still: warm white, two drifting light fields, fine grain at 0.14, and a hairline curve crossing slowly.
- Signature motion: one container blooms out of the UI, changes its contents six times, and shrinks back to a dot that becomes the logo.
- Real assets: a live capture of the homepage, the product's hero video, real channel logos and the brand marks.
- Every figure is example data, badged `EXAMPLE OUTPUT` in every frame. Competitors are never named. The simulation carries the product's own disclaimer.

## How it was made

- Built with the open-source Bang Motion agent skill ([github.com/bangtutorial/bang-motion](https://github.com/bangtutorial/bang-motion)): one HTML file, a GSAP master timeline, scenes as nested timelines, and deterministic seeking.
- `?debug=1` adds a scrub panel. `snap.mjs` takes stills at chosen seconds for layout checks.
- Export: `export-frames.mjs` drives headless Chrome through every frame (`window.OPENER.seekFrame(t)` also seeks every `<video>` and waits for `seeked`), then ffmpeg encodes the PNG sequence:

```bash
URL="file://$PWD/index.html?clean=1" FPS=60 OUT=frames node export-frames.mjs
ffmpeg -framerate 60 -i frames/f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 16 -an out/film.mp4
```

The bundled `index.html` references its assets (`assets/ekos-home.png`, `find-bg.mp4`, brand marks, logos), which are not included. Replace them with the user's own.

## Make your own

1. Capture the user's real page at 2x (1440x1000) to open on.
2. List what the product produces, one beat per output, each held long enough to read.
3. Write one sentence per beat with one serif accent word.
4. Build the timeline in `index.html`, carrying every transition through the UI: things bloom, dock and collapse rather than cut.
5. Check stills at each beat, export frames, encode.
6. Leave it silent if it will autoplay in a feed. Add a music bed later if needed.
