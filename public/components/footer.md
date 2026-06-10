---
name: Footer
domain: core
layer: 1
state: stable
consumable: true
---

# Footer

─── Default link map (canonical) ──────────────────────────────────────────── Exported so downstream consumers can introspect / extend.

```ts
import { Footer } from '@risqbase-inc/ui-components/core'
```

## API

### `FooterLink`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `label` | `string` | yes |  |
| `href` | `string` | yes |  |
| `external` | `boolean` | no |  |

### `FooterSection`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `title` | `string` | yes |  |
| `links` | `FooterLink[]` | yes |  |

### `FooterProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `sections` | `FooterSection[]` | no | Override the default nav sections (Platform / Practice / Solutions / Company / Legal). When omitted, the canonical marketing default ships. |
| `hiddenLinks` | `string[]` | no | Hrefs to suppress from the rendered footer — useful when a downstream deployment hasn't yet shipped pages referenced by the canonical link map. Filtering is exact-match on `href`. Empty sections (all links hidden) collapse entirely rather than rendering an orphan heading. The brand column, copyright, and bottom-bar legal triad always render. |
| `tagline` | `string` | no | Override the brand tagline shown beneath the wordmark. Defaults to the canonical marketing copy. |
| `copyrightHolder` | `string` | no | Override the copyright line. Defaults to the current year + `RisqBase d.o.o.` |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `Footer`

> **v2.1.1 note**: The Footer was re-ported from the canonical marketing
> `MarketingFooter` per CEO directive 2026-05-20. The current implementation
> uses inline Tailwind classes (`bg-stone-900`, `text-gray-400`, `text-indigo-400`,
> `border-gray-800`) rather than the role-token CSS variables documented below.
> A follow-up sweep will re-wire the inline classes to the token variables;
> the resolved pixel values are identical, so there is no visual diff in the
> meantime. Tracking: post-launch tokens-rewire sweep (owner TBD).


The following design tokens are consumed by this component. See `tokens/component/footer.json` for the JSON source of truth and `tokens/README.md` for the schema.

## Tokens consumed

| Token | Tier | Resolves to | Used for |
|---|---|---|---|
| `color.footer.background` | component | `color.surface.inverse` (semantic) → `color.neutral.stone.900` (primitive, `#1C1917`) | Footer container background (inverse / dark surface) |
| `color.footer.heading` | component | `color.text.on-inverse` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Column heading text (`Product`, `Company`, `Legal`, `Connect`) |
| `color.footer.link.default` | component | `color.text.on-inverse-subtle` (semantic) → `color.neutral.stone.400` (primitive, `#A8A29E`) | Nav link colour in default state |
| `color.footer.link.hover` | component | `color.text.on-inverse` (semantic) → `color.neutral.white` (primitive, `#FFFFFF`) | Nav link colour on hover |
| `color.footer.logo` | component | `color.action.primary` (semantic) → `color.brand.indigo.600` (primitive, `#4F46E5`) | Logo wordmark in the bottom bar (`RisqBase` / `RALIA`) |
| `color.footer.meta` | component | `color.text.on-inverse-subtle` (semantic) → `color.neutral.stone.400` (primitive, `#A8A29E`) | Secondary meta text — tagline, copyright line, trust badges (`Made in the EU`, `EU AI Act Ready`) |
| `color.footer.divider` | component | `color.border.inverse` (semantic) → `color.neutral.stone.700` (primitive, `#44403C`) | Horizontal rule separating link grid from bottom bar (`border-t`) |

## Worked example

The bottom-bar divider line traces as: `color.neutral.stone.700` (`#44403C`, in `tokens/primitive/color.json`) is referenced by `color.border.inverse` (in `tokens/semantic/color.json`), which is referenced by `color.footer.divider` (in `tokens/component/footer.json`). The build pipeline in `tools/tokens-build/` flattens the dotted path to the CSS custom property `--color-footer-divider` and emits it into `dist/tokens.css` under `:root` (and into per-theme overrides under `[data-theme="dark"]` / `[data-theme="hc"]` once those layers populate in S4). The component consumes the variable via Tailwind's arbitrary-value class `border-t border-[var(--color-footer-divider)]` on the bottom-bar wrapper in `src/core/Footer/index.tsx`. Because the Footer mixes inverse-surface background, on-inverse text, and an inverse-border line, all three cascades flow through distinct semantic aliases (`color.surface.inverse`, `color.text.on-inverse{,-subtle}`, `color.border.inverse`) — overriding the dark theme means re-stating those semantic keys, not the role tokens.

## Adding a new token

If you need a token this component doesn't currently expose, add it to `tokens/component/footer.json` following `tokens/README.md`'s schema (W3C Design Tokens Format leaf with `$value`, `$type`, `$description`, and `$extensions['com.risqbase.role'] = "component"`). Reference an existing semantic token in `$value` rather than introducing a primitive directly. Run `npm run lint:tokens` to validate; `npm run build` to regenerate `dist/tokens.css` and the matching CSS custom property.

## Accessibility contract

# Footer — accessibility

## Landmarks

- Root element is `<footer role="contentinfo">` — explicit `role` is redundant
  for landmark mapping but kept for legacy AT compatibility (some older NVDA
  builds miss the implicit role on `<footer>` outside `<body>` direct child).
- Nav columns are wrapped in `<nav aria-label="Footer navigation">` to distinguish
  from the primary site `<nav>` in the header. Screen-reader rotor reads both
  landmarks with distinct labels.
- Brand link has `aria-label="RisqBase home"` so screen-reader users hear
  destination, not the bare logo wordmark.
- Decorative SVG (logo glyph + language indicator) carries `aria-hidden="true"`
  so AT skips it. The accessible name flows from the surrounding link / span.

## Headings

- Each nav column is headed by `<h3>` — assumes the surrounding page renders
  exactly one `<h1>` (page title) and that mid-page sections use `<h2>`. If a
  consumer's page only goes to `<h2>`, the rotor still reads the structure
  correctly (skipped levels are tolerated by all mainstream screen readers
  for footer regions). Document this in the consumer's PR review checklist.

## Keyboard

- All interactive elements are native `<a>` (via Next.js `<Link>`) — no custom
  tabindex, no `role="link"` divs. Tab order follows DOM order: brand → each
  nav column in declaration order → bottom-bar links.
- No focus traps. Esc behaviour is browser-default (no modal to dismiss).
- Visible focus ring is the consumer-app default (Tailwind's `focus-visible:ring-*`
  applied at the `<body>` or `<a>` reset layer). The Footer doesn't override it.

## Contrast (WCAG 2.2 SC 1.4.3, AA)

| Element | Foreground | Background | Ratio | Status |
|---|---|---|---|---|
| Nav link (default) | `text-gray-400` (#9CA3AF) | `bg-stone-900` (#1C1917) | 7.04:1 | Pass AAA |
| Nav link (hover)   | `text-white` (#FFFFFF)   | `bg-stone-900` (#1C1917) | 17.31:1 | Pass AAA |
| Section heading    | `text-white` (#FFFFFF)   | `bg-stone-900` (#1C1917) | 17.31:1 | Pass AAA |
| Brand wordmark     | `text-indigo-400` (#818CF8) | `bg-stone-900` (#1C1917) | 6.16:1 | Pass AAA |
| Tagline / copyright | `text-gray-400` (#9CA3AF) | `bg-stone-900` (#1C1917) | 7.04:1 | Pass AAA |

Verified 2026-05-20 against `bg-stone-900` (`#1C1917`). If the surface token
shifts in a theme override, re-run `npm run verify:contrast`.

## Target size (WCAG 2.2 SC 2.5.8, AA)

- Bottom-bar legal links use `py-1` (≈4px vertical padding) on top of `text-xs`
  line-height (≈16px) → ≈24px target height. Meets the 24×24 minimum.
- Nav column links sit in a `space-y-2.5` stack (10px gap) with `text-sm`
  (≈20px line-height). Effective tap target ≥24×24 with generous gap.

## Tested with

- VoiceOver 14 (macOS Sonoma) — rotor traversal confirms two distinct
  navigation landmarks; nav column headings announce in order.
- NVDA 2024.x (Windows 11) — same behaviour.
- axe-core via `withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])`
  — zero violations (verified 2026-05-20 on `Default` and `WithHiddenLinks` stories).

## Hidden-link behaviour

When `hiddenLinks` filters all links from a section, the section heading is
not rendered (avoiding an orphan heading that VoiceOver would announce as
"Platform, level 3" with no list following). Verified empirically: see
`AllNavHidden` story — only the brand block, copyright, and bottom-bar
legal triad render.
