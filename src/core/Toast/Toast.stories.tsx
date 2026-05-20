/* eslint-disable @typescript-eslint/no-empty-function -- onDismiss/onClick no-ops in stories */
import type { Meta, StoryObj } from '@storybook/react'
import { Toast, ToastViewport } from './'
import type { ToastItem } from './types'

const meta: Meta<typeof Toast> = {
  title: 'Core / Toast · ToastViewport',
  component: Toast,
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof Toast>

function fixture(intent: ToastItem['intent']): ToastItem {
  return {
    id: `t-${intent}`,
    intent,
    title: `${intent ?? 'info'} title`,
    description: `Body copy for ${intent ?? 'info'} toast.`,
  }
}

export const Intents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toast toast={fixture('info')} onDismiss={() => {}} />
      <Toast toast={fixture('success')} onDismiss={() => {}} />
      <Toast toast={fixture('warning')} onDismiss={() => {}} />
      <Toast toast={fixture('danger')} onDismiss={() => {}} />
    </div>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Toast
      toast={{
        id: 't-action',
        intent: 'success',
        title: 'Saved',
        description: 'Your assessment was saved as a draft.',
        action: { label: 'Undo', onClick: () => {} },
      }}
      onDismiss={() => {}}
    />
  ),
}

export const Viewport: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 360, width: 480, background: 'var(--color-surface-subtle)' }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <ToastViewport
      quadrant="top-right"
      onDismiss={() => {}}
      toasts={[fixture('info'), fixture('warning'), fixture('danger')]}
    />
  ),
}
