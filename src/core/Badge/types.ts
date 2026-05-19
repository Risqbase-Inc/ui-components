import type { ReactNode } from 'react'

export type BadgeBand = 'very-low' | 'low' | 'medium' | 'high' | 'very-high'

export type BadgeVariant =
  | 'default'
  | 'highlight'
  | 'subtle'
  | 'band-very-low'
  | 'band-low'
  | 'band-medium'
  | 'band-high'
  | 'band-very-high'

export interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

export interface BandBadgeProps {
  band: BadgeBand
  children: ReactNode
  className?: string
}
