#!/usr/bin/env python3
"""Master a rendered film for social: two-pass loudness to -14 LUFS (true peak -1.5 dB), video
stream copied untouched, AAC 256k, fast start. Optionally writes a small preview to send around.

    python3 master.py out/PromoWide.mp4 out/promo-wide-master.mp4 --preview out/promo-wide-preview.mp4
"""
import argparse, json, re, subprocess

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("dst")
ap.add_argument("--preview")
ap.add_argument("--lufs", type=float, default=-14)
ap.add_argument("--tp", type=float, default=-1.5)
a = ap.parse_args()

target = f"I={a.lufs}:TP={a.tp}:LRA=11"
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.src, "-af", f"loudnorm={target}:print_format=json", "-f", "null", "-"], capture_output=True, text=True)
m = json.loads(re.findall(r"\{[^{}]*\}", r.stderr)[-1])
af = (f"loudnorm={target}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
      f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", a.src, "-c:v", "copy", "-af", af,
                "-ar", "48000", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", a.dst], check=True)
if a.preview:
    # 1280 on the long side, whichever way round the film is
    subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", a.dst,
                    "-vf", "scale='if(gt(iw,ih),1280,-2)':'if(gt(iw,ih),-2,1280)'", "-c:v", "libx264", "-crf", "22",
                    "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", a.preview], check=True)
r = subprocess.run(["ffmpeg", "-hide_banner", "-i", a.dst, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
s = r.stderr[r.stderr.rfind("Summary:"):]
i = re.search(r"I:\s+(-?[\d.]+) LUFS", s)
p = re.search(r"Peak:\s+(-?[\d.]+) dBFS", s)
print(f"mastered {a.dst}: {i.group(1) if i else '?'} LUFS, true peak {p.group(1) if p else '?'} dBFS" + (f"; preview {a.preview}" if a.preview else ""))
