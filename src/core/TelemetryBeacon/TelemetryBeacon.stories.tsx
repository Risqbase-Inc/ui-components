import type { Meta, StoryObj } from '@storybook/react'
import { TelemetryBeacon } from './'

// The Beacon renders null. Stories exist for API docs + Chromatic
// inventory only; there is no visual to snapshot.
const meta: Meta<typeof TelemetryBeacon> = {
  title: 'Core / TelemetryBeacon',
  component: TelemetryBeacon,
  tags: ['autodocs'],
  args: { component: 'ExampleComponent', version: '2.0.0', variant: 'primary' },
  parameters: { chromatic: { disableSnapshot: true } },
}
export default meta
type Story = StoryObj<typeof TelemetryBeacon>

export const Default: Story = {
  render: (args) => (
    <div style={{ color: 'var(--color-text-subtle)', fontSize: 14, fontFamily: 'var(--font-sans, sans-serif)' }}>
      <p>
        <TelemetryBeacon {...args} />
        TelemetryBeacon renders <code>null</code>. Open DevTools and set{' '}
        <code>NEXT_PUBLIC_TELEMETRY_DEBUG=1</code> in development to see mount events on the console.
      </p>
    </div>
  ),
}
