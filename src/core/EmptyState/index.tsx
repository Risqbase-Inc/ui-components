import type { EmptyStateProps } from './types'

// Eight variants, all share the same layout. Variant is currently a
// hint for the consumer (and a telemetry tag once instrumentation lands)
// — the visual treatment is identical so designers can pick the
// semantically-correct variant without painting themselves into a
// corner. v4.3 §5.1, closes RALIA F-020 / F-055.
export function EmptyState({
  variant: _variant = 'default',
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      data-empty-variant={_variant}
      className={`flex flex-col items-center justify-center text-center px-6 py-12 ${className}`}
    >
      {icon && (
        <div className="mb-4 text-[var(--color-text-subtle)] [&_svg]:w-12 [&_svg]:h-12" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--color-text-default)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-text-subtle)] max-w-md mb-6">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap gap-3 justify-center">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}

export type { EmptyStateProps, EmptyStateVariant } from './types'
