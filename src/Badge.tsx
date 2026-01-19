import { BadgeProps } from './types'

const variantStyles = {
  default: 'bg-indigo-600 text-white',
  highlight: 'bg-indigo-100 text-indigo-600',
  subtle: 'bg-gray-100 text-gray-600',
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

// Convenience exports for common badges
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
