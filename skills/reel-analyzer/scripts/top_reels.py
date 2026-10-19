#!/usr/bin/env python3
"""Rank a public account's recent reels / shorts by outlier ratio (views / followers).

Account mode:  python3 top_reels.py "https://www.youtube.com/@handle/shorts"
List mode:     python3 top_reels.py --followers 52000 <reel_url> <reel_url> ...
CSV mode:      python3 top_reels.py --followers 52000 --csv reels.csv   (columns: url,views)

A reel is a verified outlier when views / followers >= 2, it was posted within --max-days
(default 90), and its caption has no paid-partnership marker. Writes top_reels.md and
top_reels.json into --out and prints the JSON.
"""

import argparse
import csv
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _common import (  # noqa: E402
    age_days, fetch_metadata, followers_from, outlier_verdict, paid_markers, run_ytdlp,
)


def account_entries(account_url, limit, cookies_from_browser=None):
    """Full metadata for the newest `limit` posts on an account page, one yt-dlp call."""
    result = run_ytdlp(
        ["--skip-download", "--ignore-errors", "-J", "-I", f"1:{limit}", account_url],
        cookies_from_browser,
    )
    data = json.loads(result.stdout)
    entries = [e for e in (data.get("entries") or []) if e]
    # A channel root returns tabs (Videos, Shorts) as nested playlists. Flatten them.
    flat = []
    for e in entries:
        flat.extend([x for x in e.get("entries") or [] if x] if e.get("_type") == "playlist" else [e])
    return data, flat


def rank(entries, followers, max_days, min_ratio):
    rows = []
    for e in entries:
        days = age_days(e.get("upload_date"), e.get("timestamp"))
        paid = paid_markers(" ".join(filter(None, [e.get("description"), e.get("title")])))
        ratio, ok, reasons = outlier_verdict(e.get("view_count"), followers, days, paid, min_ratio, max_days)
        rows.append({
            "url": e.get("webpage_url") or e.get("url"),
            "title": (e.get("title") or "").strip(),
            "upload_date": e.get("upload_date"),
            "age_days": days,
            "views": e.get("view_count"),
            "likes": e.get("like_count"),
            "comments": e.get("comment_count"),
            "duration": e.get("duration"),
            "ratio": ratio,
            "is_outlier": ok,
            "reasons": reasons,
            "paid_markers": paid,
        })
    rows.sort(key=lambda r: (r["is_outlier"], r["ratio"] or 0, r["views"] or 0), reverse=True)
    return rows


def write_markdown(path, account, followers, rows, max_days, min_ratio):
    outliers = [r for r in rows if r["is_outlier"]]
    lines = [
        f"# Top reels: {account}",
        "",
        f"Followers: {followers:,}" if followers else "Followers: unknown (pass --followers N to get ratios)",
        f"Rule: views / followers >= {min_ratio}, posted in the last {max_days} days, no paid-partnership marker.",
        f"Checked {len(rows)} posts. Verified outliers: {len(outliers)}.",
        "",
        "| # | Ratio | Views | Age (days) | Outlier | Title | Link |",
        "|---|---|---|---|---|---|---|",
    ]
    for i, r in enumerate(rows, 1):
        title = r["title"].replace("|", "/")[:70]
        verdict = "yes" if r["is_outlier"] else "no: " + "; ".join(r["reasons"])
        lines.append(
            f"| {i} | {r['ratio'] if r['ratio'] is not None else '?'} | {r['views'] if r['views'] is not None else '?'} "
            f"| {r['age_days'] if r['age_days'] is not None else '?'} | {verdict} | {title} | {r['url']} |"
        )
    with open(path, "w") as f:
        f.write("\n".join(lines) + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("targets", nargs="*", help="One account URL, or several reel URLs (list mode)")
    parser.add_argument("--csv", help="List mode from a CSV with columns url,views (views optional; "
                                      "use for Instagram, where yt-dlp often cannot read views)")
    parser.add_argument("--followers", type=int, help="Follower count, if yt-dlp cannot read it (Instagram, TikTok)")
    parser.add_argument("--limit", type=int, default=30, help="Newest posts to check in account mode (default 30)")
    parser.add_argument("--max-days", type=int, default=90, help="Recency window in days (default 90)")
    parser.add_argument("--min-ratio", type=float, default=2.0, help="Minimum views / followers (default 2)")
    parser.add_argument("--out", default="./reel-analysis", help="Output folder (default ./reel-analysis)")
    parser.add_argument("--cookies-from-browser", metavar="BROWSER",
                        help="Use the user's own logged-in browser session (only with their OK)")
    args = parser.parse_args()

    views_override = {}
    if args.csv:
        with open(args.csv, newline="") as f:
            for row in csv.DictReader(f):
                url = (row.get("url") or "").strip()
                if url:
                    args.targets.append(url)
                    if (row.get("views") or "").strip():
                        views_override[url] = int(row["views"].replace(",", "").strip())
    if not args.targets:
        sys.exit("Give an account URL, reel URLs, or --csv.")

    if len(args.targets) == 1 and not args.csv and not any(s in args.targets[0] for s in ("/shorts/", "/reel/", "/p/", "/video/", "watch?v=")):
        account, entries = account_entries(args.targets[0], args.limit, args.cookies_from_browser)
        account_name = account.get("channel") or account.get("uploader") or account.get("title") or args.targets[0]
        followers = args.followers or followers_from(account) or next(
            (followers_from(e) for e in entries if followers_from(e)), None)
    else:
        entries = []
        for u in args.targets:
            e = fetch_metadata(u, args.cookies_from_browser)
            if u in views_override:
                e["view_count"] = views_override[u]
            entries.append(e)
        account_name = entries[0].get("uploader") or entries[0].get("channel") or "reel list"
        followers = args.followers or followers_from(entries[0])

    if not entries:
        sys.exit("No posts found. Check the account URL (for YouTube use the /shorts tab URL).")

    rows = rank(entries, followers, args.max_days, args.min_ratio)
    os.makedirs(args.out, exist_ok=True)
    write_markdown(os.path.join(args.out, "top_reels.md"), account_name, followers, rows, args.max_days, args.min_ratio)
    result = {"account": account_name, "followers": followers, "checked": len(rows), "reels": rows}
    with open(os.path.join(args.out, "top_reels.json"), "w") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    if not followers:
        print("\nFollower count unknown, so no ratios. Rerun with --followers N.", file=sys.stderr)
