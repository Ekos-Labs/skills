# Checking and delivering

## Stills first

Render stills (half size, seconds each) before any video:

- one per beat: the moment its word lands, plus a moment after it settles;
- every transition at its midpoint (wipe, zoom, whip);
- the busiest frame of each scene;
- the last frame;
- the same times in the vertical reel.

Then build a contact sheet with `contact_sheet.py` and look at the whole film at once.

Look for:

- **Overlap:** text under the character, cards over headlines, a headline running into the frame edge. Long words in the serif accent are wider than they look.
- **Timing:** a card, button or highlight that appears before its word. Compare the frame time with the word times `prepare_audio.py` printed.
- **Empty frames:** a scene that has not mounted yet, or one that unmounted too early. Check the `T` boundaries and overlaps.
- **Reel safe zones:** nothing important in the bottom 320 px or the right 120 px.
- **Character:** facing the thing he is reacting to, hands inside the frame, dots crawling rather than sliding (step through two stills 0.1 s apart).
- **Claims:** every capability shown exists, and every number that could be read as a result is real or labelled as an example.

## Render

```bash
node scripts/render.mjs PromoWide
node scripts/render.mjs PromoVertical
```

A 30-second film at 30 fps takes a few minutes per format on a recent laptop, and the 3D character costs the most. For a smoother crawl, set `"fps": 60` in `script.json`, re-run `prepare_audio.py` and render again; it takes about twice as long. Render at `--scale 0.5` for a quick full-motion review.

## Master and verify

1. Run `master.py` for each format, with `--preview` for a small copy to send around.
2. Run `contact_sheet.py` on each master at one time per scene. Every scene must be there, in order, in the right format.
3. Check the specs with `ffprobe`: 1920x1080 or 1080x1920, the fps you set, H.264 yuv420p, AAC 48 kHz, the duration you expect. The master prints its loudness (about -14 LUFS).
4. Watch the preview once with sound.

## Platform notes

- **X:** 16:9 or 1:1, up to 2:20 on standard accounts. Upload the master.
- **LinkedIn:** 16:9 or 1:1 in the feed, 9:16 works on mobile. Most people watch muted, so make sure the on-screen text tells the story.
- **Instagram Reels and TikTok:** 9:16, keep text out of the safe zones, and put the hook in the first second.
- **YouTube:** 16:9; Shorts are 9:16 and under 60 s.
- **Product Hunt and websites:** 16:9, muted autoplay. A captioned version helps.

## Deliver

- **Masters:** `<name>-wide.mp4` and `<name>-reel.mp4`, plus previews, in a folder the user chose.
- **`script.md`:** the final lines and what is on screen for each.
- **Notes:** which voice was used (and whether any stand-in remains), where the music came from and its terms, and where any third-party footage came from.
- **The project folder,** so they can change a line, re-run `prepare_audio.py` and render again.

Do not post or publish the film anywhere. The user does that.
