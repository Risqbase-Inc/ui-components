import type { Meta, StoryObj } from '@storybook/react'
import { ChartContainer } from './'

const trend = Array.from({ length: 12 }, (_, i) => ({ x: i + 1, y: 60 + Math.sin(i / 1.5) * 15 + i }))
const sparkline = Array.from({ length: 24 }, (_, i) => ({ x: i, y: 50 + Math.cos(i / 2) * 18 }))
const bars = [
  { x: 'EU', y: 42 },
  { x: 'UK', y: 36 },
  { x: 'US', y: 58 },
  { x: 'APAC', y: 28 },
]

// Heatmap fixture — risk velocity by region × quarter, with two null
// cells (APAC onboarding gap) exercising `--color-chart-null`.
const heatmapCells = (['EU', 'UK', 'US', 'APAC'] as const).flatMap((region, ri) =>
  (['Q1', 'Q2', 'Q3', 'Q4'] as const).map((quarter, qi) => ({
    x: quarter,
    y: region as string,
    value: region === 'APAC' && qi < 2 ? null : 20 + ri * 14 + qi * 9,
  })),
)

const meta: Meta<typeof ChartContainer> = {
  title: 'Data-Viz / ChartContainer',
  component: ChartContainer,
  tags: ['autodocs'],
  args: {
    type: 'line',
    series: [{ id: 'risk', label: 'Risk score', data: trend }],
    'aria-label': 'Risk score trend, 12 months, currently 78',
  },
  argTypes: {
    type: { control: 'select', options: ['line', 'bar', 'sparkline', 'area', 'heatmap', 'metric-card'] },
  },
}
export default meta
type Story = StoryObj<typeof ChartContainer>

export const Line: Story = {
  args: {
    type: 'line',
    series: [{ id: 'risk', label: 'Risk score', data: trend }],
    header: 'Risk score · 12 months',
    footer: 'Higher is worse.',
    'aria-label': 'Risk score trend, 12 months',
  },
}

export const Bar: Story = {
  args: {
    type: 'bar',
    series: [{ id: 'region', label: 'Region', data: bars }],
    header: 'Residual risk by region',
    'aria-label': 'Residual risk by region',
  },
}

export const Sparkline: Story = {
  args: {
    type: 'sparkline',
    series: [{ id: 'spark', label: 'spark', data: sparkline }],
    height: 40,
    width: 160,
    'aria-label': 'Risk score, last 24 days',
  },
}

export const MultiSeries: Story = {
  args: {
    type: 'line',
    series: [
      { id: 'inherent', label: 'Inherent', data: trend.map((p) => ({ ...p, y: p.y + 30 })) },
      { id: 'residual', label: 'Residual', data: trend },
    ],
    header: 'Inherent vs residual · 12 months',
    'aria-label': 'Inherent vs residual risk trend',
  },
}

export const Area: Story = {
  args: {
    type: 'area',
    series: [
      { id: 'inherent', label: 'Inherent', data: trend.map((p) => ({ ...p, y: p.y + 30 })) },
      { id: 'residual', label: 'Residual', data: trend },
    ],
    header: 'Inherent vs residual · 12 months',
    footer: 'Filled bands show magnitude; lines show trend.',
    'aria-label': 'Inherent vs residual risk trend, 12 months, filled area chart',
  },
}

export const Heatmap: Story = {
  args: {
    type: 'heatmap',
    series: [],
    cells: heatmapCells,
    header: 'Risk velocity · region × quarter',
    footer: 'APAC Q1–Q2 predate onboarding (no data).',
    'aria-label': 'Risk velocity heatmap by region and quarter; APAC Q1 and Q2 have no data',
  },
}

export const MetricCard: Story = {
  args: {
    type: 'metric-card',
    series: [{ id: 'spark', label: 'Residual risk', data: sparkline }],
    metric: {
      value: '78',
      label: 'Residual risk score',
      delta: { value: '+12 pts', direction: 'up', positive: false },
    },
    width: 240,
    'aria-label': 'Residual risk score 78, up 12 points since last month — worsening',
  },
}

export const MetricCardDown: Story = {
  args: {
    type: 'metric-card',
    series: [],
    metric: {
      value: '£1.2m',
      label: 'Exposure under remediation',
      delta: { value: '−8%', direction: 'down', positive: true },
    },
    width: 240,
    'aria-label': 'Exposure under remediation £1.2m, down 8% — improving',
  },
}

export const MetricCardFlat: Story = {
  args: {
    type: 'metric-card',
    series: [],
    metric: {
      value: '14',
      label: 'Open critical findings',
      delta: { value: '±0', direction: 'flat' },
    },
    width: 240,
    'aria-label': 'Open critical findings 14, unchanged since last week',
  },
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } } } },
  render: () => (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', width: 960 }}>
      <ChartContainer
        type="line"
        series={[{ id: 'risk', label: 'Risk', data: trend }]}
        aria-label="Line gallery"
        header="Line"
      />
      <ChartContainer
        type="bar"
        series={[{ id: 'region', label: 'Region', data: bars }]}
        aria-label="Bar gallery"
        header="Bar"
      />
      <div style={{ gridColumn: '1 / -1' }}>
        <ChartContainer
          type="sparkline"
          series={[{ id: 'spark', label: 'spark', data: sparkline }]}
          height={40}
          width={320}
          aria-label="Sparkline gallery"
        />
      </div>
    </div>
  ),
}
