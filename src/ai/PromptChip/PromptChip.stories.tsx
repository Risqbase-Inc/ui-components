import type { Meta, StoryObj } from '@storybook/react'
import { PromptChip } from './'

const LightbulbIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.7.5 1 1.3 1 2.1V18h6v-1.2c0-.8.3-1.6 1-2.1A7 7 0 0 0 12 2z" />
  </svg>
)

const meta: Meta<typeof PromptChip> = {
  title: 'AI / PromptChip',
  component: PromptChip,
  tags: ['autodocs'],
  args: { children: 'Summarise this assessment' },
}
export default meta
type Story = StoryObj<typeof PromptChip>

export const Default: Story = {}

export const WithIcon: Story = {
  args: { icon: <LightbulbIcon /> },
}

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 540 }}>
      <PromptChip icon={<LightbulbIcon />}>Summarise this assessment</PromptChip>
      <PromptChip icon={<LightbulbIcon />}>Find similar past cases</PromptChip>
      <PromptChip icon={<LightbulbIcon />}>Draft a remediation plan</PromptChip>
    </div>
  ),
}
