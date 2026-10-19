# Writing, choosing and copying a reference

## Contents
- Writing for the ear
- Writing for muted autoplay
- A launch sequence
- Other structures
- Copying a reference video
- Working the video-use way

## Writing for the ear

- One idea per line, under 12 words. Questions make good hooks ("Inbox on fire?").
- Name things the viewer can see. Every noun is a chance for a card, a word on screen or a gesture, and every visual beat keys off a spoken word.
- Hook in the first two seconds; for a product film, the product named by second eight; one action at the end.
- Short lines with a pause carry attitude ("Handled."). Use the gap after a line for a visual payoff.
- Write numbers and URLs as they are said ("acme dot app"); the screen shows the written form.
- Read every line aloud. If you stumble, the voice will too.

## Writing for muted autoplay

Most feeds play muted, so the on-screen text must tell the story alone. Either burn in captions for every spoken line, or make the headlines say what the voice says. On-screen text needs about three words a second to be read, fewer when it is big. Silent films ([06](films/06-finder-site-film-html.md), [08](films/08-skill-preview-loops.md)) carry everything in type and UI.

## A launch sequence

Ekos planned its launch as four videos with different jobs ([four-video-launch-strategy.txt](../assets/films/01-sf-launch-teaser/notes/four-video-launch-strategy.txt)):

1. **Category teaser:** the market shifted. No product. → [01](films/01-sf-launch-teaser.md) or [04](films/04-heard-manifesto.md).
2. **Hook piece:** the product dramatised in one emotional moment. → [03](films/03-jarvis-build-film.md) or [05](films/05-find-mascot-promo.md).
3. **Explanatory:** how it works, from the founder. → [02](films/02-explanatory-founder.md).
4. **Story:** the founder's own reason for building it.

Each later film assumes the viewer saw the one before. Release in that order.

## Other structures

1. **Before and after:** the old way in three to five quick frustrations, a hard cut, then the product doing it in one smooth take.
2. **One hard claim:** a single bold line on black, then proof shot by shot until the claim feels obvious.
3. **The demo in 30:** real UI from start to finish of one job, with captions naming each step and a timer on screen.

Rules for all of them: hook before second two, no logo first, end on one action.

## Copying a reference video

When the user says "like this", the reference is the brief. Study it before writing:

1. **Download it.** For X, YouTube, Instagram or TikTok use the latest yt-dlp, because older builds get 403 errors: `uvx --from "yt-dlp[default]@latest" yt-dlp -o ref.mp4 <url>`.
2. **Get the words.** Transcribe it with whisper to get the script and its timing. Some references have almost none: Whop's film had nine spoken words in 56 seconds.
3. **Get the cuts.** `ffmpeg -i ref.mp4 -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep pts_time` lists the cut points. Build a contact sheet at those times (`contact_sheet.py`).
4. **Measure the rhythm.** Count the shots and find the median shot length (a16z's film was 111 shots with a 0.8 s median), where black is used, and where the music breathes and hits.
5. **Look closely at the hard parts.** Step through 0.05-second crops of anything that moves in a special way, and ask how it was made. In the Pocketsflow promo the dither dots stay fixed to the screen while the character moves, which proves a coded 3D character, not an animated image.
6. **Write a teardown:** shot-by-shot timeline, transcript, visual system (type, colour, transitions) and the storytelling architecture. [whop-teardown.txt](../assets/films/01-sf-launch-teaser/notes/whop-teardown.txt) is a model.
7. **Match it** with the user's story. Keep what makes it work, change only the brand and the content, and do not add things it lacks (a founder on camera, a pitch, a new style) unless asked.

## Working the video-use way

For films cut from footage, follow browser-use's open-source [video-use](https://github.com/browser-use/video-use) method, as [03](films/03-jarvis-build-film.md) and [04](films/04-heard-manifesto.md) did:

1. Read sources as text (transcripts, contact sheets).
2. Get the strategy approved.
3. Drive the edit from a cut list file.
4. Extract and grade each segment on its own.
5. Check every cut boundary in the rendered file.
6. Keep a `project.md` session log beside the sources.
