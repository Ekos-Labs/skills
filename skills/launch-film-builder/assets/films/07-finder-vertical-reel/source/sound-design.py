#!/usr/bin/env python3
"""Sound design for the Finder reel.

No voiceover: there is no ElevenLabs key in this workspace, and this script never
takes one. It synthesises the bed and the effects from the cue list in
src/finder/timeline.json, so picture and sound are locked to the same frames.

Palette, matching launch-video/audio-direction.md:
  bed      restrained pulse at 100 BPM, one root per act, no drop, no swell
  keys     the founder typing the URL, one click per character on the typed frames
  sweeps   data scan passes on the hook collect, the engine bus, the report assemble
  impacts  short low thumps on act cuts only
  ticks    soft ceramic ticks when a card or report section lands
  confirms two-note resolve on submit and on the end card

Writes public/audio/finder/reel.wav (48k stereo), loudness-normalised with ffmpeg.
"""
import json, pathlib, subprocess, sys, wave
import numpy as np

SR = 48_000
ROOT = pathlib.Path(__file__).resolve().parents[1]
TL = json.loads((ROOT / "src/finder/timeline.json").read_text())
FPS = TL["fps"]
DUR = TL["durationInFrames"] / FPS
N = int(DUR * SR)
OUT = ROOT / "public/audio/finder/reel.wav"
BPM = 100.0
rng = np.random.default_rng(7)

L = np.zeros(N, dtype=np.float64)
R = np.zeros(N, dtype=np.float64)


def idx(t):
    return int(round(t * SR))


def add(buf, at, sig, gain=1.0):
    """Mix sig into buf at time `at` seconds, clipped to the buffer."""
    i = idx(at)
    if i < 0:
        sig, i = sig[-i:], 0
    j = min(len(buf), i + len(sig))
    if j > i:
        buf[i:j] += sig[: j - i] * gain


def t_of(n):
    return np.arange(n) / SR


def env(n, attack, decay, hold=0.0):
    """Percussive envelope: linear attack, exponential decay."""
    t = t_of(n)
    a = np.clip(t / max(attack, 1e-5), 0, 1)
    d = np.exp(-np.maximum(t - attack - hold, 0) / max(decay, 1e-5))
    return a * d


def noise(n):
    return rng.standard_normal(n)


def band(x, lo=None, hi=None):
    """Zero-phase FFT band filter with a smooth taper. Offline render, so this is fine."""
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1e-6)) ** 4)
    if hi:
        g *= 1 / (1 + (np.maximum(f, 1e-6) / hi) ** 4)
    return np.fft.irfft(spec * g, len(x))


# ----------------------------------------------------------------- bed
def bed_section(dur, root, intensity, pulse, texture, beat_phase):
    n = int(dur * SR)
    t = t_of(n)
    edge = np.minimum(np.clip(t / 0.35, 0, 1), np.clip((dur - t) / 0.5, 0, 1))

    # drone: root, octave, and a quiet fifth that only opens up later
    drift = 1 + 0.0015 * np.sin(2 * np.pi * 0.07 * t)
    tone = (
        0.60 * np.sin(2 * np.pi * root * drift * t)
        + 0.24 * np.sin(2 * np.pi * root * 2 * t + 0.6)
        + 0.14 * intensity * np.sin(2 * np.pi * root * 3 * t + 1.1)
    )
    tone *= 0.55 + 0.45 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t))

    # texture: filtered noise, the fragmented digital layer
    tex = band(noise(n), 700, 4200) * texture * 0.34
    tex *= 0.6 + 0.4 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.23 * t + 1.7))

    sig = tone * 0.5 + tex

    # pulse: one soft note per beat, muted percussive detail, never a drum kit
    if pulse:
        beat = 60.0 / BPM
        k = 0
        while k * beat + beat_phase < dur:
            at = k * beat + beat_phase
            m = int(0.16 * SR)
            click = band(noise(m), 1800, 7000) * env(m, 0.001, 0.028) * 0.16
            sub = np.sin(2 * np.pi * root * 1.0 * t_of(m)) * env(m, 0.004, 0.09) * 0.22
            accent = 1.0 if k % 4 == 0 else 0.55
            i = idx(at)
            j = min(n, i + m)
            sig[i:j] += (click + sub)[: j - i] * accent * intensity
            k += 1

    return sig * edge * intensity


phase = 0.0
for s in TL["audio"]["bed"]:
    dur = s["to"] - s["from"]
    sig = bed_section(dur, s["root"], s["intensity"], s["pulse"], s["texture"], phase)
    # a touch of width: the same bed, a few ms apart, is enough
    add(L, s["from"], sig, 0.30)
    add(R, s["from"] + 0.011, sig, 0.30)
    beat = 60.0 / BPM
    phase = (phase + dur) % beat
    phase = (beat - phase) % beat

# ----------------------------------------------------------------- impacts
for c in TL["audio"]["impacts"]:
    n = int(0.9 * SR)
    t = t_of(n)
    f = 74 * np.exp(-t / 0.14) + 38
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.17)
    air = band(noise(n), 300, 5200) * env(n, 0.001, 0.045) * 0.22
    sig = body * 0.9 + air
    add(L, c["at"], sig, 0.42 * c["gain"])
    add(R, c["at"], sig, 0.42 * c["gain"])

# ----------------------------------------------------------------- sweeps
CENTERS = np.geomspace(240, 9000, 14)
for c in TL["audio"]["sweeps"]:
    n = int(c["dur"] * SR)
    t = t_of(n)
    p = t / c["dur"]
    path = np.geomspace(300, 8000, n) if c["dir"] == "up" else np.geomspace(8000, 300, n)
    src = noise(n)
    sig = np.zeros(n)
    for fc in CENTERS:
        w = np.exp(-((np.log(fc) - np.log(path)) ** 2) / (2 * 0.32 ** 2))
        sig += band(src, fc * 0.8, fc * 1.25) * w
    shell = np.sin(np.pi * np.clip(p, 0, 1)) ** 1.4
    sig = sig * shell / 3.4
    add(L, c["at"], sig, 0.30 * c["gain"])
    add(R, c["at"] + 0.006, sig, 0.30 * c["gain"])

# ----------------------------------------------------------------- ticks
for k, at in enumerate(TL["audio"]["ticks"]):
    n = int(0.22 * SR)
    t = t_of(n)
    ping = np.sin(2 * np.pi * (2350 + 90 * (k % 3)) * t) * env(n, 0.0008, 0.035)
    edge = band(noise(n), 2600, 11000) * env(n, 0.0005, 0.012) * 0.5
    sig = (ping * 0.7 + edge) * 0.5
    pan = -0.22 if k % 2 else 0.22
    add(L, at, sig, 0.20 * (1 - max(0, pan)))
    add(R, at, sig, 0.20 * (1 + min(0, pan)))

# ----------------------------------------------------------------- keyboard entry
ty = TL["typing"]
scene_from = next(s["from"] for s in TL["scenes"] if s["name"].startswith("Input"))
for i, ch in enumerate(ty["text"]):
    at = (scene_from + ty["startFrame"] + i * ty["stepFrames"]) / FPS
    n = int(0.12 * SR)
    t = t_of(n)
    thock = np.sin(2 * np.pi * (1180 + rng.uniform(-90, 90)) * t) * env(n, 0.0006, 0.021)
    clack = band(noise(n), 1400, 9000) * env(n, 0.0004, 0.010)
    sig = (thock * 0.55 + clack * 0.9) * (0.8 + rng.uniform(0, 0.3))
    pan = rng.uniform(-0.18, 0.18)
    add(L, at, sig, 0.26 * (1 - max(0, pan)))
    add(R, at, sig, 0.26 * (1 + min(0, pan)))
# the submit press reads heavier than a letter
sub_at = (scene_from + ty["submitFrame"]) / FPS
n = int(0.2 * SR)
press = band(noise(n), 700, 5200) * env(n, 0.001, 0.03) + np.sin(2 * np.pi * 320 * t_of(n)) * env(n, 0.002, 0.05) * 0.5
add(L, sub_at, press, 0.3)
add(R, sub_at, press, 0.3)

# ----------------------------------------------------------------- confirms
for c in TL["audio"]["confirms"]:
    n = int(1.3 * SR)
    t = t_of(n)
    e1, e2 = env(n, 0.012, 0.42), env(n, 0.012, 0.55)
    sig = (
        np.sin(2 * np.pi * 659.25 * t) * e1 * 0.5
        + np.sin(2 * np.pi * 987.77 * t) * e2 * 0.34
        + np.sin(2 * np.pi * 1318.5 * t) * e1 * 0.14
    )
    add(L, c["at"], sig, 0.22 * c["gain"])
    add(R, c["at"] + 0.008, sig, 0.22 * c["gain"])

# ----------------------------------------------------------------- master
for buf in (L, R):
    buf[:] = band(buf, 26, 17_500)
# gentle fade so the reel can loop on a feed without a click
fade = int(0.35 * SR)
ramp = np.linspace(0, 1, fade)
for buf in (L, R):
    buf[:fade] *= ramp
    buf[-fade:] *= ramp[::-1]

peak = max(np.abs(L).max(), np.abs(R).max())
if peak > 0:
    L *= 0.82 / peak
    R *= 0.82 / peak
L, R = np.tanh(L * 1.12) * 0.9, np.tanh(R * 1.12) * 0.9

OUT.parent.mkdir(parents=True, exist_ok=True)
raw = OUT.with_name("reel-raw.wav")
inter = np.empty(N * 2, dtype=np.int16)
inter[0::2] = np.clip(L * 32767, -32768, 32767).astype(np.int16)
inter[1::2] = np.clip(R * 32767, -32768, 32767).astype(np.int16)
with wave.open(str(raw), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(inter.tobytes())

cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
       "-af", "loudnorm=I=-17:TP=-1.5:LRA=9", "-ar", str(SR), "-ac", "2",
       "-c:a", "pcm_s16le", str(OUT)]
if subprocess.run(cmd).returncode != 0:
    print("ffmpeg loudnorm failed, keeping the raw mix", file=sys.stderr)
    raw.replace(OUT)
else:
    raw.unlink()
print(f"Wrote {OUT.relative_to(ROOT)} ({DUR:.1f}s)")
