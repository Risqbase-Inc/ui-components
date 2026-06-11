---
name: ClientScopeBanner
domain: ai
layer: 2
state: stable
consumable: true
---

# ClientScopeBanner

Persistent below-header strip on every Practice route — surfaces the tenant-isolation artefact as a permanent UI element. v4.3 §5.2, closes RALIA F-043.

```ts
import { ClientScopeBanner } from '@risqbase-inc/ui-components/ai'
```

## API

- `type ClientScopeState = 'workspace' | 'client' | 'white-label' | 'switching'`
### `ClientScopeBannerProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `state` | `ClientScopeState` | yes |  |
| `client` | `string` | no | When `state === 'client'`, the active client name. |
| `isolationVerifiedAt` | `string` | no | ISO timestamp of the most recent tenant-isolation verification. |
| `onSwitch` | `() => void` | no | Optional handler when the user clicks "Switch". |
| `onDetails` | `() => void` | no | Optional secondary action (e.g. open isolation report). |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `ClientScopeBanner`

| State | Background | Border |
|---|---|---|
| `workspace` | `surface.subtle` | `border.default` |
| `client` | `iris.surface` (teal-50) | `iris.accent` |
| `white-label` | `surface.subtle` | `iris.accent` |
| `switching` | `surface.muted` | `border.default` |

Shared:

| Token | Used for |
|---|---|
| `color.text.default` | label |
| `color.text.subtle` | verified-timestamp suffix |
| `color.action.primary` | Switch / Details actions |
| `color.border.focus` | focus rings |
| `dimension.radius.sm` | inner control rings |

## Accessibility contract

# ClientScopeBanner — accessibility

A persistent landmark below the header on every Practice route. Always visible — never hidden under "Settings".

## Contracts
- `role="region"` + `aria-label="Active scope"` — addressable as a landmark by screen-reader users.
- The shield glyph is `aria-hidden="true"`; meaning lives in the state label ("Workspace view" / "Client scope" / etc.) and the verified-timestamp suffix.
- When the scope changes mid-session (state transition workspace → client), the host page should announce the change via a polite live region elsewhere — the banner itself is a static landmark, not a notifier.
- "Switch" / "Details" are real `<button>` elements with focus rings.

## Don't
- Don't conditionally hide this on mobile to save vertical space. Tenant isolation is a safety surface; if vertical space is tight, condense (state + client only).
