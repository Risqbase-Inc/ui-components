import type { ReactNode } from 'react'

export type EmptyStateVariant =
  | 'default'
  | 'filtered'
  | 'error'
  | 'no-data'
  | 'no-results'
  | 'no-permission'
  | 'first-run'
  | 'client-feature-disabled'

export interface EmptyStateProps {
  variant?: EmptyStateVariant
  /** Decorative illustration / icon node. */
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** Optional CTA (typically a `<Button>` from `core`). */
  action?: ReactNode
  /** Secondary link / ghost action. */
  secondaryAction?: ReactNode
  className?: string
}
