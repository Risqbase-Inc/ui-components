import type { ReactNode } from 'react'

export interface SkipLinkProps {
  /** Selector for the focus target (e.g. `#main-content`). */
  target: string
  /** Visible label — defaults to "Skip to main content". */
  children?: ReactNode
  className?: string
}
