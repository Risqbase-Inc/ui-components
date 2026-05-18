import type { ChartContainerProps, ChartSeries } from './types'

// v4.3 ships `line`, `bar`, and `sparkline`. `heatmap`, `area`,
// `choropleth`, and `metric-card` are deferred to v4.4 (per v4.1 §8.1.1
// chart taxonomy). The primitive resolves through chart-categorical
// tokens — eight colours, indexed by series position.

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

function scaleX(i: number, n: number, w: number, padX: number) {
  if (n <= 1) return padX
  return padX + ((w - padX * 2) * i) / (n - 1)
}

function scaleY(y: number, min: number, max: number, h: number, padY: number) {
  if (max === min) return h - padY
  return h - padY - ((y - min) / (max - min)) * (h - padY * 2)
}

function LineChart({ series, w, h, sparkline }: { series: ChartSeries[]; w: number; h: number; sparkline?: boolean }) {
  const { min, max } = bounds(series)
  const padX = sparkline ? 1 : 32
  const padY = sparkline ? 1 : 16
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" aria-hidden="true">
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
      {series.map((s, i) => {
        const n = s.data.length
        const path = s.data
          .map((p, j) => {
            const x = scaleX(j, n, w, padX)
            const y = scaleY(p.y, min, max, h, padY)
            return `${j === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
          })
          .join(' ')
        return (
          <path
            key={s.id}
            d={path}
            fill="none"
            stroke={categoricalVars[i % categoricalVars.length]}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  )
}

function BarChart({ series, w, h }: { series: ChartSeries[]; w: number; h: number }) {
  const first = series[0]
  if (!first) return null
  const { min, max } = bounds(series)
  const padX = 32
  const padY = 16
  const n = first.data.length
  const barWidth = ((w - padX * 2) / Math.max(1, n)) * 0.7
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" aria-hidden="true">
      <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} stroke="var(--color-chart-axis)" strokeWidth={1} />
      {first.data.map((p, j) => {
        const cx = scaleX(j, n, w, padX)
        const y = scaleY(p.y, min, max, h, padY)
        const barHeight = h - padY - y
        return (
          <rect
            key={String(p.x) + j}
            x={cx - barWidth / 2}
            y={y}
            width={barWidth}
            height={Math.max(0, barHeight)}
            fill={categoricalVars[0]}
            rx={2}
          />
        )
      })}
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
      {header && <div className="text-sm font-semibold text-[var(--color-text-default)]">{header}</div>}
      <div style={{ height: h, width: '100%' }}>
        {type === 'line' && <LineChart series={series} w={w} h={h} />}
        {type === 'sparkline' && <LineChart series={series} w={w} h={h} sparkline />}
        {type === 'bar' && <BarChart series={series} w={w} h={h} />}
      </div>
      {footer && <figcaption className="text-xs text-[var(--color-text-subtle)]">{footer}</figcaption>}
    </figure>
  )
}

export type { ChartContainerProps, ChartType, SeriesPoint, ChartSeries } from './types'
