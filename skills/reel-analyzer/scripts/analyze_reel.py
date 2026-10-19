#!/usr/bin/env python3
"""Analyze one public reel or short: metadata, outlier check, frames, cuts, transcript, breakdown draft.

Writes <out>/<id>/ with meta.json, frames/, frames/contact_sheet.jpg, transcript.json (when
GROQ_API_KEY is set) and breakdown.md. The video file is deleted at the end unless --keep-video.
"""

import argparse
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _common import (  # noqa: E402
    age_days, fetch_metadata, fmt_time, followers_from, outlier_verdict, paid_markers, run_ytdlp,
)
from extract_frames import contact_sheet, detect_cuts, extract  # noqa: E402
from transcribe_groq import transcribe  # noqa: E402

TODO = "_(agent: fill in)_"


def download(url, dest_dir, cookies_from_browser=None):
    run_ytdlp(
        ["-S", "res:720,ext:mp4:m4a", "--merge-output-format", "mp4",
         "-o", os.path.join(dest_dir, "video.%(ext)s"), url],
        cookies_from_browser,
    )
    for name in os.listdir(dest_dir):
        if name.startswith("video."):
            return os.path.join(dest_dir, name)
    sys.exit("yt-dlp reported success but no video file was written.")


def probe_duration(video_path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video_path],
        capture_output=True, text=True,
    ).stdout.strip()
    try:
        return round(float(out), 1)
    except ValueError:
        return None


def nearest_frame(t, frames):
    return min(frames, key=lambda f: abs(f[0] - t))[1] if frames else ""


def build_beats(transcript, frames, cuts, duration):
    """Beat rows: one per transcript segment, or one per shot when there is no transcript."""
    if transcript and transcript["segments"]:
        return [(s["start"], s["text"], nearest_frame(s["start"], frames)) for s in transcript["segments"]]
    # Without speech timing, use every hard cut plus a row every 5 seconds, so a talking
    # head with few cuts still gets enough rows to read the on-screen text into.
    starts = sorted({0.0, *cuts, *(float(t) for t in range(5, int(duration or 0), 5))})
    deduped = [t for i, t in enumerate(starts) if i == 0 or t - starts[i - 1] >= 1.5]
    return [(t, "(no transcript: read from frame)", nearest_frame(t, frames)) for t in deduped]


def write_breakdown(path, rec, transcript, beats):
    o = rec["outlier"]
    p = rec["pacing"]
    lines = [
        f"# Reel breakdown: {rec['uploader'] or 'unknown'} / {rec['id']}",
        "",
        f"Link: {rec['url']}",
        "",
        "## Metadata",
        "",
        f"- Creator: {rec['uploader'] or 'unknown'}"
        + (f" ({rec['followers']:,} followers)" if rec["followers"] else " (followers unknown)"),
        f"- Posted: {rec['upload_date'] or 'unknown'}"
        + (f" ({rec['age_days']} days ago)" if rec["age_days"] is not None else ""),
        f"- Duration: {rec['duration_seconds']}s",
        f"- Views: {rec['view_count'] if rec['view_count'] is not None else 'not public (pass --views N from the reels grid)'}"
        f" | Likes: {rec['like_count'] if rec['like_count'] is not None else 'n/a'}"
        f" | Comments: {rec['comment_count'] if rec['comment_count'] is not None else 'n/a'}",
        f"- Title: {rec['title'] or '(none)'}",
        "",
        "## Caption",
        "",
        *[f"> {line}" for line in (rec["caption"] or "(none)").strip().splitlines()],
        "",
        "## Outlier check",
        "",
        f"- Views / followers: {o['ratio'] if o['ratio'] is not None else 'unknown (pass --followers N and, if views are missing, --views N)'}",
        f"- Paid partnership markers in caption: {', '.join(o['paid_markers']) or 'none found'}",
        f"- Verdict: {'OUTLIER (2x+, recent, not paid)' if o['is_outlier'] else 'not a verified outlier: ' + '; '.join(o['reasons'])}",
        "",
        "## Pacing (measured)",
        "",
        f"- Hard cuts: {p['cuts']} ({p['cuts_per_10s']} per 10 seconds) at {', '.join(fmt_time(c) for c in p['cut_times']) or 'none'}",
        f"- Words per second: {p['words_per_second'] if p['words_per_second'] is not None else 'n/a (no transcript)'}"
        + (f" ({p['word_count']} words)" if p["word_count"] else ""),
        f"- First spoken words at: {fmt_time(p['first_speech_at']) if p['first_speech_at'] is not None else 'n/a'}",
        "",
        "## Transcript",
        "",
    ]
    if transcript:
        lines += [f"[{fmt_time(s['start'])}] {s['text']}" for s in transcript["segments"]] or [transcript["text"]]
    else:
        lines.append("(no transcript: GROQ_API_KEY not set or transcription failed. Read speech and text from the frames.)")
    lines += [
        "",
        "## Beat table",
        "",
        "| Time | Spoken | On screen | Purpose |",
        "|---|---|---|---|",
    ]
    for t, spoken, frame in beats:
        spoken = spoken.replace("|", "/")
        lines.append(f"| {fmt_time(t)} | {spoken} | {TODO} `frames/{frame}` | {TODO} |")
    lines += [
        "",
        "## Hook",
        "",
        f"- Spoken (0 to 3s): {TODO}",
        f"- On screen (0 to 3s): {TODO}",
        f"- Hook type (name from references/reel-patterns.md): {TODO}",
        f"- Bridge type: {TODO}",
        f"- Conflict: {TODO}",
        f"- Story shape: {TODO}",
        f"- Time to first payoff: {TODO}",
        "",
        "## Ending and CTA",
        "",
        f"{TODO}",
        "",
        "## What transfers to the user's niche",
        "",
        f"- Transfers: {TODO}",
        f"- Depends on this creator (personality, audience, budget): {TODO}",
        "",
        "Frames: `frames/` (contact sheet: `frames/contact_sheet.jpg`).",
    ]
    with open(path, "w") as f:
        f.write("\n".join(lines) + "\n")


def analyze(url, out_root, interval=1.5, followers=None, skip_transcript=False,
            keep_video=False, cookies_from_browser=None, max_days=90, views=None):
    meta = fetch_metadata(url, cookies_from_browser)
    post_id = meta.get("id", "unknown")
    dest = os.path.join(out_root, post_id)
    os.makedirs(dest, exist_ok=True)

    print(f"[{post_id}] downloading video...", file=sys.stderr)
    video = download(url, dest, cookies_from_browser)
    duration = meta.get("duration") or probe_duration(video)

    print(f"[{post_id}] extracting frames and cuts...", file=sys.stderr)
    frames_dir = os.path.join(dest, "frames")
    frames = extract(video, frames_dir, interval)
    cuts = detect_cuts(video)
    contact_sheet(frames_dir, os.path.join(frames_dir, "contact_sheet.jpg"))

    transcript = None
    transcript_note = None
    if skip_transcript:
        transcript_note = "skipped (--no-transcript)"
    elif not os.environ.get("GROQ_API_KEY"):
        transcript_note = "GROQ_API_KEY not set"
        print(f"[{post_id}] GROQ_API_KEY not set, skipping transcript", file=sys.stderr)
    else:
        print(f"[{post_id}] transcribing audio with Groq...", file=sys.stderr)
        try:
            transcript = transcribe(video)
            with open(os.path.join(dest, "transcript.json"), "w") as f:
                json.dump(transcript, f, indent=2, ensure_ascii=False)
        except RuntimeError as e:
            transcript_note = f"failed: {e}"
            print(f"[{post_id}] transcription failed, continuing without it: {e}", file=sys.stderr)

    followers = followers or followers_from(meta)
    if views is not None:
        meta["view_count"] = views
    days = age_days(meta.get("upload_date"), meta.get("timestamp"))
    paid = paid_markers(" ".join(filter(None, [meta.get("description"), meta.get("title")])))
    upload = meta.get("upload_date")
    ratio, is_outlier, reasons = outlier_verdict(meta.get("view_count"), followers, days, paid, max_days=max_days)

    words = len(transcript["text"].split()) if transcript else 0
    rec = {
        "id": post_id,
        "url": meta.get("webpage_url", url),
        "uploader": meta.get("uploader") or meta.get("channel"),
        "followers": followers,
        "title": meta.get("title"),
        "caption": meta.get("description"),
        "view_count": meta.get("view_count"),
        "like_count": meta.get("like_count"),
        "comment_count": meta.get("comment_count"),
        "duration_seconds": duration,
        "upload_date": f"{upload[:4]}-{upload[4:6]}-{upload[6:]}" if upload else None,
        "age_days": days,
        "outlier": {"ratio": ratio, "is_outlier": is_outlier, "reasons": reasons, "paid_markers": paid},
        "pacing": {
            "cuts": len(cuts),
            "cut_times": cuts,
            "cuts_per_10s": round(len(cuts) / duration * 10, 1) if duration else None,
            "word_count": words,
            "words_per_second": round(words / duration, 2) if words and duration else None,
            "first_speech_at": transcript["segments"][0]["start"] if transcript and transcript["segments"] else None,
        },
        "transcript_status": "ok" if transcript else transcript_note,
        "frames": [{"t": t, "file": name} for t, name in frames],
        "frames_dir": frames_dir,
    }
    with open(os.path.join(dest, "meta.json"), "w") as f:
        json.dump(rec, f, indent=2, ensure_ascii=False)

    write_breakdown(os.path.join(dest, "breakdown.md"), rec, transcript,
                    build_beats(transcript, frames, cuts, duration))

    if keep_video:
        rec["video_path"] = video
    else:
        os.remove(video)
    print(f"[{post_id}] done -> {dest}", file=sys.stderr)
    return rec


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("urls", nargs="+", help="One or more public reel / short / TikTok URLs")
    parser.add_argument("--out", default="./reel-analysis", help="Output root (default ./reel-analysis)")
    parser.add_argument("--interval", type=float, default=1.5, help="Seconds between frames (default 1.5)")
    parser.add_argument("--followers", type=int, help="Account follower count, if yt-dlp cannot read it")
    parser.add_argument("--views", type=int, help="View count, if yt-dlp cannot read it (Instagram often hides it)")
    parser.add_argument("--max-days", type=int, default=90, help="Outlier recency window in days (30 to 90)")
    parser.add_argument("--no-transcript", action="store_true", help="Skip Groq even if the key is set")
    parser.add_argument("--keep-video", action="store_true", help="Keep the downloaded video file")
    parser.add_argument("--cookies-from-browser", metavar="BROWSER",
                        help="Use the user's own logged-in browser session (only with their OK)")
    args = parser.parse_args()

    if args.views is not None and len(args.urls) > 1:
        sys.exit("--views applies to one URL at a time.")
    results = [
        analyze(u, args.out, args.interval, args.followers, args.no_transcript,
                args.keep_video, args.cookies_from_browser, args.max_days, args.views)
        for u in args.urls
    ]
    print(json.dumps(
        [{"id": r["id"], "dir": os.path.join(args.out, r["id"]), "outlier": r["outlier"],
          "transcript": r["transcript_status"]} for r in results],
        indent=2,
    ))
