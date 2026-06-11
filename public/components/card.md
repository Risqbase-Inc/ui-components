---
name: Card
domain: core
layer: 1
state: stable
consumable: true
---

# Card

Default radius is 16px (= `--dimension-radius-card-default`, = `dimension.radius.xl`), per v4.3 §4.4. Replaces ad-hoc `rounded-2xl border` patterns at consumer sites — scanner rule R7 enforces component import. Closes RALIA F-060.

```ts
import { Card } from '@risqbase-inc/ui-components/core'
```

## API

- `type CardVariant = 'default' | 'subtle' | 'inverse'`
- `type CardPadding = 'none' | 'sm' | 'md' | 'lg'`
### `CardProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `variant` | `CardVariant` | no |  |
| `padding` | `CardPadding` | no |  |
| `children` | `ReactNode` | yes |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `Card`

| Token | Tier | Resolves to | Used for |
|---|---|---|---|
| `color.card.background-default` | component | `color.surface.default` → white | `default` variant background |
| `color.card.background-subtle` | component | `color.surface.subtle` → stone-50 | `subtle` variant background |
| `color.card.background-inverse` | component | `color.surface.inverse` → stone-900 | `inverse` variant background |
| `color.card.border-default` | component | `color.border.default` → stone-200 | border on all variants except `inverse` |
| `dimension.radius.card.default` | component | `dimension.radius.xl` → 16px | corner radius (v4.3 §4.4) |

## Accessibility contract

# Card — accessibility

Card is a non-interactive presentational container. It does not add ARIA roles by default; the consumer composes the semantics.

## Contracts
- If a card is the entire activation target (e.g. clickable summary card), wrap or replace it with a `<button>` / `<a>` — don't add `onClick` to the `<div>`.
- If a card contains a heading, place the heading as the first child so screen-reader users land on a meaningful label.
- Sufficient contrast between `--color-card-background-*` and `--color-text-default` is verified by tokens (see `tokens.md`).
