"""Cut, conform and grade every shot in src/jarvis/edl.json into public/jarvis/clips.
Per-segment extract (video-use rule 2), grade applied during extraction, 1920x1080 @ 30 fps,
no audio. Also writes the music bed, the grain plate and the synthesized sound effects."""
import json, os, subprocess, sys, wave
from concurrent.futures import ThreadPoolExecutor
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDL = json.load(open(os.path.join(ROOT, "src/jarvis/edl.json")))
OUT = os.path.join(ROOT, "public/jarvis")
GRADE = ("eq=contrast=1.08:brightness=-0.015:saturation=0.86,"
         "colorbalance=rs=0.02:bs=-0.02:rm=0.03:bm=-0.015:rh=0.05:bh=-0.03,"
         "curves=master='0/0 0.25/0.225 0.75/0.775 1/1'")
HANDLE = 0.3  # spare tail so the last frame never runs out

def cut(c):
    dst = os.path.join(OUT, "clips", c["id"] + ".mp4")
    if os.path.exists(dst) and "--force" not in sys.argv:
        return c["id"] + " cached"
    src = os.path.join(EDL["source_dir"], c["src"] + ".mp4")
    vf = ",".join(x for x in [c.get("precrop"),
        "scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos",
        "crop=1920:1080", "fps=30", GRADE, "format=yuv420p"] if x)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{c['in']:.3f}", "-i", src,
        "-t", f"{c['dur'] + HANDLE:.3f}", "-an", "-vf", vf, "-c:v", "libx264", "-preset", "medium",
        "-crf", "15", "-g", "10", dst], check=True)
    return c["id"]

with ThreadPoolExecutor(6) as ex:
    for r in ex.map(cut, EDL["clips"]):
        print("clip", r)

# Music bed: the track from its offset, long enough for the film, 48 kHz stereo.
m = EDL["music"]
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(m["offset"]), "-i", m["file"], "-t",
    str(EDL["duration"] + 0.5), "-ar", "48000", "-ac", "2", os.path.join(OUT, "music.wav")], check=True)
print("music")

# Grain plate: 2 s of animated luma noise around mid grey, blended as overlay in the film.
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "color=c=0x808080:s=1920x1080:r=30:d=2",
    "-vf", "noise=alls=26:allf=t+u,format=yuv420p", "-c:v", "libx264", "-crf", "20", "-g", "10",
    os.path.join(OUT, "grain.mp4")], check=True)
print("grain")

# Sound effects, synthesized so every one is tied to a visible event.
SR = 48000
def write(name, x):
    x = np.clip(x, -1, 1)
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, "sfx", name), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype("<i2").tobytes())

def env(n, a, r):
    e = np.ones(n); ai = int(a * SR); ri = int(r * SR)
    e[:ai] = np.linspace(0, 1, ai); e[-ri:] = np.linspace(1, 0, ri)
    return e

rng = np.random.default_rng(7)
# Phone buzz: two short motor pulses on a bedside table.
parts = []
for i in range(2):
    n = int(0.32 * SR); t = np.arange(n) / SR
    motor = np.sign(np.sin(2 * np.pi * 160 * t)) * 0.5 + np.sin(2 * np.pi * 320 * t) * 0.3
    rattle = rng.normal(0, 0.25, n) * (0.5 + 0.5 * np.sin(2 * np.pi * 32 * t))
    s = (motor + rattle) * env(n, 0.02, 0.06)
    s = np.convolve(s, np.ones(24) / 24, mode="same")  # soften, it is heard through wood
    parts += [s * 0.55, np.zeros(int(0.16 * SR))]
write("buzz.wav", np.concatenate(parts))
# UI tick: a soft, short glassless tick for each new line from Ekos.
n = int(0.09 * SR); t = np.arange(n) / SR
tick = (np.sin(2 * np.pi * 1850 * t) * 0.6 + np.sin(2 * np.pi * 3700 * t) * 0.15) * np.exp(-t * 70)
write("tick.wav", tick * 0.35)
# Click: the approve button.
n = int(0.05 * SR); t = np.arange(n) / SR
click = rng.normal(0, 1, n) * np.exp(-t * 180)
click = np.convolve(click, np.ones(6) / 6, mode="same")
write("click.wav", click * 0.5)
print("sfx")
