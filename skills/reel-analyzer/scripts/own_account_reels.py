#!/usr/bin/env python3
"""Rank the user's OWN Instagram business account reels by outlier ratio, from the Meta Graph API.

Optional. Needs META_ACCESS_TOKEN in the environment (instagram_basic, instagram_manage_insights,
pages_show_list). IG_BUSINESS_ACCOUNT_ID is optional: without it the script finds the account
through the token's Facebook Pages and prints the ID (it never writes it anywhere).

    python3 own_account_reels.py [--months 3] [--out ./reel-analysis]
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta, timezone
from urllib.error import HTTPError
from urllib.parse import parse_qsl, urlencode, urlparse
from urllib.request import urlopen

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _common import outlier_verdict, paid_markers  # noqa: E402

GRAPH = "https://graph.facebook.com/v21.0"
METRICS = {
    "VIDEO": "reach,saved,likes,comments,shares,total_interactions,views",
    "REELS": "reach,saved,likes,comments,shares,total_interactions,views,ig_reels_avg_watch_time",
}


def get(path, params):
    try:
        with urlopen(f"{GRAPH}/{path}?{urlencode(params)}", timeout=60) as r:
            return json.loads(r.read())
    except HTTPError as e:
        return {"error": json.loads(e.read() or b"{}").get("error", {"message": f"HTTP {e.code}"})}


def discover_account(token):
    pages = get("me/accounts", {"fields": "id,name,instagram_business_account", "access_token": token})
    if "error" in pages:
        sys.exit(f"Meta error: {pages['error'].get('message')}")
    for page in pages.get("data", []):
        if page.get("instagram_business_account"):
            ig_id = page["instagram_business_account"]["id"]
            print(f"Found IG business account {ig_id} on Page '{page['name']}'. "
                  f"Set IG_BUSINESS_ACCOUNT_ID={ig_id} to skip this lookup.", file=sys.stderr)
            return ig_id
    sys.exit("No Instagram business account is linked to a Facebook Page this token can see "
             "(check pages_show_list and the Page to IG link).")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--months", type=int, default=3, help="How far back to read (default 3)")
    parser.add_argument("--min-ratio", type=float, default=2.0)
    parser.add_argument("--out", default="./reel-analysis")
    args = parser.parse_args()

    token = os.environ.get("META_ACCESS_TOKEN")
    if not token:
        sys.exit("META_ACCESS_TOKEN is not set. This mode is optional: for public accounts use top_reels.py.")
    ig_id = os.environ.get("IG_BUSINESS_ACCOUNT_ID") or discover_account(token)

    account = get(ig_id, {"fields": "username,followers_count", "access_token": token})
    if "error" in account:
        sys.exit(f"Meta error: {account['error'].get('message')}")
    followers = account.get("followers_count")
    cutoff = datetime.now(timezone.utc) - timedelta(days=30 * args.months)

    media, path = [], f"{ig_id}/media"
    params = {"fields": "id,caption,media_type,media_product_type,timestamp,permalink", "limit": 50,
              "access_token": token}
    while True:
        resp = get(path, params)
        if "error" in resp:
            sys.exit(f"Meta error: {resp['error'].get('message')}")
        batch = resp.get("data", [])
        media.extend(batch)
        nxt = resp.get("paging", {}).get("next")
        if not batch or not nxt or datetime.fromisoformat(batch[-1]["timestamp"]) < cutoff:
            break
        parsed = urlparse(nxt)
        params, path = dict(parse_qsl(parsed.query)), parsed.path.split("/")[-1]

    rows = []
    for m in media:
        posted = datetime.fromisoformat(m["timestamp"])
        if posted < cutoff or m.get("media_type") != "VIDEO":
            continue
        kind = "REELS" if m.get("media_product_type") == "REELS" else "VIDEO"
        ins = get(f"{m['id']}/insights", {"metric": METRICS[kind], "access_token": token})
        values = {x["name"]: x["values"][0]["value"] for x in ins.get("data", [])}
        days = (datetime.now(timezone.utc) - posted).days
        paid = paid_markers(m.get("caption"))
        ratio, ok, reasons = outlier_verdict(values.get("views"), followers, days, paid, args.min_ratio,
                                             30 * args.months)
        rows.append({"url": m["permalink"], "posted": m["timestamp"][:10], "age_days": days,
                     "ratio": ratio, "is_outlier": ok, "reasons": reasons,
                     "caption": (m.get("caption") or "")[:120], **values})
    rows.sort(key=lambda r: (r["is_outlier"], r["ratio"] or 0), reverse=True)

    os.makedirs(args.out, exist_ok=True)
    result = {"account": account.get("username"), "followers": followers, "checked": len(rows), "reels": rows}
    with open(os.path.join(args.out, "own_account_reels.json"), "w") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    print(json.dumps(result, indent=2, ensure_ascii=False))
