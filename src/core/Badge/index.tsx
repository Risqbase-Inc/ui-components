import { TelemetryBeacon } from '../TelemetryBeacon'
import type { BadgeProps, BandBadgeProps } from './types'

// Role tokens (spec §15.2; resolved values in dist/tokens.css). The five
// `band-*` variants land in v4.3 (§5.1, closes RALIA F-018) and resolve
// through the canonical five-band semantic scale (`color.band.*`).
// `BandBadge` is the canonical risk-band chip: a status chip mapping a
// risk band (very-low … very-high) to its band-coloured pill — use it
// instead of composing a custom band/risk chip.
const variantStyles = {
  default:
    'bg-[var(--color-badge-default-background)] text-[var(--color-badge-default-foreground)]',
  highlight:
    'bg-[var(--color-badge-highlight-background)] text-[var(--color-badge-highlight-foreground)]',
  subtle:
    'bg-[var(--color-badge-subtle-background)] text-[var(--color-badge-subtle-foreground)]',
  'band-very-low':
    'bg-[var(--color-badge-band-very-low-background)] text-[var(--color-badge-band-very-low-foreground)] border border-[var(--color-badge-band-very-low-border)]',
  'band-low':
    'bg-[var(--color-badge-band-low-background)] text-[var(--color-badge-band-low-foreground)] border border-[var(--color-badge-band-low-border)]',
  'band-medium':
    'bg-[var(--color-badge-band-medium-background)] text-[var(--color-badge-band-medium-foreground)] border border-[var(--color-badge-band-medium-border)]',
  'band-high':
    'bg-[var(--color-badge-band-high-background)] text-[var(--color-badge-band-high-foreground)] border border-[var(--color-badge-band-high-border)]',
  'band-very-high':
    'bg-[var(--color-badge-band-very-high-background)] text-[var(--color-badge-band-very-high-foreground)] border border-[var(--color-badge-band-very-high-border)]',
}

export function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full'
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`

  return (
    <>
      <TelemetryBeacon component="Badge" variant={variant} />
      <span className={combinedStyles}>{children}</span>
    </>
  )
}

export function MostPopularBadge() {
  return (
    <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2">
      Most Popular
    </Badge>
  )
}

export function StandaloneProductBadge() {
  return (
    <Badge variant="highlight" className="gap-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      Standalone Product
    </Badge>
  )
}

export function NewBadge() {
  return <Badge variant="default">New</Badge>
}

export function ComingSoonBadge() {
  return <Badge variant="subtle">Coming Soon</Badge>
}

// v4.3 — convenience wrapper that maps a `band` prop to the matching
// `band-*` variant. Useful in charts/gauges/tables where the band is the
// data and the visual is incidental.
export function BandBadge({ band, children, className }: BandBadgeProps) {
  return (
    <Badge variant={`band-${band}` as BadgeProps['variant']} className={className}>
      {children}
    </Badge>
  )
}

export type { BadgeProps, BadgeVariant, BadgeBand, BandBadgeProps } from './types'
