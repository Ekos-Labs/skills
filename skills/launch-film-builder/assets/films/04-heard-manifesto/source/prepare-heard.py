"""Build 'It's time to be heard.' from src/heard/script.json.

Voices (ElevenLabs when the key allows speech, Mac `say` as a stand-in otherwise), archival
sound bites, the bell, the cut list and every graded 4:3 shot, then write src/heard/timeline.json
for the Remotion composition EkosHeard. Re-run after any script change; unchanged work is cached.
    python3 scripts/prepare-heard.py            # build
    python3 scripts/prepare-heard.py --revoice  # regenerate every voice line
"""
import hashlib, json, math, os, subprocess, sys, wave
from concurrent.futures import ThreadPoolExecutor
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT = json.load(open(os.path.join(ROOT, "src/heard/script.json")))
PUB = os.path.join(ROOT, "public/heard")
for d in ("shots", "vo", "bites", "sfx"):
    os.makedirs(os.path.join(PUB, d), exist_ok=True)
FPS, W, H = SCRIPT["fps"], SCRIPT["width"], SCRIPT["height"]
KEY_FILE = os.environ.get("EL_KEY_FILE", "")
MODERN = {"qCId-swJ19w", "MtSfqShtQr8", "5Ozo9fy4ajM", "S-b0OpWO4So", "PYnjuj66ZIs", "RtXet2lutI0", "kMdGCXbXy6U",
          "uxpPDyXzmw4", "XlpGKauLvB0", "1d-vk39ADvk", "USE2BEBMGiI", "p6bw_1ThB1o", "1EXtvwTNAeE",
          "irdNqlytsLc", "ODaHJzOyVCQ", "dB6pOolO7io", "CIJx494VsOU", "K27diMbCsuw", "5MWT_doo68k"}
GRADE = {
 "archival": "eq=contrast=1.12:brightness=-0.01:saturation=0.9,colorbalance=rs=0.05:gs=0.01:bs=-0.05:rm=0.04:bm=-0.04,"
             "curves=master='0/0.02 0.25/0.22 0.75/0.8 1/0.97'",
 "modern": "eq=contrast=1.08:brightness=-0.02:saturation=0.8,colorbalance=rs=0.03:bs=-0.03:rm=0.03:bm=-0.02:rh=0.05:bh=-0.04,"
           "curves=master='0/0.02 0.25/0.22 0.75/0.78 1/0.97'",
}

def run(cmd):
    subprocess.run(cmd, check=True)

def dur(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]))

# ---------- voices ----------
def eleven(text, voice, out_mp3):
    if not KEY_FILE or not os.path.exists(KEY_FILE):
        return False
    key = open(KEY_FILE).read().strip()
    body = json.dumps({"text": text, "model_id": "eleven_multilingual_v2",
                       "voice_settings": {"stability": 0.55, "similarity_boost": 0.8, "style": 0.25, "use_speaker_boost": True}})
    code = subprocess.run(["curl", "-s", "-o", out_mp3, "-w", "%{http_code}", "-X", "POST",
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128",
        "-H", f"xi-api-key: {key}", "-H", "Content-Type: application/json", "-d", body],
        capture_output=True, text=True).stdout.strip()
    if code != "200":
        print(f"  ElevenLabs refused ({code}): {open(out_mp3).read()[:200]}", file=sys.stderr)
    return code == "200"

manifest_path = os.path.join(PUB, "vo/manifest.json")
manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
lines = {}
for lid, (who, text) in SCRIPT["lines"].items():
    v = SCRIPT["voices"][who]
    wav = os.path.join(PUB, "vo", lid + ".wav")
    sig = hashlib.md5((who + text + "v2").encode()).hexdigest()
    m = manifest.get(lid, {})
    stale = "--revoice" in sys.argv or m.get("sig") != sig or not os.path.exists(wav)
    if not stale and m.get("engine") == "say" and KEY_FILE:
        stale = True  # try to upgrade stand-ins to the real voice
    if stale:
        raw = os.path.join(PUB, "vo", lid + ".raw.mp3")
        engine = "eleven" if eleven(text, v["eleven"], raw) else "say"
        if engine == "say":
            raw = os.path.join(PUB, "vo", lid + ".raw.aiff")
            run(["say", "-v", v["say"], "-r", str(v["rate"]), "-o", raw, text])
        # trim silence at both ends, 48 kHz stereo
        run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af",
             "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,areverse,"
             "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,"
             "afade=t=in:d=0.02," + ("aecho=0.8:0.6:45|90:0.08|0.05," if who == "narrator" else "") +
             "loudnorm=I=-17:TP=-2:LRA=9,aresample=48000", "-ac", "2", wav])
        os.remove(raw)
        manifest[lid] = {"sig": sig, "engine": engine}
    lines[lid] = {"file": f"heard/vo/{lid}.wav", "dur": dur(wav), "text": text, "who": who, "engine": manifest[lid]["engine"]}
json.dump(manifest, open(manifest_path, "w"), indent=1)
print("voices:", {k: (round(v["dur"], 2), v["engine"]) for k, v in lines.items()})

# ---------- bites ----------
bites = {}
for bid, b in SCRIPT["bites"].items():
    wav = os.path.join(PUB, "bites", bid + ".wav")
    d = b["out"] - b["in"]
    if not os.path.exists(wav):
        src = b.get("path") or os.path.join(SCRIPT["dirs"]["bite"], b["src"] + ".mp4")
        run(["ffmpeg", "-v", "error", "-y", "-ss", str(b["in"]), "-t", str(d), "-i", src, "-vn", "-af",
             f"afade=t=in:d=0.03,afade=t=out:st={d - 0.05:.3f}:d=0.05,loudnorm=I=-18:TP=-2:LRA=11,aresample=48000",
             "-ac", "2", wav])
    bites[bid] = {"file": f"heard/bites/{bid}.wav", "dur": dur(wav), "text": b["text"]}

# ---------- bell ----------
bell = os.path.join(PUB, "sfx/bell.wav")
if not os.path.exists(bell):
    sr = 48000; t = np.arange(int(sr * 3.2)) / sr; x = np.zeros_like(t)
    for ratio, amp, dec in [(1, 1, 1.6), (2.76, .55, 2.4), (5.4, .35, 3.5), (8.93, .2, 5.0), (13.3, .12, 7.0)]:
        for k in (0, .33, .66):  # three strikes of a handbell
            s = (t - k).clip(0); env = np.where(t >= k, np.exp(-s * dec), 0)
            x += amp * env * np.sin(2 * np.pi * 820 * ratio * s) * (1 - .25 * k)
    x = x / np.abs(x).max() * .5
    with wave.open(bell, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((np.stack([x, x], 1) * 32767).astype("<i2").tobytes())
SFX = {"bell": {"file": "heard/sfx/bell.wav", "dur": 3.2}}

# ---------- timeline ----------
def audio_of(ev):
    if "line" in ev: return lines[ev["line"]], "vo"
    if "bite" in ev: return bites[ev["bite"]], "bite"
    return SFX[ev["sfx"]], "sfx"

t = 0.0; events_out = []; shots_out = []; marks = {}
for sec in SCRIPT["sections"]:
    start = t
    if "music_mark" in sec: marks[sec["music_mark"]] = start
    evs = []
    if "fixed" in sec:
        for ev in sec["events"]:
            a, kind = audio_of(ev); evs.append((start + ev["at"], a, kind, ev))
        length = sec["fixed"]
    else:
        cur = start
        for ev in sec["events"]:
            a, kind = audio_of(ev)
            at = start + ev["at"] if "at" in ev else cur + ev.get("gap", 0.2)
            evs.append((at, a, kind, ev)); cur = max(cur, at + a["dur"]) if kind != "sfx" else cur
        length = max(cur - start + sec.get("tail", 0.3), sec.get("min", 0))
    for at, a, kind, ev in evs:
        events_out.append({"at": round(at, 3), "dur": round(a["dur"], 3), "file": a["file"], "kind": kind,
                           "text": a.get("text", ""), "who": a.get("who", "archive" if kind == "bite" else "")})
    # shots: anchored groups fill the gaps between their anchors, by weight
    shots = sec["shots"]; ev_starts = [e[0] for e in evs]
    if all("d" in s for s in shots):
        cur = start
        for s in shots:
            shots_out.append(dict(s, at=cur, dur=s["d"])); cur += s["d"]
        if abs(cur - (start + length)) > 0.02: print(f"  note: {sec['name']} shots run {cur - start:.2f}s of {length:.2f}s")
    else:
        # a shot with an anchor opens a new group that starts just before its event (the first shot always opens at start)
        groups = []; gstarts = []
        for k, s in enumerate(shots):
            if k == 0 or "anchor" in s:
                groups.append([]); gstarts.append(start if k == 0 else ev_starts[s["anchor"]] - 0.08)
            groups[-1].append(s)
        gends = gstarts[1:] + [start + length]
        for g, a, b in zip(groups, gstarts, gends):
            fixed = sum(s["d"] for s in g if "d" in s); ws = sum(s.get("w", 1.0) for s in g if "d" not in s)
            cur = a
            for s in g:
                d = s["d"] if "d" in s else (b - a - fixed) * s.get("w", 1.0) / ws
                shots_out.append(dict(s, at=cur, dur=d)); cur += d
    print(f"{sec['name']:22s} {start:6.2f} -> {start + length:6.2f}  ({length:.2f}s, {len(shots)} shots)")
    t = start + length
TOTAL = t
offset = SCRIPT["music"]["drop"] - marks["drop"]
print(f"total {TOTAL:.2f}s   music offset {offset:.2f}s   downbeat lands at film {SCRIPT['music']['downbeat'] - offset:.2f}s (finale at {marks['downbeat']:.2f}s)")

# ---------- extract shots ----------
def resolved_crop(s):
    sid = s["s"].split(":", 1)[1]; c = s.get("crop")
    return SCRIPT["crops"].get(c, c) if c else SCRIPT["crops"].get(sid)

def key(s):
    return hashlib.md5(json.dumps([s.get("s"), s.get("in"), round(s["dur"], 3), resolved_crop(s), GRADE]).encode()).hexdigest()[:12]

def extract(s):
    if "s" not in s: return None
    dirk, sid = s["s"].split(":", 1)
    src = os.path.join(SCRIPT["dirs"][dirk], sid + ".mp4")
    name = key(s) + ".mp4"; dst = os.path.join(PUB, "shots", name)
    if not os.path.exists(dst):
        crop = resolved_crop(s)
        look = "modern" if (dirk in ("v1", "cam") or sid in MODERN) else "archival"
        vf = ",".join(x for x in [crop, f"scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos", f"crop={W}:{H}",
                                  f"fps={FPS}", GRADE[look], "format=yuv420p"] if x)
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s['in']:.3f}", "-i", src, "-t", f"{s['dur'] + 0.3:.3f}", "-an",
             "-vf", vf, "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-g", "8", dst])
    return "heard/shots/" + name

with ThreadPoolExecutor(6) as ex:
    files = list(ex.map(extract, shots_out))
for s, f in zip(shots_out, files):
    if f: s["file"] = f
    if "s" in s:
        dk, sid = s["s"].split(":", 1); s["look"] = "modern" if (dk == "v1" or sid in MODERN) else "archival"

# ---------- music ducking, per frame ----------
n = int(math.ceil(TOTAL * FPS)); vol = np.ones(n)
fin = int(marks["downbeat"] * FPS)
for e in events_out:
    if e["kind"] == "sfx": continue
    a, b = int((e["at"] - .15) * FPS), int((e["at"] + e["dur"] + .2) * FPS)
    vol[max(0, a):min(n, b)] = np.minimum(vol[max(0, a):min(n, b)], .24 if a >= fin else .42)
vol[fin:] *= .62                                                         # the finale swell is ~10 dB hotter than the body
vol = np.convolve(vol, np.ones(7) / 7, mode="same")                     # 0.2 s ramps
fi = int(2.2 * FPS); vol[:fi] *= np.linspace(0, 1, fi) ** 1.5            # fade in under the bell
fo = int(4.5 * FPS); vol[-fo:] *= np.linspace(1, 0, fo) ** 1.3          # fade out under the mark

# ---------- captions: short phrases timed to the spoken words ----------
cap_cache_path = os.path.join(PUB, "captions_cache.json")
cap_cache = json.load(open(cap_cache_path)) if os.path.exists(cap_cache_path) else {}
def word_times(rel, text):
    path = os.path.join(ROOT, "public", rel); sig = hashlib.md5(open(path, "rb").read()).hexdigest()
    if cap_cache.get(rel, {}).get("sig") != sig:
        import mlx_whisper
        r = mlx_whisper.transcribe(path, path_or_hf_repo="mlx-community/whisper-large-v3-turbo", word_timestamps=True)
        cap_cache[rel] = {"sig": sig, "words": [[w["start"], w["end"], w["word"].strip()] for sg in r["segments"] for w in sg["words"]]}
    heard = cap_cache[rel]["words"]; script = text.split()
    if len(heard) == len(script):                      # same count: script words on whisper timings
        return [[a, b, w] for (a, b, _), w in zip(heard, script)]
    total = sum(len(w) for w in script); t0 = heard[0][0] if heard else 0; t1 = heard[-1][1] if heard else 1
    out = []; cur = t0                                 # otherwise spread script words by length
    for w in script:
        d = (t1 - t0) * len(w) / total; out.append([cur, cur + d, w]); cur += d
    return out
STOP = {"the", "a", "an", "to", "of", "our", "their", "your", "be", "in", "on", "and", "is", "was", "had", "has", "we", "i", "for", "with", "at", "now", "this", "that"}
def split_words(ws, most=9):
    """One cue per sentence; long ones split at the comma nearest the middle, else at the most balanced
    boundary that doesn't leave a small word hanging at a line end."""
    if len(ws) <= most: return [ws]
    n = len(ws); mid = n / 2
    def score(k):
        return abs(k - mid) + (4 if ws[k - 1][2].lower().strip(",.") in STOP else 0) - (1.5 if ws[k - 1][2][-1] in ",;:" else 0)
    k = min(range(2, n - 1), key=score)
    return split_words(ws[:k], most) + split_words(ws[k:], most)
captions = []
for e in events_out:
    if not e["text"] or e["kind"] == "sfx": continue
    words = word_times(e["file"], e["text"])
    shown = SCRIPT.get("caption_breaks", {}).get(e["text"], e["text"])
    sizes = [len(g.split()) for g in shown.split(" | ")]
    groups = []; i = 0
    for sz in sizes: groups.append(words[i:i + sz]); i += sz
    for g in groups:
        sent = []
        for j, x in enumerate(g):
            sent.append(x)
            if x[2][-1] in ".?!" or j == len(g) - 1:
                for chunk in split_words(sent):
                    captions.append({"start": round(e["at"] + chunk[0][0] - .06, 3), "end": round(e["at"] + chunk[-1][1] + .12, 3),
                                     "text": " ".join(x[2] for x in chunk), "who": e["who"]})
                sent = []
for a, b in zip(captions, captions[1:]):                 # no overlaps, no flicker between phrases
    if a["end"] > b["start"]: a["end"] = b["start"]
    if b["start"] - a["end"] < .12: a["end"] = b["start"]
json.dump(cap_cache, open(cap_cache_path, "w"))
print(f"captions: {len(captions)} phrases")

timeline = {"fps": FPS, "captions": captions, "width": W, "height": H, "duration": round(TOTAL, 3), "frames": n,
            "music": {"file": "heard/music.wav", "offset": round(offset, 3), "volume": [round(float(v), 3) for v in vol]},
            "events": events_out,
            "shots": [{k: (round(v, 3) if isinstance(v, float) else v) for k, v in s.items() if k not in ("w",)} for s in shots_out],
            "logos": (lambda L: dict(L, start=marks["downbeat"] + L.get("at", 0)))(next(s for s in SCRIPT["sections"] if s["name"] == "finale")["logos"])}
json.dump(timeline, open(os.path.join(ROOT, "src/heard/timeline.json"), "w"), indent=1)
music = os.path.join(PUB, "music.wav")
if not os.path.exists(music):
    run(["ffmpeg", "-v", "error", "-y", "-i", SCRIPT["music"]["file"], "-ar", "48000", "-ac", "2", music])
print(f"wrote timeline: {len(shots_out)} shots, {len(events_out)} sound events")
