import type { ReactNode } from 'react'

export type CalloutIntent = 'info' | 'warning' | 'danger' | 'success' | 'tip'

export interface CalloutProps {
  intent?: CalloutIntent
  title?: ReactNode
  /** Override the default per-intent icon. Pass `null` to omit. */
  icon?: ReactNode | null
  children: ReactNode
  className?: string
}
