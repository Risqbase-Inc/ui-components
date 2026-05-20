// ClientGrid — types extracted into a sibling file so consumers can
// import the shape without paying the cost of the component bundle.
// Mirrors the spec at docs/specs/v2.1.0/04-ClientGrid.md §2.

export interface ClientCardData {
  id: string
  /** Display name, e.g. "Acme Health GmbH". */
  name: string
  /** Sub-line, e.g. "Healthcare · DE · 240 staff". */
  subline: string
  /** Avatar glyph (single character; defaults to `name[0]`). */
  avatarGlyph?: string
  /** Avatar palette key — maps to `--color-chart-cat-{1..6}`. */
  avatarPalette?: 1 | 2 | 3 | 4 | 5 | 6
  /** Residual risk 0–100. */
  residual: number
  /**
   * Week-on-week change (signed integer). Positive = risk increased
   * (rendered in `--color-band-very-high-bg`); negative = improved
   * (rendered in `--color-band-very-low-bg`). The semantic is inverted
   * from market-data conventions — risk-up reads as warning, not gain.
   */
  weeklyDelta?: number
  /** Active alert count + severity. */
  alertCount?: number
  alertSeverity?: 'high' | 'medium'
  /** Optional secondary stat, e.g. "14 DPIAs", "3 incidents", "DPA 14d". */
  secondaryStat?: string
}

export type ClientGridMode = 'attention' | 'all'

export interface ClientGridProps {
  clients: ClientCardData[]
  /** Defaults to `'all'`. */
  mode?: ClientGridMode
  /** Click handler per client; when present, each card becomes a button. */
  onClientClick?: (client: ClientCardData) => void
  /**
   * Click handler on the alert pill; when present, the pill becomes a
   * separate button. When omitted, the pill is purely visual (matches
   * Demo C). Cannot be combined with `onClientClick` — engineering
   * warns in dev mode and treats `onClientClick` as the only handler
   * (spec §7.1).
   */
  onAlertClick?: (client: ClientCardData) => void
  /** Heading rendered above the grid; defaults to mode-specific text. */
  heading?: string
  /** Right-aligned heading affordance, e.g. "+ Add client" link. */
  headingAction?: { label: string; onClick: () => void }
  /** Number of columns at desktop; defaults to 3 (Demo C). */
  desktopColumns?: 2 | 3 | 4
  /** When true, suppress the heading row entirely. */
  bare?: boolean
  /**
   * When true, render skeleton cards in place of real ones. Default
   * count = 3 (matches the Demo C 3-up canon); override via
   * `skeletonCardCount`.
   */
  loading?: boolean
  skeletonCardCount?: number
  className?: string
}
