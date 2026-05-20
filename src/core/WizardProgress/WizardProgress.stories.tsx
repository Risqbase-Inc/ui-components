import type { Meta, StoryObj } from '@storybook/react'
import { WizardProgress } from './'

const meta: Meta<typeof WizardProgress> = {
  title: 'Core / WizardProgress',
  component: WizardProgress,
  tags: ['autodocs'],
  args: { current: 1, steps: shortSteps() },
  argTypes: {
    style: { control: 'select', options: ['dots', 'numbered', 'vertical', 'percentage'] },
  },
}
export default meta
type Story = StoryObj<typeof WizardProgress>

function shortSteps() {
  return [
    { id: 'profile', label: 'Profile' },
    { id: 'scope', label: 'Scope' },
    { id: 'review', label: 'Review' },
  ]
}

function mediumSteps() {
  return [
    { id: 's1', label: 'Profile' },
    { id: 's2', label: 'Scope' },
    { id: 's3', label: 'Controls' },
    { id: 's4', label: 'Risk' },
    { id: 's5', label: 'Review' },
    { id: 's6', label: 'Submit' },
  ]
}

function longSteps() {
  return Array.from({ length: 10 }, (_, i) => ({ id: `s${i}`, label: `Step ${i + 1}` }))
}

export const Default: Story = {}

export const Dots: Story = { args: { steps: shortSteps(), current: 1, style: 'dots' } }
export const Numbered: Story = { args: { steps: mediumSteps(), current: 3, style: 'numbered' } }
export const Vertical: Story = { args: { steps: longSteps(), current: 4, style: 'vertical' } }
export const Percentage: Story = { args: { steps: shortSteps(), current: 2, style: 'percentage', percent: 67 } }

export const AutoPicker: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 480 }}>
      <WizardProgress steps={shortSteps()} current={1} />
      <WizardProgress steps={mediumSteps()} current={3} />
      <WizardProgress steps={longSteps()} current={4} />
    </div>
  ),
}
