# Signal guide

Nine buying signals. Six are core: the bundled scripts collect them, and most need no key. Three are extended: the agent checks them by hand or with an optional key.

A signal shows timing. It does not show intent to buy. Read every candidate before it scores.

## Scoring

Points for one kept signal:

```
points = weight x strength x 0.5 ** (age_days / half_life_days)
```

- `strength` is set by the agent in review: strong 1.5, normal 1.0, weak 0.5.
- Points halve every `half_life_days`. With the default of 21 days, a signal is worth half after 3 weeks and an eighth after 9 weeks. Old signal, cold signal.
- Signals older than `max_age_days` score 0.
- Within one signal type, the strongest counts in full and each further one counts half. A type can add at most 2 x its weight. Ten job ads do not beat one new CMO plus one relevant job ad.
- Defaults live in `scripts/weights.json`. `scripts/feedback.py` suggests new weights from reply and meeting outcomes.

| # | Signal | Type key | Phase | Weight | Half-life | Max age |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Job postings for roles that buy or use what you sell | `role_hiring` | core | 3 | 21 d | 90 d |
| 2 | Many open roles at once | `hiring_volume` | core | 2 | 21 d | 60 d |
| 3 | New leadership (CMO, Head of Digital, Managing Director) | `new_leadership` | core | 3 | 42 d | 180 d |
| 4 | Website relaunch or new shop system | `relaunch` | core | 2 | 21 d | 120 d |
| 5 | Outdated tech stack | `outdated_stack` | core | 1 | no decay | while true |
| 6 | Funding, acquisition, new locations | `funding_growth` | core | 3 | 21 d | 120 d |
| 7 | Ad activity (Google, Meta) | `ad_activity` | extended | 1 | 21 d | 60 d |
| 8 | Trade fair presence | `trade_fair` | extended | 2 | 21 d | 90 d |
| 9 | Bad or falling reviews | `reviews` | extended | 1 | 21 d | 90 d |

Two exceptions to the 3-week fade, on purpose:

- **New leadership** halves every 6 weeks. New leaders often bring in new providers in their first 6 months, so a 2-month-old appointment is still warm. Set it to 21 in `weights.json` if you want one rule for everything.
- **Outdated tech stack** is a state, not an event. It scores its full (low) weight on every run while it is still true, and disappears when the site is fixed.

`risk` (insolvency, layoffs, short-time work) scores 0 and is listed as a warning. It is not a buying signal. Most sellers should wait.

## Per signal: what it tells you, false positives, sources

### 1. Job postings for relevant roles (`role_hiring`)

The company is investing in that area right now. The role named in the ad is often the future buyer or user.

Keep when: the title is a role that buys or uses what the seller sells (Digital Manager, E-Commerce, Marketing, CRM, IT for a matching seller), and the ad is at the company itself.

Drop when:
- The company sells the same service. A "Digital Manager" opening at a digital agency is their own delivery hire, not a buyer of a digital agency.
- It is a recruiter or staffing firm posting for an unnamed client (Hays, DIS AG, Brunel and similar; "Anonymer Arbeitgeber").
- It is an apprenticeship, Werkstudent or internship, unless the seller sells to that team.
- The keyword matched by accident: "Employer Brand" in HR, "Online" in a store job, "IT" inside another word.
- The role suggests they will build it in-house (Senior CRM Engineer for a CRM agency). Keep as weak at most.
- The same ad is reposted. Count it once, at its first publication date.

Sources:
- Germany: Bundesagentur fuer Arbeit Jobsuche API (`scripts/jobsuche.py`). Free, no account. `GET https://rest.arbeitsagentur.de/jobboerse/jobsuche-service/pc/v6/jobs` with header `X-API-Key: jobboerse-jobsuche`. Verified live on 2026-10-19 (v4 and v5 now return 403). The `arbeitgeber` filter needs the exact stored employer name.
- Any country: the company's own job board feed (`scripts/career_jobs.py`): Personio XML, Greenhouse, Lever, Ashby. Free, no key.
- Any country, optional: job boards via an Apify actor (`APIFY_TOKEN`), PredictLeads job openings (`PREDICTLEADS_API_KEY` + `PREDICTLEADS_API_TOKEN`), careers page text via Firecrawl (`FIRECRAWL_API_KEY`) or a plain fetch.
- US / UK: no national public job API covers private employers. Use the company job board feeds above, or an optional provider.
- Never LinkedIn. Scraping it breaks their terms.

### 2. Many open roles at once (`hiring_volume`)

Fast growth, too few people in-house. Teams that grow fast often buy help before they hire it.

Keep when: new postings in 28 days are high for the company's size, or clearly up against the last run (`state/hiring.csv` keeps counts per run; `detail.previous` shows the last one).

Drop when:
- Volume is normal turnover for a large employer (a retailer with 400 open store jobs).
- The postings are seasonal, store, warehouse or production roles and the seller does not sell to those teams.
- Counts include other legal entities with a similar name. Check `detail.employers` and pin names with the `employer` column.

Sources: same as signal 1. Growth over time needs at least two runs.

### 3. New leadership (`new_leadership`)

New leaders often review providers and bring in their own in the first 6 months.

Keep when: a named new person in a buying role (CMO, CDO, Head of Digital, Head of E-Commerce, Managing Director, Marketing lead) started or was appointed at this company. Use the start date, not the article date, when the article gives one.

Drop when:
- The headline only mentions an existing leader (an interview with the CEO).
- The change is at a parent company, a subsidiary in another country, or a namesake.
- It is board-level only (Aufsichtsrat) with no operational role.
- The role does not touch what the seller sells.

Record the role, not the person. Do not collect private details about individuals.

Sources:
- Germany: Google News RSS (`scripts/news_rss.py`, `hl=de&gl=DE`), the company's press or news page, Handelsregister announcements for a new Geschaeftsfuehrer (search by hand at handelsregister.de; scripts are not used there because of its access limits).
- US: Google News RSS (`hl=en&gl=US`), company newsroom, SEC filings for listed companies (Form 8-K item 5.02 covers officer changes; EDGAR full-text search at efts.sec.gov needs a User-Agent with contact details).
- UK: Google News RSS (`hl=en&gl=GB`), Companies House officer appointments (free API key from developer.company-information.service.gov.uk; not wrapped in a script here).
- Optional: PredictLeads news events (`hires`, `promotes`, `leaves`).

### 4. Website relaunch or new shop system (`relaunch`)

A digital project is running or just finished. Budget is assigned and the team is open to adjacent work, or about to be.

Keep when: the platform fingerprint changed between two runs (`scripts/tech_check.py` with `--state`), or news or the company itself announces a new site or shop.

Drop when:
- Only the design or a campaign page changed and the platform is the same.
- The change is a CDN, consent tool or tracking script, not the CMS or shop.
- The first run of a domain. A relaunch needs a before and after. The first run only stores the fingerprint.

Sources: the tech check (any country, no key), Google News RSS, the company's news page. For a past baseline, the Internet Archive Wayback Machine has older homepages (it rate limits scripts; check by hand).

### 5. Outdated tech stack (`outdated_stack`)

They will need to modernize soon. Low weight on its own; strong next to a relevant hire.

The tech check flags: no HTTPS or no redirect to it, jQuery 1.x or 2.x, a copyright year older than last year, Magento 1 or Shopware 5 (both end of life), WordPress before 6 or TYPO3 10 and older in the generator tag, PHP before 8.1 in headers, no mobile viewport, Flash.

Drop when:
- The old jQuery belongs to a third-party widget, not the site.
- The copyright year is old but the site is clearly maintained (fresh news, current products).
- The page that loaded was a bot challenge or a holding page (HTTP 403 and 429 are reported as failures, not as outdated).

Sources: the tech check. For a deeper look, BuiltWith or Wappalyzer by hand.

### 6. Funding, acquisition, new locations (`funding_growth`)

Fresh budget and growth. New entities, brands or sites to integrate.

Keep when: the company itself raised money, bought or merged with a company, opened a new location, plant or market. Count one event once, even if 20 outlets covered it.

Drop when:
- The article is market commentary, stock price or analyst notes.
- The company was the one sold and is being absorbed (often a freeze, not a budget).
- "Eroeffnet" or "opens" refers to a charity, a sponsored event or someone else.

Sources:
- Germany: Google News RSS, Bundesanzeiger and Unternehmensregister (financial statements and notices; search by hand), Handelsregister (mergers, new branches; by hand).
- US: Google News RSS, SEC EDGAR Form D (private funding rounds) and 8-K, company newsroom.
- UK: Google News RSS, Companies House filings (share allotments SH01 show new equity).
- Optional: PredictLeads news events (`receives_financing`, `acquires`, `opens_new_location`, `expands_offices_in`).

### 7. Ad activity, Google and Meta (`ad_activity`, extended)

They spend on marketing, or just stopped. Starting suggests budget; stopping can suggest a problem or a provider change.

Keep when: you see a clear start, stop or big change against an earlier check, dated.

Drop when: you only have one snapshot (ads running today are not news), or the ads belong to a reseller or franchisee.

Sources (any country):
- Meta Ad Library: facebook.com/ads/library in a browser. The Ad Library API (`META_AD_LIBRARY_ACCESS_TOKEN`, see this repo's `competitor-ads-intelligence` skill) returns non-political ads only for ads delivered in the EU and UK.
- Google Ads Transparency Center: adstransparency.google.com, search by domain or advertiser. No public API; check by hand.

### 8. Trade fair presence (`trade_fair`, extended)

An active sales push in a set period. Teams before a fair need materials, pages and follow-up.

Keep when: the company is listed as an exhibitor at an upcoming or just finished fair. Date it by the fair date. Points start when the fair is near and fade after it.

Drop when: the company is only a visitor, a sponsor of an unrelated event, or listed in last year's catalogue.

Sources: the fair's own exhibitor list (most fairs publish one; fetch by hand or with Firecrawl). Germany: AUMA (auma.de) lists German trade fairs and dates. US / UK: the organiser's site for the specific show.

### 9. Bad or falling reviews (`reviews`, extended)

Problems they need to fix: service, delivery, product, or as an employer.

Keep when: the rating fell clearly over recent months, or recent reviews repeat the same problem that the seller solves.

Drop when: there are only a few reviews, one angry review, or the problem is unrelated to what the seller sells.

Sources: Google reviews (Google Maps, by hand; the Places API needs a key and a billing account), Trustpilot, and employer review sites (Germany: kununu; US / UK: Glassdoor, Indeed). These sites block scripts; check in a browser. Read company-level patterns only. Do not copy reviewer names.

## Rules that apply to every signal

- Company-level public data only. Store role titles, not people's names, unless the user needs the name of a newly appointed executive that the company itself announced.
- No LinkedIn scraping. No logged-in pages. No bypassing bot protection.
- GDPR: job ads and press releases are about the company; that is the scope. Do not build profiles of individuals, and do not keep raw data longer than the user needs it.
- Google News RSS is published for personal, non-commercial feed reader use. Keep volume low and do not republish its results.
- Nothing in this skill contacts anyone. It prepares a list and openers; the user decides and sends.
