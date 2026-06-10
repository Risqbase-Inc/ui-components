---
name: Toast
domain: core
layer: 1
state: stable
consumable: true
---

# Toast

Focus-aware positioner — the viewport places toasts in the quadrant *opposite* the currently focused element, avoiding covering keyboard focus (WCAG 2.4.11 Focus Not Obscured). v4.3 §5.1, closes RALIA F-054. Entrance: a subtle fade/slide via `animate-toast-enter` (keyframe defined centrally in the Tailwind preset, DS v4.4 workstream E), suppressed when `useReducedMotion()` resolves reduced; `motion-reduce:animate-none` stays on as the no-JS / no-provider CSS fallback.

```ts
import { Toast } from '@risqbase-inc/ui-components/core'
```

## API

- `type ToastIntent = 'info' | 'success' | 'warning' | 'danger'`
- `type ToastQuadrant = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`
### `ToastItem`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | yes |  |
| `intent` | `ToastIntent` | no |  |
| `title` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |
| `duration` | `number` | no | Auto-dismiss after N ms. Omit for sticky. |
| `action` | `{ label: string; onClick: () => void }` | no |  |

### `ToastProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `toast` | `ToastItem` | yes |  |
| `onDismiss` | `(id: string) => void` | yes |  |

### `ToastViewportProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `toasts` | `ToastItem[]` | yes |  |
| `onDismiss` | `(id: string) => void` | yes |  |
| `quadrant` | `ToastQuadrant` | no | Force a placement quadrant. By default the viewport places toasts opposite the focused-element quadrant (WCAG 2.4.11). |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `Toast` · `ToastViewport`

| Token | Used for |
|---|---|
| `color.surface.default` | toast surface background |
| `color.border.default` | surrounding border |
| `color.callout.{info,success,warning,danger}.border` | left accent bar |
| `color.callout.{info,success,warning,danger}.icon` | intent glyph |
| `color.text.default` | title |
| `color.text.subtle` | description, dismiss icon resting |
| `color.action.primary` | action label |
| `color.border.focus` | focus rings |
| `dimension.radius.md` | toast corners |
| `dimension.radius.sm` | inner control corners |

The entrance fade/slide is the `toast-enter` keyframe (`animate-toast-enter`, defined centrally in `tailwind.preset.js`, DS v4.4 workstream E). The class is omitted entirely when `useReducedMotion()` (from `MotionProvider`) resolves reduced; `motion-reduce:animate-none` is the no-JS / no-provider CSS fallback.

## Accessibility contract

# Toast · ToastViewport — accessibility

## Contracts
- `info` / `success` toasts use `role="status"` + `aria-live="polite"` — announced when the user is idle.
- `warning` / `danger` toasts use `role="alert"` + `aria-live="assertive"` — interrupt the current announcement.
- The dismiss button is a real `<button>` with `aria-label="Dismiss notification"` and a 24×24 hit target.
- Optional action button is a real `<button>` (not a styled `<div>`) — keyboard reachable.
- Auto-dismiss (`duration`) is opt-in. Sticky toasts (no duration) require the user to dismiss — appropriate for `danger`.
- Focus-aware positioner: `ToastViewport` watches `focusin` and places the toast stack in the quadrant opposite the focused element. This satisfies WCAG 2.4.11 Focus Not Obscured (Minimum, AA in WCAG 2.2).
- Entrance animation (subtle fade/slide, `animate-toast-enter`) is suppressed under reduced motion — `useReducedMotion()` from `MotionProvider` (DS v4.4 workstream E), with `motion-reduce:animate-none` as the no-JS CSS fallback. The toast appears instantly; announcement behaviour is unchanged.

## Don't
- Don't auto-dismiss `danger` toasts. The user needs to acknowledge.
- Don't stack more than ~3 toasts. Beyond that, switch to a notifications panel.
