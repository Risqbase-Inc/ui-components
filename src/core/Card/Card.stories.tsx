import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './'
import { Button } from '../Button'

const meta: Meta<typeof Card> = {
  title: 'Core / Card',
  component: Card,
  tags: ['autodocs'],
  args: { variant: 'default', padding: 'md' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'subtle', 'inverse'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
}
export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: (
      <>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Card title</h3>
        <p style={{ margin: '8px 0 0', color: 'var(--color-text-subtle)', fontSize: 14 }}>
          A default card with body padding.
        </p>
      </>
    ),
  },
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)', width: 720 }}>
      <Card variant="default">
        <h3 style={{ margin: 0 }}>Default</h3>
        <p style={{ color: 'var(--color-text-subtle)' }}>White surface, default border.</p>
      </Card>
      <Card variant="subtle">
        <h3 style={{ margin: 0 }}>Subtle</h3>
        <p style={{ color: 'var(--color-text-subtle)' }}>Stone-50 surface.</p>
      </Card>
      <Card variant="inverse">
        <h3 style={{ margin: 0 }}>Inverse</h3>
        <p>Stone-900 surface, white type.</p>
      </Card>
    </div>
  ),
}

export const Composed: Story = {
  render: () => (
    <Card variant="default" padding="lg">
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Upgrade your plan</h3>
      <p style={{ color: 'var(--color-text-subtle)', margin: '8px 0 16px' }}>
        Get unlimited audits, priority support, and Iris pro.
      </p>
      <Button variant="primary">View plans</Button>
    </Card>
  ),
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } } } },
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, 1fr)', width: 600 }}>
      <Card variant="default" padding="sm">Small padding</Card>
      <Card variant="default" padding="md">Medium padding</Card>
      <Card variant="subtle" padding="lg">Subtle · large padding</Card>
      <Card variant="inverse" padding="md">Inverse · medium padding</Card>
    </div>
  ),
}
