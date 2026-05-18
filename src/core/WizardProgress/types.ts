import type { ReactNode } from 'react'

export type WizardProgressStyle = 'dots' | 'numbered' | 'vertical' | 'percentage'

export interface WizardStep {
  id: string
  label: ReactNode
  description?: ReactNode
}

export interface WizardProgressProps {
  steps: WizardStep[]
  /** 0-indexed current step. */
  current: number
  /** Force a style — otherwise auto-selected by step count (§5.1). */
  style?: WizardProgressStyle
  /** For `percentage` style only. */
  percent?: number
  className?: string
}
