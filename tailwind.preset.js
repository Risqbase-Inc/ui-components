// Generated tokens — emitted by `npm run build:tokens` from
// /tokens/**/*.json. If `dist/tailwind-tokens.js` doesn't exist yet
// (e.g. before the first build) we fall back to empty maps so consumer
// Tailwind builds keep resolving to the legacy `brand.*` values below.
let generated
try {
  // eslint-disable-next-line global-require
  generated = require('./dist/tailwind-tokens.js')
} catch (err) {
  generated = { colors: {}, spacing: {}, borderRadius: {}, transitionDuration: {} }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Generated colour palette keyed by hyphenated token path
        // (e.g. `text-brand-indigo-600`, `bg-action-primary`). Resolved
        // light values; dark/HC override at runtime via `data-theme`.
        ...generated.colors,
        // Legacy alias retained for v1.x consumer code that uses
        // `text-brand-600` / `bg-brand-100` etc. Soft-deprecated in v2.0;
        // removal scheduled for v3.0 once consumer migrations complete.
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
      },
      spacing: { ...generated.spacing },
      borderRadius: { ...generated.borderRadius },
      transitionDuration: { ...generated.transitionDuration },
      fontFamily: {
        // Geist Sans is the canonical primary font per v4.3 §4.5; Inter
        // stack remains as the fallback chain for environments where the
        // Geist face hasn't loaded yet.
        sans: [
          'Geist',
          'Geist Sans',
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['Geist Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      keyframes: {
        // v4.3 — animations needed by core primitives. Each respects
        // `prefers-reduced-motion: reduce` via the consumer's Tailwind
        // config (set `motion-reduce:animate-none` on the consuming
        // element).
        'skeleton-shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'streamhead-blink': {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
        'iris-thinking-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'iris-thinking-rotate-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'iris-thinking-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        // v4.4 Workstream E — Toast entrance; gated in-component via
        // useReducedMotion() plus `motion-reduce:animate-none` fallback.
        'toast-enter': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'skeleton-shimmer': 'skeleton-shimmer 1.4s linear infinite',
        'streamhead-blink': 'streamhead-blink 1s steps(2) infinite',
        'toast-enter': 'toast-enter 200ms ease-out',
      },
    },
  },
  plugins: [],
}
