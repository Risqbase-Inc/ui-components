---
name: SkipLink
domain: core
layer: 1
state: stable
consumable: true
---

# SkipLink

Visually hidden until focused. First focusable element in the App shell — keyboard / screen-reader users tab once to reveal it, then Enter to jump past navigation to the main landmark. v4.3 §5.1, closes RALIA F-053 + WCAG 2.4.1 Bypass Blocks.

```ts
import { SkipLink } from '@risqbase-inc/ui-components/core'
```

## API

### `SkipLinkProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `target` | `string` | yes | Selector for the focus target (e.g. `#main-content`). |
| `children` | `ReactNode` | no | Visible label — defaults to "Skip to main content". |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `SkipLink`

| Token | Used for |
|---|---|
| `color.action.primary` | revealed background |
| `color.text.on-action` | revealed foreground |
| `color.border.focus` | focus ring |
| `dimension.radius.md` | corner radius |

The hidden state uses Tailwind's `sr-only` utility (zero-pixel clip-path); no token bound, since the surface is invisible by design.

## Accessibility contract

# SkipLink — accessibility

Satisfies WCAG 2.4.1 Bypass Blocks (A). Mount as the first focusable element inside the App shell, immediately after `<body>` opens.

## Contracts
- Hidden from sighted-mouse users via `sr-only`; revealed on `:focus` via `not-sr-only` + fixed positioning so it overlays the page chrome.
- `href` points to a real focus target — the consumer must set `tabIndex={-1}` on a containing element (e.g. `<main id="main-content" tabIndex={-1}>`) so Enter moves keyboard focus, not just the viewport.
- Focus ring inherits from `--color-border-focus`.

## Pair with
- `<main id="main-content" tabIndex={-1}>` — the destination must accept programmatic focus.
