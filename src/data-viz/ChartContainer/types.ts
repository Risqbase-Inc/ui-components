import type { ReactNode } from 'react'

export type ChartType = 'line' | 'bar' | 'sparkline' | 'area' | 'heatmap' | 'metric-card' | 'choropleth'

/** Packaged choropleth geography (D-115). No external map service, ever. */
export type ChoroplethGeo = 'europe' | 'world'

/** Choropleth encoding mode (D-117): five-band contract or quantised sequential. */
export type ChoroplethMode = 'band' | 'seq'

/** The canonical five-band scale (v4.2.1 T1 / `color.band.*`). */
export type ChoroplethBand = 'very-low' | 'low' | 'medium' | 'high' | 'very-high'

/**
 * One choropleth datum. `id` is an ISO-3166 alpha-3 code for
 * `geo="europe"` (e.g. `"DEU"`) or a continent slug for `geo="world"`
 * (e.g. `"europe"`). `value: null` is explicit no-data (`chart.null` fill
 * + a "No data" table row) — distinct from a region absent from `data`,
 * which renders as non-interactive context (spec §6).
 */
export interface ChoroplethDatum {
  id: string
  /** Numeric value — drives `mode="seq"` fills, tooltips, the table and chip ordering. */
  value?: number | null
  /** Band — drives `mode="band"` fills. */
  band?: ChoroplethBand
}

export interface SeriesPoint {
  x: number | string
  y: number
}

export interface ChartSeries {
  id: string
  label: string
  data: SeriesPoint[]
}

/** One cell of a `heatmap` grid. `null` marks missing data. */
export interface HeatmapCell {
  x: string
  y: string
  value: number | null
}

/** Delta chip rendered next to a `metric-card` value. */
export interface MetricDelta {
  /** Pre-formatted delta copy, e.g. `"+12%"` or `"−4 pts"`. */
  value: string
  direction: 'up' | 'down' | 'flat'
  /**
   * Whether the movement is *good* — risk metrics often invert the usual
   * up-is-good reading. Defaults to `direction === 'up'`. Ignored for
   * `'flat'`, which always renders neutral.
   */
  positive?: boolean
}

/** Headline content for the `metric-card` type. */
export interface ChartMetric {
  /** Pre-formatted headline value, e.g. `"78"` or `"£1.2m"`. */
  value: string
  label: string
  delta?: MetricDelta
}

export interface ChartContainerProps {
  type: ChartType
  /**
   * Plotted series. Required for every type; for `heatmap` (driven by
   * `cells`) pass `series={[]}`, and for `metric-card` an optional
   * `series[0]` renders as a sparkline beneath the headline.
   */
  series: ChartSeries[]
  /** Grid data — only read when `type === 'heatmap'`. */
  cells?: HeatmapCell[]
  /** Headline value / label / delta — only read when `type === 'metric-card'`. */
  metric?: ChartMetric
  /** Packaged geography — only read when `type === 'choropleth'`. Default `'europe'`. */
  geo?: ChoroplethGeo
  /** Encoding mode — only read when `type === 'choropleth'`. Default `'band'`. */
  mode?: ChoroplethMode
  /** Choropleth data — only read when `type === 'choropleth'`. */
  data?: ChoroplethDatum[]
  /** Unit copy for aria-labels, tooltip and the table header, e.g. `"open alerts"`. */
  unit?: string
  /** Optional seq quantisation thresholds (4 cuts → 5 steps); default quintiles (D-117). */
  thresholds?: number[]
  /** Controlled single-select — the selected jurisdiction id, or null. */
  selectedId?: string | null
  /** Selection callback (click / Enter / Space toggles; Esc clears). */
  onSelect?: (id: string | null) => void
  /** Width (CSS value or number of px). */
  width?: number | string
  /** Height. Default 240 for line/bar/area/heatmap, 120 for metric-card, 40 for sparkline; choropleth sizes by its geometry's aspect ratio. */
  height?: number
  /** Accessible name — required. */
  'aria-label': string
  /** Optional content rendered above the chart (title / legend). */
  header?: ReactNode
  /** Optional content rendered below the chart (caption / footnotes). */
  footer?: ReactNode
  className?: string
}
