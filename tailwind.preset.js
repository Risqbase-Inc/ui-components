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
        // `text-brand-600` / `bg-brand-100` etc. Drops in v2.0.
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
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
