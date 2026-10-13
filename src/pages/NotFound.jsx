import { Link } from 'react-router-dom'
import '../cg.css'

export default function NotFound() {
  return (
    <div className="cg cg-legal">
      <div className="lg-top"><div className="wrap"><Link to="/"><img src="/cornerstone_growth_logo.png" alt="Cornerstone Growth" /></Link></div></div>
      <div className="nf"><div>
        <p className="kicker" style={{ color: 'var(--blue2)' }}>/ 404</p>
        <h1>This page<br /><em>doesn't exist.</em></h1>
        <p style={{ color: 'rgba(226,233,246,.7)', margin: '16px 0 26px' }}>The link may be old or mistyped.</p>
        <Link to="/" className="btn btn-lg">Back to the homepage</Link>
      </div></div>
    </div>
  )
}
