'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Lock, CheckCircle, BookOpen, Loader2, Flame, Trophy, Target, Clock } from 'lucide-react'
import _config from '@/vertical.config'
import type { AiToolConfig } from '@/vertical.config'
import { theme, btn } from '@/lib/theme'
const config = _config as AiToolConfig

function getStreak(): number {
  try {
    const data = JSON.parse(localStorage.getItem('nudge_streak') ?? '{}')
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    if (data.lastDate === today) return data.count ?? 1
    if (data.lastDate === yesterday) return data.count ?? 1
    return 0
  } catch { return 0 }
}

function updateStreak() {
  try {
    const today = new Date().toDateString()
    const data = JSON.parse(localStorage.getItem('nudge_streak') ?? '{}')
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    let count = 1
    if (data.lastDate === today) count = data.count
    else if (data.lastDate === yesterday) count = (data.count ?? 0) + 1
    localStorage.setItem('nudge_streak', JSON.stringify({ count, lastDate: today }))
    return count
  } catch { return 1 }
}

interface Profile {
  name: string
  age: number
  subject: string
  level: 'beginner' | 'some' | 'confident'
  goal: string
}

interface Topic {
  id: string
  title: string
  desc: string
}

export default function LearnPage() {
  const router = useRouter()

  const [profile, setProfile]     = useState<Profile | null>(null)
  const [topics, setTopics]       = useState<Topic[]>([])
  const [completed, setCompleted] = useState<string[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [streak, setStreak]       = useState(0)
  const [totalDone, setTotalDone] = useState(0)

  useEffect(() => {
    setStreak(getStreak())
    const raw = localStorage.getItem('nudge_profile')
    if (!raw) { router.replace('/onboard'); return }

    const p: Profile = JSON.parse(raw)
    setProfile(p)

    // Load completed topics from localStorage
    const doneRaw = localStorage.getItem(`nudge_done_${p.subject}`)
    if (doneRaw) {
      const done = JSON.parse(doneRaw)
      setCompleted(done)
      setTotalDone(done.length)
    }

    // Load or generate topics
    const topicKey = `nudge_topics_${p.subject}_${p.level}_${p.age}`
    const cachedTopics = localStorage.getItem(topicKey)
    if (cachedTopics) {
      setTopics(JSON.parse(cachedTopics))
      setLoading(false)
      return
    }

    // Generate from API
    fetch('/api/learn/path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: p.subject, level: p.level, goal: p.goal, age: p.age }),
    })
      .then(r => r.json())
      .then(data => {
        const t: Topic[] = data.topics ?? []
        setTopics(t)
        localStorage.setItem(topicKey, JSON.stringify(t))
      })
      .catch(() => setError('Could not load your learning path. Please refresh.'))
      .finally(() => setLoading(false))
  }, [router])

  if (!profile) return null

  const subject = config.subjects.find(s => s.id === profile.subject)
  const levelLabel = { beginner: 'Beginner', some: 'Some knowledge', confident: 'Confident' }[profile.level]
  const progressPct = topics.length ? Math.round((completed.length / topics.length) * 100) : 0

  // First non-completed topic
  const nextTopic = topics.find(t => !completed.includes(t.id))

  return (
    <div className="min-h-screen px-6 py-12 max-w-6xl mx-auto">

      {/* Progress bar */}
      <div className="h-1 bg-white/[0.06] rounded-full mb-10 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-700`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Main panel ─────────────────────────────────────── */}
        <div className="flex-1 space-y-6">

          {/* Welcome header */}
          <div className={`${theme.card} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className={`text-sm ${theme.textAccent} font-medium mb-1`}>Welcome back</p>
                <h1 className="text-2xl font-extrabold text-white">{profile.name} 👋</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-white/50 text-sm flex items-center gap-1.5">
                    <span>{subject?.icon}</span> {subject?.label}
                  </span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/50 text-sm">{levelLabel}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/50 text-sm">Age {profile.age}</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-extrabold ${theme.gradientText}`}>{progressPct}%</div>
                <div className="text-white/40 text-xs">{completed.length}/{topics.length} topics done</div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <Flame size={20} className="mx-auto mb-1" style={{ color: '#fbbf24' }} />
              <div className="text-xl font-black text-white">{streak}</div>
              <div className="text-xs text-white/40">day streak</div>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Trophy size={20} className="mx-auto mb-1" style={{ color: '#10b981' }} />
              <div className="text-xl font-black text-white">{totalDone}</div>
              <div className="text-xs text-white/40">topics done</div>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Target size={20} className="mx-auto mb-1" style={{ color: '#818cf8' }} />
              <div className="text-xl font-black text-white">{progressPct}%</div>
              <div className="text-xs text-white/40">complete</div>
            </div>
          </div>

          {/* Continue Learning */}
          {!loading && nextTopic && (
            <div className={`${theme.card} border ${theme.border} p-6 ${theme.glow}`}>
              <p className={`text-xs font-bold ${theme.textAccent} uppercase tracking-widest mb-3`}>▶ Continue Learning</p>
              <h2 className="text-xl font-bold text-white mb-2">{nextTopic.title}</h2>
              <p className="text-white/50 text-sm mb-5">{nextTopic.desc}</p>
              <div className="flex flex-wrap gap-3">
                <Link href={`/learn/${nextTopic.id}`} className={btn.primary}>
                  Start lesson <ArrowRight size={16} />
                </Link>
                <Link href={`/learn/${nextTopic.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Clock size={14} /> Quick quiz only
                </Link>
              </div>
            </div>
          )}

          {!loading && !nextTopic && topics.length > 0 && (
            <div className={`${theme.card} p-6 text-center`}>
              <div className="text-4xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-white mb-2">You&apos;ve completed this path!</h2>
              <p className="text-white/50 text-sm mb-5">You finished all {topics.length} topics in {subject?.label}. Ready for the next challenge?</p>
              <Link href="/onboard" className={btn.primary}>
                Start a new subject <ArrowRight size={16} />
              </Link>
            </div>
          )}

          {loading && (
            <div className={`${theme.card} p-8 flex flex-col items-center gap-4`}>
              <Loader2 size={32} className={`${theme.textAccent} animate-spin`} />
              <p className="text-white/50 text-sm">Building your personalised learning path…</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">{error}</div>
          )}

          {/* Goal reminder */}
          {profile.goal && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-1">Your goal</p>
              <p className="text-white/70 text-sm italic">&ldquo;{profile.goal}&rdquo;</p>
            </div>
          )}
        </div>

        {/* ── Sidebar: topic list ─────────────────────────────── */}
        <div className="lg:w-72 flex-shrink-0 space-y-4">

          {/* XP / Level card */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Your Level</span>
              <span className="text-xs font-black" style={{ color: '#fbbf24' }}>
                {totalDone < 3 ? '🌱 Seedling' : totalDone < 8 ? '📘 Explorer' : totalDone < 15 ? '🔥 Achiever' : '🏆 Master'}
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (totalDone % 5) * 20)}%`, background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
            </div>
            <p className="text-[11px] text-white/30 mt-1.5">{totalDone % 5}/5 topics to next level</p>
          </div>

          <div className={`${theme.card} p-5`}>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={16} className={theme.textAccent} />
              <span className="font-semibold text-white text-sm">Learning Path</span>
              <span className="ml-auto text-xs text-white/30">{completed.length}/{topics.length}</span>
            </div>

            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-12 bg-white/[0.04] rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {!loading && topics.length > 0 && (
              <div className="space-y-2">
                {topics.map((topic, idx) => {
                  const isDone    = completed.includes(topic.id)
                  const isNext    = !isDone && idx === topics.findIndex(t => !completed.includes(t.id))
                  const isLocked  = !isDone && !isNext

                  return (
                    <div key={topic.id}>
                      {isLocked ? (
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.04] opacity-40 cursor-not-allowed">
                          <Lock size={14} className="text-white/40 flex-shrink-0" />
                          <span className="text-white/50 text-sm truncate">{topic.title}</span>
                        </div>
                      ) : (
                        <Link
                          href={`/learn/${topic.id}`}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                            isDone
                              ? 'border-emerald-500/30 bg-emerald-500/10'
                              : `border-white/[0.08] hover:border-emerald-500/30 hover:bg-white/[0.06] ${isNext ? 'border-emerald-500/20 bg-white/[0.04]' : ''}`
                          }`}
                        >
                          {isDone
                            ? <CheckCircle size={14} className={`${theme.textAccent} flex-shrink-0`} />
                            : <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${isNext ? 'border-emerald-400' : 'border-white/30'}`} />
                          }
                          <span className={`text-sm truncate ${isDone ? theme.textAccentBold : isNext ? 'text-white' : 'text-white/60'}`}>
                            {topic.title}
                          </span>
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Change subject */}
          <Link href="/onboard" className="block mt-2 text-center text-white/30 hover:text-white/60 text-xs transition-colors">
            Change subject →
          </Link>

        </div>{/* end sidebar space-y-4 */}

      </div>
    </div>
  )
}
