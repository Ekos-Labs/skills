#!/usr/bin/env python3
"""One image of many frames, for checking a whole film at a glance (ffmpeg only).

    python3 contact_sheet.py out/promo-wide-master.mp4 sheet.jpg --times 0.8,3,6.5,10,16,20,24,29
    python3 contact_sheet.py out/stills/PromoVertical sheet.jpg      # every .jpg in a folder

Check the sheet built from the final file, not only stills: it is the only proof that the render,
the encode and the master all kept every scene.
"""
import argparse, glob, os, shutil, subprocess, tempfile

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("out")
ap.add_argument("--times", help="comma-separated seconds (video input)")
ap.add_argument("--cols", type=int, default=4)
ap.add_argument("--width", type=int, default=480, help="width of each tile")
a = ap.parse_args()

tmp = tempfile.mkdtemp()
try:
    if os.path.isdir(a.src):
        frames = sorted(glob.glob(os.path.join(a.src, "*.jpg")) + glob.glob(os.path.join(a.src, "*.png")))
    else:
        times = [float(x) for x in a.times.split(",")] if a.times else None
        if times is None:
            d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.src]))
            times = [round(d * (i + .5) / 12, 2) for i in range(12)]
        frames = []
        for k, t in enumerate(times):
            f = os.path.join(tmp, f"{k:03d}.jpg")
            subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", a.src, "-frames:v", "1", "-q:v", "3", f], check=True)
            frames.append(f)
    if not frames:
        raise SystemExit("no frames found")
    for k, f in enumerate(frames):
        shutil.copy(f, os.path.join(tmp, f"in_{k:03d}" + os.path.splitext(f)[1]))
    ext = os.path.splitext(frames[0])[1]
    rows = (len(frames) + a.cols - 1) // a.cols
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "1", "-i", os.path.join(tmp, f"in_%03d{ext}"),
                    "-vf", f"scale={a.width}:-2,tile={a.cols}x{rows}:padding=6:color=0x777777", "-frames:v", "1", "-q:v", "3", a.out], check=True)
    print(f"wrote {a.out} ({len(frames)} frames)")
finally:
    shutil.rmtree(tmp, ignore_errors=True)
