import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight, ArrowRight, Phone, Menu, X, CalendarCheck, ShieldCheck, Clock, CheckCircle2, Mail, MapPin,
  Activity, Settings, FileText, Star, Zap, Megaphone, PhoneCall, MessageSquare, RefreshCw,
  Globe, BellRing, UserCheck, BarChart3, Handshake, Landmark, MapPinned, Target, CalendarClock, TrendingUp,
} from 'lucide-react'
import './cg.css'
import { reportVisit, reportBookClick, reportBooked } from './visit'

/* Cornerstone Growth, 2026-10-13 redesign.
 * Same outline as the Jones site: photo hero under a floating frosted-glass
 * pill nav, light sections with rounded white photo cards and numbered mono
 * labels, dark glass sections for contrast. All copy, the ROI calculator and
 * the contact pipeline (Web3Forms email + /api/lead CRM save and text alert)
 * are unchanged from the previous version (git e5f738e). */

// Self-hosted and compressed (were hot-linked from Unsplash at full size).
const IMG = { hero: '/img/hero.jpg', meet: '/img/meet.jpg', ai: '/img/ai.jpg', site: '/img/site.jpg' }

export const BOOK_URL = 'https://calendly.com/dylanwang-cornerstonegrowth/30min'
/** Count a booking click as a conversion (Vercel Analytics -> Events). */
/** Count a booking click as a conversion (Vercel Analytics, Meta Pixel if set) and text Dylan. */
export const pixel = (...args) => { try { if (window.fbq) window.fbq(...args) } catch { /* pixel optional */ } }
export const trackBook = (where) => {
  try { if (window.va) window.va('event', { name: 'Book call click', data: { where } }) } catch { /* analytics optional */ }
  pixel('track', 'Contact', { content_name: where })
  reportBookClick(where)
}
export function BookLink({ where, className = 'btn btn-lg', children }) {
  return <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" className={className} onClick={() => trackBook(where)}>{children}</a>
}

const NAV_LINKS = [
  { label: 'Results', href: '#results' },
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Process', href: '#process' },
  { label: 'Includes', href: '#included' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

// What Cornerstone runs, grouped by job. `live` = running for Jones Roofing today.
const SERVICE_GROUPS = [
  {
    name: 'Lead generation', blurb: 'Fill the pipeline with homeowners who need a roof.',
    items: [
      { icon: Megaphone, title: 'Facebook & Instagram Lead Ads', text: 'Campaigns built for your service area: creative, offers, targeting and qualifying lead forms. Rebuilt, they cut Jones\'s cost per lead from $76 to $12.', live: true },
      { icon: Globe, title: 'Conversion Website', text: 'A fast, professional site with a qualifying form that matches your ads, so every click lands on the offer it came from.', live: true },
      { icon: Star, title: 'Google Reviews & Business Profile', text: 'Review requests after every job and a complete Google Business Profile. Jones went from 2 to 6 five-star reviews.', live: true },
      { icon: Target, title: 'Retargeting', text: 'Stay in front of homeowners who visited your site or opened a form but didn\'t finish, with your approved offers.' },
    ],
  },
  {
    name: 'Speed-to-lead & follow-up', blurb: 'Make sure no lead goes cold.',
    items: [
      { icon: BellRing, title: 'Instant Lead Alerts', text: 'Every Facebook and website lead texted to the owners in seconds with the full form details, around the clock.', live: true },
      { icon: UserCheck, title: 'Lead Screening', text: 'Homeowner, roof issue, timeline and best time to call captured up front; renters flagged before they waste a trip.', live: true },
      { icon: CalendarClock, title: 'Follow-Up Reminders & CRM', text: 'A pipeline for every lead and daily reminders of who to call next, from day 0 to day 30, until each lead is won or closed out.', live: true },
      { icon: RefreshCw, title: 'Lead Re-Engagement', text: 'We call the leads everyone wrote off. On Jones\'s August list, 3 of 13 "dead" leads picked up.', live: true },
      { icon: PhoneCall, title: 'AI Voice Receptionist', text: 'Answers every inbound call 24/7, qualifies the lead and books the estimate on your calendar. No voicemail. No missed jobs.' },
      { icon: MessageSquare, title: 'Missed Call Text-Back', text: 'An instant text to any caller you missed, before they call the next contractor on the list.' },
      { icon: FileText, title: 'Quote Follow-Up Agent', text: 'Automatically follows up on every estimate that goes cold, turning dead quotes into booked jobs.' },
      { icon: BarChart3, title: 'Ad & Website Reports', text: 'Spend, leads, cost per lead and site visits sent to your phone, so you always know what the money is doing.', live: true },
    ],
  },
  {
    name: 'New growth add-ons', blurb: 'Bigger jobs and channels beyond Facebook.',
    items: [
      { icon: CalendarCheck, title: 'Appointment Setting', text: 'We call every lead, qualify them and book the inspection on your calendar. You just show up and close.', isNew: true },
      { icon: Handshake, title: 'Realtor & Title Partner Network', text: 'Outreach to listing agents, title offices and inspectors who need a roofer for fast, insurance-ready roof reports. Partner jobs are bigger and repeat.', isNew: true },
      { icon: Landmark, title: 'Grant-Program Marketing', text: 'Compliant marketing for Florida\'s My Safe Florida Home program, where homeowners choose their own licensed contractor. No "free roof" claims.', isNew: true },
      { icon: MapPinned, title: 'Google Local Services Ads', text: 'Show up at the top of Google with the "Google Guaranteed" style listing homeowners call first, alongside your Business Profile.', isNew: true },
    ],
  },
]

// ─── reveal on scroll (content stays visible if JS or the observer is missing) ─
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.cg .rv')
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(el) })
    return () => io.disconnect()
  }, [])
}

function CountUp({ end, duration = 1400 }) {
  const [v, setV] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    let started = false
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return
      started = true
      const t0 = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / duration)
        setV(Math.round(end * (1 - (1 - t) ** 3)))
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [end, duration])
  return <span ref={ref}>{v}</span>
}

// ─── live widgets ──────────────────────────────────────────────────────────────
function PipelineWidget() {
  const [p, setP] = useState(0)
  useEffect(() => { const id = setInterval(() => setP((x) => (x + 1) % 4), 2200); return () => clearInterval(id) }, [])
  const phases = [
    { step: '01', label: 'Ad Seen', sub: 'Mike D. · Storm damage · Dallas, TX', detail: 'Lead filling form…' },
    { step: '02', label: 'Lead Captured', sub: 'Form submitted · 11:42am', detail: 'Calling back now…' },
    { step: '03', label: 'AI Connected', sub: 'Called back in 28s · Qualifying', detail: 'Booking estimate…' },
    { step: '04', label: 'Estimate Set', sub: 'Thu 10am · confirmed', detail: 'Calendar updated ✓' },
  ]
  const done = p === 3
  const c = done ? '#22c55e' : '#5c93f5'
  return (
    <div className="widget">
      <div className="wh"><span>Lead pipeline</span><span>Live</span></div>
      <div className="body" key={p}>
        <div className="step" style={{ background: done ? 'rgba(34,197,94,.15)' : 'rgba(47,111,235,.18)', color: c }}>{phases[p].step}</div>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>{phases[p].label}</div>
          <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.5)', marginTop: 2 }}>{phases[p].sub}</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '.62rem', color: c, marginTop: 4 }}>{phases[p].detail}</div>
        </div>
      </div>
      <div className="dots">{phases.map((_, i) => <i key={i} style={i === p ? { width: 24, background: c } : undefined} />)}</div>
    </div>
  )
}

function StatWidget() {
  const stats = [
    { value: '21', suffix: '', label: 'Homeowner leads in one Jones Roofing campaign', color: '#5c93f5' },
    { value: '$11.97', suffix: '', label: 'Cost per lead, down 84% from the first campaign', color: '#22c55e' },
    { value: '6', suffix: '★', label: 'Five-star Google reviews, up from 2', color: '#f5b84d' },
  ]
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % 3), 3000); return () => clearInterval(id) }, [])
  const s = stats[i]
  return (
    <div className="widget">
      <div className="wh"><span>Jones Roofing results</span><span>{i + 1}/3</span></div>
      <div className="stat" key={i}><b style={{ color: s.color }}>{s.value}{s.suffix}</b><span>{s.label}</span></div>
      <div className="dots" style={{ justifyContent: 'center' }}>{stats.map((_, k) => <i key={k} style={k === i ? { width: 24, background: s.color } : undefined} />)}</div>
    </div>
  )
}

function SchedulerWidget() {
  const [step, setStep] = useState(0)
  useEffect(() => { const id = setInterval(() => setStep((x) => (x + 1) % 5), 1300); return () => clearInterval(id) }, [])
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const slots = ['9am', '11am', '2pm']
  return (
    <div className="widget">
      <div className="wh"><span>Estimate scheduler</span><span style={{ color: step >= 3 ? '#86efac' : undefined }}>{step >= 3 ? 'Booked' : 'Finding slot'}</span></div>
      <div className="sched">
        {days.map((d, di) => (
          <div className="d" key={d}>
            <span>{d}</span>
            {slots.map((s, si) => {
              const t = di === 3 && si === 0
              const cls = t && step >= 3 ? 's done' : t && step >= 1 ? 's cur' : 's'
              return <div key={s} className={cls}>{t && step >= 3 ? '✓' : s}</div>
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function LiveFeed() {
  const feeds = [
    'New roofing lead — hail damage — estimate booked in 28s',
    'Facebook ad → lead in → called back in 22 seconds',
    'New lead — full reroof — $14K job scheduled Thu 9am',
    'Storm surge — 4 new leads in 90 minutes — all qualified',
  ]
  const [i, setI] = useState(0)
  useEffect(() => { const id = setInterval(() => setI((x) => (x + 1) % feeds.length), 3500); return () => clearInterval(id) }, [])
  return (
    <div className="cg-feed glass">
      <div className="mono"><span className="dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Live activity · example</div>
      <p key={i}>{feeds[i]}</p>
    </div>
  )
}

// ─── nav ───────────────────────────────────────────────────────────────────────
function Navbar() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const h = () => setSolid(window.scrollY > window.innerHeight * 0.6)
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  return (
    <>
      <header className={`cg-nav${solid || open ? ' solid' : ''}`}>
        <div className="pill">
          <a href="#home" className="logo" aria-label="Cornerstone Growth home"><img src="/cornerstone_growth_logo.png" alt="Cornerstone Growth" /></a>
          <nav className="links" aria-label="Main">{NAV_LINKS.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}</nav>
          <BookLink where="nav" className="btn cta">Book a Call <ArrowUpRight /></BookLink>
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>
      {open && (
        <div className="cg-sheet" onClick={(e) => { if (e.target.closest('a')) setOpen(false) }}>
          <nav>{NAV_LINKS.map((l, i) => <a key={l.label} href={l.href}><span>0{i + 1}</span>{l.label}</a>)}</nav>
          <BookLink where="menu" className="btn btn-lg btn-block">Book a Free Strategy Call <ArrowUpRight /></BookLink>
        </div>
      )}
    </>
  )
}

// ─── hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section id="home" className="cg-hero">
      <div className="bg" role="img" aria-label="Roofing crew on a job site" />
      <div className="shade" />
      <div className="wrap in">
        <div>
          <p className="eyebrow">FOR ROOFING CONTRACTORS · FACEBOOK ADS + INSTANT FOLLOW-UP</p>
          <h1>More qualified<br />roofing jobs.<br /><em>Zero cold outreach.</em></h1>
          <p className="lead">We run targeted Facebook ads, text you every lead in seconds and follow up until it's booked — <b>so you're the first roofer they talk to, not the fourth.</b></p>
          <div className="ctas">
            <BookLink where="hero">Book a Free Strategy Call <ArrowRight /></BookLink>
            <a href="#results" className="btn btn-lg btn-glass">See the results</a>
          </div>
          <p className="hero-risk"><ShieldCheck size={15} /> Free call · No contracts · Exclusive leads, never shared</p>
          <a href="#results" className="proof glass">
            <div><b>21</b><small>leads in one campaign</small></div>
            <div><b>$11.97</b><small>per lead</small></div>
            <div><b>84%</b><small>lower cost per lead</small></div>
            <span className="proof-src">Jones Roofing Solutions · Central Florida · Meta Ads Manager</span>
          </a>
        </div>
        <div>
          <div className="cg-lead glass">
            <div className="row"><span className="dot" /><span className="mono" style={{ color: '#86efac' }}>New Facebook lead · example</span><span className="mono" style={{ marginLeft: 'auto' }}>30 sec ago</span></div>
            <p className="who">Mike D.</p>
            <p className="what">Hail damage · Full reroof · Dallas, TX</p>
            <ul>{['Called back in 28 seconds', 'Lead qualified', 'Estimate booked Thu 2pm'].map((t) => <li key={t}><CheckCircle2 />{t}</li>)}</ul>
            <span className="badge">● Before a competitor ever called</span>
          </div>
          <LiveFeed />
        </div>
      </div>
      <a href="#what" className="cg-scroll" aria-label="Scroll down"><span>SCROLL</span><i /></a>
    </section>
  )
}

// ─── Calendly inline ───────────────────────────────────────────────────────────
// Booking without leaving the page. Calendly posts a message when a call is
// scheduled: count it everywhere and text Dylan straight away.
export function CalendlyInline({ where = 'inline', height = 700 }) {
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== 'https://calendly.com' || !e.data || e.data.event !== 'calendly.event_scheduled') return
      try { if (window.va) window.va('event', { name: 'Call booked', data: { where } }) } catch { /* optional */ }
      pixel('track', 'Schedule', { content_name: where })
      reportBooked(where)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [where])
  const src = `${BOOK_URL}?embed_domain=${encodeURIComponent(window.location.hostname)}&embed_type=Inline&hide_gdpr_banner=1&background_color=ffffff&primary_color=2f6feb`
  return (
    <div className="cal-wrap">
      <iframe title="Book a free strategy call" src={src} style={{ height }} loading="lazy" />
    </div>
  )
}

// ─── lead magnet: free missed-lead audit ───────────────────────────────────────
function LeadMagnet() {
  const [state, setState] = useState('idle')
  const submit = async (e) => {
    e.preventDefault()
    const f = e.target
    if (f.botcheck.checked) return
    setState('sending')
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        name: f.name.value, email: f.email.value, phone: f.phone.value, company: f.company.value,
        message: 'Requested: FREE MISSED-LEAD AUDIT (send within 1 business day)', botcheck: '' }) })
      if (!r.ok) throw new Error()
      pixel('track', 'Lead', { content_name: 'audit' })
      try { if (window.va) window.va('event', { name: 'Audit requested' }) } catch { /* optional */ }
      setState('sent')
    } catch { setState('error') }
  }
  return (
    <section className="cg-sec cg-light alt" id="audit">
      <div className="wrap">
        <div className="audit glass-light rv">
          <div>
            <p className="kicker">/ Not ready to talk yet?</p>
            <h2 className="display" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)' }}>Get a free<br /><em>missed-lead audit.</em></h2>
            <p>We'll check how fast your business answers a new lead, what your Google profile and site show a homeowner, and where jobs are slipping. You get a short written report within one business day. No call required.</p>
          </div>
          {state === 'sent' ? (
            <div className="audit-done"><CheckCircle2 size={40} color="#2f6feb" /><h3>Request received.</h3><p>Your audit will land in your inbox within one business day.</p></div>
          ) : (
            <form className="audit-form" onSubmit={submit}>
              <input type="checkbox" name="botcheck" style={{ display: 'none' }} tabIndex={-1} />
              <input name="name" required placeholder="Your name" autoComplete="name" />
              <input name="company" required placeholder="Company" autoComplete="organization" />
              <input name="email" type="email" required placeholder="Email" autoComplete="email" />
              <input name="phone" type="tel" placeholder="Phone (optional)" autoComplete="tel" />
              <button className="btn btn-lg btn-block" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : <>Send My Free Audit <ArrowRight /></>}</button>
              {state === 'error' && <p className="audit-err">Something went wrong. Email dylan.cornerstonegrowth@gmail.com and we'll send it.</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── CTA band ──────────────────────────────────────────────────────────────────
function CtaBand({ title, em, sub, where }) {
  return (
    <section className="cta-band">
      <div className="wrap">
        <div className="cta-card glass rv">
          <div>
            <h2 className="display" style={{ margin: 0 }}>{title}<br /><em>{em}</em></h2>
            <p>{sub}</p>
          </div>
          <div className="cta-actions">
            <BookLink where={where}>Book a Free Strategy Call <ArrowRight /></BookLink>
            <span className="hero-risk" style={{ margin: 0 }}><Clock size={15} /> Pick a time in under a minute</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── what we do (photo cards) ──────────────────────────────────────────────────
function WhatWeDo() {
  const cards = [
    { n: '01 / Ads', img: IMG.site, title: 'Facebook Ads That Find the Jobs', sub: 'Hot inbound, not cold lists.', text: 'Targeted ads in your service area reaching homeowners actively looking for roofing work — storm damage, replacements, leaks.', href: '#solution' },
    { n: '02 / Callback', img: IMG.ai, title: '30-Second AI Callback', sub: 'First to call wins.', text: 'The second a lead fills out a form, our AI calls them back — qualifies the job, gets the details, and books the estimate before anyone else picks up.', href: '#solution' },
    { n: '03 / Exclusive', img: IMG.meet, title: 'Your Leads. Only Yours.', sub: 'No bidding wars on your pipeline.', text: "We don't sell the same homeowner to three roofers. Every lead is exclusive to your business.", href: '#faq' },
  ]
  return (
    <section id="what" className="cg-sec cg-light">
      <div className="wrap">
        <p className="kicker">/ What we do</p>
        <h2 className="display rv">Three systems.<br /><em>One full calendar.</em></h2>
        <div className="cards3" style={{ marginTop: 52 }}>
          {cards.map((c) => (
            <a key={c.n} href={c.href} className="pcard rv">
              <div className="top"><span className="mono">{c.n}</span><ArrowUpRight /></div>
              <div className="img"><img src={c.img} alt="" loading="lazy" /></div>
              <h3>{c.title}</h3>
              <p className="sub">{c.sub}</p>
              <p>{c.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── results: Jones case study ──────────────────────────────────────────────────
// Figures from Meta Ads Manager (campaign totals) and Google, 13 Oct 2026.
export function Results() {
  const stats = [
    { n: '01 / Leads', v: '21', lbl: 'Leads in one campaign', d: 'Homeowner leads from the rebuilt September campaign, up from 13 in the first.' },
    { n: '02 / Cost per lead', v: '$11.97', lbl: '84% cheaper per lead', d: 'Down from $76.29 on the first campaign, after rebuilding the creative, offers and form.' },
    { n: '03 / Reviews', v: '3×', lbl: '2 → 6 Google reviews', d: 'All five stars. Social proof homeowners check before they ever call.' },
  ]
  const rows = [
    ['Leads', '13', '21', '+62%'],
    ['Cost per lead', '$76.29', '$11.97', '−84%'],
    ['Ad spend', '$991.78', '$251.47', '−75%'],
    ['People reached', '—', '6,720', ''],
    ['Impressions', '—', '10,091', ''],
  ]
  const built = ['New two-business website', 'Instant lead texts to both owners', 'Renter screening', 'Follow-up reminders, days 0–30', 'Ad + website reports', 'Google review growth', 'Re-engaged 3 of 13 "dead" leads', 'First job won from the ads']
  return (
    <section id="results" className="cg-sec cg-light alt">
      <div className="wrap">
        <div className="split">
          <div><p className="kicker">/ Results · Jones Roofing Solutions</p><h2 className="display rv">Real numbers.<br /><em>From a real roofer.</em></h2></div>
          <p className="lede rv">George and Nathan Jones run Jones Building Contractors and Jones Roofing Solutions in Central Florida. Before Cornerstone, every job came from referrals. Here's what changed.</p>
        </div>

        <div className="ba">
          <article className="ba-card rv">
            <div className="ba-tag before">Before</div>
            <div className="ba-img"><img src="/results/jones-before.jpg" alt="Jones Roofing Solutions previous website (jonesroofingsolutions.com)" loading="lazy" /></div>
            <ul className="ba-list">
              <li className="x">Every job came from referrals</li>
              <li className="x">No paid lead flow, no follow-up system</li>
              <li className="x">2 Google reviews</li>
              <li className="x">Basic one-page website, no lead alerts</li>
            </ul>
            <img className="ba-proof" src="/results/reviews-before.jpg" alt="Google listing showing 2 reviews" loading="lazy" />
          </article>
          <article className="ba-card after rv">
            <div className="ba-tag after">After</div>
            <div className="ba-img"><img src="/results/jones-after.jpg" alt="Jones Building Contractors website built by Cornerstone Growth" loading="lazy" /></div>
            <ul className="ba-list">
              <li className="ok">Steady homeowner leads from Facebook: 21 in one campaign</li>
              <li className="ok">Every lead texted to George and Nathan in seconds</li>
              <li className="ok">6 Google reviews, all five stars</li>
              <li className="ok">New site for both businesses, with a qualifying form</li>
            </ul>
            <img className="ba-proof" src="/results/reviews-after.jpg" alt="Google listing showing 6 reviews" loading="lazy" />
          </article>
        </div>

        <div className="numbers rv" style={{ marginTop: 22 }}>
          {stats.map((x) => (
            <div className="num" key={x.n}>
              <div className="top"><span className="mono">{x.n}</span><i /></div>
              <b className="big" style={{ fontSize: 'clamp(3.6rem, 6vw, 5.4rem)' }}>{x.v}</b>
              <p className="lbl">{x.lbl}</p>
              <p>{x.d}</p>
            </div>
          ))}
        </div>

        <div className="cmp-wrap">
          <div className="cmp rv">
            <div className="cmp-row head"><span>Facebook campaign</span><span>First (Aug)</span><span className="hl">Rebuilt (Sept)</span><span>Change</span></div>
            {rows.map((r) => (
              <div className="cmp-row" key={r[0]}>
                <span>{r[0]}</span><span>{r[1]}</span><span className="hl">{r[2]}</span>
                <span className={r[3] ? 'good' : ''}>{r[3]}</span>
              </div>
            ))}
            <p className="cmp-note"><TrendingUp size={16} /> 62% more leads for 75% less ad spend.</p>
          </div>
          <div className="built rv">
            <p className="mono" style={{ color: 'var(--blue)', marginBottom: 14 }}>What we built for Jones</p>
            <ul className="ticks">{built.map((b) => <li key={b}>{b}</li>)}</ul>
            <a href="https://www.jonesbuildingcontractors.com" target="_blank" rel="noopener noreferrer" className="btn" style={{ marginTop: 22 }}>See the Jones website <ArrowUpRight /></a>
          </div>
        </div>
        <p className="src-note">Figures from Meta Ads Manager campaign totals and Google Business Profile, 13 October 2026. Leads are form leads as reported by Meta. Results depend on your market, offers and follow-up.</p>
      </div>
    </section>
  )
}

// ─── problem ───────────────────────────────────────────────────────────────────
export function Problem() {
  const rows = [
    { t: '7:04am', text: "You're on a roof. Phone buzzes — homeowner saw hail damage last night. Can't pick up." },
    { t: '7:05am', text: 'Homeowner hangs up. Googles "roof repair near me." Calls the next result.', lost: true },
    { t: '7:06am', text: 'Your competitor picks up. Estimate scheduled for Thursday.', lost: true },
    { t: '11:30am', text: 'You call back. Goes to voicemail. They already signed with someone else.' },
    { t: 'With CG', text: 'Your ad hits them first. AI calls back in 28 seconds. Estimate on your calendar.', win: true },
  ]
  return (
    <section id="problem" className="cg-sec cg-dark">
      <div className="photo" style={{ backgroundImage: `url(${IMG.site})` }} />
      <div className="wrap two">
        <div>
          <p className="kicker">/ The reality</p>
          <h2 className="display rv">Your crew is on rooftops.<br /><em>That homeowner won't wait.</em></h2>
          <p style={{ marginBottom: 16 }}>You're up on a roof at 7am. Running material at noon. Closing out a job at 4. Storm hits Thursday. Your phone blows up with 40 calls and you catch maybe 8 of them.</p>
          <p style={{ marginBottom: 16 }}>The roofer who answers first gets the job. That's not an opinion — that's how homeowners work. If you're not the one calling them back in 30 seconds, someone else is.</p>
          <p style={{ color: '#fff', fontWeight: 500 }}>Most roofers still rely on referrals and hope. We built something better.</p>
        </div>
        <div className="timeline glass rv">
          <p className="mono" style={{ color: 'rgba(226,233,246,.55)', marginBottom: 6 }}>A typical storm week</p>
          {rows.map((r) => (
            <div className="row" key={r.t}>
              <span className={`t${r.win ? ' win-t' : ''}`}>{r.t}</span>
              <span className={r.lost ? 'lost' : r.win ? 'win' : ''} style={{ fontSize: '.93rem', lineHeight: 1.55 }}>{r.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── live system ───────────────────────────────────────────────────────────────
function LiveSystem() {
  const cards = [
    { n: '01 / Real results', title: 'By the numbers', w: <StatWidget />, p: 'Real figures from a Central Florida roofer we run this system for (Meta Ads Manager and Google, Oct 2026).' },
    { n: '02 / Lead pipeline', title: 'From ad to booked', w: <PipelineWidget />, p: 'Every lead that comes in gets called within 30 seconds, qualified, and booked — automatically.' },
    { n: '03 / Scheduling', title: 'Estimates booked instantly', w: <SchedulerWidget />, p: 'The AI finds the next open slot and books the estimate in real time — no phone tag, no back-and-forth.' },
  ]
  return (
    <section className="cg-sec cg-light alt">
      <div className="wrap">
        <div className="split">
          <div><p className="kicker">/ The platform</p><h2 className="display rv">What the system does<br /><em>while you're on a roof.</em></h2></div>
          <p className="lede rv">Ads running, leads coming in, callbacks firing — all while you're on a job site.</p>
        </div>
        <div className="cards3">
          {cards.map((c) => (
            <div className="wcard rv" key={c.n}>
              <span className="mono">{c.n}</span>
              <h3 style={{ margin: 0 }}>{c.title}</h3>
              {c.w}
              <p>{c.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── solution ──────────────────────────────────────────────────────────────────
function Solution() {
  const items = [
    { icon: Megaphone, label: '01 — Lead Generation', title: 'Facebook Ads That Find the Jobs', text: 'Targeted ads in your service area reaching homeowners actively looking for roofing work — storm damage, replacements, leaks. Hot inbound leads, not cold lists.' },
    { icon: Phone, label: '02 — Instant Follow-Up', title: '30-Second AI Callback', text: 'The second a lead fills out a form, our AI calls them back within 30 seconds — qualifies the job, gets the details, and books the estimate on your calendar before anyone else picks up.' },
    { icon: Star, label: '03 — Exclusivity', title: 'Your Leads. Only Yours.', text: "We don't sell the same homeowner to three roofers. Every lead is exclusive to your business. You're not bidding against a competitor on your own pipeline." },
  ]
  const feats = [
    { icon: PhoneCall, title: 'Never Miss a Call', text: 'Answers every inbound call instantly — day, night, weekends. Qualifies the lead and books the estimate on your calendar.' },
    { icon: FileText, title: 'Follows Up on Dead Quotes', text: 'Sent 10 estimates, heard back from 4? The agent follows up on every cold quote automatically.' },
    { icon: Settings, title: 'Trained on Your Business', text: 'Not a generic bot — trained on your service area, project types, and how you want to talk to homeowners.' },
  ]
  return (
    <section id="solution" className="cg-sec cg-light">
      <div className="wrap">
        <p className="kicker">/ What we build</p>
        <h2 className="display rv">More leads in.<br /><em>None slipping out.</em></h2>
        <p className="lede rv" style={{ marginBottom: 48 }}>Two systems running in parallel — one fills your pipeline with qualified homeowners, the other makes sure every call and quote is handled before you even know it rang.</p>
        <div className="sol">
          <div className="sol-list">
            {items.map((it) => {
              const I = it.icon
              return (
                <div className="srow rv" key={it.label}>
                  <span className="icon"><I /></span>
                  <div><p className="mono" style={{ color: 'var(--blue)', marginBottom: 6 }}>{it.label}</p><h3>{it.title}</h3><p>{it.text}</p></div>
                </div>
              )
            })}
          </div>
          <div className="agent rv">
            <span className="live"><i /> 24/7 inbound coverage</span>
            <h3>A voice agent that runs your phone.</h3>
            {feats.map((f) => {
              const I = f.icon
              return <div className="feat" key={f.title}><span className="icon"><I /></span><div><b>{f.title}</b><p style={{ fontSize: '.88rem' }}>{f.text}</p></div></div>
            })}
            <a href="#contact" className="btn btn-block" style={{ marginTop: 28 }}>See How It Works <ArrowUpRight /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── process ───────────────────────────────────────────────────────────────────
export function Process() {
  const steps = [
    { num: '01', eyebrow: 'Discovery', title: 'We learn your business', body: "Your service area, the jobs you want more of, how you currently get leads, and what your busy season looks like. One call. That's it.", bullets: ['Service area, project types, and average job value', 'Current lead sources — referrals, Google, nothing?', 'Storm season timing and surge capacity'], img: IMG.meet },
    { num: '02', eyebrow: 'Build & Launch', title: 'We build and launch the system', body: 'Facebook ad campaign built for your market. AI callback configured for your business. Live in days, not weeks.', bullets: ['Ad creative written for your service area and job types', 'AI callback trained to qualify roofing leads specifically', 'Integrated with your calendar — Google, Jobber, or anything else'], img: IMG.ai },
    { num: '03', eyebrow: 'You Test It', title: 'Leads come in — you verify it works', body: "You'll see the first leads within 48 hours. Review them, check the callback recordings, tell us what to adjust. We don't call it done until you're satisfied.", bullets: ['First leads typically in 24–48 hours of launch', 'You get recordings of every AI callback call', 'Tell us what to change — we adjust fast'], img: IMG.site },
    { num: '04', eyebrow: 'Scale', title: 'We optimize and grow it', body: "Monthly review of lead quality, ad performance, and callback outcomes. We cut what's not converting and scale what is. Storm season? We surge the ads.", bullets: ['Monthly performance review and optimization', 'Storm season surge — we scale fast when you need it', 'Changes and updates handled within 24 hours'], img: IMG.hero },
  ]
  return (
    <section id="process" className="cg-sec cg-light alt">
      <div className="wrap">
        <p className="kicker">/ How we work</p>
        <h2 className="display rv">First leads in 48 hours.<br /><em>Zero tech knowledge required.</em></h2>
        <div className="steps" style={{ marginTop: 52 }}>
          {steps.map((s) => (
            <article className="step rv" key={s.num}>
              <div className="ph"><img src={s.img} alt="" loading="lazy" /><span className="n">{s.num}</span></div>
              <div className="bd">
                <p className="mono" style={{ color: 'var(--blue)', marginBottom: 8 }}>{s.eyebrow}</p>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <ul className="ticks">{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── services ──────────────────────────────────────────────────────────────────
function Services() {
  return (
    <section id="included" className="cg-sec cg-light">
      <div className="wrap">
        <div className="split">
          <div><p className="kicker">/ The system</p><h2 className="display rv">Everything we run.<br /><em>Nothing you don't need.</em></h2></div>
          <div className="rv">
            <p className="lede" style={{ marginBottom: 18 }}>The services marked <span className="tag-live">Live for Jones</span> are running for Jones Roofing right now.</p>
            <a href="#contact" className="btn btn-lg">Get More Roofing Jobs <ArrowUpRight /></a>
          </div>
        </div>
        {SERVICE_GROUPS.map((g, gi) => (
          <div className="svc-group" key={g.name}>
            <div className="svc-head"><span className="mono">0{gi + 1}</span><h3>{g.name}</h3><p>{g.blurb}</p></div>
            <div className="cards3">
              {g.items.map((it) => {
                const I = it.icon
                return (
                  <div className="svc rv" key={it.title}>
                    <div className="svc-top">
                      <span className="icon"><I /></span>
                      {it.live && <span className="tag-live">Live for Jones</span>}
                      {it.isNew && <span className="tag-new">New</span>}
                    </div>
                    <h3>{it.title}</h3><p>{it.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── trust ─────────────────────────────────────────────────────────────────────
function Trust() {
  const badges = [
    { icon: Clock, title: 'Honest strategy call', sub: "We'll look at your service area, your current lead flow, and tell you honestly if this makes sense for your business. If it doesn't, we'll say that." },
    { icon: ShieldCheck, title: 'Exclusive leads, always', sub: 'Every lead we generate is yours alone. We never sell the same homeowner to multiple roofers. Your lead is your lead.' },
    { icon: Zap, title: 'First leads in 48 hours', sub: 'From strategy call to live campaign. Timeline confirmed on your call. No IT team, no tech setup on your end.' },
  ]
  return (
    <section className="cg-sec cg-dark">
      <div className="photo" style={{ backgroundImage: `url(${IMG.hero})` }} />
      <div className="wrap">
        <p className="kicker">/ Why Cornerstone Growth</p>
        <h2 className="display rv">Built for roofers.<br /><em>Not for everyone.</em></h2>
        <div className="cards3" style={{ marginTop: 48 }}>
          {badges.map((b) => {
            const I = b.icon
            return <div className="gcard glass rv" key={b.title}><span className="icon"><I /></span><h3>{b.title}</h3><p>{b.sub}</p></div>
          })}
        </div>
      </div>
    </section>
  )
}

// ─── faq ───────────────────────────────────────────────────────────────────────
export function FAQ() {
  const [open, setOpen] = useState(0)
  const items = [
    { q: 'How is this different from HomeAdvisor or Angi?', a: "Night and day. HomeAdvisor sells your lead to 4 roofers at the same time — you're competing on price before you've even had a conversation. Our leads are exclusive. You're the only roofer calling that homeowner." },
    { q: 'Will the AI callback sound robotic?', a: "No — and that's the most common concern we hear. The AI is trained to qualify roofing leads in plain language: what's damaged, is it leaking, does the homeowner own the property, when do they want someone out. It gets the information you need and books the estimate. You get the recording so you can hear it yourself before it ever goes live." },
    { q: 'What if I already get enough referrals?', a: "Most roofers who say that are still missing calls, not following up on cold quotes, and leaving storm season jobs on the table. We show you exactly what's slipping through — if it's not a fit, we'll tell you. But the roofers saying that in January are usually calling us back in August after watching a competitor dominate storm season." },
    { q: 'How fast do leads come in?', a: "Typically within 24–48 hours of launch. Facebook ads start delivering results quickly when the targeting and creative are right — and we've done this enough to know what works in roofing markets." },
    { q: 'What happens after the AI calls them back?', a: 'It qualifies the job: roof type, damage description, size, timeline, homeowner vs renter, insurance or cash. If they qualify, it books the estimate directly on your calendar. You show up knowing exactly what you\'re walking into.' },
    { q: 'What if I want to pause during slow season?', a: 'You control the ad spend. We can pause, scale down, or shift focus to different job types depending on what you need. And when storm season hits, we scale up fast — that\'s when this system pays for itself many times over.' },
  ]
  return (
    <section id="faq" className="cg-sec cg-light alt">
      <div className="wrap two">
        <div>
          <p className="kicker">/ Questions</p>
          <h2 className="display rv">Things roofers want<br /><em>to know first.</em></h2>
          <p className="lede" style={{ marginBottom: 28 }}>No sales deck, no case studies from industries you don't work in. Just honest answers.</p>
          <BookLink where="faq" className="btn">Still have questions? Book a call <ArrowUpRight /></BookLink>
        </div>
        <div className="faq rv">
          {items.map((it, i) => (
            <div className={`item${open === i ? ' open' : ''}`} key={it.q}>
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>{it.q}<span className="plus">+</span></button>
              <div className="ans"><p>{it.a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── contact (logic unchanged from e5f738e) ─────────────────────────────────────
const MISS_RATE = 0.34
const NO_CALLBACK = 0.85
const CLOSE_RATE_BY_PROJECT = { under5k: 0.30, b5to10k: 0.25, b10to25k: 0.20, b25to50k: 0.15, b50kplus: 0.10 }
const REVENUE_BRACKETS = [
  { label: 'Under $50K/mo', value: 'under-50k', midpoint: 25_000 },
  { label: '$50K–$100K/mo', value: '50k-100k', midpoint: 75_000 },
  { label: '$100K–$250K/mo', value: '100k-250k', midpoint: 175_000 },
  { label: '$250K–$500K/mo', value: '250k-500k', midpoint: 375_000 },
  { label: '$500K+/mo', value: '500k-plus', midpoint: 600_000 },
]
const PROJECT_VALUE_BRACKETS = [
  { label: 'Under $5K', value: 'under-5k', midpoint: 2_500, crKey: 'under5k' },
  { label: '$5K–$10K', value: '5k-10k', midpoint: 7_500, crKey: 'b5to10k' },
  { label: '$10K–$25K', value: '10k-25k', midpoint: 17_500, crKey: 'b10to25k' },
  { label: '$25K–$50K', value: '25k-50k', midpoint: 37_500, crKey: 'b25to50k' },
  { label: '$50K+', value: '50k-plus', midpoint: 60_000, crKey: 'b50kplus' },
]
const CALL_VOLUME_BRACKETS = [
  { label: 'Under 50', value: 'under-50', midpoint: 25 },
  { label: '50–100', value: '50-100', midpoint: 75 },
  { label: '100–250', value: '100-250', midpoint: 175 },
  { label: '250–500', value: '250-500', midpoint: 375 },
  { label: '500+', value: '500-plus', midpoint: 600 },
]

function ContactForm() {
  const [status, setStatus] = useState('idle')
  const [mode, setMode] = useState('book')
  const [revenue, setRevenue] = useState('')
  const [projectVal, setProjectVal] = useState('')
  const [callVolume, setCallVolume] = useState('')
  const [displayedROI, setDisplayedROI] = useState(0)

  const revB = REVENUE_BRACKETS.find((b) => b.value === revenue)
  const projB = PROJECT_VALUE_BRACKETS.find((b) => b.value === projectVal)
  const callB = CALL_VOLUME_BRACKETS.find((b) => b.value === callVolume)
  const roiCalc = (revB && projB && callB) ? (() => {
    const lostCallers = Math.round(callB.midpoint * MISS_RATE * NO_CALLBACK)
    const volumeProjects = Math.round(lostCallers * CLOSE_RATE_BY_PROJECT[projB.crKey])
    const currentJobs = Math.max(1, Math.round(revB.midpoint / projB.midpoint))
    const lostProjects = Math.min(volumeProjects, currentJobs)
    const headline = lostProjects * projB.midpoint
    return { lostCallers, lostProjects, headline, ratio: headline / revB.midpoint, projectValue: projB.midpoint }
  })() : null
  const roiValue = roiCalc?.headline ?? 0

  useEffect(() => {
    if (!roiValue) { setDisplayedROI(0); return }
    let frame
    const t0 = performance.now()
    const tick = (now) => {
      const t = Math.min((now - t0) / 600, 1)
      setDisplayedROI(Math.round(roiValue * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [roiValue])

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.target
    const data = {
      access_key: '17e0e9b9-2f99-4dee-bb85-aa2c28c4b786',
      subject: 'New Lead — Cornerstone Growth',
      from_name: 'Cornerstone Growth Website',
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      company: form.company.value,
      revenue,
      projectValue: projectVal,
      callVolume,
      estimatedMonthlyLoss: roiValue ? `$${roiValue.toLocaleString()}/mo` : '',
      services: Array.from(form.querySelectorAll('input[name="services"]:checked')).map((cb) => cb.value).join(', '),
      message: form.message.value,
    }
    // Also save the lead into the Cornerstone GHL sub-account and alert Dylan
    // (api/lead.py). Fire-and-forget: the Web3Forms email below is unchanged.
    const { access_key: _k, ...lead } = data
    fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...lead, botcheck: '' }), keepalive: true }).catch(() => {})
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => formData.append(k, v ?? ''))
    formData.append('botcheck', '')
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      if (res.ok) {
        setStatus('sent')
        pixel('track', 'Lead', { content_name: 'call-back form' })
        if (window.va) window.va('event', { name: 'Form submitted', data: { form: 'Contact form' } })
        setTimeout(() => { window.open('https://calendly.com/dylanwang-cornerstonegrowth/30min', '_blank') }, 800)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const contacts = [
    { icon: Phone, label: 'Phone', value: '(407) 743-0525', href: 'tel:4077430525' },
    { icon: Mail, label: 'Email', value: 'dylan.cornerstonegrowth@gmail.com', href: 'mailto:dylan.cornerstonegrowth@gmail.com' },
    { icon: MapPin, label: 'Location', value: 'Remote — serving roofing contractors nationwide', href: null },
  ]

  return (
    <section id="contact" className="cg-sec cg-dark">
      <div className="photo" style={{ backgroundImage: `url(${IMG.site})` }} />
      <div className="wrap two">
        <div>
          <p className="kicker">/ The next step</p>
          <h2 className="display rv">Book your free<br /><em>strategy call.</em></h2>
          <p>We'll look at your service area and your current lead flow, and show you exactly what a targeted ad campaign and instant follow-up would do for your business. You leave with a plan either way.</p>
          <BookLink where="contact" className="btn btn-lg" >Pick a time now <ArrowRight /></BookLink>
          <ul className="ticks">
            <li>Honest call — working session, not a pitch</li>
            <li>Exclusive leads — never shared with competitors</li>
            <li>First leads in 48hrs — timeline confirmed on your call</li>
          </ul>
          <div className="contact-row">
            {contacts.map((c) => {
              const I = c.icon
              const inner = <><span className="icon"><I /></span><span><small>{c.label}</small><b>{c.value}</b></span></>
              return c.href ? <a key={c.label} href={c.href}>{inner}</a> : <div className="c" key={c.label}>{inner}</div>
            })}
          </div>
          <div className="glass" style={{ borderRadius: 18, padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <ShieldCheck size={18} color="#5c93f5" style={{ flex: 'none', marginTop: 2 }} />
            <p style={{ fontSize: '.88rem' }}><b style={{ color: '#fff' }}>No pressure.</b> No contracts to sign on the call. No commitment. Just the conversation.</p>
          </div>
        </div>

        {status !== 'sent' && mode === 'book' ? (
          <div className="book-col rv">
            <div className="seg-toggle glass"><button className="on">Pick a time</button><button onClick={() => setMode('form')}>Have us call you</button></div>
            <CalendlyInline where="contact" height={680} />
          </div>
        ) : status === 'sent' ? (
          <div className="sent glass">
            <CheckCircle2 />
            <h3>Got it. We'll be in touch.</h3>
            <p>Expect a call or email within one business day. Want it sooner? <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#93c5fd', textDecoration: 'underline' }} onClick={() => trackBook('after-form')}>Pick a time now</a>.</p>
          </div>
        ) : (
          <form className="form glass rv" onSubmit={onSubmit}>
            <div className="seg-toggle glass" style={{ marginBottom: 6 }}><button type="button" onClick={() => setMode('book')}>Pick a time</button><button type="button" className="on">Have us call you</button></div>
            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
            <div className="form-head"><h3>Prefer we call you?</h3><p>Four fields. We'll reach out within one business day.</p></div>
            <div className="row2">
              <label>Full name<input id="name" name="name" required placeholder="John Smith" autoComplete="name" /></label>
              <label>Email<input id="email" name="email" type="email" required placeholder="john@smithroofing.com" autoComplete="email" /></label>
            </div>
            <div className="row2">
              <label>Phone<input id="phone" name="phone" type="tel" required placeholder="(555) 000-0000" autoComplete="tel" /></label>
              <label>Company<input id="company" name="company" required placeholder="Smith Roofing LLC" autoComplete="organization" /></label>
            </div>
            <details className="more">
            <summary>Add details for a free missed-revenue estimate <span>(optional)</span></summary>
            <div className="more-in">
            <label>Roughly what's your monthly revenue?
              <select id="revenue" name="revenue" value={revenue} onChange={(e) => setRevenue(e.target.value)}>
                <option value="">Select your range</option>
                {REVENUE_BRACKETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </label>
            <div>
              <p style={{ fontSize: '.84rem', fontWeight: 500, color: '#fff', marginBottom: 8 }}>What are you most interested in?</p>
              <div className="checks">
                {['Targeted Facebook Ads', '30-Second AI Callback', 'Lead Qualification System', 'Estimate Booking Automation', 'Storm Season Surge Ads', 'Monthly Optimization'].map((s) => (
                  <label key={s}><input type="checkbox" name="services" value={s} />{s}</label>
                ))}
              </div>
            </div>
            <div className="row2">
              <label>Average job value
                <select id="projectValue" name="projectValue" value={projectVal} onChange={(e) => setProjectVal(e.target.value)}>
                  <option value="">Select</option>
                  {PROJECT_VALUE_BRACKETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </label>
              <label>Inbound calls per month
                <select id="callVolume" name="callVolume" value={callVolume} onChange={(e) => setCallVolume(e.target.value)}>
                  <option value="">Select</option>
                  {CALL_VOLUME_BRACKETS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </label>
            </div>
            {roiCalc && (
              <div className="roi" aria-live="polite">
                <small>You could be missing out on an estimated</small>
                <div><span className="amt">{displayedROI >= 1_000_000 ? `$${(displayedROI / 1_000_000).toFixed(2)}M` : `$${displayedROI.toLocaleString()}`}</span><span style={{ color: '#fff', fontWeight: 600 }}>/mo</span> <small style={{ display: 'inline' }}>in roofing jobs from missed calls.</small></div>
                <small>~{roiCalc.lostCallers} missed callers a month → roughly {roiCalc.lostProjects} lost {roiCalc.lostProjects === 1 ? 'job' : 'jobs'} × ${roiCalc.projectValue.toLocaleString()} average job value</small>
                <small style={{ fontStyle: 'italic' }}>
                  {roiCalc.ratio < 0.25
                    ? `That's an extra ${Math.round(roiCalc.ratio * 100)}% on top of your current monthly revenue.`
                    : roiCalc.ratio < 1
                      ? `That's ${Math.round(roiCalc.ratio * 100)}% of your current monthly revenue walking out the door.`
                      : 'That\'s enough demand to double your business — every one of those callers hired someone else.'}
                </small>
              </div>
            )}
            <label>Tell us about your business
              <textarea id="message" name="message" rows={3} placeholder="What's your service area? How do you currently get leads — referrals, Google, nothing? What's your busiest season?" />
            </label>
            </div>
            </details>
            {status === 'error' && <p className="err">Something went wrong — please email us directly at <a href="mailto:dylan.cornerstonegrowth@gmail.com">dylan.cornerstonegrowth@gmail.com</a></p>}
            <button type="submit" className="btn btn-lg btn-block" disabled={status === 'sending'}>
              {status === 'sending' ? <><Activity /> Sending…</> : <>Call Me Back <ArrowUpRight /></>}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

// ─── footer ────────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="cg-foot">
      <div className="wrap">
        <div className="cols">
          <div>
            <img src="/cornerstone_growth_logo.png" alt="Cornerstone Growth" />
            <p style={{ maxWidth: 320 }}>More roofing jobs. Less chasing. Built for owner-operated roofing contractors.</p>
            <div className="status"><i /> All systems operational</div>
          </div>
          <div>
            <h4>System</h4>
            <ul>{['Facebook Ad Campaigns', 'AI Lead Callback', 'Lead Qualification', 'Estimate Booking', 'Monthly Optimization'].map((s) => <li key={s}><a href="#included">{s}</a></li>)}</ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#process">How It Works</a></li>
              <li><a href="#contact">Get More Jobs</a></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="bottom">
          <span>© {new Date().getFullYear()} Cornerstone Growth. All rights reserved.</span>
          <div><Link to="/privacy-policy">Privacy</Link><Link to="/terms">Terms</Link></div>
        </div>
      </div>
    </footer>
  )
}

function Fab() {
  const [hide, setHide] = useState(true)
  useEffect(() => {
    const h = () => {
      const c = document.getElementById('contact')
      const r = c ? c.getBoundingClientRect() : null
      setHide(window.scrollY < 300 || (r && r.top < window.innerHeight && r.bottom > 0))
    }
    h()
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <>
      <a href={BOOK_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackBook('fab')} className={`cg-fab${hide ? ' hide' : ''}`} aria-label="Book a strategy call"><CalendarCheck /></a>
      <div className={`cg-sticky${hide ? ' hide' : ''}`}>
        <BookLink where="sticky" className="btn btn-block">Book a Free Strategy Call <ArrowRight /></BookLink>
      </div>
    </>
  )
}

export default function App() {
  useReveal()
  useEffect(() => { reportVisit('cornerstone') }, [])
  return (
    <div className="cg">
      <Navbar />
      <main>
        <Hero />
        <Results />
        <CtaBand where="after-results" title="Want results like Jones?" em="Let's map out your market." sub="A free strategy call: we look at your area, your current lead flow and what a campaign would realistically do for you." />
        <WhatWeDo />
        <Problem />
        <LiveSystem />
        <Solution />
        <Process />
        <CtaBand where="after-process" title="First leads in 48 hours." em="It starts with one call." sub="No contracts on the call, no tech setup on your end. If it's not a fit, we'll tell you." />
        <Services />
        <Trust />
        <LeadMagnet />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
      <Fab />
    </div>
  )
}
