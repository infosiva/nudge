'use client'

/**
 * useVoiceFeedback — browser Web Speech API TTS for quiz answer feedback
 * No API key needed — uses device's built-in speech synthesis
 * Falls back silently if not supported (iOS Safari, some Android)
 *
 * Usage:
 *   const { speak, speakResult } = useVoiceFeedback()
 *   speakResult(true, 'Paris')   // "Correct! The answer is Paris."
 *   speakResult(false, 'London') // "Not quite. The correct answer is London."
 */

import { useCallback, useEffect, useRef } from 'react'

interface VoiceFeedbackOptions {
  rate?: number   // 0.5–2.0, default 1.05 (slightly faster = more energetic)
  pitch?: number  // 0.5–2.0, default 1.1 (slightly higher = friendlier)
  volume?: number // 0–1, default 1
  lang?: string   // BCP 47 lang code, default 'en-GB'
}

export function useVoiceFeedback(opts: VoiceFeedbackOptions = {}) {
  const { rate = 1.05, pitch = 1.1, volume = 1, lang = 'en-GB' } = opts
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const pendingRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Cancel any ongoing speech when unmounting
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel()
    }
  }, [supported])

  const speak = useCallback((text: string, priority = false) => {
    if (!supported) return
    if (priority) window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = rate
    utt.pitch = pitch
    utt.volume = volume
    utt.lang = lang
    pendingRef.current = utt
    window.speechSynthesis.speak(utt)
  }, [supported, rate, pitch, volume, lang])

  const speakResult = useCallback((
    correct: boolean,
    correctAnswer?: string,
    questionNum?: number,
  ) => {
    if (!supported) return
    window.speechSynthesis.cancel()

    let text: string
    if (correct) {
      const praise = ['Correct!', 'Well done!', 'Spot on!', 'Excellent!', 'That\'s right!']
      text = praise[Math.floor(Math.random() * praise.length)]
      if (correctAnswer) text += ` The answer is ${correctAnswer}.`
    } else {
      const encouragement = ['Not quite.', 'Good try.', 'Nearly!', 'Unlucky.']
      text = encouragement[Math.floor(Math.random() * encouragement.length)]
      if (correctAnswer) text += ` The correct answer is ${correctAnswer}.`
    }

    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = correct ? 1.1 : 1.0
    utt.pitch = correct ? 1.2 : 0.95
    utt.volume = volume
    utt.lang = lang
    window.speechSynthesis.speak(utt)
  }, [supported, volume, lang])

  const speakQuestion = useCallback((question: string, questionNum?: number) => {
    if (!supported) return
    window.speechSynthesis.cancel()
    const prefix = questionNum ? `Question ${questionNum}. ` : ''
    speak(`${prefix}${question}`)
  }, [supported, speak])

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
  }, [supported])

  return { speak, speakResult, speakQuestion, cancel, supported }
}
