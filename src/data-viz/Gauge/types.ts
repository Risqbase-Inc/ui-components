export type GaugeVariant = 'single' | 'dual'
export type GaugeSize = 'inline' | 'accessory' | 'summary' | 'headline'
export type GaugePalette = 'teal' | 'indigo' | 'stone'

export interface GaugeProps {
  /** Outer-ring value, 0–100. */
  value: number
  variant?: GaugeVariant
  /** Inner-ring value when `variant === 'dual'`. */
  innerValue?: number
  size?: GaugeSize
  /** Outer-ring colour palette. Inner ring uses stone by convention. */
  palette?: GaugePalette
  /** Accessible name — required. */
  'aria-label': string
  /** Optional centre label (number or short text). */
  label?: string | number
  /** Optional caption beneath label. */
  caption?: string
  className?: string
}
