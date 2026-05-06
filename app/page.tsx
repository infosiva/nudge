import Link from 'next/link'
import { ArrowRight, CheckCircle, BookOpen, BrainCircuit, Trophy } from 'lucide-react'
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
    desc: 'Share your name, age, and what you want to learn. No account needed · Join 10,000+ learners who've already started learning with Nudge — just a quick 60-second setup.',
  },
  {
    icon: '🗺️',
    step: '2',
    title: 'AI builds your learning path',
    desc: 'Nudge creates a personalised sequence of topics tuned to your age and level — not a generic syllabus.',
  },
  {
    icon: '✅',
    step: '3',
    title: 'Learn topic by topic, quiz after each',
    desc: 'Work through bite-sized lessons at your own pace. A quick quiz after each topic locks the knowledge in.',
  },
]

const AGE_GROUPS = [
  {
    label: 'Kids',
    emoji: '🧒',
    age: 'Ages 5 – 12',
    desc: 'Simple words, colourful examples, emojis, and short lessons. Nudge speaks their language — never talks down.',
  },
  {
    label: 'Teens',
    emoji: '🧑',
    age: 'Ages 13 – 17',
    desc: 'Engaging, relatable, never preachy. Real-world connections to keep teens curious and actually interested.',
  },
  {
    label: 'Adults',
    emoji: '🧑‍💼',
    age: 'Ages 18+',
    desc: 'Concise and professional. Nudge skips the basics you already know and goes straight to what matters.',
  },
]

export default function HomePage() {
  const subjects = config.subjects.slice(0, 8)

  return (
    <div className="overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative px-6 pt-20 pb-28 max-w-6xl mx-auto text-center">
        {/* Decorative blob */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-3xl -z-10 bg-gradient-to-br ${theme.gradient}`} />

        <div className="fade-up">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-8`}>
            <BrainCircuit size={12} />
            AI Tutor · Adapts to Your Age & Level · Free
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="text-white">The AI that</span>{' '}
            <span className={theme.gradientText}>nudges you forward</span>
          </h1>

          <p className="text-white/55 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Share your age and learning goals with Nudge. It creates a tailored learning path, so you can learn at your own pace and achieve your goals.
            and teaches at your pace — whether you&apos;re 8 or 80.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboard" className={btn.primary + ' text-base px-10 py-4'}>
              Get Started with Free Learning <ArrowRight size={18} />
            </Link>
            <Link href="#how-it-works" className={btn.secondary + ' text-base px-10 py-4'}>
              How it works
            </Link>
          </div>

          {/* Trust row: <div className='flex flex-wrap items-center gap-6 mt-10 justify-center'> <span className='text-white/40'>10,000+ learners</span> <span className='text-white/40'>5-star rating</span> </div> */}
          <div className="flex flex-wrap items-center gap-6 mt-10 justify-center text-sm text-white/45">
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} /> No account needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} /> Adapts to any age</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={14} className={theme.textAccent} /> Completely free</span>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-8 glass">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '8',       l: 'Subjects available' },
            { n: '3',       l: 'Age groups supported' },
            { n: '60 sec',  l: 'Setup time' },
            { n: '100%',    l: 'Personalised to you' },
          ].map(s => (
            <div key={s.l}>
              <div className={`text-2xl font-extrabold ${theme.gradientText}`}>{s.n}</div>
              <div className="text-white/45 text-sm mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUBJECTS ────────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">What do you want to learn?</h2>
          <p className="text-white/45">Pick any subject — Nudge adapts to your level and age</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map(subject => (
            <Link
              key={subject.id}
              href={`/onboard?subject=${subject.id}`}
              className={`${theme.card} ${theme.cardHover} ${theme.glowHover} p-5 flex flex-col gap-2 group`}
            >
              <span className="text-3xl">{subject.icon}</span>
              <span className="font-semibold text-white">{subject.label}</span>
              <span className="text-white/45 text-xs leading-snug">{subject.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 glass border-y border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How Nudge works</h2>
            <p className="text-white/45">Personalised learning in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(step => (
              <div key={step.step} className="text-center">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-2xl mx-auto mb-4`}>
                  {step.icon}
                </div>
                <div className={`text-xs font-bold ${theme.textAccent} mb-2 uppercase tracking-widest`}>Step {step.step}</div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AGE GROUPS ──────────────────────────────────────── */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Built for every age</h2>
          <p className="text-white/45">Nudge reads the room — the same topic sounds different to a 9-year-old and a 40-year-old</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {AGE_GROUPS.map(ag => (
            <div key={ag.label} className={`${theme.card} p-6 flex flex-col gap-3`}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{ag.emoji}</span>
                <div>
                  <div className="font-bold text-white text-lg">{ag.label}</div>
                  <div className={`text-xs font-medium ${theme.textAccent}`}>{ag.age}</div>
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">{ag.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="py-20 px-6 glass border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Why Nudge?</h2>
            <p className="text-white/45">Not another flashcard app — a tutor that actually thinks</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <BrainCircuit size={22} />, title: 'Age-adaptive AI',       desc: 'The same maths lesson is explained completely differently to a 7-year-old vs a 25-year-old.' },
              { icon: <BookOpen size={22} />,      title: 'Personal learning path', desc: 'No generic syllabus. AI builds a topic sequence based on your goal, level, and knowledge gaps.' },
              { icon: <Trophy size={22} />,        title: 'Quiz after every topic', desc: '5 quick questions to make sure the lesson stuck. Instant feedback with explanations.' },
              { icon: <CheckCircle size={22} />,   title: 'Track your progress',    desc: 'See every topic you\'ve completed. Pick up exactly where you left off.' },
              { icon: <ArrowRight size={22} />,    title: 'One concept at a time',  desc: 'Never overwhelmed. Nudge drip-feeds knowledge in the right order at the right pace.' },
              { icon: <CheckCircle size={22} />,   title: 'Completely free',        desc: 'No subscription, no paywall. Start learning in 60 seconds — no card required.' },
            ].map(f => (
              <div key={f.title} className={`${theme.card} p-5 flex gap-4 items-start`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${theme.solidLight} flex items-center justify-center ${theme.textAccent}`}>
                  {f.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{f.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AD UNIT — between features and CTA ── */}
      <div className="max-w-3xl mx-auto px-6 py-2">
        <AdUnit size="rectangle" />
      </div>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className={`max-w-3xl mx-auto text-center glass rounded-3xl p-12 border ${theme.border} relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-5 rounded-3xl`} />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 relative">
            Ready to start learning?
          </h2>
          <p className="text-white/50 mb-8 text-lg relative">
            Tell Nudge your age and pick a subject. Your personal AI tutor is ready.
          </p>
          <Link href="/onboard" className={btn.primary + ' text-base px-10 py-4 relative'}>
            Start Learning Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  )
}
