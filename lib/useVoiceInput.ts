'use client'

/**
 * useVoiceInput — browser Web Speech API STT for quiz text input
 * Pairs with useVoiceFeedback (TTS) for full voice+text quiz UX
 * No API key — device built-in speech recognition
 *
 * Usage:
 *   const { transcript, listening, toggleListening, resetTranscript } = useVoiceInput({ onResult })
 */

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseVoiceInputOptions {
  lang?: string         // BCP 47, default 'en-US'
  continuous?: boolean  // keep mic open, default false
  onResult?: (text: string) => void  // called when speech recognised
  onError?: (error: string) => void
}

export function useVoiceInput(opts: UseVoiceInputOptions = {}) {
  const { lang = 'en-US', continuous = false, onResult, onError } = opts
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRec) setSupported(true)
  }, [])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const startListening = useCallback(() => {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) return

    const rec = new SpeechRec()
    rec.lang = lang
    rec.interimResults = false
    rec.continuous = continuous
    rec.maxAlternatives = 1

    rec.onresult = (e: any) => {
      const text = e.results[e.results.length - 1][0].transcript.trim()
      setTranscript(text)
      onResult?.(text)
      if (!continuous) setListening(false)
    }

    rec.onerror = (e: any) => {
      onError?.(e.error)
      setListening(false)
    }

    rec.onend = () => {
      if (!continuous) setListening(false)
    }

    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }, [lang, continuous, onResult, onError])

  const toggleListening = useCallback(() => {
    if (listening) stopListening()
    else startListening()
  }, [listening, startListening, stopListening])

  const resetTranscript = useCallback(() => setTranscript(''), [])

  useEffect(() => () => recognitionRef.current?.stop(), [])

  return { transcript, listening, supported, toggleListening, startListening, stopListening, resetTranscript }
}
