'use client'

/**
 * VoiceTextInput — shared quiz input component
 * Supports simultaneous text typing + voice-to-text (mic button)
 * Copy to nudge/components/ and questly/components/ when updating
 */

import { useState, useEffect, useCallback, KeyboardEvent } from 'react'
import { useVoiceInput } from '@/lib/useVoiceInput'

interface VoiceTextInputProps {
  onSubmit: (value: string) => void
  placeholder?: string
  disabled?: boolean
  clearOnSubmit?: boolean
  autoFocus?: boolean
  className?: string
  accentColor?: string  // hex, default '#10b981'
}

export function VoiceTextInput({
  onSubmit,
  placeholder = 'Type your answer or tap the mic...',
  disabled = false,
  clearOnSubmit = true,
  autoFocus = false,
  accentColor = '#10b981',
}: VoiceTextInputProps) {
  const [value, setValue] = useState('')

  const { listening, supported, toggleListening } = useVoiceInput({
    onResult: (text) => {
      setValue(text)
    },
  })

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    if (clearOnSubmit) setValue('')
  }, [value, disabled, onSubmit, clearOnSubmit])

  const handleKey = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  const ringColor = listening ? accentColor : 'rgba(255,255,255,0.08)'
  const micBg = listening
    ? `${accentColor}20`
    : 'rgba(255,255,255,0.04)'

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
      {/* text input */}
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          autoFocus={autoFocus}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={listening ? 'Listening…' : placeholder}
          style={{
            width: '100%',
            padding: '12px 44px 12px 16px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${ringColor}`,
            color: '#f0fdf4',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color 0.25s',
            boxSizing: 'border-box',
          }}
        />
        {/* submit arrow inside input */}
        {value.trim() && !disabled && (
          <button
            onClick={handleSubmit}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              border: 'none', borderRadius: 8, width: 28, height: 28,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', fontSize: 14,
            }}>
            ↵
          </button>
        )}
      </div>

      {/* mic button */}
      {supported && (
        <button
          onClick={toggleListening}
          disabled={disabled}
          title={listening ? 'Stop listening' : 'Speak your answer'}
          style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: micBg,
            border: `1px solid ${listening ? accentColor : 'rgba(255,255,255,0.08)'}`,
            cursor: disabled ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            position: 'relative',
          }}>
          {/* pulse ring when listening */}
          {listening && (
            <span style={{
              position: 'absolute', inset: -3, borderRadius: 14,
              border: `2px solid ${accentColor}`,
              animation: 'mic-pulse 1s ease-in-out infinite',
            }} />
          )}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={listening ? accentColor : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="2" width="6" height="11" rx="3" />
            <path d="M19 10a7 7 0 0 1-14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
            <line x1="9" y1="22" x2="15" y2="22" />
          </svg>
        </button>
      )}

      {/* css for mic pulse */}
      <style>{`
        @keyframes mic-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
