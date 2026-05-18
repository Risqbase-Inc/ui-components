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

const meta: Meta<typeof ChartContainer> = {
  title: 'Data-Viz / ChartContainer',
  component: ChartContainer,
  tags: ['autodocs'],
  args: {
    type: 'line',
    series: [{ id: 'risk', label: 'Risk score', data: trend }],
    'aria-label': 'Risk score trend, 12 months, currently 78',
  },
  argTypes: { type: { control: 'select', options: ['line', 'bar', 'sparkline'] } },
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
