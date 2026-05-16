'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react'
import _config from '@/vertical.config'
import type { AiToolConfig } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
const config = _config as AiToolConfig
import { Suspense } from 'react'

type Level = 'beginner' | 'some' | 'confident'

interface Profile {
  name: string
  age: number
  subject: string
  level: Level
  goal: string
}

const LEVELS: { id: Level; label: string; desc: string; emoji: string }[] = [
  { id: 'beginner',  label: 'Beginner',        desc: 'I\'m starting from scratch — explain everything', emoji: '🌱' },
  { id: 'some',      label: 'Some knowledge',  desc: 'I know the basics but have gaps to fill',          emoji: '📚' },
  { id: 'confident', label: 'Confident',       desc: 'I know the topic — I want to go deeper',           emoji: '🚀' },
]

function OnboardInner() {
  const router = useRouter()
  const params = useSearchParams()

  const [step, setStep]       = useState(1)
  const [name, setName]       = useState('')
  const [age, setAge]         = useState<number | ''>('')
  const [subject, setSubject] = useState(params.get('subject') ?? '')
  const [level, setLevel]     = useState<Level>('beginner')
  const [goal, setGoal]       = useState('')
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const ctaRef                = useRef<HTMLDivElement>(null)
  const totalSteps = 4

  const isUnder13 = typeof age === 'number' && age >= 5 && age < 13

  function validateStep1() {
    const e: Record<string, string> = {}
    if (!name.trim())                  e.name = 'Please enter your name'
    if (!age || age < 5 || age > 80)   e.age  = 'Please enter an age between 5 and 80'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function validateStep2() {
    const e: Record<string, string> = {}
    if (!subject) e.subject = 'Please pick a subject'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const [parentalBlocked, setParentalBlocked] = useState(false)

  function next() {
    if (step === 1 && !validateStep1()) return
    if (step === 1 && isUnder13) { setParentalBlocked(true); return }
    if (step === 2 && !validateStep2()) return
    setErrors({})
    setStep(s => Math.min(s + 1, totalSteps))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function selectSubject(id: string) {
    setSubject(id)
    setErrors({})
    // Scroll CTA into view, then auto-advance after short delay
    setTimeout(() => ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    setTimeout(() => {
      setErrors({})
      setStep(s => Math.min(s + 1, totalSteps))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 700)
  }

  function selectLevel(id: Level) {
    setLevel(id)
    // Auto-advance after brief delay so user sees the selection
    setTimeout(() => {
      setStep(s => Math.min(s + 1, totalSteps))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 500)
  }

  function back() {
    setErrors({})
    setStep(s => Math.max(s - 1, 1))
  }

  function finish() {
    const profile: Profile = {
      name: name.trim(),
      age:  Number(age),
      subject,
      level,
      goal: goal.trim(),
    }
    localStorage.setItem('nudge_profile', JSON.stringify(profile))
    router.push('/learn')
  }

  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Under-13 parental gate */}
        {parentalBlocked && (
          <div className={`${theme.card} p-8 md:p-10 text-center`}>
            <div className="text-5xl mb-4">👨‍👩‍👧</div>
            <h2 className="text-xl font-extrabold text-white mb-3">Ask a parent or guardian to help</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Tutiq is designed for learners of all ages. For users under 13, we need a parent or guardian to set up the account to keep your learning safe.
            </p>
            <div className={`rounded-xl p-5 mb-6 text-left text-sm text-white/70 space-y-2`}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-semibold text-white/90">For parents:</p>
              <p>• Tutiq does not collect personal data from children under 13 without parental consent.</p>
              <p>• No ads are shown on this platform.</p>
              <p>• Learning progress is stored only on this device (no account required to start).</p>
              <p>• To create an account, a parent should complete the sign-up using their own email.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setParentalBlocked(false); finish() }}
                className={`${btn.primary} px-6 py-3`}
              >
                Continue without account (device only)
              </button>
              <button
                onClick={() => setParentalBlocked(false)}
                className={`${btn.secondary} px-6 py-3`}
              >
                Go back
              </button>
            </div>
          </div>
        )}

        {/* Card */}
        {!parentalBlocked && <div className={`${theme.card} p-8 md:p-10`}>

          {/* ── Step 1: Name + Age ── */}
          {step === 1 && (
            <div className="fade-up">
              <h1 className="text-2xl font-extrabold text-white mb-2">Let&apos;s get to know you</h1>
              <p className="text-white/50 mb-8">Tutiq uses your age to tailor every lesson to your level.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Your first name</label>
                  <input
                    className="input-dark"
                    placeholder="e.g. Alex"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && next()}
                    autoFocus
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Your age</label>
                  <input
                    className="input-dark"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 14"
                    maxLength={3}
                    value={age}
                    onChange={e => {
                      const v = e.target.value.replace(/\D/g, '')
                      setAge(v === '' ? '' : Number(v))
                    }}
                    onKeyDown={e => e.key === 'Enter' && next()}
                  />
                  {errors.age && <p className="text-red-400 text-xs mt-1">{errors.age}</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Subject ── */}
          {step === 2 && (
            <div className="fade-up">
              <h1 className="text-2xl font-extrabold text-white mb-2">What do you want to learn?</h1>
              <p className="text-white/50 mb-6">Tap a subject — we&apos;ll jump straight in.</p>

              {/* Group subjects by category */}
              {[
                {
                  label: '📚 GCSE Subjects',
                  ids: ['maths-gcse','english-gcse','science-gcse','history-gcse','geography-gcse'],
                },
                {
                  label: '🎯 11+ Preparation',
                  ids: ['eleven-plus'],
                },
                {
                  label: '💼 Interview Prep',
                  ids: ['interview-tech','interview-gen','interview-nurse','interview-law'],
                },
              ].map(group => {
                const groupSubjects = config.subjects.filter(s => group.ids.includes(s.id))
                if (!groupSubjects.length) return null
                return (
                  <div key={group.label} className="mb-5">
                    <p className="text-xs font-bold text-white/35 uppercase tracking-widest mb-2">{group.label}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {groupSubjects.map(s => (
                        <button
                          key={s.id}
                          onClick={() => selectSubject(s.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center gap-3 ${
                            subject === s.id
                              ? `border-emerald-500/60 bg-emerald-500/10`
                              : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="text-xl shrink-0">{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white text-sm leading-tight">{s.label}</div>
                            <div className="text-white/40 text-xs mt-0.5 leading-snug truncate">{s.desc}</div>
                          </div>
                          {subject === s.id && <CheckCircle size={14} className={`${theme.textAccent} shrink-0`} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}

              {errors.subject && <p className="text-red-400 text-xs mt-2">{errors.subject}</p>}
            </div>
          )}

          {/* ── Step 3: Level ── */}
          {step === 3 && (
            <div className="fade-up">
              <h1 className="text-2xl font-extrabold text-white mb-2">What&apos;s your current level?</h1>
              <p className="text-white/50 mb-6">Be honest — Tutiq adapts either way. Tap to continue.</p>

              <div className="space-y-3">
                {LEVELS.map(lv => (
                  <button
                    key={lv.id}
                    onClick={() => selectLevel(lv.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center gap-4 ${
                      level === lv.id
                        ? `border-emerald-500/60 bg-emerald-500/10`
                        : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="text-2xl">{lv.emoji}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{lv.label}</div>
                      <div className="text-white/50 text-sm">{lv.desc}</div>
                    </div>
                    {level === lv.id && <CheckCircle size={16} className={theme.textAccent} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Goal ── */}
          {step === 4 && (
            <div className="fade-up">
              <h1 className="text-2xl font-extrabold text-white mb-2">Any specific goal? <span className="text-white/30 font-normal text-lg">(optional)</span></h1>
              <p className="text-white/50 mb-6">This helps Nudge focus your path. Skip it if you&apos;re just exploring.</p>

              <textarea
                className="input-dark min-h-[120px] resize-none"
                placeholder={`e.g. "I want to understand fractions" or "I need to pass my GCSE maths exam"`}
                value={goal}
                onChange={e => setGoal(e.target.value)}
              />

              <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-3">Your profile summary</p>
                <div className="space-y-1 text-sm">
                  <div className="flex gap-2"><span className="text-white/40 w-16">Name</span><span className="text-white">{name}</span></div>
                  <div className="flex gap-2"><span className="text-white/40 w-16">Age</span><span className="text-white">{age}</span></div>
                  <div className="flex gap-2"><span className="text-white/40 w-16">Subject</span><span className="text-white">{config.subjects.find(s => s.id === subject)?.label}</span></div>
                  <div className="flex gap-2"><span className="text-white/40 w-16">Level</span><span className="text-white">{LEVELS.find(l => l.id === level)?.label}</span></div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div ref={ctaRef} className="flex justify-between mt-8">
            {step > 1 ? (
              <button onClick={back} className={btn.secondary + ' px-5 py-2.5'}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button onClick={next} className={btn.primary + ' px-6 py-2.5'}>
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={finish} className={btn.primary + ' px-6 py-2.5'}>
                Build my learning path <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>}

      </div>
    </div>
  )
}

export default function OnboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/40">Loading...</div>}>
      <OnboardInner />
    </Suspense>
  )
}
