import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight, Phone, Menu, X, CalendarCheck,
  ShieldCheck, Clock, CheckCircle2, Mail, MapPin,
  Activity, Settings, ChevronRight,
  FileText, BarChart3, Star, Zap, Megaphone,
  PhoneCall, MessageSquare, RefreshCw,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NAV_LINKS = [
  { label: 'Problem',  href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Process',  href: '#process' },
  { label: 'Includes', href: '#included' },
  { label: 'FAQ',      href: '#faq' },
]

const SERVICES = [
  { icon: PhoneCall,    title: 'AI Voice Receptionist',  text: 'Answers every inbound call 24/7, qualifies the lead, captures project details, and books the estimate directly on your calendar. No voicemail. No missed jobs.' },
  { icon: FileText,     title: 'Quote Follow-Up Agent',  text: 'Automatically follows up on every estimate that goes cold — without you touching anything. Converts dead quotes into booked jobs.' },
  { icon: CalendarCheck,title: 'Estimate Booking',       text: 'Homeowners book directly into your calendar during the call. No phone tag, no back-and-forth, no lost appointments.' },
  { icon: Star,         title: 'Google Review Agent',    text: 'Post-job review requests sent automatically via SMS. More reviews means higher Google ranking means more inbound calls.' },
  { icon: MessageSquare,title: 'Missed Call Text-Back',  text: 'Instant SMS fires to any caller you missed before they open Google and call the next contractor on the list.' },
  { icon: RefreshCw,    title: 'Lead Re-Engagement',     text: 'Automatically re-contacts old leads who went cold at 3, 6, and 12 months. Dormant pipeline activated at zero ad spend.' },
]

// ─── CountUp ──────────────────────────────────────────────────────────────────
function CountUp({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTs = performance.now()
        const tick = (now) => {
          const t = Math.min(1, (now - startTs) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(end * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  return <span ref={ref} className="tabular-nums">{prefix}{value}{suffix}</span>
}

// ─── SignatureAnim — Lead Pipeline (4 phases) ─────────────────────────────────
function SignatureAnim() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 4), 2200)
    return () => clearInterval(id)
  }, [])

  const phases = [
    { step: '01', label: 'Ad Seen',        sub: 'Mike D. · Storm damage · Dallas, TX', detail: 'Lead filling form…' },
    { step: '02', label: 'Lead Captured',  sub: 'Form submitted · 11:42am',         detail: 'Calling back now…' },
    { step: '03', label: 'AI Connected',   sub: 'Called back in 28s · Qualifying',  detail: 'Booking estimate…' },
    { step: '04', label: 'Estimate Set',   sub: 'Thu 10am · confirmed',             detail: 'Calendar updated ✓' },
  ]

  return (
    <div className="relative h-44 rounded-3xl overflow-hidden flex flex-col" style={{ background: '#0f172a' }}>
      <style>{`
        @keyframes phase-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: '#2F6FEB' }}>Lead Pipeline</span>
        <span className="font-mono text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Live</span>
      </div>

      <div key={phase} className="flex-1 flex items-center px-4 gap-3" style={{ animation: 'phase-in 0.3s ease' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: phase === 3 ? 'rgba(34,197,94,0.15)' : 'rgba(47,111,235,0.15)' }}>
          <span className="font-mono text-xs font-bold" style={{ color: phase === 3 ? '#22c55e' : '#2F6FEB' }}>
            {phases[phase].step}
          </span>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide" style={{ color: '#ffffff' }}>{phases[phase].label}</p>
          <p className="font-body text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{phases[phase].sub}</p>
          <p className="font-mono text-[9px] mt-1" style={{ color: phase === 3 ? '#22c55e' : '#2F6FEB' }}>{phases[phase].detail}</p>
        </div>
      </div>

      <div className="px-4 pb-3 flex items-center gap-1.5">
        {phases.map((_, i) => (
          <div key={i} className="h-1 rounded-full transition-all duration-300"
            style={{
              background: i === phase ? (phase === 3 ? '#22c55e' : '#2F6FEB') : 'rgba(255,255,255,0.12)',
              width: i === phase ? '24px' : '6px',
            }} />
        ))}
      </div>
    </div>
  )
}

// ─── Lead Flow Shuffler — Animated Stat Counter ───────────────────────────────
function LeadFlowShuffler() {
  const stats = [
    { value: 80, suffix: '%', prefix: '',  label: 'Homeowners go with the first roofer to call them back', color: '#ef4444' },
    { value: 72, suffix: '%', prefix: '',  label: 'Research online before ever picking up the phone',        color: '#2F6FEB' },
    { value: 3,  suffix: 'x', prefix: '',  label: 'More jobs for roofers running targeted local ads',        color: '#22c55e' },
  ]
  const [statIdx, setStatIdx] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStatIdx(i => (i + 1) % 3), 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    setCount(0)
    const target = stats[statIdx].value
    const dur = 1200
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur)
      setCount(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [statIdx])

  const s = stats[statIdx]

  return (
    <div className="relative h-44 rounded-3xl overflow-hidden flex flex-col items-center justify-center"
      style={{ background: '#0f172a' }}>
      <style>{`
        @keyframes stat-in {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div key={statIdx} className="flex flex-col items-center gap-2 px-6 text-center"
        style={{ animation: 'stat-in 0.4s ease' }}>
        <div className="font-display font-black text-5xl tabular-nums leading-none" style={{ color: s.color }}>
          {s.prefix}{count}{s.suffix}
        </div>
        <p className="font-body text-xs leading-snug max-w-[160px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
      </div>

      <div className="absolute bottom-3 flex items-center gap-1.5">
        {stats.map((st, i) => (
          <div key={i} className="h-1 rounded-full transition-all duration-300"
            style={{
              background: i === statIdx ? s.color : 'rgba(255,255,255,0.12)',
              width: i === statIdx ? '24px' : '6px',
            }} />
        ))}
      </div>
    </div>
  )
}

// ─── Live Feed Ticker ─────────────────────────────────────────────────────────
function LiveFeedTicker() {
  const feeds = [
    { text: 'New roofing lead — hail damage — estimate booked in 28s', time: 'just now' },
    { text: 'Facebook ad → lead in → called back in 22 seconds', time: '3 min ago' },
    { text: 'New lead — full reroof — $14K job scheduled Thu 9am', time: '6 min ago' },
    { text: 'Storm surge — 4 new leads in 90 minutes — all qualified', time: '11 min ago' },
  ]
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % feeds.length), 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="hidden lg:block absolute bottom-10 right-10 w-72 z-20">
      <style>{`
        @keyframes feed-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="rounded-2xl p-4 shadow-2xl shadow-black/40"
        style={{ background: 'rgba(15,23,42,0.82)', backdropFilter: 'blur(20px)', border: '1px solid rgba(37,99,235,0.18)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 ring-pulse flex-shrink-0" />
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Live Activity</span>
        </div>
        <div key={current} style={{ animation: 'feed-in 0.35s ease' }}>
          <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{feeds[current].text}</p>
          <p className="font-mono text-[9px] mt-1.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{feeds[current].time}</p>
        </div>
      </div>
    </div>
  )
}

// ─── AI Scheduler ─────────────────────────────────────────────────────────────
function AIScheduler() {
  const [step, setStep] = useState(0)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  const slots = ['9am', '11am', '2pm']
  const targetDay = 3
  const targetSlot = 0

  useEffect(() => {
    let idx = 0
    const id = setInterval(() => {
      idx = (idx + 1) % 5
      setStep(idx)
    }, 1300)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative h-44 rounded-3xl overflow-hidden bg-surface p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[9px] uppercase tracking-widest text-primary/80">Estimate Scheduler</span>
        {step >= 3 && <span className="font-mono text-[9px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Booked</span>}
      </div>
      <div className="grid grid-cols-5 gap-1 flex-1">
        {days.map((day, di) => (
          <div key={di} className="flex flex-col gap-1">
            <span className="font-mono text-[8px] text-center text-muted uppercase">{day}</span>
            {slots.map((slot, si) => {
              const isTarget = di === targetDay && si === targetSlot
              const isCursor = step >= 1 && isTarget
              const isBooked = step >= 3 && isTarget
              return (
                <div key={si}
                  className="rounded-lg h-7 flex items-center justify-center text-[8px] font-mono transition-all duration-300"
                  style={{
                    background: isBooked ? '#2F6FEB' : isCursor ? 'rgba(47,111,235,0.22)' : 'rgba(47,111,235,0.04)',
                    border: isCursor ? '1px solid rgba(47,111,235,0.6)' : '1px solid rgba(47,111,235,0.08)',
                    color: isBooked ? '#ffffff' : '#64748B',
                    transform: isCursor && step === 2 ? 'scale(1.1)' : 'scale(1)',
                  }}>
                  {isBooked ? '✓' : slot}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {step >= 3 && (
        <div className="text-[9px] font-mono text-primary text-center animate-pulse">
          Estimate confirmed — Thu 9am
        </div>
      )}
    </div>
  )
}

// ─── New Lead Card ────────────────────────────────────────────────────────────
function NewLeadCard() {
  return (
    <div className="rounded-2xl glass-card p-6 shadow-2xl shadow-black/60 max-w-sm w-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
        <span className="font-mono text-[10px] text-green-400 uppercase tracking-wider">New Facebook Lead</span>
        <span className="font-mono text-[10px] text-muted ml-auto">30 sec ago</span>
      </div>
      {/* Caller */}
      <p className="font-body font-semibold text-ink text-base mb-1">Mike D.</p>
      <p className="font-body text-sm text-muted mb-5">Hail damage · Full reroof · Dallas, TX</p>
      {/* Divider */}
      <div className="h-px bg-divider mb-5" />
      {/* Resolved rows */}
      <div className="flex flex-col gap-3 mb-5">
        {['Called back in 28 seconds', 'Lead qualified', 'Estimate booked Thu 2pm'].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-2.5 w-2.5 text-green-400" strokeWidth={2.5} />
            </div>
            <span className="font-mono text-[10px] text-green-400 uppercase tracking-wide">{item}</span>
          </div>
        ))}
      </div>
      {/* Badge */}
      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400 ring-pulse" />
        Before competitor ever called
      </span>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg shadow-black/30' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <a href="#home" className="font-display font-bold text-xl tracking-wide text-ink lift-on-hover">
            CORNERSTONE GROWTH
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href}
                className="font-body text-sm text-muted hover:text-ink lift-on-hover transition-colors duration-200">
                {l.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#book-call"
              className="hidden sm:inline-flex magnetic-btn items-center gap-1.5 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-lg shadow-primary/20 tracking-wide uppercase">
              Get More Jobs <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            </a>
            <button onClick={() => setOpen(true)} className="lg:hidden p-2 text-muted hover:text-ink transition-colors" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-deep/97 backdrop-blur-2xl flex flex-col p-6">
          <div className="flex items-center justify-between mb-12">
            <span className="font-display font-bold text-lg text-white">CORNERSTONE GROWTH</span>
            <button onClick={() => setOpen(false)} className="p-2 text-white/50 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-7">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                className="font-display text-3xl font-bold text-white/80 hover:text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto">
            <a href="#book-call" onClick={() => setOpen(false)}
              className="magnetic-btn inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-4 rounded-sm w-full justify-center shadow-lg shadow-primary/20 uppercase tracking-wide">
              Get More Roofing Jobs <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ delay: 0.1 })
      heroTl
        .fromTo('.hero-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.2)
        .fromTo('.hero-line-1',  { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1,   ease: 'power3.out' }, 0.4)
        .fromTo('.hero-line-2',  { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, 0.55)
        .fromTo('.hero-line-3',  { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, 0.65)
        .fromTo('.hero-sub',     { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.85)
        .fromTo('.hero-cta',     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 1.0)
        .fromTo('.hero-card',    { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, 1.1)
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="home" ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-background" style={{ backgroundColor: '#06080F' }}>
      {/* Hero background image */}
      <img
        src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1800&q=80&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,8,15,0.85) 0%, rgba(12,18,32,0.6) 50%, rgba(79,70,229,0.15) 100%)' }} />

      {/* Floating gradient orbs */}
      <div className="orb w-[700px] h-[700px] animate-orb-drift" style={{ background: 'radial-gradient(circle, rgba(47,111,235,0.18) 0%, transparent 65%)', top: '-200px', right: '-200px' }} />
      <div className="orb w-[500px] h-[500px] animate-float-slower" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 65%)', bottom: '-100px', left: '-150px', animationDelay: '5s' }} />
      <div className="orb w-[300px] h-[300px] animate-float-slow" style={{ background: 'radial-gradient(circle, rgba(47,111,235,0.1) 0%, transparent 65%)', top: '40%', left: '40%', animationDelay: '2s' }} />

      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-25" />
      {/* Top gradient fade */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Floating particles */}
      <div className="absolute top-32 right-16 w-2 h-2 rounded-full bg-primary/70 animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-48 right-32 w-1.5 h-1.5 rounded-full bg-accent/50 animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-24 right-52 w-1 h-1 rounded-full bg-primary-light/60 animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-64 right-20 w-2.5 h-2.5 rounded-full bg-primary/40 animate-float" style={{ animationDelay: '0.8s' }} />
      <div className="absolute top-80 left-20 w-1.5 h-1.5 rounded-full bg-accent/30 animate-float" style={{ animationDelay: '2.2s' }} />
      <div className="absolute top-52 left-48 w-1 h-1 rounded-full bg-primary-light/40 animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 pt-28 pb-20 min-h-[100dvh] flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left */}
        <div className="flex-1">
          <span className="hero-eyebrow font-mono text-[10px] uppercase tracking-[0.25em] text-primary block mb-6">
            The Roofing Lead System
          </span>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight leading-[0.95] mb-8">
            <span className="hero-line-1 block">More Qualified</span>
            <span className="hero-line-2 block">Roofing Jobs.</span>
            <span className="hero-line-3 block gradient-text">Zero Cold<br className="hidden sm:block" /> Outreach.</span>
          </h1>
          <p className="hero-sub font-body text-base sm:text-lg text-white/65 leading-relaxed max-w-lg mb-10">
            We run targeted Facebook ads and call every new lead back within 30 seconds — so you're always the first roofer they talk to, not the fourth.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-3 items-start">
            <a href="#book-call"
              className="magnetic-btn btn-shimmer inline-flex items-center gap-2 text-white px-7 py-4 rounded-sm font-semibold shadow-xl shadow-primary/30 text-sm uppercase tracking-wide">
              See How It Works <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/60 mt-4">Built for roofing contractors · Facebook ads + AI callback · Exclusive leads</p>
        </div>

        {/* Right — new lead card */}
        <div className="hero-card flex-shrink-0">
          <NewLeadCard />
        </div>
      </div>
      <LiveFeedTicker />
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.feature-card',
        { y: 40, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true }, y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', immediateRender: false }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="features" ref={ref} className="py-24 sm:py-32 bg-background border-t border-divider" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="mb-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">Platform</p>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-ink max-w-2xl" style={{ color: '#E8EEFF' }}>
            What the system does <span className="font-serif italic font-medium text-primary-light" style={{ color: '#5C93F5' }}>while you're on a roof.</span>
          </h2>
          <p className="mt-4 text-muted text-base sm:text-lg max-w-xl leading-relaxed" style={{ color: '#64748B' }}>
            Ads running, leads coming in, callbacks firing — all while you're on a job site.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="feature-card glow-card rounded-2xl bg-surface border border-divider p-6 sm:p-8" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2" style={{ color: '#64748B' }}>Lead Stats</p>
            <h3 className="font-display text-xl font-black text-ink mb-4 tracking-tight" style={{ color: '#E8EEFF' }}>By the numbers</h3>
            <LeadFlowShuffler />
            <p className="mt-4 text-sm text-muted leading-relaxed" style={{ color: '#64748B' }}>
              Speed and visibility win roofing jobs. We make sure you show up first and call back fastest.
            </p>
          </div>

          <div className="feature-card glow-card rounded-2xl bg-surface border border-divider p-6 sm:p-8" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2" style={{ color: '#64748B' }}>Lead Pipeline</p>
            <h3 className="font-display text-xl font-black text-ink mb-4 tracking-tight" style={{ color: '#E8EEFF' }}>From ad to booked</h3>
            <SignatureAnim />
            <p className="mt-4 text-sm text-muted leading-relaxed" style={{ color: '#64748B' }}>
              Every lead that comes in gets called within 30 seconds, qualified, and booked — automatically.
            </p>
          </div>

          <div className="feature-card glow-card rounded-2xl bg-surface border border-divider p-6 sm:p-8" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-2" style={{ color: '#64748B' }}>Scheduling</p>
            <h3 className="font-display text-xl font-black text-ink mb-4 tracking-tight" style={{ color: '#E8EEFF' }}>Estimates booked instantly</h3>
            <AIScheduler />
            <p className="mt-4 text-sm text-muted leading-relaxed" style={{ color: '#64748B' }}>
              The AI finds the next open slot and books the estimate in real time — no phone tag, no back-and-forth.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pillars ──────────────────────────────────────────────────────────────────
function Pillars() {
  const pillars = [
    { eyebrow: 'Speed wins', stat: '80%', desc: 'Of homeowners go with the first roofer to call them back. It\'s not about being the best — it\'s about being first. We make sure that\'s you.' },
    { eyebrow: 'They research online', stat: '72%', desc: 'Of homeowners look online before ever picking up the phone. If you\'re not showing up in their feed when storm damage is fresh, you\'re invisible.' },
    { eyebrow: 'Ads change the math', stat: '3x', desc: 'More roofing jobs for contractors running targeted local ads compared to referrals alone. One good storm season campaign pays for itself many times over.' },
  ]

  return (
    <section className="relative py-24 sm:py-32 bg-background overflow-hidden border-t border-divider" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540' }}>
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="orb w-[500px] h-[500px] animate-glow-pulse" style={{ background: 'radial-gradient(circle, rgba(47,111,235,0.1) 0%, transparent 65%)', top: '50%', left: '10%', transform: 'translateY(-50%)' }} />
      <div className="orb w-[300px] h-[300px] animate-float-slow" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 65%)', top: '30%', right: '15%', animationDelay: '3s' }} />
      <div className="relative max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-divider">
          {pillars.map((p, i) => (
            <div key={i} className="px-8 py-10 lg:py-0 text-center lg:text-left first:pl-0 last:pr-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">{p.eyebrow}</p>
              <div className="font-display font-black text-5xl sm:text-6xl gradient-text mb-2 leading-none">
                {p.stat}
              </div>
              <div className="relative overflow-hidden h-px my-4">
                <div className="h-px bg-gradient-to-r from-primary/60 via-primary-light/30 to-transparent"
                  style={{ animation: 'pillar-sweep 3s ease-in-out infinite' }} />
              </div>
              <style>{`@keyframes pillar-sweep { 0%{transform:translateX(-100%)} 50%{transform:translateX(100%)} 100%{transform:translateX(100%)} }`}</style>
              <p className="text-sm text-muted leading-relaxed" style={{ color: '#64748B' }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  return (
    <section id="problem" className="py-24 sm:py-32 bg-background border-t border-b border-divider" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540', borderBottomColor: '#1A2540' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">The Reality</p>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-ink mb-8" style={{ color: '#E8EEFF' }}>
              Your Crew Is on Rooftops All Day. That Homeowner Isn't Going to Wait.
            </h2>
            <div className="flex flex-col gap-6">
              <p className="text-base sm:text-lg text-muted leading-relaxed" style={{ color: '#64748B' }}>
                You're up on a roof at 7am. Running material at noon. Closing out a job at 4. Storm hits Thursday. Your phone blows up with 40 calls and you catch maybe 8 of them.
              </p>
              <p className="text-base sm:text-lg text-muted leading-relaxed" style={{ color: '#64748B' }}>
                The roofer who answers first gets the job. That's not an opinion — that's how homeowners work. If you're not the one calling them back in 30 seconds, someone else is.
              </p>
              <p className="text-base sm:text-lg font-semibold text-ink leading-relaxed" style={{ color: '#E8EEFF' }}>
                Most roofers still rely on referrals and hope. We built something better.
              </p>
            </div>
          </div>

          {/* Visual timeline */}
          <div className="rounded-2xl bg-surface border border-divider p-8 glow-card" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted mb-6" style={{ color: '#64748B' }}>A typical storm week</p>
            <div className="flex flex-col gap-0">
              {[
                { time: '7:04am', text: "You're on a roof. Phone buzzes — homeowner saw hail damage last night. Can't pick up.", color: '#64748B' },
                { time: '7:05am', text: 'Homeowner hangs up. Googles "roof repair near me." Calls the next result.', color: '#f87171' },
                { time: '7:06am', text: 'Your competitor picks up. Estimate scheduled for Thursday.', color: '#f87171' },
                { time: '11:30am', text: 'You call back. Goes to voicemail. They already signed with someone else.', color: '#64748B' },
                { time: 'With CG', text: 'Your ad hits them first. AI calls back in 28 seconds. Estimate on your calendar.', color: '#2F6FEB' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex gap-4 py-4">
                    <span className="font-mono text-[10px] min-w-[52px] pt-0.5" style={{ color: i === 4 ? '#2F6FEB' : '#64748B' }}>{item.time}</span>
                    <span className="text-sm leading-relaxed" style={{ color: item.color }}>{item.text}</span>
                  </div>
                  {i < 4 && <div className="ml-[52px] h-px" style={{ backgroundColor: '#1A2540' }} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Solution ─────────────────────────────────────────────────────────────────
function Solution() {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.sol-row',
        { x: -30, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', immediateRender: false }
      )
      gsap.fromTo('.sol-right',
        { x: 30, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true }, x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', immediateRender: false }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="solution" ref={ref} className="py-24 sm:py-32 bg-background border-t border-divider" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="mb-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">What We Build</p>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight max-w-4xl" style={{ color: '#E8EEFF' }}>
            More Leads In.{' '}
            <span style={{ color: '#2F6FEB' }}>None Slipping Out.</span>
          </h2>
          <p className="mt-5 text-base leading-relaxed max-w-2xl" style={{ color: '#64748B' }}>
            Two systems running in parallel — one fills your pipeline with qualified homeowners, the other makes sure every call and quote is handled before you even know it rang.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Left — Lead Gen */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {[
              {
                icon: Megaphone,
                label: '01 — Lead Generation',
                title: 'Facebook Ads That Find the Jobs',
                text: 'Targeted ads in your service area reaching homeowners actively looking for roofing work — storm damage, replacements, leaks. Hot inbound leads, not cold lists.',
              },
              {
                icon: Phone,
                label: '02 — Instant Follow-Up',
                title: '30-Second AI Callback',
                text: 'The second a lead fills out a form, our AI calls them back within 30 seconds — qualifies the job, gets the details, and books the estimate on your calendar before anyone else picks up.',
              },
              {
                icon: Star,
                label: '03 — Exclusivity',
                title: 'Your Leads. Only Yours.',
                text: "We don't sell the same homeowner to three roofers. Every lead is exclusive to your business. You're not bidding against a competitor on your own pipeline.",
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="sol-row glow-card rounded-2xl border border-divider p-6 sm:p-7 flex gap-5 group transition-all duration-300" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all duration-300 mt-0.5">
                    <Icon className="h-4 w-4 text-primary" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] mb-1" style={{ color: '#2F6FEB' }}>{item.label}</p>
                    <h3 className="font-display font-black text-lg tracking-tight mb-2" style={{ color: '#E8EEFF' }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>{item.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right — Voice Agent Coverage */}
          <div className="sol-right lg:col-span-5">
            <div className="rounded-2xl border border-divider h-full p-7 sm:p-8 flex flex-col" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.15em] mb-4" style={{ backgroundColor: 'rgba(47,111,235,0.1)', color: '#2F6FEB' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  24/7 Inbound Coverage
                </div>
                <h3 className="font-display font-black text-2xl sm:text-3xl tracking-tight" style={{ color: '#E8EEFF' }}>
                  A Voice Agent That Runs Your Phone.
                </h3>
              </div>

              <div className="flex flex-col gap-5 flex-1">
                {[
                  { icon: PhoneCall, title: 'Never Miss a Call', text: 'Answers every inbound call instantly — day, night, weekends. Qualifies the lead and books the estimate on your calendar.' },
                  { icon: FileText,  title: 'Follows Up on Dead Quotes', text: 'Sent 10 estimates, heard back from 4? The agent follows up on every cold quote automatically.' },
                  { icon: Settings,  title: 'Trained on Your Business', text: 'Not a generic bot — trained on your service area, project types, and how you want to talk to homeowners.' },
                ].map((f, i) => {
                  const Icon = f.icon
                  return (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm mb-1" style={{ color: '#E8EEFF' }}>{f.title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{f.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <a href="#book-call" className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-sm font-semibold text-sm shadow-lg shadow-primary/20 uppercase tracking-wide w-full justify-center">
                See How It Works <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Protocol (How It Works) ──────────────────────────────────────────────────
function Protocol() {
  const cardsRef = useRef([])

  useEffect(() => {
    if (prefersReducedMotion) return
    cardsRef.current.slice(0, 3).forEach(card => {
      if (!card) return
      gsap.to(card, {
        scrollTrigger: { trigger: card, start: 'top top+=100', end: '+=500', scrub: 1 },
        scale: 0.93, filter: 'blur(5px) saturate(0.6)', opacity: 0.45, ease: 'none',
      })
    })
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const steps = [
    {
      num: '01',
      eyebrow: 'Discovery',
      title: 'We learn your business',
      body: "Your service area, the jobs you want more of, how you currently get leads, and what your busy season looks like. One call. That's it.",
      bullets: ['Service area, project types, and average job value', 'Current lead sources — referrals, Google, nothing?', 'Storm season timing and surge capacity'],
      img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80&auto=format&fit=crop',
    },
    {
      num: '02',
      eyebrow: 'Build & Launch',
      title: 'We build and launch the system',
      body: 'Facebook ad campaign built for your market. AI callback configured for your business. Live in days, not weeks.',
      bullets: ['Ad creative written for your service area and job types', 'AI callback trained to qualify roofing leads specifically', 'Integrated with your calendar — Google, Jobber, or anything else'],
      img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=900&q=80&auto=format&fit=crop',
    },
    {
      num: '03',
      eyebrow: 'You Test It',
      title: 'Leads come in — you verify it works',
      body: "You'll see the first leads within 48 hours. Review them, check the callback recordings, tell us what to adjust. We don't call it done until you're satisfied.",
      bullets: ['First leads typically in 24–48 hours of launch', 'You get recordings of every AI callback call', 'Tell us what to change — we adjust fast'],
      img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80&auto=format&fit=crop',
    },
    {
      num: '04',
      eyebrow: 'Scale',
      title: 'We optimize and grow it',
      body: "Monthly review of lead quality, ad performance, and callback outcomes. We cut what's not converting and scale what is. Storm season? We surge the ads.",
      bullets: ['Monthly performance review and optimization', 'Storm season surge — we scale fast when you need it', 'Changes and updates handled within 24 hours'],
    },
  ]

  return (
    <section id="process" className="relative bg-background border-t border-divider" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-24 pb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">The Process</p>
        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight max-w-2xl" style={{ color: '#E8EEFF' }}>
          First Leads in 48 Hours. Zero Tech Knowledge Required.
        </h2>
      </div>

      <div className="relative" style={{ minHeight: '400vh' }}>
        {steps.map((s, i) => (
          <div key={i} ref={el => cardsRef.current[i] = el}
            className="sticky top-24 mx-auto max-w-6xl px-6 sm:px-10 pb-8"
            style={{ zIndex: i + 1 }}>
            <div className="rounded-2xl bg-surface border border-divider overflow-hidden shadow-2xl shadow-primary/5" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540', boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(47,111,235,0.08)' }}>
              <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="p-8 sm:p-12 lg:p-14">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-display font-black text-5xl gradient-text leading-none">{s.num}</span>
                  <div className="h-px flex-1" style={{ backgroundColor: '#1A2540' }} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">{s.eyebrow}</span>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-ink tracking-tight mb-4" style={{ color: '#E8EEFF' }}>{s.title}</h3>
                    <p className="text-muted leading-relaxed text-base sm:text-lg" style={{ color: '#64748B' }}>{s.body}</p>
                  </div>
                  {s.img ? (
                    <div>
                      <div className="rounded-xl overflow-hidden h-36 mb-4">
                        <img src={s.img} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.75)' }} />
                      </div>
                      <ul className="flex flex-col gap-3">
                        {s.bullets.map((b, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                            <span className="text-sm text-muted leading-relaxed" style={{ color: '#64748B' }}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {s.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <ChevronRight className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="text-sm text-muted leading-relaxed" style={{ color: '#64748B' }}>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── ServicesGrid ──────────────────────────────────────────────────────────────
function ServicesGrid() {
  const ref = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.svc-tile',
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true }, y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', immediateRender: false }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="included" ref={ref} className="bg-background py-24 sm:py-32 border-t border-divider" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mb-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">The System</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white max-w-2xl">
            Everything You Need. <span style={{ color: '#2F6FEB' }}>Nothing You Don't.</span>
          </h2>
          <a href="#book-call"
            className="magnetic-btn inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-sm font-semibold text-sm shadow-lg shadow-primary/20 flex-shrink-0 uppercase tracking-wide">
            Get More Roofing Jobs <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="svc-tile glow-card bg-surface border border-divider rounded-2xl p-7 transition-all duration-300 group" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
                </div>
                <h3 className="font-display font-black text-lg text-ink tracking-tight mb-2" style={{ color: '#E8EEFF' }}>{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed" style={{ color: '#64748B' }}>{s.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── TrustSignals ─────────────────────────────────────────────────────────────
function TrustSignals() {
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        ref.current?.querySelectorAll('.trust-badge').forEach((el, i) => {
          el.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        })
        obs.disconnect()
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const badges = [
    {
      icon: Clock,
      title: 'Honest strategy call',
      sub: "We'll look at your service area, your current lead flow, and tell you honestly if this makes sense for your business. If it doesn't, we'll say that.",
    },
    {
      icon: ShieldCheck,
      title: 'Exclusive leads, always',
      sub: 'Every lead we generate is yours alone. We never sell the same homeowner to multiple roofers. Your lead is your lead.',
    },
    {
      icon: Zap,
      title: 'First leads in 48 hours',
      sub: 'From strategy call to live campaign. Timeline confirmed on your call. No IT team, no tech setup on your end.',
    },
  ]

  return (
    <section ref={ref} className="relative py-24 sm:py-32 bg-background border-t border-divider overflow-hidden" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540' }}>
      <div className="orb w-[400px] h-[400px] animate-float-slow" style={{ background: 'radial-gradient(circle, rgba(47,111,235,0.09) 0%, transparent 65%)', top: '50%', right: '-100px', transform: 'translateY(-50%)' }} />
      <div className="max-w-6xl mx-auto px-6 sm:px-10 relative">
        <div className="text-center mb-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">Why Cornerstone Growth</p>
          <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight" style={{ color: '#E8EEFF' }}>
            Built for Roofers. <span className="font-serif italic font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>Not for everyone.</span>
          </h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {badges.map((b, i) => {
            const Icon = b.icon
            return (
              <div key={i} className="trust-badge glow-card rounded-2xl bg-surface border border-divider p-8"
                style={{ opacity: 0, transform: 'translateY(24px)', backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
                </div>
                <h3 className="font-display font-black text-xl text-ink tracking-tight mb-3" style={{ color: '#E8EEFF' }}>{b.title}</h3>
                <p className="text-sm text-muted leading-relaxed" style={{ color: '#64748B' }}>{b.sub}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(null)
  const items = [
    {
      q: "How is this different from HomeAdvisor or Angi?",
      a: "Night and day. HomeAdvisor sells your lead to 4 roofers at the same time — you're competing on price before you've even had a conversation. Our leads are exclusive. You're the only roofer calling that homeowner.",
    },
    {
      q: "Will the AI callback sound robotic?",
      a: "No — and that's the most common concern we hear. The AI is trained to qualify roofing leads in plain language: what's damaged, is it leaking, does the homeowner own the property, when do they want someone out. It gets the information you need and books the estimate. You get the recording so you can hear it yourself before it ever goes live.",
    },
    {
      q: "What if I already get enough referrals?",
      a: "Most roofers who say that are still missing calls, not following up on cold quotes, and leaving storm season jobs on the table. We show you exactly what's slipping through — if it's not a fit, we'll tell you. But the roofers saying that in January are usually calling us back in August after watching a competitor dominate storm season.",
    },
    {
      q: "How fast do leads come in?",
      a: "Typically within 24–48 hours of launch. Facebook ads start delivering results quickly when the targeting and creative are right — and we've done this enough to know what works in roofing markets.",
    },
    {
      q: "What happens after the AI calls them back?",
      a: "It qualifies the job: roof type, damage description, size, timeline, homeowner vs renter, insurance or cash. If they qualify, it books the estimate directly on your calendar. You show up knowing exactly what you're walking into.",
    },
    {
      q: "What if I want to pause during slow season?",
      a: "You control the ad spend. We can pause, scale down, or shift focus to different job types depending on what you need. And when storm season hits, we scale up fast — that's when this system pays for itself many times over.",
    },
  ]

  return (
    <section id="faq" className="py-24 sm:py-32 bg-background border-t border-divider" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">Questions</p>
            <h2 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-ink mb-6" style={{ color: '#E8EEFF' }}>
              Things Roofers Want to Know First.
            </h2>
            <p className="text-muted leading-relaxed mb-8" style={{ color: '#64748B' }}>
              No sales deck, no case studies from industries you don't work in. Just honest answers.
            </p>
            <a href="#book-call"
              className="magnetic-btn inline-flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-sm font-semibold text-sm shadow-lg shadow-primary/20 uppercase tracking-wide">
              Still have questions? Book a call <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="flex flex-col divide-y divide-divider border border-divider rounded-2xl overflow-hidden" style={{ borderColor: '#1A2540', backgroundColor: '#0C1220' }}>
            {items.map((item, i) => (
              <div key={i} style={{ borderColor: '#1A2540' }}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/[0.04] transition-colors duration-200">
                  <span className="font-body font-semibold text-sm leading-relaxed" style={{ color: '#E8EEFF' }}>{item.q}</span>
                  <div className="w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 border transition-all duration-200"
                    style={{ backgroundColor: open === i ? '#2F6FEB' : 'transparent', borderColor: open === i ? '#2F6FEB' : '#1A2540' }}>
                    <span className="block w-2.5 h-px bg-current relative"
                      style={{ color: open === i ? '#EEF2FF' : '#64748B' }}>
                      <span className={`absolute inset-0 w-px h-2.5 bg-current left-1/2 -translate-x-1/2 -top-[5px] transition-transform duration-200 ${open === i ? 'scale-y-0' : 'scale-y-100'}`} />
                    </span>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-60' : 'max-h-0'}`}>
                  <p className="px-6 pb-6 text-sm leading-relaxed" style={{ color: '#64748B' }}>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ContactForm / Final CTA ──────────────────────────────────────────────────

const MISS_RATE   = 0.34
const NO_CALLBACK = 0.85
const CLOSE_RATE_BY_PROJECT = {
  under5k:  0.30,
  b5to10k:  0.25,
  b10to25k: 0.20,
  b25to50k: 0.15,
  b50kplus: 0.10,
}

const REVENUE_BRACKETS = [
  { label: 'Under $50K/mo',  value: 'under-50k',  midpoint: 25_000  },
  { label: '$50K–$100K/mo',  value: '50k-100k',   midpoint: 75_000  },
  { label: '$100K–$250K/mo', value: '100k-250k',  midpoint: 175_000 },
  { label: '$250K–$500K/mo', value: '250k-500k',  midpoint: 375_000 },
  { label: '$500K+/mo',      value: '500k-plus',  midpoint: 600_000 },
]
const PROJECT_VALUE_BRACKETS = [
  { label: 'Under $5K', value: 'under-5k', midpoint: 2_500,  crKey: 'under5k'  },
  { label: '$5K–$10K',  value: '5k-10k',   midpoint: 7_500,  crKey: 'b5to10k'  },
  { label: '$10K–$25K', value: '10k-25k',  midpoint: 17_500, crKey: 'b10to25k' },
  { label: '$25K–$50K', value: '25k-50k',  midpoint: 37_500, crKey: 'b25to50k' },
  { label: '$50K+',     value: '50k-plus', midpoint: 60_000, crKey: 'b50kplus'  },
]
const CALL_VOLUME_BRACKETS = [
  { label: 'Under 50', value: 'under-50',  midpoint: 25  },
  { label: '50–100',   value: '50-100',    midpoint: 75  },
  { label: '100–250',  value: '100-250',   midpoint: 175 },
  { label: '250–500',  value: '250-500',   midpoint: 375 },
  { label: '500+',     value: '500-plus',  midpoint: 600 },
]

function ContactForm() {
  const [status, setStatus]             = useState('idle')
  const [revenue, setRevenue]           = useState('')
  const [projectVal, setProjectVal]     = useState('')
  const [callVolume, setCallVolume]     = useState('')
  const [displayedROI, setDisplayedROI] = useState(0)

  const revB  = REVENUE_BRACKETS.find(b => b.value === revenue)
  const projB = PROJECT_VALUE_BRACKETS.find(b => b.value === projectVal)
  const callB = CALL_VOLUME_BRACKETS.find(b => b.value === callVolume)

  const roiCalc = (revB && projB && callB) ? (() => {
    const lostCallers    = Math.round(callB.midpoint * MISS_RATE * NO_CALLBACK)
    const volumeProjects = Math.round(lostCallers * CLOSE_RATE_BY_PROJECT[projB.crKey])
    const currentJobs    = Math.max(1, Math.round(revB.midpoint / projB.midpoint))
    const lostProjects   = Math.min(volumeProjects, currentJobs)
    const headline       = lostProjects * projB.midpoint
    const ratio          = headline / revB.midpoint
    return { lostCallers, lostProjects, headline, ratio, projectValue: projB.midpoint }
  })() : null

  const roiValue = roiCalc?.headline ?? 0

  useEffect(() => {
    if (!roiValue) { setDisplayedROI(0); return }
    let frame
    const duration = 600
    const startTime = performance.now()
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1)
      const ease = 1 - (1 - t) ** 3
      setDisplayedROI(Math.round(roiValue * ease))
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
      services: Array.from(form.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value).join(', '),
      message: form.message.value,
    }
    const formData = new FormData()
    Object.entries(data).forEach(([k, v]) => formData.append(k, v ?? ''))
    formData.append('botcheck', '')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setStatus('sent')
        setTimeout(() => {
          window.open('https://calendly.com/dylanwang-cornerstonegrowth/30min', '_blank')
        }, 800)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="book-call" className="relative py-24 sm:py-32 lg:py-40 bg-background border-t border-divider overflow-hidden" style={{ backgroundColor: '#06080F', borderTopColor: '#1A2540' }}>
      <div className="orb w-[500px] h-[500px] animate-float-slower" style={{ background: 'radial-gradient(circle, rgba(47,111,235,0.1) 0%, transparent 65%)', bottom: '-150px', left: '-100px', animationDelay: '2s' }} />
      <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10">
        {/* CTA Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-4">The Next Step</p>
          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-ink mb-6" style={{ color: '#E8EEFF' }}>
            Get More Roofing Jobs. Starting This Week.
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed" style={{ color: '#64748B' }}>
            We'll look at your service area, your current lead flow, and show you exactly what a targeted ad campaign and 30-second callback system would do for your business.
          </p>
        </div>

        {/* Trust row */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-10 mb-16">
          {[
            { icon: '🕐', strong: 'Honest call', label: '— working session, not a pitch' },
            { icon: '✓', strong: 'Exclusive leads', label: '— never shared with competitors' },
            { icon: '⚡', strong: 'First leads in 48hrs', label: '— timeline confirmed on your call' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-surface border border-divider flex items-center justify-center text-base flex-shrink-0">
                {item.icon}
              </div>
              <span className="text-sm text-muted"><span className="text-ink font-semibold">{item.strong}</span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left */}
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-4 mb-10">
              {[
                { icon: Phone,  label: 'Phone',    value: '(407) 743-0525', href: 'tel:4077430525' },
                { icon: Mail,   label: 'Email',    value: 'dylan.cornerstonegrowth@gmail.com', href: 'mailto:dylan.cornerstonegrowth@gmail.com' },
                { icon: MapPin, label: 'Location', value: 'Remote — serving roofing contractors nationwide', href: null },
              ].map((c, i) => {
                const Icon = c.icon
                const inner = (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" strokeWidth={2.2} />
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">{c.label}</p>
                      <p className="text-sm font-medium text-ink mt-0.5">{c.value}</p>
                    </div>
                  </div>
                )
                return c.href ? <a key={i} href={c.href} className="lift-on-hover">{inner}</a> : <div key={i}>{inner}</div>
              })}
            </div>
            <div className="p-5 rounded-2xl border border-divider bg-surface" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={2.2} />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted" style={{ color: '#64748B' }}>No pressure</span>
              </div>
              <p className="text-xs text-muted leading-relaxed" style={{ color: '#64748B' }}>No contracts to sign on the call. No commitment. Just the conversation.</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-7">
            {status === 'sent' ? (
              <div className="rounded-2xl bg-surface border border-divider p-12 flex flex-col items-center justify-center text-center min-h-[440px]">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-primary" strokeWidth={2} />
                </div>
                <h3 className="font-display font-black text-2xl text-ink mb-3 tracking-tight">We'll be in touch.</h3>
                <p className="text-muted max-w-sm leading-relaxed text-sm">
                  Expect an email within one business day to schedule your free strategy call.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="rounded-2xl bg-surface border border-divider p-8 sm:p-10" style={{ backgroundColor: '#0C1220', borderColor: '#1A2540' }}>
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  {[
                    { id: 'name',    label: 'Full Name',      type: 'text',  placeholder: 'John Smith' },
                    { id: 'email',   label: 'Email Address',  type: 'email', placeholder: 'john@smithroofing.com' },
                    { id: 'phone',   label: 'Phone Number',   type: 'tel',   placeholder: '(555) 000-0000' },
                    { id: 'company', label: 'Company Name',   type: 'text',  placeholder: 'Smith Roofing LLC' },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-2">{f.label}</label>
                      <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder} required
                        className="w-full bg-surface border border-divider rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                        style={{ backgroundColor: '#0C1220', borderColor: '#1A2540', color: '#E8EEFF' }} />
                    </div>
                  ))}
                </div>

                <div className="mb-5">
                  <label htmlFor="revenue" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-2">Roughly what's your monthly revenue?</label>
                  <select id="revenue" name="revenue" required value={revenue} onChange={e => setRevenue(e.target.value)}
                    className="w-full min-h-[44px] bg-surface border border-divider rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    style={{ backgroundColor: '#0C1220', borderColor: '#1A2540', color: '#E8EEFF' }}>
                    <option value="">Select your range</option>
                    {REVENUE_BRACKETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2 mb-5">
                  <label className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-3">What are you most interested in?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Targeted Facebook Ads',
                      '30-Second AI Callback',
                      'Lead Qualification System',
                      'Estimate Booking Automation',
                      'Storm Season Surge Ads',
                      'Monthly Optimization',
                    ].map((service) => (
                      <label key={service} className="flex items-center gap-3 p-3 rounded-xl border border-divider bg-background cursor-pointer hover:border-primary/40 transition-colors" style={{ backgroundColor: '#06080F', borderColor: '#1A2540' }}>
                        <input type="checkbox" name="services" value={service}
                          className="w-4 h-4 rounded accent-primary flex-shrink-0" />
                        <span className="text-sm text-ink" style={{ color: '#E8EEFF' }}>{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 mb-5">
                  <label htmlFor="projectValue" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-2">What's your average roofing job value?</label>
                  <select id="projectValue" name="projectValue" value={projectVal} onChange={e => setProjectVal(e.target.value)}
                    className="w-full min-h-[44px] bg-surface border border-divider rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    style={{ backgroundColor: '#0C1220', borderColor: '#1A2540', color: '#E8EEFF' }}>
                    <option value="">Select your average job size</option>
                    {PROJECT_VALUE_BRACKETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>

                <div className="mb-5">
                  <label htmlFor="callVolume" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-2">
                    How many inbound calls does your business get per month?
                  </label>
                  <select
                    id="callVolume"
                    name="callVolume"
                    value={callVolume}
                    onChange={e => setCallVolume(e.target.value)}
                    className="w-full min-h-[44px] bg-surface border border-divider rounded-lg px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                    style={{ backgroundColor: '#0C1220', borderColor: '#1A2540', color: '#E8EEFF' }}
                  >
                    <option value="">Select call volume</option>
                    {CALL_VOLUME_BRACKETS.map(b => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>

                  {roiCalc && (
                    <div aria-live="polite" className="mt-3 px-5 py-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted mb-1">You could be missing out on an estimated</p>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="font-display font-black text-2xl sm:text-3xl text-primary tracking-tight">
                          {displayedROI >= 1_000_000
                            ? `$${(displayedROI / 1_000_000).toFixed(2)}M`
                            : `$${displayedROI.toLocaleString()}`}
                        </span>
                        <span className="text-base font-semibold text-primary">/mo</span>
                        <span className="text-xs text-muted ml-1">in roofing jobs from missed calls.</span>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed mb-1">
                        ~{roiCalc.lostCallers} missed callers a month → roughly {roiCalc.lostProjects} lost {roiCalc.lostProjects === 1 ? 'job' : 'jobs'} × ${roiCalc.projectValue.toLocaleString()} average job value
                      </p>
                      <p className="text-[11px] text-white/40 leading-relaxed italic">
                        {roiCalc.ratio < 0.25
                          ? `That's an extra ${Math.round(roiCalc.ratio * 100)}% on top of your current monthly revenue.`
                          : roiCalc.ratio < 1
                            ? `That's ${Math.round(roiCalc.ratio * 100)}% of your current monthly revenue walking out the door.`
                            : `That's enough demand to double your business — every one of those callers hired someone else.`
                        }
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-2">Tell us about your business</label>
                  <textarea id="message" name="message" rows={4}
                    placeholder="What's your service area? How do you currently get leads — referrals, Google, nothing? What's your busiest season?"
                    className="w-full bg-surface border border-divider rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                    style={{ backgroundColor: '#0C1220', borderColor: '#1A2540', color: '#E8EEFF' }} />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-400 mb-4 text-center">Something went wrong — please email us directly at <a href="mailto:dylanwang.ouro@gmail.com" className="underline">dylanwang.ouro@gmail.com</a></p>
                )}
                <button type="submit" disabled={status === 'sending'}
                  className="magnetic-btn btn-shimmer w-full inline-flex items-center justify-center gap-2 text-white py-4 rounded-xl font-semibold shadow-xl shadow-primary/25 disabled:opacity-60 transition-opacity">
                  {status === 'sending' ? (
                    <><Activity className="h-4 w-4 animate-pulse" strokeWidth={2.4} /> Sending…</>
                  ) : (
                    <>Get More Roofing Jobs <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-deep text-white py-14 sm:py-18 border-t border-divider" style={{ backgroundColor: '#030407', borderTopColor: '#1A2540' }}>
      <div className="max-w-6xl mx-auto px-6 sm:px-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-display font-black text-xl text-white tracking-wide mb-3">CORNERSTONE GROWTH</div>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-5">
              More roofing jobs. Less chasing. Built for owner-operated roofing contractors.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary ring-pulse" />
              <span className="font-mono text-[10px] text-white/40">All systems operational</span>
            </div>
          </div>

          {/* System */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-4">System</p>
            <ul className="flex flex-col gap-3">
              {['Facebook Ad Campaigns', 'AI Lead Callback', 'Lead Qualification', 'Estimate Booking', 'Monthly Optimization'].map(s => (
                <li key={s}>
                  <a href="#included" className="text-sm text-white/50 hover:text-white lift-on-hover transition-colors py-1 inline-block">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 mb-4">Company</p>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'How It Works', href: '#process' },
                { label: 'Get More Jobs',  href: '#book-call' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-sm text-white/50 hover:text-white lift-on-hover transition-colors py-1 inline-block">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-white/25">© {new Date().getFullYear()} Cornerstone Growth. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="font-mono text-[10px] text-white/25 hover:text-white/60 transition-colors lift-on-hover">Privacy</Link>
            <Link to="/terms"   className="font-mono text-[10px] text-white/25 hover:text-white/60 transition-colors lift-on-hover">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 500)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pillars />
        <Problem />
        <Solution />
        <Protocol />
        <ServicesGrid />
        <TrustSignals />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}
