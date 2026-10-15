# Ekos launch film: "Jarvis, for marketing"

## Session 1 — 2026-09-25

**Strategy:** A 62 s, 16:9 manifesto film in the shape of a16z's "It's time to build" (Jan 2026): quiet open, a montage of builders, a turn, the product, a held mark. New concept, nothing reused from the Sep 3 SF launch cut. Ekos is the Jarvis: it "speaks" through on-screen messages (no voice, no API key on the Mac; also better for muted autoplay).

**Structure (film seconds):**
- 0.0 to 9.2 cold open: dark room, phone lights up. Ekos: "Good morning. While you slept, I found 14 companies hiring their first marketer. I wrote to 9 of them. 3 replied. One wants to talk on Thursday."
- 9.2 to 26.0 builders: "Today, anyone can build." "A machine writes the code." "Designs the product." "Ships it overnight." then a 3 s rush of 0.4 s cuts.
- 26.0 to 30.5 the gap: "Building got easy." (black) "Selling didn't." (man at a window), in the music's near silence.
- 30.5 to 33.6 the turn: "Jarvis, for marketing." on the music's first big hit, over a laptop in candlelight; the camera pushes into its screen.
- 33.6 to 52.0 the engine, as Ekos's own status lines: learning your business, 23 buyers found, 23 messages waiting for your okay (Approve click), tomorrow's posts, what worked this week. Every panel tagged "Example".
- 52.0 to 55.0 "Built around your business. Yours to keep." (goldsmith's ring, finished table)
- 55.0 to 62.0 "You build. Ekos does the rest." then the EK✳S lockup and ekoslabs.com.

**Decisions:**
- Music: "Cinematic Inspiring Documentary Build-Up" (YouTube 57Fe9e5iLgg, free-to-use channel), starting 3.75 s in so its breath (29.75 to 34.25) and downbeat (34.25) land on the gap and the reveal.
- Footage: 21 YouTube stock and b-roll clips in sources/. Dropped four with watermarks; cropped a "Veo" mark off the factory shot; swapped a lock screen that showed someone else's message.
- Grade: light warm cinematic per shot at extraction, plus film grain and vignette in Remotion.
- Site rules kept: #09090b, one blue accent, Inter with Instrument Serif italic accents, no glass, no tilts, no progress bars. No made-up client results: engine numbers are labelled examples.
- Master: two-pass loudnorm, -13.8 LUFS, -1.4 dBTP.

**Where things are:** code in `website/launch-video/remotion/src/jarvis/` (cut list `edl.json`, prep `scripts/prepare-jarvis.py`, render `node scripts/render.mjs jarvis`). Output `ekos-jarvis-launch-v1.mp4` here.

**Outstanding:** no voice (add ElevenLabs key to voice it); music not heard by a person yet; 9:16 and 4:5 cuts not made.
