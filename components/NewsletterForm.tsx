'use client'
import { useState } from 'react'

export default function NewsletterForm({ accentClass = 'from-emerald-600 to-teal-500' }: { accentClass?: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setState(res.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return <p className="text-sm text-white/60">You&apos;re subscribed! 🎉</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@email.com"
        required
        className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/25 outline-none focus:border-white/20"
      />
      <button
        type="submit"
        disabled={state === 'loading'}
        className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${accentClass} disabled:opacity-50 transition`}
      >
        {state === 'loading' ? '...' : 'Subscribe'}
      </button>
    </form>
  )
}
