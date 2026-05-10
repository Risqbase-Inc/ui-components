import type { BadgeProps } from './types'

// Role tokens (spec §15.2; resolved values in dist/tokens.css). Default
// and highlight variants resolve identically to v1.x; the `subtle` variant
// shifts from Tailwind's `gray-100`/`gray-600` to `stone-100`/`stone-500`
// (canonical neutral palette — flagged for S5 visual-regression baseline).
const variantStyles = {
  default:
    'bg-[var(--color-badge-default-background)] text-[var(--color-badge-default-foreground)]',
  highlight:
    'bg-[var(--color-badge-highlight-background)] text-[var(--color-badge-highlight-foreground)]',
  subtle:
    'bg-[var(--color-badge-subtle-background)] text-[var(--color-badge-subtle-foreground)]',
}

export function Badge({
  variant = 'default',
  children,
  className = '',
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full'
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`

  return (
    <span className={combinedStyles}>
      {children}
    </span>
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

export type { BadgeProps, BadgeVariant } from './types'
