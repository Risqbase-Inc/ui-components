// Data-viz — Layer-2 chart + gauge + impact-graph primitives (spec §3,
// v4.3 §5.3, v2.1.0 §1).
//
// v4.3 shipped:
//   - Gauge       (generic stroked-arc primitive)
//   - RiskGauge   (compliance-semantics wrapper over Gauge)
//   - ChartContainer with line / bar / sparkline types
//
// v2.1.0 adds:
//   - ImpactGraph             (radial alert→entity composition primitive)
//   - MarketingImpactGraph    (static marketing-frozen wrapper)
//
// v4.4 will add: heatmap, area, choropleth, metric-card.

export { Gauge } from './Gauge'
export { RiskGauge, deriveBand } from './RiskGauge'
export { ChartContainer } from './ChartContainer'
export { ImpactGraph, MarketingImpactGraph } from './ImpactGraph'

export type { GaugeProps, GaugeVariant, GaugeSize, GaugePalette } from './Gauge/types'
export type { RiskGaugeProps, RiskGaugeRole } from './RiskGauge/types'
export type { ChartContainerProps, ChartType, ChartSeries, SeriesPoint } from './ChartContainer/types'
export type {
  ImpactGraphProps,
  ImpactAlert,
  ImpactEntity,
  ImpactCascade,
  ImpactCategory,
  ImpactSeverity,
  CategoryPalette,
} from './ImpactGraph/types'
export type { MarketingImpactGraphProps } from './ImpactGraph'
