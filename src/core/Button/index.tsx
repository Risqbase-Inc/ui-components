import Link from 'next/link'
import { TelemetryBeacon } from '../TelemetryBeacon'
import type { ButtonProps } from './types'

// Role tokens (spec §15.2; resolved values in dist/tokens.css). Each
// `bg-[var(...)]` resolves to the same hex the v1.x classes resolved to
// (no pixel change), but consumers / themes can swap the CSS variable
// without recompiling the component.
const variantStyles = {
  primary:
    'bg-[var(--color-button-primary-background-default)] text-[var(--color-button-primary-foreground-default)] hover:bg-[var(--color-button-primary-background-hover)] focus:ring-[var(--color-button-focus-ring)]',
  secondary:
    'bg-[var(--color-button-secondary-background-default)] text-[var(--color-button-secondary-foreground-default)] border border-[var(--color-button-secondary-border-default)] hover:bg-[var(--color-button-secondary-background-hover)] focus:ring-[var(--color-button-focus-ring)]',
  ghost:
    'bg-[var(--color-button-ghost-background-default)] text-[var(--color-button-ghost-foreground-default)] hover:bg-[var(--color-button-ghost-background-hover)] focus:ring-[var(--color-button-focus-ring)]',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  // Border-radius is read from the `dimension.radius.button.default` role
  // token (spec §15.4 + tokens/component/button.json) so future shape
  // changes happen in tokens, not component code. Resolves to 12px today
  // (= Tailwind `rounded-xl`, no pixel change for v1.x consumers). The
  // pill-vs-radius brand-baseline question is logged in
  // docs/design-system/v4.2/v4.2.1-backlog.md and
  // docs/design-system/v4.2/notes/button-radius-decision.md.
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-[var(--dimension-radius-button-default)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  const beacon = <TelemetryBeacon component="Button" variant={variant} meta={{ size, hasHref: Boolean(href) }} />

  if (href) {
    return (
      <>
        {beacon}
        <Link href={href} className={combinedStyles}>
          {children}
        </Link>
      </>
    )
  }

  return (
    <>
      {beacon}
      <button className={combinedStyles} {...props}>
        {children}
      </button>
    </>
  )
}

export function PrimaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="primary" {...props} />
}

export function SecondaryButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="secondary" {...props} />
}

export function GhostButton(props: Omit<ButtonProps, 'variant'>) {
  return <Button variant="ghost" {...props} />
}

export type { ButtonProps, ButtonVariant, ButtonSize } from './types'
