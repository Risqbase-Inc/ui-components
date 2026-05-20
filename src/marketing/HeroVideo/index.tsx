'use client'

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type { HeroVideoBeat, HeroVideoProps, HeroVideoState } from './types'

// HeroVideo — marketing-tier wrapper over a native <video>. Subsumes the
// homepage hero use case from BRIEF-429 V2 (Demo I). Spec docs/specs/v2.1.0/02-HeroVideo.md.
//
// CLIENT BOUNDARY (cover §2.3): IntersectionObserver-gated lazy-load and
// a `prefers-reduced-motion: reduce` media-query listener both require
// browser APIs, so the whole component is a client island. The wrapping
// page may render server-first; this component renders client-first.
//
// Behaviour contract (spec §3):
//   - `idle` until IntersectionObserver fires (poster + play affordance visible).
//   - On first intersect-true: attempt muted/playsInline .play(). On
//     success → `playing`. On failure → after a 5s retry window →
//     `errored` (poster + "Tap to play" overlay).
//   - On `prefers-reduced-motion: reduce` at mount: skip the IO entirely
//     and render the 2×2 fallback grid (`reduced-motion` state).
//   - Loop boundary fires `onLoopRestart` per spec §3.5; the visual
//     handshake itself lives in the video file, not this component.

const AUTOPLAY_RETRY_TIMEOUT_MS = 5000

/**
 * Cross-browser-safe MediaQueryList listener attach/detach. Older Safari
 * (<14) exposes `addListener` / `removeListener` instead of the modern
 * `addEventListener` / `removeEventListener` API. We feature-detect once
 * per binding rather than typing it as `any`.
 */
function bindMediaQuery(
  mq: MediaQueryList,
  handler: (ev: { matches: boolean }) => void
): () => void {
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }
  // Legacy Safari fallback — `addListener` exists but is typed as deprecated.
  const legacyMq = mq as MediaQueryList & {
    addListener(listener: (ev: { matches: boolean }) => void): void
    removeListener(listener: (ev: { matches: boolean }) => void): void
  }
  legacyMq.addListener(handler)
  return () => legacyMq.removeListener(handler)
}

interface FallbackCellProps {
  beat: HeroVideoBeat
  beatNumber: 1 | 2 | 3 | 4
}

function FallbackCell({ beat, beatNumber }: FallbackCellProps) {
  return (
    <div
      role="listitem"
      className="hv-fallback-cell"
      style={{
        background: 'var(--color-surface-default)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: 'var(--dimension-radius-card-default)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
        <img
          src={beat.fallbackFrame}
          alt={beat.fallbackAlt ?? ''}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
      {/* SR-only line — the carrier of meaning when motion is off.
          Sequenced so VoiceOver / NVDA read "Beat N of 4: {eyebrow}. {caption}." */}
      <p className="sr-only">
        Beat {beatNumber} of 4: {beat.eyebrow}. {beat.caption}.
      </p>
      <div aria-hidden="true" style={{ padding: '12px 14px' }}>
        <span
          className="hv-fallback-eyebrow"
          style={{
            display: 'block',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-iris-accent-hover)',
            marginBottom: 4,
          }}
        >
          {beat.eyebrow}
        </span>
        <p
          className="hv-fallback-caption"
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.45,
            color: 'var(--color-text-default)',
          }}
        >
          {beat.caption}
        </p>
      </div>
    </div>
  )
}

interface PlayDiscProps {
  state: HeroVideoState
  title: string
  onActivate: () => void
}

function PlayDisc({ state, title, onActivate }: PlayDiscProps) {
  const isLoading = state === 'loading'
  const isErrored = state === 'errored'
  const label = isErrored ? `Tap to play video: ${title}` : `Play video: ${title}`
  return (
    <button
      type="button"
      onClick={onActivate}
      aria-label={label}
      className={`hv-play-disc${isLoading ? ' hv-play-disc--loading' : ''}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 48,
        height: 48,
        borderRadius: '9999px',
        background: 'var(--color-iris-accent)',
        boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.8)',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        // ≥44×44 hit target (WCAG 2.5.8 / RALIA standard for primary).
      }}
    >
      {isErrored ? (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path
            d="M12 2 L22 20 L2 20 Z"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="rgba(255,255,255,0.15)"
          />
          <path
            d="M12 9 V13"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.5" r="1" fill="#FFFFFF" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#FFFFFF">
          <path d="M7 4 L20 12 L7 20 Z" />
        </svg>
      )}
    </button>
  )
}

export function HeroVideo({
  sources,
  poster,
  captions,
  beats,
  title,
  description,
  loop = true,
  rootMargin = 200,
  aspectRatio = '16/9',
  captionsDefault = true,
  onPlay,
  onPause,
  onProgress,
  onComplete,
  onLoopRestart,
  className = '',
}: HeroVideoProps) {
  // SSR-safe initial state: pretend reduced-motion is *not* set so the
  // server-rendered HTML matches the most common path. The mount-time
  // effect then resolves the real value and re-renders if the user has
  // reduced motion on. (Hydration mismatch is avoided because both
  // server and client start at 'idle'.)
  const [state, setState] = useState<HeroVideoState>('idle')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const lastTimeRef = useRef<number>(0)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stableId = useId()
  const titleId = `hv-title-${stableId}`
  const descId = `hv-desc-${stableId}`

  // Memoise sources / beats so the IntersectionObserver effect doesn't
  // re-bind on every parent render. The reference-equality guard is the
  // contract: parents pass stable arrays for the lifetime of the embed.
  const stableSources = useMemo(() => sources, [sources])

  const attemptPlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setState('loading')
    // Always muted before .play() — autoplay policy gate. We never
    // unmute; captions carry the meaning (spec §2.4 + accessibility §2).
    video.muted = true
    video.playsInline = true
    const playResult = video.play()
    if (playResult && typeof playResult.then === 'function') {
      playResult.then(
        () => {
          if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current)
            retryTimerRef.current = null
          }
          setState('playing')
        },
        () => {
          // Autoplay denied (e.g. Safari low-power). Hold in 'loading'
          // for the retry window; if no user gesture lands inside it,
          // transition to 'errored' which shows "Tap to play".
          retryTimerRef.current = setTimeout(() => {
            setState('errored')
          }, AUTOPLAY_RETRY_TIMEOUT_MS)
        }
      )
    } else {
      // Older browsers without a promise return — assume optimistic play.
      setState('playing')
    }
  }, [])

  // 1. Mount-time reduced-motion detection. Runs once and on the
  //    media-query change event so a user toggling the OS pref mid-page
  //    sees the fallback grid render.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setState('reduced-motion')
    }
    const unbind = bindMediaQuery(mq, (ev) => {
      if (ev.matches) {
        // Pause any playing video before swapping out of the
        // video-DOM-mounted state.
        const video = videoRef.current
        if (video && !video.paused) {
          try {
            video.pause()
          } catch {
            /* noop */
          }
        }
        setState('reduced-motion')
      } else {
        setState('idle')
      }
    })
    return unbind
  }, [])

  // 2. IntersectionObserver-gated lazy-play. Skipped under reduced-motion
  //    (no video element is mounted). The effect re-runs only when the
  //    reduced-motion gate flips — capturing that as a memoised boolean
  //    avoids depending on the full `state` enum (which would re-bind
  //    the observer on every play/pause transition).
  const isReducedMotionGate = state === 'reduced-motion'
  useEffect(() => {
    if (isReducedMotionGate) return
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      // SSR / very old browsers — fall back to immediate play attempt.
      attemptPlay()
      return
    }
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            attemptPlay()
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin: `${rootMargin}px 0px ${rootMargin}px 0px` }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, attemptPlay, isReducedMotionGate])

  // 3. Cleanup retry timer on unmount.
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
    }
  }, [])

  // Native <video> event wiring.
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const current = video.currentTime
    // Loop-boundary heuristic: time jumped backward AND the previous tick
    // was past 90% of duration. Native 'ended' doesn't fire when `loop`
    // is on; this is the documented detection pattern.
    if (loop && current < lastTimeRef.current && lastTimeRef.current > 0) {
      const duration = video.duration
      if (Number.isFinite(duration) && duration > 0 && lastTimeRef.current >= duration * 0.9) {
        setState('looped')
        onLoopRestart?.()
        // Snap back to playing on the next tick (state is transient).
        queueMicrotask(() => setState('playing'))
      }
    }
    lastTimeRef.current = current
    onProgress?.(current)
  }, [loop, onLoopRestart, onProgress])

  const handlePlayEvent = useCallback(() => {
    setState('playing')
    onPlay?.()
  }, [onPlay])

  const handlePauseEvent = useCallback(() => {
    // Only transition to 'paused' if we're currently 'playing'. Browser
    // can fire 'pause' on tab-background; semantically the same state,
    // but we surface the callback for analytics.
    setState((prev) => (prev === 'playing' || prev === 'looped' ? 'paused' : prev))
    onPause?.()
  }, [onPause])

  const handleEndedEvent = useCallback(() => {
    // Only meaningful when `loop` is false; with `loop` on, the browser
    // seeks-to-0 internally and emits no 'ended'.
    onComplete?.()
  }, [onComplete])

  const handleErrorEvent = useCallback(() => {
    setState('errored')
  }, [])

  const isReducedMotion = isReducedMotionGate
  const showPosterOverlay = state === 'idle' || state === 'loading' || state === 'paused' || state === 'errored'

  return (
    <>
      <TelemetryBeacon
        component="HeroVideo"
        meta={{ state, loop, captionsDefault, beatCount: beats.length }}
      />
      <figure
        ref={containerRef}
        role="figure"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`hv-root ${className}`}
        style={{
          position: 'relative',
          width: '100%',
          background: 'var(--color-iris-surface)',
          borderRadius: 'var(--dimension-radius-card-default)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-floating)',
          margin: 0,
        }}
      >
        <h3 id={titleId} className="sr-only">
          {title}
        </h3>

        {isReducedMotion ? (
          <>
            <div
              className="hv-fallback-grid"
              role="list"
              aria-label="Four-frame video summary"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 16,
                padding: 16,
                background: 'var(--color-iris-surface)',
              }}
            >
              {beats.map((beat, idx) => (
                <FallbackCell
                  key={beat.index}
                  beat={beat}
                  beatNumber={(idx + 1) as 1 | 2 | 3 | 4}
                />
              ))}
            </div>
          </>
        ) : (
          <div
            className="hv-video-frame"
            style={{
              position: 'relative',
              aspectRatio,
              background: 'var(--color-iris-surface)',
            }}
          >
            <video
              ref={videoRef}
              poster={poster}
              preload="metadata"
              playsInline
              muted
              loop={loop}
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlayEvent}
              onPause={handlePauseEvent}
              onEnded={handleEndedEvent}
              onError={handleErrorEvent}
              aria-label={title}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                background: 'var(--color-iris-surface)',
                objectFit: 'cover',
              }}
            >
              {stableSources.map((s) => (
                <source key={s.src} src={s.src} type={s.type} />
              ))}
              <track
                kind="captions"
                srcLang="en"
                src={captions}
                label="English captions"
                default={captionsDefault}
              />
            </video>

            {showPosterOverlay ? (
              <>
                {/* Poster underlay — sits between the video element and
                    the play disc. The video element above also has a
                    `poster` attr; this is the always-visible scrim. */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${poster})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <PlayDisc state={state} title={title} onActivate={attemptPlay} />
                {captionsDefault ? (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: 12,
                      padding: '4px 8px',
                      borderRadius: 9999,
                      background: 'rgba(0, 0, 0, 0.4)',
                      color: '#FFFFFF',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                    }}
                  >
                    CC
                  </span>
                ) : null}
                {state === 'errored' ? (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '6px 12px',
                      borderRadius: 9999,
                      background: 'rgba(0, 0, 0, 0.65)',
                      color: 'var(--color-text-on-inverse)',
                      fontSize: 13,
                    }}
                  >
                    Tap to play
                  </span>
                ) : null}
              </>
            ) : null}
          </div>
        )}

        <figcaption id={descId} className="sr-only">
          {description}
        </figcaption>

        {/* Component-scoped styles. Pulse is gated on
            prefers-reduced-motion: no-preference per accessibility §5. */}
        <style>{`
          .hv-root .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
          .hv-play-disc:focus-visible {
            outline: 3px solid var(--color-iris-accent-hover);
            outline-offset: 2px;
          }
          @media (prefers-reduced-motion: no-preference) {
            .hv-play-disc--loading {
              animation: hv-pulse 1s ease-in-out infinite;
            }
            @keyframes hv-pulse {
              0%   { opacity: 0.6; }
              50%  { opacity: 1; }
              100% { opacity: 0.6; }
            }
          }
          /* In-video VTT captions size for dark-scrim legibility — 16px
             on mobile, 14px on desktop. Distinct from the 2×2 fallback
             grid (14px desktop / inherits at mobile). Documented in
             spec §8 Q3. */
          .hv-root ::cue {
            background: rgba(0, 0, 0, 0.65);
            color: var(--color-text-on-inverse, #FFFFFF);
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            padding: 4px 10px;
          }
          .hv-root ::cue(.eyebrow) {
            color: var(--color-iris-accent-subtle, #CCFBF1);
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
            font-size: 11px;
            letter-spacing: 0.08em;
          }
          @media (max-width: 640px) {
            .hv-root ::cue {
              font-size: 16px;
            }
          }
        `}</style>
      </figure>
    </>
  )
}

export type {
  HeroVideoBeat,
  HeroVideoSource,
  HeroVideoState,
  HeroVideoProps,
} from './types'
