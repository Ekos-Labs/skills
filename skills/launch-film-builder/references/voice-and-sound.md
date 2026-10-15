# Voice and sound

## Contents
- The voice
- Word timing
- Music
- Sound effects
- The mix and the master

## The voice

**ElevenLabs** sounds right for this format. Set `ELEVENLABS_API_KEY` in the environment. The key needs text-to-speech permission; scoped keys sometimes lack it, and the script prints the refusal.

- **Model:** `eleven_v3` reads audio tags in square brackets, such as `[whispers]`, `[excited]`, `[teasing]`, `[confident]`, `[laughs]` and `[sighs]`. They are what make "Psst." sound like a whisper and "Handled." sound smug. `prepare_audio.py` strips the tags for every other model and for the stand-in voice.
- **Voice:** set it in `script.json` (`voice.elevenlabs_id`). Defaults that work:
  - Jessica `cgSgspJ2msm6clMCkdW9`: bright and playful, the promo default.
  - Brian `nPczCjzI2devNBz1zQrb`: warm and low, for narration.
  - Daniel `onwK4e9ZLuTAKqWW03F9`: calm British, for a manifesto.
  
  Let the user pick from two or three short samples when the voice matters.
- **Free plan:** text-to-speech and `eleven_v3` work. The music API and 192 kbps output need a paid plan, which is why the script requests `mp3_44100_128`.
- **One file per line.** Lines are voiced one at a time so each can be re-voiced, moved and timed alone. Retakes are cheap: change the text or the tag, re-run, and only that line changes.
- **Stand-in voice:** without a key, the script uses macOS `say` or espeak-ng so the whole film can be built and timed. It sounds robotic. Never deliver it as final, and tell the user when a film still has it. Lines are upgraded automatically once a key is set.

## Word timing

Each line is trimmed (silence removed at both ends), normalised to -16 LUFS and transcribed with whisper for word timestamps. The script uses mlx-whisper on Apple Silicon, then faster-whisper or openai-whisper if installed.

Whisper's words are mapped onto the script's words by position when the counts match; the printout shows the numbered words. If whisper hears a different number of words (numbers and names are the usual cause), times are spread by word length. That is fine for drafting, but check the beats in stills. Write numbers out ("three to five") and keep names simple when the timing must be exact.

Gaps between lines (`gap` in `script.json`) are part of the edit:
- 0.3 s for a quick follow-on ("Handled." after the list);
- 1 s or more where a visual needs room (a wipe, a reveal, a result appearing).

## Music

- **Rights first.** The user's own licence, a library they subscribe to, or a free-to-use track whose terms allow it. Note the source.
- **Pick** an upbeat, sparse track for a promo (claps, plucks, light drums) that leaves room for the voice. For a manifesto, pick a build to a downbeat.
- **Line it up:** find the second in the track where the beat you want lands (`kick`) and the second in the film where it should land (`kick_at`), often the first headline or the downbeat burst. The script converts the track and writes the offset.
- **Level:** `volume` around 0.5. The template ducks music to 65% under speech and fades it over the last 2.2 seconds.

## Sound effects

Synthesised by `prepare_audio.py`, so there are no licences to clear:
- `pop`: arrivals;
- `whoosh`: wipes and zooms;
- `swish`: whips;
- `stamp`: a low thump and noise for the payoff;
- `click`: a button;
- `key`: one per typed character.

Put one on every visible event, at 0.3 to 0.9 volume, with the payoff loudest. A film without them feels unfinished even when nobody can say why. Replace any of them with recorded sounds by dropping a WAV of the same name into `public/audio/sfx/`, but re-running the script overwrites the synthesised ones, so rename yours and update `SFX`.

## The mix and the master

- Voice lines play at full level (already -16 LUFS each), music sits under them, and effects sit between.
- Master with `master.py`: two-pass loudness to -14 LUFS integrated and -1.5 dB true peak. The video stream is copied untouched, and the audio becomes AAC 256 kbps at 48 kHz.
- Listen to the master once, start to finish. Check that no word is buried under music and no effect is louder than the voice.
