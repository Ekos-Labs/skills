# 09 · Pocket CMO launch (kinetic statements with live tool demos)

Frames: [frames.jpg](../../assets/films/09-pocket-cmo-kinetic/frames.jpg) · Source: [source/](../../assets/films/09-pocket-cmo-kinetic/source/) · Notes: [README.md](../../assets/films/09-pocket-cmo-kinetic/README.md)

## What it is

A 53-second, 16:9 launch film for an open-source tool kit (Pocket CMO). The film is mostly statements: centred lines that land word by word in a serif, with key words in brand colour or weight, over a warm cream background with two soft colour blobs drifting. The argument runs: hook, problem, insight, thesis, product reveal, three live tool demos recreated in code, a price drop, and a closing line that bookends the hook. It has an ElevenLabs voiceover, and its scenes are crossfaded.

Use it for: a launch where the argument matters more than the visuals, a tool or product without much UI to show, and founder-made launches with a strong point of view.

## The cut

| Scene | Line | On screen |
|---|---|---|
| Hook | "Building is easy. **Marketing is not.**" | Two-line statement, the second line heavier |
| Problem | "Most of us build an app, then ask Claude for growth hacks." | A chat prompt mock typing "give me 100 hooks and strategies to get users", which gets stamped with a red X: "It doesn't work like that." |
| Insight | "The best marketers use **human psychology and emotion**..." | Statement with small icons |
| Thesis | "They use tools to understand people, **not to replace their work.**" | Statement, accent colour on the second half |
| Product reveal | "All those tools, on your fingertips." | Wordmark with harness chips (Claude Code, Codex, any harness) |
| Demos | Reel analyzer, Reddit radar, idea tracking | Each recreated as a working mini-UI: paste a link, it processes; type a query, results appear; a board moves an idea from spark to shipped |
| Price | "16 tools. One pocket." | App icons gather into one, then the price counts down to FREE |
| Close | "AI produces slop. **Real humans don't.** Don't use tools to market. Use tools to help you market." | Bookend statement, wordmark and URL |

## How it was made

- Brand tokens are copied from the product site (`theme.ts`): cream background, forest-green primary, coral-magenta accent. Fonts load through `@remotion/google-fonts`: Source Serif 4, Inter and JetBrains Mono.
- `animations.ts` holds shared entrances (`useEnter`, `fadeSlideUp`, `scaleIn`), so every scene enters with the same feel.
- Components:
  - `Statement`: word-by-word kinetic type from styled segments;
  - `ChatPromptMock` with the stamped X;
  - `PriceCountdown`, `Wordmark`, `Background` (drifting blurred blobs);
  - `Pill`, `Chip`, `FeatureCard`, `TypingText`, `Counter`, `ProcessingStatus`.
- Scenes live in `compositions/`, each registered on its own in the Studio for iteration. `LaunchVideo.tsx` stitches them with `TransitionSeries` crossfades.
- Voice: `generate-voiceover.mjs` calls ElevenLabs on `voiceover-script.txt`, with the key read from `.env`.

**The timing lesson** is written up in `LaunchVideo.tsx`. Scene lengths were first estimated from word counts and drifted behind the voice. The fix was `ffmpeg -af silencedetect=noise=-30dB:d=0.15` on the real voiceover: each paragraph pause marks a scene boundary, converted to frames with half the crossfade folded back in. Better still is word timing from whisper, which `prepare_audio.py` in this skill does.

## Make your own

1. Write the argument as 8 to 10 statements: hook, problem, insight, thesis, reveal, proof, offer, bookend close.
2. Mark the key words in each statement (colour, weight or italic). That is the whole visual system.
3. Recreate two or three real product interactions as small working UIs. These are the proof.
4. Voice it, then time the scenes from the real audio, never from word counts.
5. Close by echoing the hook with the answer.
