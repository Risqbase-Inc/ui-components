import type { Meta, StoryObj } from '@storybook/react'
import { Gauge } from './'

const meta: Meta<typeof Gauge> = {
  title: 'Data-Viz / Gauge',
  component: Gauge,
  tags: ['autodocs'],
  args: { value: 60, 'aria-label': 'Score 60 of 100', size: 'summary', palette: 'teal' },
  argTypes: {
    size: { control: 'select', options: ['inline', 'accessory', 'summary', 'headline'] },
    palette: { control: 'select', options: ['teal', 'indigo', 'stone'] },
    variant: { control: 'select', options: ['single', 'dual'] },
  },
}
export default meta
type Story = StoryObj<typeof Gauge>

export const Default: Story = { args: { label: 60, caption: 'score' } }

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Gauge value={42} aria-label="Inline 42" size="inline" label={42} />
      <Gauge value={42} aria-label="Accessory 42" size="accessory" label={42} />
      <Gauge value={42} aria-label="Summary 42" size="summary" label={42} />
      <Gauge value={42} aria-label="Headline 42" size="headline" label={42} caption="score" />
    </div>
  ),
}

export const Palettes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Gauge value={70} aria-label="Teal 70" palette="teal" label={70} />
      <Gauge value={70} aria-label="Indigo 70" palette="indigo" label={70} />
      <Gauge value={70} aria-label="Stone 70" palette="stone" label={70} />
    </div>
  ),
}

export const DualRing: Story = {
  args: { variant: 'dual', value: 42, innerValue: 78, label: 42, caption: 'residual' },
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } } } },
  render: () => (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(4, auto)' }}>
      <Gauge value={20} aria-label="20" size="accessory" label={20} />
      <Gauge value={50} aria-label="50" size="accessory" label={50} />
      <Gauge value={80} aria-label="80" size="accessory" label={80} />
      <Gauge variant="dual" value={42} innerValue={78} aria-label="Dual 42 / 78" size="accessory" label={42} />
    </div>
  ),
}
