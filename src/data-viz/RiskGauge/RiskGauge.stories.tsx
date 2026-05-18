import type { Meta, StoryObj } from '@storybook/react'
import { RiskGauge } from './'

const meta: Meta<typeof RiskGauge> = {
  title: 'Data-Viz / RiskGauge',
  component: RiskGauge,
  tags: ['autodocs'],
  args: { inherent: 78, residual: 42, role: 'detail', label: 'GDPR Art. 32' },
  argTypes: { role: { control: 'select', options: ['headline', 'detail', 'list'] } },
}
export default meta
type Story = StoryObj<typeof RiskGauge>

export const Default: Story = {}

export const Headline: Story = { args: { role: 'headline' } }
export const Detail: Story = { args: { role: 'detail' } }
export const List: Story = { args: { role: 'list' } }

export const BandRange: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
      <RiskGauge inherent={50} residual={15} role="detail" label="Very low" />
      <RiskGauge inherent={60} residual={32} role="detail" label="Low" />
      <RiskGauge inherent={70} residual={50} role="detail" label="Medium" />
      <RiskGauge inherent={85} residual={72} role="detail" label="High" />
      <RiskGauge inherent={95} residual={92} role="detail" label="Very high" />
    </div>
  ),
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } } } },
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <RiskGauge inherent={78} residual={42} role="headline" label="GDPR Art. 32" />
      <RiskGauge inherent={60} residual={20} role="detail" label="EU AI Act Art. 6" />
      <RiskGauge inherent={90} residual={88} role="list" label="ISO 27001 A.5.1" />
    </div>
  ),
}
