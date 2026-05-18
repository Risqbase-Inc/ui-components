# Modal · Drawer · Sheet — accessibility

All three share the same overlay machinery (`Overlay.tsx`):

## Contracts
- `role="dialog"` + `aria-modal="true"` on the surface.
- Either `title` or `aria-label` must be set — `title` is preferred as it also serves as the visible heading and binds via `aria-labelledby`.
- Focus moves into the surface on mount (first focusable, falling back to the surface itself with `tabIndex={-1}`).
- Tab cycles within the surface; Shift+Tab cycles backwards. The first focusable comes after the last via Tab; the last comes before the first via Shift+Tab.
- Esc closes the overlay (`dismissOnEsc`, default true).
- Backdrop click closes the overlay (`dismissOnBackdrop`, default true).
- `inert` is applied to all `<body>` sibling elements while the overlay is open — assistive tech sees only the overlay tree.
- On unmount, focus is restored to the element that opened the overlay (`document.activeElement` snapshot taken in the effect).

## Don't
- Don't nest a `Modal` inside another `Modal` while leaving `inertBackground={true}` on the inner one — that nukes the outer's interactivity. Pass `inertBackground={false}` for inner overlays.
- Don't rely on the backdrop click as the only dismiss path — keyboard users need Esc, and screen-reader users need a focusable close control inside the surface.
