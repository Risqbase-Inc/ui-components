import type { Meta, StoryObj } from '@storybook/react'
import { ChartContainer } from './'
import type { ChartContainerProps } from './types'

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
    type: { control: 'select', options: ['line', 'bar', 'sparkline', 'area', 'heatmap', 'metric-card', 'choropleth'] },
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

/* ── choropleth (v4.4 D-115…D-119; spec §6 checklist: light + dark ×
 * band + seq × europe + world = 8 Chromatic baselines from these four
 * stories via the theme modes, + chip-strip + no-data stories) ──────── */

// Illustrative fixture data mirroring the spec demo (§1).
const euroBands = [
  { id: 'IRL', band: 'very-low', value: 2 },
  { id: 'FIN', band: 'very-low', value: 3 },
  { id: 'DNK', band: 'very-low', value: 4 },
  { id: 'EST', band: 'very-low', value: 4 },
  { id: 'SWE', band: 'low', value: 7 },
  { id: 'NLD', band: 'low', value: 8 },
  { id: 'NOR', band: 'low', value: 8 },
  { id: 'DEU', band: 'low', value: 9 },
  { id: 'AUT', band: 'low', value: 10 },
  { id: 'CZE', band: 'low', value: 11 },
  { id: 'LUX', band: 'low', value: 6 },
  { id: 'FRA', band: 'medium', value: 14 },
  { id: 'BEL', band: 'medium', value: 15 },
  { id: 'ESP', band: 'medium', value: 17 },
  { id: 'PRT', band: 'medium', value: 13 },
  { id: 'ITA', band: 'medium', value: 19 },
  { id: 'SVN', band: 'medium', value: 16 },
  { id: 'LVA', band: 'medium', value: 14 },
  { id: 'LTU', band: 'medium', value: 13 },
  { id: 'GBR', band: 'medium', value: 18 },
  { id: 'POL', band: 'high', value: 27 },
  { id: 'ROU', band: 'high', value: 29 },
  { id: 'GRC', band: 'high', value: 25 },
  { id: 'HRV', band: 'high', value: 26 },
  { id: 'SVK', band: 'high', value: 28 },
  { id: 'CYP', band: 'high', value: 25 },
  { id: 'MLT', band: 'high', value: 30 },
  { id: 'HUN', band: 'very-high', value: 41 },
  { id: 'BGR', band: 'very-high', value: 38 },
  { id: 'ISL', value: null },
  { id: 'LIE', value: null },
] satisfies NonNullable<ChartContainerProps['data']>

const worldBands = [
  { id: 'europe', band: 'high', value: 48 },
  { id: 'asia', band: 'high', value: 37 },
  { id: 'africa', band: 'medium', value: 18 },
  { id: 'north-america', band: 'medium', value: 23 },
  { id: 'south-america', band: 'low', value: 9 },
  { id: 'oceania', band: 'very-low', value: 3 },
] satisfies NonNullable<ChartContainerProps['data']>

export const ChoroplethEuropeBand: Story = {
  args: {
    type: 'choropleth',
    series: [],
    geo: 'europe',
    mode: 'band',
    data: euroBands,
    unit: 'open alerts',
    width: 720,
    'aria-label': 'Regulatory posture by jurisdiction, EU/EEA and UK, band mode',
  },
}

export const ChoroplethEuropeSeq: Story = {
  args: {
    ...ChoroplethEuropeBand.args,
    mode: 'seq',
    thresholds: [5, 12, 24, 36],
    'aria-label': 'Open alerts by jurisdiction, EU/EEA and UK, sequential mode',
  },
}

export const ChoroplethWorldBand: Story = {
  args: {
    type: 'choropleth',
    series: [],
    geo: 'world',
    mode: 'band',
    data: worldBands,
    unit: 'open alerts',
    width: 720,
    'aria-label': 'Regulatory posture by continent, band mode',
  },
}

export const ChoroplethWorldSeq: Story = {
  args: {
    ...ChoroplethWorldBand.args,
    mode: 'seq',
    'aria-label': 'Open alerts by continent, sequential mode',
  },
}

// D-118: Malta / Luxembourg / Cyprus / Liechtenstein can never be honest
// hit targets on a Europe map — the strip below the map carries them.
export const ChoroplethChipStrip: Story = {
  args: {
    ...ChoroplethEuropeBand.args,
    width: 480,
    'aria-label': 'Small-jurisdiction chip strip, Europe band mode at narrow width',
  },
}

export const ChoroplethNoData: Story = {
  args: {
    type: 'choropleth',
    series: [],
    geo: 'europe',
    mode: 'band',
    data: [
      { id: 'DEU', band: 'low', value: 9 },
      { id: 'FRA', band: 'medium', value: 14 },
      { id: 'POL', band: 'high', value: 27 },
      { id: 'ISL', value: null },
      { id: 'NOR', value: null },
      { id: 'SWE', value: null },
      { id: 'FIN', value: null },
    ],
    unit: 'open alerts',
    width: 720,
    'aria-label': 'Choropleth with explicit no-data jurisdictions and context regions',
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
