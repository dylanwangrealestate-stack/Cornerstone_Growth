"""POST /api/visit — text Dylan when a real person visits, or clicks "Book a Call".

Used by cornerstonegrowth.us and lodeline (lodeline.org / lodeline.vercel.app).
The browser reports a visit at most once per visitor per day (dedupe lives in
the visitor's localStorage, src/visit.js) and every "Book a Call" click; this
endpoint drops bots, adds where they came from and roughly where they are
(Vercel's IP geolocation headers), and texts Dylan through the Jones number,
the same route as the lead alerts (SMS_ROUTE, see lead.py).

Set VISIT_ALERTS=off in Vercel to silence visitor texts without a deploy
(book-call clicks and bookings keep texting unless VISIT_ALERTS=none).
Nothing is stored: no IPs, no cookies, no visitor profile.
"""
import json
import os
import re
import urllib.request
from http.server import BaseHTTPRequestHandler
from urllib.parse import unquote

API = "https://services.leadconnectorhq.com"
JONES_PIT = os.environ.get("JONES_GHL_PIT", "")
CS_PIT = os.environ.get("CS_GHL_PIT", "")
SMS_ROUTE = os.environ.get("SMS_ROUTE", "jones")
JONES_LOCATION_ID = "1IkAL5w7YF1gVQX955vZ"
CS_LOCATION_ID = "xHennr0QkEeyzjr3Xe6N"
DYLAN_PHONE = "+14077430525"
MODE = os.environ.get("VISIT_ALERTS", "on").lower()   # on | off (book clicks only) | none

CORS_ORIGIN = re.compile(r"^https://((www\.)?cornerstonegrowth\.us|cornerstone-gr0wth[a-z0-9-]*\.vercel\.app"
                         r"|lodeline\.vercel\.app|lodeline-[a-z0-9-]+-dylan-wang-s-projects1\.vercel\.app"
                         r"|(www\.)?lodeline\.[a-z]{2,10})$")
BOT = re.compile(r"bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|pingdom|uptime|"
                 r"monitor|curl|wget|python|axios|node-fetch|go-http|scan|vercel", re.I)
SITES = {"cornerstone": "cornerstonegrowth.us", "lodeline": "lodeline"}


def sms(text):
    pit, loc, name = (CS_PIT, CS_LOCATION_ID, "Daily Report - Dylan (internal)") if SMS_ROUTE == "cornerstone" \
        else (JONES_PIT, JONES_LOCATION_ID, "lead alerts - dylan (internal)")

    def call(method, path, body):
        req = urllib.request.Request(
            API + path, data=json.dumps(body).encode(), method=method,
            headers={"Authorization": f"Bearer {pit}", "Version": "2021-07-28", "Content-Type": "application/json",
                     "Accept": "application/json", "User-Agent": "curl/8.7.1"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.loads(r.read() or b"{}")
    cid = call("POST", "/contacts/upsert", {"locationId": loc, "name": name, "phone": DYLAN_PHONE,
                                             "source": "Internal Lead Alerts",
                                             "tags": ["internal-notify", "do-not-auto-contact"]})["contact"]["id"]
    call("POST", "/conversations/messages", {"type": "SMS", "contactId": cid, "message": text[:600]})


def source_label(src):
    s = (src or "").lower()
    if not s or s == "direct":
        return "direct / typed in"
    if any(k in s for k in ("facebook", "fb", "instagram", "meta")):
        return "Facebook/Instagram" + (" ad" if "ad" in s or "paid" in s else "")
    if "google" in s:
        return "Google" + (" ad" if "ad" in s or "cpc" in s else "")
    if "linkedin" in s:
        return "LinkedIn"
    return s[:60]


def message(d, h):
    site = SITES.get(str(d.get("site") or "cornerstone"), "your site")
    city = unquote(h.get("x-vercel-ip-city") or "")
    region = h.get("x-vercel-ip-country-region") or ""
    country = h.get("x-vercel-ip-country") or ""
    where = ", ".join(x for x in (city, region if country == "US" else country) if x) or "unknown location"
    page = str(d.get("path") or "/")[:80]
    src = source_label(d.get("source"))
    device = "phone" if re.search(r"mobile|iphone|android", h.get("user-agent") or "", re.I) else "computer"
    if d.get("event") == "booked":
        return (f"✅ CALL BOOKED on {site} via Calendly ({str(d.get('where') or '')[:30]}) · from {src} · {where}. "
                f"Check your Calendly email for their name and time.")
    if d.get("event") == "book_click":
        return (f"🔥 Someone clicked BOOK A CALL on {site} ({str(d.get('where') or '')[:30]} button) · "
                f"from {src} · {where} · {device}. Watch Calendly for the booking.")
    return f"👀 New visitor on {site} · from {src} · {where} · {device} · landed on {page}"


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _cors(self):
        origin = self.headers.get("origin") or ""
        if CORS_ORIGIN.match(origin):
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")

    def do_POST(self):
        try:
            n = int(self.headers.get("content-length") or 0)
            d = json.loads(self.rfile.read(n)) if 0 < n < 4000 else {}
        except Exception:
            d = {}
        h = {k.lower(): v for k, v in self.headers.items()}
        event = d.get("event")
        quiet = MODE == "none" or (MODE == "off" and event == "visit")
        if event not in ("visit", "book_click", "booked") or quiet or BOT.search(h.get("user-agent") or "") or not JONES_PIT:
            return self._send(204)
        try:
            sms(message(d, h))
        except Exception:
            pass  # an alert must never break the page
        return self._send(204)

    def _send(self, code):
        self.send_response(code)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()
