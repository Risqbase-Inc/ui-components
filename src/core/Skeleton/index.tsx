import { TelemetryBeacon } from '../TelemetryBeacon'
import type { SkeletonProps } from './types'

// Shimmer at 1.4s linear infinite; respects `prefers-reduced-motion`.
// v4.3 §5.1, closes RALIA F-004. The shimmer is implemented as a CSS
// background-position animation against a 3-stop gradient — no JS, no
// layout thrash.
const variantDefaults: Record<
  NonNullable<SkeletonProps['variant']>,
  { className: string; defaultWidth: string; defaultHeight: string }
> = {
  row:    { className: 'rounded-[var(--dimension-radius-sm)]',  defaultWidth: '100%', defaultHeight: '16px' },
  card:   { className: 'rounded-[var(--dimension-radius-card-default)]', defaultWidth: '100%', defaultHeight: '160px' },
  chart:  { className: 'rounded-[var(--dimension-radius-md)]',  defaultWidth: '100%', defaultHeight: '240px' },
  text:   { className: 'rounded-[var(--dimension-radius-sm)]',  defaultWidth: '60%',  defaultHeight: '14px' },
  circle: { className: 'rounded-full',                          defaultWidth: '40px', defaultHeight: '40px' },
}

const baseClasses =
  'animate-skeleton-shimmer bg-[linear-gradient(90deg,var(--color-surface-muted)_0%,var(--color-surface-subtle)_50%,var(--color-surface-muted)_100%)] bg-[length:200%_100%] motion-reduce:animate-none motion-reduce:bg-[var(--color-surface-muted)]'

export function Skeleton({
  variant = 'row',
  count = 1,
  width,
  height,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const v = variantDefaults[variant]
  const w = width ?? v.defaultWidth
  const h = height ?? v.defaultHeight
  const inline = { width: w, height: h, ...style }
  const blocks = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      role="presentation"
      aria-hidden="true"
      className={`${baseClasses} ${v.className} ${className}`}
      style={inline}
      {...(i === 0 ? props : {})}
    />
  ))
  const beacon = <TelemetryBeacon component="Skeleton" variant={variant} meta={{ count }} />
  if (count === 1) return <>{beacon}{blocks[0]}</>
  return (
    <>
      {beacon}
      <div className="flex flex-col gap-2">{blocks}</div>
    </>
  )
}

export type { SkeletonProps, SkeletonVariant } from './types'
