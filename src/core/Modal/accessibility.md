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
