---
name: MotionProvider
domain: core
layer: 1
state: beta
consumable: true
---

# MotionProvider

`storage` events only fire in *other* tabs, so `setMotionPreference` dispatches this on the current window after every write.

```ts
import { MotionProvider } from '@risqbase-inc/ui-components/core'
```

## API

- `type MotionPreference = 'full' | 'reduced'`
### `MotionProviderProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `children` | `ReactNode` | yes |  |
| `forcedPreference` | `MotionPreference` | no | Pin the resolved preference, bypassing localStorage and the `prefers-reduced-motion` media query entirely. Stories and tests only — product code must let the documented resolution order (user choice → OS signal → full motion) decide. |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `MotionProvider` · promotion: `beta`

This component consumes **no color or dimension tokens**. It is a
behavioural primitive: it resolves the active motion preference and
exposes it to components (via `useReducedMotion()`) and to CSS (via the
`data-motion` attribute).

## CSS contract — `data-motion`

The provider renders its children inside a `display: contents` wrapper
carrying `data-motion`:

| Attribute value | Meaning |
|---|---|
| `data-motion="full"` | Full motion language — shimmer, rotation, cadence, entrance transitions |
| `data-motion="reduced"` | Reduced variant — static fills, opacity pulses, instant reveals |

Animated CSS in component code must be gated on `[data-motion]` or
`prefers-reduced-motion` (scanner rule **R13**, DS v4.4 §9). Example:

```css
[data-motion='reduced'] .my-animated-thing {
  animation: none;
}
```

## Persistence

| Key | Values |
|---|---|
| `localStorage["risqbase:motion"]` (`MOTION_STORAGE_KEY`) | `full` \| `reduced` — absent means "follow the OS `prefers-reduced-motion` signal" |

Resolution order: explicit user choice (localStorage) → `prefers-reduced-motion: reduce` → full motion.

## Accessibility contract

# MotionProvider — accessibility

The motion-preference primitive for the whole system (DS v4.4 D-110).
Vestibular disorders, migraine triggers, and attention conditions make
decorative motion actively harmful for some users — this provider makes
honouring that preference a single wrap instead of 25 per-component
checks.

## WCAG mapping

- **2.3.3 Motion Animation from Interactions (AAA)** — all
  interaction-triggered, non-essential animation in DS primitives can be
  disabled. With a `<MotionProvider>` mounted, `useReducedMotion()`
  drives Skeleton (static fill), IrisThinking (hold + opacity pulse),
  StreamingText (instant reveal, no cursor), and Toast (no entrance
  animation). Without a provider, the `motion-reduce:` Tailwind variants
  and the hook's own `prefers-reduced-motion` fallback keep the same
  guarantee for OS-level signals.
- **2.2.2 Pause, Stop, Hide (A)** — reduced mode removes the
  moving/blinking content (shimmer, streamhead cursor) rather than
  merely slowing it.

## Resolution order

1. **Explicit user choice** — `localStorage["risqbase:motion"]`
   (`'full' | 'reduced'`), set via `setMotionPreference()`. A user may
   opt *into* full motion on an OS that requests reduced, or reduce
   motion where the OS has no signal. The override is always an explicit
   user action — see the anti-patterns in
   `docs/recipes/motion-preference.md`.
2. **OS signal** — `prefers-reduced-motion: reduce`.
3. **Default** — full motion.

## Contracts

- The wrapper element is `display: contents` — it adds no box, no
  layout shift, no semantics. `data-motion` is purely a CSS hook.
- SSR renders `data-motion="full"` / `useReducedMotion() === false`;
  the client re-resolves before paint of the hydrated tree via
  `useSyncExternalStore`.
- "Reduced" never means "information removed" — every animated
  primitive keeps its content and its ARIA contract (e.g. IrisThinking
  keeps `role="status"`, StreamingText still announces tokens via its
  polite live region).

## Don't

- Don't ship a motion toggle that only affects some components — wrap
  the app root so the preference is global.
- Don't override an OS reduce-motion signal silently. Only an explicit,
  labelled user control may call `setMotionPreference('full')`.
