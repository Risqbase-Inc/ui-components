import { useId } from 'react'
import { Card } from '../../core/Card'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type {
  ClientCardData,
  ClientGridMode,
  ClientGridProps,
} from './types'

// ClientGrid — Practice Cockpit "Requires your attention · N clients"
// 3-up grid that sits below CompliancePostureStrip.
// Spec: docs/specs/v2.1.0/04-ClientGrid.md (post-G4 corrections).
// Visual canon: Marketing Demo C §2 (.cs-clients, 3-up grid).
//
// Composition: each card is a `core/Card variant="default" padding="none"`
// shell (we override padding because Demo C's 12px inner padding doesn't
// map onto the existing 'sm'/'md'/'lg' scale). The Card primitive still
// provides the radius + border + bg surface chain.
//
// Delta colour-inversion (§3.5 REFINE 4.1): positive weeklyDelta routes
// to `--color-band-very-high-bg` (worsening = alert); negative routes to
// `--color-band-very-low-bg` (improving = semantic emerald). NOT raw
// `--color-palette-emerald-500` — the band token IS the semantic emerald.

// Deterministic hash → palette mapping for clients that don't set an
// explicit avatarPalette. Simple sum-of-char-codes mod 6; collisions are
// fine — repeating a palette across 30 clients is cosmetic, not a bug.
const hashToPalette = (id: string): 1 | 2 | 3 | 4 | 5 | 6 => {
  let n = 0
  for (let i = 0; i < id.length; i++) n = (n + id.charCodeAt(i)) % 6
  return (n + 1) as 1 | 2 | 3 | 4 | 5 | 6
}

const avatarPaletteToken: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'var(--color-chart-cat-1)',
  2: 'var(--color-chart-cat-2)',
  3: 'var(--color-chart-cat-3)',
  4: 'var(--color-chart-cat-4)',
  5: 'var(--color-chart-cat-5)',
  6: 'var(--color-chart-cat-6)',
}

const headingForMode: Record<ClientGridMode, (n: number) => string> = {
  attention: (n) => `Requires your attention · ${n} client${n === 1 ? '' : 's'}`,
  all:       (n) => `Clients · ${n} total`,
}

interface ClientCardProps {
  client: ClientCardData
  cardOnClick?: (client: ClientCardData) => void
  pillOnClick?: (client: ClientCardData) => void
}

function deltaSentence(delta: number | undefined): string {
  if (delta === undefined) return ''
  if (delta === 0) return ', unchanged from last week'
  const abs = Math.abs(delta)
  return delta > 0
    ? `, up ${abs} from last week`
    : `, down ${abs} from last week`
}

function alertSentence(client: ClientCardData): string {
  if (!client.alertCount || !client.alertSeverity) return ''
  return ` ${client.alertCount} ${client.alertSeverity === 'high' ? 'high-severity' : 'medium-severity'} alert${client.alertCount === 1 ? '' : 's'}.`
}

function secondarySentence(stat: string | undefined): string {
  if (!stat) return ''
  return ` ${stat}.`
}

function ClientCardInner({ client, cardOnClick, pillOnClick }: ClientCardProps) {
  const nameId = useId()
  const metaId = useId()
  const palette = client.avatarPalette ?? hashToPalette(client.id)
  const glyph = client.avatarGlyph ?? client.name.slice(0, 1).toUpperCase()
  const hasAlert = client.alertCount !== undefined && client.alertCount > 0 && client.alertSeverity
  const interactive = Boolean(cardOnClick)

  const fullSentence =
    `${client.name}. ${client.subline}.` +
    ` Residual ${client.residual}${deltaSentence(client.weeklyDelta)}.` +
    secondarySentence(client.secondaryStat) +
    alertSentence(client)

  const ariaLabel = interactive ? `${fullSentence} Activate to open.` : undefined

  const delta = client.weeklyDelta
  const deltaBg = delta !== undefined && delta > 0
    ? 'var(--color-band-very-high-bg)'
    : delta !== undefined && delta < 0
      ? 'var(--color-band-very-low-bg)'  // §3.5 REFINE 4.1: semantic, not raw emerald
      : 'transparent'

  const inner = (
    <article
      aria-labelledby={interactive ? undefined : nameId}
      aria-describedby={interactive ? undefined : metaId}
      className="relative"
    >
      {hasAlert ? (
        pillOnClick ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              pillOnClick(client)
            }}
            aria-label={`${client.alertCount} ${client.alertSeverity === 'high' ? 'high-severity' : 'medium-severity'} alert${client.alertCount === 1 ? '' : 's'} for ${client.name}. Activate to filter.`}
            className={
              client.alertSeverity === 'high'
                ? 'absolute top-2 right-2 inline-block px-[5px] py-[1px] rounded-full font-mono text-[8px] font-bold tracking-[0.04em] uppercase bg-[var(--color-band-very-high-bg)] text-white focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)] cursor-pointer'
                : 'absolute top-2 right-2 inline-block px-[5px] py-[1px] rounded-full font-mono text-[8px] font-bold tracking-[0.04em] uppercase bg-[var(--color-band-medium-bg)] text-[var(--color-band-medium-text)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)] cursor-pointer'
            }
          >
            {client.alertCount} {client.alertSeverity === 'high' ? 'high' : 'med'}
          </button>
        ) : (
          <span
            aria-hidden="true"
            className={
              client.alertSeverity === 'high'
                ? 'absolute top-2 right-2 inline-block px-[5px] py-[1px] rounded-full font-mono text-[8px] font-bold tracking-[0.04em] uppercase bg-[var(--color-band-very-high-bg)] text-white'
                : 'absolute top-2 right-2 inline-block px-[5px] py-[1px] rounded-full font-mono text-[8px] font-bold tracking-[0.04em] uppercase bg-[var(--color-band-medium-bg)] text-[var(--color-band-medium-text)]'
            }
          >
            {client.alertCount} {client.alertSeverity === 'high' ? 'high' : 'med'}
          </span>
        )
      ) : null}

      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="grid place-items-center w-6 h-6 rounded-[var(--dimension-radius-sm)] text-white font-semibold text-[11px] flex-shrink-0"
          style={{ background: avatarPaletteToken[palette] }}
        >
          {glyph}
        </span>
        <div className="min-w-0 flex-1 pr-12">
          <p id={nameId} className="text-[12px] font-semibold text-[var(--color-text-default)] m-0 truncate">
            {client.name}
          </p>
          <p id={metaId} className="text-[10px] text-[var(--color-text-subtle)] m-0 truncate">
            {client.subline}
            {interactive ? null : (
              <span className="sr-only">{alertSentence(client)}</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-dotted border-[var(--color-border-subtle)] flex items-center gap-2 min-h-[20px]">
        <span
          aria-hidden="true"
          className="font-mono text-[12px] font-semibold tabular-nums text-[var(--color-text-default)]"
        >
          {client.residual}
        </span>
        {delta !== undefined && delta !== 0 ? (
          <span
            aria-hidden="true"
            className="font-mono text-[10px] font-semibold tabular-nums"
            style={{ color: deltaBg }}
          >
            {delta > 0 ? '↑' : '↓'}
            {Math.abs(delta)} wk
          </span>
        ) : null}
        {client.secondaryStat ? (
          <span
            aria-hidden="true"
            className="font-mono text-[10px] tabular-nums text-[var(--color-text-subtle)] ml-auto"
          >
            {client.secondaryStat}
          </span>
        ) : null}
      </div>
    </article>
  )

  const cardChrome = (
    <Card
      variant="default"
      padding="none"
      className={
        interactive
          ? 'p-3 min-h-[84px] transition-colors duration-150 hover:border-[var(--color-action-primary-subtle)] hover:shadow-[var(--shadow-raised)]'
          : 'p-3 min-h-[84px]'
      }
    >
      {inner}
    </Card>
  )

  if (interactive && cardOnClick) {
    return (
      <button
        type="button"
        onClick={() => cardOnClick(client)}
        aria-label={ariaLabel}
        className="block w-full text-left p-0 bg-transparent border-0 rounded-[var(--dimension-radius-card-default)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)] cursor-pointer"
      >
        {cardChrome}
      </button>
    )
  }

  return cardChrome
}

function SkeletonCard() {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className="rounded-[var(--dimension-radius-card-default)] bg-[var(--color-skeleton-shimmer)] animate-skeleton-shimmer motion-reduce:animate-none [background-size:200%_100%]"
      style={{ minHeight: 84 }}
    />
  )
}

export function ClientGrid({
  clients,
  mode = 'all',
  onClientClick,
  onAlertClick,
  heading,
  headingAction,
  desktopColumns = 3,
  bare = false,
  loading = false,
  skeletonCardCount = 3,
  className = '',
}: ClientGridProps) {
  const headingId = useId()

  // Spec §7.1 invalid-configuration guard: nesting an interactive pill
  // inside an interactive card is a double-button structural violation.
  // Dev-mode warning + production fallback (pill becomes presentational).
  let resolvedAlertClick = onAlertClick
  if (onAlertClick && onClientClick) {
    // G1-BUG-2 (CEO 2026-05-20): guard `process` for browser bundles
    // where the global isn't defined (no bundler shim).
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        '[ClientGrid] `onAlertClick` and `onClientClick` cannot be combined — the card-click handler takes precedence; the alert pill becomes presentational. See docs/specs/v2.1.0/04-ClientGrid.md §7.1.'
      )
    }
    resolvedAlertClick = undefined
  }

  const filtered = mode === 'attention'
    ? clients.filter((c) => (c.alertCount ?? 0) > 0)
    : clients
  const visibleCount = filtered.length
  const computedHeading = heading ?? headingForMode[mode](visibleCount)

  // Responsive grid template: 1 col < 640, 2 cols 640-1023, desktopColumns
  // at ≥ 1024. We use a scoped `<style>` block keyed off `headingId` so
  // the rules ship with the component itself — consumers without
  // Tailwind responsive classes still get the correct breakpoints, and
  // we don't depend on Tailwind's `sm:` / `lg:` class names being
  // present in the consumer's content-scan globs.
  const scopeClass = `cg-${headingId.replace(/[^a-z0-9]/gi, '')}`
  const responsiveCss = `
    .${scopeClass} > ul, .${scopeClass} > [data-cg-skel] { display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr); }
    @media (min-width: 640px) { .${scopeClass} > ul, .${scopeClass} > [data-cg-skel] { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { .${scopeClass} > ul, .${scopeClass} > [data-cg-skel] { grid-template-columns: repeat(${desktopColumns}, minmax(0, 1fr)); } }
  `

  const showEmptyAttention = !loading && mode === 'attention' && visibleCount === 0
  const showEmptyAll = !loading && mode === 'all' && visibleCount === 0

  return (
    <>
      <TelemetryBeacon
        component="ClientGrid"
        variant={mode}
        meta={{
          count: visibleCount,
          loading,
          interactive: Boolean(onClientClick),
          pillInteractive: Boolean(resolvedAlertClick),
        }}
      />
      <style>{responsiveCss}</style>
      <section
        aria-labelledby={bare ? undefined : headingId}
        className={`client-grid-section ${scopeClass} ${className}`}
      >
        {!bare && (
          <header className="flex items-center justify-between mb-3">
            <h3 id={headingId} className="text-sm font-semibold text-[var(--color-text-default)] m-0">
              {computedHeading}
            </h3>
            {headingAction && (
              <button
                type="button"
                onClick={headingAction.onClick}
                className="text-[11px] font-semibold text-[var(--color-action-primary)] bg-transparent border-0 cursor-pointer hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-action-primary)] rounded-[var(--dimension-radius-sm)] px-1"
              >
                {headingAction.label}
              </button>
            )}
          </header>
        )}

        {loading ? (
          <div data-cg-skel aria-hidden="true">
            {Array.from({ length: skeletonCardCount }, (_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : showEmptyAttention ? (
          <div className="py-6 text-center">
            <span
              aria-hidden="true"
              className="block text-[20px] font-bold text-[var(--color-band-very-low-bg)] leading-none mb-1"
            >
              ✓
            </span>
            <p className="m-0 text-[13px] text-[var(--color-text-subtle)]">
              No clients need attention this week
            </p>
          </div>
        ) : showEmptyAll ? (
          <div className="py-6 text-center">
            <p className="m-0 text-[13px] text-[var(--color-text-subtle)]">
              No clients
            </p>
          </div>
        ) : (
          <ul role="list" className="list-none p-0 m-0">
            {filtered.map((client) => (
              <li key={client.id}>
                <ClientCardInner
                  client={client}
                  cardOnClick={onClientClick}
                  pillOnClick={resolvedAlertClick}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export type {
  ClientCardData,
  ClientGridMode,
  ClientGridProps,
} from './types'
