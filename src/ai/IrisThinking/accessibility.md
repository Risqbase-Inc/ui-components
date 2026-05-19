# IrisThinking — accessibility

A motion glyph that signals "Iris is processing". Must not become an animation-only signal.

## Contracts
- `role="status"` + `aria-label="Thinking"` (overridable). The SVG itself is `aria-hidden="true"` — the wrapping `<span>` carries the announcement.
- Under `prefers-reduced-motion: reduce`, rotation stops; the arcs hold position and oscillate opacity instead (0.4 → 1.0 → 0.4, 2s ease-in-out). The label is unchanged.
- Pair with a polite live region (`aria-live="polite"` on the surrounding container) so screen-reader users hear *what* finished, not just that motion stopped.

## Don't
- Don't use this as the only signal of activity for keyboard users — pair with a visible label ("Iris is searching the Knowledge Bank…") so users with motion off still know what's happening.
