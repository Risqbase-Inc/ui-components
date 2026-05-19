import { TelemetryBeacon } from '../TelemetryBeacon'
import type { SkipLinkProps } from './types'

// Visually hidden until focused. First focusable element in the App
// shell — keyboard / screen-reader users tab once to reveal it, then
// Enter to jump past navigation to the main landmark. v4.3 §5.1,
// closes RALIA F-053 + WCAG 2.4.1 Bypass Blocks.
export function SkipLink({
  target,
  children = 'Skip to main content',
  className = '',
}: SkipLinkProps) {
  return (
    <>
      <TelemetryBeacon component="SkipLink" />
      <a
        href={target}
        className={`sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:rounded-[var(--dimension-radius-md)] focus:bg-[var(--color-action-primary)] focus:text-[var(--color-text-on-action)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2 ${className}`}
      >
        {children}
      </a>
    </>
  )
}

export type { SkipLinkProps } from './types'
