import type { HTMLAttributes } from 'react'

export type SkeletonVariant = 'row' | 'card' | 'chart' | 'text' | 'circle'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  /** Number of repeating skeleton blocks; defaults to 1. */
  count?: number
  /** Override width (e.g. `60%`). Ignored for `circle` / `card`. */
  width?: string
  /** Override height. Ignored for `circle`. */
  height?: string
}
