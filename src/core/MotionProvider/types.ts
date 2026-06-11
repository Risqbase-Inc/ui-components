import type { ReactNode } from 'react'

/**
 * Resolved motion preference. `'reduced'` collapses every DS animation
 * to its static / opacity-only equivalent; `'full'` is the default
 * motion language.
 */
export type MotionPreference = 'full' | 'reduced'

export interface MotionProviderProps {
  children: ReactNode
  /**
   * Pin the resolved preference, bypassing localStorage and the
   * `prefers-reduced-motion` media query entirely. Stories and tests
   * only — product code must let the documented resolution order
   * (user choice → OS signal → full motion) decide.
   *
   * @internal
   */
  forcedPreference?: MotionPreference
}
