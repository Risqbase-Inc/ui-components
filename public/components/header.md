---
name: Header
domain: core
layer: 1
state: stable
consumable: true
---

# Header

Header is purely presentational: no useState, no useEffect, no useRef, no browser APIs in this file. The v2.1.0 dropdown additions live in `./NavDropdown.tsx` (a 'use client' island gated to the dropdown sub-tree only) and in `./NavDropdownContext.tsx` (also client). The surrounding chrome stays server-rendered per Spec 07 §2.3 + cover §2.3. Re-add 'use client' to this file ONLY if a future change introduces client behaviour to the chrome itself.

```ts
import { Header } from '@risqbase-inc/ui-components/core'
```

## API

- `type SiteVariant = 'risqbase' | 'ralia'`
### `NavLink`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `label` | `string` | yes |  |
| `href` | `string` | yes |  |

### `NavGroup`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `label` | `string` | yes |  |
| `items` | `NavLink[]` | yes | When present, the nav entry becomes a click-toggle disclosure. |
| `eyebrow` | `string` | no | Optional eyebrow rendered above the dropdown panel (e.g. "PLATFORM"). |

- `type NavEntry = NavLink | NavGroup`
### `HeaderProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `variant` | `SiteVariant` | no |  |
| `showLaunchDate` | `boolean` | no |  |
| `navEntries` | `NavEntry[]` | no | Override nav entries; default is the variant's canonical set (back-compat). |
| `currentPath` | `string` | no | Current pathname for aria-current matching. When omitted, no link receives `aria-current="page"`. Pass explicitly from `usePathname()` in Next.js apps so the Header itself stays server-renderable. |


Composes with: TelemetryBeacon

## Token chain

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

## Accessibility contract

# Header — accessibility

Header includes the `<header>` landmark, an accessible logo (text wordmark), visible focus rings on all nav links and CTAs (§5.8.1), and a skip-link target downstream (§5.8.2). The v2.1.0 dropdown additions follow the ARIA **disclosure** pattern — NOT the menu pattern (Spec 07-a11y §1).

## Disclosure pattern (v2.1.0)

When a nav entry is a `NavGroup` (has `items`), the trigger renders as a `<button type="button">` with `aria-expanded` and `aria-controls`. The panel is a `<div>` of `<a>` links (`role="list"` + `<li><a>`).

- `<a>` links use native Tab traversal — no roving tabindex.
- ESC closes + restores focus to the trigger.
- Outside-click closes (via `mousedown` listener — see Spec 07-a11y §3 for the race-condition rationale).
- Single-open invariant via `HeaderDropdownProvider` context (Spec 07-a11y §4): opening one closes any other.

## aria-current

- `currentPath` prop drives matching via `isCurrentPath` (`src/core/Header/lib/isCurrent.ts`).
- A link's exact-match OR `currentPath.startsWith('${href}/')` triggers `aria-current="page"` (parent-of-current convention).
- For a `NavGroup`, the trigger gets `aria-current="page"` whenever any child matches.
- External URLs (`https://…`) never match.
- `href="/"` matches only the exact root.

## Reduced motion

The dropdown panel fade-in (120ms, opacity + translateY) is suppressed under `prefers-reduced-motion: reduce` via CSS only. No JS coupling — works for users who toggle the system preference mid-session.

## ESC propagation

ESC on a dropdown calls `e.stopPropagation()` so it does not bubble into sibling modal-close handlers. If the Header sits inside a modal, dropdown closes first; subsequent ESC closes the modal.

## Test plan (Sarah G5)

1. **axe-core** clean on every story.
2. **Keyboard walkthrough** via `KeyboardWalkthrough` story: trigger announces "Platform, button, collapsed" → Enter expands → Tab → first link focused → Shift+Tab → trigger.
3. **VoiceOver / NVDA** confirms aria-current announces "current page" on the active link AND on the dropdown trigger when a child matches.
4. **Outside-click** closes.
5. **ESC** closes + focus on trigger.
6. **Single-open** via `WithMultipleDropdowns`.
7. **Reduced-motion** via `DropdownReducedMotion` + `KeyboardWalkthroughReducedMotion`.
8. **Path-prefix matching** via `DropdownWithCurrentChild` (`currentPath='/platform/horizon-iris'`; both the `/platform` trigger and the `/platform/horizon-iris` item carry `aria-current="page"`).
