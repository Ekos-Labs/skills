# 03 · Jarvis film ("It's time to build" shape, made the video-use way)

Frames: [frames.jpg](../../assets/films/03-jarvis-build-film/frames.jpg) · Source: [source/](../../assets/films/03-jarvis-build-film/source/) · Session log: [project.md](../../assets/films/03-jarvis-build-film/project.md)

## What it is

A 62-second cinematic manifesto in the shape of a16z's "It's time to build": a quiet cold open, a montage of builders, a gap, a turn on the music's first hit, the product as the assistant's own status lines, and a held mark. The product never speaks with a voice. It "talks" through on-screen messages, which also makes the film work muted.

Use it for: a launch where the product is an assistant or agent ("X, for Y"), told as a story with a reveal.

## The Ekos cut

62 s, 1920x1080, 30 fps, dark with stock b-roll.

| Time | Beat | On screen |
|---|---|---|
| 0.0 to 9.2 | Cold open | Dark room, a phone lights up. The assistant's message types in: "Good morning. While you slept, I found 14 companies hiring their first marketer. I wrote to 9 of them. 3 replied. One wants to talk on Thursday." |
| 9.2 to 26.0 | Builders | "Today, anyone can build." "A machine writes the *code*." "Designs the *product*." "Ships it *overnight*.", then a 3-second rush of 0.4 s cuts |
| 26.0 to 30.5 | The gap | "Building got *easy*." on black, "Selling *didn't*." over a man at a window, in the music's near silence |
| 30.5 to 33.6 | The turn | "Jarvis, *for marketing*." on the first big hit, over a laptop in candlelight; the camera pushes into the screen |
| 33.6 to 52.0 | The engine | Status panels: learning your business, 23 buyers found, 23 messages waiting for approval (an Approve click), tomorrow's posts, what worked this week. Every panel is tagged "Example" |
| 52.0 to 55.0 | Ownership | "Built around your business. *Yours to keep.*" over a craftsman's workshop |
| 55.0 to 62.0 | Mark | "You build. Ekos does *the rest*.", then the lockup and the URL |

## The video-use method

This film and "It's time to be heard" ([04](04-heard-manifesto.md)) were made the way browser-use's open-source [video-use](https://github.com/browser-use/video-use) edits video with a coding agent:

1. **Inventory first.** Collect sources into one folder and read them as text: transcripts with word times for anything spoken, and contact sheets for anything visual. Do not watch everything frame by frame.
2. **Strategy, then approval.** Write the structure, music plan and source list, and get a yes before cutting.
3. **An edit decision list (EDL) is the edit.** `source/edl.json` lists every clip: id, film time `at`, duration, source id, in point, optional pre-crop, and the beat it serves. Change the film by editing this file, not by hand-editing a timeline.
4. **Extract each segment separately and grade during extraction** (video-use rule 2). `source/prepare-jarvis.py` cuts every clip from its source with a 0.3 s spare tail, scales and crops to 1920x1080 at 30 fps, applies the grade, and caches the result. It also writes the music bed from its offset, a grain plate and synthesised effects.
5. **Render, then check every cut boundary** in the rendered file: stills at each cut and a contact sheet. Fix and re-render.
6. **Keep a session log.** `project.md` beside the sources records the strategy, decisions, the music and why, and what is outstanding, so the next session continues where this one stopped.

## Look

- Dark (`#09090b`), one accent, Inter with an Instrument Serif italic accent word on every line.
- Lines centred low over the footage, or top left for the assistant's messages, with the product mark as a small header.
- A light warm grade per shot at extraction, plus film grain (overlay at about 30%) and a vignette in Remotion.
- Product panels are the product's real UI on the dark canvas, each tagged "Example".
- No glass, no tilt, no progress bars.

## Sound

- Music: a free-to-use cinematic build. The track starts 3.75 s in, so its breath (29.75 to 34.25 s) sits on the gap and its downbeat (34.25 s) lands on the reveal. **Choose the track first and cut to its shape.**
- The music is the voice. Synthesised effects mark the typed messages and the Approve click.
- Master: two-pass loudness to -14 LUFS, -1.5 dBTP.

## Make your own

1. Write the cold open as a message from the product that shows a whole result in four short sentences.
2. Write 4 to 6 builder lines and two gap lines ("X got easy. Y didn't.").
3. Pick the music and mark its breath and its first big hit; the turn goes on the hit.
4. Source 20 to 30 b-roll clips. Drop anything with watermarks or other people's private messages, and crop off generator marks.
5. Build `edl.json` and run the prepare script. Write the composition from `source/Jarvis.tsx`; `parts.tsx` and `Engine.tsx` hold the line, panel and engine components.
6. Product panels show what the product really does, with example data labelled.

## Rules from review

- A new concept every time: do not reuse an earlier film's footage or idea.
- No made-up client results; engine numbers are labelled examples.
