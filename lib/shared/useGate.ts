'use client'
import { useState, useEffect } from 'react'
import { isLoggedIn } from './useMagicAuth'

function getApiUrl(): string {
  return (process.env.NEXT_PUBLIC_AUTH_API_URL as string) || 'http://31.97.56.148:3110'
}

function getFingerprint(product: string): string {
  const key = `${product}_fp`
  let fp = localStorage.getItem(key)
  if (!fp) {
    fp = `${product}_` + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(key, fp)
  }
  return fp
}

async function serverTrack(product: string, action: string): Promise<number> {
  try {
    const fp = getFingerprint(product)
    const res = await fetch(`${getApiUrl()}/guest/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fingerprint: fp, product, action }),
    })
    const data = await res.json()
    return data.count ?? 1
  } catch {
    // Fallback to localStorage count if API unreachable
    const key = `${product}_${action}_count`
    const next = (parseInt(localStorage.getItem(key) || '0', 10)) + 1
    localStorage.setItem(key, String(next))
    return next
  }
}

async function serverGetCount(product: string, action: string): Promise<number> {
  try {
    const fp = getFingerprint(product)
    const res = await fetch(`${getApiUrl()}/guest/usage?fingerprint=${fp}&product=${product}&action=${encodeURIComponent(action)}`)
    const data = await res.json()
    return data.count ?? 0
  } catch {
    const key = `${product}_${action}_count`
    return parseInt(localStorage.getItem(key) || '0', 10)
  }
}

export function useGate(product: string, freeLimit: number, action = 'session') {
  const [count, setCount]           = useState(0)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showGate, setShowGate]     = useState(false)
  const [ready, setReady]           = useState(false)

  useEffect(() => {
    const registered = isLoggedIn()
    setIsRegistered(registered)
    if (!registered) {
      serverGetCount(product, action).then(c => {
        setCount(c)
        setReady(true)
      })
    } else {
      setReady(true)
    }
  }, [product, action])

  const increment = async (): Promise<boolean> => {
    if (isRegistered) return true // always allowed for registered users
    const next = await serverTrack(product, action)
    setCount(next)
    if (next >= freeLimit) {
      setShowGate(true)
      return false // blocked
    }
    return true // allowed
  }

  const onRegistered = () => {
    setIsRegistered(true)
    setShowGate(false)
  }

  const dismissGate = () => {
    setShowGate(false)
  }

  return { count, isRegistered, showGate, increment, onRegistered, dismissGate, ready }
}
