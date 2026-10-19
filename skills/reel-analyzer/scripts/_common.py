"""Shared helpers: find yt-dlp, run it, read metadata, outlier math."""

import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone

UVX_YTDLP = ["uvx", "--from", "yt-dlp[default]@latest", "yt-dlp"]

# Caption markers that mean the post is paid. Matches #ad, #ads, #sponsored,
# any hashtag ending in "partner" (#partner, #brandpartner, #SpaceXAIPartner),
# "paid partnership", "sponsored by", and the German #werbung / #anzeige.
PAID_PATTERN = re.compile(
    r"(#ad\b|#ads\b|#sponsored\b|#sponsor\b|#\w*partner\b|#\w*partnership\b|"
    r"#werbung\b|#anzeige\b|paid partnership|sponsored by|in partnership with)",
    re.IGNORECASE,
)


def ytdlp_commands():
    """Commands to try, newest first: uvx latest, then a system yt-dlp."""
    cmds = []
    if shutil.which("uvx"):
        cmds.append(UVX_YTDLP)
    if shutil.which("yt-dlp"):
        cmds.append(["yt-dlp"])
    if not cmds:
        sys.exit(
            "No yt-dlp found. Install uv (https://docs.astral.sh/uv/) so `uvx` can fetch the "
            "latest yt-dlp, or install yt-dlp directly (`brew install yt-dlp` or `pipx install yt-dlp`)."
        )
    return cmds


def run_ytdlp(args, cookies_from_browser=None):
    """Run yt-dlp with each available command until one succeeds."""
    extra = ["--no-warnings"]
    if cookies_from_browser:
        extra += ["--cookies-from-browser", cookies_from_browser]
    last = None
    for cmd in ytdlp_commands():
        last = subprocess.run(cmd + extra + args, capture_output=True, text=True)
        if last.returncode == 0:
            return last
    explain_failure(last.stderr)
    sys.exit(1)


def explain_failure(stderr):
    print(stderr.strip(), file=sys.stderr)
    s = stderr.lower()
    if "login" in s or "cookies" in s or "empty media response" in s or "rate-limit" in s:
        print(
            "\nThe platform wants a logged-in session for this link. Options:\n"
            "  1. Try a YouTube Short or TikTok link instead (they usually work without login).\n"
            "  2. If the user agrees, rerun with --cookies-from-browser chrome (or firefox, safari).\n"
            "     That reads the user's own logged-in browser session. On macOS it may ask for\n"
            "     the keychain password, and Chrome may need to be closed first.",
            file=sys.stderr,
        )
    elif "private" in s or "unavailable" in s:
        print("\nThe video is private, removed or region locked. Use a different public link.", file=sys.stderr)


def fetch_metadata(url, cookies_from_browser=None):
    result = run_ytdlp(["--skip-download", "-J", url], cookies_from_browser)
    return json.loads(result.stdout)


def paid_markers(caption):
    """Return the paid-partnership markers found in a caption (empty list if none)."""
    return sorted({m.group(0) for m in PAID_PATTERN.finditer(caption or "")}, key=str.lower)


def age_days(upload_date, timestamp=None):
    """Days since posting, from yt-dlp's timestamp or YYYYMMDD upload_date."""
    if timestamp:
        posted = datetime.fromtimestamp(timestamp, tz=timezone.utc)
    elif upload_date:
        posted = datetime.strptime(upload_date, "%Y%m%d").replace(tzinfo=timezone.utc)
    else:
        return None
    return (datetime.now(timezone.utc) - posted).days


def followers_from(meta):
    for key in ("channel_follower_count", "uploader_follower_count", "follower_count"):
        if meta.get(key):
            return int(meta[key])
    return None


def outlier_verdict(views, followers, days, paid, ratio_min=2.0, max_days=90):
    """Apply the Ekos outlier rule. Returns (ratio, is_outlier, reasons_not)."""
    ratio = None
    if views is not None and followers:
        raw = views / followers
        ratio = round(raw, 2) if raw >= 0.1 else round(raw, 4)
    reasons = []
    if ratio is None:
        reasons.append("ratio unknown (views or followers missing)")
    elif ratio < ratio_min:
        reasons.append(f"ratio {ratio} below {ratio_min}")
    if days is None:
        reasons.append("post date unknown")
    elif days > max_days:
        reasons.append(f"posted {days} days ago, older than {max_days}")
    if paid:
        reasons.append("paid partnership: " + ", ".join(paid))
    return ratio, not reasons, reasons


def fmt_time(seconds):
    seconds = max(0.0, float(seconds))
    return f"{int(seconds // 60)}:{seconds % 60:04.1f}"
