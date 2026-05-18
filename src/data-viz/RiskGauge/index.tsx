import { Gauge } from '../Gauge'
import { BandBadge } from '../../core/Badge'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type { RiskGaugeProps, RiskGaugeRole } from './types'
import type { BadgeBand } from '../../core/Badge/types'

// RiskGauge composes the generic `Gauge` primitive with compliance
// semantics: dual-ring (inherent → residual), band derivation from
// residual, delta pill, locked teal palette to preserve the Iris
// signature. v4.3 §5.3 — RiskGauge component is Layer-2 generic; the
// RiskGauge *configuration* (this composition) is Layer-3 RALIA-private.
// We ship it from the package as a convenience but it is documented as
// product-private in the showcase. Closes v4.2 audit U2.2.

const roleSize: Record<RiskGaugeRole, 'inline' | 'accessory' | 'summary' | 'headline'> = {
  headline: 'headline',
  detail:   'summary',
  list:     'accessory',
}

export function deriveBand(residual: number): BadgeBand {
  if (residual <= 20) return 'very-low'
  if (residual <= 40) return 'low'
  if (residual <= 60) return 'medium'
  if (residual <= 80) return 'high'
  return 'very-high'
}

export function RiskGauge({
  inherent,
  residual,
  role,
  label,
  bandOverride,
  className = '',
}: RiskGaugeProps) {
  const band = bandOverride ?? deriveBand(residual)
  const delta = inherent - residual
  const deltaLabel = delta === 0 ? 'No change' : delta > 0 ? `−${delta}` : `+${Math.abs(delta)}`

  return (
    <>
    <TelemetryBeacon component="RiskGauge" variant={role} meta={{ band, delta }} />
    <div className={`inline-flex flex-col items-center gap-2 ${className}`}>
      <Gauge
        value={residual}
        innerValue={inherent}
        variant="dual"
        size={roleSize[role]}
        palette="teal"
        aria-label={`${label}. Residual ${residual} of 100, inherent ${inherent} of 100.`}
        label={residual}
        caption={role === 'headline' ? 'residual' : undefined}
      />
      {role !== 'list' && (
        <div className="flex items-center gap-2">
          <BandBadge band={band}>{band.replace('-', ' ')}</BandBadge>
          <span
            className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-[var(--dimension-radius-sm)] bg-[var(--color-surface-muted)] text-[var(--color-text-default)] tabular-nums"
            aria-label={`Delta: ${deltaLabel}`}
          >
            {deltaLabel}
          </span>
        </div>
      )}
    </div>
    </>
  )
}

export type { RiskGaugeProps, RiskGaugeRole } from './types'
