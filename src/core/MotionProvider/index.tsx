'use client'

/**
 * Motion preference — `data-motion` attribute + `useReducedMotion()`
 * swap the active motion language (DS v4.4 workstream E, decision D-110).
 *
 * Resolution order, highest priority first:
 *   1. Explicit user choice persisted at `MOTION_STORAGE_KEY`
 *      (`'full' | 'reduced'`) — a user may *opt into* full motion even
 *      when the OS asks for reduced, or reduce motion on an OS that has
 *      no signal.
 *   2. The `prefers-reduced-motion: reduce` media query (OS / browser).
 *   3. Full motion.
 *
 * Consumers do two things:
 *   1. Wrap the app (or any subtree) in `<MotionProvider>`. It renders a
 *      `display: contents` wrapper carrying `data-motion="full" |
 *      "reduced"` for CSS targeting and feeds the resolved value to
 *      `useReducedMotion()` in every DS primitive below it.
 *   2. Call `setMotionPreference(pref)` from a settings UI
 *      (`null` clears the override back to the OS default). See
 *      `docs/recipes/motion-preference.md` for the documented toggle
 *      pattern.
 *
 * Without a provider, `useReducedMotion()` falls back to a live
 * `prefers-reduced-motion` subscription, and the `motion-reduce:`
 * Tailwind variants on each primitive keep the no-JS CSS path intact.
 */

import { createContext, useContext, useSyncExternalStore } from 'react'
import { TelemetryBeacon } from '../TelemetryBeacon'
import type { MotionPreference, MotionProviderProps } from './types'

export const MOTION_STORAGE_KEY = 'risqbase:motion'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

// `storage` events only fire in *other* tabs, so `setMotionPreference`
// dispatches this on the current window after every write.
const MOTION_CHANGE_EVENT = 'risqbase:motion-change'

const MotionContext = createContext<MotionPreference | null>(null)

function noopUnsubscribe(): void {
  // SSR — nothing was subscribed.
}

/**
 * Read the currently resolved motion preference (user override →
 * media query → `'full'`). Returns `'full'` during SSR.
 */
export function getMotionPreference(): MotionPreference {
  if (typeof window === 'undefined') return 'full'
  try {
    const stored = window.localStorage.getItem(MOTION_STORAGE_KEY)
    if (stored === 'full' || stored === 'reduced') return stored
  } catch {
    // Private mode / blocked storage — fall through to the OS signal.
  }
  return typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches
    ? 'reduced'
    : 'full'
}

/**
 * Persist an explicit motion preference, or clear it with `null` so the
 * resolution falls back to the OS `prefers-reduced-motion` signal.
 * Mounted `<MotionProvider>`s (and bare `useReducedMotion()` consumers
 * in other tabs) re-resolve immediately.
 *
 * Safe to call during SSR (no-op when `window` is undefined).
 */
export function setMotionPreference(pref: MotionPreference | null): void {
  if (typeof window === 'undefined') return
  try {
    if (pref === null) {
      window.localStorage.removeItem(MOTION_STORAGE_KEY)
    } else {
      window.localStorage.setItem(MOTION_STORAGE_KEY, pref)
    }
  } catch {
    // Private mode / quota exceeded — the OS media query keeps working;
    // the explicit override just can't persist.
  }
  window.dispatchEvent(new Event(MOTION_CHANGE_EVENT))
}

// --- live stores (useSyncExternalStore) -----------------------------

// Full resolution (storage override + media query). Used by the provider.
function subscribeToPreference(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return noopUnsubscribe
  }
  const mql = window.matchMedia(REDUCED_MOTION_QUERY)
  mql.addEventListener('change', onChange)
  window.addEventListener('storage', onChange)
  window.addEventListener(MOTION_CHANGE_EVENT, onChange)
  return () => {
    mql.removeEventListener('change', onChange)
    window.removeEventListener('storage', onChange)
    window.removeEventListener(MOTION_CHANGE_EVENT, onChange)
  }
}

function getServerPreference(): MotionPreference {
  return 'full'
}

// Media-query-only fallback. Used by `useReducedMotion()` when no
// provider is mounted (DS v4.4 E.2: the media-query fallback stays
// intact without a provider).
function subscribeToMediaQuery(onChange: () => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return noopUnsubscribe
  }
  const mql = window.matchMedia(REDUCED_MOTION_QUERY)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function getMediaSnapshot(): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getServerMediaSnapshot(): boolean {
  return false
}

/**
 * Resolved motion preference as a boolean — `true` means render the
 * reduced-motion variant. Inside a `<MotionProvider>` this is the
 * provider's resolved value (user override → media query → full).
 * Without a provider it falls back to a live `prefers-reduced-motion`
 * subscription. Returns `false` during SSR.
 */
export function useReducedMotion(): boolean {
  const fromProvider = useContext(MotionContext)
  const mediaReduced = useSyncExternalStore(
    subscribeToMediaQuery,
    getMediaSnapshot,
    getServerMediaSnapshot
  )
  return fromProvider !== null ? fromProvider === 'reduced' : mediaReduced
}

/**
 * Context provider for the resolved motion preference. Renders its
 * children inside a `display: contents` wrapper carrying
 * `data-motion="full" | "reduced"`, so CSS can gate animation
 * (`[data-motion='reduced'] …`) alongside the `useReducedMotion()` hook.
 * The value stays live: `storage` events (other tabs), the
 * `prefers-reduced-motion` change listener, and `setMotionPreference`
 * calls in this tab all re-resolve immediately.
 *
 * @remarks promotion: beta
 */
export function MotionProvider({ children, forcedPreference }: MotionProviderProps) {
  const resolved = useSyncExternalStore(
    subscribeToPreference,
    getMotionPreference,
    getServerPreference
  )
  const preference = forcedPreference ?? resolved
  return (
    <MotionContext.Provider value={preference}>
      <TelemetryBeacon
        component="MotionProvider"
        variant={preference}
        meta={{ forced: forcedPreference !== undefined }}
      />
      <div style={{ display: 'contents' }} data-motion={preference}>
        {children}
      </div>
    </MotionContext.Provider>
  )
}

export type { MotionPreference, MotionProviderProps } from './types'
