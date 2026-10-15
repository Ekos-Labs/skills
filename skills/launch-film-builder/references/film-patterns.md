# Film patterns, scripts and references

## Contents
- Writing for the ear
- Mascot promo beat sheet
- Manifesto beat sheet
- Product reel
- Four more structures
- Copying a reference video

## Writing for the ear

- One idea per line, under 12 words. Questions make good hooks ("Inbox on fire?").
- Name things the viewer can see. Every noun in the voiceover is a chance for a card, a word on screen or a gesture, and every visual beat keys off a spoken word.
- Hook in the first two seconds, product named by second eight, one action at the end.
- On-screen text must be readable in the time it is shown: about three words a second, fewer if it is big.
- Short lines with a pause carry attitude ("Handled."). Use the gap after a line for a visual payoff.
- Read every line aloud. If you stumble, the voice will too.
- Write numbers and URLs the way they are said: "acme dot app", not "acme.app". The screen can show the written form.

## Mascot promo beat sheet

The template's film, about 30 seconds. Times are approximate; real times come from the voice.

| # | Beat | Line (example) | On screen |
|---|---|---|---|
| 1 | Whisper | "[whispers] Psst." | Character slides in, hand by mouth, a "psst.." bubble |
| 2 | Hook question | "Inbox on fire?" | Two-line headline, serif accent word, underline drawn on it |
| 3 | Who it is for | "Refunds? Where's my order? Is this in stock?" | Circle wipe to the accent colour, one card pops per question |
| 4 | What it does | "Acme reads every message, and answers in your voice." | The colour panel zooms out to a phone console, rows switch from "reading" to "answered", character peeks up from below |
| 5 | The list | "Sorting tickets? Writing replies? Chasing refunds? Following up?" | Whip into a grid of live cards; each card lights up on its word |
| 6 | Payoff | "Handled." | A stamp slams in with a ring, check badges pop, thumbs up |
| 7 | Doubt | "Don't believe us?" | Black, one line, raised eyebrow, fist under chin |
| 8 | Try it | "Paste your store link, and watch it answer a real question." | Input types the link, button presses on "watch", a live answer types out, character points at it |
| 9 | Action | "Try it free, at acme dot app." | Wordmark, character peeks over the letters and winks, button and URL |

Swap the story, keep the rhythm: question, who, what, list, payoff, doubt, try, action. The doubt and try beats are what turn an explainer into a promo. They invite the viewer to test the claim instead of asking them to trust it.

## Manifesto beat sheet

For a company or category launch, after a16z's "It's time to build". About 90 seconds, one narrator, real archival sound bites, footage cut under a second a shot, logos on the downbeat, and the name only at the end. Full recipe in [manifesto-film.md](manifesto-film.md).

1. Cold open: an archival voice, black, then the first image.
2. The old world: three to five quick cuts of how things used to be done.
3. The turn: one line on what changed.
4. The belief, in short lines over people and work, building with the music.
5. The downbeat: a burst of names or logos, one every third of a second.
6. The mark: the logo assembles, then the URL. No pitch.

## Product reel

A 6 to 10 second loop with no voice. The finished deliverable builds itself on screen: pages slide in, rows fill, numbers count up, text types. It holds on the result, then fades back to empty so the loop restarts cleanly. Use real photography with a slow camera drift behind it, and fictional companies, people and numbers, labelled as examples. Build it as its own composition in the template, reusing `Card`, `Words`, `pop` and `Grid` from `kit.tsx`. The timing comes from a hand-written schedule rather than from voice.

## Four more structures

1. **Before and after:** the old way in three to five quick frustrations, a hard cut, then the product doing it in one smooth take.
2. **One hard claim:** a single bold line on black, then proof shot by shot until the claim feels obvious.
3. **The demo in 30:** real UI from start to finish of one job, with captions naming each step and a timer on screen.
4. **Belief over product shots:** the manifesto's lines over the product being used, the product named only at the end.

Rules for all of them: hook before second two, no logo first, end on one action.

## Copying a reference video

When the user says "like this", the reference is the brief. Study it before writing:

1. **Download it.** For X, YouTube, Instagram or TikTok use the latest yt-dlp, because older builds get 403 errors: `uvx --from "yt-dlp[default]@latest" yt-dlp -o ref.mp4 <url>`.
2. **Get the words.** Transcribe it with whisper to get the script and its timing.
3. **Get the cuts.** `ffmpeg -i ref.mp4 -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep pts_time` lists the cut points. Build a contact sheet at those times to see every shot.
4. **Look closely at the hard parts.** Crop and step through 0.05-second frames on anything that moves in a special way. Ask how it was made: a moving picture, or something coded? Example: in the Pocketsflow promo the dither dots stay fixed to the screen while the character moves, which proves it is a 3D model drawn through a screen-space dither, not an animated image. That is why the template's character is coded.
5. **Write down** the beat sheet, the pacing (seconds per shot), the type (sizes, weights, the accent), the colour, the sound (music style, sound effects on every event, how the voice sits), and the transitions.
6. **Match it** shot for shot with the user's story. Keep what makes it work, change only the brand and the content.
