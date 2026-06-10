import type { ReactNode } from 'react'

export type ChartType = 'line' | 'bar' | 'sparkline' | 'area' | 'heatmap' | 'metric-card'

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
  /** Width (CSS value or number of px). */
  width?: number | string
  /** Height. Default 240 for line/bar/area/heatmap, 120 for metric-card, 40 for sparkline. */
  height?: number
  /** Accessible name — required. */
  'aria-label': string
  /** Optional content rendered above the chart (title / legend). */
  header?: ReactNode
  /** Optional content rendered below the chart (caption / footnotes). */
  footer?: ReactNode
  className?: string
}
