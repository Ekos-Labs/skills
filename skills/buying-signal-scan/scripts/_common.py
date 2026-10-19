"""Shared helpers for the buying-signal-scan scripts. Python 3.9+, standard library only."""

import datetime as dt
import gzip
import hashlib
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

USER_AGENT = "Mozilla/5.0 (compatible; EkosBuyingSignalScan/1.0; +https://github.com/Ekos-Labs/skills)"

# Role words that usually mean a team that buys or uses marketing, digital, e-commerce,
# CRM or IT services. Override with --roles. Matched case-insensitively on the job title.
DEFAULT_ROLE_KEYWORDS = [
    "digital", "e-commerce", "ecommerce", "online", "marketing", "crm", "it-", " it ",
    "informatik", "web", "seo", "sem", "performance", "social media", "content",
    "brand", "growth", "salesforce", "hubspot", "shop", "data", "analytics",
    "product owner", "produktmanager", "head of", "leiter", "leitung",
]


def today():
    return dt.date.today()


def parse_date(value):
    """Return a date from an ISO string, RFC 2822 string or epoch ms. None if unknown."""
    if value is None or value == "":
        return None
    if isinstance(value, (int, float)):
        return dt.datetime.utcfromtimestamp(value / 1000).date()
    value = str(value).strip()
    try:
        return dt.date.fromisoformat(value[:10])
    except ValueError:
        pass
    try:
        from email.utils import parsedate_to_datetime
        return parsedate_to_datetime(value).date()
    except (TypeError, ValueError):
        return None


def http_get(url, headers=None, timeout=25):
    """GET a URL. Returns (status, final_url, headers, text). Never raises on HTTP errors."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept-Encoding": "gzip", **(headers or {})})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read()
            if resp.headers.get("Content-Encoding") == "gzip":
                body = gzip.decompress(body)
            charset = resp.headers.get_content_charset() or "utf-8"
            return resp.status, resp.geturl(), dict(resp.headers), body.decode(charset, errors="replace")
    except urllib.error.HTTPError as err:
        return err.code, url, dict(err.headers or {}), ""
    except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as err:
        return 0, url, {}, f"ERROR: {err}"


def http_json(url, headers=None, timeout=25):
    status, _, _, text = http_get(url, {"Accept": "application/json", **(headers or {})}, timeout)
    if status != 200:
        return status, None
    try:
        return status, json.loads(text)
    except json.JSONDecodeError:
        return status, None


def signal(company, domain, signal_type, date, source_url, summary, detail=None, collector=""):
    """One candidate signal. The agent reviews each one before it is scored."""
    date_str = date.isoformat() if isinstance(date, dt.date) else (date or "")
    raw_id = f"{domain}|{signal_type}|{source_url}|{summary}"
    return {
        "id": hashlib.sha1(raw_id.encode()).hexdigest()[:12],
        "company": company,
        "domain": domain,
        "signal": signal_type,
        "date": date_str,
        "source_url": source_url,
        "summary": summary,
        "detail": detail or {},
        "collector": collector,
    }


def write_jsonl(records, path):
    """Append records to a JSONL file, or print them when path is '-'."""
    out = sys.stdout if path == "-" else open(path, "a", encoding="utf-8")
    try:
        for rec in records:
            out.write(json.dumps(rec, ensure_ascii=False) + "\n")
    finally:
        if out is not sys.stdout:
            out.close()


def read_jsonl(path):
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as fh:
        return [json.loads(line) for line in fh if line.strip()]


def match_roles(title, keywords):
    padded = f" {title.lower()} "
    return [k for k in keywords if k.lower() in padded]


def clean_domain(value):
    value = value.strip().lower()
    if "://" in value:
        value = urllib.parse.urlparse(value).netloc
    value = value.split("/")[0]
    return value[4:] if value.startswith("www.") else value


def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
