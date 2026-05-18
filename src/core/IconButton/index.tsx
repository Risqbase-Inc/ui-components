import type { IconButtonProps } from './types'

// Hit target is always ≥ 24×24 regardless of the visual icon size — the
// `sm` variant pads a 16px glyph out to a 24×24 button, satisfying WCAG
// 2.5.8 by construction. v4.3 §5.1, closes RALIA F-015 / F-028 / F-037 /
// F-050.
const variantStyles = {
  ghost:
    'bg-transparent text-[var(--color-text-default)] hover:bg-[var(--color-surface-muted)] focus:ring-[var(--color-border-focus)]',
  primary:
    'bg-[var(--color-button-primary-background-default)] text-[var(--color-button-primary-foreground-default)] hover:bg-[var(--color-button-primary-background-hover)] focus:ring-[var(--color-button-focus-ring)]',
  secondary:
    'bg-[var(--color-button-secondary-background-default)] text-[var(--color-button-secondary-foreground-default)] border border-[var(--color-button-secondary-border-default)] hover:bg-[var(--color-button-secondary-background-hover)] focus:ring-[var(--color-button-focus-ring)]',
}

const sizeStyles = {
  sm: 'w-6 h-6 [&_svg]:w-4 [&_svg]:h-4',
  md: 'w-8 h-8 [&_svg]:w-5 [&_svg]:h-5',
  lg: 'w-10 h-10 [&_svg]:w-6 [&_svg]:h-6',
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}: IconButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-[var(--dimension-radius-md)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  const combined = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`
  return (
    <button type="button" className={combined} {...props}>
      {icon}
    </button>
  )
}

export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './types'
