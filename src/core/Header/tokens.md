# Tokens — `Header`

The following design tokens are consumed by this component. See `tokens/component/header.json` for the JSON source of truth and `tokens/README.md` for the schema.

## Tokens consumed

| Token | Tier | Resolves to | Used for |
|---|---|---|---|
| `color.header.background` | component | `color.surface.default` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Header bar background |
| `color.header.border` | component | `color.border.subtle` (semantic) → `color.neutral.stone.100` (primitive, `#F5F5F4`) | Header bottom rule (`border-b`) |
| `color.header.logo` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Logo wordmark text colour (`RisqBase` / `RALIA`) |
| `color.header.tagline` | component | `color.text.subtle` (semantic) → `color.neutral.stone.500` (primitive, `#78716C`) | Secondary tagline text (e.g. `by RisqBase` on RALIA variant) |
| `color.header.nav-link.default` | component | `color.text.subtle` (semantic) → `color.neutral.stone.500` (primitive, `#78716C`) | Nav link colour in default state (also reused by Sign In / Log in link) |
| `color.header.nav-link.hover` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Nav link colour on hover |
| `color.header.cta.background.default` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Right-side CTA button background in default state |
| `color.header.cta.background.hover` | component | `color.action.primary-hover` (semantic) → `color.brand.indigo.700` (primitive, `#4338CA`) | Right-side CTA button background on hover |
| `color.header.cta.foreground` | component | `color.text.on-action` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Right-side CTA button text colour |
| `color.header.launch-date` | component | `color.text.subtle` (semantic) → `color.neutral.stone.500` (primitive, `#78716C`) | Launch-date label text (visible when `showLaunchDate` is true) |

## Worked example

The header bottom border traces as: `color.neutral.stone.100` (`#F5F5F4`, in `tokens/primitive/color.json`) is referenced by `color.border.subtle` (in `tokens/semantic/color.json`), which is referenced by `color.header.border` (in `tokens/component/header.json`). The build pipeline in `tools/tokens-build/` flattens the dotted path to the CSS custom property `--color-header-border` and emits it into `dist/tokens.css` under `:root` (and into per-theme overrides under `[data-theme="dark"]` / `[data-theme="hc"]` once those layers populate in S4). The component consumes the variable via Tailwind's arbitrary-value class `border-b border-[var(--color-header-border)]` on the `<header>` element in `src/core/Header/index.tsx`. Swapping the primitive (e.g. tightening the neutral palette) cascades to every consumer of the role token without touching component code.

## Adding a new token

If you need a token this component doesn't currently expose, add it to `tokens/component/header.json` following `tokens/README.md`'s schema (W3C Design Tokens Format leaf with `$value`, `$type`, `$description`, and `$extensions['com.risqbase.role'] = "component"`). Reference an existing semantic token in `$value` rather than introducing a primitive directly. Run `npm run lint:tokens` to validate; `npm run build` to regenerate `dist/tokens.css` and the matching CSS custom property.
