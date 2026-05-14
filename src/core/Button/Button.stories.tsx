import type { Meta, StoryObj } from '@storybook/react';
import { Button, PrimaryButton, SecondaryButton, GhostButton } from './';

const meta: Meta<typeof Button> = {
  title: 'Core / Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    children: { control: 'text' },
  },
  args: { children: 'Sign up', variant: 'primary', size: 'md' },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <PrimaryButton>Sign up</PrimaryButton>
      <SecondaryButton>Cancel</SecondaryButton>
      <GhostButton>Skip</GhostButton>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Default</Button>
      <Button variant="primary" className="hover">Hover (forced)</Button>
      <Button variant="primary" className="focus-visible">Focus (forced)</Button>
      <Button variant="primary" disabled>Disabled</Button>
    </div>
  ),
  // Force pseudo states via Chromatic's pseudo-class capture
  parameters: { pseudo: { hover: '.hover', focusVisible: '.focus-visible' } },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

// Print snapshot - applies @media print at capture time
export const Gallery: Story = {
  parameters: {
    chromatic: { modes: { print: { media: 'print' } } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, 1fr)' }}>
      <PrimaryButton>Primary</PrimaryButton>
      <SecondaryButton>Secondary</SecondaryButton>
      <GhostButton>Ghost</GhostButton>
    </div>
  ),
};
