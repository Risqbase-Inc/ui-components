import type { CalloutProps, CalloutIntent } from './types'

// Replaces the AI-slop left-border-accent pattern. v4.3 §5.1, closes
// RALIA F-002 + marketing C-05. Each intent gets a 1px border, a faint
// tinted surface (5% alpha over white via custom property + opacity),
// and an icon glyph drawn from the matching role.
const intentStyles: Record<CalloutIntent, { border: string; bg: string; icon: string }> = {
  info: {
    border: 'border-[var(--color-callout-info-border)]',
    bg: 'bg-[var(--color-callout-info-background)]/10',
    icon: 'text-[var(--color-callout-info-icon)]',
  },
  warning: {
    border: 'border-[var(--color-callout-warning-border)]',
    bg: 'bg-[var(--color-callout-warning-background)]/10',
    icon: 'text-[var(--color-callout-warning-icon)]',
  },
  danger: {
    border: 'border-[var(--color-callout-danger-border)]',
    bg: 'bg-[var(--color-callout-danger-background)]/10',
    icon: 'text-[var(--color-callout-danger-icon)]',
  },
  success: {
    border: 'border-[var(--color-callout-success-border)]',
    bg: 'bg-[var(--color-callout-success-background)]/10',
    icon: 'text-[var(--color-callout-success-icon)]',
  },
  tip: {
    border: 'border-[var(--color-callout-tip-border)]',
    bg: 'bg-[var(--color-callout-tip-background)]/10',
    icon: 'text-[var(--color-callout-tip-icon)]',
  },
}

const defaultIcons: Record<CalloutIntent, JSX.Element> = {
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  tip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.1V18h6v-1.2c0-.8.3-1.6 1-2.1A7 7 0 0 0 12 2z" />
    </svg>
  ),
}

const intentRoles: Record<CalloutIntent, 'status' | 'alert' | 'note'> = {
  info: 'status',
  warning: 'alert',
  danger: 'alert',
  success: 'status',
  tip: 'note',
}

export function Callout({
  intent = 'info',
  title,
  icon,
  children,
  className = '',
}: CalloutProps) {
  const style = intentStyles[intent]
  const ariaRole = intentRoles[intent]
  const renderedIcon = icon === undefined ? defaultIcons[intent] : icon
  return (
    <div
      role={ariaRole === 'note' ? undefined : ariaRole}
      className={`flex gap-3 rounded-[var(--dimension-radius-md)] border ${style.border} ${style.bg} p-4 text-[var(--color-text-default)] ${className}`}
    >
      {renderedIcon !== null && (
        <span className={`flex-shrink-0 w-5 h-5 mt-0.5 ${style.icon} [&_svg]:w-full [&_svg]:h-full`} aria-hidden="true">
          {renderedIcon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}

export type { CalloutProps, CalloutIntent } from './types'
