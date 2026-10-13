import { Link } from 'react-router-dom'
import '../cg.css'

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5c93f5] hover:text-[#5c93f5]-light transition-colors mb-10 inline-block">
          ← Back to home
        </Link>
        <h1 className="font-bold tracking-tight text-4xl text-ink mb-6 tracking-tight">Terms of Service</h1>
        <p className="text-muted text-sm mb-8">Last updated: January 2025</p>
        <div className="prose prose-invert max-w-none">
          <p className="text-muted leading-relaxed mb-6">
            By using Cornerstone Growth's services, you agree to these terms. Please read them carefully.
          </p>
          <h2 className="font-bold tracking-tight text-xl text-ink mt-8 mb-3 tracking-tight">Services</h2>
          <p className="text-muted leading-relaxed mb-6">
            Cornerstone Growth provides AI voice agent services for general contractors. Service details are outlined in individual agreements.
          </p>
          <h2 className="font-bold tracking-tight text-xl text-ink mt-8 mb-3 tracking-tight">Limitation of Liability</h2>
          <p className="text-muted leading-relaxed mb-6">
            Our liability is limited to the fees paid for services in the prior 30 days.
          </p>
          <h2 className="font-bold tracking-tight text-xl text-ink mt-8 mb-3 tracking-tight">Contact Us</h2>
          <p className="text-muted leading-relaxed">
            Questions about these terms? Contact us at hello@cornerstonegrowth.ai.
          </p>
        </div>
      </div>
    </div>
  )
}
