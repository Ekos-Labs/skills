# Ekos launch film v2: "It's time to be heard."

## Session 1 — 2026-09-25

**How the a16z film works (measured):** 105 s, 111 shots, median shot 0.8 s, bursts of 0.2 s cuts, 4:3 with grain and a warm grade. One manifesto narrator cut against real archival sound bites (news, NASA, founders), a score that swells, breathes and peaks, AI-made mythic interludes (gold statues, a glowing orb), a burst of portfolio logos, and an A16Z mark textured with portfolio names.

**Our version:** the history of being heard, from town criers to AI, then the turn "Building was never the hard part. Being heard is." Ekos speaks as the Jarvis. Channel-logo burst on the music's downbeat. EKOS mark built from the words the engine produces (found, sent, replied, booked...), then clean, with "Jarvis, for marketing."

**Sound bites:** David Ogilvy ("When I started Ogilvy and Mather, New York, nobody had heard of us." / "Every four weeks, I sent personalized mailings to our new business prospects." / "That was how we grew."), 1930s newsboys, NBC chimes, AOL "You've got mail", Gary Vaynerchuk on attention, Jensen Huang ("Everybody in the world is now a programmer.").

**Music:** "Emotional Cinematic Piano Orchestra" by MokkaMusic (YouTube LyGAOTWJbwU). Credit it in the post. Its drop (89.5 s) sits on the black turn, its downbeat (108.75 s) on the logo burst.

**Code:** `website/launch-video/remotion/src/heard/` (script.json is the edit; timeline.json is generated), `scripts/prepare-heard.py`, render `node scripts/render.mjs heard` (or `heard-captions`).

**Outstanding:** real voices (ElevenLabs key needs Text to Speech permission; then `EL_KEY_FILE=... python3 scripts/prepare-heard.py` swaps them in and re-times everything), optional Veo hero shots (Flow first-run screen needs Eshaan's OK), captioned export, post caption with music credit.

## Session 1, later — 2026-09-25

**Direction change (Eshaan):** no selling and no saying "Jarvis". Keep the assistant only as an effect, the way a16z kept "Am I actually talking?". Reference added: Gregor Zunic's browser-use film (x.com/gregpr07/status/2103361504850633050), made with video-use from the a16z prompt. It has the same shape: a narrator riffing on a16z's first line, category bites from famous people, one bite from their own founder, and a closing "Now, it's time to let go of the mouse."

**Changes:** real ElevenLabs voices (Brian narrates, Daniel is the unnamed assistant). Cut "Every builder deserves a Jarvis", the Ekos product panels, and "Jarvis, for marketing". Added Eshaan's own line at the turn ("The greatest companies are built on trust, attention, distribution, and the right system", from the explanatory shoot) and a closing narrator line, "The tools changed. The job never did." The assistant's briefing is shortened to fit the music's breath. The mark ends on EK✳S and ekoslabs.com only.

**Output:** `ekos-its-time-to-be-heard-v3.mp4` (92.6 s, 1440x1080, -14.0 LUFS, -1.5 dBTP). `ekos-heard-v2a-realvoices.mp4` is the earlier cut with the Jarvis pitch, kept for comparison.

## v4 — 2026-09-25

Eshaan: don't use his footage, stick to the browser-use / video-use film, add captions while anyone talks. Removed his founder bite; the slot is now the narrator: "The best product doesn't win. The one people hear about does." (over a 3D printer, then the 1920s crowd listening to the crier). Burned-in captions: 30 phrases timed to word-level transcription of every voice and bite, with balanced line breaks and a soft dark fade behind them. Files: `ekos-its-time-to-be-heard-v4-captions.mp4` (main), `ekos-its-time-to-be-heard-v4-clean.mp4`. Both at -14.0 LUFS, -1.5 dBTP.

## v5 — 2026-09-25

Eshaan didn't like v4's second half (a stock-footage assistant scene, a blank white laptop at 1:07). Rebuilt it on browser-use's second half: famous voices on where the category is going, over real screens of AI doing the work.
- Turn (the music's quiet stretch): "Building was never the hard part. Being heard is." / "For a hundred years, we did it by hand. Door by door. Letter by letter. Post by post." (1961 BFI salesman at a door, the 1956 "Where do our letters go?" postal film, 1950s mail sorting, a social feed) / "Now, the machines will carry it." (Claude computer use, OpenAI agent) / the unnamed assistant: "Good morning. While you slept, I found fourteen companies hiring their first marketer."
- Finale (on the crash): Sam Altman at TED 2025 ("Hey, go do this task for my job, and it goes off and clicks around the internet and calls someone and looks at your files and does it.") and Salesforce's Agentforce film ("An AI sales development agent that proactively works leads by contacting customers, responding to their questions, and scheduling meetings."), over Operator, Manus, Agentforce and Claude screens. Then "The tools changed. The job never did.", the channel burst, the crier with "It's time to be heard.", and the logo.
Files: `ekos-its-time-to-be-heard-v5-captions.mp4` (main) and `-v5-clean.mp4`. 101.6 s, -14.0 LUFS, -1.5 dBTP.
