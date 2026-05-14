import type { Meta, StoryObj } from '@storybook/react';
import { Badge, MostPopularBadge, StandaloneProductBadge, NewBadge, ComingSoonBadge } from './';

const meta: Meta<typeof Badge> = {
  title: 'Core / Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'highlight', 'subtle'] },
    children: { control: 'text' },
  },
  args: { children: 'Most Popular', variant: 'default' },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="highlight">Highlight</Badge>
      <Badge variant="subtle">Subtle</Badge>
    </div>
  ),
};

export const Composed: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <MostPopularBadge />
      <StandaloneProductBadge />
      <NewBadge />
      <ComingSoonBadge />
    </div>
  ),
};

// Print snapshot - applies @media print at capture time
export const Gallery: Story = {
  parameters: {
    chromatic: { modes: { print: { media: 'print' } } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <MostPopularBadge />
      <StandaloneProductBadge />
      <NewBadge />
      <ComingSoonBadge />
    </div>
  ),
};
