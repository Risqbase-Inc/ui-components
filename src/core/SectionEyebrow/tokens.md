# Tokens — `SectionEyebrow`

The following design tokens are consumed by this component. See `tokens/component/section-eyebrow.json` for the JSON source of truth and `tokens/README.md` for the schema.

## Tokens consumed

| Token | Tier | Resolves to | Used for |
|---|---|---|---|
| `color.section-eyebrow.foreground` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Text colour of the eyebrow label (uppercase, tracked, sits above section headings) |

## Worked example

`SectionEyebrow` consumes a single role token. It traces as: `color.brand.indigo.600` (`#4F46E5`, in `tokens/primitive/color.json`) is referenced by `color.action.primary` (in `tokens/semantic/color.json`), which is referenced by `color.section-eyebrow.foreground` (in `tokens/component/section-eyebrow.json`). The build pipeline in `tools/tokens-build/` flattens the dotted path to the CSS custom property `--color-section-eyebrow-foreground` and emits it into `dist/tokens.css` under `:root` (and into per-theme overrides under `[data-theme="dark"]` / `[data-theme="hc"]` once those layers populate in S4). The component consumes that variable via Tailwind's arbitrary-value class `text-[var(--color-section-eyebrow-foreground)]` on the `<p>` element in `src/core/SectionEyebrow/index.tsx`. Because the eyebrow has no background or border, the brand-colour cascade is the only visual state to override per theme.

## Adding a new token

If you need a token this component doesn't currently expose, add it to `tokens/component/section-eyebrow.json` following `tokens/README.md`'s schema (W3C Design Tokens Format leaf with `$value`, `$type`, `$description`, and `$extensions['com.risqbase.role'] = "component"`). Reference an existing semantic token in `$value` rather than introducing a primitive directly. Run `npm run lint:tokens` to validate; `npm run build` to regenerate `dist/tokens.css` and the matching CSS custom property.
