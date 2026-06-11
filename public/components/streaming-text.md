---
name: StreamingText
domain: ai
layer: 2
state: stable
consumable: true
---

# StreamingText

Constant cadence (default 35 tok/s). Renders tokens incrementally so the final text stays addressable by tests / screen readers — there's no per-character DOM churn. Under reduced motion (DS v4.4 workstream E) all tokens reveal immediately — no cadence interval, no blinking cursor — and `onComplete` still fires exactly once. v4.3 §5.2, closes O-006.

```ts
import { StreamingText } from '@risqbase-inc/ui-components/ai'
```

## API

### `StreamingTextProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `tokens` | `ReactNode[]` | yes | Token sequence (strings or React nodes). The component reveals them one at a time. |
| `cadence` | `number` | no | Tokens per second. v4.3 default: 35. |
| `showCursor` | `boolean` | no | Show the blinking streamhead cursor while streaming. Default true. |
| `onComplete` | `() => void` | no | Called when the last token has been revealed. |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `StreamingText`

| Token | Used for |
|---|---|
| `color.iris.streamhead` | blinking cursor colour |

Inherits text colour from its container — by design, the streaming text should match the surrounding `prose` styling.

Under reduced motion (`useReducedMotion()` from `MotionProvider`, DS v4.4 workstream E) the cursor is not rendered and tokens reveal immediately — `color.iris.streamhead` is unused in that mode.

## Accessibility contract

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
