# EKOS explanatory launch — V3 (Claude's cut)

This file documents `src/v3/` and composition `EkosLaunchV3`. It is separate from `README.md`
because Codex kept rewriting that file while working on its own `src/v2/` pass on
2026-09-05; the two passes are unrelated and this one is the cut Eshaan chose.

Current take: **`out/ekos-launch-v3.mp4`**, 89 seconds · 1920 × 1080 · 30 fps. Earlier takes are
kept as `ekos-launch-v3-r1.mp4` (15:55, Inter captions, static close).

```sh
npm ci
npx tsc --noEmit                              # whole project; fails while Codex's src/v2 has type errors
node scripts/render.mjs v3-stills 4.6,21.5    # stills into out/v3-stills
node scripts/render.mjs v3                    # -> out/ekos-launch-v3.mp4
```

Rendering does not depend on the project-wide typecheck; Remotion bundles with esbuild. To
typecheck this pass alone, point tsc at a tsconfig whose `include` is `src/v3/**/*` and
`src/captions.json`.

## What V3 is

Built from Eshaan's review of V2: website palette and type only (`#09090b` canvas, `#3663ff`
accent, Inter with an Instrument Serif italic accent word), no tilted cards, no glass or blur on
UI, no progress bars, captions burned in throughout, the four pillars and the three prior-work
numbers set beside him on the founder footage, the engine drawn from the website's own
`gtm-engine.tsx` / `engine-configs.tsx`, and UGC thumbnails taken from his own published reels.

## Source map

- `src/v3/kit.tsx`: tokens copied from `globals.css` and `process-visuals.tsx`, type, Frame/Card/Tag/Pill, the website's logo map, lucide-style icons, accent hairlines, camera, `retire()`.
- `src/v3/Captions.tsx`: phrase-level captions from `captions.json`, white Instrument Serif regular (the caption face of the launch-film references in Drive `EKOS/Inspo-launch-videos` and of Eshaan's own SF launch cut), shadow only, no plate. Every scene keeps y ≥ 900 clear.
- `src/v3/Founder.tsx`: `Opening` (pillars: Trust 3.36 s, Attention 3.90, Distribution 4.48, System 5.60; at 11.50 "Ekos Labs" the mark turns in with the name beside him and the engine's branches stack under it until the 16.000 cut) and `Proof` (20M+ at 39.90, 4x at 42.20, 5000+ at 44.84, "Systems that bring in qualified leads" at 47.66, attribution line kept).
- `src/v3/Intro.tsx`: 16.000–23.340, five beats on the words, one retired panel visible at a time.
- `src/v3/Engine.tsx`: `EngineTree` (the site's Finder tree; Context files light on product / problems / buy; channels chosen at 28.50), `EngineTeam` (the site's engine section: Ekos card, team rail, agents and tools, hairlines), `EngineConfigs` (the site's three configurations, cycled).
- `src/v3/Outbound.tsx`: branch completes step by step, lead opened, message typed from its context, three-touch sequence, record to human review.
- `src/v3/UGC.tsx`: brief and selects; asset library with 150/week and theme pages; outbound system; inbound pages. All labelled example production configuration.
- `src/v3/Rest.tsx`: NoCopy, Ads, Review, Scale, Products, End (mark spins in, lockup wipes out from it, hairline and tagline follow).
- `src/v3/media.ts`: `UGC_SHOTS`, the swap point for footage. Currently `public/ugc/reel-01..06.jpg`, frames pulled from Drive `Content/Reels` (pocketcmo.onlinereel, the two "Comment Donna" reels, tech founder 3, Pov vibe coding, Infinite ROI). Thumbnails carry `blur(3.5px)` on purpose: they are personal footage and should read as footage, not be recognisable.

Google Drive is synced locally at `~/Library/CloudStorage/GoogleDrive-<you>/My Drive/`; `Work/EKOS/Launch videos/explainatory-launch/1.mov` is the source performance.

## Claims

20M+ / 4x / 5000+ are the website's founder numbers and carry "From the founder's prior work". All volumes are labelled example production configuration. Lead identifiers are fictional (Lead 011–016). Nothing states a message was sent. Pocket CMO is tagged open source, Remy join the waitlist, as on the site.

## Checks

See `out/quality-checks.md`. The final take was checked on 89 one-per-second stills across the whole film.
