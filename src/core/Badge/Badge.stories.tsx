import type { Meta, StoryObj } from '@storybook/react';
import { Badge, BandBadge, MostPopularBadge, StandaloneProductBadge, NewBadge, ComingSoonBadge } from './';

const meta: Meta<typeof Badge> = {
  title: 'Core / Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'highlight',
        'subtle',
        'band-very-low',
        'band-low',
        'band-medium',
        'band-high',
        'band-very-high',
      ],
    },
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

// v4.3 — five band variants for risk / status surfacing.
export const Bands: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Badge variant="band-very-low">Very low</Badge>
      <Badge variant="band-low">Low</Badge>
      <Badge variant="band-medium">Medium</Badge>
      <Badge variant="band-high">High</Badge>
      <Badge variant="band-very-high">Very high</Badge>
    </div>
  ),
};

export const BandWrapper: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <BandBadge band="very-low">Very low</BandBadge>
      <BandBadge band="low">Low</BandBadge>
      <BandBadge band="medium">Medium</BandBadge>
      <BandBadge band="high">High</BandBadge>
      <BandBadge band="very-high">Very high</BandBadge>
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
      <BandBadge band="very-low">Very low</BandBadge>
      <BandBadge band="low">Low</BandBadge>
      <BandBadge band="medium">Medium</BandBadge>
      <BandBadge band="high">High</BandBadge>
      <BandBadge band="very-high">Very high</BandBadge>
    </div>
  ),
};
