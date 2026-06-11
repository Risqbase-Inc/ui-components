# Tokens — `Toast` · `ToastViewport`

| Token | Used for |
|---|---|
| `color.surface.default` | toast surface background |
| `color.border.default` | surrounding border |
| `color.callout.{info,success,warning,danger}.border` | left accent bar |
| `color.callout.{info,success,warning,danger}.icon` | intent glyph |
| `color.text.default` | title |
| `color.text.subtle` | description, dismiss icon resting |
| `color.action.primary` | action label |
| `color.border.focus` | focus rings |
| `dimension.radius.md` | toast corners |
| `dimension.radius.sm` | inner control corners |

The entrance fade/slide is the `toast-enter` keyframe (`animate-toast-enter`, defined centrally in `tailwind.preset.js`, DS v4.4 workstream E). The class is omitted entirely when `useReducedMotion()` (from `MotionProvider`) resolves reduced; `motion-reduce:animate-none` is the no-JS / no-provider CSS fallback.
