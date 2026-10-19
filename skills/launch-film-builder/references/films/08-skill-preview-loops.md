# 08 · Skill preview loops (the deliverable builds itself, 31 loops)

Frames: [frames.jpg](../../assets/films/08-skill-preview-loops/frames.jpg) · Source: [source/](../../assets/films/08-skill-preview-loops/source/)

## What it is

Short, silent, looping films, one per product feature or skill. Each shows the finished deliverable building itself on screen: pages slide in, rows fill, numbers count up, text types out. It holds on the result, then fades back to empty so the loop restarts cleanly. Ekos made 31 of them for its Skills store, each 8 seconds (240 frames at 30 fps), with four gallery stills.

Use it for: a catalogue, a store or a features page, launch posts for each feature, and anywhere many short, consistent previews are needed from one system.

## Two systems in the source

**`SkillReel.tsx` + `reels.ts`: real photography behind the result.** A slow camera drift over a free photo with the deliverable built on top. Each entry in `reels.ts` picks a template by `kind`:

| Kind | Shows |
|---|---|
| `report` | Report cover and sections |
| `sheet` | A spreadsheet with columns filling row by row |
| `slides` | Slide cards |
| `posts` | Social posts |
| `emails` | An email sequence with steps |
| `phone` | A phone screen with on-screen text |
| `web` | A landing page with headline, sub-line and call to action |
| `score` | A scored subject |
| `doc` | A one-page document with sections |

**`SkillDemo.tsx` + `demos.ts`: three clean styles rotating across the catalogue.**

| Style | Look |
|---|---|
| `agent` | Dark navy, an agent terminal on the left, a white result card on the right |
| `canvas` | A light editorial page with a big title; the result builds in the centre |
| `chat` | Light chat: the request, the agent's steps, then the result card |

Every company, person and number is fictional ("Acme", "Fernway"). The photos are free Unsplash images.

## How it was made

- One composition renders any entry: the slug picks the content, and the content picks the template.
- `render-skills.mjs` loops over every slug in the catalogue and renders each video plus stills at frames 70, 125, 165 and 192 (building, built, final hold) for the gallery. `stills` mode renders stills only, for a quick look.
- Fonts: Inter and Instrument Serif. Palette: a warm paper background with one accent per template.

## Make your own

1. List the features or skills and what each one produces.
2. Write one content entry per feature: the actual deliverable with realistic, clearly fictional data.
3. Reuse the templates. Add a new `kind` only when a deliverable looks like none of them.
4. Keep every loop the same length and rhythm: build (about 60%), hold (about 25%), fade back to empty.
5. Render all of them in one run; check the four stills of each in a contact sheet before publishing.
