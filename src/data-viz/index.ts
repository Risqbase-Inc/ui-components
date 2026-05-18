// Data-viz — Layer-2 chart + gauge primitives (spec §3, v4.3 §5.3).
//
// v4.3 ships:
//   - Gauge       (generic stroked-arc primitive)
//   - RiskGauge   (compliance-semantics wrapper over Gauge)
//   - ChartContainer with line / bar / sparkline types
//
// v4.4 will add: heatmap, area, choropleth, metric-card.

export { Gauge } from './Gauge'
export { RiskGauge, deriveBand } from './RiskGauge'
export { ChartContainer } from './ChartContainer'

export type { GaugeProps, GaugeVariant, GaugeSize, GaugePalette } from './Gauge/types'
export type { RiskGaugeProps, RiskGaugeRole } from './RiskGauge/types'
export type { ChartContainerProps, ChartType, ChartSeries, SeriesPoint } from './ChartContainer/types'
