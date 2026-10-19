# 05 · Find promo (talking 3D mascot, Pocketsflow style)

Frames: [frames.jpg](../../assets/films/05-find-mascot-promo/frames.jpg) · Original Ekos source: [source/](../../assets/films/05-find-mascot-promo/source/) · **Runnable starter: [assets/template/](../../assets/template/)** (the same film, made generic for "Acme")

## What it is

A 30 to 35 second product promo after a Pocketsflow spot. A coded 3D character talks (lip-synced to the voiceover), gestures with his hands and is drawn in dither dots that crawl as he moves. Headlines land word by word with one serif accent word. Cards, a phone console, a grid of live cards and a stamp move like the product. It renders as a 16:9 film and a 9:16 reel from one component.

Use it for: a product, a feature or a free tool (a lead magnet). It covers what it is, who it is for, what it does, a doubt, "try it", and the URL.

The Ekos film ran 33.6 s at 60 fps, for ekoslabs.com/find:
- Voice: ElevenLabs Jessica on eleven_v3 with tags.
- Music: a light clap track.
- Character: modelled on a clay render made in Gemini.
- Files: `ekos-find-promo-v3.mp4` (wide) and `-v3-reel.mp4` (vertical).

History:
- v1 used halftoned still images of the character.
- v2 replaced them with the coded character, after Eshaan noticed the reference's dots move inside its character.
- v3 added hands, a slimmer build and the vertical reel.

Start from the template, not from the original source. The template is the same system, made generic, tested from a clean install, and its timings follow the voice automatically. The character is documented in [character.md](../character.md), and the voice, timing and music pipeline in [voice-and-sound.md](../voice-and-sound.md).

## Scene recipes

Each scene in `src/Promo.tsx` is a component that takes `t` (seconds) and reads `useLay()` for the layout. Scene boundaries live in `T`, derived from line starts. Below, each scene's moves, the numbers that matter, and how its vertical layout differs. Replace the content freely; the moves are what make it feel produced.

## Contents
- Shared mechanics
- 1 Hook
- 2 Who it is for
- 3 What it does
- 4 The grid and the stamp
- 5 Proof line
- 6 Try it
- 7 The mark
- Sound
- Vertical layout rules
- Adding or removing a scene

## Shared mechanics

- `w(id,i)` gives `{s,e}`, the start and end of a spoken word. `L(id)` gives a line's `at` and `dur`.
- `pop(t, at, stiffness, damping)` is a spring that starts at second `at` with a little overshoot. Use it for anything that arrives: cards, buttons, the phone.
- `out3` and `inOut` are easings for things that travel: wipes, zooms, whips.
- `Words` lands words one by one on their spoken time, rising 0.35 em as they fade in. Give one item `serif` and `accent` to make it the accent word, and `underlineAt` to draw a hand-drawn line under it.
- `Card`, `Mono` (small grey labels like `// on air`), `Check` (the accent check badge) and `Grid` (240 px hairline grid) come from `kit.tsx`.
- Transitions overlap: the outgoing scene stays mounted a fraction of a second while the next one starts underneath. Keep the `T` offsets when you change scenes.

## 1 Hook

The character springs in from the right (`pop(t,0,120,14)`). He holds the `psst` pose: head turned to the text, wink held, open hand by his mouth. A small mono bubble types "psst.." while the whisper plays. On the hook line he turns front, and a beat after the accent word he winks. The headline is two lines, about 180 px in wide and 150 px in vertical. The second line ends on the accent word, which is bigger (230 px) and gets the underline as it is spoken.

Vertical: the character fills the bottom half (`y: 800`, size 1080) and the headline sits at the top.

## 2 Who it is for

A circle wipe in the accent colour grows from the accent word (`Wipe` at `T.wipe`, which is 0.73 s before the line). The scene is the accent colour with a faint white grid. The character sits at the left in wide and at the bottom in vertical. One white card pops per item on its word, with a little rotation unwinding as it lands. Each card holds a `// 01` label, an icon tile, a title and a mono sub-line. On exit the whole panel scales down to 38% toward where the next scene's phone will be (`transformOrigin`), rounding its corners as it goes. That reads as zooming out of the console.

Icons are simple SVG strokes in `ICONS`. Product screenshots or rendered objects work just as well.

## 3 What it does

A white scene with a small-big-small-small headline stack: "Acme reads every" at 64, the accent word at 200, then two lines at 66, the last ending on a second accent word. A phone console springs up from below: dark bezel, accent header with a count, then rows that pop in one after another (0.16 s apart) and flip from a pulsing "reading" to an accent "answered". The character peeks up from the bottom edge in the `peek` pose, looking at the phone. The scene leaves with a whip: a 900 px slide with a 14 px blur over 0.3 s.

Vertical: the headline is at the top left, the phone is right of centre from y 700, and the character peeks from the bottom left.

## 4 The grid and the stamp

The grid whips in from the right. Five cards (`GRID` holds both layouts): one tall card on the left and four around it, one of them the character's "on air" card. Each card is a tiny live demo of one job, and each lights up with an accent ring while its word is spoken (`act(A,B)`):

- a counter that climbs, with tag rows sliding in;
- a reply that types out, then the button flips to "Sent ✓";
- a progress track with steps filling;
- a chat bubble followed by a "closed" row with a check.

On the payoff word the stamp drops from 2.2x scale to 1x with a hard spring (`pop(t,stamp,320,15)`), rotated -7 degrees, over a white veil. A thin ring expands from the centre, and check badges pop on every card 0.06 s apart. In the character card he switches to `thumbs`.

Keep card copy short and concrete. The numbers are example data for a made-up shop; in a real film, use real capabilities and label demo numbers as examples.

## 5 Proof line

Hard cut to near-black with a faint grid. One line, with the middle word in serif. The character rises from the bottom right in the `skeptical` pose: one brow up, fist under his chin. On a dark background the dither still prints in paper and ink; if he gets lost in the dark, lighten `STYLE.sweater`.

## 6 Try it

The headline asks the viewer to do something. A pill input springs in. On the word after the object, the example link types in, and it must finish before the button press (`TYPE_DUR` is clamped to fit). On the action word the button presses (scale 0.95 for 0.12 s, label changes) and its ring turns the accent colour. On the result word a card rises with the result: a live answer typing out, labelled `// live answer · example`. The character points at it.

For a real product, show the real flow with a real example input. Keep the "example" label if the result is staged.

## 7 The mark

The wordmark springs in from 1.12x scale. Behind it, the character's head rises from the letters: he sits in a clip box whose bottom edge is the top of the lowercase letters, so he seems to stand behind the logo. He arrives in `front` and winks a second later. Below come "Try it free." with the serif accent, a button and the URL in mono, and a mono footer.

With an image logo, set the clip's bottom to the top edge of the letters in the image and keep the character centred over a gap or a round letter. Pass the clip's screen position as `ox`/`oy`.

## Sound

`SFX` lists one sound per visible event, keyed to the same words as the visuals:
- pop: arrivals;
- whoosh: wipes and zooms;
- swish: whips;
- stamp: the payoff;
- click: a button;
- key: one per typed character.

Volumes are 0.3 to 0.9, the stamp loudest. Music, if any, ducks to 65% under speech and fades over the last 2.2 seconds. [voice-and-sound.md](../voice-and-sound.md) covers the mix.

## Vertical layout rules

- Same story, same timing, its own positions. Work scene by scene with `v ? verticalValue : wideValue`.
- Stack instead of side by side: headline on top, character at the bottom, UI between.
- Platform UI covers the bottom ~320 px (caption, audio, buttons) and the right ~120 px (like, share). Keep headlines, buttons and URLs out of those zones. The character can sit there.
- Type is a little smaller than in wide but still big: headlines 124 to 176 px on a 1080 px wide frame.
- Grids become two columns. Rows of three cards become three narrower cards (320 px).
- Swipes and whips use the frame width (1080), not 900.

## Adding or removing a scene

1. Add or remove the voice line in `script.json` and re-run `prepare_audio.py`.
2. Add a boundary to `T` from the line's start.
3. Write the scene component with both layouts.
4. Mount it in `Promo` with `t>=T.x && t<T.next` (plus any overlap for transitions), add its sounds to `SFX`, and update the chapter labels.
5. Check stills at its first beat, its busiest moment and its exit, in both layouts.
