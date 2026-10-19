# 04 · "It's time to be heard" (a16z manifesto, made the video-use way)

Shots: the section list below and `script.json` (no frame sheet: the film is built from real people, archival and news footage that are not ours to share) · How every clip, bite and track was found: [footage.md](../footage.md#finding-footage-with-your-agent) · Source: [source/](../../assets/films/04-heard-manifesto/source/) (`script.json` is the whole edit) · Session log, v1 to v5: [project.md](../../assets/films/04-heard-manifesto/project.md)

The final film is `ekos-its-time-to-be-heard-v5-captions.mp4`: 101.6 s, 1440x1080 (4:3), 30 fps, captions burned in, plus a clean version without captions.

## What it is

A belief film with no product pitch. One calm narrator is cut against real archival and famous sound bites, footage changes under a second a shot, the score breathes and drops, the channel logos burst on the downbeat, and the mark arrives built from words. The model is a16z's "It's time to build" and browser-use's film made with video-use (a narrator, famous category bites, one closing line). Both were studied, then followed closely.

Use it for: a company or category launch, a "why now" film, or a film people share for the idea rather than the product.

## How a16z's film works (measured)

105 s and 111 shots, with a median shot of 0.8 s and bursts of 0.2 s cuts. 4:3 with grain and a warm grade. A manifesto narrator against real archival bites (news, NASA, founders), a score that swells, breathes and peaks, mythic interludes, a burst of portfolio logos, and a mark textured with portfolio names.

## The Ekos cut (v5)

The history of being heard, from town criers to AI agents. Sections from `script.json`, in order:

1. **Open:** a town crier. Narrator: "Everything we ever built had to be carried to the world."
2. **Criers and presses:** 11 shots. A 1930s newsboy bite: "Extra, extra, read all about it!"
3. **Voice, paper, wire:** "By voice." "By paper." "By wire." Three lines, three shots.
4. **Broadcast:** the NBC chimes, 8 shots of early radio and TV.
5. **Ogilvy:** David Ogilvy's own voice across 10 shots: "When I started Ogilvy and Mather, New York, nobody had heard of us." "Every four weeks, I sent personalized mailings to our new business prospects." "That was how we grew."
6. **Internet:** AOL's "You've got mail." "Then everyone got a voice."
7. **Attention:** Gary Vaynerchuk: "Attention is how nations were built." "Attention is the singular asset of the human race."
8. **Anyone can build:** Jensen Huang: "Everybody in the world is now a programmer." Narrator: "Now, anyone can build anything."
9. **Louder:** 14 fast shots. "So the world has never been louder."
10. **The turn,** on the music's drop:
    - "Building was never the hard part. Being heard is."
    - "For a hundred years, we did it by hand. Door by door. Letter by letter. Post by post." Over a 1961 door-to-door salesman, a 1956 postal film, mail sorting and a social feed.
    - "Now, the machines will carry it." Over Claude computer use and an OpenAI agent.
    - An unnamed assistant (a second voice): "Good morning. While you slept, I found fourteen companies hiring their first marketer."
11. **Finale,** on the downbeat, 30 shots:
    - Sam Altman at TED: "Hey, go do this task for my job, and it goes off and clicks around the internet and calls someone and looks at your files and does it."
    - Salesforce Agentforce: "An AI sales development agent that proactively works leads..."
    - Real screens of agents doing the work, then "The tools changed. The job never did."
    - The channel logo burst: 12 logos, 0.2 s each.
    - The crier again with "It's time to be heard."
    - The mark, then ekoslabs.com.

## How it was made (video-use method)

The steps are the same as [03](03-jarvis-build-film.md): inventory, strategy approval, an edit list, segment extraction with grading, render, check every cut, and a session log. What this film added:

- **`script.json` is the edit.** It holds:
  - `voices`: narrator Brian `nPczCjzI2devNBz1zQrb`, assistant Daniel `onwK4e9ZLuTAKqWW03F9`, each with a Mac `say` stand-in;
  - `lines`: narrator text by id;
  - `bites`: YouTube id, in and out seconds, and the words said;
  - `sections`: each a run of events and shots, with a minimum length, a tail, or a fixed length pinned to a music mark;
  - `shotdefs` and `crops`: per-shot crops that remove watermarks, timecodes and title cards;
  - `music`: the track, its credit, the drop at 89.5 s and the downbeat at 108.75 s.
- **`prepare-heard.py` lays out the film:**
  1. Voices each line: ElevenLabs `eleven_multilingual_v2`, stability 0.55, or `say` until a key works.
  2. Trims the voices and adds a light echo on the narrator.
  3. Cuts each bite with fades and normalises it to -18 LUFS.
  4. Places every event, fitting each section to its music mark.
  5. Cuts and grades every shot in parallel, 4:3, with the archival or modern grade.
  6. Writes the music ducking curve per frame: 42% under voice, 24% after the downbeat, the finale 10 dB hotter, a fade-in under the bell and a fade-out under the mark.
  7. Builds the captions from word-level transcription: one cue per sentence, long sentences split at the most balanced boundary, never leaving a small word at a line end, no overlaps.
  8. Writes `timeline.json`.
- **`Heard.tsx` renders the timeline:**
  - `ShotView`: per-shot gate weave and exposure flicker on archival footage, a slow push, fades;
  - `Burst`: the logo burst;
  - `WordMark`: the mark first textured with the engine's words ("found sent replied booked..."), swept with light, then clean;
  - `Captions`: white Inter, soft dark fade behind, no plate;
  - grain overlay and vignette.
  
  It imports tokens from the explanatory film's `kit.tsx` ([02 source](../../assets/films/02-explanatory-founder/source/kit.tsx)).

Footage search, download, bite timing, grading commands and the grain plate are in [footage.md](../footage.md). `script.json` keeps the YouTube id and in/out seconds of every bite, so the edit can be rebuilt from public sources.

## Look and sound

- 4:3 film frame, warm archival grade with gate weave and flicker, cooler modern grade, grain at 30% overlay, vignette.
- Music: a cinematic piano and orchestra build ("Emotional Cinematic Piano Orchestra" by MokkaMusic, credited in the post). Its drop sits on the black turn and its downbeat on the logo burst.
- Captions on every spoken line, narrator and bites alike. A clean version too.

## Rules from review (v1 to v5)

- **No selling.** A manifesto never names the product's features or slogan ("don't say Jarvis"). An assistant may appear as an effect, unnamed.
- **Do not put the founder in it.** His bite was removed in v4. The slot belongs to the narrator or a famous voice.
- **Follow the reference's second half too.** In v5, a weak stock-footage assistant scene and a blank white laptop screen were replaced by famous voices on where the category is going, over real screens of AI doing the work.
- **Caption whenever anyone talks.**
- **Check the music** at its drop and downbeat against the picture before the full render.
