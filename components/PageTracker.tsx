'use client'

/**
 * PageTracker — fires on every page navigation, sends to VPS tracker-api
 * Include once in layout.tsx. Zero user-visible impact.
 * Tracks: site, path, referrer, session_id, duration
 * View all data: GET http://31.97.56.148:3098/stats?key=sitestats2025
 */
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const TRACKER = 'http://31.97.56.148:3098/track'
const SESSION_ENDPOINT = 'http://31.97.56.148:3098/session'

function getSid(): string {
  try {
    let sid = sessionStorage.getItem('_nt_sid')
    if (!sid) { sid = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('_nt_sid', sid) }
    return sid
  } catch { return 'anon' }
}

export default function PageTracker({ site }: { site: string }) {
  const pathname = usePathname()
  const entryTime = useRef(Date.now())
  const pageCount = useRef(0)
  const sid = useRef(getSid())

  useEffect(() => {
    const ua = navigator.userAgent
    if (/bot|crawler|spider|Googlebot|bingbot/i.test(ua)) return

    pageCount.current++
    entryTime.current = Date.now()

    navigator.sendBeacon(TRACKER, JSON.stringify({
      site,
      path:       pathname,
      referrer:   document.referrer || null,
      session_id: sid.current,
    }))
  }, [pathname, site])

  // Send session summary on tab close
  useEffect(() => {
    const send = () => {
      const duration = Math.round((Date.now() - entryTime.current) / 1000)
      navigator.sendBeacon(SESSION_ENDPOINT, JSON.stringify({
        site,
        session_id: sid.current,
        duration_s: duration,
        pages:      pageCount.current,
      }))
    }
    window.addEventListener('beforeunload', send)
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') send() })
    return () => window.removeEventListener('beforeunload', send)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site])

  return null
}
