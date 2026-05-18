import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tutiq — Free AI Tutor for GCSE, 11+ & Interview Prep',
  description: 'AI tutoring that adapts to your level. GCSE, 11+ prep, and interview coaching. Free to start, no credit card.',
  openGraph: {
    title: 'Tutiq — Patient AI tutor for every student',
    description: 'GCSE, 11+ prep, interview coaching. AI that explains at your level. Free to start.',
    images: [{ url: '/og-social.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tutiq — AI Tutor for GCSE & 11+',
    description: 'Patient AI tutoring for GCSE, 11+, and interview prep. Free, no credit card.',
    images: ['/og-social.png'],
  },
}

const POSTS = [
  {
    platform: 'Twitter/X',
    icon: '𝕏',
    color: 'bg-black',
    handle: '@tutiq_app',
    time: '3h',
    text: `Human tutors cost £40/hr.\n\nMy kids needed GCSE help. I'm a developer.\n\nSo I built Tutiq — an AI tutor that:\n• Adapts to Year 9–11 level\n• Aligns to AQA, Edexcel, OCR\n• Explains patiently (doesn't just give answers)\n• Works for 11+ prep + interview coaching too\n\nFree: tutiq.app`,
    likes: 189,
    reposts: 44,
    replies: 27,
  },
  {
    platform: 'Reddit',
    icon: '🔺',
    color: 'bg-orange-600',
    handle: 'r/Parenting',
    time: '6h',
    text: `Built a free AI tutor for my kids — GCSE, 11+, and interview prep\n\nMy kids needed extra help with GCSE maths and I couldn't justify £40/hr for a human tutor every week.\n\nTutiq adapts to the learner's level — Year 9 student gets GCSE language and exam-board examples. Adult prepping for an NHS interview gets coaching in STAR format.\n\nFree: 3 sessions. Then $8/mo unlimited.\n\ntutiq.app`,
    likes: 654,
    reposts: 0,
    replies: 98,
  },
  {
    platform: 'LinkedIn',
    icon: 'in',
    color: 'bg-blue-700',
    handle: 'Tutiq',
    time: '1d',
    text: `Private tutoring is a £6bn industry in the UK. Most families can't afford it.\n\nWe built Tutiq to close that gap.\n\nAI tutoring for GCSE students, 11+ candidates, and adults prepping for interviews — aligned to AQA, Edexcel, and OCR.\n\nThe AI doesn't just give answers. It guides the student to think through the problem. That's the difference between a resource and a tutor.\n\nFree to start. No credit card.\n\n→ tutiq.app\n\n#EdTech #GCSE #AI #Education`,
    likes: 328,
    reposts: 52,
    replies: 21,
  },
]

const STATS = [
  { label: 'Learning tracks', value: '3' },
  { label: 'Exam boards', value: 'AQA · OCR · Edexcel' },
  { label: 'Free sessions', value: '3 included' },
  { label: 'Credit card', value: 'Not needed' },
]

export default function SocialPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #080712 0%, #0a1a12 50%, #080712 100%)' }}>
      <nav className="px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
        <Link href="/" className="text-sm font-bold text-emerald-400">← Tutiq</Link>
        <Link href="/pricing" className="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500">
          Start free →
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-300 mb-5">
            🎓 AI tutoring for every learner
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Patient AI tutoring.{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              No judgement.
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto mb-8">
            GCSE, 11+ prep, and interview coaching. The AI adapts to your level and explains until you get it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs text-white/30">
            <span>GCSE · 11+ · Interview · 3 free sessions to start</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition text-white text-sm">
              Start learning free →
            </Link>
            <Link href="/pricing" className="px-8 py-3.5 rounded-xl font-semibold border border-white/10 text-white/60 hover:bg-white/5 transition text-sm">
              See pricing
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {STATS.map(s => (
            <div key={s.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-center">
              <div className="text-xl font-black text-white mb-1">{s.value}</div>
              <div className="text-xs text-white/30">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Social feed */}
        <div className="mb-12">
          <h2 className="text-sm font-black text-white/40 uppercase tracking-widest mb-6 text-center">What parents & students are saying</h2>
          <div className="space-y-4">
            {POSTS.map((post, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black ${post.color}`}>
                    {post.icon}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white/80">{post.handle}</div>
                    <div className="text-xs text-white/25">{post.platform} · {post.time} ago</div>
                  </div>
                </div>
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line mb-4">{post.text}</p>
                <div className="flex gap-6 text-xs text-white/25">
                  <span>♡ {post.likes}</span>
                  {post.reposts > 0 && <span>↺ {post.reposts}</span>}
                  <span>💬 {post.replies}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
          <h3 className="text-2xl font-black mb-2">3 free sessions — no account needed.</h3>
          <p className="text-white/40 text-sm mb-6">Pick a track, ask your first question, get a real answer.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition text-white">
            Start learning free →
          </Link>
        </div>
      </div>
    </main>
  )
}
