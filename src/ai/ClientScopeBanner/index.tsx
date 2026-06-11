import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type { ClientScopeBannerProps, ClientScopeState } from './types'

// Persistent below-header strip on every Practice route — surfaces the
// tenant-isolation artefact as a permanent UI element. v4.3 §5.2,
// closes RALIA F-043.

const stateCopy: Record<
  ClientScopeState,
  { tone: 'workspace' | 'client' | 'white-label' | 'switching'; label: string }
> = {
  workspace:     { tone: 'workspace',     label: 'Workspace view' },
  client:        { tone: 'client',        label: 'Client scope' },
  'white-label': { tone: 'white-label',   label: 'White-label scope' },
  switching:     { tone: 'switching',     label: 'Switching scope…' },
}

const toneStyles: Record<ClientScopeState, string> = {
  workspace:
    'bg-[var(--color-surface-subtle)] border-[var(--color-border-default)] text-[var(--color-text-default)]',
  client:
    'bg-[var(--color-iris-surface)] border-[var(--color-iris-accent)] text-[var(--color-text-default)]',
  'white-label':
    'bg-[var(--color-surface-subtle)] border-[var(--color-iris-accent)] text-[var(--color-text-default)]',
  switching:
    'bg-[var(--color-surface-muted)] border-[var(--color-border-default)] text-[var(--color-text-subtle-on-muted)]',
}

function formatVerified(iso: string | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
}

export function ClientScopeBanner({
  state,
  client,
  isolationVerifiedAt,
  onSwitch,
  onDetails,
  className = '',
}: ClientScopeBannerProps) {
  const copy = stateCopy[state]
  const verified = formatVerified(isolationVerifiedAt)

  return (
    <>
    <TelemetryBeacon component="ClientScopeBanner" variant={state} meta={{ hasClient: Boolean(client) }} />
    <div
      role="region"
      aria-label="Active scope"
      className={`flex items-center gap-3 px-6 py-2 text-sm border-b ${toneStyles[state]} ${className}`}
    >
      <span aria-hidden="true" className="flex-shrink-0 w-4 h-4 [&_svg]:w-full [&_svg]:h-full">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </span>
      <span className="font-semibold">{copy.label}</span>
      {state === 'client' && client && (
        <span className="font-medium" data-scope-client={client}>
          · {client}
        </span>
      )}
      {verified && (
        <span
          className={`text-xs ml-auto ${
            // D-125b: the switching variant rides surface.muted, where
            // text.subtle computes to 4.39:1 — use the on-muted tier there.
            state === 'switching'
              ? 'text-[var(--color-text-subtle-on-muted)]'
              : 'text-[var(--color-text-subtle)]'
          }`}
        >
          Tenant isolation verified {verified}
        </span>
      )}
      <div className="flex gap-2 ml-2">
        {onDetails && (
          <button
            type="button"
            onClick={onDetails}
            className="text-xs font-semibold text-[var(--color-action-link)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] rounded-[var(--dimension-radius-sm)]"
          >
            Details
          </button>
        )}
        {onSwitch && (
          <button
            type="button"
            onClick={onSwitch}
            className="text-xs font-semibold text-[var(--color-action-link)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] rounded-[var(--dimension-radius-sm)]"
          >
            Switch
          </button>
        )}
      </div>
    </div>
    </>
  )
}

export type { ClientScopeBannerProps, ClientScopeState } from './types'
