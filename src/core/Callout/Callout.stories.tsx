import type { Meta, StoryObj } from '@storybook/react'
import { Callout } from './'

const meta: Meta<typeof Callout> = {
  title: 'Core / Callout',
  component: Callout,
  tags: ['autodocs'],
  args: { intent: 'info', title: 'Heads up', children: 'This is an informational callout.' },
  argTypes: {
    intent: { control: 'select', options: ['info', 'warning', 'danger', 'success', 'tip'] },
  },
}
export default meta
type Story = StoryObj<typeof Callout>

export const Default: Story = {}

export const Intents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 480 }}>
      <Callout intent="info" title="Info">An informational note.</Callout>
      <Callout intent="warning" title="Warning">Heads up — this requires review.</Callout>
      <Callout intent="danger" title="Danger">Action could not be completed.</Callout>
      <Callout intent="success" title="Success">Changes saved.</Callout>
      <Callout intent="tip" title="Tip">Use the keyboard shortcut <kbd>⌘K</kbd>.</Callout>
    </div>
  ),
}

export const WithoutTitle: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Callout intent="warning">A title-less callout — the body carries the whole message.</Callout>
    </div>
  ),
}

export const IconOmitted: Story = {
  render: () => (
    <div style={{ width: 480 }}>
      <Callout intent="info" icon={null} title="No icon">Pass <code>icon={'{null}'}</code> for text-only.</Callout>
    </div>
  ),
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } } } },
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 600 }}>
      <Callout intent="info" title="Info">Info body</Callout>
      <Callout intent="warning" title="Warning">Warning body</Callout>
      <Callout intent="danger" title="Danger">Danger body</Callout>
      <Callout intent="success" title="Success">Success body</Callout>
      <Callout intent="tip" title="Tip">Tip body</Callout>
    </div>
  ),
}
