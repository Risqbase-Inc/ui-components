# Tokens — `Badge`

The following design tokens are consumed by this component. See `tokens/component/badge.json` for the JSON source of truth and `tokens/README.md` for the schema.

## Tokens consumed

| Token | Tier | Resolves to | Used for |
|---|---|---|---|
| `color.badge.default.background` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Background of `default` variant — used by `MostPopularBadge`, `NewBadge` |
| `color.badge.default.foreground` | component | `color.text.on-action` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Text colour of `default` variant |
| `color.badge.highlight.background` | component | `color.action.primary-subtle` (semantic) → `color.brand.indigo.100` (primitive, `#E0E7FF`) | Background of `highlight` variant — used by `StandaloneProductBadge` |
| `color.badge.highlight.foreground` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Text and icon stroke colour of `highlight` variant |
| `color.badge.subtle.background` | component | `color.surface.muted` (semantic) → `color.neutral.stone.100` (primitive, `#F5F5F4`) | Background of `subtle` variant — used by `ComingSoonBadge` |
| `color.badge.subtle.foreground` | component | `color.text.subtle` (semantic) → `color.neutral.stone.500` (primitive, `#78716C`) | Text colour of `subtle` variant |

## Worked example

The text colour of the `highlight` variant traces as: `color.brand.indigo.600` (`#4F46E5`, in `tokens/primitive/color.json`) is referenced by `color.action.primary` (in `tokens/semantic/color.json`), which is referenced by `color.badge.highlight.foreground` (in `tokens/component/badge.json`). The build pipeline in `tools/tokens-build/` flattens the dotted path to the CSS custom property `--color-badge-highlight-foreground` and emits it into `dist/tokens.css` under `:root` (and into per-theme overrides under `[data-theme="dark"]` / `[data-theme="hc"]` once those layers populate in S4). The component consumes the variable via Tailwind's arbitrary-value class `text-[var(--color-badge-highlight-foreground)]` in `src/core/Badge/index.tsx`. Because `currentColor` is inherited by the inline SVG (`<svg stroke="currentColor">` inside `StandaloneProductBadge`), the same token paints both the text and the icon stroke in a single declaration.

## Adding a new token

If you need a token this component doesn't currently expose, add it to `tokens/component/badge.json` following `tokens/README.md`'s schema (W3C Design Tokens Format leaf with `$value`, `$type`, `$description`, and `$extensions['com.risqbase.role'] = "component"`). Reference an existing semantic token in `$value` rather than introducing a primitive directly. Run `npm run lint:tokens` to validate; `npm run build` to regenerate `dist/tokens.css` and the matching CSS custom property.
