// Storybook/Chromatic Tailwind build — v4.4 A11Y-FIX reconciliation.
//
// The a11y probes against Chromatic build 6a1c1e6f exposed that this
// Storybook never had a Tailwind pipeline: every `text-[var(--…)]` token
// class and palette utility was unstyled, so axe was auditing
// browser-default black text against the theme canvas (the real source
// of ~93% of the 1,344 reported violations). Consumers run Tailwind with
// this same preset — the Storybook build now mirrors that contract.
module.exports = {
  presets: [require('./tailwind.preset.js')],
  content: ['./src/**/*.{ts,tsx}', './.storybook/**/*.{ts,tsx}'],
}
