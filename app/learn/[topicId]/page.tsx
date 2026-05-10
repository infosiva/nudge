'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, RotateCcw } from 'lucide-react'
import _config from '@/vertical.config'
import type { AiToolConfig } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
import { useGate } from '@/lib/shared/useGate'
import RegisterGate from '@/lib/shared/RegisterGate'
const config = _config as AiToolConfig

interface Profile {
  name: string
  age: number
  subject: string
  level: 'beginner' | 'some' | 'confident'
  goal: string
}

interface Question {
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  question: string
  options?: string[]
  answer: string
  explanation: string
}

// Very simple markdown-light renderer: bold, bullets
function renderText(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Bullet
    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      const content = line.replace(/^[\s-•]+/, '')
      return (
        <li key={i} className="ml-4 text-white/80 leading-relaxed list-disc">
          {renderInline(content)}
        </li>
      )
    }
    // Heading-ish (line ending with colon or all-caps short line)
    if (line.endsWith(':') && line.length < 60 && !line.startsWith(' ')) {
      return <p key={i} className="font-bold text-white mt-4 mb-1">{line}</p>
    }
    if (!line.trim()) return <div key={i} className="h-3" />
    return <p key={i} className="text-white/80 leading-relaxed">{renderInline(line)}</p>
  })
}

function renderInline(text: string): React.ReactNode {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

export default function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = use(params)
  const router = useRouter()

  const [profile, setProfile]         = useState<Profile | null>(null)
  const [topicTitle, setTopicTitle]   = useState('')
  const [explanation, setExplanation] = useState('')
  const [loadingExplain, setLoadingExplain] = useState(true)
  const [explainError, setExplainError]     = useState('')

  const { count: gateCount, showGate, increment: gateIncrement, onRegistered, dismissGate } = useGate('tutiq', 3)

  // Quiz state
  const [showQuiz, setShowQuiz]       = useState(false)
  const [questions, setQuestions]     = useState<Question[]>([])
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [quizError, setQuizError]     = useState('')
  const [qIndex, setQIndex]           = useState(0)
  const [selected, setSelected]       = useState<string | null>(null)
  const [revealed, setRevealed]       = useState(false)
  const [score, setScore]             = useState(0)
  const [quizDone, setQuizDone]       = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('nudge_profile')
    if (!raw) { router.replace('/onboard'); return }
    const p: Profile = JSON.parse(raw)
    setProfile(p)

    // Resolve topic title from localStorage topics
    const topicKey = `nudge_topics_${p.subject}_${p.level}_${p.age}`
    const cachedTopics = localStorage.getItem(topicKey)
    let title = topicId.replace(/-/g, ' ')
    if (cachedTopics) {
      const topics = JSON.parse(cachedTopics)
      const found = topics.find((t: { id: string; title: string }) => t.id === topicId)
      if (found) title = found.title
    }
    setTopicTitle(title)

    // Fetch explanation
    fetch('/api/learn/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: title, subject: p.subject, age: p.age, level: p.level }),
    })
      .then(r => r.json())
      .then(data => setExplanation(data.explanation ?? ''))
      .catch(() => setExplainError('Could not load lesson. Please try again.'))
      .finally(() => setLoadingExplain(false))
  }, [topicId, router])

  async function loadQuiz() {
    if (!profile) return
    setShowQuiz(true)
    setLoadingQuiz(true)
    setQuizError('')
    setQIndex(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setQuizDone(false)
    try {
      const r = await fetch('/api/learn/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, subject: profile.subject, age: profile.age, level: profile.level }),
      })
      const data = await r.json()
      setQuestions(data.questions ?? [])
    } catch {
      setQuizError('Could not load quiz. Please try again.')
    } finally {
      setLoadingQuiz(false)
    }
  }

  function handleAnswer(opt: string) {
    if (revealed) return
    setSelected(opt)
    setRevealed(true)
    const q = questions[qIndex]
    const correct = opt.trim().toLowerCase() === q.answer.trim().toLowerCase() ||
                    q.answer.toLowerCase().includes(opt.trim().toLowerCase())
    if (correct) setScore(s => s + 1)
  }

  function nextQuestion() {
    if (qIndex + 1 >= questions.length) {
      setQuizDone(true)
    } else {
      setQIndex(i => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  async function markComplete() {
    if (!profile) return
    const doneKey = `nudge_done_${profile.subject}`
    const raw = localStorage.getItem(doneKey)
    const done: string[] = raw ? JSON.parse(raw) : []
    if (!done.includes(topicId)) done.push(topicId)
    localStorage.setItem(doneKey, JSON.stringify(done))
    const allowed = await gateIncrement()
    if (allowed) router.push('/learn')
  }

  const q = questions[qIndex]
  const subject = profile ? config.subjects.find(s => s.id === profile.subject) : null

  return (
    <div className="min-h-screen px-6 py-10 max-w-3xl mx-auto">

      {/* Back nav */}
      <Link href="/learn" className={`${theme.textAccent} hover:opacity-80 transition-opacity flex items-center gap-2 text-sm mb-8`}>
        <ArrowLeft size={15} /> Back to my path
      </Link>

      {/* Topic header */}
      <div className="mb-8">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${theme.badge} text-xs mb-3`}>
          {subject?.icon} {subject?.label}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white">{topicTitle}</h1>
      </div>

      {/* ── LESSON ───────────────────────────────────────────── */}
      {!showQuiz && (
        <>
          <div className={`${theme.card} p-6 md:p-8 mb-6`}>
            {loadingExplain ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 size={28} className={`${theme.textAccent} animate-spin`} />
                <p className="text-white/40 text-sm">Nudge is preparing your lesson…</p>
              </div>
            ) : explainError ? (
              <div className="text-red-300 text-sm">{explainError}</div>
            ) : (
              <div className="text-lg space-y-1 leading-relaxed">
                {renderText(explanation)}
              </div>
            )}
          </div>

          {/* ── EXAM TIPS PANEL (GCSE / interview subjects) ─────── */}
          {!loadingExplain && !explainError && profile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
              {/* Exam board tag */}
              {['maths-gcse','english-gcse','science-gcse','history-gcse','geography-gcse'].includes(profile.subject) && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                  {['AQA', 'Edexcel', 'OCR'].map(b => (
                    <span key={b} style={{ fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.12)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.25)' }}>
                      {b}
                    </span>
                  ))}
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', marginLeft: 4 }}>
                    Aligned with all major exam boards
                  </span>
                </div>
              )}

              {/* Examiner tip box */}
              {['maths-gcse','english-gcse','science-gcse','history-gcse','geography-gcse'].includes(profile.subject) && (
                <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📋 Examiner Tips
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 14px', color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 1.7 }}>
                    <li>Use command words correctly — <strong style={{ color: '#fbbf24' }}>describe</strong> vs <strong style={{ color: '#fbbf24' }}>explain</strong> vs <strong style={{ color: '#fbbf24' }}>analyse</strong></li>
                    <li>Show working for maths — method marks are available even with a wrong answer</li>
                    <li>Use PEEL structure for extended answers: <strong style={{ color: '#fbbf24' }}>Point → Evidence → Explain → Link</strong></li>
                    <li>Time yourself — 1 mark ≈ 1–1.5 minutes in most GCSE papers</li>
                  </ul>
                </div>
              )}

              {/* Interview tips box */}
              {['interview-tech','interview-gen','interview-nurse','interview-law'].includes(profile.subject) && (
                <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.22)' }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#93c5fd', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    🎯 Interview Coach Tips
                  </div>
                  <ul style={{ margin: 0, padding: '0 0 0 14px', color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 1.7 }}>
                    <li><strong style={{ color: '#93c5fd' }}>STAR method:</strong> Situation → Task → Action → Result — always quantify results</li>
                    <li>Pause before answering — interviewers respect thoughtful responses</li>
                    <li>Research the company: values, recent news, role responsibilities</li>
                    <li>Prepare 2–3 questions to ask at the end — shows genuine interest</li>
                  </ul>
                </div>
              )}

              {/* Pro upsell — shown after free sessions consumed */}
              {gateCount >= 2 && (
                <div style={{ padding: '16px 18px', borderRadius: 16, background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(20,184,166,0.06))', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
                    🚀 You&apos;re doing great — unlock everything
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 12, lineHeight: 1.6 }}>
                    This is your {gateCount === 2 ? 'last free session' : 'free session'}. Pro gives you unlimited topics, past paper mode, mock interviews, progress tracking & PDF study guides.
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {['✓ Unlimited sessions', '✓ Mock interviews', '✓ PDF study guides', '✓ Progress tracking', '✓ Past paper mode'].map(f => (
                      <span key={f} style={{ fontSize: 10, fontWeight: 700, color: '#6ee7b7', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: 99 }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loadingExplain && !explainError && (
            <button onClick={loadQuiz} className={btn.primary + ' w-full justify-center py-4 text-base'}>
              Got it — Quiz me <ArrowRight size={18} />
            </button>
          )}
        </>
      )}

      {showGate && (
        <RegisterGate
          freeUsed={gateCount}
          freeLimit={3}
          freeFeature="learning sessions"
          lockedFeature="full learning paths & progress tracking"
          accentColor="#059669"
          site="tutiq"
          onSuccess={(user) => { onRegistered(); router.push('/learn') }}
          onDismiss={dismissGate}
        />
      )}

      {/* ── QUIZ ─────────────────────────────────────────────── */}
      {showQuiz && (
        <div>
          {loadingQuiz && (
            <div className={`${theme.card} p-8 flex flex-col items-center gap-4`}>
              <Loader2 size={28} className={`${theme.textAccent} animate-spin`} />
              <p className="text-white/40 text-sm">Generating your quiz…</p>
            </div>
          )}

          {quizError && !loadingQuiz && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{quizError}</div>
              <button onClick={loadQuiz} className={btn.secondary + ' flex items-center gap-2'}>
                <RotateCcw size={15} /> Try again
              </button>
            </div>
          )}

          {!loadingQuiz && !quizError && !quizDone && q && (
            <div className="space-y-5">
              {/* Quiz progress */}
              <div className="flex justify-between text-xs text-white/40">
                <span>Question {qIndex + 1} of {questions.length}</span>
                <span>{score} correct so far</span>
              </div>
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all`}
                  style={{ width: `${((qIndex) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className={`${theme.card} p-6`}>
                <p className="text-sm text-white/40 uppercase tracking-widest font-medium mb-3">
                  {q.type === 'true_false' ? 'True or False' : q.type === 'fill_blank' ? 'Fill in the blank' : 'Multiple choice'}
                </p>
                <p className="text-white text-lg font-semibold leading-snug">{q.question}</p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {q.type === 'true_false' ? (
                  ['True', 'False'].map(opt => renderOption(opt, q, selected, revealed, handleAnswer))
                ) : q.options && q.options.length > 0 ? (
                  q.options.map(opt => renderOption(opt, q, selected, revealed, handleAnswer))
                ) : (
                  /* fill_blank — free text simplified to show answer reveal */
                  <div className="space-y-3">
                    <input
                      className="input-dark"
                      placeholder="Type your answer…"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !revealed) handleAnswer((e.target as HTMLInputElement).value)
                      }}
                      disabled={revealed}
                    />
                    {!revealed && (
                      <button onClick={() => handleAnswer('')} className={btn.secondary + ' text-sm'}>
                        Check answer
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Explanation */}
              {revealed && (
                <div className={`p-4 rounded-xl border ${
                  (selected ?? '').trim().toLowerCase() === q.answer.trim().toLowerCase() || q.answer.toLowerCase().includes((selected ?? '').trim().toLowerCase())
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-red-500/40 bg-red-500/10'
                }`}>
                  <p className="font-semibold text-white text-sm mb-1">
                    {(selected ?? '').trim().toLowerCase() === q.answer.trim().toLowerCase() || q.answer.toLowerCase().includes((selected ?? '').trim().toLowerCase())
                      ? '✅ Correct!'
                      : `❌ Not quite — the answer is: ${q.answer}`
                    }
                  </p>
                  <p className="text-white/65 text-sm leading-relaxed">{q.explanation}</p>
                </div>
              )}

              {revealed && (
                <button onClick={nextQuestion} className={btn.primary + ' w-full justify-center py-3'}>
                  {qIndex + 1 < questions.length ? 'Next question' : 'See results'} <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}

          {/* Quiz complete */}
          {quizDone && (
            <div className={`${theme.card} p-8 text-center`}>
              <div className="text-5xl mb-4">{score >= 4 ? '🎉' : score >= 3 ? '👍' : '💪'}</div>
              <h2 className="text-2xl font-extrabold text-white mb-2">Quiz complete!</h2>
              <div className={`text-4xl font-extrabold ${theme.gradientText} mb-2`}>{score}/{questions.length}</div>
              <p className="text-white/50 text-sm mb-8">
                {score === questions.length ? 'Perfect score — you nailed it!'
                  : score >= 4 ? 'Great job! You really understood this topic.'
                  : score >= 3 ? 'Good effort — review the explanations above if anything felt tricky.'
                  : 'Keep at it — every lesson builds on the last.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={markComplete} className={btn.primary + ' justify-center'}>
                  <CheckCircle size={16} /> Mark as complete
                </button>
                <button onClick={loadQuiz} className={btn.secondary + ' justify-center'}>
                  <RotateCcw size={15} /> Retake quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function renderOption(
  opt: string,
  q: Question,
  selected: string | null,
  revealed: boolean,
  onSelect: (opt: string) => void,
) {
  const isSelected = selected === opt
  const isCorrect  = opt.trim().toLowerCase() === q.answer.trim().toLowerCase() ||
                     q.answer.toLowerCase().includes(opt.trim().toLowerCase())

  let cls = 'w-full text-left p-4 rounded-xl border transition-all duration-200 font-medium text-sm '
  if (!revealed) {
    cls += 'border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] text-white cursor-pointer'
  } else if (isCorrect) {
    cls += 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 cursor-default'
  } else if (isSelected && !isCorrect) {
    cls += 'border-red-500/50 bg-red-500/10 text-red-300 cursor-default'
  } else {
    cls += 'border-white/[0.04] bg-white/[0.02] text-white/30 cursor-default'
  }

  return (
    <button key={opt} className={cls} onClick={() => onSelect(opt)} disabled={revealed}>
      <span className="flex items-center gap-3">
        {revealed && isCorrect && <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />}
        {opt}
      </span>
    </button>
  )
}
