# IrisThinking — accessibility

A motion glyph that signals "Iris is processing". Must not become an animation-only signal.

## Contracts
- `role="status"` + `aria-label="Thinking"` (overridable). The SVG itself is `aria-hidden="true"` — the wrapping `<span>` carries the announcement.
- Under reduced motion — `useReducedMotion()` from `MotionProvider` (user override → OS signal; DS v4.4 workstream E) adds the `iris-thinking-reduced` class, with `prefers-reduced-motion: reduce` as the no-JS CSS fallback — rotation stops; the arcs hold position and oscillate opacity instead (0.4 → 1.0 → 0.4, 2s ease-in-out). All arcs keep rendering; the label is unchanged.
- Pair with a polite live region (`aria-live="polite"` on the surrounding container) so screen-reader users hear *what* finished, not just that motion stopped.

## Iris contrast contract (DS v4.3 §4.2)

The arcs use `iris.thinking-{outer,mid,inner}` (teal-300 / 500 / 700), all of which pass AA Non-Text against the surrounding surface. Arc strokes are non-text by WCAG definition — the 3:1 floor applies.

If a consumer wraps `IrisThinking` in a *labelled* container that uses `iris.accent` (teal-600) as a background — e.g. a status pill that says "Iris · thinking…" — the label text must follow the §4.2 contract:

- Use `iris.accent-on` (white) only at ≥18.66 px bold / ≥24 px regular (AA Large).
- Otherwise use `iris.accent-on-dark` (stone-900) — ≈4.67:1, clears AA Normal.

Scanner rule R11 enforces this in consumer scanners (`scripts/scanner-rules/r11-iris-accent-on.mjs` in this package is the canonical detection — see [`docs/design-system/v4.3/scanner-rule-r11.md`](../../../docs/design-system/v4.3/scanner-rule-r11.md)).

## Don't
- Don't use this as the only signal of activity for keyboard users — pair with a visible label ("Iris is searching the Knowledge Bank…") so users with motion off still know what's happening.
- Don't put body-sized white text on an `iris.accent` surface — even adjacent to an `IrisThinking`. Use `iris.accent-on-dark` or move the label to an `iris.surface` ground.
