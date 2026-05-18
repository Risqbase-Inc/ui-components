import type { CardProps } from './types'

// Default radius is 16px (= `--dimension-radius-card-default`, =
// `dimension.radius.xl`), per v4.3 §4.4. Replaces ad-hoc
// `rounded-2xl border` patterns at consumer sites — scanner rule R7
// enforces component import. Closes RALIA F-060.
const variantStyles = {
  default:
    'bg-[var(--color-card-background-default)] border border-[var(--color-card-border-default)] text-[var(--color-text-default)]',
  subtle:
    'bg-[var(--color-card-background-subtle)] border border-[var(--color-card-border-default)] text-[var(--color-text-default)]',
  inverse:
    'bg-[var(--color-card-background-inverse)] border border-[var(--color-border-inverse)] text-[var(--color-text-on-inverse)]',
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  const base = 'rounded-[var(--dimension-radius-card-default)]'
  return (
    <div className={`${base} ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`} {...props}>
      {children}
    </div>
  )
}

export type { CardProps, CardVariant, CardPadding } from './types'
