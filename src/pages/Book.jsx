import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, ArrowDown } from 'lucide-react'
import '../cg.css'
import { CalendlyInline, Results, FAQ } from '../App.jsx'
import { reportVisit } from '../visit'

/* /book: the ad landing page. One job, booking a call, so no menu and no
 * exits: hook + proof, three steps, the calendar, Jones results, FAQ. */
export default function Book() {
  useEffect(() => { document.title = 'Book a Free Strategy Call · Cornerstone Growth'; reportVisit('cornerstone') }, [])
  return (
    <div className="cg cg-book">
      <header className="bk-top"><div className="wrap"><Link to="/"><img src="/cornerstone_growth_logo.png" alt="Cornerstone Growth" /></Link><span className="mono" style={{ color: 'rgba(226,233,246,.6)' }}>For roofing contractors</span></div></header>
      <section className="cg-hero bk-hero">
        <div className="bg" role="img" aria-label="Roofing crew on a job site" />
        <div className="shade" />
        <div className="wrap in">
          <div>
            <p className="eyebrow">FREE 30-MINUTE STRATEGY CALL</p>
            <h1 style={{ fontSize: 'clamp(2.6rem, 5.4vw, 4.4rem)' }}>More roofing jobs<br />from Facebook.<br /><em>Without chasing leads.</em></h1>
            <p className="lead">We run the ads, text you every lead in seconds and follow up until it's booked. On this call we map out what that would look like in your market.</p>
            <p className="hero-risk" style={{ marginTop: 18 }}><ShieldCheck size={15} /> Free · No contracts · Exclusive leads, never shared</p>
            <div className="proof glass" style={{ marginTop: 18 }}>
              <div><b>21</b><small>leads in one campaign</small></div>
              <div><b>$11.97</b><small>per lead</small></div>
              <div><b>84%</b><small>lower cost per lead</small></div>
              <span className="proof-src">Jones Roofing Solutions · Central Florida · Meta Ads Manager</span>
            </div>
            <a href="#calendar" className="btn btn-lg" style={{ marginTop: 22 }}>Pick a time <ArrowDown /></a>
          </div>
          <div id="calendar"><CalendlyInline where="book-page" height={660} /></div>
        </div>
      </section>
      <section className="cg-sec cg-light" style={{ paddingTop: 80, paddingBottom: 40 }}>
        <div className="wrap">
          <p className="kicker">/ What happens on the call</p>
          <h2 className="display" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 2.8rem)' }}>30 minutes.<br /><em>You leave with a plan.</em></h2>
          <div className="bk-steps">
            <div><b>01</b><h3>Your market</h3><p>Service area, job types and what a lead is worth to you.</p></div>
            <div><b>02</b><h3>Where jobs slip</h3><p>How fast leads get answered today and what that costs.</p></div>
            <div><b>03</b><h3>Your plan</h3><p>The campaign, follow-up and realistic numbers. If it's not a fit, we'll say so.</p></div>
          </div>
          <p className="hero-risk" style={{ color: 'var(--muted)', marginTop: 18 }}><Clock size={15} /> Booking takes under a minute.</p>
        </div>
      </section>
      <Results />
      <FAQ />
      <footer className="cg-foot"><div className="wrap"><div className="bottom"><span>© {new Date().getFullYear()} Cornerstone Growth</span><div><Link to="/">Home</Link><Link to="/privacy-policy">Privacy</Link><Link to="/terms">Terms</Link></div></div></div></footer>
    </div>
  )
}
