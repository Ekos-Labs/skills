# Running the scan every week

The scan is built to run again on the same folder. Each run replaces `candidates.jsonl`, keeps `state/` (site fingerprints and posting counts, needed to see relaunches and hiring growth) and keeps past review decisions in `review.json`.

Do not set any of this up for the user. Show the option, and let them add it.

A scheduled run can only collect. The review step needs the agent, so a schedule should end with "candidates ready for review", not with a scored list that nobody checked.

## cron (macOS or Linux)

Every Monday at 07:00. Edit with `crontab -e`:

```
0 7 * * 1 cd /path/to/skills/packages/skills/buying-signal-scan && /usr/bin/python3 scripts/scan.py --companies /path/to/companies.csv --out-dir /path/to/signals-run --roles "marketing,digital,e-commerce,crm" >> /path/to/signals-run/cron.log 2>&1
```

Then, in an agent session: "Review the new candidates in /path/to/signals-run and score them."

## GitHub Actions

`.github/workflows/buying-signals.yml` in a private repo that holds `companies.csv` and a copy of this skill. The run folder is committed back so `state/` survives between runs. Keep the repo private: the list of target accounts is commercial information.

```yaml
name: buying-signals
on:
  schedule:
    - cron: "0 6 * * 1"   # Mondays 06:00 UTC
  workflow_dispatch:
permissions:
  contents: write
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - name: Scan
        env:
          # optional; leave out any you do not use
          PREDICTLEADS_API_KEY: ${{ secrets.PREDICTLEADS_API_KEY }}
          PREDICTLEADS_API_TOKEN: ${{ secrets.PREDICTLEADS_API_TOKEN }}
          FIRECRAWL_API_KEY: ${{ secrets.FIRECRAWL_API_KEY }}
        run: python3 buying-signal-scan/scripts/scan.py --companies companies.csv --out-dir signals-run --roles "marketing,digital,e-commerce,crm"
      - name: Save run
        run: |
          git config user.name "signals-bot"
          git config user.email "signals-bot@users.noreply.github.com"
          git add signals-run
          git commit -m "Buying signal scan $(date -u +%F)" || echo "no changes"
          git push
```

Keys go in the repository's Actions secrets, never in the file.

Some sites block traffic from cloud IP ranges. Expect more tech check failures from GitHub runners than from a laptop; the log says which ones.
