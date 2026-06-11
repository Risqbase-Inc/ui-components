import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type { GaugeProps, GaugeSize, GaugePalette } from './types'

// Generic stroked-arc primitive — the *configuration* that makes a
// RiskGauge (dual ring · teal · band-derived chip · delta pill) is
// RALIA-private (Layer 3). v4.3 §5.3, closes v4.2 audit U2.1.

const diameterByCss: Record<GaugeSize, string> = {
  inline:    'var(--dimension-gauge-diameter-inline)',
  accessory: 'var(--dimension-gauge-diameter-accessory)',
  summary:   'var(--dimension-gauge-diameter-summary)',
  headline:  'var(--dimension-gauge-diameter-headline)',
}

const diameterFallback: Record<GaugeSize, number> = {
  inline: 48,
  accessory: 80,
  summary: 120,
  headline: 160,
}

const paletteToVar: Record<GaugePalette, string> = {
  teal:   'var(--color-gauge-component-arc-teal)',
  indigo: 'var(--color-gauge-component-arc-indigo)',
  stone:  'var(--color-gauge-component-arc-stone)',
}

function clamp(v: number) {
  return Math.max(0, Math.min(100, v))
}

export function Gauge({
  value,
  variant = 'single',
  innerValue,
  size = 'summary',
  palette = 'teal',
  'aria-label': ariaLabel,
  label,
  caption,
  className = '',
}: GaugeProps) {
  // SVG works in a fixed 100-unit space; the wrapping span scales it via
  // width: cssDiameter. This keeps the math simple while honouring the
  // primitive token chain.
  const cssDiameter = diameterByCss[size]
  const px = diameterFallback[size]
  const stroke = size === 'inline' ? 4 : 6
  const r = 50 - stroke / 2
  const c = 2 * Math.PI * r

  const outerOffset = c * (1 - clamp(value) / 100)
  const innerR = r - stroke - 2
  const innerC = 2 * Math.PI * innerR
  const innerOffset = innerC * (1 - clamp(innerValue ?? 0) / 100)

  return (
    <>
    <TelemetryBeacon component="Gauge" variant={variant} meta={{ size, palette }} />
    <span
      role="img"
      aria-label={ariaLabel}
      className={`inline-block relative ${className}`}
      style={{ width: cssDiameter, height: cssDiameter, ['--gauge-fallback-px' as string]: `${px}px` }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
        {/* data-fc: forced-colors roles — see tools/tokens-build/static.css §3
            (v4.4 B3: track→GrayText, value arc→Highlight so the reading
            survives Windows High Contrast). */}
        <circle
          cx={50}
          cy={50}
          r={r}
          fill="none"
          stroke="var(--color-gauge-component-track)"
          strokeWidth={stroke}
          data-fc="track"
        />
        <circle
          cx={50}
          cy={50}
          r={r}
          fill="none"
          stroke={paletteToVar[palette]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={outerOffset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          data-fc="arc"
        />
        {variant === 'dual' && typeof innerValue === 'number' && (
          <>
            <circle
              cx={50}
              cy={50}
              r={innerR}
              fill="none"
              stroke="var(--color-gauge-component-track)"
              strokeWidth={stroke}
              data-fc="track"
            />
            <circle
              cx={50}
              cy={50}
              r={innerR}
              fill="none"
              stroke="var(--color-gauge-component-arc-stone)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={innerC}
              strokeDashoffset={innerOffset}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 300ms cubic-bezier(0.4, 0, 0.2, 1)' }}
              data-fc="arc-secondary"
            />
          </>
        )}
      </svg>
      {(label !== undefined || caption) && (
        <span className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {label !== undefined && (
            <span className="text-[var(--color-gauge-component-label)] font-semibold tabular-nums" style={{ fontSize: `${Math.round(px / 5)}px` }}>
              {label}
            </span>
          )}
          {caption && (
            <span className="text-[var(--color-gauge-component-caption)] text-xs">{caption}</span>
          )}
        </span>
      )}
    </span>
    </>
  )
}

export type { GaugeProps, GaugeVariant, GaugeSize, GaugePalette } from './types'
