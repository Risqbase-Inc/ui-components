import type { BadgeBand } from '../../core/Badge/types'

export type RiskGaugeRole = 'headline' | 'detail' | 'list'

export interface RiskGaugeProps {
  inherent: number
  residual: number
  role: RiskGaugeRole
  /** Accessible label, e.g. "GDPR Art. 32 — residual 42 of 100". */
  label: string
  /** Override the auto-derived band if you need custom thresholds. */
  bandOverride?: BadgeBand
  className?: string
}
