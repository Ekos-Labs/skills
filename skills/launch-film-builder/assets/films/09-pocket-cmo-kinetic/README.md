# Pocket CMO — launch video

Remotion project for the launch video. Standalone (own `package.json`), not
wired into `donna-cmo-site`.

## Setup

```
npm install
npm start          # opens Remotion Studio at localhost:3000
```

## What's here

- `src/theme.ts` — brand tokens copied from `donna-cmo-site/src/app/globals.css`:
  warm cream background, forest-green primary, coral-magenta callout accent.
  Fonts loaded via `@remotion/google-fonts` (no network dependency at render
  time): Source Serif 4 (headings), Inter (body), JetBrains Mono (code/pills).
- `src/animations.ts` — shared spring/interpolate helpers (`useEnter`,
  `fadeSlideUp`, `scaleIn`) so every scene enters with the same feel.
- `src/components/` — `Background` (drifting blurred blobs), `Wordmark`
  (animated logo reveal), `Statement` (word-by-word kinetic type, the main
  storytelling device), `Pill` (solid CTA/tag chip), `Chip` (outlined list
  chip), `FeatureCard` (tool card), `ChatPromptMock` (fake AI-prompt box with
  a stamped rejection X), `PriceCountdown` (animated price → FREE).
- `src/compositions/` — eight scenes registered individually in the Studio
  sidebar for scene-by-scene iteration, following Eshaan's narrative plan:
  `HookScene` ("building is easy, marketing is not") → `ProblemScene`
  (asking AI for growth hacks doesn't work) → `InsightScene` (real marketers
  use psychology/emotion) → `ThesisScene` (tools understand people, don't
  replace the work) → `ProductRevealScene` (Pocket CMO wordmark + harness
  chips) → `FeaturesScene` (reel/Reddit/ads tool grid) → `PriceDropScene`
  ($297 counts down to FREE) → `ClosingScene` ("AI produces slop, real
  humans don't" bookend). Stitched with `@remotion/transitions` crossfades
  into the `LaunchVideo` composition (the one that actually renders).
- `public/images/` — `hero-dashboard.png` (product shot) + a few brand
  illustrations, copied from `donna-cmo-site/public/`.
- `public/videos/` — empty; drop screen recordings / b-roll here.
- `public/audio/` — empty; voiceover renders here.
- `scripts/generate-voiceover.mjs` — ElevenLabs text-to-speech. Paste the
  script into `voiceover-script.txt`, then `npm run voiceover` → writes
  `public/audio/voiceover.mp3`. Reads `ELEVENLABS_API_KEY` /
  `ELEVENLABS_VOICE_ID` from `.env` (gitignored, not committed).

## Status

Visuals-first cut of Eshaan's narrative plan (2026-08-16), using his lines
as on-screen kinetic type — not a timed final script yet. Plan: lock the
visual cut first, generate the ElevenLabs voiceover on top once it's final
(see `npm run voiceover` above), then retime scene durations in
`LaunchVideo.tsx` against the actual audio.

## Render

```
npm run build       # renders out/launch-video.mp4
npm run still       # single frame → out/launch-video.png, for quick checks
```
