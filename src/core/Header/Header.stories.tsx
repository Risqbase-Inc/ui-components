import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './';

const meta: Meta<typeof Header> = {
  title: 'Core / Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    // Header is full-width — let it span the canvas.
    layout: 'fullscreen',
  },
  argTypes: {
    variant: { control: 'select', options: ['risqbase', 'ralia'] },
    showLaunchDate: { control: 'boolean' },
  },
  args: { variant: 'risqbase', showLaunchDate: false },
};
export default meta;

type Story = StoryObj<typeof Header>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <p
          style={{
            margin: '0 0 8px',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-subtle)',
            padding: '0 16px',
          }}
        >
          variant: risqbase
        </p>
        <Header variant="risqbase" />
      </div>
      <div>
        <p
          style={{
            margin: '0 0 8px',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--color-text-subtle)',
            padding: '0 16px',
          }}
        >
          variant: ralia
        </p>
        <Header variant="ralia" />
      </div>
    </div>
  ),
};

export const WithLaunchDate: Story = {
  args: { variant: 'risqbase', showLaunchDate: true },
};

// Print snapshot - applies @media print at capture time
export const Gallery: Story = {
  parameters: {
    chromatic: { modes: { print: { media: 'print' } } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Header variant="risqbase" />
      <Header variant="ralia" />
    </div>
  ),
};
