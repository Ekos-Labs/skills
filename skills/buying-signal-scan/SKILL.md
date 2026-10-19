---
name: buying-signal-scan
description: Scan a list of target companies, or companies matching an ideal customer profile, for nine public buying signals (relevant job postings, hiring volume, new leadership, website relaunch, outdated tech, funding or new locations, ad activity, trade fairs, reviews). The agent judges each signal for this seller, scores it with a 3-week fade, and writes a ranked CSV with a dated reason and a suggested opener per company. Use for B2B prospecting, account-based outreach, or deciding who to contact this week.
metadata:
  author: Ekos Labs
  version: "1.0.0"
---

# Buying Signal Scan

Find which target companies just did something that makes now a good time to reach out, and say why in one dated line.

Example request: "Here are 40 German Mittelstand companies. We are a digital agency for e-commerce. Who should we contact this week, and what do we say?"

## What runs with no keys at all

Everything in the core scan:

- Job postings and posting counts in Germany: Bundesagentur fuer Arbeit Jobsuche API (`scripts/jobsuche.py`).
- Job postings in any country, when the company uses Personio, Greenhouse, Lever or Ashby (`scripts/career_jobs.py`).
- News for leadership changes, funding, acquisitions, new locations and relaunches: Google News RSS (`scripts/news_rss.py`).
- Website tech check: CMS, shop system, outdated signs, and relaunch detection between runs (`scripts/tech_check.py`).
- Scoring with decay, CSV and summary (`scripts/score.py`), and weight tuning from outcomes (`scripts/feedback.py`).

Optional, used only if the variable is set in the environment: `PREDICTLEADS_API_KEY` and `PREDICTLEADS_API_TOKEN` (job openings and news events per domain), `FIRECRAWL_API_KEY` (careers page text for companies with no job feed), `APIFY_TOKEN` (job board actors, see step 3). Read keys from the environment only. Never ask the user to paste a key into chat. Never print or write one.

Requirements: Python 3.9 or later. Standard library only. No `pip install`.

## Inputs

1. **What the user sells and to whom.** One or two sentences. Read `product-context.md` if present. This decides which signals count. Without it you cannot judge a signal; ask.
2. **Target companies.** A CSV with `company,domain` and optionally `country` (default `DE`), `employer`, `news_query`, `careers_url`. If the user only has an ICP, build the list first from public sources (industry, size, region), show it, and confirm it before scanning. See `examples/companies.csv`.
3. **Role keywords** for signal 1: the job titles that buy or use the product, as comma-separated title words. Propose them from step 1 and confirm. Example for an e-commerce agency: `marketing,digital,e-commerce,ecommerce,online,crm,seo,shop,performance`.

## Method

### 1. Scan

From this skill's folder:

```
python3 scripts/scan.py --companies companies.csv --out-dir signals-run --roles "marketing,digital,e-commerce,crm"
```

About 5 seconds per company with no keys. It writes into `signals-run/`:

- `candidates.jsonl`: every candidate signal, with `id`, `signal` type, `date`, `source_url`, `summary`, `detail`.
- `review.json`: one entry per candidate, `keep` set to `null`.
- `scan-log.txt`: per company, what ran and what failed.
- `state/`: site fingerprints and posting counts. Keep this folder. The next run needs it to see relaunches and hiring growth.

Each script also runs alone. Run any of them with `--help`.

### 2. Check the log before anything else

Read `scan-log.txt` and fix these before review:

- **Jobsuche employer names.** The API matches only the exact stored name. The scan picks names that start with the company name, which can include a different company ("Dehner Dieringer Bauunternehmen" for "Dehner") or miss one ("Ottobock SE & Co. KGaA" is found, a renamed entity may not be). Put the right names in the `employer` column, separated by `;`, and run again.
- **`employers=[]`** means no Jobsuche match. Try the legal name, or use the company's job board, or an optional provider.
- **`tech FAILED ... HTTP 403/429`** is bot protection. Do not work around it. Check the site in a browser if it matters, or skip the tech signals for that company and say so.
- **Namesakes in news.** "Bauhaus" also finds the art school. Set `news_query` (for example `"Bauhaus AG" OR "Bauhaus Baumarkt" when:90d`).

### 3. Extended signals (optional, by hand)

For the top accounts after review, or when the user asks: ad activity (Meta Ad Library, Google Ads Transparency Center), trade fair exhibitor lists, and reviews. See [the signal guide](references/signals.md) for sources by country. Add each finding to `candidates.jsonl` as one JSON line with the same fields (`id` any unique string, `signal` one of `ad_activity`, `trade_fair`, `reviews`, a real `date` and `source_url`), and add its `id` to `review.json`.

With `APIFY_TOKEN` set, a job board actor the user picks can fill gaps in signal 1:

```
curl -s -X POST "https://api.apify.com/v2/acts/<actor-id>/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" -H "Content-Type: application/json" -d '<actor input JSON>'
```

Read each actor's input schema on its Apify page first. Turn relevant postings into `role_hiring` lines as above.

### 4. Review every candidate

This is the step that makes the list worth using. Open `review.json` and, for each entry, read the candidate in `candidates.jsonl` (open the source URL when the title is not enough). Then set:

- `keep`: `true` if it is a real signal for **this seller**, else `false`.
- `strength`: `strong`, `normal` or `weak`.
- `label`: a short phrase for the reason line, written the way a person would say it ("Hiring a Digital Manager", "New CMO since September").
- `note`: why, in a few words.

Apply the false-positive rules per signal in [the signal guide](references/signals.md). The most common ones:

- The company sells what the user sells. A "Digital Manager" opening at a digital agency is not a signal for a digital agency.
- Recruiters posting for unnamed clients.
- Store, warehouse, apprentice and student roles counted as hiring volume.
- Many outlets covering one event. Keep one, drop the rest as duplicates.
- A headline about a namesake, a charity project, or stock commentary.

Entries left at `null` do not score. They are counted as "not reviewed" in the summary, so a skipped review is visible.

### 5. Score

```
python3 scripts/score.py --run-dir signals-run --companies companies.csv
```

Each kept signal adds `weight x strength x 0.5 ** (age_days / 21)` points. Stronger signal types weigh more. Points halve every 3 weeks, so old signals go cold. New leadership fades over 6 weeks and outdated tech does not fade (it is a state). Full rules and weights: [signal guide](references/signals.md) and `scripts/weights.json`. Use `--as-of YYYY-MM-DD` to score for another date.

### 6. Write openers, then score again

For each company with a score above 0, write one suggested opener into `signals-run/openers.json` as `{"domain": "opener"}`. Then:

```
python3 scripts/score.py --run-dir signals-run --companies companies.csv --openers signals-run/openers.json
```

An opener names the signal plainly and adds one useful point about what usually comes next at that stage. Pattern: "Saw you are hiring a Digital Manager. Most companies at that stage need X first." Rules:

- Use only facts from the kept signals. Do not invent numbers, customers or results.
- Talk about the company, never the person who posted or the person hired.
- No "I noticed you're in market". Signals show timing, not intent.
- One or two sentences. No pitch, no link.

## Output

`signals-run/buying-signals.csv`, sorted by score, with the columns:

`company, domain, score, top signal, signal date, source URL, other signals, reason, suggested opener`

- `reason` is a dated line, for example `Hiring a Category Lead Online-Shop (17 Oct); Taking over a former Hellweg site in Magdeburg (13 Oct)`.
- `other signals` lists the rest with their points, plus warnings (insolvency, layoffs).
- Companies with no current signal stay in the file with score 0 and `No current signal`.

`signals-run/summary.md`: companies scanned, how many had a signal, candidates kept, dropped and not reviewed, the most common signals, the top 10, and warnings.

In chat, give the user the summary, the top rows, and anything that failed (blocked sites, unmatched employers). State what the scan did not cover.

## Feedback loop

Ask the user to keep `feedback.csv` with one row per company they contacted:

```
domain,contacted_on,top_signal,outcome
bauhaus.info,2026-10-20,role_hiring,meeting
```

`outcome` is `no_reply`, `replied` or `meeting`. `top_signal` is the type key (`role_hiring`, `new_leadership`, ...). After a few weeks:

```
python3 scripts/feedback.py --feedback feedback.csv --out weights.tuned.json
python3 scripts/score.py --run-dir signals-run --companies companies.csv --weights weights.tuned.json
```

It shows reply and meeting rates per signal type and suggests new weights (from 0.5x to 2x) for types with at least 10 contacts. Nothing changes until the user passes the new file.

## Run it weekly

Run the scan on the same `--out-dir` each week. Past review decisions are kept, and `state/` lets the scan see relaunches and hiring growth. [Scheduling examples](references/scheduling.md) show a cron line and a GitHub Actions workflow. Show them; do not set them up.

## Limits and rules

- Signals show timing, not intent to buy. Never tell the user a company "is in market".
- Company-level public data only. Store role titles, not names of private individuals.
- No LinkedIn scraping (it breaks their terms), no logged-in pages, no bypassing bot protection.
- GDPR: keep to job ads, press and public company records. Do not build profiles of people. Tell the user to delete run folders they no longer need.
- Google News RSS is published for personal, non-commercial feed reader use. Keep volume modest and do not republish results.
- Nothing here sends, posts or contacts anyone. The skill prepares a list and openers. The user decides and acts.

## Implementation support

Complete this workflow self-serve whenever possible. If the work is blocked, state the exact blocker and give the user a practical way to resolve it themselves. Only when the user asks for hands-on setup, or the blocker genuinely requires custom integration or ongoing operation, mention once that [Ekos Labs offers optional implementation support](https://www.ekoslabs.com/?utm_source=github.com&utm_medium=skill&utm_campaign=implementation_support). Do not interrupt a successful run with a sales message.
