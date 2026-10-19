#!/usr/bin/env python3
"""Optional paid or keyed providers. Each one runs only when its key is in the environment.

  PREDICTLEADS_API_KEY + PREDICTLEADS_API_TOKEN
      job openings and news events per domain (PredictLeads API v3).
  FIRECRAWL_API_KEY
      fetches a careers page as markdown into --raw-dir so the agent can read it,
      for companies that have no Jobsuche match and no supported job board.

Keys are read from the environment only. They are never printed or written to disk.
Apify (APIFY_TOKEN) is not wrapped here; SKILL.md shows the one API call to run a job-board actor.

Example:
  python3 optional_providers.py --company "Acme" --domain acme.de --careers-url https://acme.de/karriere --raw-dir raw --out -
"""

import argparse
import json
import os
import sys
import urllib.request

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import DEFAULT_ROLE_KEYWORDS, USER_AGENT, http_json, match_roles, parse_date, signal, slug, write_jsonl  # noqa: E402

PL_BASE = "https://predictleads.com/api/v3/companies/{}/{}"
# PredictLeads news categories mapped to this skill's signal types
PL_CATEGORIES = {
    "hires": "new_leadership", "promotes": "new_leadership", "leaves": "new_leadership", "retires_from": "new_leadership",
    "receives_financing": "funding_growth", "acquires": "funding_growth", "merges_with": "funding_growth", "goes_public": "funding_growth",
    "opens_new_location": "funding_growth", "expands_facilities": "funding_growth",
    "expands_offices_in": "funding_growth", "expands_offices_to": "funding_growth",
    "increases_headcount_by": "hiring_volume", "attends_event": "trade_fair",
    "launches": "relaunch", "integrates_with": "relaunch",
    "decreases_headcount_by": "risk", "closes_offices_in": "risk", "files_suit_against": "risk", "has_issues_with": "risk",
}


def available():
    return {
        "predictleads": bool(os.environ.get("PREDICTLEADS_API_KEY") and os.environ.get("PREDICTLEADS_API_TOKEN")),
        "firecrawl": bool(os.environ.get("FIRECRAWL_API_KEY")),
        "apify": bool(os.environ.get("APIFY_TOKEN")),
    }


def predictleads(company, domain, roles=None):
    roles = roles or DEFAULT_ROLE_KEYWORDS
    headers = {"X-Api-Key": os.environ["PREDICTLEADS_API_KEY"], "X-Api-Token": os.environ["PREDICTLEADS_API_TOKEN"]}
    out = []
    status, data = http_json(PL_BASE.format(domain, "job_openings"), headers)
    if status != 200 or data is None:
        raise RuntimeError(f"PredictLeads job_openings HTTP {status}")
    for item in data.get("data", []):
        a = item.get("attributes", {})
        title = a.get("title", "")
        if match_roles(title, roles):
            out.append(signal(company, domain, "role_hiring", parse_date(a.get("first_seen_at")), a.get("url", ""),
                              f"Posted {title}", {"location": a.get("location", "")}, "predictleads"))
    status, data = http_json(PL_BASE.format(domain, "news_events"), headers)
    if status != 200 or data is None:
        raise RuntimeError(f"PredictLeads news_events HTTP {status}")
    for item in data.get("data", []):
        a = item.get("attributes", {})
        kind = PL_CATEGORIES.get(a.get("category", ""))
        if kind:
            out.append(signal(company, domain, kind, parse_date(a.get("found_at") or a.get("effective_date")), a.get("url", ""),
                              a.get("summary", a.get("category", "")), {"category": a.get("category")}, "predictleads"))
    return out


def firecrawl_careers(url, raw_dir):
    body = json.dumps({"url": url, "formats": ["markdown"], "onlyMainContent": True}).encode()
    req = urllib.request.Request("https://api.firecrawl.dev/v2/scrape", data=body, method="POST", headers={
        "Authorization": f"Bearer {os.environ['FIRECRAWL_API_KEY']}", "Content-Type": "application/json", "User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode())
    markdown = (data.get("data") or {}).get("markdown", "")
    os.makedirs(raw_dir, exist_ok=True)
    path = os.path.join(raw_dir, f"careers-{slug(url)[:60]}.md")
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(markdown)
    return path


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--company", required=True)
    ap.add_argument("--domain", required=True)
    ap.add_argument("--careers-url", help="careers page to fetch with Firecrawl")
    ap.add_argument("--raw-dir", default="raw")
    ap.add_argument("--out", default="-")
    args = ap.parse_args()
    have = available()
    print(f"optional_providers: available={have}", file=sys.stderr)
    if have["predictleads"]:
        try:
            write_jsonl(predictleads(args.company, args.domain), args.out)
        except RuntimeError as err:
            print(f"optional_providers: {err}", file=sys.stderr)
    if have["firecrawl"] and args.careers_url:
        try:
            print(f"optional_providers: careers page saved to {firecrawl_careers(args.careers_url, args.raw_dir)}", file=sys.stderr)
        except Exception as err:  # noqa: BLE001
            print(f"optional_providers: firecrawl failed: {err}", file=sys.stderr)


if __name__ == "__main__":
    main()
