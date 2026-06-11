---
group: color-brand
count: 13
---

# Tokens — `color-brand.*`

| Token | Tier | Type | Light | Dark | Description |
|---|---|---|---|---|---|
| `color.brand.indigo.50` (`--color-brand-indigo-50`) | primitive | color | `#eef2ff` | `#eef2ff` | Brand indigo, lightest tint |
| `color.brand.indigo.100` (`--color-brand-indigo-100`) | primitive | color | `#e0e7ff` | `#e0e7ff` | Brand indigo, very light |
| `color.brand.indigo.200` (`--color-brand-indigo-200`) | primitive | color | `#c7d2fe` | `#c7d2fe` | Brand indigo, light |
| `color.brand.indigo.300` (`--color-brand-indigo-300`) | primitive | color | `#a5b4fc` | `#a5b4fc` | Brand indigo, soft |
| `color.brand.indigo.400` (`--color-brand-indigo-400`) | primitive | color | `#818cf8` | `#818cf8` | Brand indigo, mid-light |
| `color.brand.indigo.500` (`--color-brand-indigo-500`) | primitive | color | `#6366f1` | `#6366f1` | Brand indigo, mid |
| `color.brand.indigo.600` (`--color-brand-indigo-600`) | primitive | color | `#4f46e5` | `#4f46e5` | Primary brand indigo — CTAs, links (brand mark uses color.brand.mark as of rev. A1) |
| `color.brand.indigo.700` (`--color-brand-indigo-700`) | primitive | color | `#4338ca` | `#4338ca` | Brand indigo, hover/pressed |
| `color.brand.indigo.800` (`--color-brand-indigo-800`) | primitive | color | `#3730a3` | `#3730a3` | Brand indigo, dark |
| `color.brand.indigo.900` (`--color-brand-indigo-900`) | primitive | color | `#312e81` | `#312e81` | Brand indigo, very dark |
| `color.brand.indigo.950` (`--color-brand-indigo-950`) | primitive | color | `#1e1b4b` | `#1e1b4b` | Brand indigo, near-black |
| `color.brand.mark` (`--color-brand-mark`) | semantic | color | `#4338ca` | `#a5b4fc` | Brand mark tint on default surfaces (rev. A1 v1.1, 2026-06-11 — A1 is surface-relative: indigo-700 on light surfaces, indigo-300 on dark, whatever the theme). Deliberately diverges from color.action.primary; see brand-mark v3 hand-off. Inverse surfaces take brand.mark-on-inverse |
| `color.brand.mark-on-inverse` (`--color-brand-mark-on-inverse`) | semantic | color | `#a5b4fc` | `#4338ca` | Brand mark tint on inverse surfaces (rev. A1 v1.1 — RATIONALE-ADDENDUM §11): A1 is surface-relative and inverse surfaces flip per theme, so this is brand.mark's mirror: indigo-300 light / indigo-700 dark. Used by the Footer (stone-900 in light, near-white in dark) |
