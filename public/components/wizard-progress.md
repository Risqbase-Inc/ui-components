---
name: WizardProgress
domain: core
layer: 1
state: stable
consumable: true
---

# WizardProgress

Auto-selects style by step count, per v4.3 §5.1: dots (≤ 4) — quick visual numbered (5–8) — explicit step number vertical (> 8) — long flows; horizontal bar would crush labels percentage — opt-in for conversational / unknown total Closes RALIA F-010.

```ts
import { WizardProgress } from '@risqbase-inc/ui-components/core'
```

## API

- `type WizardProgressStyle = 'dots' | 'numbered' | 'vertical' | 'percentage'`
### `WizardStep`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | yes |  |
| `label` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |

### `WizardProgressProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `steps` | `WizardStep[]` | yes |  |
| `current` | `number` | yes | 0-indexed current step. |
| `style` | `WizardProgressStyle` | no | Force a style — otherwise auto-selected by step count (§5.1). |
| `percent` | `number` | no | For `percentage` style only. |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `WizardProgress`

| Token | Used for |
|---|---|
| `color.action.primary` | active / complete step background |
| `color.text.on-action` | active / complete step glyph |
| `color.surface.muted` | upcoming step background, percentage track |
| `color.text.subtle` | upcoming step glyph, vertical-style upcoming label |
| `color.text.default` | vertical-style active label |
| `color.border.default` | connector line between dots |
| `color.iris.accent-subtle` | focus halo on active step (closes RALIA F-049) |

Step dot is 24×24 (`w-6 h-6`); meets WCAG 2.5.8 hit-target floor.

## Accessibility contract

# WizardProgress — accessibility

## Contracts
- Renders as an `<ol>` for the `dots` / `numbered` / `vertical` styles, with `aria-current="step"` on the active item — the canonical pattern from WAI-ARIA APG.
- Renders as `role="progressbar"` for the `percentage` style with `aria-valuenow` / `aria-valuemin` / `aria-valuemax`.
- The numeric / check glyph is `aria-hidden="true"` — the step label carries the meaning.
- Auto-style picker: dots ≤ 4 · numbered 5–8 · vertical > 8. Override via the `style` prop if a designer asks for a specific treatment.

## Don't
- Don't switch styles dynamically within a single wizard session — that's confusing. Pick at mount and stay.
