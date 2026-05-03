'use client'

import { useEffect } from 'react'

interface AdUnitProps {
  format?: 'auto' | 'horizontal' | 'rectangle'
  className?: string
}

const PUB_ID = 'ca-pub-4237294630161176'

// Non-intrusive ad unit — blends with dark theme, never shown during active gameplay
export default function AdUnit({ format = 'auto', className = '' }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-expect-error adsbygoogle untyped
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {}
  }, [])

  return (
    <div className={`overflow-hidden rounded-2xl ${className}`}
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="text-[9px] text-white/15 text-center pt-1.5 uppercase tracking-widest">Ad</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUB_ID}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
