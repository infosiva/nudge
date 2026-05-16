import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Tutiq — AI Tutor for GCSE, 11+ & Interview Prep'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          background: 'linear-gradient(135deg, #030d0a 0%, #064e3b 50%, #022c22 100%)',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ background: '#10b981', borderRadius: 99, padding: '8px 20px', fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            AI Tutor
          </div>
          <div style={{ color: '#6ee7b7', fontSize: 18, fontWeight: 600 }}>Free to start</div>
        </div>

        {/* Headline */}
        <div style={{ fontSize: 72, fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24, maxWidth: 900 }}>
          Ace your exams.{'\n'}
          <span style={{ color: '#34d399' }}>AI tutor, always ready.</span>
        </div>

        {/* Sub */}
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.55)', fontWeight: 400, marginBottom: 48, maxWidth: 700 }}>
          GCSE revision · 11+ prep · Job interview coaching. Personalised to your age and level.
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, padding: '10px 24px', color: '#6ee7b7', fontSize: 20, fontWeight: 700 }}>
            tutiq.app
          </div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>Powered by AI · Trusted by students & job seekers</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
