'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle, BookOpen, Layers, Zap, Star, Lock, BarChart2, FileText, GraduationCap, Trophy, Users, Clock, Upload } from 'lucide-react'
import GuidedTour, { type TourStep } from '@/components/GuidedTour'

const NUDGE_TOUR: TourStep[] = [
  { target: '#hero-cta', title: 'Start learning free', icon: '🚀', body: 'Get 3 free AI sessions — no account needed. Just pick a track and go.', placement: 'bottom' },
  { target: '#subjects', title: 'Choose your track', icon: '🎓', body: 'GCSE, A-Level, or adult skills — Nudge adapts explanations to your exact level.', placement: 'top' },
  { target: '#how-it-works', title: 'How it works', icon: '🧠', body: 'Type a question, get a patient AI tutor. No time limit, no judgement.', placement: 'top' },
  { target: '#pricing', title: 'Unlock unlimited', icon: '⚡', body: 'Go Pro for $8/mo — unlimited sessions across all subjects.', placement: 'top' },
]

// ── Audience tracks ───────────────────────────────────────────
const TRACKS = [
  {
    id: 'gcse',
    icon: '🎓',
    label: 'GCSE Students',
    sublabel: 'Year 9–11',
    desc: 'Exam-board aligned lessons, past paper tips & mark scheme practice',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20 hover:border-emerald-400/50',
    subjects: ['maths-gcse', 'english-gcse', 'science-gcse', 'history-gcse', 'geography-gcse'],
    boards: ['AQA', 'Edexcel', 'OCR'],
  },
  {
    id: '11plus',
    icon: '⭐',
    label: '11+ Prep',
    sublabel: 'Age 9–11',
    desc: 'Verbal reasoning, non-verbal reasoning, maths speed drills & comprehension',
    color: 'from-amber-500/15 to-emerald-500/10',
    border: 'border-amber-500/20 hover:border-amber-400/50',
    subjects: ['eleven-plus'],
    boards: ['CEM', 'GL Assessment'],
  },
  {
    id: 'interview',
    icon: '💼',
    label: 'Interview Prep',
    sublabel: 'Adults & Graduates',
    desc: 'Mock interviews, STAR method, tech DSA, NHS & law coaching',
    color: 'from-blue-500/15 to-teal-500/10',
    border: 'border-blue-500/20 hover:border-blue-400/50',
    subjects: ['interview-tech', 'interview-gen', 'interview-nurse', 'interview-law'],
    boards: ['FAANG', 'NHS', 'Law firms', 'All industries'],
  },
]

// ── Subject cards ─────────────────────────────────────────────
const SUBJECTS = [
  { id: 'maths-gcse',     label: 'Maths (GCSE)',       icon: '📐', desc: 'AQA/Edexcel algebra, geometry & statistics', color: 'from-emerald-500/20 to-teal-500/10',   border: 'hover:border-emerald-400/50', glow: 'hover:shadow-emerald-500/20' },
  { id: 'english-gcse',   label: 'English (GCSE)',     icon: '✍️', desc: 'Language & Literature analysis skills',      color: 'from-teal-500/20 to-cyan-500/10',      border: 'hover:border-teal-400/50',    glow: 'hover:shadow-teal-500/20' },
  { id: 'science-gcse',   label: 'Combined Science',   icon: '🔬', desc: 'Biology, chemistry & physics GCSE',         color: 'from-cyan-500/20 to-emerald-500/10',   border: 'hover:border-cyan-400/50',    glow: 'hover:shadow-cyan-500/20' },
  { id: 'eleven-plus',    label: '11+ Prep',           icon: '🎯', desc: 'VR, NVR, maths & comprehension drills',     color: 'from-amber-500/15 to-orange-500/10',   border: 'hover:border-amber-400/50',   glow: 'hover:shadow-amber-500/20' },
  { id: 'interview-tech', label: 'Tech Interview',     icon: '💻', desc: 'DSA, system design, LeetCode-style',        color: 'from-blue-500/20 to-indigo-500/10',    border: 'hover:border-blue-400/50',    glow: 'hover:shadow-blue-500/20' },
  { id: 'interview-gen',  label: 'Job Interview',      icon: '💼', desc: 'STAR method & competency questions',        color: 'from-violet-500/20 to-purple-500/10',  border: 'hover:border-violet-400/50',  glow: 'hover:shadow-violet-500/20' },
  { id: 'coding',         label: 'Coding',             icon: '🖥️', desc: 'Python, JS, web dev beginner to advanced', color: 'from-green-500/20 to-emerald-500/10',  border: 'hover:border-green-400/50',   glow: 'hover:shadow-green-500/20' },
]

// ── Chat mockup steps ─────────────────────────────────────────
const CHAT = [
  { role: 'tutor', text: 'Great! Let\'s tackle quadratic equations. Do you know ax² + bx + c = 0?' },
  { role: 'user',  text: 'I\'ve seen it but I\'m not sure how to apply it.' },
  { role: 'tutor', text: 'Think of it like finding where a parabola crosses zero. We use: x = (−b ± √(b²−4ac)) / 2a. Let\'s solve one together — step by step! 🎯' },
]

// ── PRO features ──────────────────────────────────────────────
const PRO_FEATURES = [
  { icon: Zap,       label: 'Unlimited sessions',   desc: 'Learn as much as you want, every day' },
  { icon: BookOpen,  label: 'All subjects unlocked', desc: 'Math, Science, History, Languages, Coding + more' },
  { icon: BarChart2, label: 'Progress tracking',     desc: 'See your improvement over time with charts' },
  { icon: FileText,  label: 'PDF study guides',      desc: 'Download summaries for every topic you cover' },
]

// ── Testimonials ──────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Grade 10 Student', text: 'My maths grade went from C to A in 6 weeks. The step-by-step explanations are incredible!', stars: 5 },
  { name: 'James T.', role: 'Parent', text: 'My son finally understands physics. It\'s like having a patient tutor on demand 24/7.', stars: 5 },
  { name: 'Aisha K.', role: 'College Freshman', text: 'Used Tutiq to catch up on chemistry before exams. Passed with distinction!', stars: 5 },
]

export default function HomePage() {
  const [isPro, setIsPro]                   = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [upgraded, setUpgraded]             = useState(false)
  const [chatStep, setChatStep]             = useState(0)

  useEffect(() => {
    if (localStorage.getItem('tutiq-pro') === '1') setIsPro(true)
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === '1') {
      localStorage.setItem('tutiq-pro', '1')
      setIsPro(true)
      setUpgraded(true)
    }
  }, [])

  // Animate chat messages one by one
  useEffect(() => {
    if (chatStep >= CHAT.length) return
    const t = setTimeout(() => setChatStep(s => s + 1), chatStep === 0 ? 600 : 1400)
    return () => clearTimeout(t)
  }, [chatStep])

  async function handleUpgrade() {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <div className="overflow-hidden">

      {/* ── Upgraded toast ──────────────────────────────────── */}
      {upgraded && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-500/10">
          <CheckCircle size={16} /> Welcome to Tutiq Pro! All features unlocked.
        </div>
      )}

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative px-6 pt-16 pb-24 overflow-hidden">
        {/* Background geometric shapes — emerald/teal soft glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Large emerald blob top-left */}
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.10] blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #10b981 0%, transparent 65%)' }} />
          {/* Teal blob top-right */}
          <div className="absolute -top-10 right-0 w-[420px] h-[380px] rounded-full opacity-[0.08] blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #14b8a6 0%, transparent 70%)' }} />
          {/* Deep forest blob bottom */}
          <div className="absolute -bottom-20 left-1/3 w-[500px] h-[300px] rounded-full opacity-[0.06] blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #064e3b 0%, transparent 70%)' }} />

          {/* Floating hexagons */}
          <svg className="absolute top-16 right-20 opacity-[0.08] float" width="140" height="161" viewBox="0 0 140 161">
            <polygon points="70,4 134,38 134,123 70,157 6,123 6,38" fill="none" stroke="#10b981" strokeWidth="1.5"/>
          </svg>
          <svg className="absolute top-64 right-1/4 opacity-[0.05]" style={{ animation: 'float 7s ease-in-out infinite 2s' }} width="60" height="69" viewBox="0 0 60 69">
            <polygon points="30,3 57,18 57,51 30,66 3,51 3,18" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1"/>
          </svg>
          <svg className="absolute bottom-16 left-14 opacity-[0.06]" style={{ animation: 'float 6s ease-in-out infinite 1s' }} width="90" height="104" viewBox="0 0 90 104">
            <polygon points="45,4 87,27 87,77 45,100 3,77 3,27" fill="none" stroke="#14b8a6" strokeWidth="1.5"/>
          </svg>

          {/* Triangles */}
          <svg className="absolute top-32 left-1/4 opacity-[0.05]" style={{ animation: 'float 8s ease-in-out infinite 3s' }} width="60" height="52" viewBox="0 0 60 52">
            <polygon points="30,2 58,50 2,50" fill="none" stroke="#6ee7b7" strokeWidth="1.2"/>
          </svg>
          <svg className="absolute bottom-32 right-1/3 opacity-[0.04]" style={{ animation: 'float 5s ease-in-out infinite 0.5s' }} width="44" height="38" viewBox="0 0 44 38">
            <polygon points="22,2 42,36 2,36" fill="none" stroke="#10b981" strokeWidth="1"/>
          </svg>

          {/* Soft dots */}
          <div className="absolute top-44 left-1/3 w-2.5 h-2.5 rounded-full bg-emerald-400/25" />
          <div className="absolute top-80 right-1/3 w-2 h-2 rounded-full bg-teal-400/25" />
          <div className="absolute bottom-28 right-1/4 w-4 h-4 rounded-full border border-emerald-500/20" />
          <div className="absolute top-56 right-16 w-1.5 h-1.5 rounded-full bg-emerald-300/30" />

          {/* Grid lines — subtle */}
          <div className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">

          {/* Left: headline + CTA */}
          <div className="fade-up">
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold mb-7"
              style={{ borderColor: 'rgba(16,185,129,0.30)', background: 'rgba(16,185,129,0.08)', color: 'rgba(110,231,183,0.90)' }}>
              <Star size={11} fill="currentColor" />
              <span>GCSE · 11+ · Interview Prep · Adult Learning</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-5">
              <span className="text-white/90 block">Ace your exams.</span>
              <span className="block"
                style={{ background: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 50%, #14b8a6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Land your dream job.
              </span>
              <span className="text-white/70 text-4xl md:text-5xl block mt-2 leading-snug">AI tutor, always ready.</span>
            </h1>

            <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Personalised AI tutoring for GCSE & 11+ students, graduates preparing for interviews, and adults upskilling — with exam tips, mock interviews, and instant feedback.
            </p>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 mb-9">
              {['AQA · Edexcel · OCR aligned', '3 free sessions', 'STAR method coaching', 'Mock interviews'].map(t => (
                <span key={t} className="rounded-full border px-3.5 py-1 text-xs font-medium"
                  style={{ borderColor: 'rgba(16,185,129,0.22)', color: 'rgba(110,231,183,0.70)', background: 'rgba(16,185,129,0.06)' }}>
                  · {t}
                </span>
              ))}
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/30 mb-2">
              <span className="flex items-center gap-1"><span className="text-yellow-400">★★★★★</span> 4.8/5</span>
              <span>·</span>
              <span>1,800+ students</span>
              <span>·</span>
              <span>GCSE · 11+ · Interview</span>
              <span>·</span>
              <a href="/pricing" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition">See pricing</a>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/onboard" id="hero-cta"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white transition-all hover:brightness-110 hover:scale-105 shadow-lg shadow-emerald-500/25"
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                Start Learning Free <ArrowRight size={18} />
              </Link>
              {!isPro && (
                <button onClick={handleUpgrade} disabled={checkoutLoading}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-4 text-sm font-semibold text-emerald-300 transition-all hover:bg-emerald-500/10 disabled:opacity-60"
                  style={{ borderColor: 'rgba(16,185,129,0.30)' }}>
                  {checkoutLoading ? 'Loading…' : '⚡ Go Pro — $8/mo'}
                </button>
              )}
              {isPro && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300">
                  <CheckCircle size={12} /> Pro Active
                </span>
              )}
            </div>

            <div className="flex flex-col items-start gap-1 text-xs text-white/30 mt-5">
              <span>✓ 3 free sessions — no account needed</span>
              <span>✓ Pro unlocks unlimited sessions + all subjects for $8/mo</span>
            </div>
          </div>

          {/* Right: chat preview mockup */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full max-w-sm float">
              {/* Emerald glow behind card */}
              <div className="absolute inset-x-4 bottom-0 h-28 rounded-full blur-2xl opacity-25"
                style={{ background: '#10b981' }} />

              {/* Academic badge */}
              <div className="absolute -top-4 -right-4 z-10 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 text-[11px] font-bold text-emerald-300 backdrop-blur-sm">
                <GraduationCap size={12} /> Step-by-step tutoring
              </div>

              {/* Chat card */}
              <div className="relative rounded-2xl border p-5"
                style={{ background: 'rgba(4,47,46,0.50)', backdropFilter: 'blur(24px)', borderColor: 'rgba(16,185,129,0.22)', boxShadow: '0 24px 64px rgba(16,185,129,0.12), inset 0 1px 0 rgba(255,255,255,0.05)' }}>

                {/* Chat header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-emerald-500/10">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.30), rgba(20,184,166,0.20))' }}>🎓</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">Tutiq AI</div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[10px] text-emerald-400">Online now</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold rounded-full px-2.5 py-1 shrink-0"
                    style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7' }}>Math · Grade 9</span>
                </div>

                {/* Chat messages with animation */}
                <div className="flex flex-col gap-3 mb-4 min-h-[120px]">
                  {CHAT.slice(0, chatStep).map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-up`}>
                      <div className="max-w-[88%] rounded-xl px-3 py-2 text-[11px] leading-relaxed"
                        style={msg.role === 'tutor'
                          ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.82)', border: '1px solid rgba(255,255,255,0.05)' }
                          : { background: 'rgba(16,185,129,0.22)', color: '#d1fae5' }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {/* Typing indicator shown after all messages or while loading */}
                  {chatStep < CHAT.length && (
                    <div className="flex justify-start fade-up">
                      <div className="rounded-xl px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="typing-dot" style={{ color: '#10b981' }} />
                        <span className="typing-dot" style={{ color: '#10b981' }} />
                        <span className="typing-dot" style={{ color: '#10b981' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input bar */}
                <div className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
                  style={{ borderColor: 'rgba(16,185,129,0.18)', background: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-[11px] text-white/25 flex-1">Ask your next question…</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(16,185,129,0.30)' }}>
                    <ArrowRight size={10} className="text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-10"
        style={{ background: 'rgba(6,78,59,0.12)' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '5,000+', l: 'Students helped',    icon: Users },
            { n: '10+',    l: 'Subjects covered',   icon: BookOpen },
            { n: '24/7',   l: 'Always available',   icon: Clock },
            { n: '4.9★',   l: 'Average rating',     icon: Trophy },
          ].map(s => (
            <div key={s.l} className="flex flex-col items-center gap-1">
              <s.icon size={18} className="text-emerald-500/60 mb-1" />
              <div className="text-2xl font-extrabold"
                style={{ background: 'linear-gradient(135deg, #10b981, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {s.n}
              </div>
              <div className="text-white/40 text-xs">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 AUDIENCE TRACKS ────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Who is Tutiq for?</h2>
            <p className="text-white/40 text-sm">Pick your track — everything is tailored to you from the first lesson.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TRACKS.map(track => (
              <Link key={track.id} href={`/onboard?subject=${track.subjects[0]}`}
                className={`group relative rounded-2xl border bg-gradient-to-br ${track.color} ${track.border} p-6 flex flex-col gap-3 transition-all hover:scale-[1.02] hover:shadow-xl`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{track.icon}</span>
                  <div>
                    <div className="font-extrabold text-white text-base">{track.label}</div>
                    <div className="text-xs text-white/40 font-medium">{track.sublabel}</div>
                  </div>
                </div>
                <p className="text-white/55 text-sm leading-relaxed">{track.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {track.boards.map(b => (
                    <span key={b} className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {b}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold mt-auto pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Start {track.label} <ArrowRight size={11} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECT CARDS ────────────────────────────────────── */}
      <section id="subjects" className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">
              <Layers size={12} /> Topics
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Pick a topic, start immediately</h2>
            <p className="text-white/40 text-sm max-w-md mx-auto">No account needed. 3 free sessions. Your AI tutor builds a personalised plan in seconds.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SUBJECTS.map(subject => (
              <Link key={subject.id} href={`/onboard?subject=${subject.id}`}
                className={`group relative rounded-2xl border border-white/[0.07] bg-gradient-to-br ${subject.color} p-5 flex flex-col gap-2 items-center text-center transition-all duration-250 ${subject.border} ${subject.glow} hover:scale-[1.04] hover:shadow-xl hover:-translate-y-1`}>
                <div className="absolute top-0 inset-x-0 h-[1px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)' }} />
                <span className="text-3xl group-hover:scale-110 transition-transform duration-200 mb-1">{subject.icon}</span>
                <span className="font-bold text-white text-sm">{subject.label}</span>
                <span className="text-white/40 text-[11px] leading-snug">{subject.desc}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400 text-[10px] font-semibold flex items-center gap-1 mt-1">
                  Start now <ArrowRight size={9} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── GAMES & PRACTICE ─────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-white/[0.06]" style={{ background: 'rgba(6,78,59,0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
              🎮 Practice Games
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Learn through games & challenges</h2>
            <p className="text-white/40 text-sm">Gamified practice — earn streaks, beat your score, challenge friends</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '⚡', label: 'Speed Quiz',       desc: '60-second rapid-fire questions. Race the clock.',          href: '/onboard?mode=speed',  color: '#f59e0b' },
              { icon: '🧩', label: 'Topic Challenges', desc: 'Multi-topic exam-style challenge. Mix subjects.',           href: '/onboard?mode=challenge', color: '#10b981' },
              { icon: '🎭', label: 'Mock Interview',   desc: 'AI asks, you answer. Get scored & instant feedback.',      href: '/onboard?subject=interview-gen', color: '#60a5fa' },
              { icon: '📝', label: 'Past Paper Mode',  desc: 'AI generates GCSE-style questions with mark schemes.',     href: '/onboard?mode=pastpaper', color: '#a78bfa' },
            ].map(g => (
              <Link key={g.label} href={g.href}
                className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-3 transition-all hover:scale-[1.03] hover:bg-white/[0.06] hover:border-white/[0.14]">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: `${g.color}18`, border: `1px solid ${g.color}30` }}>
                  {g.icon}
                </div>
                <div>
                  <div className="font-bold text-white text-sm mb-1">{g.label}</div>
                  <div className="text-white/40 text-xs leading-relaxed">{g.desc}</div>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: g.color }}>
                  Play now <ArrowRight size={10} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6 border-y border-white/[0.06]"
        style={{ background: 'rgba(6,78,59,0.08)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">
              <BookOpen size={12} /> How it works
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">One-on-one learning, <span style={{ background: 'linear-gradient(135deg, #10b981, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>minus the scheduling</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '👤', title: 'Tell us your subject & level', desc: 'Share your name, age, and what you need help with. 60-second setup — no account required.' },
              { step: '2', icon: '🗺️', title: 'AI builds your learning path', desc: 'Tutiq creates a step-by-step plan tailored to your age, level, and learning goals.' },
              { step: '3', icon: '✅', title: 'Learn and quiz after each topic', desc: 'Bite-sized explanations with a quick quiz after each section to cement the knowledge.' },
            ].map(step => (
              <div key={step.step} className="relative pl-8 border-l border-emerald-500/20">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg shadow-emerald-500/30"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  {step.step}
                </div>
                <div className="text-3xl mb-4">{step.icon}</div>
                <h3 className="font-bold text-white text-sm mb-2 leading-snug">{step.title}</h3>
                <p className="text-white/45 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LESSON PATH ──────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">
              <Layers size={12} /> Structured Learning Paths
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Know exactly <span style={{ background: 'linear-gradient(135deg, #10b981, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>where you are</span></h2>
            <p className="text-white/40 text-sm max-w-xl mx-auto">Every subject has a structured path. Work through topics in order, quiz after each one, and track what&apos;s done.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { subject: 'GCSE Maths', icon: '📐', topics: ['Number & Algebra', 'Geometry & Measures', 'Statistics & Probability', 'Ratio & Proportion', 'Mock Paper Practice'], done: 2 },
              { subject: 'Tech Interview', icon: '💻', topics: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'System Design Basics', 'Mock Interview Session'], done: 1 },
            ].map(path => (
              <div key={path.subject} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{path.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{path.subject}</div>
                    <div className="text-[10px] text-emerald-400">{path.done}/{path.topics.length} topics complete</div>
                  </div>
                  <div className="ml-auto w-12 h-12 relative">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                        strokeDasharray={`${(path.done / path.topics.length) * 100} 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-400">{Math.round((path.done / path.topics.length) * 100)}%</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {path.topics.map((topic, i) => (
                    <div key={topic} className={`flex items-center gap-2.5 text-xs py-1.5 px-2 rounded-lg ${i < path.done ? 'text-emerald-300 bg-emerald-500/10' : 'text-white/30'}`}>
                      {i < path.done ? <CheckCircle size={12} className="text-emerald-400 shrink-0" /> : <div className="w-3 h-3 rounded-full border border-white/15 shrink-0" />}
                      {topic}
                      {i === path.done && <span className="ml-auto text-[9px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full">Next</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/onboard" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-semibold transition">
              Start your learning path <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXAM TIMER / TIMED PRACTICE ──────────────────────── */}
      <section className="py-16 px-6 border-t border-white/[0.06]" style={{ background: 'rgba(6,78,59,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">
              <Clock size={12} /> Timed Exam Practice
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">Practice under <span style={{ background: 'linear-gradient(135deg, #f59e0b, #fcd34d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>real exam pressure</span></h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto">Set a timer, pick a topic, and Tutiq gives you past-paper style questions. AI marks your answers against the mark scheme.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { time: '15 min', label: 'Quick drill', icon: '⚡', desc: '5–8 questions' },
              { time: '30 min', label: 'Topic test', icon: '📝', desc: '12–15 questions' },
              { time: '45 min', label: 'Mock paper', icon: '📄', desc: 'Full section' },
              { time: 'Custom', label: 'Your pace', icon: '🎯', desc: 'Set own timer' },
            ].map(opt => (
              <Link href="/onboard" key={opt.time}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 text-center hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group">
                <div className="text-2xl mb-2">{opt.icon}</div>
                <div className="text-base font-black text-white group-hover:text-amber-300 transition-colors">{opt.time}</div>
                <div className="text-xs font-semibold text-white/60 mb-1">{opt.label}</div>
                <div className="text-[10px] text-white/30">{opt.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDY BUDDY CTA ──────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-emerald-500/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
            style={{ background: 'linear-gradient(135deg, rgba(6,78,59,0.25), rgba(5,150,105,0.10))' }}>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
                <BookOpen size={12} /> Study Buddy — New
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                Upload your notes.<br />
                <span style={{ background: 'linear-gradient(135deg, #10b981, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Get quizzes, flashcards &amp; a summary.
                </span>
              </h2>
              <p className="text-white/45 text-sm leading-relaxed mb-6">
                Drop in any PDF or text file — your AI study buddy instantly generates 5 quiz questions,
                8 flashcards, and a 5-point summary so you can revise in minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/study"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.03]"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>
                  <Upload size={15} /> Try Study Buddy
                </Link>
                <Link href="/learn"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border border-white/10 text-white/60 hover:text-white transition-all">
                  Or start tutoring <ArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 hidden md:flex flex-col gap-3 w-52">
              {[
                { icon: '📄', label: 'Upload PDF or TXT' },
                { icon: '🧠', label: 'AI extracts key info' },
                { icon: '📝', label: '5 quiz questions' },
                { icon: '🃏', label: '8 flashcards' },
                { icon: '✅', label: '5-point summary' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2.5 text-sm text-white/60">
                  <span className="text-lg w-7 flex-shrink-0">{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">
              <Trophy size={12} /> Social proof
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Students love Tutiq</h2>
            <p className="text-white/40 text-sm">Real results from real students — across every subject and age group.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.07] p-6"
                style={{ background: 'rgba(6,78,59,0.12)' }}>
                <div className="stars text-sm mb-3">{'★'.repeat(t.stars)}</div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">{t.name}</div>
                    <div className="text-white/35 text-[11px]">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING — FREE vs PRO ────────────────────────────── */}
      <section id="pricing" className="py-20 px-6 border-y border-white/[0.06]"
        style={{ background: 'rgba(6,78,59,0.08)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4">
              <Lock size={12} /> Plans
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Simple, honest pricing</h2>
            <p className="text-white/40 text-sm">Start free — upgrade when you want unlimited access for just $8/mo.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* FREE */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8">
              <div className="text-xs font-bold uppercase tracking-widest text-white/35 mb-5">Free</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-extrabold text-white">$0</span>
              </div>
              <div className="text-white/35 text-sm mb-7">Forever free — no card needed</div>
              <ul className="flex flex-col gap-3.5 mb-8">
                {['3 tutoring sessions / day', '3 subjects available', 'Step-by-step explanations', 'Quiz after each topic'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/55">
                    <CheckCircle size={14} className="text-emerald-500/60 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link href="/onboard"
                className="block w-full text-center rounded-xl border border-white/[0.10] py-3.5 text-sm font-semibold text-white/60 hover:bg-white/[0.05] transition-all">
                Start Free
              </Link>
            </div>

            {/* PRO */}
            <div className="rounded-2xl border p-8 relative overflow-hidden"
              style={{ borderColor: 'rgba(16,185,129,0.40)', background: 'rgba(6,78,59,0.25)' }}>
              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ background: '#10b981' }} />
              {/* Top shimmer line */}
              <div className="absolute top-0 inset-x-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)' }} />

              <div className="flex items-center gap-2 mb-5">
                <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">Pro</div>
                <span className="rounded-full text-[10px] font-bold px-2.5 py-0.5"
                  style={{ background: 'rgba(16,185,129,0.22)', color: '#6ee7b7' }}>Most popular</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-extrabold text-white">$8</span>
                <span className="text-lg font-normal text-white/40">/mo</span>
              </div>
              <div className="text-white/40 text-sm mb-7">Personal tutor plan — cancel anytime</div>
              <ul className="flex flex-col gap-3.5 mb-8">
                {PRO_FEATURES.map(f => (
                  <li key={f.label} className="flex items-start gap-2.5 text-sm text-white/80">
                    <f.icon size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span><span className="font-semibold text-white">{f.label}</span> — {f.desc}</span>
                  </li>
                ))}
              </ul>
              {isPro ? (
                <div className="block w-full text-center rounded-xl py-3.5 text-sm font-bold text-emerald-300 border border-emerald-500/30 bg-emerald-500/10">
                  ✓ You&apos;re on Pro
                </div>
              ) : (
                <button onClick={handleUpgrade} disabled={checkoutLoading}
                  className="block w-full text-center rounded-xl py-3.5 text-sm font-bold text-white transition-all hover:brightness-110 hover:scale-[1.01] disabled:opacity-60 shadow-lg shadow-emerald-500/20"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  {checkoutLoading ? 'Loading…' : '⚡ Upgrade to Pro — $8/mo'}
                </button>
              )}
              <p className="text-center text-white/25 text-[11px] mt-3">Cancel anytime · Instant access</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-1/4 top-0 h-full rounded-full blur-3xl opacity-[0.06]"
            style={{ background: 'radial-gradient(ellipse, #10b981 0%, transparent 70%)' }} />
        </div>
        <div className="max-w-xl mx-auto text-center">
          <div className="text-5xl mb-6">🎓</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Start your first lesson today</h2>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">No account. No credit card. Just clear, patient, one-on-one explanations — at your pace, on your schedule.</p>
          <Link href="/onboard"
            className="inline-flex items-center gap-2 rounded-xl px-10 py-4 text-base font-semibold text-white transition-all hover:brightness-110 hover:scale-105 shadow-xl shadow-emerald-500/25"
            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            Start Learning Free <ArrowRight size={18} />
          </Link>
          <div className="flex flex-col items-center gap-1.5 text-xs text-white/25 mt-5">
            <span>✓ 3 free sessions — no account needed</span>
            <span>✓ Pro unlocks unlimited sessions for $8/mo</span>
          </div>
        </div>
      </section>

      <GuidedTour steps={NUDGE_TOUR} storageKey="nudge_tour_v1" accentColor="#10b981" />
    </div>
  )
}
