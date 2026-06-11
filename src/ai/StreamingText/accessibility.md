# StreamingText — accessibility

A streaming output region. Screen-reader behaviour is the hard problem — naive `aria-live` would re-read the entire growing string on every token.

## Contracts
- `aria-live="polite"` + `aria-atomic="false"` — assistive tech announces only the *new* nodes, not the full text. Modern screen readers handle incremental insertion gracefully under these settings.
- Streamhead cursor (`▍`) is `aria-hidden="true"`. It blinks at 1s `steps(2)` — under `prefers-reduced-motion: reduce`, the consumer Tailwind preset disables the blink.
- Cadence is constant (default 35 tok/s) — token-by-token visible delay does not change the announced sequence, only the visual pacing.
- Under reduced motion (`useReducedMotion()` from `MotionProvider`, DS v4.4 workstream E) all tokens are revealed immediately — no cadence interval — and the blinking cursor is not rendered. `onComplete` still fires exactly once.
- After completion, the final text remains in the DOM as plain wrapped `<span>` elements — addressable by tests, copyable, selectable.

## Pair with
- A surrounding container that swaps to a non-streaming `<p>` once `onComplete` fires — frees the live region, lets the page settle.
