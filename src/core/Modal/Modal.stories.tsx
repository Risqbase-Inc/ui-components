/* eslint-disable @typescript-eslint/no-empty-function -- onClose no-ops in Chromatic-only stories */
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal, Drawer, Sheet } from './'
import { Button } from '../Button'

const meta: Meta<typeof Modal> = {
  title: 'Core / Modal · Drawer · Sheet',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    // Force the dialog open via `args.open: true` per-story so Chromatic
    // captures the open state without needing to interact.
    chromatic: { delay: 150 },
  },
}
export default meta
type Story = StoryObj<typeof Modal>

function Trigger({ render }: { render: (open: boolean, set: (b: boolean) => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>Open</Button>
      {render(open, setOpen)}
    </>
  )
}

// For Chromatic baselines we render the open state directly — no interaction needed.

export const ModalDefault: Story = {
  render: () => (
    <Modal open onClose={() => {}} title="Confirm deletion">
      <p style={{ color: 'var(--color-text-subtle)', marginBottom: 16 }}>
        This will permanently remove the assessment from the workspace.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Delete</Button>
      </div>
    </Modal>
  ),
}

export const ModalLarge: Story = {
  render: () => (
    <Modal open onClose={() => {}} title="Long-form dialog" size="lg">
      <p style={{ color: 'var(--color-text-subtle)' }}>
        Larger modals carry more body content — risk-export wizards, plan-change confirmations,
        anything that needs to breathe.
      </p>
    </Modal>
  ),
}

export const DrawerRight: Story = {
  render: () => (
    <Drawer open onClose={() => {}} title="Filters">
      <p style={{ color: 'var(--color-text-subtle)' }}>Drawer slides in from the right edge.</p>
    </Drawer>
  ),
}

export const DrawerLeft: Story = {
  render: () => (
    <Drawer open onClose={() => {}} title="Navigation" side="left">
      <p style={{ color: 'var(--color-text-subtle)' }}>Drawer slides in from the left edge.</p>
    </Drawer>
  ),
}

export const SheetDefault: Story = {
  render: () => (
    <Sheet open onClose={() => {}} title="Quick actions">
      <p style={{ color: 'var(--color-text-subtle)' }}>Sheet slides up from the bottom edge.</p>
    </Sheet>
  ),
}

export const Interactive: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <Trigger
      render={(open, set) => (
        <Modal open={open} onClose={() => set(false)} title="Interactive demo">
          <p>Open/close via the button. Press Esc or click outside to dismiss.</p>
        </Modal>
      )}
    />
  ),
}
