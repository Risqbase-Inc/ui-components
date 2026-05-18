import { TelemetryBeacon } from '../TelemetryBeacon'
import type { SectionEyebrowProps } from './types'

// Role token (spec §15.2). Resolves identically to v1.x `text-indigo-600`
// in light mode; theme overrides will swap the variable in dark/HC.
export function SectionEyebrow({
  children,
  className = '',
}: SectionEyebrowProps) {
  const baseStyles = 'text-sm font-semibold tracking-wider text-[var(--color-section-eyebrow-foreground)] uppercase mb-4'
  const combinedStyles = `${baseStyles} ${className}`

  return (
    <>
      <TelemetryBeacon component="SectionEyebrow" />
      <p className={combinedStyles}>{children}</p>
    </>
  )
}

export type { SectionEyebrowProps } from './types'
