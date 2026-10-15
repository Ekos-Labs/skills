# 02 · Explanatory launch (founder on camera, product built around him)

Frames: [frames.jpg](../../assets/films/02-explanatory-founder/frames.jpg) · Source: [source/](../../assets/films/02-explanatory-founder/source/) · Build notes: [README.md](../../assets/films/02-explanatory-founder/README.md) · Script, storyboard, motion and audio specs: [notes/](../../assets/films/02-explanatory-founder/notes/)

## What it is

An 89-second film whose spine is one continuous talking-head take of the founder. Remotion graphics come in over his live audio:
- the four pillars he names, set beside him;
- the company mark turning in;
- the real product (engine tree, channels, configurations, outbound, content, products) built as UI that changes state on his words;
- his prior-work numbers placed around him;
- a clean brand close.

Captions are burned in for the whole film.

Use it for: explaining what the company or product does, after the teaser. Trust comes from the founder's own voice; the graphics make the claims visible.

## The Ekos cut

89 s, 1920x1080, 30 fps. Exact times in the [storyboard](../../assets/films/02-explanatory-founder/notes/storyboard.md) and `source/Founder.tsx`.

- **0 to 16 s, founder on camera:** "the greatest companies are built on..."
  - At 3.36, 3.90, 4.48 and 5.60 s the words Trust, Attention, Distribution and System appear beside him, with one serif accent.
  - At "That's why I'm building Ekos Labs" (11.5 s) the mark turns in with the name beside him, and the engine's branches stack under it.
- **16 to 23 s:** hard cut into the graphics, five beats on the words, one panel at a time.
- **23 to 52 s, the engine** (copied from the website's own engine component):
  - context files light up;
  - channels are chosen;
  - the team rail fills with agents and tools;
  - three configurations cycle ("Different company. Different engine.").
- **Proof back on the founder:** 20M+ at 39.9 s, 4x at 42.2 s, 5000+ at 44.8 s, each with the attribution "From the founder's prior work".
- **Outbound:** a branch completes step by step, a lead opens, a message types from its context, then a three-touch sequence and human review.
- **Content and ads:** an asset library and theme pages (all labelled as an example configuration), Meta and ChatGPT ads.
- **Scale:** "Start with one working channel. Keep the foundation. Expand the engine."
- **Products:** real screenshots of Pocket CMO and Remy.
- **End:** the mark spins in, the lockup wipes out from it, then the tagline. Held.

## Look (Eshaan's rules after reviewing v2)

- The website's palette and fonts only: canvas `#09090b`, one accent `#3663ff`, Inter with an Instrument Serif italic accent word.
- No tilted cards, no glass or blur on UI, no progress bars, no rainbow accents. He said these "feel off" and read as a generic template.
- Captions: white serif, shadow only, no plate, phrase by phrase, always visible. Keep y ≥ 900 clear for them.
- Pillars and numbers sit **beside him on the footage**, not in a side panel.
- The engine visual must match the website's own component. Real product surfaces only, never invented dashboards.
- Volumes and examples are labelled; prior numbers carry their attribution.

## Sound

The founder's voice is primary; the music stays under it. The opening variant had four broadcast cuts of "AI". Music: restrained electronic, 95 to 110 BPM, lifting at the company reveal and resolving at the close ([audio-direction.md](../../assets/films/02-explanatory-founder/notes/audio-direction.md)). Sound effects sit only on state changes and never cover important words.

## How it was made

1. The founder recorded the script in one take ([script.md](../../assets/films/02-explanatory-founder/notes/script.md)). The film is timed to that performance, never to estimated reading speed.
2. The take was transcribed with word timestamps into `captions.json`; [prepare-v3-captions.py](../../assets/films/_shared/prepare-v3-captions.py) shows the approach.
3. `source/kit.tsx` holds tokens copied from the website's CSS, the type, Frame/Card/Tag/Pill, the logo map, icons, the camera and `retire()`, which keeps one panel visible at a time.
4. Scenes:
   - `Founder.tsx`: opening pillars and proof around him;
   - `Intro.tsx`;
   - `Engine.tsx`: tree, team and configurations;
   - `Outbound.tsx`;
   - `UGC.tsx`;
   - `Rest.tsx`: no copy, ads, review, scale, products and the end card.
   
   `FilmV3.tsx` assembles them, and `Captions.tsx` draws the captions.
5. Graphics start exactly on a cut in the performance (16.000 s).
6. One still per second across the whole film was checked before delivery.

## Make your own

- Record the founder first: one take, eye level, good light, script with clear handoff points ("That's why I'm building X").
- Transcribe the take for word times, and key every overlay to them.
- Rebuild the product's real UI in code from the website's components and tokens. Real surfaces earn trust.
- Alternate: founder, graphics, founder with proof around him, graphics, founder, close. Never leave a static frame longer than three seconds except the end card.
- Burn in captions throughout.

## Rules from review

- He picked Claude's v3 over a competing "liquid glass 3D" pass. Clean beats flashy.
- Use real assets (his reels, the site's own components). Blur personal footage thumbnails slightly so they read as footage without being identifiable.
- Shown proof: real numbers, attributed. Demo data is labelled as an example.
