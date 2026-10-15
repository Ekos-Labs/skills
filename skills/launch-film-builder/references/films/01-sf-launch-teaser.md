# 01 · SF launch teaser (documentary collage, no narrator)

Frames: [frames.jpg](../../assets/films/01-sf-launch-teaser/frames.jpg) · Plan, teardown and sound kit: [notes/](../../assets/films/01-sf-launch-teaser/notes/)

## What it is

A 36-second category teaser that wins an argument before the company is named. No narrator. Real artefacts (archival photos, news chyrons, a tweet, interview bites, an AI chat box) stack up on a white canvas while one serif line at a time tells the story. Black is used only for the turns. It ends on three words and the mark. Built on the model of Whop's launch film: [whop-teardown.txt](../../assets/films/01-sf-launch-teaser/notes/whop-teardown.txt) is the shot-by-shot analysis that shaped it.

Use it for: a company launch or category claim ("the old way is over"), the first video in a launch sequence, and anywhere the product does not need to be shown yet.

## The Ekos cut, second by second

| Time | On screen | Line (serif, word by word) |
|---|---|---|
| 0 to 3 | Evolution illustrations, a caveman, Edison and a bulb, Einstein, the Wright Flyer: cut-out photos landing on white, overlapping | "It took humans thousands of years to evolve" |
| 3 to 5 | 1990s bullpen offices, cubicle farms stacking up | "before we were put here" |
| 5 to 7 | Black | "but some took the risk" |
| 7 to 12 | Young Musk at a desk, a rocket launch full frame, Jobs collage ("think different") | none |
| 12 to 14 | A GMA chyron: "Apple hits $1 trillion" | none (the chyron says it) |
| 14 to 18 | Young Zuckerberg photos, his commencement bite ("I don't know how to build a dam") with captions, a news article line zooming in macro with "the youngest billionaires" highlighted in yellow | the bite's words |
| 18 to 19 | Black | "but then..." |
| 19 to 24 | Sam Altman's ChatGPT launch tweet, news clippings of AI layoffs and data centres, a WEF interview bite ("I have engineers within Anthropic who say I don't write any code anymore") | the bite's words |
| 24 to 27 | An AI chat box typing "but were the giants built with prom..." | typed, not captioned |
| 27 to 32 | A collage of giants (Jobs, Gates, Jensen, Bezos, Google's first office) with the Nvidia, Airbnb and Amazon logos | "they were built on...." |
| 32 to 36 | White: "Trust." then "Trust. Attention. Distribution", then the EKOS ✦ LABS mark | the three words |

The planning document ([scene-breakdown.txt](../../assets/films/01-sf-launch-teaser/notes/scene-breakdown.txt)) has six acts and twenty scenes: precedent, the bullpen era, the giants, the AI shift, the doubt and its answer, and the mark. The cut kept that spine and tightened it.

## Look

- A white or very light canvas. Photos are cut-out rectangles with no frames, landing slightly overlapped and offset, so they build a collage instead of replacing each other. Each new photo arrives with a soft drop shadow.
- Captions in a light serif with a soft dark shadow, set in the middle of the frame over the collage, one short line per beat. Words appear one at a time.
- Found footage stays found: news chyrons, tickers, tweet chrome and interview lower thirds are left intact, because they are the proof.
- Black is used exactly twice, for the two turns ("but some took the risk", "but then..."). Using it more weakens it.
- One kinetic-type moment: macro on a news article with the key phrase highlighted, drifting out of focus.
- The end is plain: one word, then three, then the mark on white, held in silence.

## Sound

- One music bed under everything: a build that breathes at the black cards. The bed carries the montage, and the turns go nearly silent.
- An effect on every photo landing and every cut. The kit Ekos used ([sfx-kit.txt](../../assets/films/01-sf-launch-teaser/notes/sfx-kit.txt)) had:
  - sparkle touches for photos;
  - quick swooshes and transition snaps between beats;
  - a deep whoosh and an epic impact for the rocket;
  - a riser into the AI section;
  - keyboard typing for the chat box;
  - chalk on a blackboard for the formula;
  - a short bass hit for black cards.
  
  `prepare_audio.py` synthesises a similar family (pop, whoosh, stamp, key, click, swish).
- Real sound bites only where a famous person says the line better than a caption could. Caption every bite.
- **Caption timing trick:** voice the caption lines with ElevenLabs, take word timings from whisper (`prepare_audio.py` does both), animate the words on those times, then mute the voice. The captions read at speaking pace.

## How it was made

Claude wrote:
- the teardown of the reference film;
- the six-act story;
- the second-by-second pacing and sound plan;
- the hook options;
- where to find each artefact.

Claude also sourced the music and the effects. An editor cut the film from that plan with the sourced material, and the final file is a normal edit (`final.mov`).

To build it in code instead, use the template project:

1. Write the beats in `script.json` as caption lines (they will be muted), and run `prepare_audio.py` for word timings.
2. Make a `Collage` scene. Each photo is an `Img` at a hand-placed position and size, landing with `pop()` at its beat. Photos stay mounted so they pile up. Give each a subtle shadow and no rotation.
3. Draw captions with `Words` in the serif face, centred, white with a text shadow over photos and ink over plain white.
4. Play found clips (rocket, chyron, interview bites) with `OffthreadVideo` full frame, cut on the beats. Burn captions on the bites.
5. Make a `ChatBox` scene that types the question one character at a time, with key sounds.
6. End: white, a serif "Trust.", then the full line, then the mark. Hold 2 to 3 seconds.

## Make your own

- **Find the precedent.** What did people have to do the hard way before this shift? Collect 15 to 25 real artefacts: photos, headlines, tweets, short bites. Real artefacts are what make it feel authored; recreations make it feel like stock.
- **Write 6 to 9 short lines** that tell the story across the artefacts, with two turns ("but...") on black.
- **End on the answer** in at most three words, then the mark. Do not pitch the product in this film; the explanatory film does that.
- **Hook:** the first two seconds must carry the claim on their own, with sound off.

## Rules from review

- The hook needs real drama, a big recognisable moment, not a soft opener.
- It must not copy the reference beat for beat. Take the method (artefacts, typography, black turns), not its content.
- Rights: news clips, tweets and archival photos were acceptable for an organic post on a personal account. For ads or a company account, license them or replace them.
