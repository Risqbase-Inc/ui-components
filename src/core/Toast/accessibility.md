# Toast · ToastViewport — accessibility

## Contracts
- `info` / `success` toasts use `role="status"` + `aria-live="polite"` — announced when the user is idle.
- `warning` / `danger` toasts use `role="alert"` + `aria-live="assertive"` — interrupt the current announcement.
- The dismiss button is a real `<button>` with `aria-label="Dismiss notification"` and a 24×24 hit target.
- Optional action button is a real `<button>` (not a styled `<div>`) — keyboard reachable.
- Auto-dismiss (`duration`) is opt-in. Sticky toasts (no duration) require the user to dismiss — appropriate for `danger`.
- Focus-aware positioner: `ToastViewport` watches `focusin` and places the toast stack in the quadrant opposite the focused element. This satisfies WCAG 2.4.11 Focus Not Obscured (Minimum, AA in WCAG 2.2).

## Don't
- Don't auto-dismiss `danger` toasts. The user needs to acknowledge.
- Don't stack more than ~3 toasts. Beyond that, switch to a notifications panel.
