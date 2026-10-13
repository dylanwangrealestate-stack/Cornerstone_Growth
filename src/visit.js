// Visitor + "Book a Call" alerts (texts Dylan via /api/visit).
//
// A visit is reported at most once per visitor per day; book-call clicks every
// time. Dylan's own browser is excluded: open the site once with ?me=1 to mark
// this device as his (?me=0 undoes it). Nothing personal is sent: page, where
// the visit came from, and a site name. Location comes from Vercel's edge.

const ENDPOINT = 'https://cornerstone-gr0wth.vercel.app/api/visit'

function store(fn) { try { return fn(window.localStorage) } catch { return null } }

function isMe() {
  const p = new URLSearchParams(window.location.search).get('me')
  if (p === '1') store((s) => s.setItem('cg_me', '1'))
  if (p === '0') store((s) => s.removeItem('cg_me'))
  return store((s) => s.getItem('cg_me')) === '1'
}

export function source() {
  const q = new URLSearchParams(window.location.search)
  if (q.get('utm_source')) return `${q.get('utm_source')}${q.get('utm_medium') ? ' ' + q.get('utm_medium') : ''}`
  if (q.get('fbclid')) return 'facebook ad'
  if (q.get('gclid')) return 'google ad'
  try {
    const r = document.referrer && new URL(document.referrer).hostname
    if (r && r !== window.location.hostname) return r.replace(/^www\./, '')
  } catch { /* bad referrer */ }
  return 'direct'
}

function send(body) {
  const data = JSON.stringify(body)
  // text/plain keeps it a "simple" request (no CORS preflight) and lets
  // sendBeacon deliver it even while the page is unloading.
  try {
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([data], { type: 'text/plain' }))) return
  } catch { /* fall through */ }
  fetch(ENDPOINT, { method: 'POST', body: data, headers: { 'Content-Type': 'text/plain' }, keepalive: true }).catch(() => {})
}

export function reportVisit(site = 'cornerstone') {
  if (isMe() || navigator.webdriver) return
  const today = new Date().toISOString().slice(0, 10)
  if (store((s) => s.getItem('cg_visit_day')) === today) return
  store((s) => s.setItem('cg_visit_day', today))
  send({ event: 'visit', site, path: window.location.pathname, source: source() })
}

export function reportBookClick(where, site = 'cornerstone') {
  if (isMe()) return
  send({ event: 'book_click', site, where, path: window.location.pathname, source: source() })
}

export function reportBooked(where, site = 'cornerstone') {
  send({ event: 'booked', site, where, path: window.location.pathname, source: source() })
}
