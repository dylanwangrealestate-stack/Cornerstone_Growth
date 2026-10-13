"""POST /api/lead — copy every Cornerstone website form fill into the Cornerstone
GHL sub-account and alert Dylan right away.

The form still emails through Web3Forms as before; this runs alongside it, so a
lead lands in the CRM (tag website-lead) where the daily report can count and
name it. Alerts go to Dylan only: email now, SMS too once the sub-account has a
phone number (GHL rejects SMS until then; we just try).

Lodeline (lodeline.vercel.app, Dylan's rare-earth compliance site) posts here
too with site="lodeline": same sub-account, tagged lodeline-lead, which is what
api/followup.py builds Dylan's follow-up reminders from.
"""
import json
import os
import re
import urllib.request
from http.server import BaseHTTPRequestHandler

# Browsers on these origins may POST cross-site (the Lodeline form).
CORS_ORIGIN = re.compile(r"^https://(lodeline\.vercel\.app|lodeline-[a-z0-9-]+-dylan-wang-s-projects1\.vercel\.app"
                         r"|(www\.)?lodeline\.[a-z]{2,10})$")
SITES = {
    "lodeline": {"label": "LODELINE", "source": "Lodeline Website Form", "tags": ["website-lead", "lodeline-lead"],
                 "where": "lodeline.vercel.app form"},
}

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


def dylan_contact():
    r = ghl("POST", "/contacts/upsert", {"locationId": LOCATION_ID, "name": DYLAN["name"], "phone": DYLAN["phone"],
                                          "email": DYLAN["email"], "source": "Internal Reports",
                                          "tags": ["internal-notify", "do-not-auto-contact"]})
    return r["contact"]["id"]


def notify_dylan(subject, text):
    cid = dylan_contact()
    sent = []
    for kind, payload in (
        ("sms", {"type": "SMS", "contactId": cid, "message": text}) if SMS_ROUTE == "cornerstone" else ("sms-via-jones", None),
        ("email", {"type": "Email", "contactId": cid, "emailTo": DYLAN["email"], "subject": subject,
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
        except Exception:  # SMS fails until the sub-account owns a number
            pass
    return sent


def is_spam(d):
    name = str(d.get("name") or "")
    if d.get("botcheck"):
        return True
    if not (d.get("email") or d.get("phone")):
        return True
    if len(name) >= 8 and not re.search(r"[aeiouy]", name, re.I):
        return True
    if re.search(r"https?://|www\.", str(d.get("message") or ""), re.I):
        return True
    return bool(re.search(r"\b(seo|backlinks?|guest post|web design services|lead generation services)\b",
                          json.dumps(d), re.I))


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")
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
            if n <= 0 or n > 20000:
                return self._send(400, {"error": "bad length"})
            d = json.loads(self.rfile.read(n))
        except Exception:
            return self._send(400, {"error": "bad body"})
        if not PIT:
            return self._send(503, {"error": "not configured"})
        if is_spam(d):
            return self._send(200, {"ok": True})  # bots don't learn what tripped them
        site = SITES.get(str(d.get("site") or "").lower())
        payload = {"locationId": LOCATION_ID, "name": str(d.get("name") or "Website lead")[:100],
                   "source": site["source"] if site else "Cornerstone Website Form",
                   "tags": site["tags"] if site else ["website-lead"]}
        if d.get("email"):
            payload["email"] = str(d["email"])[:200]
        if d.get("phone"):
            payload["phone"] = str(d["phone"])[:40]
        if d.get("company"):
            payload["companyName"] = str(d["company"])[:200]
        fields = [("Company", "company"), ("Revenue", "revenue"), ("Avg project value", "projectValue"),
                  ("Call volume", "callVolume"), ("Est. monthly loss", "estimatedMonthlyLoss"),
                  ("Services", "services"), ("Supplies", "supplies"), ("Message", "message")]
        lines = [f"{label}: {str(d.get(k))[:500]}" for label, k in fields if d.get(k)]
        try:
            cid = ghl("POST", "/contacts/upsert", payload)["contact"]["id"]
            if lines:
                ghl("POST", f"/contacts/{cid}/notes", {"body": f"{payload['source']}\n" + "\n".join(lines)})
        except Exception as e:  # still alert Dylan even if the CRM write failed
            lines.append(f"(CRM save failed: {type(e).__name__})")
        label = site["label"] if site else "CORNERSTONE"
        alert = "\n".join([f"NEW {label} LEAD: {payload['name']}",
                           f"Phone: {d.get('phone') or '-'}", f"Email: {d.get('email') or '-'}"] + lines
                          + [f"Source: {site['where'] if site else 'cornerstonegrowth.us form'}"])
        sent = notify_dylan(f"New {label.title()} lead: {payload['name']}", alert)
        return self._send(200, {"ok": True, "alerted": sent})

    def _send(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self._cors()
        self.end_headers()
        self.wfile.write(data)
