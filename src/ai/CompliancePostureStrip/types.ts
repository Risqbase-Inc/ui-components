// CompliancePostureStrip — types extracted into a sibling file so consumers
// can import the shape without paying the cost of the component bundle.
// Mirrors the spec at docs/specs/v2.1.0/03-CompliancePostureStrip.md §2.

export interface ClientPosture {
  id: string
  /** Display name; truncates at 10 characters in the strip via CSS ellipsis. */
  name: string
  /** Residual risk 0–100; drives gauge fill + band derivation. */
  residual: number
  /** Optional active-alert count; renders the pill when > 0. */
  alertCount?: number
  /**
   * Alert severity for the pill colour (driven from the client's highest
   * open finding). Required when `alertCount > 0`; ignored otherwise.
   */
  alertSeverity?: 'high' | 'medium'
  /** Optional click handler; when present, each gauge cell becomes a button. */
  onClick?: () => void
}

export type PostureSort = 'risk' | 'name' | 'alerts'

export interface CompliancePostureStripProps {
  /** Clients to render. Order respected unless a sort is applied. */
  clients: ClientPosture[]
  /** Active sort. Defaults to undefined — respect the order passed in. */
  sort?: PostureSort
  /** Fire when the user changes sort via the inline sort affordance. */
  onSortChange?: (next: PostureSort) => void
  /**
   * Heading rendered above the strip; defaults to
   * `"Posture across clients · N total"` where N is `clients.length`.
   */
  heading?: string
  /**
   * When true, hide the heading + sort affordance (use inside a section
   * that already provides them). Defaults to false.
   */
  bare?: boolean
  /**
   * Override the gauge palette across all cells; defaults to 'teal' to
   * match the Practice cockpit visual canon (Demo C).
   */
  gaugePalette?: 'teal' | 'indigo'
  /**
   * When true, render the skeleton-shimmer loading state in place of
   * gauges. Cell count defaults to 12 (matches the Cockpit canon).
   */
  loading?: boolean
  /** Number of skeleton cells to render when `loading` is true. */
  skeletonCellCount?: number
  className?: string
}
