import type { HTMLAttributes, ReactNode } from 'react'

export type CardVariant = 'default' | 'subtle' | 'inverse'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
  children: ReactNode
}
