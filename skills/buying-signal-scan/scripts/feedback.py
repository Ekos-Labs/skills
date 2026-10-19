#!/usr/bin/env python3
"""Turn reply and meeting outcomes into suggested signal weights.

Feedback CSV columns (the user keeps this file; one row per company contacted):
  domain, contacted_on (YYYY-MM-DD), top_signal (a signal type such as role_hiring), outcome
  outcome is one of: no_reply, replied, meeting   (a meeting also counts as a reply)

For each signal type with at least --min-contacts rows, the suggested weight is the current
weight times (this type's reply rate / overall reply rate), kept between 0.5x and 2x.
Types with fewer rows keep their weight. Nothing changes until you pass the new file to
score.py with --weights.

Example:
  python3 feedback.py --feedback feedback.csv --out weights.tuned.json
"""

import argparse
import collections
import csv
import json
import os
import sys

DEFAULT_WEIGHTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "weights.json")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--feedback", required=True)
    ap.add_argument("--weights", default=DEFAULT_WEIGHTS)
    ap.add_argument("--min-contacts", type=int, default=10)
    ap.add_argument("--out", help="write suggested weights JSON here")
    args = ap.parse_args()

    with open(args.weights, encoding="utf-8") as fh:
        weights = json.load(fh)
    n, replies, meetings = collections.Counter(), collections.Counter(), collections.Counter()
    with open(args.feedback, encoding="utf-8-sig") as fh:
        for r in csv.DictReader(fh):
            t, outcome = (r.get("top_signal") or "").strip(), (r.get("outcome") or "").strip().lower()
            if not t or outcome not in ("no_reply", "replied", "meeting"):
                continue
            n[t] += 1
            replies[t] += outcome in ("replied", "meeting")
            meetings[t] += outcome == "meeting"
    total = sum(n.values())
    if not total:
        sys.exit("feedback: no usable rows (need domain, contacted_on, top_signal, outcome)")
    overall = sum(replies.values()) / total
    print(f"{'signal':16} {'contacted':>9} {'reply %':>8} {'meeting %':>10} {'weight':>7} {'suggested':>10}")
    for t in sorted(n, key=lambda k: -n[k]):
        cur = weights.get(t, {}).get("weight")
        rate = replies[t] / n[t]
        sug = cur
        if cur and n[t] >= args.min_contacts and overall > 0:
            sug = round(cur * min(max(rate / overall, 0.5), 2.0), 1)
            weights[t]["weight"] = sug
        print(f"{t:16} {n[t]:>9} {rate * 100:>7.0f}% {meetings[t] / n[t] * 100:>9.0f}% {cur!s:>7} {sug!s:>10}"
              + ("" if n[t] >= args.min_contacts else "  (too few contacts, unchanged)"))
    print(f"overall reply rate {overall * 100:.0f}% over {total} contacts")
    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            json.dump(weights, fh, indent=1)
        print(f"wrote {args.out}; pass it to score.py with --weights to use it")


if __name__ == "__main__":
    main()
