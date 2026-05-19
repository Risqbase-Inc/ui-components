import { Group } from '@visx/group'
import { scaleLinear, scaleBand } from '@visx/scale'
import { LinePath, Bar } from '@visx/shape'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type { ChartContainerProps, ChartSeries, SeriesPoint } from './types'

// v4.3 §5.3, status `beta`. Backed by visx@^3 (honouring the v4.2.1
// audit row A1 pin). Ships `line` / `bar` / `sparkline`; `heatmap` /
// `area` / `choropleth` / `metric-card` unlock in v4.4 by importing
// the matching visx package — no architecture change required.

const categoricalVars = [
  'var(--color-chart-cat-1)',
  'var(--color-chart-cat-2)',
  'var(--color-chart-cat-3)',
  'var(--color-chart-cat-4)',
  'var(--color-chart-cat-5)',
  'var(--color-chart-cat-6)',
  'var(--color-chart-cat-7)',
  'var(--color-chart-cat-8)',
]

function bounds(series: ChartSeries[]) {
  const ys = series.flatMap((s) => s.data.map((p) => p.y))
  const min = Math.min(0, ...ys)
  const max = Math.max(...ys, 1)
  return { min, max }
}

function pointKey(p: SeriesPoint): string {
  return String(p.x)
}

function LineView({ series, w, h, sparkline }: { series: ChartSeries[]; w: number; h: number; sparkline?: boolean }) {
  const padX = sparkline ? 1 : 32
  const padY = sparkline ? 1 : 16
  const { min, max } = bounds(series)
  const n = series[0]?.data.length ?? 0
  const xScale = scaleLinear<number>({ domain: [0, Math.max(1, n - 1)], range: [padX, w - padX] })
  const yScale = scaleLinear<number>({ domain: [min, max], range: [h - padY, padY] })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" aria-hidden="true">
      <Group>
        {!sparkline && (
          <line
            x1={padX}
            y1={h - padY}
            x2={w - padX}
            y2={h - padY}
            stroke="var(--color-chart-axis)"
            strokeWidth={1}
          />
        )}
        {series.map((s, i) => (
          <LinePath
            key={s.id}
            data={s.data}
            x={(_, j) => xScale(j)}
            y={(d) => yScale(d.y)}
            stroke={categoricalVars[i % categoricalVars.length]}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </Group>
    </svg>
  )
}

function BarView({ series, w, h }: { series: ChartSeries[]; w: number; h: number }) {
  const first = series[0]
  if (!first) return null
  const { min, max } = bounds(series)
  const padX = 32
  const padY = 16
  const xScale = scaleBand<string>({
    domain: first.data.map(pointKey),
    range: [padX, w - padX],
    padding: 0.3,
  })
  const yScale = scaleLinear<number>({ domain: [min, max], range: [h - padY, padY] })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" aria-hidden="true">
      <Group>
        <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} stroke="var(--color-chart-axis)" strokeWidth={1} />
        {first.data.map((p) => {
          const key = pointKey(p)
          const bx = xScale(key) ?? padX
          const bw = xScale.bandwidth()
          const by = yScale(p.y)
          const bh = Math.max(0, h - padY - by)
          return <Bar key={key} x={bx} y={by} width={bw} height={bh} fill={categoricalVars[0]} rx={2} />
        })}
      </Group>
    </svg>
  )
}

export function ChartContainer({
  type,
  series,
  width = '100%',
  height,
  'aria-label': ariaLabel,
  header,
  footer,
  className = '',
}: ChartContainerProps) {
  const h = height ?? (type === 'sparkline' ? 40 : 240)
  const w = 480
  return (
    <figure
      role="img"
      aria-label={ariaLabel}
      className={`flex flex-col gap-2 bg-[var(--color-chart-plot-area-bg)] ${className}`}
      style={{ width }}
    >
      <TelemetryBeacon component="ChartContainer" variant={type} meta={{ seriesCount: series.length }} />
      {header && <div className="text-sm font-semibold text-[var(--color-text-default)]">{header}</div>}
      <div style={{ height: h, width: '100%' }}>
        {type === 'line' && <LineView series={series} w={w} h={h} />}
        {type === 'sparkline' && <LineView series={series} w={w} h={h} sparkline />}
        {type === 'bar' && <BarView series={series} w={w} h={h} />}
      </div>
      {footer && <figcaption className="text-xs text-[var(--color-text-subtle)]">{footer}</figcaption>}
    </figure>
  )
}

export type { ChartContainerProps, ChartType, SeriesPoint, ChartSeries } from './types'
