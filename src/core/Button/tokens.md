# Tokens — `Button`

The following design tokens are consumed by this component. See `tokens/component/button.json` for the JSON source of truth and `tokens/README.md` for the schema.

## Tokens consumed

| Token | Tier | Resolves to | Used for |
|---|---|---|---|
| `color.button.primary.background.default` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Background of `primary` variant in default state |
| `color.button.primary.background.hover` | component | `color.action.primary-hover` (semantic) → `color.brand.indigo.700` (primitive, `#4338CA`) | Background of `primary` variant on hover |
| `color.button.primary.foreground.default` | component | `color.text.on-action` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Text colour of `primary` variant |
| `color.button.secondary.background.default` | component | `color.surface.default` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Background of `secondary` variant in default state |
| `color.button.secondary.background.hover` | component | `color.action.primary-subtle` (semantic) → `color.brand.indigo.100` (primitive, `#E0E7FF`) | Background of `secondary` variant on hover |
| `color.button.secondary.foreground.default` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Text colour of `secondary` variant |
| `color.button.secondary.border.default` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Border colour of `secondary` variant |
| `color.button.ghost.background.default` | component | `transparent` (literal) | Background of `ghost` variant in default state |
| `color.button.ghost.background.hover` | component | `color.action.primary-subtle` (semantic) → `color.brand.indigo.100` (primitive, `#E0E7FF`) | Background of `ghost` variant on hover |
| `color.button.ghost.foreground.default` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Text colour of `ghost` variant |
| `color.button.focus-ring` | component | `color.border.focus` (semantic) → `color.brand.indigo.500` (primitive, `#6366F1`) | Focus-ring colour for all variants (applied via `focus:ring-*`) |

## Worked example

The hover background of the `primary` variant traces as: `color.brand.indigo.700` (`#4338CA`, in `tokens/primitive/color.json`) is referenced by `color.action.primary-hover` (in `tokens/semantic/color.json`), which is referenced by `color.button.primary.background.hover` (in `tokens/component/button.json`). The build pipeline in `tools/tokens-build/` flattens the dotted path to the CSS custom property `--color-button-primary-background-hover` and emits it into `dist/tokens.css` under `:root` (and into per-theme overrides under `[data-theme="dark"]` / `[data-theme="hc"]` once those layers populate in S4). The component consumes that variable via Tailwind's arbitrary-value class `hover:bg-[var(--color-button-primary-background-hover)]` in `src/core/Button/index.tsx`. Swapping the primitive (e.g. a brand refresh) cascades to every consumer of the role token without touching component code.

## Adding a new token

If you need a token this component doesn't currently expose, add it to `tokens/component/button.json` following `tokens/README.md`'s schema (W3C Design Tokens Format leaf with `$value`, `$type`, `$description`, and `$extensions['com.risqbase.role'] = "component"`). Reference an existing semantic token in `$value` rather than introducing a primitive directly. Run `npm run lint:tokens` to validate; `npm run build` to regenerate `dist/tokens.css` and the matching CSS custom property.
