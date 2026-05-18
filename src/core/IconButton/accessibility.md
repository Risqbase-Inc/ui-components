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
