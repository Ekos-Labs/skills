# The coded character

## Contents
- How he is made
- Restyle (colours, glasses, headset, dots)
- Reshape to match a reference image
- Poses and hands
- Adding a pose or a gesture
- Placing him in a scene
- Troubleshooting

## How he is made

`Mascot3D.tsx` builds him from three.js primitives inside a Remotion `ThreeCanvas`:
- spheres for the head, cheeks, ears, nose, eyes and sweater;
- capsules for the brows and arms;
- tori for the glasses and the smile;
- tubes for the headset band, the mic boom and the fringe edge.

Every material is a soft Phong "clay" whose shader ends in an 8x8 Bayer ordered dither: each pixel's brightness is compared with a fixed threshold pattern and printed as paper or ink.

The pattern is indexed by `gl_FragCoord`, the pixel's position on the screen, plus the canvas's offset on the frame. So the dots belong to the screen, not to him. When he turns, talks or slides in, his shapes move under a still dot grid and the dots appear to crawl. That crawl is the "motion design" look. A pre-rendered image moved around cannot do it.

The hair is one sphere shell, slightly bigger than the skull, cut in its own space by a hairline plane (lower at the back) and a forehead window under a side part. A tube runs along the cut to give the fringe a thick, rounded edge. Coordinates: x right, y up, z toward the camera, skull half-width 1, skull centre `C=.35`.

## Restyle

Edit `STYLE` at the top of `Mascot3D.tsx`:

- `skin`, `hands`, `hair`, `sweater`, `frames`, `headsetColor` are clay greys before dithering. Lighter values print more paper dots. Keep the hair clearly darker than the skin and the frames near black, or features disappear into the dots.
- `glasses` and `headset` turn those parts on or off.
- `paper` and `ink` are the two colours the dither prints with, as 0..1 RGB. A brand version: `paper: [1,1,1]`, `ink: [.21,.39,1]` prints him in the accent colour. On dark scenes he still prints in these two colours.
- `dot` is the dither cell in screen pixels: 4 suits 1080p, 3 is finer, 6 is chunkier and more graphic.

Lighting is in `MascotLights`: a strong key light from the upper left, a weak fill and a rim light from behind. More ambient light flattens him; less makes the shading, and so the dot gradients, stronger.

## Reshape to match a reference image

When the user has a character (a drawing, a clay render, a mascot), rebuild him to match it rather than pasting the image in.

1. **Get a straight front view.** If the user only has a description, generate a front-facing render of the character on a plain background with an image model, and get their approval first.
2. **Measure it.** Put the image on a grid in head units: the skull's half-width is 1. Read off the eye centres, the glasses radius, the nose and mouth heights, the ear position, the hair top, where the fringe starts and ends, and the chin.
3. **Change the parts list** in the JSX: positions, `scale` triples and `args`. Most likenesses come from five things: the head's width-to-height ratio, the hair silhouette, the eye size and spacing, the nose and the neck length.
4. **Compare side by side.** Render `CharacterTest` stills and put them next to the reference at the same size, then adjust. Expect three to six rounds; each still takes seconds.
5. **Hair** is the hardest part. If the reference has a part or a fringe, edit `HAIR_CUT`. It holds two lines in the hair's unit-sphere space (`p.x`, `p.y`): the fringe edge and the lock edge. Pixels below the fringe line and inside the lock line are cut to make the forehead window. Move the end points of the matching `rim` tube with them. For spiky or long hair, add capsules or ellipsoids on top of the shell.

Things that seem right but are not:
- Huge eyes and glasses look cartoonish. A clay character usually has small eyes behind big frames.
- A neck that is too long, or shoulders that are too wide, makes him look like a toy.
- Light hair on light skin turns into one white blob once it is dithered.

## Poses and hands

`Char.tsx` holds `MOODS`, one entry per pose:

- `yaw`, `pitch`, `roll`: head turn, in radians (about ±0.4 reads clearly).
- `look`, `lookY`: where the eyes point, -1..1.
- `smile` (0..1), `brow` (0..1, raises one brow more than the other), `wink` (held wink).
- `L`, `R`: arms. `L` is his right hand, on the screen's left.

An arm is `{g, elbow, wrist, dir, palm}`:
- `g` is the gesture: `open`, `point`, `fist` or `thumb`.
- `elbow` and `wrist` are points in his space.
- `dir` is where the fingers point.
- `palm` is the way the palm faces.

The shoulder is fixed. Arms not in use hang below the frame, and moving between poses blends to or from there, so hands rise into shot and drop out of it on their own. The visible square runs about x -2.3 to 2.3 and y -2.6 to 2.1. Keep hands inside it and in front of the body (z around 1).

Built-in poses:
- `front`
- `wink`: a wink beat on arrival.
- `psst`: open hand by the mouth.
- `peek`: looking up and right.
- `skeptical`: brow up, fist under the chin.
- `point`: pointing up and left.
- `thumbs`: thumbs up by the face, with a nod.

## Adding a pose or a gesture

- **Pose:** add an entry to `MOODS` and to the `Pose` type, then check it in `CharacterTest`. Start from the closest existing pose. A wave, for example, is `open` with `dir` up, `palm` toward the camera and the wrist beside the head; animate it by adding a small `Math.sin(t*8)` to the wrist x inside `Char`.
- **Gesture:** add a branch to `Hand` in `Mascot3D.tsx`. In hand space the wrist is at the origin, fingers point along +y, the palm faces +z, and the thumb side is `-side` on x. A peace sign is two extended finger capsules and two curled spheres.
- **Props** such as a phone, a vinyl record or a cart are separate meshes. Parent them to a hand by putting them inside the hand's group in the arm map, or place them in the scene inside the same `ThreeCanvas`. Give them the same dithered materials (`useMat`) so they print like him.

## Placing him in a scene

`<Char keys={[['front',0],['wink',w('v3',7).e]]} x={…} y={…} size={…} t={t}/>` draws a square canvas with the bust framed like a portrait: head near the top, shoulders at the bottom edge.

- To have him peek from an edge, animate `y` past the frame edge.
- For a head-only peek behind something, put him in a clipping box (`overflow: hidden`) and slide him up inside it.
- Inside any positioned box, pass the box's screen position as `ox`/`oy` so the dots stay locked to the frame.
- His mouth follows `timeline.json`'s `mouth` curve, the loudness of the voice per frame. The narrator's voice is his voice. If a scene has other speakers, zero `talk` there.

## Troubleshooting

- **Blank canvas in renders, fine in the studio:** no WebGL backend in headless Chrome. Use `REMOTION_GL=angle` (the default), or `swangle` or `angle-egl`.
- **"width prop must be an integer":** round any computed canvas size.
- **Dots slide with him:** `ox`/`oy` are missing on a nested `Char`.
- **A shape vanishes at some angles:** it is inside another shape. Push it outward on z.
- **The hair cut also cuts the brows:** brows must use the uncut `lock` material, not `hair`.
- **Slow renders:** keep only the characters on screen mounted, and keep sphere segment counts modest (64x64 is plenty for the head).
