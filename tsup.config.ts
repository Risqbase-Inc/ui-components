import { defineConfig } from 'tsup'

// Multi-entry build per spec §22.2 — one entrypoint per domain so
// consumers can `import { Button } from '@risqbase-inc/ui-components/core'`
// (or any other domain) and tree-shake the rest.
//
// `src/index.ts` remains the v1.x back-compat root barrel.
// `src/primitives/` is intentionally absent: it is internal-only.

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'core/index': 'src/core/index.ts',
    'ai/index': 'src/ai/index.ts',
    'data-viz/index': 'src/data-viz/index.ts',
    'marketing/index': 'src/marketing/index.ts',
    'content/index': 'src/content/index.ts',
    'tokens/index': 'src/tokens/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  outDir: 'dist',
  sourcemap: false,
  // `clean: false` because `npm run build` runs `build:tokens` first
  // (which writes `dist/tokens.css`, `dist/tailwind-tokens.js` and
  // `dist/figma-tokens.json`); a cleaning tsup would wipe them.
  // The token build itself recreates `dist/` before writing.
  clean: false,
  splitting: false,
  external: ['react', 'react-dom', 'next', 'next/link'],
})
