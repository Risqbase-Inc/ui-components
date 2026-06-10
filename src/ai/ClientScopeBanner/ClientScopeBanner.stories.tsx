/* eslint-disable @typescript-eslint/no-empty-function -- onSwitch/onDetails no-ops in stories */
import type { Meta, StoryObj } from '@storybook/react'
import { ClientScopeBanner } from './'

const meta: Meta<typeof ClientScopeBanner> = {
  title: 'AI / ClientScopeBanner',
  component: ClientScopeBanner,
  tags: ['autodocs'],
  args: { state: 'workspace', isolationVerifiedAt: '2026-05-18T09:12:00Z' },
  argTypes: {
    state: { control: 'select', options: ['workspace', 'client', 'white-label', 'switching'] },
  },
}
export default meta
type Story = StoryObj<typeof ClientScopeBanner>

export const Workspace: Story = { args: { state: 'workspace' } }
export const Client: Story = {
  args: { state: 'client', client: 'Acme Bank', onSwitch: () => {}, onDetails: () => {} },
}
export const WhiteLabel: Story = { args: { state: 'white-label', client: 'NorthBridge Advisors' } }
export const Switching: Story = { args: { state: 'switching' } }

export const Stack: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ClientScopeBanner state="workspace" isolationVerifiedAt="2026-05-18T09:12:00Z" />
      {/* A11Y-FIX C5: the stacked copies are state showcase — identical
          region landmarks below the first are hidden from the a11y tree. */}
      <div inert aria-hidden="true">
        <ClientScopeBanner state="client" client="Acme Bank" isolationVerifiedAt="2026-05-18T09:12:00Z" onSwitch={() => {}} />
        <ClientScopeBanner state="white-label" client="NorthBridge Advisors" isolationVerifiedAt="2026-05-18T09:12:00Z" />
        <ClientScopeBanner state="switching" />
      </div>
    </div>
  ),
}
