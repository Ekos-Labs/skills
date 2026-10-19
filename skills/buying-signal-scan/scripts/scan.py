#!/usr/bin/env python3
"""Run every collector for a list of companies and write candidate signals for review.

Input CSV columns (header row required):
  company     required, the name people use ("Ottobock")
  domain      required ("ottobock.com")
  country     optional, default DE. DE runs the Jobsuche API; other countries skip it
  employer    optional, exact Bundesagentur employer name(s), separated by ';'
  news_query  optional, overrides the Google News search for this company
  careers_url optional, used by Firecrawl when FIRECRAWL_API_KEY is set

Writes into --out-dir:
  candidates.jsonl   every candidate signal from this run (replaced each run)
  review.json        one entry per candidate for the agent to fill in (keep, strength, label)
  state/tech.json    site fingerprints, so the next run can spot a relaunch
  state/hiring.csv   posting counts per run, so the next run can spot growth
  raw/               Firecrawl careers pages, when used
  scan-log.txt       what ran, what failed, per company

With no keys at all this runs: Jobsuche (Germany), Google News RSS, tech check, and the
public job board feeds the tech check finds (Personio, Greenhouse, Lever, Ashby).

Example:
  python3 scan.py --companies companies.csv --out-dir signals-run --roles "marketing,digital,e-commerce,crm"
"""

import argparse
import csv
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import career_jobs  # noqa: E402
import jobsuche  # noqa: E402
import news_rss  # noqa: E402
import optional_providers  # noqa: E402
import tech_check  # noqa: E402
from _common import clean_domain, write_jsonl  # noqa: E402

LOCALES = {"DE": ("de", "DE"), "AT": ("de", "AT"), "CH": ("de", "CH"), "US": ("en", "US"),
           "GB": ("en", "GB"), "UK": ("en", "GB"), "IE": ("en", "IE"), "NL": ("nl", "NL"), "FR": ("fr", "FR")}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--companies", required=True)
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--roles", help="comma-separated title keywords for the roles that buy or use what you sell")
    ap.add_argument("--job-days", type=int, default=28)
    ap.add_argument("--news-days", type=int, default=90)
    ap.add_argument("--pause", type=float, default=1.0, help="seconds between companies, to stay polite")
    args = ap.parse_args()

    roles = [r.strip() for r in args.roles.split(",")] if args.roles else None
    os.makedirs(os.path.join(args.out_dir, "state"), exist_ok=True)
    cand_path = os.path.join(args.out_dir, "candidates.jsonl")
    open(cand_path, "w").close()
    log = open(os.path.join(args.out_dir, "scan-log.txt"), "w", encoding="utf-8")
    providers = optional_providers.available()

    def note(msg):
        print(msg, file=sys.stderr)
        log.write(msg + "\n")

    note(f"optional providers: {providers}")
    with open(args.companies, encoding="utf-8-sig") as fh:
        rows = [r for r in csv.DictReader(fh) if (r.get("company") or "").strip() and (r.get("domain") or "").strip()]
    seen = set()
    for row in rows:
        company, domain = row["company"].strip(), clean_domain(row["domain"])
        if domain in seen:
            continue
        seen.add(domain)
        country = (row.get("country") or "DE").strip().upper()
        lang, gl = LOCALES.get(country, ("en", country))
        records = []

        tech = {}
        try:
            recs, tech = tech_check.run(company, domain, os.path.join(args.out_dir, "state", "tech.json"))
            records += recs
            note(f"{domain}: tech ok platforms={list(tech['platforms'])} outdated={len(tech['outdated'])} boards={tech['job_boards']}")
        except Exception as err:  # noqa: BLE001 - one failing site must not stop the run
            note(f"{domain}: tech FAILED {err}")

        if country == "DE":
            employers = [e.strip() for e in (row.get("employer") or "").split(";") if e.strip()] or None
            try:
                recs, detail = jobsuche.run(company, domain, employers, args.job_days, roles,
                                            os.path.join(args.out_dir, "state", "hiring.csv"))
                records += recs
                note(f"{domain}: jobsuche employers={detail.get('employers')} counts={detail.get('counts')} "
                     f"role matches={sum(r['signal'] == 'role_hiring' for r in recs)}")
            except Exception as err:  # noqa: BLE001
                note(f"{domain}: jobsuche FAILED {err}")

        for board, name in (tech.get("job_boards") or {}).items():
            try:
                recs, total, recent = career_jobs.run(company, domain, board, name, args.job_days, roles)
                records += recs
                note(f"{domain}: {board}/{name} {total} open, {recent} recent, {len(recs) - 1} role matches")
            except Exception as err:  # noqa: BLE001
                note(f"{domain}: {board}/{name} FAILED {err}")

        try:
            recs, total = news_rss.run(company, domain, lang, gl, args.news_days, (row.get("news_query") or "").strip() or None)
            records += recs
            note(f"{domain}: news {total} headlines, {len(recs)} tagged")
        except Exception as err:  # noqa: BLE001
            note(f"{domain}: news FAILED {err}")

        if providers["predictleads"]:
            try:
                recs = optional_providers.predictleads(company, domain, roles)
                records += recs
                note(f"{domain}: predictleads {len(recs)} candidates")
            except Exception as err:  # noqa: BLE001
                note(f"{domain}: predictleads FAILED {err}")
        if providers["firecrawl"] and (row.get("careers_url") or "").strip():
            try:
                path = optional_providers.firecrawl_careers(row["careers_url"].strip(), os.path.join(args.out_dir, "raw"))
                note(f"{domain}: careers page saved to {path}; read it and add role_hiring entries by hand")
            except Exception as err:  # noqa: BLE001
                note(f"{domain}: firecrawl FAILED {err}")

        write_jsonl(records, cand_path)
        time.sleep(args.pause)

    candidates = [json.loads(line) for line in open(cand_path, encoding="utf-8") if line.strip()]
    review_path = os.path.join(args.out_dir, "review.json")
    old = {}
    if os.path.exists(review_path):
        with open(review_path, encoding="utf-8") as fh:
            old = json.load(fh)
    review = {c["id"]: old.get(c["id"], {"keep": None, "strength": "normal", "label": "", "note": "",
                                          "_what": f"{c['domain']} | {c['signal']} | {c['date']} | {c['summary'][:110]}"})
              for c in candidates}
    with open(review_path, "w", encoding="utf-8") as fh:
        json.dump(review, fh, indent=1, ensure_ascii=False)
    note(f"done: {len(seen)} companies, {len(candidates)} candidates. Review {review_path}, then run score.py")
    log.close()


if __name__ == "__main__":
    main()
