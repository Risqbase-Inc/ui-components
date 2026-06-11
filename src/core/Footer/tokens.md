# Tokens — `Footer`

> **v4.4 brand-mark PR-A note**: the v2.1.1 raw-class port (`bg-stone-900`,
> `text-gray-400`, `text-indigo-400`, `border-gray-800`) and the inline
> Helvetica `<text>` mark are gone — every colour now flows through the
> `color.footer.*` role tokens below, and the mark is the frozen brand-mark
> v3 outline (geometry identical to `public/mark.svg`), themed via
> `currentColor`. Visual deltas vs v2.1.1 are deliberate: rev. A1 logo tint
> (indigo-400 → indigo-300 on the inverse surface) and the AAA bump on
> meta/link text (stone-400 → stone-300).


The following design tokens are consumed by this component. See `tokens/component/footer.json` for the JSON source of truth and `tokens/README.md` for the schema.

## Tokens consumed

| Token | Tier | Resolves to | Used for |
|---|---|---|---|
| `color.footer.background` | component | `color.surface.inverse` (semantic) → `color.neutral.stone.900` (primitive, `#1C1917`) | Footer container background (inverse / dark surface) |
| `color.footer.heading` | component | `color.text.on-inverse` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Column heading text (`Product`, `Company`, `Legal`, `Connect`) |
| `color.footer.link.default` | component | `color.neutral.stone.300` (primitive, `#D6D3D1`, ≈11.7:1 — AAA bump; dark theme re-aliases `color.text.on-inverse-subtle`) | Nav link colour in default state |
| `color.footer.link.hover` | component | `color.text.on-inverse` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Nav link colour on hover |
| `color.footer.logo` | component | `color.brand.mark-on-inverse` (semantic, rev. A1) → `color.brand.indigo.300` (`#A5B4FC`) light / `color.brand.indigo.700` (`#4338CA`) dark | Brand mark glyph + wordmark (`RisqBase` / `RALIA`) |
| `color.footer.meta` | component | `color.neutral.stone.300` (primitive, `#D6D3D1`, ≈11.7:1 — AAA bump; dark theme re-aliases `color.text.on-inverse-subtle`) | Secondary meta text — tagline, copyright line, trust badges (`Made in the EU`, `EU AI Act Ready`) |
| `color.footer.divider` | component | `color.border.inverse` (semantic) → `color.neutral.stone.700` (primitive, `#44403C`) | Horizontal rule separating link grid from bottom bar (`border-t`) |

## Worked example

The bottom-bar divider line traces as: `color.neutral.stone.700` (`#44403C`, in `tokens/primitive/color.json`) is referenced by `color.border.inverse` (in `tokens/semantic/color.json`), which is referenced by `color.footer.divider` (in `tokens/component/footer.json`). The build pipeline in `tools/tokens-build/` flattens the dotted path to the CSS custom property `--color-footer-divider` and emits it into `dist/tokens.css` under `:root` (and into per-theme overrides under `[data-theme="dark"]` / `[data-theme="hc"]` once those layers populate in S4). The component consumes the variable via Tailwind's arbitrary-value class `border-t border-[var(--color-footer-divider)]` on the bottom-bar wrapper in `src/core/Footer/index.tsx`. Because the Footer mixes inverse-surface background, on-inverse text, and an inverse-border line, all three cascades flow through distinct semantic aliases (`color.surface.inverse`, `color.text.on-inverse{,-subtle}`, `color.border.inverse`) — overriding the dark theme means re-stating those semantic keys, not the role tokens.

## Adding a new token

If you need a token this component doesn't currently expose, add it to `tokens/component/footer.json` following `tokens/README.md`'s schema (W3C Design Tokens Format leaf with `$value`, `$type`, `$description`, and `$extensions['com.risqbase.role'] = "component"`). Reference an existing semantic token in `$value` rather than introducing a primitive directly. Run `npm run lint:tokens` to validate; `npm run build` to regenerate `dist/tokens.css` and the matching CSS custom property.
