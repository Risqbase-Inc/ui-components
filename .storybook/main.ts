import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'node:path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-themes',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: 'tag' },
  typescript: { check: false, reactDocgen: 'react-docgen-typescript' },
  viteFinal: async (vite) =>
    mergeConfig(vite, {
      resolve: {
        alias: {
          // Header + Footer import `next/link`; Storybook runs without a
          // Next.js app, so alias to a tiny shim that renders a plain <a>.
          // Mirrors what Next emits at runtime when no app router is present.
          'next/link': path.resolve(__dirname, 'next-link-shim.tsx'),
        },
      },
    }),
};

export default config;
