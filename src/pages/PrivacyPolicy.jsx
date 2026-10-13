import { Link } from 'react-router-dom'
import '../cg.css'

export default function PrivacyPolicy() {
  return (
    <div className="cg min-h-screen text-ink"  style={{ backgroundColor: '#0a1020' }}>
      {/* Minimal nav */}
      <div className="border-b border-white/5" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <img src="/cornerstone_growth_logo.png" alt="Cornerstone Growth" className="h-9 w-auto" />
          </Link>
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5c93f5] hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="font-bold tracking-tight text-4xl sm:text-5xl text-white tracking-tight mb-4">Privacy Policy</h1>

        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5c93f5] mb-2">Cornerstone Growth</div>
        <div className="text-sm text-white/50 mb-1">Operated by Dylan Wang LLC</div>
        <div className="text-sm text-white/50 mb-1">Website: https://www.cornerstonegrowth.us</div>
        <div className="text-sm text-white/50 mb-1">Email: dylan.cornerstonegrowth@gmail.com</div>
        <div className="text-sm text-white/50 mb-6">Phone: 407-743-0525</div>

        <div className="flex gap-6 mb-12 pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-1">Effective Date</div>
            <div className="text-sm text-white/60">July 6, 2026</div>
          </div>
          <div>
            <div className="font-mono text-[9px] uppercase tracking-widest text-white/30 mb-1">Last Updated</div>
            <div className="text-sm text-white/60">July 6, 2026</div>
          </div>
        </div>

        <div className="space-y-10">

          <Section title="1. Introduction">
            <p>Cornerstone Growth ("Company," "we," "us," or "our") provides digital marketing services to contractors and home services businesses, including but not limited to Facebook advertising campaign management, lead generation, automated SMS/email follow-up systems, appointment scheduling, and customer relationship management support (the "Services").</p>
            <p>This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit our website, interact with our advertising campaigns, submit information through our lead forms, or communicate with us or our clients through SMS, email, or phone.</p>
            <p>By using our website or submitting your information through any form, ad, or communication channel associated with Cornerstone Growth or our clients, you agree to the terms of this Privacy Policy.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We may collect the following categories of information:</p>
            <SubHeading>Information you provide directly:</SubHeading>
            <ul>
              <li>Name, phone number, email address, and mailing/service address</li>
              <li>Responses to lead qualification questions (e.g., type of service needed, timeline, property ownership status)</li>
              <li>Communications you send us via SMS, email, contact forms, or phone</li>
            </ul>
            <SubHeading>Information collected automatically:</SubHeading>
            <ul>
              <li>IP address, browser type, device type, and operating system</li>
              <li>Pages visited, time spent on site, and referring URLs</li>
              <li>Cookies and similar tracking technologies (see Section 5)</li>
            </ul>
            <SubHeading>Information from third-party platforms:</SubHeading>
            <ul>
              <li>Information submitted through Meta (Facebook/Instagram) Lead Ads</li>
              <li>Engagement data from advertising platforms used to manage and optimize campaigns</li>
            </ul>
            <p>We do not knowingly collect information from individuals under the age of 18.</p>
          </Section>

          <Section title="3. How We Use Information">
            <p>We use collected information to:</p>
            <ul>
              <li>Respond to and follow up on service inquiries and lead form submissions</li>
              <li>Schedule, confirm, and remind you of appointments</li>
              <li>Qualify leads on behalf of our contractor clients</li>
              <li>Send you requested information about services</li>
              <li>Improve our advertising targeting, website, and service delivery</li>
              <li>Communicate updates, confirmations, and relevant service-related information via SMS, email, or phone</li>
              <li>Comply with legal obligations and enforce our agreements</li>
            </ul>
            <p>We do not use the information we collect to make automated decisions that produce legal or similarly significant effects concerning individuals.</p>
          </Section>

          <Section title="4. SMS & Communications Policy">
            <p>By providing your phone number through a lead form, website, or other intake method, you consent to receive SMS text messages and/or phone calls from Cornerstone Growth and/or the contractor client on whose behalf we operate, related to your inquiry, appointment scheduling, service follow-up, and related updates.</p>
            <p><strong>Message frequency</strong> may vary based on your interaction with us (e.g., appointment reminders, follow-up sequences).</p>
            <p><strong>Message and data rates may apply.</strong></p>
            <p><strong>Opt-In:</strong> You opt in to receive SMS communications by submitting your phone number through our lead forms, website, or by otherwise providing consent (verbally or in writing) to be contacted via text message.</p>
            <p><strong>Opt-Out:</strong> You may opt out of receiving SMS messages at any time by replying STOP to any message you receive. Upon opting out, you will receive one final confirmation message, and no further messages will be sent unless you opt back in.</p>
            <p><strong>Help:</strong> Reply HELP to any message for assistance, or contact us directly at dylan.cornerstonegrowth@gmail.com or 407-743-0525.</p>
            <p><strong>Carriers are not liable for delayed or undelivered messages.</strong></p>
            <p><strong>No mobile information will be shared with third parties or affiliates for marketing/promotional purposes.</strong> All other categories of information excluded from this term will be subject to the general terms outlined in this Privacy Policy. This includes, but is not limited to, text messaging originator opt-in data and consent; this information will not be shared with any third parties for marketing or promotional purposes under any circumstances.</p>
          </Section>

          <Section title="5. Data Sharing Policy">
            <p>We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.</p>
            <p>We may share information with:</p>
            <ul>
              <li><strong>Service providers</strong> who perform functions on our behalf (e.g., GoHighLevel, Meta/Facebook, hosting providers), solely to enable delivery of our Services</li>
              <li><strong>The contractor client</strong> whose ad or form you responded to, so they can follow up regarding your service request</li>
              <li><strong>Legal authorities</strong>, if required to comply with applicable law, regulation, legal process, or governmental request</li>
            </ul>
            <p>As stated above, SMS opt-in consent and mobile phone numbers are never shared with third parties or affiliates for marketing or promotional purposes, under any circumstances.</p>
          </Section>

          <Section title="6. Cookies & Tracking Technologies">
            <p>Our website may use cookies, pixels (including the Meta Pixel), and similar tracking technologies to:</p>
            <ul>
              <li>Understand how visitors interact with our website</li>
              <li>Measure the effectiveness of our advertising campaigns</li>
              <li>Retarget website visitors with relevant ads</li>
            </ul>
            <p>You can control or disable cookies through your browser settings. Disabling cookies may affect the functionality of certain website features.</p>
          </Section>

          <Section title="7. Data Security">
            <p>We implement reasonable administrative, technical, and physical safeguards designed to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </Section>

          <Section title="8. Third-Party Services">
            <p>We use GoHighLevel, a third-party customer relationship management (CRM) and marketing automation platform, to process and manage lead information, automate SMS/email communications, and schedule appointments on our behalf and on behalf of our clients. GoHighLevel acts as a data processor and is contractually and technically restricted from using your information for purposes outside of providing these services.</p>
            <p>We may also use Meta (Facebook/Instagram) advertising tools to run and manage ad campaigns. Information you submit through Meta Lead Ads is subject to both this Privacy Policy and Meta's own privacy policy.</p>
          </Section>

          <Section title="9. Your Rights">
            <p>Depending on your state of residence, you may have the right to:</p>
            <ul>
              <li>Request access to the personal information we hold about you</li>
              <li>Request correction or deletion of your personal information</li>
              <li>Opt out of SMS or email communications at any time</li>
              <li>Request information about how your data has been shared</li>
            </ul>
            <p>To exercise any of these rights, contact us at dylan.cornerstonegrowth@gmail.com or 407-743-0525.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. The "Last Updated" date at the top of this page will reflect the most recent revision. Continued use of our website or Services after changes are posted constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="11. Contact Information">
            <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
            <div className="mt-4 p-5 rounded-xl border border-white/8 space-y-1" style={{ background: 'rgba(47,111,235,0.06)', borderColor: 'rgba(255,255,255,.08)' }}>
              <div className="font-semibold text-white">Cornerstone Growth</div>
              <div className="text-white/60 text-sm">Operated by Dylan Wang LLC</div>
              <div className="text-white/60 text-sm">3219 South Orange Ave, Orlando, FL 32806</div>
              <div className="text-white/60 text-sm">Email: <a href="mailto:dylan.cornerstonegrowth@gmail.com" className="text-[#5c93f5] hover:text-white transition-colors">dylan.cornerstonegrowth@gmail.com</a></div>
              <div className="text-white/60 text-sm">Phone: <a href="tel:4077430525" className="text-[#5c93f5] hover:text-white transition-colors">407-743-0525</a></div>
              <div className="text-white/60 text-sm">Website: <a href="https://www.cornerstonegrowth.us" className="text-[#5c93f5] hover:text-white transition-colors">https://www.cornerstonegrowth.us</a></div>
            </div>
          </Section>

        </div>

        <div className="mt-16 pt-8 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
          <p className="font-mono text-[10px] text-white/25">© {new Date().getFullYear()} Cornerstone Growth. All rights reserved.</p>
          <Link to="/" className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#5c93f5] hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="pb-8 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,.08)' }}>
      <h2 className="font-bold tracking-tight text-xl text-white tracking-tight mb-4">{title}</h2>
      <div className="space-y-4 text-white/60 leading-relaxed text-sm">{children}</div>
    </div>
  )
}

function SubHeading({ children }) {
  return <p className="font-semibold text-white/80 mt-4 mb-1">{children}</p>
}
