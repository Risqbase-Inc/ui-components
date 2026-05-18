import type { PromptChipProps } from './types'

// Empty-state Iris prompt suggestion — clickable to seed the input.
// Iris accent halo on hover via `iris.accent-subtle`. v4.3 §5.2.
export function PromptChip({ icon, children, className = '', ...props }: PromptChipProps) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-[var(--dimension-radius-full)] border border-[var(--color-border-default)] bg-[var(--color-surface-default)] text-[var(--color-text-default)] transition-colors hover:bg-[var(--color-iris-accent-subtle)] hover:border-[var(--color-iris-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-iris-accent-subtle)] focus:border-[var(--color-iris-accent)] ${className}`}
    >
      {icon && (
        <span className="flex-shrink-0 w-4 h-4 text-[var(--color-iris-accent)] [&_svg]:w-full [&_svg]:h-full" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  )
}

export type { PromptChipProps } from './types'
