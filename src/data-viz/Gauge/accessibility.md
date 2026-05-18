# Gauge — accessibility

## Contracts
- Required `aria-label` — the gauge is a single visual unit, surfaced to assistive tech as `role="img"` with the consumer-provided name. Example: `"Residual risk 42 out of 100, inherent risk 78"`.
- The SVG is `aria-hidden="true"` — the wrapping `<span>` carries the name.
- The numeric label (when shown) uses `tabular-nums` so digits don't jiggle as the value animates.
- The arc transition is 300ms — slow enough to read, fast enough to feel responsive. Suppressed under `prefers-reduced-motion: reduce` via the consumer's Tailwind preset.
- Colour is the *visual* signal; the consumer-provided `aria-label` (or adjacent BandBadge) is the *semantic* signal. Don't encode the entire meaning in palette.

## Don't
- Don't use `palette="stone"` to indicate "good" — stone is the neutral comparator for dual-ring (inherent). Use `band-*` semantics in the surrounding label / chip.
