#!/usr/bin/env python3
"""Job postings for one company from the Bundesagentur fuer Arbeit Jobsuche API (Germany).

Free. No account. The API wants the public client id in an X-API-Key header
("jobboerse-jobsuche"); that value is published by the Bundesagentur and is not a secret.

The employer filter only matches the exact employer name the Bundesagentur stores
("Ottobock SE & Co. KGaA", not "Ottobock"). So by default the script first runs a
free-text search for the company name and picks the employer names from the facet that
contain it. Pin the name with --employer when the match is wrong.

Emits candidate signals as JSONL:
  role_hiring    one per posting whose title matches a role keyword
  hiring_volume  one per company with posting counts for 7, 14, 28 days and all

Example:
  python3 jobsuche.py --company "Ottobock" --domain ottobock.com --days 28 --out -
"""

import argparse
import csv
import os
import sys
import urllib.parse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import DEFAULT_ROLE_KEYWORDS, http_json, match_roles, parse_date, signal, today, write_jsonl  # noqa: E402

BASE = "https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v6/jobs"
HEADERS = {"X-API-Key": "jobboerse-jobsuche"}
DETAIL_URL = "https://www.arbeitsagentur.de/jobsuche/jobdetail/{}"


def query(params):
    status, data = http_json(f"{BASE}?{urllib.parse.urlencode(params)}", HEADERS)
    if status != 200 or data is None:
        raise RuntimeError(f"Jobsuche API returned HTTP {status} for {params}")
    return data


def resolve_employers(company):
    data = query({"was": company, "size": 1, "page": 1})
    counts = (data.get("facetten", {}).get("arbeitgeber", {}) or {}).get("counts", {})
    # Names that start with the company name. "Dehner" keeps "Dehner Gartencenter GmbH"
    # and drops "Autohaus Dehner GmbH". Check the list in the log and pin with --employer.
    needle = company.lower()
    return sorted(name for name in counts if name.lower().startswith(needle))


def fetch_postings(employer, days, max_pages):
    postings, page = [], 1
    while page <= max_pages:
        data = query({"arbeitgeber": employer, "veroeffentlichtseit": days, "size": 100, "page": page})
        batch = data.get("ergebnisliste") or data.get("stellenangebote") or []
        postings.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return postings


def volume_counts(employer):
    data = query({"arbeitgeber": employer, "size": 1, "page": 1})
    counts = (data.get("facetten", {}).get("veroeffentlichtseit", {}) or {}).get("counts", {})
    return {"7d": counts.get("7", 0), "14d": counts.get("14", 0), "28d": counts.get("28", 0), "all": counts.get("alle", data.get("maxErgebnisse", 0))}


def previous_count(history_path, domain):
    if not history_path or not os.path.exists(history_path):
        return None
    last = None
    with open(history_path, encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            if row["domain"] == domain:
                last = row
    return last


def append_history(history_path, domain, counts):
    if not history_path:
        return
    new = not os.path.exists(history_path)
    with open(history_path, "a", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        if new:
            writer.writerow(["date", "domain", "7d", "14d", "28d", "all"])
        writer.writerow([today().isoformat(), domain, counts["7d"], counts["14d"], counts["28d"], counts["all"]])


def run(company, domain, employers=None, days=28, roles=None, history=None, max_pages=5):
    roles = roles or DEFAULT_ROLE_KEYWORDS
    employers = employers or resolve_employers(company)
    if not employers:
        return [], {"company": company, "employers": [], "note": "no employer name in the Jobsuche facet matched; pass --employer"}
    out, totals = [], {"7d": 0, "14d": 0, "28d": 0, "all": 0}
    for employer in employers:
        for c, v in volume_counts(employer).items():
            totals[c] += v
        for p in fetch_postings(employer, days, max_pages):
            title = p.get("stellenangebotsTitel") or p.get("titel") or p.get("beruf") or ""
            hits = match_roles(title, roles)
            if not hits:
                continue
            ref = p.get("referenznummer") or p.get("refnr") or ""
            loc = ((p.get("stellenlokationen") or [{}])[0].get("adresse") or {}).get("ort") or (p.get("arbeitsort") or {}).get("ort", "")
            date = parse_date(p.get("datumErsteVeroeffentlichung") or p.get("aktuelleVeroeffentlichungsdatum"))
            out.append(signal(company, domain, "role_hiring", date, DETAIL_URL.format(ref),
                              f"Posted {title}", {"employer": employer, "location": loc, "matched": hits,
                                                  "occupation": p.get("hauptberuf", "")}, "jobsuche"))
    prev = previous_count(history, domain)
    detail = {"employers": employers, "counts": totals}
    if prev and prev["date"] != today().isoformat():
        detail["previous"] = {"date": prev["date"], "28d": int(prev["28d"]), "all": int(prev["all"])}
    if not prev or prev["date"] != today().isoformat():
        append_history(history, domain, totals)
    search = f"https://www.arbeitsagentur.de/jobsuche/suche?was={urllib.parse.quote(company)}"
    out.append(signal(company, domain, "hiring_volume", today(), search,
                      f"{totals['28d']} new postings in 28 days ({totals['all']} open)", detail, "jobsuche"))
    return out, detail


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--company", required=True)
    ap.add_argument("--domain", required=True)
    ap.add_argument("--employer", action="append", help="exact Bundesagentur employer name; repeatable")
    ap.add_argument("--days", type=int, default=28, help="only postings published in the last N days (default 28)")
    ap.add_argument("--roles", help="comma-separated title keywords; default is a marketing/digital/IT list")
    ap.add_argument("--history", help="CSV that keeps posting counts across runs, for growth over time")
    ap.add_argument("--out", default="-", help="JSONL file to append to, or - for stdout")
    args = ap.parse_args()
    roles = [r.strip() for r in args.roles.split(",")] if args.roles else None
    try:
        records, detail = run(args.company, args.domain, args.employer, args.days, roles, args.history)
    except RuntimeError as err:
        sys.exit(f"jobsuche: {err}")
    write_jsonl(records, args.out)
    print(f"jobsuche: {args.company}: employers={detail.get('employers')} counts={detail.get('counts')} "
          f"role matches={sum(r['signal'] == 'role_hiring' for r in records)}", file=sys.stderr)


if __name__ == "__main__":
    main()
