import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Pulls in the Style-Dictionary-generated tokens so every story renders
// with the real values, not Tailwind defaults. Path is the package's
// own dist output; the package is its own consumer here.
import '../dist/tokens.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'surface',
      values: [
        { name: 'surface',          value: 'var(--color-surface-default)' },
        { name: 'surface-subtle',   value: 'var(--color-surface-subtle)' },
        { name: 'surface-inverse',  value: 'var(--color-surface-inverse)' },
      ],
    },
    chromatic: {
      // Capture every story across every theme automatically.
      // Print is captured via @media query in a per-story decorator (§ A1).
      modes: {
        light: { theme: 'light' },
        dark:  { theme: 'dark' },
        hc:    { theme: 'hc' },
      },
    },
    layout: 'centered',
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark', hc: 'hc' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
