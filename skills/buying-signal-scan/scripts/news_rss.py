#!/usr/bin/env python3
"""Recent news for one company from the Google News RSS search feed. Free. No key.

Each headline is tagged with a likely signal type from keyword lists (German and English):
  new_leadership   new CMO, Head of Digital, Managing Director, board change
  funding_growth   funding round, acquisition, new location or plant
  relaunch         new website, new online shop, platform switch
  risk             insolvency, layoffs, short-time work (not a buying signal; shown as a warning)
Headlines that match none are dropped unless --all is set.

The keyword tag is a first pass only. The agent reads every headline and decides.
Google states the feed is for personal, non-commercial use in a feed reader; keep volume low,
use it for your own research and do not republish the results.

Example:
  python3 news_rss.py --company "Ottobock" --domain ottobock.com --lang de --country DE --out -
"""

import argparse
import os
import re
import sys
import urllib.parse
import xml.etree.ElementTree as ET

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import http_get, parse_date, signal, write_jsonl  # noqa: E402

RSS = "https://news.google.com/rss/search?{}"

PATTERNS = {
    "risk": r"insolven|stellenabbau|entlass|kurzarbeit|layoff|lays off|job cuts|restructur|restrukturier|sanierung|schlie(ss|ß)t",
    # leadership needs a role word and a change word in the same headline, or a clear appointment phrase
    "leader_role": r"\bCMO\b|\bCDO\b|\bCIO\b|\bCTO\b|\bCEO\b|\bCOO\b|chief (marketing|digital|information|technology|executive|operating)"
                   r"|head of (digital|marketing|e-?commerce|it|sales)|gesch(ä|ae)ftsf(ü|ue)hr|vorstand|managing director|marketingleit"
                   r"|leiter(in)? (marketing|digital|e-?commerce|it|vertrieb)|chef(in)?\b",
    "leader_change": r"\bneue[rn]?\b|\bnew\b|appoint|ernannt|ernennt|beruf(t|en)|bestell(t|ung)|wechsel|nachfolge|successor|tritt .* an"
                     r"|joins|steps down|tritt zur(ü|ue)ck|verl(ä|ae)sst das unternehmen|(ü|ue)bernimmt (die|den) (leitung|posten|vorsitz)",
    "funding_growth": r"finanzierung|series [a-e]\b|\bseed\b|raises|funding|\binvestor|investition|investiert|(ü|ue)bernahme|(ü|ue)bernimmt|acquir|akquis|kauft|merger|fusion"
                      r"|neue[rn]? standort|er(ö|oe)ffnet|er(ö|oe)ffnung|neues werk|expan|new office|niederlassung|ipo|b(ö|oe)rsengang",
    "relaunch": r"relaunch|neue[rn]? (website|webseite|onlineshop|online-shop|webshop|plattform|app)|new (website|online store|e-?commerce|platform)"
                r"|launches (online|e-?commerce)|shopify|shopware|salesforce commerce|d2c|direct-to-consumer",
}


def classify(title):
    if re.search(PATTERNS["risk"], title, re.IGNORECASE):
        return "risk"
    if re.search(PATTERNS["leader_role"], title, re.IGNORECASE) and re.search(PATTERNS["leader_change"], title, re.IGNORECASE):
        return "new_leadership"
    for kind in ("funding_growth", "relaunch"):
        if re.search(PATTERNS[kind], title, re.IGNORECASE):
            return kind
    return None


def run(company, domain, lang="de", country="DE", days=90, query=None, include_all=False):
    q = query or f'"{company}" when:{days}d'
    params = {"q": q, "hl": lang, "gl": country, "ceid": f"{country}:{lang}"}
    status, _, _, text = http_get(RSS.format(urllib.parse.urlencode(params)))
    if status != 200:
        raise RuntimeError(f"Google News RSS returned HTTP {status}")
    root = ET.fromstring(text)
    out, seen = [], set()
    for item in root.iter("item"):
        title = (item.findtext("title") or "").strip()
        if title in seen:
            continue
        seen.add(title)
        kind = classify(title) or ("news_other" if include_all else None)
        if not kind:
            continue
        src = item.find("source")
        out.append(signal(company, domain, kind, parse_date(item.findtext("pubDate")), item.findtext("link") or "",
                          title, {"publisher": src.text if src is not None else "",
                                  "publisher_url": src.get("url") if src is not None else "", "query": q}, "google_news"))
    return out, len(seen)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--company", required=True)
    ap.add_argument("--domain", required=True)
    ap.add_argument("--lang", default="de")
    ap.add_argument("--country", default="DE")
    ap.add_argument("--days", type=int, default=90)
    ap.add_argument("--query", help="override the search, e.g. '\"Ottobock\" CMO when:180d'")
    ap.add_argument("--all", action="store_true", help="also keep headlines that match no signal type")
    ap.add_argument("--out", default="-")
    args = ap.parse_args()
    try:
        records, total = run(args.company, args.domain, args.lang, args.country, args.days, args.query, args.all)
    except (RuntimeError, Exception) as err:  # noqa: BLE001 - report and exit cleanly
        sys.exit(f"news_rss: {err}")
    write_jsonl(records, args.out)
    print(f"news_rss: {args.company}: {total} headlines, {len(records)} tagged", file=sys.stderr)


if __name__ == "__main__":
    main()
