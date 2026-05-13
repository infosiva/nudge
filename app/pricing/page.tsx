import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing — Tutiq | AI Tutor for GCSE, 11+ & Interview Prep',
  description: 'Start learning free. Upgrade to Pro for $8/mo — unlimited AI tutoring sessions across all subjects, GCSE, 11+, and interview prep.',
  openGraph: {
    title: 'Tutiq Pricing — Free AI Tutor',
    description: 'Free forever plan with 3 sessions. Pro at $8/mo for unlimited tutoring in every subject.',
  },
}

const FREE_FEATURES = [
  '3 free AI sessions',
  'GCSE, 11+ & Interview tracks',
  'All subjects available',
  'Exam-board aligned',
  'No account needed to start',
]

const PRO_FEATURES = [
  'Unlimited AI sessions',
  'Progress tracking',
  'All 3 learning tracks',
  'GCSE, A-Level & 11+ prep',
  'Interview mock sessions',
  'Priority AI speed',
]

const FAQ = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes — cancel from your dashboard, no questions asked. You keep Pro access until end of billing period.',
  },
  {
    q: 'What subjects are supported?',
    a: 'Maths, English, Science, History, Geography for GCSE; Verbal/Non-Verbal Reasoning for 11+; Tech DSA, NHS, Law, General interviews for Interview Prep.',
  },
  {
    q: 'Is it suitable for my child?',
    a: 'Yes. Tutiq adapts explanations to the learner\'s age and level — from Year 9 students to adult professionals preparing for job interviews.',
  },
  {
    q: 'How does the AI tutoring work?',
    a: 'Powered by Claude and Groq LLMs — your child asks questions, the AI explains patiently at their level. No time limits, no judgment.',
  },
  {
    q: 'Is the free plan really free forever?',
    a: 'Yes. No credit card required. Free plan gives you 3 AI sessions — enough to see how the tutor works before deciding.',
  },
  {
    q: 'What is the refund policy?',
    a: 'We offer a 7-day money-back guarantee. If you\'re not happy, email us and we\'ll refund immediately.',
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #080712 0%, #0a1a12 50%, #080712 100%)' }}>
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition">← Tutiq</Link>
        <Link href="/?upgrade=true" className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition">
          Start Pro →
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300 mb-6">
            ⚡ Simple pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            AI tutoring for every student.{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Start free.
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            GCSE, 11+ prep, interview coaching. Patient AI that explains at your level. Upgrade only when you need more.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-20">
          {/* Free */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-white/25 mb-2">Free</div>
            <div className="text-5xl font-black text-white/40 mb-1">$0</div>
            <div className="text-xs text-white/20 mb-8">forever</div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/40">
                  <span className="text-white/20">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/" className="block w-full py-3 rounded-xl text-center text-sm font-semibold border border-white/10 text-white/40 hover:bg-white/5 transition">
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/20 p-8 relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
              Most Popular
            </span>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Pro</div>
            <div className="text-5xl font-black text-white mb-1">$8</div>
            <div className="text-xs text-emerald-500 mb-8">/month · cancel anytime</div>
            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-emerald-400">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/?upgrade=true" className="block w-full py-3 rounded-xl text-center text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition text-white">
              Start Pro — $8/mo →
            </Link>
            <p className="text-[10px] text-center text-white/25 mt-3">7-day money-back guarantee</p>
          </div>
        </div>

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/30 mb-20">
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-400">★★★★★</span> 4.8/5 rating
          </span>
          <span>·</span>
          <span>1,800+ active students</span>
          <span>·</span>
          <span>GCSE, 11+ & Interview tracks</span>
          <span>·</span>
          <span>No credit card for free plan</span>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-1">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group border-b border-white/[0.06] py-4">
                <summary className="cursor-pointer font-semibold text-sm text-white/70 group-open:text-white transition list-none flex items-center justify-between">
                  {q}
                  <span className="text-white/30 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-white/40 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-white/30 text-sm mb-4">Still not sure? Start free — no credit card needed.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition text-white">
            Start learning free →
          </Link>
        </div>
      </div>
    </main>
  )
}
