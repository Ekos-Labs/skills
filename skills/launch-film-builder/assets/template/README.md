# Launch film template

A complete 30-second example film for a made-up product (Acme), in 16:9 and 9:16, with a coded 3D character.

1. Write the voice lines in `src/script.json`.
2. `python3 <skill>/scripts/prepare_audio.py --project .` voices them and writes `src/timeline.json`.
3. `npx remotion studio src/index.ts` for a live preview.
4. `node scripts/render.mjs PromoWide --stills 1,5,10` for quick checks, then `node scripts/render.mjs PromoWide` and `node scripts/render.mjs PromoVertical`.

Scenes: `src/Promo.tsx`. Brand: `BRAND` in `src/kit.tsx`. Character style: `STYLE` in `src/Mascot3D.tsx`. Poses: `src/Char.tsx`.
