#!/usr/bin/env python3
"""Website tech check for one domain. Free. No key. Reads the public homepage only.

Finds:
  - CMS and shop system (WordPress, TYPO3, Shopware, Shopify, Magento, ...), plus versions when the page shows them
  - outdated signs: old jQuery, no HTTPS or no redirect to it, old copyright year,
    end-of-life platform versions, no mobile viewport, old PHP in headers
  - links to public job boards (Personio, Greenhouse, Lever, Ashby) for career_jobs.py
  - a fingerprint saved to --state; when the platform changes between runs it emits a relaunch signal

Emits candidate signals as JSONL: outdated_stack (one per company, all reasons in detail)
and relaunch (only when the saved fingerprint changed). The full tech list is always in detail.

Example:
  python3 tech_check.py --company "Ottobock" --domain ottobock.com --state state/tech.json --out -
"""

import argparse
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import http_get, signal, today, write_jsonl  # noqa: E402

PLATFORMS = {
    # name: (kind, regex on html)
    "WordPress": ("cms", r"/wp-content/|/wp-includes/"),
    "TYPO3": ("cms", r"typo3conf/|typo3temp/|/_assets/[0-9a-f]{32}/|generator\" content=\"TYPO3"),
    "Drupal": ("cms", r"Drupal\.settings|/sites/default/files/|data-drupal-"),
    "Joomla": ("cms", r"/media/jui/|content=\"Joomla"),
    "Contao": ("cms", r"content=\"Contao|/assets/contao/|/bundles/contao"),
    "Adobe Experience Manager": ("cms", r"/etc\.clientlibs/|/content/dam/"),
    "Sitecore": ("cms", r"/-/media/|sitecore|sc_site"),
    "Magnolia": ("cms", r"/\.resources/|magnolia-|mgnl"),
    "FirstSpirit": ("cms", r"firstspirit"),
    "Wix": ("cms", r"static\.wixstatic\.com|wix-bolt"),
    "Squarespace": ("cms", r"static1\.squarespace\.com"),
    "Webflow": ("cms", r"webflow\.(js|com)|data-wf-page"),
    "Jimdo": ("cms", r"jimdo"),
    "HubSpot CMS": ("cms", r"hs-sites\.com|/hubfs/"),
    "Next.js": ("framework", r"/_next/static/|__NEXT_DATA__"),
    "Nuxt": ("framework", r"/_nuxt/|__NUXT__"),
    "Gatsby": ("framework", r"___gatsby"),
    "Shopify": ("shop", r"cdn\.shopify\.com|Shopify\.theme"),
    "Shopware 6": ("shop", r"/bundles/storefront/|sw-storefront|data-shopware"),
    "Shopware 5": ("shop", r"/themes/Frontend/|/engine/Shopware/"),
    "Magento 2 / Adobe Commerce": ("shop", r"/static/version\d+/|mage/cookies|Magento_"),
    "Magento 1": ("shop", r"/skin/frontend/|Mage\.Cookies|varien/"),
    "WooCommerce": ("shop", r"woocommerce"),
    "OXID eShop": ("shop", r"oxid(?:esales|-eshop|_)|/out/flow/"),
    "JTL-Shop": ("shop", r"jtl-shop|/templates/NOVA/"),
    "Gambio": ("shop", r"gambio"),
    "plentymarkets": ("shop", r"plentymarkets|plenty-shop|/plugins/Ceres/"),
    "Salesforce Commerce Cloud": ("shop", r"demandware|/on/demandware\.static/"),
    "SAP Commerce": ("shop", r"/_ui/responsive/|hybris"),
    "PrestaShop": ("shop", r"prestashop"),
    "BigCommerce": ("shop", r"bigcommerce\.com"),
    "Spryker": ("shop", r"spryker"),
    "Google Tag Manager": ("marketing", r"googletagmanager\.com/gtm\.js|GTM-[A-Z0-9]{4,}"),
    "Google Analytics 4": ("marketing", r"gtag/js\?id=G-|googletagmanager\.com/gtag"),
    "Meta Pixel": ("marketing", r"connect\.facebook\.net/[^\"']*/fbevents\.js|fbq\("),
    "LinkedIn Insight": ("marketing", r"snap\.licdn\.com"),
    "HubSpot tracking": ("marketing", r"js\.hs-scripts\.com|js\.hsforms\.net"),
    "Salesforce Marketing Cloud": ("marketing", r"exacttarget|marketingcloudapps"),
    "Usercentrics": ("consent", r"usercentrics"),
    "Cookiebot": ("consent", r"cookiebot"),
    "OneTrust": ("consent", r"onetrust|cookielaw\.org"),
}

JOB_BOARDS = {
    "personio": r"https?://([a-z0-9-]+)\.jobs\.personio\.(?:de|com)",
    "greenhouse": r"(?:boards|job-boards)(?:\.eu)?\.greenhouse\.io/(?:embed/job_board\?for=)?([a-z0-9_-]+)",
    "lever": r"jobs\.lever\.co/([a-z0-9_-]+)",
    "ashby": r"jobs\.ashbyhq\.com/([A-Za-z0-9_.-]+)",
}

EOL = [
    ("Magento 1", "Magento 1 reached end of life in June 2020"),
    ("Shopware 5", "Shopware 5 reached end of life in July 2024"),
]


def detect(html):
    found = {}
    for name, (kind, rx) in PLATFORMS.items():
        if re.search(rx, html, re.IGNORECASE):
            found[name] = kind
    # Shopware 5 and 6 both mention "shopware"; only keep the one that matched its path
    gen = re.search(r'<meta[^>]+name="generator"[^>]+content="([^"]+)"', html, re.IGNORECASE) or \
        re.search(r'<meta[^>]+content="([^"]+)"[^>]+name="generator"', html, re.IGNORECASE)
    return found, (gen.group(1) if gen else "")


def jquery_version(html):
    versions = []
    for rx in (r"jquery[-.]?(\d+\.\d+(?:\.\d+)?)(?:\.min|\.slim)?\.js", r"jquery(?:\.min)?\.js\?ver=(\d+\.\d+(?:\.\d+)?)",
               r"jQuery v(\d+\.\d+(?:\.\d+)?)", r"/jquery/(\d+\.\d+(?:\.\d+)?)/"):
        versions += re.findall(rx, html, re.IGNORECASE)
    return sorted(set(versions), key=lambda v: [int(x) for x in v.split(".")])


def copyright_year(html):
    text = re.sub(r"<[^>]+>", " ", html)
    years = [int(y) for y in re.findall(r"(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?((?:19|20)\d{2})", text, re.IGNORECASE)]
    return max(years) if years else None


def check(domain):
    https_status, final_url, headers, html = http_get(f"https://{domain}")
    if https_status != 200 or not html or html.startswith("ERROR"):
        retry = http_get(f"https://www.{domain}")
        if retry[0] == 200:
            https_status, final_url, headers, html = retry
    http_status, http_final, _, _ = http_get(f"http://{domain}", timeout=15)
    if https_status != 200:
        # 403 and 429 are usually bot protection, not a broken site. Say so instead of guessing.
        raise RuntimeError(f"homepage returned HTTP {https_status} to a script (often bot protection); check it in a browser")
    found, generator = detect(html)
    if "Shopware 6" in found and "Shopware 5" in found:
        found.pop("Shopware 5")
    if "Magento 2 / Adobe Commerce" in found and "Magento 1" in found:
        found.pop("Magento 1")
    outdated = []
    if not final_url.startswith("https://"):
        outdated.append("homepage does not load over HTTPS")
    if http_status == 200 and not http_final.startswith("https://"):
        outdated.append("http:// does not redirect to https://")
    jq = jquery_version(html)
    if jq and int(jq[0].split(".")[0]) < 3:
        outdated.append(f"jQuery {jq[0]} (version 1 or 2; current major is 3 or later)")
    year = copyright_year(html)
    if year and year < today().year - 1:
        outdated.append(f"copyright year {year}")
    for name, why in EOL:
        if name in found:
            outdated.append(why)
    m = re.search(r"WordPress (\d+)\.(\d+)", generator)
    if m and int(m.group(1)) < 6:
        outdated.append(f"generator says {generator}")
    m = re.search(r"TYPO3 CMS (\d+)|TYPO3 (\d+)", generator)
    if m and int(m.group(1) or m.group(2)) <= 10:
        outdated.append(f"generator says {generator} (TYPO3 10 and older are out of free support)")
    if not re.search(r'<meta[^>]+name="viewport"', html, re.IGNORECASE):
        outdated.append("no mobile viewport meta tag")
    powered = headers.get("X-Powered-By", "") or headers.get("x-powered-by", "")
    m = re.search(r"PHP/(\d+)\.(\d+)", powered)
    if m and (int(m.group(1)), int(m.group(2))) < (8, 1):
        outdated.append(f"server header {powered} (PHP before 8.1 is out of security support)")
    if re.search(r"swfobject|\.swf[\"']", html, re.IGNORECASE):
        outdated.append("Flash content referenced")
    boards = {}
    for board, rx in JOB_BOARDS.items():
        m = re.search(rx, html, re.IGNORECASE)
        if m:
            boards[board] = m.group(1)
    title = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    return {
        "final_url": final_url, "status": https_status, "generator": generator,
        "platforms": found, "jquery": jq, "copyright_year": year, "outdated": outdated,
        "job_boards": boards, "title": (title.group(1).strip()[:120] if title else ""),
    }


def fingerprint(result):
    return sorted(k for k, v in result["platforms"].items() if v in ("cms", "shop", "framework"))


def run(company, domain, state_path=None):
    result = check(domain)
    out = []
    if result["outdated"]:
        out.append(signal(company, domain, "outdated_stack", today(), result["final_url"],
                          "Outdated site: " + "; ".join(result["outdated"]), result, "tech_check"))
    state = {}
    if state_path and os.path.exists(state_path):
        with open(state_path, encoding="utf-8") as fh:
            state = json.load(fh)
    prev = state.get(domain)
    now = fingerprint(result)
    if prev and prev["fingerprint"] != now:
        out.append(signal(company, domain, "relaunch", today(), result["final_url"],
                          f"Site platform changed from {', '.join(prev['fingerprint']) or 'unknown'} to {', '.join(now) or 'unknown'}",
                          {**result, "previous": prev}, "tech_check"))
    if state_path:
        state[domain] = {"date": today().isoformat(), "fingerprint": now, "title": result["title"]}
        os.makedirs(os.path.dirname(os.path.abspath(state_path)), exist_ok=True)
        with open(state_path, "w", encoding="utf-8") as fh:
            json.dump(state, fh, indent=1, ensure_ascii=False)
    return out, result


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--company", required=True)
    ap.add_argument("--domain", required=True)
    ap.add_argument("--state", help="JSON file that keeps each site's platform fingerprint between runs")
    ap.add_argument("--out", default="-")
    args = ap.parse_args()
    try:
        records, result = run(args.company, args.domain, args.state)
    except RuntimeError as err:
        sys.exit(f"tech_check: {args.domain}: {err}")
    write_jsonl(records, args.out)
    print(f"tech_check: {args.domain}: platforms={list(result['platforms'])} outdated={result['outdated']} "
          f"job_boards={result['job_boards']}", file=sys.stderr)


if __name__ == "__main__":
    main()
