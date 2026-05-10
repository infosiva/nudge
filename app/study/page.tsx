'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Upload, FileText, Brain, Layers, BookOpen, ChevronRight, X, RotateCcw, CheckCircle } from 'lucide-react'

interface Flashcard { front: string; back: string }
interface QuizQ { question: string; options: string[]; answer: string; explanation: string }

interface StudyResult {
  filename: string
  charCount: number
  summary: string[]
  flashcards: Flashcard[]
  quiz: QuizQ[]
}

type Tab = 'summary' | 'flashcards' | 'quiz'

function SummaryTab({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((pt, i) => (
        <li key={i} className="flex gap-3 items-start p-3.5 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>{i + 1}</span>
          <p className="text-sm text-white/80 leading-relaxed">{pt}</p>
        </li>
      ))}
    </ul>
  )
}

function FlashcardsTab({ cards }: { cards: Flashcard[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})
  const [done, setDone]       = useState<Record<number, boolean>>({})

  return (
    <div>
      <p className="text-xs text-white/30 mb-4">{Object.keys(done).length}/{cards.length} reviewed · click card to flip</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card, i) => (
          <div key={i}
            onClick={() => setFlipped(p => ({ ...p, [i]: !p[i] }))}
            style={{
              minHeight: 120,
              borderRadius: 14,
              padding: '16px 18px',
              cursor: 'pointer',
              border: done[i] ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(255,255,255,0.09)',
              background: done[i] ? 'rgba(16,185,129,0.06)' : flipped[i] ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
              transition: 'all 0.2s',
              position: 'relative',
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold leading-snug" style={{ color: flipped[i] ? '#10b981' : '#f4f4f5' }}>
                {flipped[i] ? card.back : card.front}
              </p>
              {done[i] && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#10b981' }} />}
            </div>
            <p className="text-[10px] mt-2" style={{ color: 'rgba(255,255,255,0.2)' }}>
              {flipped[i] ? 'Answer' : 'Question — tap to reveal'}
            </p>
            {flipped[i] && !done[i] && (
              <button
                onClick={e => { e.stopPropagation(); setDone(p => ({ ...p, [i]: true })) }}
                className="mt-3 text-[11px] font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}
              >
                Got it ✓
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function QuizTab({ questions }: { questions: QuizQ[] }) {
  const [selected, setSelected] = useState<Record<number, string>>({})
  const [revealed, setReveal]   = useState<Record<number, boolean>>({})
  const score = Object.entries(selected).filter(([i, ans]) => ans === questions[Number(i)].answer).length

  return (
    <div className="space-y-5">
      {Object.keys(selected).length === questions.length && (
        <div className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <span className="text-2xl">🎯</span>
          <div>
            <p className="font-black text-white">{score}/{questions.length} correct</p>
            <p className="text-xs text-white/40">{score === questions.length ? 'Perfect score!' : score >= questions.length / 2 ? 'Good job — review wrong answers below' : 'Keep studying — you\'ve got this!'}</p>
          </div>
        </div>
      )}

      {questions.map((q, i) => {
        const sel = selected[i]
        const correct = q.answer
        const show = revealed[i] || (sel !== undefined)

        return (
          <div key={i} className="space-y-2.5">
            <p className="text-sm font-bold text-white/90">{i + 1}. {q.question}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map(opt => {
                const isSelected = sel === opt
                const isCorrect  = opt === correct
                let bg = 'rgba(255,255,255,0.03)'
                let border = '1px solid rgba(255,255,255,0.09)'
                let color = 'rgba(255,255,255,0.6)'

                if (show) {
                  if (isCorrect) { bg = 'rgba(16,185,129,0.1)'; border = '1px solid rgba(16,185,129,0.4)'; color = '#10b981' }
                  else if (isSelected) { bg = 'rgba(239,68,68,0.08)'; border = '1px solid rgba(239,68,68,0.3)'; color = '#f87171' }
                }

                return (
                  <button key={opt}
                    disabled={sel !== undefined}
                    onClick={() => { setSelected(p => ({ ...p, [i]: opt })); setReveal(p => ({ ...p, [i]: true })) }}
                    style={{ background: bg, border, color, borderRadius: 10, padding: '9px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, cursor: sel ? 'default' : 'pointer', transition: 'all 0.15s' }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {show && q.explanation && (
              <p className="text-xs italic px-1" style={{ color: 'rgba(255,255,255,0.35)' }}>💡 {q.explanation}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function StudyPage() {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [result, setResult]     = useState<StudyResult | null>(null)
  const [tab, setTab]           = useState<Tab>('summary')
  const fileRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    const allowed = ['application/pdf', 'text/plain', 'text/markdown', 'text/x-markdown']
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|txt|md)$/i)) {
      setError('Only PDF, TXT, or Markdown files supported')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/study/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Upload failed'); return }
      setResult(json)
      setTab('summary')
    } catch {
      setError('Network error — try again')
    } finally {
      setLoading(false)
    }
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = result ? [
    { id: 'summary',    label: 'Summary',    icon: <BookOpen className="w-3.5 h-3.5" />,  count: result.summary.length },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers className="w-3.5 h-3.5" />,    count: result.flashcards.length },
    { id: 'quiz',       label: 'Quiz',       icon: <Brain className="w-3.5 h-3.5" />,     count: result.quiz.length },
  ] : []

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Study Buddy</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Upload notes → get quiz, flashcards &amp; summary instantly
          </p>
        </div>
        <Link href="/" className="text-sm font-semibold flex items-center gap-1"
          style={{ color: 'rgba(255,255,255,0.3)' }}>
          ← Home
        </Link>
      </div>

      {/* Drop zone */}
      {!result && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !loading && fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 20,
            padding: '48px 24px',
            textAlign: 'center',
            cursor: loading ? 'wait' : 'pointer',
            background: dragging ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.015)',
            transition: 'all 0.2s',
          }}
        >
          <input ref={fileRef} type="file" accept=".pdf,.txt,.md" className="hidden" onChange={onFileInput} />

          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
              <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Analysing your notes…
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <Upload className="w-6 h-6" style={{ color: '#10b981' }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Drop your study material here</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  PDF, TXT, or Markdown · max 5 MB
                </p>
              </div>
              <button className="text-xs font-bold px-4 py-2 rounded-full mt-1"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>
                Browse file
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5">

          {/* File info bar */}
          <div className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
              <div>
                <p className="text-sm font-bold text-white/80">{result.filename}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {result.charCount.toLocaleString()} chars extracted
                </p>
              </div>
            </div>
            <button
              onClick={() => { setResult(null); setError('') }}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <RotateCcw className="w-3 h-3" /> New file
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
                style={tab === t.id
                  ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)' }
                  : { color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t.icon}
                {t.label}
                <span className="ml-0.5 opacity-60">({t.count})</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {tab === 'summary'    && <SummaryTab    items={result.summary} />}
            {tab === 'flashcards' && <FlashcardsTab cards={result.flashcards} />}
            {tab === 'quiz'       && <QuizTab       questions={result.quiz} />}
          </div>

          {/* CTA to full tutor */}
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <div>
              <p className="text-sm font-bold text-white/80">Want deeper help?</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Chat with your AI tutor on any topic
              </p>
            </div>
            <Link href="/learn"
              className="flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-lg"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)' }}>
              Start learning <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
