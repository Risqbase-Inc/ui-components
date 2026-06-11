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
