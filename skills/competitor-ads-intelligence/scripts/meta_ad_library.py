#!/usr/bin/env python3
"""Read a bounded EU/UK commercial-ad sample from Meta's official Ad Library API."""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

EU_UK = frozenset(
    "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE GB".split()
)
FIELDS = ",".join(
    [
        "id",
        "page_id",
        "page_name",
        "ad_creative_bodies",
        "ad_creative_link_titles",
        "ad_creative_link_descriptions",
        "ad_creative_link_captions",
        "ad_delivery_start_time",
        "ad_delivery_stop_time",
        "publisher_platforms",
    ]
)


def parse_args(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--country", required=True, help="EU member ISO-2 code or GB")
    parser.add_argument("--version", required=True, help="Current Meta Graph API version, e.g. vXX.X")
    selector = parser.add_mutually_exclusive_group(required=True)
    selector.add_argument("--page-id", help="Verified numeric Facebook Page ID")
    selector.add_argument("--query", help="Search text, 100 characters or fewer")
    parser.add_argument("--limit", type=int, default=25, help="Ads per page, 1–25")
    parser.add_argument("--pages", type=int, default=1, help="Maximum pages to request, 1–3")
    args = parser.parse_args(argv)
    args.country = args.country.upper()
    if args.country not in EU_UK:
        parser.error("ordinary commercial-ad API research is limited to EU/UK delivery; use the public Ad Library elsewhere")
    if not re.fullmatch(r"v[0-9]+\.[0-9]+", args.version):
        parser.error("--version must be a Meta Graph version such as vXX.X")
    if args.page_id and not re.fullmatch(r"[0-9]+", args.page_id):
        parser.error("--page-id must be numeric")
    if args.query is not None and (not args.query.strip() or len(args.query) > 100):
        parser.error("--query must contain 1–100 characters")
    if not 1 <= args.limit <= 25 or not 1 <= args.pages <= 3:
        parser.error("--limit must be 1–25 and --pages must be 1–3")
    return args


def fetch_ads(args, token, opener=urlopen):
    """Return selected ad fields only; never return a token-bearing Meta URL."""
    base = f"https://graph.facebook.com/{args.version}/ads_archive"
    params = {
        "access_token": token,
        "fields": FIELDS,
        "ad_type": "ALL",
        "ad_active_status": "ACTIVE",
        "ad_reached_countries": json.dumps([args.country]),
        "limit": args.limit,
    }
    if args.page_id:
        params["search_page_ids"] = json.dumps([args.page_id])
    else:
        params["search_terms"] = args.query

    ads = []
    cursor = None
    pages_read = 0
    for _ in range(args.pages):
        request_params = {**params, **({"after": cursor} if cursor else {})}
        request = Request(f"{base}?{urlencode(request_params)}", headers={"User-Agent": "EkosSkills-AdResearch/0.1"})
        try:
            with opener(request, timeout=15) as response:
                payload = json.loads(response.read(2_000_001))
        except HTTPError as exc:
            raise RuntimeError(f"Meta API returned HTTP {exc.code}; verify token, permissions, country, and API version") from None
        except URLError:
            raise RuntimeError("Meta API could not be reached; check network access") from None
        except (ValueError, UnicodeDecodeError):
            raise RuntimeError("Meta API returned invalid or oversized JSON") from None
        if not isinstance(payload, dict) or not isinstance(payload.get("data"), list):
            raise RuntimeError("Meta API response did not contain an ad data list")
        pages_read += 1
        for row in payload["data"]:
            if not isinstance(row, dict):
                continue
            ads.append({field: row.get(field) for field in FIELDS.split(",") if field in row})
        # Use only the cursor. Meta's paging.next and ad_snapshot_url can carry
        # the access token, so neither is copied into the output.
        paging = payload.get("paging") or {}
        cursors = paging.get("cursors") or {}
        next_cursor = cursors.get("after")
        if not next_cursor or not paging.get("next"):
            cursor = None
            break
        cursor = next_cursor
    return {
        "source": "Meta Ad Library API",
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "scope": "Active ordinary ads delivered in the selected EU/UK country; API archive covers approximately the past year",
        "country": args.country,
        "selector": {"page_id": args.page_id} if args.page_id else {"query": args.query},
        "pages_read": pages_read,
        "sample_size": len(ads),
        "more_results_possible": cursor is not None,
        "ads": ads,
        "limitations": [
            "Active status and duration do not prove conversions or profitability.",
            "Commercial-ad spend, ROAS, and impression ranges are not provided by this query.",
            "Visual creative must be checked separately in an authorized Meta Ad Library session.",
        ],
    }


def main(argv=None):
    args = parse_args(argv)
    token = os.environ.get("META_AD_LIBRARY_ACCESS_TOKEN", "")
    if not token:
        print("META_AD_LIBRARY_ACCESS_TOKEN is not configured in your environment.", file=sys.stderr)
        return 2
    try:
        result = fetch_ads(args, token)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
