"""Lodeline lead follow-up reminders -> Dylan only. Vercel Cron 12:30 UTC
(20:30 Taiwan = 08:30 US Eastern, the start of the contractor's working day).

Same idea as the Jones website reminders: every lead tagged `lodeline-lead`
(api/lead.py adds it) gets a fixed touch cadence, and on each due day Dylan
gets one text naming the lead, what to do, and a ready-to-send line. Nothing is
sent to the lead. After a step is texted the lead is tagged fu-d{N}, so a step
is never repeated; a step missed by a failed run is caught up to CATCHUP_DAYS
late. Tag a lead followup-done / booked / won / lost / not-interested in GHL
and the reminders stop.

B2B tone: the lines are short professional emails or call notes, never
"reply X" hooks.
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
DYLAN = {"name": "Daily Report - Dylan (internal)", "phone": "+14077430525",
         "email": "dylan.cornerstonegrowth@gmail.com"}
LEAD_TAG = os.environ.get("FOLLOWUP_TAG", "lodeline-lead")
# New leads only: anything created before this instant is ignored.
SINCE = os.environ.get("FOLLOWUP_SINCE", "2026-10-13T00:00:00Z")

CADENCE = {
    0: ("New lead: email + call today",
        "Suggested email: Dear {first}, thank you for contacting Lodeline. I would welcome 20 minutes to understand "
        "which of your parts are in scope for DFARS 252.225-7052. Would {day} or the following morning suit you?"),
    1: ("Call (US business hours)",
        "Call notes: confirm what they supply, which primes have asked about 7052, and offer the readiness call."),
    3: ("Follow-up email",
        "Suggested email: Dear {first}, following up on your enquiry. I can send a short outline of what a pilot trace "
        "would cover for your highest-risk parts. Would that be useful?"),
    7: ("Call + email",
        "Suggested email: Dear {first}, with the 1 January 2027 deadline approaching, I wanted to check whether a brief "
        "call would still be helpful. I am happy to work around your schedule."),
    14: ("Check-in email",
         "Suggested email: Dear {first}, could you point me to the right person on your team for supplier "
         "compliance questions? I would be glad to send them our readiness overview."),
    21: ("Final email",
         "Suggested email: Dear {first}, I will close out your enquiry for now. Should DFARS 7052 come up with a prime, "
         "please get in touch and we can pick up where we left off."),
    30: ("Close out in GHL",
         "Tag the contact booked / won / lost / followup-done in Cornerstone GHL."),
}
CATCHUP_DAYS = 2
STEP_TAG = "fu-d{}"
STOP_TAGS = frozenset({"followup-done", "booked", "appointment-booked", "won", "lost",
                       "not-interested", "do-not-contact"})
CLOSED_OPP = frozenset({"won", "lost", "abandoned"})
SMS_LIMIT = 1400

try:
    from zoneinfo import ZoneInfo
    ET = ZoneInfo("America/New_York")
except Exception:  # no tzdata on the runtime
    ET = datetime.timezone(datetime.timedelta(hours=-5))


def req(pit, method, path, body=None):
    r = urllib.request.Request(
        API + path, data=json.dumps(body).encode() if body is not None else None, method=method,
        headers={"Authorization": f"Bearer {pit}", "Version": "2021-07-28", "Content-Type": "application/json",
                 "Accept": "application/json", "User-Agent": "curl/8.7.1"})
    with urllib.request.urlopen(r, timeout=25) as x:
        raw = x.read()
        return json.loads(raw) if raw else {}


def parse(iso):
    try:
        return datetime.datetime.fromisoformat(str(iso).replace("Z", "+00:00"))
    except ValueError:
        return None


def due_step(c, today, since=None):
    """(day, step) due today for this lead, or None."""
    added, cut = parse(c.get("dateAdded")), parse(since or SINCE)
    if not added or not cut or added < cut:
        return None
    tags = set(c.get("tags") or [])
    if tags & STOP_TAGS or any((o or {}).get("status") in CLOSED_OPP for o in (c.get("opportunities") or [])):
        return None
    age = (today - added.astimezone(ET).date()).days
    passed = [d for d in CADENCE if 0 <= d <= age]
    if not passed or age > max(CADENCE) + CATCHUP_DAYS:
        return None
    day = max(passed)  # older unsent steps are superseded by the latest one
    if STEP_TAG.format(day) in tags or age - day > CATCHUP_DAYS:
        return None
    return day, CADENCE[day][0]


def first_name(c):
    return (c.get("firstName") or (c.get("contactName") or "there").split(" ")[0] or "there").strip().title()


def block(i, day, step, c, today):
    name = c.get("contactName") or " ".join(x for x in (c.get("firstName"), c.get("lastName")) if x) or "Lead"
    tomorrow = today + datetime.timedelta(days=1)
    lines = [f"{i}. {name.title() if name == name.lower() else name}"
             + (f" ({c['companyName']})" if c.get("companyName") else "") + f" - Day {day}: {step}"]
    if c.get("phone"):
        lines.append(f"   Phone: {c['phone']}")
    if c.get("email"):
        lines.append(f"   Email: {c['email']}")
    lines.append("   " + CADENCE[day][1].format(first=first_name(c), day=f"{tomorrow:%A}"))
    return "\n".join(lines)


def digest(due, today):
    head = f"LODELINE FOLLOW-UPS ({today:%a %-d %b}, {len(due)} due)"
    foot = "Stop a lead: tag followup-done / booked / lost in Cornerstone GHL."
    texts, cur = [], head
    for i, (day, step, c) in enumerate(due, 1):
        b = block(i, day, step, c, today)
        if len(cur) + len(b) + 2 > SMS_LIMIT:
            texts.append(cur)
            cur = head + " (cont.)"
        cur += "\n\n" + b
    texts.append(cur + "\n\n" + foot)
    return texts


def leads():
    out, page = [], 1
    while True:
        got = req(PIT, "POST", "/contacts/search", {"locationId": LOCATION_ID, "pageLimit": 100, "page": page,
                  "filters": [{"field": "tags", "operator": "contains", "value": LEAD_TAG}]}).get("contacts", [])
        out += [c for c in got if LEAD_TAG in (c.get("tags") or [])]
        if len(got) < 100:
            break
        page += 1
    return out


def sms(text):
    if SMS_ROUTE == "cornerstone":
        pit, loc, name, source = PIT, LOCATION_ID, DYLAN["name"], "Internal Reports"
    elif JONES_PIT:
        pit, loc, name, source = JONES_PIT, JONES_LOCATION_ID, "lead alerts - dylan (internal)", "Internal Lead Alerts"
    else:
        raise RuntimeError("no SMS route")
    cid = req(pit, "POST", "/contacts/upsert", {"locationId": loc, "name": name, "phone": DYLAN["phone"],
              "source": source, "tags": ["internal-notify", "do-not-auto-contact"]})["contact"]["id"]
    req(pit, "POST", "/conversations/messages", {"type": "SMS", "contactId": cid, "message": text[:1500]})


def email(text):
    cid = req(PIT, "POST", "/contacts/upsert", {"locationId": LOCATION_ID, "name": DYLAN["name"], "phone": DYLAN["phone"],
              "email": DYLAN["email"], "source": "Internal Reports",
              "tags": ["internal-notify", "do-not-auto-contact"]})["contact"]["id"]
    req(PIT, "POST", "/conversations/messages", {"type": "Email", "contactId": cid, "emailTo": DYLAN["email"],
        "subject": text.split("\n", 1)[0].title(),
        "html": "<pre style='font-family:-apple-system,Arial,sans-serif;font-size:15px;white-space:pre-wrap'>"
                + text.replace("&", "&amp;").replace("<", "&lt;") + "</pre>"})


def run(now, dry=False):
    today = now.astimezone(ET).date()
    due = []
    for c in leads():
        hit = due_step(c, today)
        if hit:
            due.append((hit[0], hit[1], c))
    due.sort(key=lambda x: x[0])
    if not due:
        return {"sent": [], "report": "nothing due"}
    texts = digest(due, today)
    if dry:
        return {"sent": [], "report": texts, "dry": True}
    sent = []
    try:
        for t in texts:
            sms(t)
        sent.append("sms")
    except Exception as e:
        sent.append(f"sms-failed:{type(e).__name__}")
    try:
        email("\n\n".join(texts))
        sent.append("email")
    except Exception:
        pass
    if any(s in ("sms", "email") for s in sent):  # tag only once Dylan has it; else retry tomorrow
        for day, _, c in due:
            try:
                req(PIT, "POST", f"/contacts/{c['id']}/tags", {"tags": [STEP_TAG.format(day)]})
            except Exception:
                pass
    return {"sent": sent, "report": texts}


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self._run()

    def do_POST(self):
        self._run()

    def _run(self):
        secret = os.environ.get("CRON_SECRET")
        auth = self.headers.get("authorization") or ""
        q = parse_qs(urlparse(self.path).query)
        if not secret or (auth != f"Bearer {secret}" and q.get("key", [""])[0] != secret):
            return self._send(401, {"error": "Unauthorized"})
        if not PIT:
            return self._send(503, {"error": "CS_GHL_PIT not set"})
        return self._send(200, run(datetime.datetime.now(datetime.timezone.utc), dry=q.get("dry", [""])[0] == "1"))

    def _send(self, code, body):
        data = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)
