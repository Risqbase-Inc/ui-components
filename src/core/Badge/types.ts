import type { ReactNode } from 'react'

export type BadgeVariant = 'default' | 'highlight' | 'subtle'

export interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}
