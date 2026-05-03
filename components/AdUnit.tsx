'use client'
import { useEffect } from 'react'

interface AdUnitProps {
  size?: 'banner' | 'rectangle'  // banner=728x90, rectangle=300x250
  className?: string
}

const ADSTERRA_KEY_BANNER = 'ADSTERRA_BANNER_KEY'     // replace after signup at adsterra.com
const ADSTERRA_KEY_RECT   = 'ADSTERRA_RECTANGLE_KEY'  // replace after signup at adsterra.com

// Non-intrusive Adsterra ad unit — blends with dark theme, never shown during active gameplay
export default function AdUnit({ size = 'rectangle', className = '' }: AdUnitProps) {
  const key    = size === 'banner' ? ADSTERRA_KEY_BANNER : ADSTERRA_KEY_RECT
  const width  = size === 'banner' ? 728 : 300
  const height = size === 'banner' ? 90  : 250

  useEffect(() => {
    // @ts-expect-error adsterra global
    window.atOptions = { key, format: 'iframe', height, width, params: {} }
    const s = document.createElement('script')
    s.type  = 'text/javascript'
    s.src   = 'https://epnzryrk.com/act/files/tag.min.js'
    s.setAttribute('data-cfasync', 'false')
    document.getElementById(`ad-${key}`)?.appendChild(s)
  }, [key, height, width])

  return (
    <div
      className={`relative flex justify-center items-center overflow-hidden rounded-xl ${className}`}
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', minHeight: height }}
    >
      <div className="text-[9px] text-white/15 text-center absolute top-1 w-full uppercase tracking-widest">Ad</div>
      <div id={`ad-${key}`} style={{ width, height }} />
    </div>
  )
}
