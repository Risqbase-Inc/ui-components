import type { WizardProgressProps, WizardProgressStyle } from './types'

// Auto-selects style by step count, per v4.3 §5.1:
//   dots       (≤ 4)   — quick visual
//   numbered   (5–8)   — explicit step number
//   vertical   (> 8)   — long flows; horizontal bar would crush labels
//   percentage         — opt-in for conversational / unknown total
// Closes RALIA F-010.
function pickStyle(stepCount: number): WizardProgressStyle {
  if (stepCount <= 4) return 'dots'
  if (stepCount <= 8) return 'numbered'
  return 'vertical'
}

export function WizardProgress({
  steps,
  current,
  style,
  percent,
  className = '',
}: WizardProgressProps) {
  const resolved = style ?? pickStyle(steps.length)
  const ariaLabel = `Step ${current + 1} of ${steps.length}: ${labelText(steps[current]?.label)}`

  if (resolved === 'percentage') {
    const p = typeof percent === 'number' ? Math.max(0, Math.min(100, percent)) : ((current + 1) / steps.length) * 100
    return (
      <div className={className} role="progressbar" aria-valuenow={Math.round(p)} aria-valuemin={0} aria-valuemax={100} aria-label={ariaLabel}>
        <div className="w-full h-2 bg-[var(--color-surface-muted)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--color-action-primary)] transition-[width] duration-300" style={{ width: `${p}%` }} />
        </div>
      </div>
    )
  }

  if (resolved === 'vertical') {
    return (
      <ol className={`flex flex-col gap-3 ${className}`} aria-label={ariaLabel}>
        {steps.map((s, i) => (
          <li key={s.id} className="flex items-start gap-3" aria-current={i === current ? 'step' : undefined}>
            <span className={dotClasses(i, current)} aria-hidden="true">{i < current ? '✓' : i + 1}</span>
            <span className={i === current ? 'font-semibold text-[var(--color-text-default)]' : 'text-[var(--color-text-subtle)]'}>
              {s.label}
            </span>
          </li>
        ))}
      </ol>
    )
  }

  // dots + numbered share the horizontal row
  return (
    <ol className={`flex items-center gap-2 ${className}`} aria-label={ariaLabel}>
      {steps.map((s, i) => (
        <li key={s.id} className="flex items-center gap-2" aria-current={i === current ? 'step' : undefined}>
          <span className={dotClasses(i, current)} aria-hidden="true">
            {resolved === 'numbered' ? (i < current ? '✓' : i + 1) : ''}
          </span>
          {i < steps.length - 1 && <span className="w-6 h-px bg-[var(--color-border-default)]" />}
        </li>
      ))}
    </ol>
  )
}

function dotClasses(index: number, current: number) {
  const base = 'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold transition-colors'
  if (index < current) {
    return `${base} bg-[var(--color-action-primary)] text-[var(--color-text-on-action)]`
  }
  if (index === current) {
    return `${base} bg-[var(--color-action-primary)] text-[var(--color-text-on-action)] ring-2 ring-[var(--color-iris-accent-subtle)]`
  }
  return `${base} bg-[var(--color-surface-muted)] text-[var(--color-text-subtle)]`
}

function labelText(label: WizardProgressProps['steps'][number]['label']): string {
  return typeof label === 'string' ? label : ''
}

export type { WizardProgressProps, WizardProgressStyle, WizardStep } from './types'
