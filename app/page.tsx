import Link from 'next/link'
import { ArrowRight, CheckCircle, BrainCircuit, BookOpen, Layers } from 'lucide-react'
import _config from '@/vertical.config'
import type { AiToolConfig } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import AdUnit from '@/components/AdUnit'
const config = _config as AiToolConfig

const HOW_IT_WORKS = [
  {
    icon: '👤',
    step: '1',
    title: 'Tell us your age & goal',
    desc: 'Share your name, age, and what you want to learn. No account needed — 60-second setup.',
  },
  {
    icon: '🗺️',
    step: '2',
    title: 'AI builds your learning path',
    desc: 'Tutiq creates a personalised sequence of topics tuned to your age and level.',
  },
  {
    icon: '✅',
    step: '3',
    title: 'Learn topic by topic, quiz after each',
    desc: 'Bite-sized lessons at your own pace. A quick quiz after each topic locks the knowledge in.',
  },
]

const AGE_GROUPS = [
  {
    label: 'Kids',
    emoji: '🧒',
    age: 'Ages 5 – 12',
    desc: 'Simple words, colourful examples, short lessons. Tutiq speaks their language.',
    color: 'border-emerald-500/30 bg-emerald-500/5',
    accent: 'text-emerald-300',
  },
  {
    label: 'Teens',
    emoji: '🧑',
    age: 'Ages 13 – 17',
    desc: 'Engaging, relatable, never preachy. Real-world connections keep teens curious.',
    color: 'border-cyan-500/30 bg-cyan-500/5',
    accent: 'text-cyan-300',
  },
  {
    label: 'Adults',
    emoji: '🧑‍💼',
    age: 'Ages 18+',
    desc: 'Concise and professional. Skips basics you already know, goes to what matters.',
    color: 'border-violet-500/30 bg-violet-500/5',
    accent: 'text-violet-300',
  },
]

export default function HomePage() {
  const subjects = config.subjects.slice(0, 8)

  return (
    <div className="overflow-hidden">

      {/* ── HERO — Warm Editorial Learning ──────────────────── */}
      <section className="relative px-6 pt-14 pb-20 overflow-hidden">
        {/* Subtle warm radial glow top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full opacity-[0.12] blur-3xl -z-10"
          style={{ background: 'radial-gradient(ellipse at top right, #f59e0b 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Left: editorial headline + trust */}
          <div className="fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold mb-7"
              style={{ borderColor: 'rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.08)', color: 'rgba(253,230,138,0.85)' }}>
              📚 Personalised for any age
            </div>

            {/* Headline — warm editorial, mix of white + amber gradient */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              <span className="text-white block">Learn smarter,</span>
              <span className="block"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #fde68a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                not harder.
              </span>
            </h1>

            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Tutiq builds a personalised AI learning path that adapts to your age, level, and pace — whether you&apos;re 8 or 80.
            </p>

            {/* Trust pills row */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['No sign-up', 'Any age'].map(t => (
                <span key={t} className="rounded-full border px-4 py-1 text-sm font-medium"
                  style={{ borderColor: 'rgba(245,158,11,0.25)', color: 'rgba(253,230,138,0.70)', background: 'rgba(245,158,11,0.07)' }}>
                  · {t}
                </span>
              ))}
            </div>

            {/* CTA */}
            <Link href="/onboard"
              className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-stone-900 transition-all hover:brightness-110 hover:scale-105"
              style={{ background: '#f59e0b' }}>
              Start Learning Free <ArrowRight size={18} />
            </Link>

            {/* Feature checks */}
            <div className="flex flex-col gap-2 mt-6">
              {['No account needed — start in 60 seconds', 'Adapts to any age: 5 to 80+', 'Quiz after each topic to lock knowledge in'].map(f => (
                <span key={f} className="flex items-center gap-2 text-sm text-white/45">
                  <CheckCircle size={14} className={theme.textAccent} />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Right: lesson card mockup */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full max-w-sm float">
              {/* Warm amber glow behind card */}
              <div className="absolute inset-x-6 bottom-0 h-32 rounded-full blur-2xl opacity-25"
                style={{ background: '#f59e0b' }} />
              {/* Glass lesson card */}
              <div className="relative rounded-2xl border p-6"
                style={{
                  background: 'rgba(245,158,11,0.06)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(245,158,11,0.20)',
                }}>
                {/* Card header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🔬</span>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: 'rgba(253,230,138,0.70)' }}>Science · Grade 8</div>
                    <div className="text-[10px] text-white/30">Lesson 3 of 6</div>
                  </div>
                  <span className="ml-auto text-[10px] font-bold rounded-full px-2 py-0.5"
                    style={{ background: 'rgba(245,158,11,0.18)', color: '#fde68a' }}>In Progress</span>
                </div>

                {/* Lesson paragraph */}
                <div className="rounded-xl border p-4 mb-5"
                  style={{ borderColor: 'rgba(245,158,11,0.12)', background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-sm text-white/70 leading-relaxed">
                    <span className="font-semibold text-white">Photosynthesis</span> is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of glucose...
                  </p>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">Progress</span>
                  <div className="flex gap-1.5 ml-auto">
                    {[true, true, true, false, false, false].map((done, i) => (
                      <div key={i} className={`h-2 rounded-full transition-all ${done ? 'w-6' : 'w-2'}`}
                        style={{ background: done ? '#f59e0b' : 'rgba(255,255,255,0.12)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-8 glass">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '10k+', l: 'Learners' },
            { n: '8',    l: 'Subjects' },
            { n: 'Any',  l: 'Age group' },
            { n: '£0',   l: 'Always free' },
          ].map(s => (
            <div key={s.l}>
              <div className={`text-2xl font-extrabold ${theme.gradientText}`}>{s.n}</div>
              <div className="text-white/45 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AGE GROUPS ──────────────────────────────────────── */}
      <section className="py-14 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest ${theme.textAccent} mb-3`}>
            <Layers size={12} /> Who it&apos;s for
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Built for every learner</h2>
          <p className="text-white/40 text-sm">AI adapts the language, depth, and pace to your age and level</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AGE_GROUPS.map(g => (
            <div key={g.label} className={`p-6 rounded-2xl border ${g.color}`}>
              <div className="text-4xl mb-3">{g.emoji}</div>
              <div className={`text-[10px] font-bold uppercase tracking-widest ${g.accent} mb-1`}>{g.age}</div>
              <h3 className="font-bold text-white text-base mb-2">{g.label}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{g.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how-it-works" className="py-14 px-6 glass border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest ${theme.textAccent} mb-3`}>
              <BookOpen size={12} /> How it works
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Simple. Personalised. Effective.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="relative pl-6 border-l border-white/[0.08]">
                <div className={`absolute left-0 top-0 -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-xs font-black text-white`}>
                  {step.step}
                </div>
                <div className="text-2xl mb-3">{step.icon}</div>
                <h3 className="font-bold text-white text-sm mb-2">{step.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS GRID ───────────────────────────────────── */}
      <section id="subjects" className="py-14 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-white mb-2">What do you want to learn?</h2>
          <p className="text-white/40 text-sm">Pick a subject and AI builds your personal learning path</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {subjects.map(subject => (
            <Link
              key={subject.id}
              href={`/onboard?subject=${subject.id}`}
              className={`${theme.card} ${theme.cardHover} p-4 flex flex-col gap-2 text-center items-center rounded-2xl transition-all group border border-white/[0.06] hover:border-emerald-500/30`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{subject.icon}</span>
              <span className="font-semibold text-white text-sm">{subject.label}</span>
              <span className="text-white/30 text-xs leading-snug hidden sm:block">{subject.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AD UNIT ─────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-4">
        <AdUnit slot="homepage-mid" format="banner" />
      </div>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-14 px-6 glass border-t border-white/[0.06]">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-4xl mb-4">🌱</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">Start learning today</h2>
          <p className="text-white/45 mb-6 text-sm">No account. No credit card. Just learning — at your pace.</p>
          <Link href="/onboard" className={btn.primary + ' text-base px-10 py-4'}>
            Start Learning Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
