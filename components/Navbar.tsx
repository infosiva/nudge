'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import config from '@/vertical.config'
import { useMagicAuth } from '@/lib/shared/useMagicAuth'
import MagicAuthModal from '@/lib/shared/MagicAuthModal'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { user, logout, onSuccess } = useMagicAuth()

  // Hide sign-in for under-13 users (COPPA/GDPR-K — no email collection from children)
  const [isUnder13, setIsUnder13] = useState(false)
  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem('nudge_profile') ?? '{}')
      if (typeof profile.age === 'number' && profile.age < 13) setIsUnder13(true)
    } catch { /* ignore */ }
  }, [])

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/[0.05]"
        style={{ background: 'rgba(15,14,12,0.80)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo — warm editorial: book emoji + brand + subtitle */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl leading-none">📖</span>
            <div>
              <span className="font-bold text-lg text-white leading-none block tracking-tight">{config.name}</span>
              <span className="text-[10px] font-medium leading-none block" style={{ color: 'rgba(245,158,11,0.60)' }}>AI Tutor</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <Link href="/"
              className="relative hover:text-emerald-300 transition-colors group">
              Home
              <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-emerald-400/70" />
            </Link>
            <Link href="/#features"
              className="relative hover:text-emerald-300 transition-colors group">
              Features
              <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-emerald-400/70" />
            </Link>
            <Link href="/#subjects"
              className="relative hover:text-emerald-300 transition-colors group">
              Subjects
              <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-emerald-400/70" />
            </Link>
            <Link href="/pricing"
              className="relative hover:text-emerald-300 transition-colors group">
              Pricing
              <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-emerald-400/70" />
            </Link>
            <Link href="/about"
              className="relative hover:text-emerald-300 transition-colors group">
              About
              <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-emerald-400/70" />
            </Link>
          </div>

          {/* CTA — warm amber button or user state */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-white/60">Hi, {user.username || user.email.split('@')[0]}</span>
                <button onClick={logout} className="text-xs text-white/40 hover:text-amber-300 transition-colors border border-white/10 rounded-lg px-3 py-1.5">Sign out</button>
              </>
            ) : !isUnder13 ? (
              <button onClick={() => setAuthOpen(true)}
                className="rounded-lg px-5 py-2 text-sm font-semibold transition-all hover:brightness-110 hover:scale-105"
                style={{ background: '#f59e0b', color: '#1c1917' }}>
                Sign in free
              </button>
            ) : null}
            <Link href="/onboard"
              className="rounded-lg px-5 py-2 text-sm font-semibold text-stone-900 transition-all hover:brightness-110 hover:scale-105"
              style={{ background: '#f59e0b' }}>
              Start Free
            </Link>
          </div>

          <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/[0.05] px-6 py-5 flex flex-col gap-4 text-sm"
            style={{ background: 'rgba(15,14,12,0.97)' }}>
            <Link href="/" className="text-white/70 hover:text-emerald-300 transition-colors" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/#features" className="text-white/70 hover:text-emerald-300 transition-colors" onClick={() => setOpen(false)}>Features</Link>
            <Link href="/#subjects" className="text-white/70 hover:text-emerald-300 transition-colors" onClick={() => setOpen(false)}>Subjects</Link>
            <Link href="/pricing" className="text-white/70 hover:text-emerald-300 transition-colors" onClick={() => setOpen(false)}>Pricing</Link>
            <Link href="/about" className="text-white/70 hover:text-emerald-300 transition-colors" onClick={() => setOpen(false)}>About</Link>
            {user ? (
              <>
                <span className="text-center text-white/40 text-xs">Signed in as {user.email}</span>
                <button onClick={() => { logout(); setOpen(false) }} className="text-center rounded-lg py-2.5 text-white/50 border border-white/10">Sign out</button>
              </>
            ) : !isUnder13 ? (
              <button onClick={() => { setAuthOpen(true); setOpen(false) }}
                className="text-center rounded-lg py-2.5 font-semibold"
                style={{ background: '#f59e0b', color: '#1c1917' }}>
                Sign in free
              </button>
            ) : null}
            <Link href="/onboard"
              className="text-center rounded-lg py-2.5 font-semibold text-stone-900"
              style={{ background: '#f59e0b' }}
              onClick={() => setOpen(false)}>
              Start Learning Free
            </Link>
          </div>
        )}
      </nav>

      <MagicAuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={u => { onSuccess(u); setAuthOpen(false) }}
        site="tutiq"
        accentColor="#f59e0b"
      />
    </>
  )
}
