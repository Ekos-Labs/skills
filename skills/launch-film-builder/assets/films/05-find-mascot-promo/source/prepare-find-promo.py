"""Voices (ElevenLabs v3), word timings, music and sound effects for the Find promo.
Writes src/findpromo/timeline.json for the FindPromo composition.
    EL_KEY_FILE=... python3 scripts/prepare-find-promo.py [--revoice]"""
import hashlib, json, os, subprocess, sys, wave
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = json.load(open(os.path.join(ROOT, "src/findpromo/script.json")))
PUB = os.path.join(ROOT, "public/find-promo")
KEY = open(os.environ["EL_KEY_FILE"]).read().strip() if os.environ.get("EL_KEY_FILE") else None

def run(c): subprocess.run(c, check=True)
def dur(p): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]))

cache_p = os.path.join(PUB, "vo/cache.json"); cache = json.load(open(cache_p)) if os.path.exists(cache_p) else {}
lines = {}; placed = []
for ln in CFG["lines"]:
    wav = os.path.join(PUB, "vo", ln["id"] + ".wav"); sig = hashlib.md5((CFG["voice"] + CFG["model"] + ln["tts"]).encode()).hexdigest()
    if "--revoice" in sys.argv or cache.get(ln["id"], {}).get("sig") != sig or not os.path.exists(wav):
        raw = wav + ".mp3"
        body = json.dumps({"text": ln["tts"], "model_id": CFG["model"]})
        code = subprocess.run(["curl", "-s", "-o", raw, "-w", "%{http_code}", "-X", "POST",
            f"https://api.elevenlabs.io/v1/text-to-speech/{CFG['voice']}?output_format=mp3_44100_128",
            "-H", f"xi-api-key: {KEY}", "-H", "Content-Type: application/json", "-d", body], capture_output=True, text=True).stdout
        if code != "200": sys.exit(f"ElevenLabs refused {ln['id']} ({code}): {open(raw).read()[:200]}")
        run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
             "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,"
             "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse,"
             "afade=t=in:d=0.015,loudnorm=I=-16:TP=-2:LRA=9,aresample=48000", "-ac", "2", wav])
        os.remove(raw)
        import mlx_whisper
        r = mlx_whisper.transcribe(wav, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", word_timestamps=True)
        heard = [[round(w["start"], 3), round(w["end"], 3), w["word"].strip()] for sg in r["segments"] for w in sg["words"]]
        cache[ln["id"]] = {"sig": sig, "words": heard}
    d = dur(wav); words = cache[ln["id"]]["words"]
    at = ln["at"] if "at" in ln else lines[ln["after"]]["at"] + lines[ln["after"]]["dur"] + ln.get("gap", 0.3)
    lines[ln["id"]] = {"id": ln["id"], "at": round(at, 3), "dur": round(d, 3), "file": f"find-promo/vo/{ln['id']}.wav", "text": ln["text"],
                       "words": [{"w": w, "s": round(at + a, 3), "e": round(at + b, 3)} for a, b, w in words]}
json.dump(cache, open(cache_p, "w"), indent=1)
for v in lines.values(): print(f"{v['id']} {v['at']:6.2f}-{v['at'] + v['dur']:6.2f}  {' '.join(x['w'] for x in v['words'])}")

# music: from the point where its beat lands on kick_at
m = CFG["music"]; offset = m["kick"] - m["kick_at"]
mus = os.path.join(PUB, "music.wav")
if not os.path.exists(mus): run(["ffmpeg", "-v", "error", "-y", "-i", m["file"], "-ar", "48000", "-ac", "2", mus])

# sound effects, synthesized, one per visible event
SR = 48000; rng = np.random.default_rng(3)
def save(name, x):
    x = np.clip(x, -1, 1); st = (np.stack([x, x], 1) * 32767).astype("<i2")
    with wave.open(os.path.join(PUB, "sfx", name), "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
t = lambda s: np.arange(int(SR * s)) / SR
x = t(.12); save("pop.wav", np.sin(2 * np.pi * (520 + 900 * np.exp(-x * 40)) * x) * np.exp(-x * 38) * .5)
x = t(.45); n = rng.normal(0, 1, len(x)); env = np.sin(np.pi * np.clip(x / .45, 0, 1)) ** 2
save("whoosh.wav", np.convolve(n, np.ones(40) / 40, "same") * env * .6)
x = t(.35); save("stamp.wav", (np.sin(2 * np.pi * 70 * x) * np.exp(-x * 14) * .9 + np.convolve(rng.normal(0, 1, len(x)), np.ones(8) / 8, "same") * np.exp(-x * 45) * .5))
x = t(.05); save("key.wav", np.convolve(rng.normal(0, 1, len(x)), np.ones(4) / 4, "same") * np.exp(-x * 160) * .35)
x = t(.08); save("click.wav", np.convolve(rng.normal(0, 1, len(x)), np.ones(3) / 3, "same") * np.exp(-x * 120) * .5 + np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 90) * .2)
x = t(.25); save("swish.wav", np.sin(2 * np.pi * (300 + 1400 * x / .25) * x) * np.exp(-x * 9) * .25)

end = max(v["at"] + v["dur"] for v in lines.values()) + 2.6
# mouth: voice loudness per 60 fps frame over the whole film, 0..1, for the coded mascot's lip movement
TOTAL = max(end, 31.0); nfr = int(TOTAL * 60) + 1; mouth = np.zeros(nfr)
for v in lines.values():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(ROOT, "public", v["file"]), "-ac", "1", "-ar", "48000", "-f", "s16le", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768; hop = 800
    rms = np.array([np.sqrt((a[i:i + hop] ** 2).mean()) for i in range(0, len(a) - hop, hop)])
    lvl = np.clip((20 * np.log10(rms + 1e-6) + 38) / 22, 0, 1)
    f0 = int(round(v["at"] * 60)); mouth[f0:f0 + len(lvl)] = np.maximum(mouth[f0:f0 + len(lvl)], lvl[:max(0, nfr - f0)])
mouth = np.convolve(mouth, [.25, .5, .25], "same")
tl = {"fps": 60, "width": 1920, "height": 1080, "duration": round(max(end, 31.0), 2),
      "music": {"file": "find-promo/music.wav", "offset": round(offset, 3), "beat": 0.53, "kick_at": m["kick_at"]},
      "lines": list(lines.values()), "mouth": [round(float(x), 2) for x in mouth]}
json.dump(tl, open(os.path.join(ROOT, "src/findpromo/timeline.json"), "w"), indent=1)
print("duration", tl["duration"])
