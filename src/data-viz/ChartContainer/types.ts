import type { ReactNode } from 'react'

export type ChartType = 'line' | 'bar' | 'sparkline'

export interface SeriesPoint {
  x: number | string
  y: number
}

export interface ChartSeries {
  id: string
  label: string
  data: SeriesPoint[]
}

export interface ChartContainerProps {
  type: ChartType
  series: ChartSeries[]
  /** Width (CSS value or number of px). */
  width?: number | string
  /** Height. Default 240 for line/bar, 40 for sparkline. */
  height?: number
  /** Accessible name — required. */
  'aria-label': string
  /** Optional content rendered above the chart (title / legend). */
  header?: ReactNode
  /** Optional content rendered below the chart (caption / footnotes). */
  footer?: ReactNode
  className?: string
}
