#!/usr/bin/env python3
"""Job postings from a company's own public job board feed. Free. No key. Works in any country.

Supported boards (tech_check.py finds the board name on the homepage when it is linked):
  personio    https://{name}.jobs.personio.de/xml
  greenhouse  https://boards-api.greenhouse.io/v1/boards/{name}/jobs
  lever       https://api.lever.co/v0/postings/{name}?mode=json
  ashby       https://api.ashbyhq.com/posting-api/job-board/{name}

Emits role_hiring candidates for titles that match the role keywords, and one
hiring_volume candidate with the number of postings first published in the last 28 days.

Example:
  python3 career_jobs.py --company "Personio" --domain personio.com --board personio --name personio --out -
"""

import argparse
import datetime as dt
import os
import sys
import xml.etree.ElementTree as ET

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import DEFAULT_ROLE_KEYWORDS, http_get, http_json, match_roles, parse_date, signal, today, write_jsonl  # noqa: E402


def personio(name):
    feed = f"https://{name}.jobs.personio.de/xml"
    status, _, _, text = http_get(feed)
    if status != 200:
        raise RuntimeError(f"Personio feed HTTP {status}")
    jobs = []
    for pos in ET.fromstring(text).iter("position"):
        jid = pos.findtext("id")
        jobs.append({"title": pos.findtext("name") or "", "date": parse_date(pos.findtext("createdAt")),
                     "url": f"https://{name}.jobs.personio.de/job/{jid}", "location": pos.findtext("office") or ""})
    return jobs


def greenhouse(name):
    status, data = http_json(f"https://boards-api.greenhouse.io/v1/boards/{name}/jobs")
    if status != 200 or data is None:
        raise RuntimeError(f"Greenhouse HTTP {status}")
    return [{"title": j.get("title", ""), "date": parse_date(j.get("first_published") or j.get("updated_at")),
             "url": j.get("absolute_url", ""), "location": (j.get("location") or {}).get("name", "")} for j in data.get("jobs", [])]


def lever(name):
    status, data = http_json(f"https://api.lever.co/v0/postings/{name}?mode=json")
    if status != 200 or data is None:
        raise RuntimeError(f"Lever HTTP {status}")
    return [{"title": j.get("text", ""), "date": parse_date(j.get("createdAt")), "url": j.get("hostedUrl", ""),
             "location": (j.get("categories") or {}).get("location", "")} for j in data]


def ashby(name):
    status, data = http_json(f"https://api.ashbyhq.com/posting-api/job-board/{name}")
    if status != 200 or data is None:
        raise RuntimeError(f"Ashby HTTP {status}")
    return [{"title": j.get("title", ""), "date": parse_date(j.get("publishedAt")), "url": j.get("jobUrl", ""),
             "location": j.get("location", "")} for j in data.get("jobs", [])]


BOARDS = {"personio": personio, "greenhouse": greenhouse, "lever": lever, "ashby": ashby}


def run(company, domain, board, name, days=28, roles=None):
    roles = roles or DEFAULT_ROLE_KEYWORDS
    jobs = BOARDS[board](name)
    cutoff = today() - dt.timedelta(days=days)
    out, recent = [], 0
    for j in jobs:
        if j["date"] and j["date"] >= cutoff:
            recent += 1
            hits = match_roles(j["title"], roles)
            if hits:
                out.append(signal(company, domain, "role_hiring", j["date"], j["url"], f"Posted {j['title']}",
                                  {"board": board, "location": j["location"], "matched": hits}, f"career_jobs:{board}"))
    out.append(signal(company, domain, "hiring_volume", today(), out[0]["source_url"] if out else "",
                      f"{recent} new postings in {days} days on own job board ({len(jobs)} open)",
                      {"board": board, "counts": {f"{days}d": recent, "all": len(jobs)}}, f"career_jobs:{board}"))
    return out, len(jobs), recent


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--company", required=True)
    ap.add_argument("--domain", required=True)
    ap.add_argument("--board", required=True, choices=sorted(BOARDS))
    ap.add_argument("--name", required=True, help="the company's board name, e.g. 'personio' in personio.jobs.personio.de")
    ap.add_argument("--days", type=int, default=28)
    ap.add_argument("--roles")
    ap.add_argument("--out", default="-")
    args = ap.parse_args()
    roles = [r.strip() for r in args.roles.split(",")] if args.roles else None
    try:
        records, total, recent = run(args.company, args.domain, args.board, args.name, args.days, roles)
    except (RuntimeError, ET.ParseError) as err:
        sys.exit(f"career_jobs: {err}")
    write_jsonl(records, args.out)
    print(f"career_jobs: {args.company} ({args.board}/{args.name}): {total} open, {recent} in {args.days} days, "
          f"{len(records) - 1} role matches", file=sys.stderr)


if __name__ == "__main__":
    main()
