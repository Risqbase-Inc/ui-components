---
name: IconButton
domain: core
layer: 1
state: stable
consumable: true
---

# IconButton

Hit target is always ≥ 24×24 regardless of the visual icon size — the `sm` variant pads a 16px glyph out to a 24×24 button, satisfying WCAG 2.5.8 by construction. v4.3 §5.1, closes RALIA F-015 / F-028 / F-037 / F-050.

```ts
import { IconButton } from '@risqbase-inc/ui-components/core'
```

## API

- `type IconButtonVariant = 'ghost' | 'primary' | 'secondary'`
- `type IconButtonSize = 'sm' | 'md' | 'lg'`
### `IconButtonProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `icon` | `ReactNode` | yes | Required: SVG / icon node rendered inside the button. |
| `aria-label` | `string` | yes | Required: accessible name. There is no visible text. |
| `variant` | `IconButtonVariant` | no |  |
| `size` | `IconButtonSize` | no |  |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `IconButton`

| Token | Tier | Used for |
|---|---|---|
| `color.text.default` | semantic | `ghost` foreground |
| `color.surface.muted` | semantic | `ghost` hover background |
| `color.button.primary.background.default` | component | `primary` background |
| `color.button.secondary.background.default` | component | `secondary` background |
| `color.border.focus` | semantic | focus ring (via `--color-button-focus-ring`) |
| `dimension.radius.md` | primitive | corner radius (8px) |

Pixel sizes: `sm` 24×24 · `md` 32×32 · `lg` 40×40 — hard-coded in component (hit-target floor is the contract, not a token).

## Accessibility contract

# IconButton — accessibility

A button without visible text. The consumer **must** pass `aria-label` describing the action (typed in the props as required).

## Contracts
- Hit target ≥ 24×24 in all sizes (WCAG 2.5.8 Target Size — Minimum, AA). The `sm` variant ships a 16px glyph inside a 24×24 hit target; the 16px figure is purely visual.
- Keyboard: native `<button>` element — Space/Enter activate; Tab order follows DOM.
- Focus ring: 2px `--color-border-focus` with 2px offset against `--color-surface-default`.
- Disabled: visual opacity-50, pointer-events disabled, but the element stays in the tab order with `aria-disabled` if used; prefer omitting from tab order entirely by removing the action.

## Don't
- Don't wrap a plain `<button>` around a `<svg>` and call it an icon button. Always import this primitive — closes RALIA F-028 (icon-only checkboxes shipped without a hit-target audit).
- Don't use `title` as the primary accessible name on touch devices — `aria-label` is required.
