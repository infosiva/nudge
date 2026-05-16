'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Loader2, RotateCcw, Clock, Trophy, FileText } from 'lucide-react'
import { theme, btn } from '@/lib/theme'

interface ExamQuestion {
  id: number
  type: string
  marks: number
  question: string
  options?: string[]
  answer: string
  markScheme: string
  explanation: string
}

interface ExamPaper {
  title: string
  duration: number
  totalMarks: number
  questions: ExamQuestion[]
}

interface Profile {
  name: string
  age: number
  subject: string
  level: 'beginner' | 'some' | 'confident'
  goal: string
}

function getPaperType(subject: string): 'gcse' | '11plus' | 'interview' {
  if (subject.includes('gcse') || subject.includes('history') || subject.includes('geography')) return 'gcse'
  if (subject.includes('eleven') || subject.includes('11plus')) return '11plus'
  if (subject.includes('interview')) return 'interview'
  return 'gcse'
}

function getExamBoardLabel(subject: string): string {
  if (subject.includes('eleven')) return 'CEM / GL Assessment'
  if (subject.includes('interview')) return 'Industry Standard'
  return 'AQA · Edexcel · OCR'
}

export default function MockExamPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params)

  const [profile, setProfile]     = useState<Profile | null>(null)
  const [paper, setPaper]         = useState<ExamPaper | null>(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [started, setStarted]     = useState(false)
  const [answers, setAnswers]     = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [timeLeft, setTimeLeft]   = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const raw = localStorage.getItem('nudge_profile')
    if (raw) setProfile(JSON.parse(raw))
  }, [])

  useEffect(() => {
    if (!started || !paper || submitted) return
    setTimeLeft(paper.duration * 60)
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); handleSubmit(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, paper])

  async function loadPaper() {
    if (!profile) return
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/learn/mock-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: profile.subject,
          level: profile.level,
          age: profile.age,
          paperType: getPaperType(profile.subject),
        }),
      })
      const data = await r.json()
      if (!r.ok) { setError(data.error ?? 'Failed to load paper'); return }
      setPaper(data)
    } catch {
      setError('Network error — please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleAnswer(qId: number, answer: string) {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qId]: answer }))
  }

  function handleSubmit() {
    setSubmitted(true)
    setStarted(false)
  }

  function calcScore(): { earned: number; total: number } {
    if (!paper) return { earned: 0, total: 0 }
    let earned = 0
    for (const q of paper.questions) {
      const userAns = (answers[q.id] ?? '').trim().toLowerCase()
      const correct = q.answer.trim().toLowerCase()
      // Exact match for MCQ; for open-ended allow partial if >70% chars match
      const isExact = userAns === correct
      const isPartial = q.options == null && userAns.length > 3 && correct.includes(userAns)
      if (isExact || isPartial) {
        earned += q.marks
      }
    }
    return { earned, total: paper.totalMarks }
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const paperType = profile ? getPaperType(profile.subject) : 'gcse'
  const examLabel = profile ? getExamBoardLabel(profile.subject) : ''

  // ── Results ───────────────────────────────────────────────────
  if (submitted && paper) {
    const { earned, total } = calcScore()
    const pct = Math.round((earned / total) * 100)
    return (
      <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
        <Link href={`/learn/${topicId}`} className={`${theme.textAccent} flex items-center gap-2 text-sm mb-8`}>
          <ArrowLeft size={15} /> Back to lesson
        </Link>
        <div className={`${theme.card} p-8 text-center mb-6`}>
          <Trophy size={40} className={`${theme.textAccent} mx-auto mb-4`} />
          <h1 className="text-2xl font-extrabold text-white mb-1">Exam Complete</h1>
          <p className="text-white/45 text-sm mb-4">{paper.title}</p>
          <div className={`text-5xl font-extrabold ${theme.gradientText} mb-1`}>{earned}/{total}</div>
          <p className="text-white/50 text-sm mb-6">
            {pct >= 80 ? '🎉 Excellent! Grade A/A* territory' : pct >= 60 ? '👍 Good — Grade B/C territory' : pct >= 40 ? '📚 Keep practising — Grade D/E territory' : '💪 More revision needed — review the mark schemes'}
          </p>
          <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden mb-8 mx-auto max-w-xs">
            <div className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full`} style={{ width: `${pct}%` }} />
          </div>
          <button onClick={() => { setSubmitted(false); setPaper(null); setAnswers({}); setStarted(false) }} className={btn.secondary + ' justify-center gap-2'}>
            <RotateCcw size={15} /> New paper
          </button>
        </div>

        {/* Marked answers */}
        <div className="space-y-4">
          <h2 className="text-white font-bold text-lg">Mark scheme & feedback</h2>
          {paper.questions.map(q => {
            const userAns = (answers[q.id] ?? '').trim().toLowerCase()
            const correct = q.answer.trim().toLowerCase()
            const isCorrect = userAns === correct || (q.options == null && userAns.length > 3 && correct.includes(userAns))
            return (
              <div key={q.id} className={`${theme.card} p-5 border-l-2 ${isCorrect ? 'border-emerald-500' : 'border-red-500/60'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Q{q.id} · {q.marks} mark{q.marks > 1 ? 's' : ''} · {q.type.replace(/_/g, ' ')}</span>
                  <span className={isCorrect ? 'text-emerald-400 text-xs font-bold' : 'text-red-400 text-xs font-bold'}>
                    {isCorrect ? `+${q.marks}` : '0'}
                  </span>
                </div>
                <p className="text-white font-medium mb-2 text-sm leading-relaxed">{q.question}</p>
                {answers[q.id] && (
                  <p className="text-white/50 text-xs mb-2">Your answer: <span className="text-white/70">{answers[q.id]}</span></p>
                )}
                {!isCorrect && (
                  <p className="text-emerald-300 text-xs mb-2">Correct: <span className="font-medium">{q.answer}</span></p>
                )}
                <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3 mt-2">
                  <p className="text-amber-300/80 text-xs font-bold uppercase tracking-wide mb-1">Mark Scheme</p>
                  <p className="text-white/60 text-xs leading-relaxed">{q.markScheme}</p>
                </div>
                <p className="text-white/45 text-xs mt-2 leading-relaxed">{q.explanation}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Exam in progress ──────────────────────────────────────────
  if (started && paper) {
    return (
      <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
        {/* Header with timer */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest">{examLabel}</p>
            <h1 className="text-white font-bold text-lg">{paper.title}</h1>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${timeLeft < 300 ? 'bg-red-500/15 border border-red-500/30' : 'bg-white/[0.05] border border-white/10'}`}>
            <Clock size={15} className={timeLeft < 300 ? 'text-red-400' : 'text-white/50'} />
            <span className={`font-mono font-bold text-sm ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="space-y-5 mb-8">
          {paper.questions.map(q => (
            <div key={q.id} className={`${theme.card} p-5`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Q{q.id} · {q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                <span className="text-white/30 text-xs">{q.type.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-white font-medium mb-4 leading-relaxed">{q.question}</p>

              {q.options && q.options.length > 0 ? (
                <div className="space-y-2">
                  {q.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                        answers[q.id] === opt
                          ? `bg-gradient-to-r ${theme.gradient} text-white border-transparent`
                          : 'border-white/[0.08] text-white/70 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  rows={q.marks >= 6 ? 6 : 3}
                  placeholder={q.marks >= 6 ? 'Write your extended answer here...' : 'Write your answer here...'}
                  value={answers[q.id] ?? ''}
                  onChange={e => handleAnswer(q.id, e.target.value)}
                  className="input-dark w-full text-sm resize-none"
                />
              )}
            </div>
          ))}
        </div>

        <button onClick={handleSubmit} className={btn.primary + ' w-full justify-center py-3'}>
          Submit paper <CheckCircle size={16} />
        </button>
      </div>
    )
  }

  // ── Landing ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <Link href={`/learn/${topicId}`} className={`${theme.textAccent} flex items-center gap-2 text-sm mb-8`}>
        <ArrowLeft size={15} /> Back to lesson
      </Link>

      <div className="text-center mb-10">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.badge} text-xs font-medium mb-4`}>
          <FileText size={12} /> Mock Exam Paper
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-3">Past Paper Mode</h1>
        <p className="text-white/50 max-w-sm mx-auto">
          AI-generated exam paper styled for{' '}
          <span className={theme.textAccent}>{examLabel}</span>.
          Timed, marked, with full mark scheme feedback.
        </p>
      </div>

      {!paper && !loading && (
        <div className={`${theme.card} p-8 text-center`}>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { icon: '⏱️', label: '45 min', desc: 'Timed paper' },
              { icon: '📋', label: '10 Qs', desc: 'Mixed question types' },
              { icon: '✅', label: 'Mark scheme', desc: 'Full examiner feedback' },
            ].map(item => (
              <div key={item.label} className="text-center">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-white font-bold text-sm">{item.label}</p>
                <p className="text-white/40 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button onClick={loadPaper} className={btn.primary + ' justify-center w-full py-3'}>
            Generate my paper
          </button>
        </div>
      )}

      {loading && (
        <div className={`${theme.card} p-10 flex flex-col items-center gap-4`}>
          <Loader2 size={28} className={`${theme.textAccent} animate-spin`} />
          <p className="text-white/40 text-sm">Generating your exam paper…</p>
        </div>
      )}

      {paper && !started && (
        <div className={`${theme.card} p-8`}>
          <h2 className="text-white font-bold text-xl mb-1">{paper.title}</h2>
          <p className="text-white/40 text-sm mb-6">{examLabel} style · {paper.duration} minutes · {paper.totalMarks} marks total</p>

          <div className="space-y-3 mb-8">
            {[
              'Complete all questions within the time limit',
              'For multiple choice: select one answer',
              'For extended answers: write in full sentences',
              'Full mark scheme shown after submission',
            ].map(rule => (
              <div key={rule} className="flex items-start gap-3">
                <CheckCircle size={14} className={`${theme.textAccent} mt-0.5 flex-shrink-0`} />
                <p className="text-white/60 text-sm">{rule}</p>
              </div>
            ))}
          </div>

          <button onClick={() => { setStarted(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={btn.primary + ' w-full justify-center py-3'}>
            Start exam <Clock size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
