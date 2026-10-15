# Asset Manifest and Capture Checklist

## Existing, approved brand assets

| Asset | Source |
|---|---|
| White wordmark | `public/brand/wordmark-white.png` |
| Brand mark | `public/brand/mark.png` |
| Full dark-background lockup | `public/brand/7.png` |
| Pocket CMO product image | `public/products/pocket-cmo.png` |
| Remy product image | `public/products/remy.png` |
| Channel and tool logos | `public/logos/` |
| Hero background footage | `public/video/hero.mp4` |
| Mobile hero footage | `public/video/hero-mobile.mp4` |

Use these files directly. Do not duplicate them into the video folder.

## Components to rebuild natively in Remotion

- Diagnose, Strategise, and Build & Run visuals from
  `src/components/asme/process-visuals.tsx`.
- Process cards and progress line from `src/components/asme/process-cards.tsx`.
- GTM folder tree from `src/components/asme/gtm-engine.tsx`.
- B2B SaaS, app/consumer tech, and service-business configurations from
  `src/components/asme/engine-configs.tsx`.
- Services/products toggle and real product cards from
  `src/components/asme/offerings.tsx`.

These should be recreated as time-driven Remotion scenes rather than captured
as flat screenshots, so every node, connector, and card can be synchronized to
the narration.

## Website captures still required

- Desktop hero, clean 1920×1080 with the public website visible.
- Diagnose, Strategise, and Build & Run sections at their fully resolved states.
- GTM engine with LinkedIn Outreach open.
- Each of the three ICP configurations at its resolved state.
- Services view and Products view after the toggle transition.
- Ekos wordmark and final brand state.

## Eshaan recording package required

Place final files under `public/launch-video/`:

```text
public/launch-video/
├── camera/
│   ├── ekos-launch-clean-edit.mov
│   └── ekos-launch-full-take.mov
├── audio/
│   ├── dialogue.wav
│   └── room-tone.wav
├── sound/
│   └── ai-montage.wav
└── captions/
    └── transcript.txt
```

Record 4K in 16:9 at 25 or 30 fps with locked exposure and white balance. Frame
slightly wider than a standard talking-head crop so cards can sit beside Eshaan.
Leave two seconds of silence before and after each take. Capture the microphone
as 48 kHz WAV and record the entire script continuously, followed by clean
section pickups.

Also record ten seconds of room tone. It will continue underneath the Remotion
sections so the handoff from face to graphics feels like the same film.

## External material

- Four licensed or platform-safe broadcast fragments for the opening AI montage.
- One cleared background track with separated stems if possible.
- Optional room tone recorded during the talking-head shoot.
- Real 3–5 second screen recordings of Pocket CMO and Remy if their product
  screens need to appear beyond the existing homepage images.

Do not use the reference video's actual footage, music, or graphics in the Ekos
film. It is a motion-language reference only.
