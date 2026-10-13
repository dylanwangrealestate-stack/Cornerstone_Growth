"""Daily Cornerstone Growth website report -> Dylan only, via the Cornerstone GHL
sub-account. Vercel Cron 00:35 UTC (08:35 Taiwan), covering the last 24 hours:
site up + speed, visitors and sources (Vercel metrics; needs
VERCEL_ANALYTICS_TOKEN), website form fills, new GHL contacts by source.

Delivery: SMS + email to Dylan. SMS fails until the sub-account owns a phone
number; email works now.
"""
import datetime
import json
import os
import time
import urllib.request
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

API = "https://services.leadconnectorhq.com"
LOCATION_ID = "xHennr0QkEeyzjr3Xe6N"
PIT = os.environ.get("CS_GHL_PIT", "")
# Until the Cornerstone sub-account owns a phone number, texts to Dylan go out
# through the Jones sub-account (its number already texts Dylan; same path AXIS
# uses). Set SMS_ROUTE=cornerstone once a Cornerstone number is bought.
SMS_ROUTE = os.environ.get("SMS_ROUTE", "jones")
JONES_PIT = os.environ.get("JONES_GHL_PIT", "")
JONES_LOCATION_ID = "1IkAL5w7YF1gVQX955vZ"


def jones_sms(text):
    def call(method, path, body):
        req = urllib.request.Request(
            API + path, data=json.dumps(body).encode(), method=method,
            headers={"Authorization": f"Bearer {JONES_PIT}", "Version": "2021-07-28", "Content-Type": "application/json",
                     "Accept": "application/json", "User-Agent": "curl/8.7.1"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read() or b"{}")
    cid = call("POST", "/contacts/upsert", {"locationId": JONES_LOCATION_ID, "name": "lead alerts - dylan (internal)",
                                             "phone": "+14077430525", "source": "Internal Lead Alerts",
                                             "tags": ["internal-notify", "do-not-auto-contact"]})["contact"]["id"]
    call("POST", "/conversations/messages", {"type": "SMS", "contactId": cid, "message": text})
VTOKEN = os.environ.get("VERCEL_ANALYTICS_TOKEN")
TEAM_ID = "team_jdR2BBBJW6IPuXfTAHrhekmQ"
PROJECT_ID = "prj_x7FTPwBVsxhDTKMg3J4aWKSjOuoY"
SITE = "https://www.cornerstonegrowth.us/"
DYLAN = {"name": "Daily Report - Dylan (internal)", "phone": "+14077430525",
         "email": "dylan.cornerstonegrowth@gmail.com"}


def ghl(method, path, body=None):
    req = urllib.request.Request(
        API + path, data=json.dumps(body).encode() if body is not None else None, method=method,
        headers={"Authorization": f"Bearer {PIT}", "Version": "2021-07-28", "Content-Type": "application/json",
                 "Accept": "application/json", "User-Agent": "curl/8.7.1"})
    with urllib.request.urlopen(req, timeout=20) as r:
        raw = r.read()
        return json.loads(raw) if raw else {}


def metric(name, start, end, filt=None, group=None, limit=5, aggregation="count"):
    sel = ({"metric": name, "aggregation": "unique", "dimensions": [aggregation.split("/", 1)[1]]}
           if aggregation.startswith("unique/") else {"metric": name, "aggregation": aggregation})
    body = {"scope": {"ownerId": TEAM_ID, "projectIds": [PROJECT_ID]}, "timeRange": {"start": start, "end": end},
            "bucketSeconds": 86400, "metrics": {"value": sel}, "outputs": ["value"],
            "filter": "environment:production" + (f" and {filt}" if filt else "")}
    if group:
        body["groupBy"] = group
        body["seriesSelection"] = {"limit": limit, "mode": "exact", "rankBy": [{"metric": "value", "direction": "desc"}]}
    req = urllib.request.Request(f"https://api.vercel.com/metrics/v1?teamId={TEAM_ID}", data=json.dumps(body).encode(),
                                 method="POST", headers={"Authorization": f"Bearer {VTOKEN}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read()).get("summary") or []
    except Exception:
        return None


def total(rows):
    return sum(int((r.get("values") or {}).get("value") or 0) for r in rows or [])


def traffic(start, end):
    if not VTOKEN:
        return ["Traffic: not connected yet (add VERCEL_ANALYTICS_TOKEN to cornerstone-gr0wth in Vercel)"]
    out = []
    pv = metric("vercel.analytics.page_view.count", start, end)
    if total(pv):
        people = metric("vercel.analytics.page_view.count", start, end, aggregation="unique/visitorId")
        out.append(f"Visitors: {total(people)} people, {total(pv)} page views")
    else:
        f = 'requestPath:"/" and requestMethod:"GET" and botCategory:""'
        out.append(f"Visitors: ~{total(metric('vercel.request.count', start, end, f, aggregation='unique/clientIp'))} people, "
                   f"{total(metric('vercel.request.count', start, end, f))} homepage loads")
    refs = metric("vercel.request.count", start, end, 'requestMethod:"GET" and botCategory:"" and contentType:"text/html"',
                  group=["referrerHostname"], limit=6) or []
    named = [((r["dimensions"].get("referrerHostname") or "").replace("www.", ""), total([r])) for r in refs]
    named = [(h, n) for h, n in named if h and "cornerstone" not in h]
    if named:
        out.append("From: " + ", ".join(f"{h} {n}" for h, n in named[:3]))
    ev = metric("vercel.analytics.event.count", start, end, 'eventName:"Form submitted"')
    if ev is not None:
        out.append(f"Form submits (analytics): {total(ev)}")
    return out


def build(now=None):
    now = now or datetime.datetime.now(datetime.timezone.utc)
    since = now - datetime.timedelta(hours=24)
    iso = lambda d: d.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    lines = [f"CORNERSTONE WEBSITE DAILY ({(now + datetime.timedelta(hours=8)):%a %-d %b}, last 24h)"]
    t0 = time.time()
    try:
        with urllib.request.urlopen(urllib.request.Request(SITE, headers={"User-Agent": "cs-daily/1.0"}), timeout=20) as r:
            lines.append(f"Site: UP ({r.status}, {int((time.time() - t0) * 1000)} ms)")
    except Exception as e:
        lines.append(f"!! Site: DOWN or erroring ({str(e)[:60]}) !!")
    lines += traffic(iso(since), iso(now))
    contacts = ghl("GET", f"/contacts/?locationId={LOCATION_ID}&limit=100").get("contacts", [])
    fresh = []
    for c in contacts:
        if "internal-notify" in (c.get("tags") or []):
            continue
        try:
            if datetime.datetime.fromisoformat((c.get("dateAdded") or "").replace("Z", "+00:00")) >= since:
                fresh.append(c)
        except ValueError:
            pass
    web = [c for c in fresh if "website-lead" in (c.get("tags") or [])]
    lines.append(f"Website form leads: {len(web)}")
    for c in web[:5]:
        lines.append(f"- {(c.get('contactName') or 'Unknown').title()} {c.get('phone') or ''} {c.get('email') or ''}".rstrip())
    other = len(fresh) - len(web)
    if other:
        lines.append(f"Other new GHL contacts: {other}")
    return "\n".join(lines)


def deliver(text):
    cid = ghl("POST", "/contacts/upsert", {"locationId": LOCATION_ID, "name": DYLAN["name"], "phone": DYLAN["phone"],
                                            "email": DYLAN["email"], "source": "Internal Reports",
                                            "tags": ["internal-notify", "do-not-auto-contact"]})["contact"]["id"]
    sent = []
    for kind, payload in (
        ("sms", {"type": "SMS", "contactId": cid, "message": text}) if SMS_ROUTE == "cornerstone" else ("sms-via-jones", None),
        ("email", {"type": "Email", "contactId": cid, "emailTo": DYLAN["email"],
                   "subject": text.split("\n", 1)[0].title(),
                   "html": "<pre style='font-family:-apple-system,Arial,sans-serif;font-size:15px;white-space:pre-wrap'>"
                           + text.replace("&", "&amp;").replace("<", "&lt;") + "</pre>"}),
    ):
        try:
            if kind == "sms-via-jones":
                if not JONES_PIT:
                    continue
                jones_sms(text)
            else:
                ghl("POST", "/conversations/messages", payload)
            sent.append(kind)
        except Exception:
            pass
    return sent


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self._run()

    def do_POST(self):
        self._run()

    def _run(self):
        secret = os.environ.get("CRON_SECRET")
        auth = self.headers.get("authorization") or ""
        key = parse_qs(urlparse(self.path).query).get("key", [""])[0]
        if not secret or (auth != f"Bearer {secret}" and key != secret):
            return self._send(401, {"error": "Unauthorized"})
        if not PIT:
            return self._send(503, {"error": "CS_GHL_PIT not set"})
        text = build()
        return self._send(200, {"sent": deliver(text), "report": text})

    def _send(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
