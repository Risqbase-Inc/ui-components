import type { Preview } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Tailwind utilities first (consumer parity — v4.4 A11Y-FIX; without
// them every `text-[var(--…)]` class is unstyled and axe audits
// browser-default colors), then the Style-Dictionary-generated tokens so
// the central motion/forced-colors rules win order ties.
import './tailwind.css';
import '../dist/tokens.css';

const preview: Preview = {
  parameters: {
    // A11Y-FIX: axe's `region` rule ("all content contained by landmarks")
    // is a PAGE-level requirement — component stories are fragments, not
    // pages, so it fires on every story canvas regardless of component
    // quality (475 of the 668 post-fix nodes in the local sweep). Landmark
    // completeness is audited at product-page level (RALIA/marketing
    // scanners); the landmark-duplication rules stay enabled.
    a11y: { config: { rules: [{ id: 'region', enabled: false }] } },
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
