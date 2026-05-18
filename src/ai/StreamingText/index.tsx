'use client'

import { useEffect, useState } from 'react'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type { StreamingTextProps } from './types'

// Constant cadence (default 35 tok/s). Renders tokens incrementally so
// the final text stays addressable by tests / screen readers — there's
// no per-character DOM churn. v4.3 §5.2, closes O-006.
export function StreamingText({
  tokens,
  cadence = 35,
  showCursor = true,
  onComplete,
  className = '',
}: StreamingTextProps) {
  const [revealed, setRevealed] = useState(0)

  useEffect(() => {
    if (revealed >= tokens.length) {
      onComplete?.()
      return
    }
    const interval = 1000 / Math.max(1, cadence)
    const t = setTimeout(() => setRevealed((n) => n + 1), interval)
    return () => clearTimeout(t)
  }, [revealed, tokens.length, cadence, onComplete])

  // Reset when the token sequence changes identity.
  useEffect(() => {
    setRevealed(0)
  }, [tokens])

  const done = revealed >= tokens.length
  return (
    <>
    <TelemetryBeacon component="StreamingText" meta={{ cadence, tokenCount: tokens.length }} />
    <span className={className} aria-live="polite" aria-atomic="false">
      {tokens.slice(0, revealed).map((tok, i) => (
        <span key={i}>{tok}</span>
      ))}
      {!done && showCursor && (
        <span
          aria-hidden="true"
          className="inline-block w-[1ch] streamhead-cursor"
          style={{ color: 'var(--color-iris-streamhead)' }}
        >
          ▍
        </span>
      )}
    </span>
    </>
  )
}

export type { StreamingTextProps } from './types'
