'use client'
import React, { useState } from 'react'
import MagicAuthModal from './MagicAuthModal'
import type { AuthUser } from './useMagicAuth'

interface RegisterGateProps {
  freeUsed: number
  freeLimit: number
  freeFeature: string
  lockedFeature: string
  accentColor?: string
  site: string
  onSuccess: (user: AuthUser) => void
  onDismiss: () => void
}

export default function RegisterGate({
  freeUsed, freeLimit, freeFeature, lockedFeature,
  accentColor = '#6366f1', site, onSuccess, onDismiss,
}: RegisterGateProps) {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      {/* Gate overlay */}
      <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '32px 28px 28px',
          maxWidth: 400, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', textAlign: 'center',
        }}>
          {/* Top accent */}
          <div style={{ height: 4, borderRadius: 99, background: `linear-gradient(90deg,${accentColor},${accentColor}88)`, marginBottom: 24, marginLeft: -28, marginRight: -28, marginTop: -32 }} />

          {/* Usage dots */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
              {Array.from({ length: freeLimit }).map((_, i) => (
                <div key={i} style={{
                  width: 14, height: 14, borderRadius: '50%',
                  background: i < freeUsed ? accentColor : '#e2e8f0',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
              {freeUsed} of {freeLimit} free {freeFeature} used
            </p>
          </div>

          <h2 style={{ margin: '0 0 10px', fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
            You've hit the free limit
          </h2>
          <p style={{ margin: '0 0 6px', fontSize: 14, color: '#475569', lineHeight: 1.5 }}>
            Sign in to unlock <strong style={{ color: '#0f172a' }}>{lockedFeature}</strong>.
          </p>
          <p style={{ margin: '0 0 22px', fontSize: 13, color: '#94a3b8' }}>
            No password. No credit card. Just an email.
          </p>

          <button
            onClick={() => setShowAuth(true)}
            style={{
              width: '100%', padding: '13px 0', border: 'none', borderRadius: 10,
              background: accentColor, color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', marginBottom: 10, transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Sign in free — get a login code
          </button>

          <button onClick={onDismiss} style={{
            background: 'none', border: 'none', color: '#94a3b8',
            fontSize: 13, cursor: 'pointer', padding: '6px 0', width: '100%',
          }}>
            Maybe later
          </button>
        </div>
      </div>

      <MagicAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={u => { setShowAuth(false); onSuccess(u) }}
        site={site}
        accentColor={accentColor}
        title="Sign in free"
        subtitle="We'll email you a one-time code — no password ever."
      />
    </>
  )
}
