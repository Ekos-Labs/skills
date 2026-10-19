#!/usr/bin/env python3
"""Score reviewed signals with time decay and write buying-signals.csv plus summary.md.

Only candidates marked "keep": true in review.json count. Unreviewed ("keep": null) and
dropped ones are left out and counted in the summary, so nothing scores without a decision.

Points for one signal = weight x strength x 0.5 ** (age_days / half_life_days).
Signals older than max_age_days score 0. Types with "decay": false score full weight.
Within one type the strongest signal counts in full and each further one counts
repeat_factor of its points, capped at type_cap_multiple x weight.

Example:
  python3 score.py --run-dir signals-run --companies companies.csv --openers signals-run/openers.json
"""

import argparse
import collections
import csv
import datetime as dt
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import clean_domain, parse_date, read_jsonl  # noqa: E402

COLUMNS = ["company", "domain", "score", "top signal", "signal date", "source URL", "other signals", "reason", "suggested opener"]


def short_date(d):
    return f"{d.day} {d.strftime('%b')}" if d else "undated"


def points(sig, cfg, weights, as_of):
    t = cfg.get(sig["signal"], {"weight": 0, "half_life_days": 21, "max_age_days": 90})
    mult = weights["strength"].get(sig.get("strength", "normal"), 1.0)
    if t.get("decay") is False:
        return t["weight"] * mult, 0
    d = parse_date(sig["date"])
    if d is None:
        return 0.0, None
    age = max((as_of - d).days, 0)
    if age > t.get("max_age_days", 90):
        return 0.0, age
    return t["weight"] * mult * 0.5 ** (age / t.get("half_life_days", 21)), age


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--run-dir", required=True, help="folder with candidates.jsonl and review.json")
    ap.add_argument("--companies", help="input CSV, so companies with no signal still get a row")
    ap.add_argument("--weights", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "weights.json"))
    ap.add_argument("--openers", help="JSON {domain: opener}; written by the agent after the first scoring pass")
    ap.add_argument("--as-of", help="score as of this date (YYYY-MM-DD); default today")
    ap.add_argument("--out", help="CSV path; default <run-dir>/buying-signals.csv. summary.md is written next to it")
    args = ap.parse_args()

    as_of = dt.date.fromisoformat(args.as_of) if args.as_of else dt.date.today()
    with open(args.weights, encoding="utf-8") as fh:
        weights = json.load(fh)
    cfg = {k: v for k, v in weights.items() if isinstance(v, dict) and "weight" in v}
    candidates = read_jsonl(os.path.join(args.run_dir, "candidates.jsonl"))
    with open(os.path.join(args.run_dir, "review.json"), encoding="utf-8") as fh:
        review = json.load(fh)
    openers = {}
    if args.openers and os.path.exists(args.openers):
        with open(args.openers, encoding="utf-8") as fh:
            openers = {clean_domain(k): v for k, v in json.load(fh).items()}

    names, order = {}, []
    if args.companies:
        with open(args.companies, encoding="utf-8-sig") as fh:
            for r in csv.DictReader(fh):
                if (r.get("domain") or "").strip():
                    d = clean_domain(r["domain"])
                    if d not in names:
                        names[d] = r["company"].strip()
                        order.append(d)

    stats = collections.Counter()
    kept = collections.defaultdict(list)
    for c in candidates:
        names.setdefault(c["domain"], c["company"])
        if c["domain"] not in order:
            order.append(c["domain"])
        r = review.get(c["id"], {})
        if r.get("keep") is None:
            stats["unreviewed"] += 1
            continue
        if not r["keep"]:
            stats["dropped"] += 1
            continue
        sig = {**c, "strength": r.get("strength") or "normal", "label": (r.get("label") or "").strip() or c["summary"]}
        sig["points"], sig["age"] = points(sig, cfg, weights, as_of)
        if sig["points"] == 0 and sig["signal"] not in ("risk", "news_other"):
            stats["too old or undated"] += 1
        kept[c["domain"]].append(sig)

    rows, type_counts, warnings = [], collections.Counter(), []
    for domain in order:
        sigs = sorted(kept.get(domain, []), key=lambda s: s["points"], reverse=True)
        total, by_type = 0.0, collections.defaultdict(float)
        for s in sigs:
            t = cfg.get(s["signal"], {"weight": 0})
            cap = t["weight"] * weights.get("type_cap_multiple", 2.0)
            add = s["points"] if by_type[s["signal"]] == 0 else s["points"] * weights.get("repeat_factor", 0.5)
            add = min(add, max(cap - by_type[s["signal"]], 0))
            by_type[s["signal"]] += add
            total += add
        live = [s for s in sigs if s["points"] > 0]
        for s in {s["signal"] for s in live}:
            type_counts[s] += 1
        for s in sigs:
            if s["signal"] == "risk":
                warnings.append(f"{names[domain]}: {s['label']} ({short_date(parse_date(s['date']))})")
        top = live[0] if live else None
        others = [f"{cfg.get(s['signal'], {}).get('label', s['signal'])}: {s['label']} ({short_date(parse_date(s['date']))}, {s['points']:.1f} pts)"
                  for s in live[1:]]
        others += [f"Warning: {s['label']} ({short_date(parse_date(s['date']))})" for s in sigs if s["signal"] == "risk"]
        reason = "; ".join(f"{s['label']} ({short_date(parse_date(s['date']))})" for s in live[:3]) if live else "No current signal"
        rows.append({
            "company": names[domain], "domain": domain, "score": round(total, 1),
            "top signal": f"{cfg.get(top['signal'], {}).get('label', top['signal'])}: {top['label']}" if top else "",
            "signal date": top["date"] if top else "", "source URL": top["source_url"] if top else "",
            "other signals": " | ".join(others), "reason": reason, "suggested opener": openers.get(domain, ""),
        })
    rows.sort(key=lambda r: r["score"], reverse=True)

    out = args.out or os.path.join(args.run_dir, "buying-signals.csv")
    with open(out, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=COLUMNS)
        w.writeheader()
        w.writerows(rows)

    with_signal = [r for r in rows if r["score"] > 0]
    lines = [f"# Buying signal scan, {as_of.isoformat()}", "",
             f"- Companies scanned: {len(rows)}", f"- With at least one current signal: {len(with_signal)}",
             f"- No current signal: {len(rows) - len(with_signal)}",
             f"- Candidates kept: {sum(len(v) for v in kept.values())}, dropped: {stats['dropped']}, "
             f"not reviewed (not scored): {stats['unreviewed']}, kept but too old or undated: {stats['too old or undated']}", "",
             "Most common signals: " + (", ".join(f"{cfg.get(k, {}).get('label', k)} ({v})" for k, v in type_counts.most_common()) or "none"), "",
             "## Top accounts", ""]
    lines += [f"{i}. {r['company']} ({r['score']}): {r['reason']}" for i, r in enumerate(with_signal[:10], 1)] or ["None this run."]
    if warnings:
        lines += ["", "## Warnings (not buying signals)", ""] + [f"- {w}" for w in warnings]
    lines += ["", "Signals show timing, not intent to buy. Check each source before you reach out."]
    summary = os.path.join(os.path.dirname(os.path.abspath(out)), "summary.md")
    with open(summary, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    print(f"score: wrote {out} and {summary} ({len(with_signal)}/{len(rows)} with a signal; {stats['unreviewed']} unreviewed)",
          file=sys.stderr)


if __name__ == "__main__":
    main()
