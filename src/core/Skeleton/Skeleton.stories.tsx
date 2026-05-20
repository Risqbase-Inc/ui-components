import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './'

const meta: Meta<typeof Skeleton> = {
  title: 'Core / Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { variant: 'row' },
  argTypes: {
    variant: { control: 'select', options: ['row', 'card', 'chart', 'text', 'circle'] },
    count: { control: 'number' },
  },
  // Disable Chromatic animation capture variance — shimmer runs continuously.
  parameters: { chromatic: { pauseAnimationAtEnd: true } },
}
export default meta
type Story = StoryObj<typeof Skeleton>

export const Default: Story = { args: { variant: 'row' } }

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Skeleton variant="row" />
      <Skeleton variant="text" />
      <Skeleton variant="card" />
      <Skeleton variant="chart" />
      <Skeleton variant="circle" />
    </div>
  ),
}

export const Repeating: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Skeleton variant="row" count={4} />
    </div>
  ),
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } }, pauseAnimationAtEnd: true } },
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr', width: 640 }}>
      <div>
        <Skeleton variant="row" />
        <div style={{ height: 8 }} />
        <Skeleton variant="row" width="60%" />
      </div>
      <Skeleton variant="circle" />
      <Skeleton variant="card" />
      <Skeleton variant="chart" />
    </div>
  ),
}
