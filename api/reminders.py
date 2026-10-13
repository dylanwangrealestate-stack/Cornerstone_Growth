"""Daily client-task reminders -> Dylan only. Vercel Cron 00:40 UTC (08:40 Taiwan).

Source of truth: TASKS in the Cornerstone GHL sub-account, on contacts tagged
`client` (one contact per client, e.g. "Client: Jones Roofing (George &
Nathan)", plus "Agency: Cornerstone (internal)" for Dylan's own items). Adding a
client = add a contact with the `client` tag; adding a reminder = add a task
with a due date in the GHL app. Nothing else to configure.

Text lists OVERDUE, DUE TODAY and the next 3 days (next 7 on Mondays), grouped
by client. Silent when nothing is due. Text to Dylan's phone (via the Jones
number until Cornerstone has its own, SMS_ROUTE) plus an email copy.
"""
import datetime
import json
import os
import urllib.request
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

API = "https://services.leadconnectorhq.com"
LOCATION_ID = "xHennr0QkEeyzjr3Xe6N"
PIT = os.environ.get("CS_GHL_PIT", "")
SMS_ROUTE = os.environ.get("SMS_ROUTE", "jones")
JONES_PIT = os.environ.get("JONES_GHL_PIT", "")
JONES_LOCATION_ID = "1IkAL5w7YF1gVQX955vZ"
TPE = datetime.timezone(datetime.timedelta(hours=8))  # Dylan's clock
DYLAN = {"name": "Daily Report - Dylan (internal)", "phone": "+14077430525",
         "email": "dylan.cornerstonegrowth@gmail.com"}


def req(pit, method, path, body=None):
    r = urllib.request.Request(
        API + path, data=json.dumps(body).encode() if body is not None else None, method=method,
        headers={"Authorization": f"Bearer {pit}", "Version": "2021-07-28", "Content-Type": "application/json",
                 "Accept": "application/json", "User-Agent": "curl/8.7.1"})
    with urllib.request.urlopen(r, timeout=25) as x:
        raw = x.read()
        return json.loads(raw) if raw else {}


def client_label(c):
    name = c.get("contactName") or " ".join(x for x in (c.get("firstName"), c.get("lastName")) if x) or "Client"
    for prefix in ("client: ", "agency: "):
        if name.lower().startswith(prefix):
            name = name[len(prefix):]
    return name.strip().title() if name == name.lower() else name.strip()


def collect(now):
    today = now.astimezone(TPE).date()
    horizon = 7 if today.weekday() == 0 else 3
    clients, page = [], 1
    while True:  # server-side tag filter + paging, so clients are found however big the CRM gets
        got = req(PIT, "POST", "/contacts/search", {"locationId": LOCATION_ID, "pageLimit": 100, "page": page,
                  "filters": [{"field": "tags", "operator": "contains", "value": "client"}]}).get("contacts", [])
        clients += [c for c in got if "client" in (c.get("tags") or [])]
        if len(got) < 100:
            break
        page += 1
    over, due, soon = [], [], []
    for c in clients:
        label = client_label(c)
        for t in req(PIT, "GET", f"/contacts/{c['id']}/tasks").get("tasks", []):
            if t.get("completed") or not t.get("dueDate"):
                continue
            d = datetime.datetime.fromisoformat(t["dueDate"].replace("Z", "+00:00")).astimezone(TPE).date()
            row = (d, label, t.get("title") or "(untitled task)")
            if d < today:
                over.append(row)
            elif d == today:
                due.append(row)
            elif (d - today).days <= horizon:
                soon.append(row)
    return today, horizon, sorted(over), sorted(due), sorted(soon)


def render(today, horizon, over, due, soon):
    if not (over or due or soon):
        return None
    lines = [f"CLIENT TASKS ({today:%a %-d %b})"]
    if over:
        lines.append(f"OVERDUE ({len(over)}):")
        lines += [f"- {label}: {title} (was {d:%-d %b})" for d, label, title in over]
    if due:
        lines.append(f"DUE TODAY ({len(due)}):")
        lines += [f"- {label}: {title}" for d, label, title in due]
    if soon:
        lines.append(f"NEXT {horizon} DAYS:")
        lines += [f"- {d:%a %-d}: {label}: {title}" for d, label, title in soon]
    lines.append("Mark done in GHL (Cornerstone > Contacts > client > Tasks).")
    return "\n".join(lines)


def deliver(text):
    """Text to Dylan's phone, plus an email copy as a searchable backup."""
    sent = []
    try:
        if SMS_ROUTE == "cornerstone":
            cid = req(PIT, "POST", "/contacts/upsert", {"locationId": LOCATION_ID, "name": DYLAN["name"],
                      "phone": DYLAN["phone"], "source": "Internal Reports",
                      "tags": ["internal-notify", "do-not-auto-contact"]})["contact"]["id"]
            req(PIT, "POST", "/conversations/messages", {"type": "SMS", "contactId": cid, "message": text[:1500]})
        elif JONES_PIT:
            cid = req(JONES_PIT, "POST", "/contacts/upsert", {"locationId": JONES_LOCATION_ID,
                      "name": "lead alerts - dylan (internal)", "phone": DYLAN["phone"],
                      "source": "Internal Lead Alerts", "tags": ["internal-notify", "do-not-auto-contact"]})["contact"]["id"]
            req(JONES_PIT, "POST", "/conversations/messages", {"type": "SMS", "contactId": cid, "message": text[:1500]})
        if SMS_ROUTE == "cornerstone" or JONES_PIT:
            sent.append("sms")
    except Exception:
        pass
    try:
        cid = req(PIT, "POST", "/contacts/upsert", {"locationId": LOCATION_ID, "name": DYLAN["name"], "phone": DYLAN["phone"],
                  "email": DYLAN["email"], "source": "Internal Reports",
                  "tags": ["internal-notify", "do-not-auto-contact"]})["contact"]["id"]
        req(PIT, "POST", "/conversations/messages", {"type": "Email", "contactId": cid, "emailTo": DYLAN["email"],
            "subject": text.split("\n", 1)[0].title(),
            "html": "<pre style='font-family:-apple-system,Arial,sans-serif;font-size:15px;white-space:pre-wrap'>"
                    + text.replace("&", "&amp;").replace("<", "&lt;") + "</pre>"})
        sent.append("email")
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
        text = render(*collect(datetime.datetime.now(datetime.timezone.utc)))
        if not text:
            return self._send(200, {"sent": [], "report": "nothing due"})
        return self._send(200, {"sent": deliver(text), "report": text})

    def _send(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
