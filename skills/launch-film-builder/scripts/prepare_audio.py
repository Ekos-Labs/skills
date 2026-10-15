#!/usr/bin/env python3
"""Voice, word timings, mouth curve, sound effects and music for a launch film.

Reads <project>/src/script.json, writes audio under <project>/public/audio/ and the timeline the
film reads, <project>/src/timeline.json. Re-run after any script change; unchanged lines are
cached, so only edited lines are re-voiced.

    python3 prepare_audio.py --project <dir>            # build
    python3 prepare_audio.py --project <dir> --revoice  # regenerate every voice line

Voice: ElevenLabs when ELEVENLABS_API_KEY (or ELEVENLABS_KEY_FILE, a path to a file holding the
key) is set; otherwise the macOS `say` voice or espeak-ng as a stand-in for drafts. Lines voiced
by a stand-in are upgraded automatically once a key is available. The key is never printed.

Word timings: mlx-whisper (Apple Silicon), faster-whisper or openai-whisper, whichever is
installed. Without any, word times are spread across the line by word length (good enough to
draft, not to cut on).

script.json:
{
 "fps": 30,
 "voice": {"elevenlabs_id": "<voice id>", "model": "eleven_v3", "say": "Samantha"},
 "music": {"file": "/path/track.mp3", "kick": 6.39, "kick_at": 1.5, "volume": 0.5} | null,
 "tail": 2.6,                 # seconds held after the last line
 "min_duration": 0,           # optional floor for the film length
 "lines": [{"id": "v1", "at": 0.55, "tts": "[whispers] Psst."},
           {"id": "v2", "after": "v1", "gap": 0.45, "tts": "Inbox on fire?"}]
}
"at" places a line at a second; "after"+"gap" places it after another line ends. [tags] such as
[whispers] or [excited] steer eleven_v3 and are removed from the spoken text everywhere else.
Words are indexed in the spoken text without tags: "Inbox on fire?" -> 0 Inbox, 1 on, 2 fire?.
Music: "kick" is the second in the track where the beat you want lands; "kick_at" is the second
in the film where it should land. Use only music you have the rights to.
"""
import argparse, hashlib, json, os, re, shutil, subprocess, sys, wave

try:
    import numpy as np
except ImportError:
    sys.exit("numpy is required: python3 -m pip install numpy")

ap = argparse.ArgumentParser()
ap.add_argument("--project", default=".")
ap.add_argument("--revoice", action="store_true")
args = ap.parse_args()
ROOT = os.path.abspath(args.project)
CFG = json.load(open(os.path.join(ROOT, "src/script.json")))
PUB = os.path.join(ROOT, "public/audio")
for d in ("vo", "sfx"):
    os.makedirs(os.path.join(PUB, d), exist_ok=True)
FPS = int(CFG.get("fps", 30))
if not shutil.which("ffmpeg"):
    sys.exit("ffmpeg is required (macOS: brew install ffmpeg)")


def run(c):
    subprocess.run(c, check=True)


def dur(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))


def spoken(tts):
    return re.sub(r"\s+", " ", re.sub(r"\[[^\]]*\]", "", tts)).strip()


def el_key():
    k = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    f = os.environ.get("ELEVENLABS_KEY_FILE", "")
    if not k and f and os.path.exists(f):
        k = open(f).read().strip()
    return k or None


KEY = el_key()
VOICE = CFG.get("voice", {})


def voice_line(text_with_tags, out_base):
    """Returns (engine, raw audio path)."""
    if KEY:
        model = VOICE.get("model", "eleven_v3")
        text = text_with_tags if model == "eleven_v3" else spoken(text_with_tags)
        raw = out_base + ".mp3"
        body = json.dumps({"text": text, "model_id": model})
        code = subprocess.run(["curl", "-s", "-o", raw, "-w", "%{http_code}", "-X", "POST",
                               f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE.get('elevenlabs_id', 'cgSgspJ2msm6clMCkdW9')}?output_format=mp3_44100_128",
                               "-H", f"xi-api-key: {KEY}", "-H", "Content-Type: application/json", "-d", body],
                              capture_output=True, text=True).stdout.strip()
        if code == "200":
            return "elevenlabs", raw
        msg = open(raw, errors="replace").read()[:300] if os.path.exists(raw) else ""
        sys.exit(f"ElevenLabs refused the line ({code}): {msg}\nCheck the key has text-to-speech permission and the voice id exists.")
    text = spoken(text_with_tags)
    if shutil.which("say"):
        raw = out_base + ".aiff"
        run(["say", "-v", VOICE.get("say", "Samantha"), "-o", raw, text])
        return "say", raw
    for exe in ("espeak-ng", "espeak"):
        if shutil.which(exe):
            raw = out_base + ".wav.tmp.wav"
            run([exe, "-w", raw, text])
            return exe, raw
    sys.exit("No voice available: set ELEVENLABS_API_KEY, or install espeak-ng for a stand-in voice.")


def transcribe(path):
    """[[start, end, word], ...] from whichever whisper is installed, or None."""
    try:
        import mlx_whisper
        r = mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", word_timestamps=True)
        return [[w["start"], w["end"], w["word"].strip()] for sg in r["segments"] for w in sg.get("words", [])]
    except ImportError:
        pass
    try:
        from faster_whisper import WhisperModel
        segs, _ = WhisperModel("small", compute_type="int8").transcribe(path, word_timestamps=True)
        return [[w.start, w.end, w.word.strip()] for s in segs for w in (s.words or [])]
    except ImportError:
        pass
    try:
        import whisper
        r = whisper.load_model("small").transcribe(path, word_timestamps=True)
        return [[w["start"], w["end"], w["word"].strip()] for sg in r["segments"] for w in sg.get("words", [])]
    except ImportError:
        return None


def align(heard, words, length):
    """Script words on heard timings when the counts match; otherwise spread by word length."""
    if heard and len(heard) == len(words):
        return [[a, b, w] for (a, b, _), w in zip(heard, words)]
    t0 = heard[0][0] if heard else 0.0
    t1 = heard[-1][1] if heard else length
    total = sum(len(w) for w in words) or 1
    out, cur = [], t0
    for w in words:
        d = (t1 - t0) * len(w) / total
        out.append([cur, cur + d, w])
        cur += d
    return out


# ---------- voices ----------
cache_p = os.path.join(PUB, "vo/cache.json")
cache = json.load(open(cache_p)) if os.path.exists(cache_p) else {}
lines, warned = {}, False
for ln in CFG["lines"]:
    lid = ln["id"]
    wav = os.path.join(PUB, "vo", lid + ".wav")
    sig = hashlib.md5(json.dumps([VOICE, ln["tts"]], sort_keys=True).encode()).hexdigest()
    c = cache.get(lid, {})
    stale = args.revoice or c.get("sig") != sig or not os.path.exists(wav) or (KEY and c.get("engine") != "elevenlabs")
    if stale:
        engine, raw = voice_line(ln["tts"], os.path.join(PUB, "vo", lid + ".raw"))
        run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
             "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,"
             "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,"
             "afade=t=in:d=0.015,loudnorm=I=-16:TP=-2:LRA=9,aresample=48000", "-ac", "2", wav])
        os.remove(raw)
        heard = transcribe(wav)
        if heard is None and not warned:
            print("note: no whisper installed, word times are estimated (pip install mlx-whisper or faster-whisper)")
            warned = True
        cache[lid] = {"sig": sig, "engine": engine, "heard": heard}
    d = dur(wav)
    words = spoken(ln["tts"]).split()
    timed = align(cache[lid].get("heard"), words, d)
    if "at" in ln:
        at = ln["at"]
    else:
        prev = lines[ln["after"]]
        at = prev["at"] + prev["dur"] + ln.get("gap", 0.3)
    lines[lid] = {"id": lid, "at": round(at, 3), "dur": round(d, 3), "file": f"audio/vo/{lid}.wav", "text": spoken(ln["tts"]),
                  "engine": cache[lid]["engine"], "words": [{"w": w, "s": round(at + a, 3), "e": round(at + b, 3)} for a, b, w in timed]}
json.dump(cache, open(cache_p, "w"), indent=1)
for v in lines.values():
    print(f"{v['id']:>4} {v['at']:6.2f}-{v['at'] + v['dur']:6.2f} [{v['engine']}]  " + " ".join(f"{i}:{x['w']}" for i, x in enumerate(v["words"])))
if any(v["engine"] != "elevenlabs" for v in lines.values()):
    print("note: some lines use a stand-in voice. Set ELEVENLABS_API_KEY and re-run for the real voice.")

# ---------- sound effects, synthesized: one per visible event ----------
SR = 48000
rng = np.random.default_rng(3)


def save(name, x):
    x = np.clip(x, -1, 1)
    st = (np.stack([x, x], 1) * 32767).astype("<i2")
    with wave.open(os.path.join(PUB, "sfx", name), "wb") as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(st.tobytes())


def tt(s):
    return np.arange(int(SR * s)) / SR


x = tt(.12); save("pop.wav", np.sin(2 * np.pi * (520 + 900 * np.exp(-x * 40)) * x) * np.exp(-x * 38) * .5)
x = tt(.45); env = np.sin(np.pi * np.clip(x / .45, 0, 1)) ** 2
save("whoosh.wav", np.convolve(rng.normal(0, 1, len(x)), np.ones(40) / 40, "same") * env * .6)
x = tt(.35); save("stamp.wav", np.sin(2 * np.pi * 70 * x) * np.exp(-x * 14) * .9 + np.convolve(rng.normal(0, 1, len(x)), np.ones(8) / 8, "same") * np.exp(-x * 45) * .5)
x = tt(.05); save("key.wav", np.convolve(rng.normal(0, 1, len(x)), np.ones(4) / 4, "same") * np.exp(-x * 160) * .35)
x = tt(.08); save("click.wav", np.convolve(rng.normal(0, 1, len(x)), np.ones(3) / 3, "same") * np.exp(-x * 120) * .5 + np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 90) * .2)
x = tt(.25); save("swish.wav", np.sin(2 * np.pi * (300 + 1400 * x / .25) * x) * np.exp(-x * 9) * .25)

# ---------- music ----------
music = None
m = CFG.get("music")
if m:
    src = os.path.expanduser(m["file"])
    out = os.path.join(PUB, "music.wav")
    sig_p = os.path.join(PUB, "music.sig")
    sig = hashlib.md5((src + str(os.path.getmtime(src))).encode()).hexdigest()
    if not os.path.exists(out) or not os.path.exists(sig_p) or open(sig_p).read() != sig:
        run(["ffmpeg", "-v", "error", "-y", "-i", src, "-ar", "48000", "-ac", "2", out])
        open(sig_p, "w").write(sig)
    offset = m.get("kick", 0) - m.get("kick_at", 0)
    if offset < 0:
        sys.exit("music: kick must be later in the track than kick_at is in the film")
    music = {"file": "audio/music.wav", "offset": round(offset, 3), "volume": m.get("volume", 0.5)}

# ---------- mouth: voice loudness per frame, 0..1, for the character's lips ----------
end = max(v["at"] + v["dur"] for v in lines.values()) + CFG.get("tail", 2.6)
total = max(end, CFG.get("min_duration", 0))
nfr = int(total * FPS) + 1
mouth = np.zeros(nfr)
hop = SR // FPS
for v in lines.values():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(ROOT, "public", v["file"]), "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    rms = np.array([np.sqrt((a[i:i + hop] ** 2).mean()) for i in range(0, max(0, len(a) - hop), hop)])
    lvl = np.clip((20 * np.log10(rms + 1e-6) + 38) / 22, 0, 1)
    f0 = int(round(v["at"] * FPS))
    n = max(0, min(len(lvl), nfr - f0))
    mouth[f0:f0 + n] = np.maximum(mouth[f0:f0 + n], lvl[:n])
mouth = np.convolve(mouth, [.25, .5, .25], "same")

tl = {"fps": FPS, "duration": round(total, 3), "lines": list(lines.values()), "music": music, "sfx": "audio/sfx",
      "mouth": [round(float(x), 2) for x in mouth]}
json.dump(tl, open(os.path.join(ROOT, "src/timeline.json"), "w"), indent=1)
print(f"wrote src/timeline.json: {len(lines)} lines, {total:.2f} s at {FPS} fps" + (", music" if music else ", no music"))
