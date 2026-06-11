---
name: Modal
domain: core
layer: 1
state: stable
consumable: true
---

# Modal

v4.3 §5.1, closes RALIA F-046. Backed by `@radix-ui/react-dialog` — Radix handles focus trap, focus restoration, scroll-locking, ARIA wiring, and `inert` for siblings. We keep our own `Modal` / `Drawer` / `Sheet` API surface as the public contract; the Radix dependency is implementation detail (one peer upgrade and we still expose `open` / `onClose` / `title`).

```ts
import { Modal } from '@risqbase-inc/ui-components/core'
```

## API

### `BaseOverlayProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `open` | `boolean` | yes |  |
| `onClose` | `() => void` | yes |  |
| `title` | `ReactNode` | no | Accessible name for the dialog. Either `title` or `aria-label` is required. |
| `aria-label` | `string` | no |  |
| `children` | `ReactNode` | yes |  |
| `dismissOnBackdrop` | `boolean` | no | Close on backdrop click. Default true. |
| `dismissOnEsc` | `boolean` | no | Close on Esc. Default true. |
| `className` | `string` | no |  |

- `type ModalSize = 'sm' | 'md' | 'lg' | 'xl'`
### `ModalProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `size` | `ModalSize` | no |  |

- `type DrawerSide = 'left' | 'right'`
### `DrawerProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `side` | `DrawerSide` | no |  |

- `type SheetProps = BaseOverlayProps`

Composes with: TelemetryBeacon

## Token chain

# Tokens — `Modal` · `Drawer` · `Sheet`

| Token | Used for |
|---|---|
| `color.surface.default` | overlay surface background |
| `color.text.default` | title colour |
| `dimension.radius.card.default` | Modal corners, Sheet top corners |

The scrim is a fixed `rgba(0, 0, 0, 0.5)` overlay — not tokenised in v4.3 (deliberate; the scrim colour doesn't theme with the rest of the system because it's a layer between themes). Revisit in v4.4 alongside the dark-mode theme stub.

The slide-in animation references `slide-in-from-right` / `slide-in-from-left` Tailwind utilities — wire these via your Tailwind config if the consumer site doesn't ship `tailwindcss-animate`.

## Accessibility contract

# Modal · Drawer · Sheet — accessibility

Backed by `@radix-ui/react-dialog` since v4.3. Our `Modal` / `Drawer` / `Sheet` wrappers preserve the public API while delegating focus trap, focus restoration, `inert` siblings, scroll-lock, and ARIA wiring to Radix.

## Contracts (delivered by Radix)
- `role="dialog"` + `aria-modal="true"` on the surface (`Dialog.Content`).
- `aria-labelledby` bound to `Dialog.Title` when `title` is set; otherwise the `aria-label` prop populates a visually-hidden `Dialog.Title` so screen readers still get a name.
- Focus moves into the surface on open (Radix picks the first focusable; falls back to the surface itself).
- Tab cycles within the surface; Shift+Tab cycles backwards. Sentinel nodes at both ends keep focus trapped.
- Esc closes the overlay (`dismissOnEsc`, default true). Set `dismissOnEsc={false}` to suppress.
- Backdrop click closes the overlay (`dismissOnBackdrop`, default true). Set `dismissOnBackdrop={false}` to suppress.
- Pointer events on background siblings are suppressed by Radix while open; the page behind is unscrollable.
- On close, focus is restored to the element that triggered the open. (Snapshot is Radix's responsibility — don't manage `lastFocused` manually.)

## Don't
- Don't render `<Dialog.Trigger>` outside this wrapper — the public API is `open` + `onClose`. The "trigger" lives in the consumer's React tree, and toggles state.
- Don't put another `Modal` inside a `Modal` unless you actually need stacked dialogs. Radix supports nesting, but UX usually doesn't.
- Don't rely on the backdrop click as the only dismiss path. Keyboard users need Esc (default on); screen-reader users need a focusable close control inside the surface (the spec calls for an `IconButton` close — pass one in).
