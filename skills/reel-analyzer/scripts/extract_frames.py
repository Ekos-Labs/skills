#!/usr/bin/env python3
"""Extract frames at a fixed interval, detect hard cuts, and build a contact sheet."""

import argparse
import math
import os
import re
import subprocess


def extract(video_path, out_dir, interval=1.5):
    """Save one frame every `interval` seconds as f_001.jpg, f_002.jpg, ..."""
    os.makedirs(out_dir, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error", "-i", video_path,
            "-vf", f"fps=1/{interval},scale=540:-2",
            "-qscale:v", "3",
            os.path.join(out_dir, "f_%03d.jpg"),
        ],
        check=True,
    )
    frames = sorted(f for f in os.listdir(out_dir) if f.startswith("f_"))
    # fps=1/N samples the middle of each window, so frame k sits near (k - 0.5) * N.
    return [(round((i + 0.5) * interval, 1), name) for i, name in enumerate(frames)]


def detect_cuts(video_path, threshold=0.3):
    """Timestamps (seconds) where the picture changes hard enough to count as a cut."""
    result = subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-i", video_path,
            "-vf", f"select='gt(scene,{threshold})',showinfo",
            "-an", "-f", "null", "-",
        ],
        capture_output=True, text=True,
    )
    return [round(float(t), 2) for t in re.findall(r"pts_time:([0-9.]+)", result.stderr)]


def contact_sheet(frames_dir, out_path, columns=6):
    """Tile all interval frames into one image so they can be viewed in a single read."""
    count = len([f for f in os.listdir(frames_dir) if f.startswith("f_")])
    if not count:
        return None
    rows = math.ceil(count / columns)
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", os.path.join(frames_dir, "f_%03d.jpg"),
            "-vf", f"scale=240:-2,tile={columns}x{rows}:padding=4:color=white",
            "-frames:v", "1", out_path,
        ],
        check=True,
    )
    return out_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("video")
    parser.add_argument("--out", default=None, help="Frames folder (default: frames/ next to the video)")
    parser.add_argument("--interval", type=float, default=1.5)
    args = parser.parse_args()
    out = args.out or os.path.join(os.path.dirname(os.path.abspath(args.video)), "frames")
    frames = extract(args.video, out, args.interval)
    cuts = detect_cuts(args.video)
    sheet = contact_sheet(out, os.path.join(out, "contact_sheet.jpg"))
    print(f"{len(frames)} frames -> {out}")
    print(f"{len(cuts)} cuts at: {', '.join(str(c) for c in cuts) or 'none'}")
    if sheet:
        print(f"contact sheet -> {sheet}")
