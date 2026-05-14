import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './';

const meta: Meta<typeof Footer> = {
  title: 'Core / Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    // Footer is full-width — let it span the canvas.
    layout: 'fullscreen',
  },
  argTypes: {
    variant: { control: 'select', options: ['risqbase', 'ralia'] },
  },
  args: { variant: 'risqbase' },
};
export default meta;

type Story = StoryObj<typeof Footer>;

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
        <Footer variant="risqbase" />
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
        <Footer variant="ralia" />
      </div>
    </div>
  ),
};

// Print snapshot - applies @media print at capture time
export const Gallery: Story = {
  parameters: {
    chromatic: { modes: { print: { media: 'print' } } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Footer variant="risqbase" />
      <Footer variant="ralia" />
    </div>
  ),
};
