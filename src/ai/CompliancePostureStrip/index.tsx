import { useId, useMemo } from 'react'
import { Gauge } from '../../data-viz/Gauge'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type {
  ClientPosture,
  CompliancePostureStripProps,
  PostureSort,
} from './types'

// CompliancePostureStrip — Practice Cockpit "12-clients-at-a-glance" strip.
// Spec: docs/specs/v2.1.0/03-CompliancePostureStrip.md (post-G4 corrections).
// Visual canon: Marketing Demo C §2 (.cs-posture, 12 mini-gauges).
//
// Layout (§3.1): grid with `auto-fit, minmax(72px, 1fr)` so the strip wraps
// gracefully beyond 12 entries while pinning to a single row at the cockpit
// canon width (~1232px ÷ 12 cells ≥ 72px each).
//
// A11y (§7): list of summary statistics, NOT a chart. Each cell is wrapped
// in a `role="img"` div carrying a single structured `aria-label`; when
// `onClick` is supplied, the cell is additionally wrapped in a `<button>`
// whose `aria-label` supersedes (the button is the SR entry point).
//
// Token chain (§4): every visual surface routes through `--color-*`
// custom properties; the loading skeleton uses the v4.4 derived
// `--color-skeleton-shimmer` (spec 00b-v4.4-token-extension §1.2).

const sortLabels: Record<PostureSort, string> = {
  risk: 'by risk',
  name: 'by name',
  alerts: 'by alerts',
}

const sortOptions: ReadonlyArray<PostureSort> = ['risk', 'name', 'alerts']

const bandFromResidual = (residual: number): string => {
  // Maps residual to the band-word used in the SR sentence. Mirrors
  // the existing RiskGauge band-derivation (residual ≥ 70 → very-high,
  // ≥ 40 → high, ≥ 20 → medium, ≥ 10 → low, else very-low). Kept inline
  // because the strip needs the *word*, not the band token.
  if (residual >= 70) return 'very-high'
  if (residual >= 40) return 'high'
  if (residual >= 20) return 'medium'
  if (residual >= 10) return 'low'
  return 'very-low'
}

const compareClients = (a: ClientPosture, b: ClientPosture, sort: PostureSort): number => {
  if (sort === 'risk') return b.residual - a.residual
  if (sort === 'alerts') return (b.alertCount ?? 0) - (a.alertCount ?? 0)
  return a.name.localeCompare(b.name)
}

interface CellProps {
  client: ClientPosture
  palette: 'teal' | 'indigo'
}

function PostureCell({ client, palette }: CellProps) {
  const band = bandFromResidual(client.residual)
  const alertSentence =
    client.alertCount && client.alertCount > 0 && client.alertSeverity
      ? `, ${client.alertCount} ${client.alertSeverity === 'high' ? 'high-severity' : 'medium-severity'} alert${client.alertCount === 1 ? '' : 's'}`
      : ''
  const baseLabel = `${client.name}: residual ${client.residual} out of 100, ${band} band${alertSentence}.`
  const interactiveLabel = client.onClick ? `${baseLabel} Activate to open.` : baseLabel

  // Content rendered inside the role="img" wrapper; everything below is
  // aria-hidden because the wrapper's aria-label carries the full sentence.
  const visual = (
    <>
      <span
        aria-hidden="true"
        className="block w-full text-center text-[9px] leading-[1.2] font-medium text-[var(--color-text-subtle)] overflow-hidden text-ellipsis whitespace-nowrap"
        title={client.name}
      >
        {client.name}
      </span>
      <span aria-hidden="true" className="block mt-1">
        <Gauge
          value={client.residual}
          variant="single"
          size="accessory"
          palette={palette}
          aria-label=""
        />
      </span>
      <span
        aria-hidden="true"
        className="block mt-1 font-mono text-[10px] font-medium tabular-nums text-[var(--color-text-default)]"
      >
        {client.residual}
      </span>
      {client.alertCount && client.alertCount > 0 && client.alertSeverity ? (
        <span aria-hidden="true" className="block mt-[2px]">
          <span
            className={
              client.alertSeverity === 'high'
                ? 'inline-block px-[5px] py-[1px] rounded-full font-mono text-[8px] font-bold tracking-[0.04em] uppercase bg-[var(--color-band-very-high-bg)] text-white'
                : 'inline-block px-[5px] py-[1px] rounded-full font-mono text-[8px] font-bold tracking-[0.04em] uppercase bg-[var(--color-band-medium-bg)] text-[var(--color-band-medium-text)]'
            }
          >
            {client.alertCount} {client.alertSeverity === 'high' ? 'high' : 'med'}
          </span>
        </span>
      ) : null}
    </>
  )

  const cellBase =
    'flex flex-col items-center px-1 py-2 bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] rounded-[var(--dimension-radius-md)]'

  // §7.1: when onClick is provided, wrap role="img" in a <button> whose
  // aria-label supersedes for AT. The inner role="img" remains for the
  // visual-DOM mapping but the button's accessible name wins in the SR
  // tree (browsers + JAWS/NVDA/VoiceOver all prefer the interactive
  // ancestor's label over a nested role="img" child).
  if (client.onClick) {
    return (
      <button
        type="button"
        onClick={client.onClick}
        aria-label={interactiveLabel}
        className={`${cellBase} text-left transition-colors duration-150 hover:bg-[var(--color-surface-default)] hover:ring-1 hover:ring-[var(--color-action-primary-subtle)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)] cursor-pointer`}
      >
        <span role="img" aria-label={baseLabel} className="contents">
          {visual}
        </span>
      </button>
    )
  }

  return (
    <div role="img" aria-label={baseLabel} className={cellBase}>
      {visual}
    </div>
  )
}

function SkeletonCell() {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="flex flex-col items-center px-1 py-2 rounded-[var(--dimension-radius-md)] bg-[var(--color-skeleton-shimmer)] animate-skeleton-shimmer motion-reduce:animate-none [background-size:200%_100%]"
      style={{ minHeight: 72 }}
    />
  )
}

export function CompliancePostureStrip({
  clients,
  sort,
  onSortChange,
  heading,
  bare = false,
  gaugePalette = 'teal',
  loading = false,
  skeletonCellCount = 12,
  className = '',
}: CompliancePostureStripProps) {
  const headingId = useId()

  const ordered = useMemo<ClientPosture[]>(() => {
    if (!sort) return clients
    // Copy before sort so we never mutate the caller's array — the
    // strip is presentational and must not poke at consumer state.
    return [...clients].sort((a, b) => compareClients(a, b, sort))
  }, [clients, sort])

  // §3.1 layout note: prefer `auto-fit` for graceful wrap above 12 entries;
  // documented fallback `repeat(min(N, 12), 1fr)` is the row-pin alternative
  // we'd switch to if Sophie's marketing-canon QA flags auto-fit drift.
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(72px, 1fr))',
    gap: 6,
  }

  const computedHeading = heading ?? `Posture across clients · ${clients.length} total`
  const sortable = Boolean(onSortChange)
  const isInteractive = clients.some((c) => Boolean(c.onClick))

  return (
    <>
      <TelemetryBeacon
        component="CompliancePostureStrip"
        variant={loading ? 'loading' : 'default'}
        meta={{ count: clients.length, sort: sort ?? 'none', interactive: isInteractive }}
      />
      <section aria-labelledby={bare ? undefined : headingId} className={className}>
        {!bare && (
          <header className="flex items-center justify-between mb-2">
            <h3
              id={headingId}
              className="text-sm font-medium text-[var(--color-text-default)] m-0"
            >
              {computedHeading}
            </h3>
            {sortable && sort ? (
              <label className="font-mono text-[10px] tracking-[0.04em] text-[var(--color-text-subtle)]">
                <span className="sr-only">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => onSortChange?.(e.target.value as PostureSort)}
                  // G4 FU-7 (CPS-1): `appearance-none` suppresses the UA
                  // dropdown chrome that, on Safari + some Chromium themes,
                  // overrides our `focus-visible:outline-*` declaration
                  // with the native focus ring. Padding-right reserves
                  // space where the native caret used to sit. The
                  // focus-visible chain below now lands consistently.
                  className="ml-1 bg-transparent border-0 font-mono text-[10px] tracking-[0.04em] text-[var(--color-text-subtle)] appearance-none pr-3 rounded-[var(--dimension-radius-sm)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)] cursor-pointer"
                  aria-label="Sort clients"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      Sort: {sortLabels[opt]}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </header>
        )}

        {loading ? (
          <div style={gridStyle} aria-hidden="true">
            {Array.from({ length: skeletonCellCount }, (_, i) => (
              <SkeletonCell key={i} />
            ))}
          </div>
        ) : clients.length === 0 ? (
          <p className="text-center text-xs text-[var(--color-text-subtle)] py-4 m-0">
            No clients in scope
          </p>
        ) : (
          <ul role="list" aria-label="Client posture summary" style={gridStyle} className="list-none p-0 m-0">
            {ordered.map((client) => (
              <li key={client.id}>
                <PostureCell client={client} palette={gaugePalette} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export type {
  ClientPosture,
  CompliancePostureStripProps,
  PostureSort,
} from './types'
