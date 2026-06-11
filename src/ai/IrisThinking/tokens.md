# Tokens — `IrisThinking`

| Token | Used for |
|---|---|
| `color.iris.thinking-outer` | outer arc — teal-300 |
| `color.iris.thinking-mid` | middle arc — teal-500 |
| `color.iris.thinking-inner` | inner arc — teal-700 |

Sizes: `sm` 24px · `md` 40px · `lg` 64px. Stroke scales with size (2 / 3 / 4px).

The rotation timing (2.4s / 1.8s / 1.4s) is defined as a CSS keyframe `iris-thinking-rotate` in the consumer Tailwind preset; reduced-motion override is `iris-thinking-pulse` (2s ease-in-out opacity 0.4 ↔ 1). The component adds the `iris-thinking-reduced` class when `useReducedMotion()` (from `MotionProvider`, DS v4.4 workstream E) resolves reduced; the `prefers-reduced-motion` media query remains the no-JS CSS fallback.
