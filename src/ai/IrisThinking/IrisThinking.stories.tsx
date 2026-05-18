import type { Meta, StoryObj } from '@storybook/react'
import { IrisThinking } from './'

const meta: Meta<typeof IrisThinking> = {
  title: 'AI / IrisThinking',
  component: IrisThinking,
  tags: ['autodocs'],
  args: { size: 'md' },
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
  // Pause the rotation for Chromatic so the snapshot is deterministic.
  parameters: { chromatic: { pauseAnimationAtEnd: true } },
}
export default meta
type Story = StoryObj<typeof IrisThinking>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <IrisThinking size="sm" />
      <IrisThinking size="md" />
      <IrisThinking size="lg" />
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IrisThinking size="sm" />
      <span style={{ color: 'var(--color-text-subtle)' }}>Searching the Knowledge Bank…</span>
    </div>
  ),
}
